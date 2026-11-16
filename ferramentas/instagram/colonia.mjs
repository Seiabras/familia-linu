// A Colônia do Linu (protótipo de 16/11/2026): as capas dos episódios da série nos reels da LinuPedia
// (instagram/colonia/ROTEIRO.md). A cena sai do mesmo desenho da página /colonia (js/colonia-pinguim.js), numa grade
// de 90 × 160 ampliada 12× (1080 × 1920), para os pinguins aparecerem grandes no celular. O título fica no miolo: no grid do perfil o reel aparece cortado em 3:4 e
// com zoom, e as bordas somem (INSTAGRAM.md, seção 3).
//
// Saída: instagram/colonia/epNN-capa.png e instagram/colonia/epNN-grade.png (a prévia do corte 3:4 do perfil).
// Rodar:  node ferramentas/instagram/colonia.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname), '../..');
const SAIDA = path.join(RAIZ, 'instagram/colonia');
// o Playwright: o instalado no computador (pasta do linu-sites) ou o global
const procurar = [path.join(process.env.HOME, 'Documentos/projetos/linu-sites/'), path.join(RAIZ, '/'), '/'];
let chromium;
for (const onde of procurar) { try { ({ chromium } = createRequire(onde)('playwright')); break; } catch { /* próximo */ } }
if (!chromium) throw new Error('Playwright não encontrado');

const dado = (arq, tipo) => `data:${tipo};base64,${fs.readFileSync(path.join(RAIZ, arq)).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ESCALA = 12, GW = 90, GH = 160;

// moradores: id do cachecol e do ofício (js/colonia-pinguim.js); null = morador sem nome
const EPISODIOS = [
  {
    n: 1, titulo: ['A primeira', 'pedra'], noite: false, semente: 3,
    // no começo, o Linu e quatro pinguins chegando; o resto da pedra vazia
    moradores: [{ cachecol: 'fogo', oficio: 'ninhos' }, null, { cachecol: 'krill', oficio: 'krill' }, null],
    ninhoDoLinu: false, pedraNaAsa: true,
  },
];

const fontes = `
@font-face { font-family: P; src: url(${dado('fontes/pixelify-sans-latin.woff2', 'font/woff2')}) format('woff2'); }
@font-face { font-family: P; src: url(${dado('fontes/pixelify-sans-latin-ext.woff2', 'font/woff2')}) format('woff2'); unicode-range: U+0100-024F; }
@font-face { font-family: N; src: url(${dado('fontes/nunito-latin.woff2', 'font/woff2')}) format('woff2'); font-weight: 200 1000; }`;

const CSS = `${fontes}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1080px; height: 1920px; overflow: hidden; background: #3D8CC6; }
.cena { position: absolute; left: 0; top: 0; width: ${GW * ESCALA}px; height: ${GH * ESCALA}px; image-rendering: pixelated; }
.placa { position: absolute; left: 130px; right: 130px; top: 330px; padding: 30px 36px 38px; text-align: center;
  background: #FFF6DC; border: 8px solid #1F2A44; box-shadow: 12px 12px 0 #1F2A44; }
.placa small { display: block; font: 900 40px/1 N, sans-serif; letter-spacing: .02em; color: #1F4E7A; }
.placa b { display: block; margin-top: 14px; font: 700 104px/1.02 P, monospace; color: #0F172A; }
.serie { position: absolute; left: 0; right: 0; top: 250px; text-align: center; font: 700 40px/1 P, monospace; color: #1F2A44; }`;

const linu = dado('img/mapa-linu/frente-1.png', 'image/png');
const biblioteca = fs.readFileSync(path.join(RAIZ, 'js/colonia-pinguim.js'), 'utf8');

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.setContent('<!doctype html><html><body></body></html>');
await p.addScriptTag({ content: biblioteca });
fs.mkdirSync(SAIDA, { recursive: true });

for (const ep of EPISODIOS) {
  const cena = await p.evaluate(async ({ GW, GH, ep, linu }) => {
    const P = window.ColoniaPinguim;
    const c = document.createElement('canvas'); c.width = GW; c.height = GH;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    const r = P.cena(g, GW, GH, { semente: ep.semente, noite: ep.noite });
    const img = new Image(); img.src = linu; await img.decode();
    const lx = r.centro[0] - 9, ly = r.centro[1] - 18;
    const livres = r.lugares.filter((l) => !(l[0] + 12 > lx - 4 && l[0] < lx + 22 && l[1] + 12 > ly - 2 && l[1] < ly + 26));
    const postos = ep.moradores.map((m, i) => [livres[i * 2 + 1], m]);   // espalhados, não grudados no Linu
    postos.push([[lx, ly + 12], 'linu']);
    postos.sort((a, b) => a[0][1] - b[0][1]);
    for (const [l, m] of postos) {
      if (m === 'linu') {
        if (ep.ninhoDoLinu) { P.ninho(g, lx + 1, ly + 13); P.ninho(g, lx + 9, ly + 13); }
        g.drawImage(img, lx, ly, 18, 24);
        if (ep.pedraNaAsa) {
          // a primeira pedra do ninho, ao lado da asa do Linu (2×, como ele)
          const pd = [['.', 'g', 'g', '.'], ['g', 'h', 'g', 'g'], ['g', 'g', 'h', 'h']];
          const cor = { g: '#E2E8F0', h: '#94A3B8' };
          g.fillStyle = '#1F2A44';   // o contorno, para a pedra não sumir no chão de pedra
          pd.forEach((linha, y) => linha.forEach((k, x) => { if (k !== '.') g.fillRect(lx + 18 + x * 2 - 1, ly + 14 + y * 2 - 1, 4, 4); }));
          pd.forEach((linha, y) => linha.forEach((k, x) => { if (k !== '.') { g.fillStyle = cor[k]; g.fillRect(lx + 18 + x * 2, ly + 14 + y * 2, 2, 2); } }));
        }
        continue;
      }
      if (l[4]) P.ninho(g, l[0], l[1]);
      P.morador(g, l[0], l[1], m, 1, l[3]);
    }
    return c.toDataURL('image/png');
  }, { GW, GH, ep, linu });

  const nn = String(ep.n).padStart(2, '0');
  const html = `<img class="cena" src="${cena}">
    <p class="serie">A Colônia do Linu</p>
    <div class="placa"><small>Episódio ${ep.n}</small><b>${ep.titulo.map(esc).join('<br>')}</b></div>`;
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
  await p.evaluate(() => document.fonts.ready);
  const arq = path.join(SAIDA, `ep${nn}-capa.png`);
  await p.screenshot({ path: arq });
  // a prévia do grid do perfil: o miolo 3:4 (1080 × 1440), como o Instagram mostra o reel no perfil
  await p.screenshot({ path: path.join(SAIDA, `ep${nn}-grade.png`), clip: { x: 0, y: 240, width: 1080, height: 1440 } });
  console.log('feito:', path.relative(RAIZ, arq));
}
await b.close();
