// O mosaico do Instagram da LinuPedia (11/11/2026): o mapa das ilhas da Família Linu montado numa grade 3 × 3, uma ilha
// por quadro, com pontes que passam de um quadro para o outro. No perfil, os nove posts formam um arquipélago só; cada
// post sozinho é a ilha de um irmão, com a placa do nome. As ilhas são as mesmas do site (img/ilha-*.png), recortadas
// do mar e postas num mar de faixas, como o mapa alto; tudo em pixel art de verdade: a grade é de 540 × 720 e cada
// quadro (180 × 240) sai em 6×, 1080 × 1440 (o 3:4 da grade do perfil, sem corte).
//
// Saída em instagram/mosaico/: quadro-<linha><coluna>.png (os nove), detalhe-<irmão>.png (o segundo slide de cada
// post) e grade.png (a prévia do perfil). A ordem de postar está no instagram/README.md.
// Rodar:  node ferramentas/instagram/mosaico.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(path.join(process.env.HOME, 'Documentos/projetos/linu-sites/'))('playwright');

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname), '../..');
const SAIDA = path.join(RAIZ, 'instagram/mosaico');
const dado = (arq, tipo) => `data:${tipo};base64,${fs.readFileSync(path.join(RAIZ, arq)).toString('base64')}`;
const png = (nome) => dado(`img/${nome}.png`, 'image/png');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const ESCALA = 6;
const QW = 180, QH = 240; // um quadro na grade do pixel art

// As ilhas: o quadro (linha, coluna), a casa, o texto do segundo slide e o endereço. Os textos são os do site
// (index.html, a legenda das ilhas); os preços, os mesmos de cada irmão. A linha 0 fica para depois.
const ILHAS = [
  { id: 'sites', nome: 'Linu Sites', casa: 'A estação', q: [1, 0], dx: -6, dy: -4, cor: '#1D4ED8',
    texto: 'Onde a planta é desenhada: sites, sistemas e aplicativos sob medida, para o celular, o tablet e o computador.',
    preco: 'Site a partir de R$ 1.200', link: 'sites.linupedia.com.br' },
  { id: 'familia', nome: 'Família Linu', casa: 'A casa do meio', q: [1, 1], dx: 0, dy: 2, cor: '#2563EB',
    texto: 'A casa que junta os irmãos. As pontes são as rotas: pacotes que passam por mais de uma ilha, com uma conversa só.',
    preco: 'Rotas a partir de R$ 2.100', link: 'familia.linupedia.com.br' },
  { id: 'digital', nome: 'Digital Linu', casa: 'O estúdio', q: [1, 2], dx: 6, dy: -6, cor: '#C2410C',
    texto: 'Vídeo, redes sociais, anúncios, marca e automação para pequenos negócios.',
    preco: 'Serviços a partir de R$ 200', link: 'digital.linupedia.com.br' },
  { id: 'seguro', nome: 'Linu Seguro', casa: 'O iglu', q: [2, 0], dx: -4, dy: 0, cor: '#0E7490',
    texto: 'Golpes, senhas, cópias de segurança, e\u2011mail e site protegidos, bloco por bloco.',
    preco: 'Serviços a partir de R$ 250', link: 'seguro.linupedia.com.br' },
  { id: 'pedia', nome: 'LinuPedia', casa: 'O acampamento', q: [2, 1], dx: 2, dy: 4, cor: '#2563EB',
    // a ponta da ilha vizinha, em cima à direita, encosta nos pinheiros: some à mão
    apagar: [[100, 0, 26, 17], [78, 0, 9, 13], [97, 0, 3, 13], [87, 0, 10, 4]],
    texto: 'Onde o Linu nasceu: idiomas e áreas do conhecimento para estudar de graça, sem propaganda.',
    preco: 'Gratuita', link: 'linupedia.com.br' },
  { id: 'farol', nome: 'Linu Farol', casa: 'O farol', q: [2, 2], dx: 4, dy: -2, cor: '#B91C1C',
    texto: 'O painel do mês: o site no ar, o cadeado, a rapidez, as trancas, as visitas, o Google e o Instagram.',
    preco: 'Painel a partir de R$ 50 por mês', link: 'farol.linupedia.com.br' },
];
// As pontes (de, para): entram por baixo das ilhas e cruzam a borda dos quadros
const PONTES = [['sites', 'familia'], ['familia', 'digital'], ['familia', 'pedia'], ['seguro', 'pedia'], ['pedia', 'farol']];

const fontes = `
@font-face { font-family: P; src: url(${dado('fontes/pixelify-sans-latin.woff2', 'font/woff2')}) format('woff2'); }
@font-face { font-family: P; src: url(${dado('fontes/pixelify-sans-latin-ext.woff2', 'font/woff2')}) format('woff2'); unicode-range: U+0100-024F; }
@font-face { font-family: N; src: url(${dado('fontes/nunito-latin.woff2', 'font/woff2')}) format('woff2'); font-weight: 200 1000; }
@font-face { font-family: N; src: url(${dado('fontes/nunito-latin-ext.woff2', 'font/woff2')}) format('woff2'); font-weight: 200 1000; unicode-range: U+0100-024F; }`;

/** Desenha o mapa (540 × 720) num canvas da página e devolve o PNG em data URL, mais o centro de cada ilha. */
async function desenharMapa(p) {
  return p.evaluate(async ({ ILHAS, PONTES, QW, QH, sprites }) => {
    const carregar = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const W = QW * 3, H = QH * 3;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    // o mar em faixas, como o mapa alto (três tons, sem degradê)
    const TONS = ['#4477AC', '#4C80B5', '#5D94C5'];
    for (let y = 0, k = 0; y < H; y += 20, k++) { g.fillStyle = TONS[k % 3]; g.fillRect(0, y, W, 20); }
    // marolas: tracinhos claros, sempre nos mesmos lugares
    let s = 7;
    const sorte = () => (s = (s * 16807) % 2147483647) / 2147483647;
    g.fillStyle = '#99C8E1';
    for (let i = 0; i < 70; i++) { const x = Math.floor(sorte() * (W - 8)), y = Math.floor(sorte() * (H - 4)); g.fillRect(x, y, 2, 1); g.fillRect(x + 2, y - 1, 2, 1); g.fillRect(x + 4, y, 2, 1); }

    // cada ilha recortada do mar do site: some o azul ligado à borda; fica areia, espuma e casa
    const recortar = (img, apagar = []) => {
      const k = document.createElement('canvas'); k.width = img.width; k.height = img.height;
      const kg = k.getContext('2d'); kg.drawImage(img, 0, 0);
      const d = kg.getImageData(0, 0, k.width, k.height); const px = d.data; const w = k.width, h = k.height;
      const azul = (i) => px[i + 2] - px[i] > 100 && px[i + 3] > 0; // o mar; o iglu (azul-claro) fica
      const fila = [];
      for (let x = 0; x < w; x++) fila.push([x, 0], [x, h - 1]);
      for (let y = 0; y < h; y++) fila.push([0, y], [w - 1, y]);
      while (fila.length) {
        const [x, y] = fila.pop(); if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const i = (y * w + x) * 4; if (!azul(i)) continue;
        px[i + 3] = 0; fila.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      for (const [ax, ay, aw, ah] of apagar) for (let y = ay; y < ay + ah; y++) for (let x = ax; x < ax + aw; x++) px[(y * w + x) * 4 + 3] = 0;
      // pedaços de ilha vizinha que vieram no recorte: fica só o maior pedaço (a ilha), o resto some
      const rotulo = new Int32Array(w * h); let n = 0; const tamanhos = [0];
      for (let y0 = 0; y0 < h; y0++) for (let x0 = 0; x0 < w; x0++) {
        if (rotulo[y0 * w + x0] || px[(y0 * w + x0) * 4 + 3] === 0) continue;
        n++; let t = 0; const pilha = [[x0, y0]];
        while (pilha.length) {
          const [x, y] = pilha.pop(); if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const j = y * w + x; if (rotulo[j] || px[j * 4 + 3] === 0) continue;
          rotulo[j] = n; t++; pilha.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
        tamanhos.push(t);
      }
      const maior = tamanhos.indexOf(Math.max(...tamanhos));
      for (let j = 0; j < w * h; j++) if (rotulo[j] && rotulo[j] !== maior) px[j * 4 + 3] = 0;
      kg.putImageData(d, 0, 0);
      return { k, mascara: (x, y) => x >= 0 && y >= 0 && x < w && y < h && px[(y * w + x) * 4 + 3] > 0, w, h };
    };
    const ilhas = {};
    for (const il of ILHAS) {
      const r = recortar(await carregar(sprites[il.id]), il.apagar);
      const cx = il.q[1] * QW + QW / 2 + il.dx, cy = il.q[0] * QH + 100 + il.dy;
      ilhas[il.id] = { ...r, x: Math.round(cx - r.w / 2), y: Math.round(cy - r.h / 2), cx, cy };
    }
    // a água rasa em volta de cada ilha: dois anéis, pintados antes das pontes
    const anel = (il, raio, cor) => {
      g.fillStyle = cor;
      for (let y = -raio; y < il.h + raio; y++) for (let x = -raio; x < il.w + raio; x++) {
        if (il.mascara(x, y)) continue;
        let perto = false;
        for (let dy = -raio; dy <= raio && !perto; dy++) for (let dx = -raio; dx <= raio && !perto; dx++) if (dx * dx + dy * dy <= raio * raio && il.mascara(x + dx, y + dy)) perto = true;
        if (perto) g.fillRect(il.x + x, il.y + y, 1, 1);
      }
    };
    for (const il of Object.values(ilhas)) anel(il, 7, '#6FB1D4');
    for (const il of Object.values(ilhas)) anel(il, 3, '#54BCE3');
    // as pontes de tábua, por baixo das ilhas
    const tabua = (x, y, w, h, deitada) => {
      g.fillStyle = '#3C2A2A'; g.fillRect(x - 1, y - 1, w + 2, h + 2);
      g.fillStyle = '#8E6859'; g.fillRect(x, y, w, h);
      g.fillStyle = '#654444';
      if (deitada) for (let i = x + 3; i < x + w; i += 4) g.fillRect(i, y, 1, h);
      else for (let j = y + 3; j < y + h; j += 4) g.fillRect(x, j, w, 1);
      g.fillStyle = '#B08872'; if (deitada) g.fillRect(x, y, w, 1); else g.fillRect(x, y, 1, h);
    };
    for (const [a, b] of PONTES) {
      const A = ilhas[a], B = ilhas[b];
      if (Math.abs(A.cy - B.cy) < QH / 2) { const y = Math.round((A.cy + B.cy) / 2) + 6; tabua(Math.round(A.cx), y, Math.round(B.cx - A.cx), 9, true); }
      else { const x = Math.round((A.cx + B.cx) / 2) - 5; tabua(x, Math.round(A.cy), 10, Math.round(B.cy - A.cy), false); }
    }
    for (const il of Object.values(ilhas)) g.drawImage(il.k, il.x, il.y);
    // blocos de gelo boiando, alguns na linha de cima (que fica para depois)
    const gelo = (x, y, w, h) => { g.fillStyle = '#99C8E1'; g.fillRect(x + 1, y + 2, w, h); g.fillStyle = '#E8F6FC'; g.fillRect(x, y, w, h); g.fillStyle = '#FFFFFF'; g.fillRect(x + 1, y, w - 3, 1); };
    for (const [x, y, w, h] of [[30, 60, 14, 6], [52, 70, 6, 4], [400, 150, 12, 6], [300, 40, 8, 4], [470, 300, 10, 5], [20, 420, 9, 5], [250, 470, 7, 4], [500, 560, 12, 6], [140, 690, 10, 5], [380, 690, 8, 4]]) gelo(x, y, w, h);
    return c.toDataURL('image/png');
  }, { ILHAS, PONTES, QW, QH, sprites: Object.fromEntries(ILHAS.map((il) => [il.id, png(`ilha-${il.id}`)])) });
}

const CSS = `${fontes}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1080px; height: 1440px; overflow: hidden; }
.mapa { position: absolute; width: ${QW * 3 * ESCALA}px; height: ${QH * 3 * ESCALA}px; image-rendering: pixelated; }
.placa { position: absolute; left: 50%; transform: translateX(-50%); bottom: 120px; padding: 18px 40px 22px; background: #FFF6DC; border: 8px solid #1F2A44; box-shadow: 12px 12px 0 #1F2A44; text-align: center; white-space: nowrap; }
.placa b { display: block; font: 700 76px/1 P, monospace; color: #0F172A; }
.placa span { display: block; margin-top: 10px; font: 700 34px/1 N, sans-serif; color: #475569; }
.vez { position: absolute; left: 50%; transform: translateX(-50%); bottom: 150px; padding: 14px 30px; background: rgba(15, 23, 42, .55); font: 700 40px/1 P, monospace; color: #E8F6FC; }`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1440 } });
await p.setContent('<!doctype html><html><body></body></html>');
const mapa = await desenharMapa(p);
fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(SAIDA, { recursive: true });

const foto = async (html, arq) => {
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(SAIDA, arq) });
};

// os nove quadros: o mesmo mapa, deslocado; a placa só nos que têm ilha
for (let l = 0; l < 3; l++) for (let col = 0; col < 3; col++) {
  const il = ILHAS.find((x) => x.q[0] === l && x.q[1] === col);
  await foto(`<img class="mapa" src="${mapa}" style="left:${-col * QW * ESCALA}px;top:${-l * QH * ESCALA}px">
    ${il ? `<div class="placa"><b>${esc(il.nome)}</b><span>${esc(il.casa)}</span></div>` : '<div class="vez">em breve</div>'}`, `quadro-${l}${col}.png`);
}

// o segundo slide de cada post: a carta náutica com a ilha grande, o que faz, o preço e o endereço
for (const il of ILHAS) {
  await foto(`<div style="position:absolute;inset:0;background:#EEF4F7;background-image:linear-gradient(rgba(37,99,235,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(37,99,235,.07) 2px,transparent 2px);background-size:60px 60px"></div>
    <div style="position:absolute;left:90px;right:90px;top:90px;display:flex;justify-content:space-between;font:700 34px/1 P,monospace;color:#1F2A44"><span>Família Linu</span><span>${esc(il.casa)}</span></div>
    <img src="${png(`ilha-${il.id}`)}" style="position:absolute;left:50%;top:190px;transform:translateX(-50%);${il.id === 'farol' ? 'width:434px' : 'height:440px'};image-rendering:pixelated;border:8px solid #1F2A44;box-shadow:12px 12px 0 #1F2A44" data-ilha>
    <div style="position:absolute;left:90px;right:90px;top:720px">
      <h1 style="font:700 110px/1 P,monospace;color:${il.cor}">${esc(il.nome)}</h1>
      <p style="margin-top:34px;font:500 46px/1.4 N,sans-serif;color:#0F172A">${esc(il.texto)}</p>
      <p style="margin-top:34px;display:inline-block;padding:12px 24px;background:#FFF6DC;border:6px solid #1F2A44;font:800 40px/1.1 N,sans-serif;color:#0F172A">${esc(il.preco)}</p>
    </div>
    <p style="position:absolute;left:90px;right:90px;bottom:90px;font:700 50px/1 P,monospace;color:#1F2A44">${esc(il.link)}</p>`, `detalhe-${il.id}.png`);
}

// a prévia do perfil: os nove quadros na grade (3:4, com o vão de 3 px do Instagram)
await p.setViewportSize({ width: 3 * 360 + 6, height: 3 * 480 + 6 });
const quadros = [];
for (let l = 0; l < 3; l++) for (let col = 0; col < 3; col++) quadros.push(`<img src="${dado(`instagram/mosaico/quadro-${l}${col}.png`, 'image/png')}" style="position:absolute;left:${col * 363}px;top:${l * 483}px;width:360px;height:480px">`);
await p.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${quadros.join('')}</body></html>`);
await p.screenshot({ path: path.join(SAIDA, 'grade.png') });
await b.close();
console.log('mosaico pronto em', SAIDA);
