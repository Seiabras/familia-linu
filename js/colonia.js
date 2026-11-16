/* A Colônia do Linu (protótipo de 16/11/2026): a cena da colônia, o montar do pinguim e o mural.
   O mural ainda não tem servidor: guarda no localStorage deste navegador (o aviso na página diz isso). Quando a série
   for aprovada, o mural passa a um serviço da família com moderação (ver instagram/colonia/README.md).
   A contagem de seguidores também é de demonstração até a conta da LinuPedia ser ligada pela API do Instagram. */
(function () {
  "use strict";
  var P = window.ColoniaPinguim;
  if (!P) return;

  var SEGUIDORES_DEMONSTRACAO = 180;  // troca pelo número do perfil quando a contagem for ligada
  var CHAVE = "colonia-linu-mural";
  var menos = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- o mural guardado neste navegador
  function ler() {
    try { var l = JSON.parse(localStorage.getItem(CHAVE) || "[]"); return Array.isArray(l) ? l : []; }
    catch (e) { return []; }
  }
  function guardar(lista) {
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); return true; } catch (e) { return false; }
  }

  // ---------- filtro do apelido: só letras, números, espaço e uns sinais; sem link; sem palavrão comum
  var PROIBIDAS = ["porra", "caralho", "merda", "puta", "foda", "buceta", "cu ", "viado", "bosta", "piroca", "cacete", "arrombad", "fdp", "vtnc", "pqp"];
  function limpar(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function semAcento(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function problemaNoTexto(s, campo) {
    if (/(https?:|www\.|\.com|\.br)/i.test(s)) return campo + " não pode ter link.";
    if (!/^[\p{L}\p{N} .,'’\-]*$/u.test(s)) return campo + ": use só letras, números e espaços.";
    var t = " " + semAcento(s) + " ";
    for (var i = 0; i < PROIBIDAS.length; i++) if (t.indexOf(PROIBIDAS[i]) !== -1) return campo + ": escolha outro, por favor.";
    return null;
  }

  // ---------- desenhar um pinguim num canvas pequeno (13 × 12 na grade)
  function pinguimNoCanvas(canvas, m) {
    var g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    P.morador(g, 0, 0, m, 1);
  }

  // ---------- a cena da colônia
  var linuImg = new Image();
  linuImg.src = "img/mapa-linu/frente-1.png";
  var cenaCanvas = document.querySelector(".col-cena");

  function desenharCena() {
    if (!cenaCanvas) return;
    var caixa = cenaCanvas.parentElement.getBoundingClientRect().width || 340;
    var escala = caixa >= 940 ? 3 : 2;
    var W = Math.min(300, Math.floor((caixa - 12) / escala));
    var H = 150;
    cenaCanvas.width = W; cenaCanvas.height = H;
    cenaCanvas.style.width = W * escala + "px";
    cenaCanvas.style.height = H * escala + "px";
    var g = cenaCanvas.getContext("2d");
    g.imageSmoothingEnabled = false;
    var noite = document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var c = P.cena(g, W, H, { semente: 7, noite: noite });

    var mural = ler();
    var total = SEGUIDORES_DEMONSTRACAO + mural.length;
    // o Linu no centro, em 2×; os lugares em volta dele ficam livres
    var lx = c.centro[0] - 9, ly = c.centro[1] - 18;
    var livres = c.lugares.filter(function (l) { return !(l[0] + 12 > lx - 2 && l[0] < lx + 20 && l[1] + 12 > ly - 2 && l[1] < ly + 26); });
    var cabem = livres.length;
    // primeiro os pinguins com nome (os mais novos perto do Linu), depois os sem nome
    var todos = mural.slice().reverse().concat(new Array(Math.max(0, total - mural.length)).fill(null));
    var postos = [];
    for (var i = 0; i < Math.min(cabem, todos.length); i++) postos.push([livres[i], todos[i]]);
    postos.push([[lx, ly + 12], "linu"]);
    // de trás para a frente: quem está mais embaixo cobre quem está atrás
    postos.sort(function (a, b) { return a[0][1] - b[0][1]; });
    function pintar() {
      g.imageSmoothingEnabled = false;
      postos.forEach(function (p) {
        var l = p[0], m = p[1];
        if (m === "linu") { if (linuImg.naturalWidth) g.drawImage(linuImg, lx, ly, 18, 24); return; }
        if (l[4]) P.ninho(g, l[0], l[1]);
        P.morador(g, l[0], l[1], m ? { cachecol: m.cachecol, oficio: m.oficio } : null, 1, l[3]);
      });
    }
    if (linuImg.complete && linuImg.naturalWidth) pintar(); else linuImg.onload = pintar;

    var cont = document.querySelector("[data-contagem]");
    var nota = document.querySelector("[data-contagem-nota]");
    if (cont) cont.textContent = total.toLocaleString("pt-BR");
    if (nota) nota.textContent = "(número de demonstração; " + (total > cabem ? "nesta tela cabem " + cabem + ", o resto está na colônia inteira)" : "todos aparecem na cena)");
  }

  // ---------- o formulário
  var form = document.querySelector("[data-form]");
  var previa = document.querySelector("[data-previa]");
  var cores = document.querySelector("[data-cores]");
  var oficios = document.querySelector("[data-oficios]");
  var erro = document.querySelector("[data-erro]");

  P.CACHECOIS.forEach(function (c, i) {
    var l = document.createElement("label");
    l.className = "col-cor";
    l.style.background = c[2];
    l.title = c[1];
    var r = document.createElement("input");
    r.type = "radio"; r.name = "cachecol"; r.value = c[0]; r.setAttribute("aria-label", c[1]);
    if (i === 0) r.checked = true;
    l.appendChild(r);
    cores.appendChild(l);
  });
  P.OFICIOS.forEach(function (o) {
    var op = document.createElement("option");
    op.value = o[0]; op.textContent = o[1];
    oficios.appendChild(op);
  });

  function nomeDoOficio(id) {
    for (var i = 0; i < P.OFICIOS.length; i++) if (P.OFICIOS[i][0] === id) return P.OFICIOS[i][1];
    return "Morador(a)";
  }
  function atual() {
    var d = new FormData(form);
    return {
      apelido: limpar(d.get("apelido")),
      cachecol: d.get("cachecol") || "azul",
      oficio: d.get("oficio") || "morador",
      lugar: limpar(d.get("lugar")),
      arroba: limpar(d.get("arroba")).replace(/^@+/, "")
    };
  }
  function atualizarPrevia() {
    var m = atual();
    pinguimNoCanvas(previa, m);
    document.querySelector("[data-previa-nome]").textContent = m.apelido || "Seu pinguim";
    document.querySelector("[data-previa-oficio]").textContent = nomeDoOficio(m.oficio);
  }
  form.addEventListener("input", atualizarPrevia);
  form.addEventListener("change", atualizarPrevia);

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var m = atual();
    var problema = !m.apelido ? "Dê um apelido ao seu pinguim." :
      problemaNoTexto(m.apelido, "Apelido") || (m.lugar && problemaNoTexto(m.lugar, "Lugar")) ||
      (m.arroba && !/^[A-Za-z0-9._]{1,30}$/.test(m.arroba) ? "O @ tem só letras, números, ponto e sublinhado." : null);
    if (problema) { erro.textContent = problema; erro.hidden = false; return; }
    erro.hidden = true;
    var lista = ler();
    lista.push({ apelido: m.apelido, cachecol: m.cachecol, oficio: m.oficio, lugar: m.lugar, arroba: m.arroba, quando: Date.now() });
    guardar(lista);
    form.reset();
    atualizarPrevia();
    desenharMural();
    desenharCena();
    var mural = document.querySelector("[data-mural]");
    mural.scrollIntoView({ behavior: menos.matches ? "auto" : "smooth", block: "start" });
  });

  // ---------- o mural
  function desenharMural() {
    var ul = document.querySelector("[data-mural]");
    var lista = ler();
    ul.textContent = "";
    lista.slice().reverse().forEach(function (m) {
      var li = document.createElement("li");
      var c = document.createElement("canvas");
      c.width = 13; c.height = 12; c.className = "pixel";
      c.setAttribute("aria-hidden", "true");
      pinguimNoCanvas(c, m);
      var b = document.createElement("b"); b.textContent = m.apelido;
      var s = document.createElement("span"); s.textContent = nomeDoOficio(m.oficio) + (m.lugar ? " · " + m.lugar : "");
      li.appendChild(c); li.appendChild(b); li.appendChild(s);
      if (m.arroba) { var a = document.createElement("span"); a.textContent = "@" + m.arroba; li.appendChild(a); }
      ul.appendChild(li);
    });
    document.querySelector("[data-vazio]").hidden = lista.length > 0;
  }

  atualizarPrevia();
  desenharMural();
  desenharCena();
  var espera;
  window.addEventListener("resize", function () { clearTimeout(espera); espera = setTimeout(desenharCena, 150); });
  new MutationObserver(desenharCena).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
