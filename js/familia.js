/* Família Linu (07/11/2026): o botão do tema, o copiar das cores (na página da identidade), a placa de baixo do celular, as entradas ao rolar e o formulário do contato (11/11/2026).
   Tudo funciona sem JavaScript, menos o tema, o copiar e a placa de baixo do celular. */
(function () {
  "use strict";
  var raiz = document.documentElement;
  var menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* 1. Tema: sem escolha, segue o sistema; o botão alterna e guarda. O mapa troca de dia para noite junto (só CSS). */
  var botaoTema = document.querySelector("[data-tema]");
  var sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");
  function escuroAgora() { return raiz.dataset.theme ? raiz.dataset.theme === "dark" : sistemaEscuro.matches; }
  function rotularTema() {
    var escuro = escuroAgora();
    botaoTema.setAttribute("aria-label", escuro ? "Mudar para o modo claro" : "Mudar para o modo escuro");
    botaoTema.title = escuro ? "Modo claro" : "Modo escuro";
  }
  botaoTema.addEventListener("click", function () {
    raiz.dataset.theme = escuroAgora() ? "light" : "dark";
    guardar("tema", raiz.dataset.theme);
    rotularTema();
  });
  sistemaEscuro.addEventListener("change", rotularTema);
  rotularTema();

  /* 2. Identidade: tocar numa cor copia o código */
  var copiado = document.querySelector("[data-copiado]");
  var limparAviso;
  document.querySelectorAll("[data-copiar]").forEach(function (b) {
    b.addEventListener("click", function () {
      var codigo = b.dataset.copiar;
      function avisar(ok) {
        copiado.textContent = ok ? codigo + " copiado." : "Copie à mão: " + codigo;
        clearTimeout(limparAviso);
        limparAviso = setTimeout(function () { copiado.textContent = ""; }, 2500);
      }
      if (navigator.clipboard) navigator.clipboard.writeText(codigo).then(function () { avisar(true); }, function () { avisar(false); });
      else avisar(false);
    });
  });

  /* 3. Celular: a placa de baixo. O botão abre o menu, que sobe de baixo (o CSS faz a placa só abaixo de 700 px), e
        mostra o nome da parte da carta que está na tela; a placa some quando o contato ou o rodapé aparecem. */
  var barra = document.querySelector("[data-barra]");
  var links = document.getElementById("menu-links");
  if (barra && links) {
    barra.hidden = false;
    var botaoMenu = barra.querySelector("[data-menu]");
    var nomeParte = barra.querySelector("[data-barra-nome]");
    var abrirMenu = function (sim) {
      links.classList.toggle("aberto", sim);
      botaoMenu.setAttribute("aria-expanded", String(sim));
    };
    botaoMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      abrirMenu(!links.classList.contains("aberto"));
    });
    links.addEventListener("click", function (e) { if (e.target.closest("a")) abrirMenu(false); });
    document.addEventListener("click", function (e) { if (!links.contains(e.target)) abrirMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("aberto")) { abrirMenu(false); botaoMenu.focus(); }
    });
    if ("IntersectionObserver" in window) {
      var parte = new IntersectionObserver(function (itens) {
        itens.forEach(function (i) {
          if (!i.isIntersecting) return;
          var h2 = i.target.querySelector("h2");
          nomeParte.textContent = i.target.dataset.barraTitulo || (h2 ? h2.textContent : "");
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      document.querySelectorAll("main > section").forEach(function (s) { parte.observe(s); });
      var fim = document.querySelectorAll("#contato, .rodape");
      var vistos = 0;
      var noFim = new IntersectionObserver(function (itens) {
        itens.forEach(function (i) { i.target.__visto = i.isIntersecting; });
        vistos = 0;
        fim.forEach(function (f) { if (f.__visto) vistos++; });
        barra.classList.toggle("escondida", vistos > 0);
        if (vistos) abrirMenu(false);
      });
      fim.forEach(function (f) { noFim.observe(f); });
    }
  }

  /* 4. Entradas ao rolar: js/movimento.js (o kit do linuarquivos), pelos atributos data-mov do index.html */

  /* 5. O formulário do contato (11/11/2026): validação na hora, o que foi digitado não se perde ao recarregar, e o
        envio vai para /api/pedido (chega no e-mail da família e no /admin). O WhatsApp abre com a mensagem pronta. */
  var form = document.querySelector("[data-contato]");
  if (form) {
    var ler = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
    var campo = function (k) { return form.querySelector("#" + k); };
    var regras = {
      nome: [function (v) { return v.length >= 2; }, "Escreva o seu nome."],
      email: [function (v) { return EMAIL.test(v); }, "Escreva um e-mail válido, como nome@exemplo.com."],
      mensagem: [function (v) { return v.length >= 2; }, "Conte em uma frase o que você quer."]
    };
    var conferir = function (k, mostrar) {
      var ok = regras[k][0](campo(k).value.trim());
      if (mostrar || ok) {
        form.querySelector("#" + k + "-erro").textContent = ok ? "" : regras[k][1];
        campo(k).setAttribute("aria-invalid", String(!ok));
      }
      return ok;
    };
    var whats = form.querySelector("[data-whats]");
    var enviar = form.querySelector("[data-enviar]");
    var estado = form.querySelector("[data-status]");
    var texto = function () {
      var p = ["Olá, Família Linu!"];
      if (campo("nome").value.trim()) p.push("Nome: " + campo("nome").value.trim());
      if (campo("negocio").value.trim()) p.push("Negócio: " + campo("negocio").value.trim());
      p.push(campo("mensagem").value.trim() || "Quero conversar sobre o meu negócio.");
      return p.join("\n");
    };
    var escrever = function () { whats.href = "https://wa.me/5524981013398?text=" + encodeURIComponent(texto()); };
    ["nome", "email", "negocio", "mensagem"].forEach(function (k) {
      var v = ler("familia-" + k);
      if (v) campo(k).value = v;
      campo(k).addEventListener("input", function () { guardar("familia-" + k, campo(k).value); if (regras[k]) conferir(k, false); escrever(); });
      if (regras[k]) campo(k).addEventListener("blur", function () { if (campo(k).value) conferir(k, true); });
    });
    escrever();
    var dados = function (canal) {
      var robo = form.querySelector('[name="site_extra"]');
      return { nome: campo("nome").value.trim(), email: campo("email").value.trim(), negocio: campo("negocio").value.trim(),
        mensagem: campo("mensagem").value.trim(), canal: canal, site_extra: robo ? robo.value : "" };
    };
    // o WhatsApp também fica registrado (sem esperar resposta: não atrasa a conversa)
    whats.addEventListener("click", function (e) {
      if (!conferir("nome", true)) { e.preventDefault(); campo("nome").focus(); return; }
      try {
        var d = dados("whatsapp");
        if (!d.negocio) d.negocio = "(não disse)";
        if (navigator.sendBeacon) navigator.sendBeacon("/api/pedido", new Blob([JSON.stringify(d)], { type: "application/json" }));
      } catch (err) {}
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = conferir("nome", true) & conferir("email", true) & conferir("mensagem", true);
      if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
      enviar.disabled = true;
      enviar.textContent = "Enviando…";
      estado.className = "formulario-status campo-largo";
      estado.textContent = "";
      fetch("/api/pedido", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(dados("formulario")) })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          enviar.textContent = "Enviado";
          estado.className = "formulario-status campo-largo ok";
          estado.textContent = "Recebido! A resposta chega no seu e-mail (" + campo("email").value.trim() + ") em até 1 dia útil.";
          setTimeout(function () { enviar.disabled = false; enviar.textContent = "Enviar pelo formulário"; }, 4000);
        })
        .catch(function () {
          enviar.disabled = false;
          enviar.textContent = "Enviar pelo formulário";
          estado.className = "formulario-status campo-largo erro";
          estado.textContent = "Não deu para enviar agora. Tente de novo em instantes ou mande pelo WhatsApp.";
        });
    });
  }
})();
