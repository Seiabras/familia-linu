/* Família Linu (07/11/2026): o botão do tema, o copiar das cores (na página da identidade), a placa de baixo do celular e as entradas ao rolar.
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
})();
