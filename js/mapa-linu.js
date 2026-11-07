/* O Linu andando no mapa das ilhas (07/11/2026). Ele começa no cais; ao passar o mouse (ou o foco do teclado) no nome
   de uma ilha, ele vai até ela pelas pontes, pula as pedras e os blocos de gelo onde não há ponte, e fica lá olhando
   em volta. As rotas são os pontos dos pés na grade de cada mapa (384 × 216 no largo, 176 × 312 no alto): saem da
   praça na frente da casa da família; "p" no ponto quer dizer que ele chega ali pulando. A conferência das rotas por
   cima do mapa sai de ferramentas/rotas-do-linu.py.
   Com “menos movimento”, ele aparece direto na ilha, sem andar. O desenho é img/mapa-linu/ (9 × 12 na grade),
   posicionado em pixels inteiros da grade, como o resto do mapa. */
(function () {
  "use strict";
  var ROTAS = {
    largo: {
      grade: 384, casa: [193, 165], cais: [[194, 124], [178, 114]],
      r: {
        familia: [[200, 112]],
        sites: [[160, 96], [150, 90], [116, 72], [100, 66]],
        digital: [[232, 100], [247, 92], [284, 75], [298, 68]],
        farol: [[232, 100], [247, 92], [284, 75], [312, 72], [324, 78, "p"], [331, 86, "p"], [340, 92, "p"], [355, 106, "p"]],
        seguro: [[155, 118], [146, 129, "p"], [134, 133, "p"], [123, 139, "p"], [106, 147, "p"], [94, 162]],
        vaga1: [[155, 118], [146, 129, "p"], [134, 133, "p"], [123, 139, "p"], [106, 147, "p"], [106, 170], [62, 177],
                [38, 160], [42, 140], [56, 128], [46, 119], [36, 110]],
        pedia: [[194, 124], [206, 140], [234, 140, "p"], [250, 137], [268, 152, "p"], [290, 168]]
      }
    },
    alto: {
      grade: 176, casa: [88, 170], cais: [[88, 156]],
      r: {
        familia: [[87, 150]],
        digital: [[102, 142], [108, 128, "p"], [114, 116, "p"], [120, 104, "p"], [124, 90]],
        sites: [[102, 142], [108, 128, "p"], [114, 116, "p"], [120, 104, "p"], [110, 84], [100, 79], [77, 65], [58, 56]],
        vaga1: [[60, 153], [53, 140], [42, 125], [32, 116]],
        farol: [[118, 166], [128, 165, "p"], [138, 165, "p"], [152, 162, "p"], [162, 162]],
        seguro: [[66, 166], [56, 184], [50, 198], [56, 218]],
        pedia: [[66, 166], [56, 184], [50, 198], [56, 218], [72, 240], [96, 256], [112, 268]]
      }
    }
  };
  var VELOCIDADE = 45;      // pixels da grade por segundo; numa viagem longa, mais rápido (no máximo uns 4 s)
  var PASSO = 140;          // ms por quadro da caminhada
  var PULO = 320;           // ms de cada pulo
  var menos = window.matchMedia("(prefers-reduced-motion: reduce)");
  var QUADROS = ["frente-1", "frente-2", "direita-1", "direita-2", "esquerda-1", "esquerda-2"];
  QUADROS.forEach(function (q) { var i = new Image(); i.src = "img/mapa-linu/" + q + ".png"; });

  function ligar(tipo) {
    var caixa = document.querySelector(".mapa-" + tipo);
    if (!caixa) return;
    var R = ROTAS[tipo];
    var hub = R.cais[R.cais.length - 1];
    var linu = document.createElement("img");
    linu.className = "pixel mapa-linu";
    linu.src = "img/mapa-linu/frente-1.png";
    linu.alt = "";
    linu.width = 9; linu.height = 12;
    linu.setAttribute("aria-hidden", "true");
    caixa.insertBefore(linu, caixa.querySelector(".marcas"));

    var pos = { x: R.casa[0], y: R.casa[1] };
    var lugar = "casa", andando = false, pendente = null, olhar = null;

    function escala() { var w = caixa.querySelector(".mapa-dia").getBoundingClientRect().width; return w ? w / R.grade : 0; }
    function quadro(q) { var s = "img/mapa-linu/" + q + ".png"; if (linu.getAttribute("src") !== s) linu.setAttribute("src", s); }
    function pintar(alto) {
      var k = escala(); if (!k) return;
      var x = Math.round(pos.x) - 4, y = Math.round(pos.y) - 11 - Math.round(alto || 0);
      linu.style.translate = (x * k) + "px " + (y * k) + "px";
    }

    // os pontos a partir da praça até um lugar, cada um dizendo se chega pulando
    function ida(nome) {
      if (nome === "casa") return R.cais.slice(0, -1).reverse().concat([R.casa]).map(function (p) { return { x: p[0], y: p[1], p: false }; });
      return R.r[nome].map(function (p) { return { x: p[0], y: p[1], p: p[2] === "p" }; });
    }
    function volta(nome) {
      var l = ida(nome), out = [];
      for (var i = l.length - 1; i >= 0; i--) {
        var alvo = i > 0 ? l[i - 1] : { x: hub[0], y: hub[1] };
        out.push({ x: alvo.x, y: alvo.y, p: l[i].p });
      }
      return out;
    }
    function caminho(de, para) { return volta(de).concat(ida(para)); }

    function lado(dx, dy) {
      if (Math.abs(dx) >= Math.abs(dy) * 0.6 && Math.abs(dx) >= 2) return dx > 0 ? "direita" : "esquerda";
      return "frente";
    }

    function andar(pontos, fim) {
      var i = 0, total = 0, a = pos;
      pontos.forEach(function (p) { if (!p.p) total += Math.hypot(p.x - a.x, p.y - a.y); a = p; });
      var vel = Math.max(VELOCIDADE, total / 4);
      function proximo() {
        if (i >= pontos.length) return fim();
        var alvo = pontos[i++], ini = { x: pos.x, y: pos.y };
        var dx = alvo.x - ini.x, dy = alvo.y - ini.y, dist = Math.hypot(dx, dy);
        var dur = alvo.p ? PULO : Math.max(1, dist / vel * 1000), dir = lado(dx, dy), t0 = null;
        function quadroDe(t) {
          var f = alvo.p ? 2 : (Math.floor(t / PASSO) % 2) + 1;
          quadro(dir + "-" + f);
        }
        function passo(agora) {
          if (t0 === null) t0 = agora;
          var t = Math.min(1, (agora - t0) / dur);
          pos.x = ini.x + dx * t; pos.y = ini.y + dy * t;
          quadroDe(agora - t0);
          pintar(alvo.p ? Math.sin(Math.PI * t) * Math.min(8, 3 + dist / 3) : 0);
          if (t < 1) requestAnimationFrame(passo); else proximo();
        }
        requestAnimationFrame(passo);
      }
      proximo();
    }

    function chegar() {
      andando = false;
      quadro("frente-1");
      if (pendente && pendente !== lugar) { var p = pendente; pendente = null; ir(p); return; }
      pendente = null;
      olharEmVolta();
    }

    function ir(nome) {
      if (!R.r[nome] && nome !== "casa") return;
      if (andando) { pendente = nome; return; }
      if (nome === lugar) return;
      clearTimeout(olhar);
      var pontos = caminho(lugar, nome);
      lugar = nome;
      if (menos.matches || !escala()) {
        var ult = pontos[pontos.length - 1]; pos.x = ult.x; pos.y = ult.y; quadro("frente-1"); pintar(); return;
      }
      andando = true;
      andar(pontos, chegar);
    }

    // parado, de vez em quando olha para um lado e volta
    function olharEmVolta() {
      clearTimeout(olhar);
      olhar = setTimeout(function () {
        if (!andando && !menos.matches && !document.hidden) {
          quadro(Math.random() < 0.5 ? "direita-1" : "esquerda-1");
          olhar = setTimeout(function () { if (!andando) quadro("frente-1"); olharEmVolta(); }, 900 + Math.random() * 700);
        } else olharEmVolta();
      }, 3000 + Math.random() * 4000);
    }

    caixa.querySelectorAll(".marca-ilha").forEach(function (m) {
      var c = /m-[la]-(\w+)/.exec(m.className); if (!c) return;
      m.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") ir(c[1]); });
      m.addEventListener("focus", function () { ir(c[1]); });
    });
    pintar();
    window.addEventListener("resize", function () { if (!andando) pintar(); });
    if (linu.complete) pintar(); else linu.addEventListener("load", function () { pintar(); }, { once: true });
    olharEmVolta();
  }

  ligar("largo");
  ligar("alto");
})();
