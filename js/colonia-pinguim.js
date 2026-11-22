/* A Colônia do Linu (protótipo de 16/11/2026): o desenho de um morador da colônia e da cena da colônia em pixel art.
   Usado pela página /colonia (js/colonia.js) e pela capa dos episódios (ferramentas/instagram/colonia.mjs), para os
   dois saírem iguais.

   O morador é um pinguim-de-barbicha na mesma grade do Linu do mapa (9 × 12, img/mapa-linu/frente-1.png), com as
   mesmas cores de corpo. O que muda de um para outro é o cachecol (a cor que a pessoa escolhe) e o objeto do ofício,
   ao lado. Nada na cabeça: no Instagram da LinuPedia o Linu é o único com acessório e aparece maior (2×), e os
   moradores ficam em 1× (instagram/DESIGN.md, “Pinguins”). */
(function (raiz) {
  "use strict";

  // a grade do Linu do mapa, com o cachecol (S) no lugar do peito de cima
  var MOLDE = [
    "...AAA...",
    "..ABBBA..",
    ".ABCCCBA.",
    ".ACDCDCA.",
    ".ABCECBA.",
    "ABBCFCBBA",
    "ABSSSSSBA",
    "ABCCSCCBA",
    ".ACCCCCA.",
    ".AGCCCGA.",
    "..AGGGA..",
    ".EE...EE."
  ];
  // de lado (a partir do direita-1 do Linu); para a esquerda, o mesmo desenho espelhado
  var MOLDE_LADO = [
    "..AAAA...",
    ".ABBBBA..",
    ".ABBCCA..",
    ".ABBCDCA.",
    ".ABBCCEE.",
    "ABBBCCFA.",
    "ABBBSSSA.",
    "ABBBCSCA.",
    ".ABBCCCA.",
    ".ABGCCGA.",
    "..AAAAA..",
    "..EE.EE.."
  ];
  var CORPO = { A: "#20232C", B: "#3B4048", C: "#FFFFFF", D: "#000000", E: "#FF9B4C", F: "#CD5F30", G: "#BBCAD2" };

  // as cores do cachecol: tiradas da família (DESIGN.md e IDENTIDADE-LINU.md) e com contraste contra a neve e a pedra
  var CACHECOIS = [
    ["azul", "Azul do Linu", "#2563EB"],
    ["fogo", "Fogo", "#EA580C"],
    ["iglu", "Iglu", "#0E7490"],
    ["farol", "Farol", "#C81E1E"],
    ["marca", "Marca-texto", "#FDE047"],
    ["krill", "Krill", "#F472B6"],
    ["musgo", "Musgo", "#4D7C0F"],
    ["aurora", "Aurora", "#22C55E"]
  ];

  // os ofícios da colônia: cada um é um trabalho que os pinguins-de-barbicha fazem de verdade
  // (ninho de pedras, turnos no ovo, creche, mergulho atrás de krill, o grito alto; ROTEIRO.md, “Fatos”)
  var OFICIOS = [
    ["ninhos", "Construtor(a) de ninhos", "pedra"],
    ["krill", "Pescador(a) de krill", "krill"],
    ["guarda", "Guardiã(o) das pedras", "pedra2"],
    ["vigia", "Vigia do céu", "pena"],
    ["creche", "Babá da creche", "ovo"],
    ["mergulho", "Mergulhador(a)", "gota"],
    ["canto", "Cantor(a) da colônia", "nota"],
    ["morador", "Morador(a)", null]
  ];

  // o objeto do ofício, 3 × 3, desenhado ao lado da asa direita
  var OBJETOS = {
    pedra: ["...", ".gg", "ggh"],
    pedra2: [".g.", "ggh", "ghh"],
    krill: ["k..", ".kk", "..k"],
    pena: ["..w", ".w.", "w.."],
    ovo: [".o.", "ooo", "ooo"],
    gota: [".b.", "bbb", ".b."],
    nota: [".nn", ".n.", "nn."]
  };
  var COR_OBJETO = { g: "#8A94A6", h: "#5B6474", k: "#F472B6", w: "#F4FBFF", o: "#F3EAD3", b: "#3D8CC6", n: "#1F2A44" };

  function corDoCachecol(id) {
    for (var i = 0; i < CACHECOIS.length; i++) if (CACHECOIS[i][0] === id) return CACHECOIS[i][2];
    return null;
  }
  function objetoDoOficio(id) {
    for (var i = 0; i < OFICIOS.length; i++) if (OFICIOS[i][0] === id) return OFICIOS[i][2];
    return null;
  }

  /** Desenha um morador com o canto de cima à esquerda em (x, y), em pixels da grade (escala 1).
      m = { cachecol: id ou null, oficio: id ou null }. Sem cachecol, o peito fica branco (o morador anônimo).
      lado: 0 de frente, 1 virado para a direita, -1 para a esquerda. */
  function morador(g, x, y, m, escala, lado) {
    var e = escala || 1;
    var molde = lado ? MOLDE_LADO : MOLDE;
    var cachecol = m && m.cachecol ? corDoCachecol(m.cachecol) : null;
    for (var yy = 0; yy < molde.length; yy++) {
      for (var xx = 0; xx < 9; xx++) {
        var k = molde[yy][lado === -1 ? 8 - xx : xx];
        if (k === ".") continue;
        var cor = k === "S" ? (cachecol || CORPO.C) : CORPO[k];
        g.fillStyle = cor;
        g.fillRect(x + xx * e, y + yy * e, e, e);
      }
    }
    var obj = m && m.oficio ? objetoDoOficio(m.oficio) : null;
    if (obj) {
      var o = OBJETOS[obj];
      for (var oy = 0; oy < 3; oy++) for (var ox = 0; ox < 3; ox++) {
        var c = o[oy][ox];
        if (c === ".") continue;
        g.fillStyle = COR_OBJETO[c];
        g.fillRect(x + (lado === -1 ? ox - 3 : 9 + ox) * e, y + (8 + oy) * e, e, e);
      }
    }
  }

  /** Um gerador de números com semente: a mesma colônia sai igual em toda visita e na capa. */
  function sorteio(semente) {
    var s = semente % 2147483647 || 1;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /** A cena da colônia numa grade W × H: céu em faixas, a geleira ao fundo, a ponta de pedra (onde os
      pinguins-de-barbicha fazem os ninhos) e o mar embaixo. Devolve a lista de lugares para os moradores,
      do mais perto do Linu para fora, para a colônia crescer a partir do centro. */
  function cena(g, W, H, opcoes) {
    var op = opcoes || {};
    var noite = !!op.noite;
    var px = function (x, y, w, h, cor) { g.fillStyle = cor; g.fillRect(x, y, w, h); };
    var r = sorteio(op.semente || 7);
    var ceu = noite ? ["#0B1A33", "#0E2140", "#12294D", "#17325A", "#1C3B66", "#224574"]
                    : ["#8CC6EA", "#9FD0EE", "#B3DAF2", "#C6E4F6", "#D8EDF9", "#E6F4FB"];
    var hCeu = Math.round(H * 0.34);
    var faixa = Math.ceil(hCeu / ceu.length);
    ceu.forEach(function (cor, i) { px(0, i * faixa, W, faixa, cor); });
    if (noite) {
      // a aurora (verde, só nas peças de noite) e estrelas
      for (var ax = 0; ax < W; ax++) {
        var ay = Math.round(hCeu * 0.28 + 6 * Math.sin(ax / 19) + 3 * Math.sin(ax / 7));
        px(ax, ay, 1, 3, "#22C55E"); px(ax, ay + 3, 1, 2, "#15803D");
      }
      for (var i = 0; i < W / 4; i++) px(Math.floor(r() * W), Math.floor(r() * hCeu * 0.9), 1, 1, r() < 0.3 ? "#FFFFFF" : "#A9D6EF");
    }
    if (!noite) {
      // nuvens em degraus e petréis
      var nuvem = function (nx, ny, nw) { px(nx + 4, ny, nw - 8, 3, "#F4FBFF"); px(nx, ny + 3, nw, 4, "#F4FBFF"); px(nx + 2, ny + 7, nw - 4, 1, "#C6E4F6"); };
      for (var k = 0; k < Math.max(2, Math.round(W / 70)); k++) nuvem(Math.floor(r() * (W - 40)), 4 + Math.floor(r() * (hCeu - 22)), 22 + Math.floor(r() * 24));
    }
    for (var a = 0; a < Math.max(2, Math.round(W / 60)); a++) {
      var ax2 = Math.floor(r() * (W - 6)), ay2 = 6 + Math.floor(r() * (hCeu - 16));
      var ave = noite ? "#A9D6EF" : "#1F4E7A";
      px(ax2, ay2, 2, 1, ave); px(ax2 + 2, ay2 + 1, 1, 1, ave); px(ax2 + 3, ay2, 2, 1, ave);
    }
    // a geleira ao fundo: borda em degraus de 3 px, neve em cima, parede com fendas
    var topoGelo = hCeu;
    var baseGelo = Math.round(H * 0.5);
    for (var x = 0; x < W; x++) {
      var y = topoGelo - (Math.floor((Math.sin(x / 23) + 1) * 2) * 3) + 3;
      px(x, y, 1, baseGelo - y, noite ? "#9CC3DC" : "#C4E6F6");
      px(x, y, 1, 4, noite ? "#DCEFF9" : "#F4FBFF");
      px(x, y, 1, 1, "#1F4E7A");
      if (x % 11 === 3) px(x, y + 6, 1, baseGelo - y - 9, noite ? "#6E9BBC" : "#8CC2E2");
    }
    px(0, baseGelo, W, 1, "#1F4E7A");
    // o mar: faixas do raso ao fundo, com marolas
    var mar = noite ? ["#24578C", "#1F4C7C", "#1A416C", "#15365C", "#112D4E"] : ["#4FA3D6", "#3D8CC6", "#3278B4", "#2A66A0", "#24578C"];
    var hMar = H - baseGelo - 1;
    mar.forEach(function (cor, i) { px(0, baseGelo + 1 + Math.floor(i * hMar / mar.length), W, Math.ceil(hMar / mar.length), cor); });
    for (var m = 0; m < W / 6; m++) px(Math.floor(r() * (W - 6)), baseGelo + 4 + Math.floor(r() * (hMar - 6)), 4, 1, noite ? "#3D6E9E" : "#7DBDE3");
    // a ponta de pedra: uma elipse em degraus, do pé da geleira até perto da borda de baixo
    var cx = W / 2, cy = baseGelo + hMar * 0.52, rx = W * 0.47, ry = hMar * 0.46;
    var pedra = noite ? ["#4A5160", "#3C4250", "#2E3440"] : ["#8A94A6", "#717B8D", "#5B6474"];
    for (var py = Math.floor(cy - ry); py <= cy + ry; py++) {
      var d = (py - cy) / ry;
      var meia = Math.floor(rx * Math.sqrt(Math.max(0, 1 - d * d)) / 2) * 2;
      if (meia <= 0) continue;
      px(Math.round(cx - meia), py, meia * 2, 1, pedra[0]);
      // a textura da pedra: manchas soltas, mais claras e mais escuras (nada de faixas, que parecem tábuas)
      for (var pxx = Math.round(cx - meia); pxx < cx + meia; pxx += 2) {
        var t = r();
        if (t < 0.18) px(pxx, py, 2, 1, pedra[1]);
        else if (t < 0.24) px(pxx, py, 1, 1, pedra[2]);
        else if (t > 0.95) px(pxx, py, 1, 1, noite ? "#5A6272" : "#A3ADBD");
      }
      px(Math.round(cx - meia) - 1, py, 1, 1, "#1F2A44");
      px(Math.round(cx + meia), py, 1, 1, "#1F2A44");
    }
    // espuma na volta da pedra e neve em manchas por cima
    for (var n = 0; n < W / 3; n++) {
      var ang = r() * Math.PI * 2;
      px(Math.round(cx + Math.cos(ang) * (rx + 1)), Math.round(cy + Math.sin(ang) * (ry + 1)), 2, 1, "#F4FBFF");
    }
    for (var s = 0; s < W / 8; s++) {
      var sx = cx + (r() - 0.5) * rx * 1.6, sy = cy + (r() - 0.5) * ry * 1.4;
      px(Math.round(sx), Math.round(sy), 3 + Math.floor(r() * 4), 1, noite ? "#B9D3E4" : "#F4FBFF");
    }
    // os lugares dos moradores: espalhados na pedra (sorteio com distância mínima), do centro para fora.
    // Cada lugar tem um lado para onde o pinguim olha e, às vezes, um ninho de pedras no pé.
    var lugares = [];
    for (var tent = 0; tent < 6000 && lugares.length < 900; tent++) {
      var tx = Math.floor(cx + (r() * 2 - 1) * rx), ty = Math.floor(cy + (r() * 2 - 1) * ry);
      var ddx = (tx + 4 - cx) / rx, ddy = (ty + 11 - cy) / ry;
      if (ddx * ddx + ddy * ddy > 0.82 || ty < cy - ry + 1) continue;
      var perto = false;
      for (var q = 0; q < lugares.length; q++) {
        if (Math.abs(lugares[q][0] - tx) < 8 && Math.abs(lugares[q][1] - ty) < 6) { perto = true; break; }
      }
      if (perto) continue;
      var sorteLado = r();
      lugares.push([tx, ty, ddx * ddx + ddy * ddy, sorteLado < 0.5 ? 0 : (sorteLado < 0.75 ? 1 : -1), r() < 0.3]);
    }
    lugares.sort(function (a, b) { return a[2] - b[2]; });
    return { lugares: lugares, centro: [Math.round(cx), Math.round(cy)] };
  }

  /** O ninho de pedras no pé de um pinguim (o pinguim-de-barbicha faz o ninho com pedrinhas). */
  function ninho(g, x, y) {
    var cores = ["#5B6474", "#B8C0CC", "#717B8D"];
    for (var i = -1; i < 10; i += 2) { g.fillStyle = cores[(i + 3) % 3]; g.fillRect(x + i, y + 11, 2, 1); }
    g.fillStyle = "#3C4250"; g.fillRect(x, y + 12, 9, 1);
  }

  raiz.ColoniaPinguim = { ninho: ninho, MOLDE: MOLDE, CACHECOIS: CACHECOIS, OFICIOS: OFICIOS, morador: morador, cena: cena, sorteio: sorteio };
})(typeof window !== "undefined" ? window : globalThis);
