// "Diário da Antártica" (11/11/2026): a fileira de cima do perfil da LinuPedia, três carrosséis de curiosidade com o
// Linu de guia (instagram/DESIGN.md). As capas são o planalto da geleira, as montanhas e o céu, em pixel art: no
// perfil, continuam o mosaico das ilhas para cima (a neve do pé desta fileira emenda com a do alto do mosaico). Os
// slides são a carta náutica, com uma faixa do mesmo planalto embaixo.
//
// Os fatos têm fonte (FONTES, no fim de cada post); o que é incerto está dito como incerto.
// Saída em instagram/diario/<n>-<tema>/NN.png e grade.png (a prévia com o mosaico embaixo).
// Rodar:  node ferramentas/instagram/diario.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(path.join(process.env.HOME, 'Documentos/projetos/linu-sites/'))('playwright');

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname), '../..');
const SAIDA = path.join(RAIZ, 'instagram/diario');
const dado = (arq, tipo) => `data:${tipo};base64,${fs.readFileSync(path.join(RAIZ, arq)).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ESCALA = 6, QW = 180, QH = 240;

const POSTS = [
  {
    id: 'urso', capa: ['Antártica quer', 'dizer “sem urso”?'],
    slides: [
      ['O urso está no céu.', '“Ártico” vem do grego arktos, urso. Não o bicho: a Ursa Maior, a constelação que manda no céu do norte. A Estrela Polar fica na Ursa Menor, ali do lado.'],
      ['Antártica: o lado oposto.', 'Com o “anti” na frente, antártico é o que fica do lado contrário ao Urso: o sul. Como nome do continente, só pegou nos mapas do fim do século XIX.'],
      ['E, por acaso, sem urso mesmo.', 'Urso-polar só existe no Ártico. Na Antártica nunca teve urso: lá, quem manda no gelo são os pinguins, as focas e as baleias.'],
    ],
    fim: { titulo: 'Diga “urso” em cinco línguas', lista: [['oso', 'espanhol'], ['bear', 'inglês'], ['ours', 'francês'], ['Bär', 'alemão'], ['orso', 'italiano']], frase: 'Línguas, ciência e história, de graça, na LinuPedia. Link na bio.' },
    fontes: ['Etymonline, “Antarctic” e “arctic”', 'Norwegian Polar Institute, “Antarctic = anti-Arctic”'],
  },
  {
    id: 'pinguim', capa: ['De onde vem', 'a palavra “pinguim”?'],
    slides: [
      ['Ninguém sabe ao certo.', 'A palavra aparece em inglês por volta de 1580, em relatos de navegadores. E já chegou cheia de dúvida.'],
      ['O nome era de outra ave.', '“Penguin” era o arau-gigante, uma ave preta e branca do Atlântico Norte que não voava, extinta em 1844. Os navegadores viram as aves do sul, parecidas, e o nome passou para elas.'],
      ['Pista 1: “cabeça branca”.', 'Do galês pen gwyn. É a mais aceita, mas tem um problema: o arau-gigante não tinha a cabeça branca, só uma mancha branca perto de cada olho.'],
      ['Pista 2: “gordo”.', 'Do latim pinguis. Combina com o bicho, mas os dicionários desconfiam: parece explicação inventada depois. O mistério continua.'],
    ],
    fim: { titulo: 'Toda palavra tem uma história.', frase: 'Na LinuPedia, a gente conta: línguas, ciência e história, de graça. Link na bio.' },
    fontes: ['Etymonline, “penguin”', 'Oxford University Press blog, “penguin” (2011)', 'Wikipedia, “Great auk”'],
  },
  {
    id: 'pe', capa: ['Por que o pinguim', 'não congela o pé?'],
    slides: [
      ['O pé fica frio. De propósito.', 'O corpo do pinguim fica quentinho; o pé, só um pouco acima do ponto de congelar. E é justamente isso que salva o bicho.'],
      ['Veia e artéria lado a lado.', 'Na perna, o sangue quente que desce passa grudado no sangue frio que sobe. O calor pula de um para o outro: chega menos calor no pé, e o frio não volta direto para o corpo.'],
      ['Pé frio gasta menos.', 'Com o pé quase na temperatura do gelo, quase não sai calor por ali. É o mesmo truque de patos e gaivotas no inverno, e tem nome: troca de calor em contracorrente.'],
      ['E quando o frio aperta…', 'O pinguim-imperador se apoia nos calcanhares e na cauda, para encostar menos pé no gelo.'],
    ],
    fim: { titulo: 'Biologia também se estuda.', frase: 'Na LinuPedia: ciência, línguas e história, de graça. Link na bio.' },
    fontes: ['Ohio State University, “Beyond Penguins: How do birds stay warm?”', 'Trench Project, “King penguins”'],
  },
];

const fontes = `
@font-face { font-family: P; src: url(${dado('fontes/pixelify-sans-latin.woff2', 'font/woff2')}) format('woff2'); }
@font-face { font-family: P; src: url(${dado('fontes/pixelify-sans-latin-ext.woff2', 'font/woff2')}) format('woff2'); unicode-range: U+0100-024F; }
@font-face { font-family: N; src: url(${dado('fontes/nunito-latin.woff2', 'font/woff2')}) format('woff2'); font-weight: 200 1000; }
@font-face { font-family: N; src: url(${dado('fontes/nunito-latin-ext.woff2', 'font/woff2')}) format('woff2'); font-weight: 200 1000; unicode-range: U+0100-024F; }`;

/** O panorama (540 × 240): céu em faixas, sol pálido, montanhas com neve e o planalto com pinguins. */
async function desenharPanorama(p) {
  return p.evaluate(({ QW, QH }) => {
    const W = QW * 3, H = QH;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const px = (x, y, w, h, cor) => { g.fillStyle = cor; g.fillRect(x, y, w, h); };
    let s = 11;
    const sorte = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // o céu: faixas, do azul do alto ao branco do horizonte (sem degradê)
    ['#8CC6EA', '#9FD0EE', '#B3DAF2', '#C6E4F6', '#D8EDF9', '#E6F4FB'].forEach((cor, i) => px(0, i * 22, W, 22, cor));
    // o sol, baixo e pálido, e nuvens em degraus
    for (let y = -9; y <= 9; y++) for (let x = -9; x <= 9; x++) if (x * x + y * y <= 81) px(430 + x, 38 + y, 1, 1, x * x + y * y <= 36 ? '#FFFBEA' : '#FFF1C2');
    const nuvem = (x, y, w) => { px(x + 4, y, w - 8, 3, '#F4FBFF'); px(x, y + 3, w, 4, '#F4FBFF'); px(x + 2, y + 7, w - 4, 1, '#C6E4F6'); };
    nuvem(40, 30, 46); nuvem(230, 18, 34); nuvem(330, 56, 28); nuvem(140, 70, 22);
    // petréis (aves pequenas) no céu
    for (const [x, y] of [[90, 54], [102, 60], [300, 40], [500, 84]]) { px(x, y, 2, 1, '#1F4E7A'); px(x + 2, y + 1, 1, 1, '#1F4E7A'); px(x + 3, y, 2, 1, '#1F4E7A'); }
    // as montanhas: picos em degraus, lado da sombra, neve no topo, contorno escuro
    const pico = (cx, topo, larg, base) => {
      for (let x = cx - larg; x <= cx + larg; x++) {
        const d = Math.abs(x - cx);
        // a crista com degraus e dentes, para não ser um triângulo liso
        const y = topo + Math.round(d * (base - topo) / larg / 2) * 2 + [0, 1, 3, 1, 0, 2, 4, 2][(x >> 1) % 8] - (d < 3 ? 2 : 0);
        const sombra = x > cx;
        for (let yy = y; yy < base; yy++) {
          const neve = yy < y + 12 + [0, 3, 6, 4, 1, 5, 8, 3][(x >> 2) % 8];
          px(x, yy, 1, 1, neve ? (sombra ? '#CFE6F4' : '#F4FBFF') : (sombra ? '#5F7C9A' : '#7F9CB8'));
        }
        px(x, y, 1, 1, '#1F4E7A');
      }
    };
    pico(70, 96, 70, 178); pico(170, 118, 60, 178); pico(268, 84, 84, 178); pico(380, 110, 64, 178); pico(470, 92, 76, 178); pico(560, 120, 50, 178);
    // o planalto da geleira: neve com montinhos, que no pé emenda com o alto do mosaico (#F4FBFF)
    px(0, 166, W, H - 166, '#F4FBFF');
    for (let x = 0; x < W; x++) { const y = 166 + Math.round(2 * Math.sin(x / 17)); px(x, y, 1, 1, '#DCEFF9'); }
    for (let i = 0; i < 40; i++) { const x = Math.floor(sorte() * (W - 14)), y = 176 + Math.floor(sorte() * 56); px(x, y, 12, 1, '#DCEFF9'); px(x + 3, y - 1, 6, 1, '#FFFFFF'); }
    // pinguins no planalto, um grupinho por quadro
    const pinguim = (x, y) => { px(x, y, 3, 6, '#1B2433'); px(x + 1, y + 2, 1, 4, '#F4FBFF'); px(x + 1, y + 1, 1, 1, '#F59E0B'); px(x, y + 6, 3, 1, '#F59E0B'); px(x - 1, y + 7, 5, 1, '#C6E4F6'); };
    for (const [x, y] of [[30, 214], [36, 218], [150, 206], [222, 224], [228, 220], [310, 210], [404, 222], [470, 208], [476, 212], [520, 226]]) pinguim(x, y);
    // a bandeira da expedição do Linu, no quadro do meio
    px(262, 196, 1, 16, '#3C2A2A'); px(263, 196, 9, 6, '#2563EB'); px(263, 196, 9, 1, '#5B8DEF');
    return c.toDataURL('image/png');
  }, { QW, QH });
}

const CSS = `${fontes}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1080px; height: 1440px; overflow: hidden; background: #EEF4F7; }
.pano { position: absolute; image-rendering: pixelated; }
.placa { position: absolute; left: 90px; right: 90px; top: 250px; padding: 30px 36px 36px; background: #FFF6DC; border: 8px solid #1F2A44; box-shadow: 12px 12px 0 #1F2A44; }
.placa small { display: block; font: 700 34px/1 P, monospace; color: #1F4E7A; }
.placa small i { font: 800 34px/1 N, sans-serif; font-style: normal; }
.placa b { display: block; margin-top: 18px; font: 700 78px/1.05 P, monospace; color: #0F172A; }
.carta { position: absolute; inset: 0; background: #EEF4F7; background-image: linear-gradient(rgba(37,99,235,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(37,99,235,.07) 2px, transparent 2px); background-size: 60px 60px; }
.topo { position: absolute; left: 90px; right: 90px; top: 80px; display: flex; justify-content: space-between; font: 700 34px/1 P, monospace; color: #1F2A44; }
.topo span + span { font: 800 34px/1 N, sans-serif; } /* o 5 da Pixelify parece um S: a contagem vai na Nunito */
.miolo { position: absolute; left: 90px; right: 90px; top: 220px; }
h1 { font: 700 96px/1.04 P, monospace; color: #1F4E7A; }
.texto { margin-top: 40px; font: 500 50px/1.42 N, sans-serif; color: #0F172A; }
.lista { margin-top: 40px; display: grid; gap: 18px; font: 500 48px/1.2 N, sans-serif; color: #0F172A; list-style: none; padding: 0; }
.lista b { font: 700 58px/1 P, monospace; color: #1F4E7A; margin-right: 18px; }
.fontes { position: absolute; left: 90px; right: 90px; bottom: 300px; font: 500 26px/1.35 N, sans-serif; color: #475569; }`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1440 } });
await p.setContent('<!doctype html><html><body></body></html>');
const pano = await desenharPanorama(p);
fs.rmSync(SAIDA, { recursive: true, force: true });

const foto = async (html, arq) => {
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: arq });
};
// a faixa no pé dos slides: as montanhas e o planalto do panorama, em 2×
const faixa = () => `<div style="position:absolute;left:0;right:0;bottom:0;height:240px;overflow:hidden;border-top:6px solid #1F2A44">
  <img class="pano" src="${pano}" style="width:${QW * 3 * 2}px;height:${QH * 2}px;left:0;top:${-96 * 2}px"></div>`;

for (const [k, post] of POSTS.entries()) {
  const pasta = path.join(SAIDA, `${k + 1}-${post.id}`);
  const total = post.slides.length + 2;
  const topo = (n) => `<div class="topo"><span>Diário da Antártica</span><span>${n}/${total}</span></div>`;
  // a capa: o pedaço k do panorama, com a placa da pergunta no céu
  await foto(`<img class="pano" src="${pano}" style="width:${QW * 3 * ESCALA}px;height:${QH * ESCALA}px;left:${-k * QW * ESCALA}px;top:0">
    <div class="placa"><small>Diário da Antártica · <i>${k + 1}</i></small><b>${post.capa.map(esc).join('<br>')}</b></div>`, path.join(pasta, '01.png'));
  for (const [i, [titulo, texto]] of post.slides.entries()) {
    await foto(`<div class="carta"></div>${topo(i + 2)}<div class="miolo"><h1>${esc(titulo)}</h1><p class="texto">${esc(texto)}</p></div>${faixa()}`,
      path.join(pasta, `${String(i + 2).padStart(2, '0')}.png`));
  }
  const f = post.fim;
  await foto(`<div class="carta"></div>${topo(total)}<div class="miolo"><h1>${esc(f.titulo)}</h1>
    ${f.lista ? `<ul class="lista">${f.lista.map(([w, l]) => `<li><b>${esc(w)}</b>${esc(l)}</li>`).join('')}</ul>` : ''}
    <p class="texto">${esc(f.frase)}</p></div>
    <p class="fontes">Fontes: ${post.fontes.map(esc).join(' · ')}</p>${faixa()}`, path.join(pasta, `${String(total).padStart(2, '0')}.png`));
  console.log(`${post.id}: ${total} slides`);
}

// a prévia do perfil: esta fileira em cima e o mosaico das ilhas embaixo
await p.setViewportSize({ width: 3 * 360 + 6, height: 3 * 480 + 6 });
const capa = (k) => dado(`instagram/diario/${k + 1}-${POSTS[k].id}/01.png`, 'image/png');
const quadro = (l, c) => dado(`instagram/mosaico/quadro-${l}${c}.png`, 'image/png');
const img = (src, c, l) => `<img src="${src}" style="position:absolute;left:${c * 363}px;top:${l * 483}px;width:360px;height:480px">`;
await p.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${[0, 1, 2].map((k) => img(capa(k), k, 0)).join('')}
  ${[0, 1].flatMap((l) => [0, 1, 2].map((c) => img(quadro(l, c), c, l + 1))).join('')}</body></html>`);
await p.screenshot({ path: path.join(SAIDA, 'grade.png') });
await b.close();
console.log('pronto em', SAIDA);
