/* Família Linu (07/11/2026): o botão do tema, o copiar das cores (na página da identidade) e as entradas ao rolar.
   Tudo funciona sem JavaScript, menos o tema e o copiar. */
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

  /* 3. Entradas ao rolar: um observer só, uma vez por elemento; o que já está na tela não é escondido */
  if ("IntersectionObserver" in window && !menosMovimento.matches) {
    var alvos = document.querySelectorAll(".secao h2, .secao-sub, .casos li, .rota, .passos li, .ilha");
    var vistos = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        if (!item.isIntersecting) return;
        item.target.classList.remove("antes");
        vistos.unobserve(item.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    var altura = window.innerHeight;
    alvos.forEach(function (el) {
      if (el.getBoundingClientRect().top < altura) return;
      var posicao = Array.prototype.indexOf.call(el.parentElement.children, el) % 6;
      el.style.setProperty("--atraso", posicao * 50 + "ms");
      el.classList.add("antes");
      vistos.observe(el);
    });
  }
})();
