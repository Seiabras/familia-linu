"""As rotas do Linu no mapa (js/mapa-linu.js) desenhadas por cima do mapa de dia, ampliado 4×, para conferir se ele
anda pelas pontes e pelas pedras e não atravessa casa nem água.

    python3 ferramentas/rotas-do-linu.py [pasta de saída]     (padrão: capturas/)

Sai rotas-largo.png e rotas-alto.png; o círculo grosso é um ponto que ele alcança pulando."""
import json
import re
import sys
from pathlib import Path
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parents[1]
js = (RAIZ / 'js' / 'mapa-linu.js').read_text(encoding='utf-8')
bloco = js[js.index('var ROTAS = ') + 12:]
bloco = bloco[:bloco.index('};') + 1]
ROTAS = json.loads(re.sub(r'([{,]\s*)(\w+):', r'\1"\2":', bloco))
saida = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / 'capturas'
saida.mkdir(parents=True, exist_ok=True)
CORES = [(255, 0, 0), (255, 255, 0), (0, 255, 0), (255, 0, 255), (0, 255, 255), (255, 128, 0), (128, 0, 255)]
for tipo, R in ROTAS.items():
    k = 4
    im = Image.open(RAIZ / 'img' / f'mapa-{tipo}-dia.png').convert('RGB')
    im = im.resize((im.width * k, im.height * k), Image.NEAREST)
    d = ImageDraw.Draw(im)
    for i, (nome, pontos) in enumerate(R['r'].items()):
        cam = [R['casa']] + R['cais'] + pontos
        for a, b in zip(cam, cam[1:]):
            d.line([(a[0] * k, a[1] * k), (b[0] * k, b[1] * k)], fill=CORES[i % 7], width=3)
            d.ellipse([b[0] * k - 5, b[1] * k - 5, b[0] * k + 5, b[1] * k + 5], outline=CORES[i % 7], width=4 if len(b) > 2 else 2)
        d.text((pontos[-1][0] * k + 6, pontos[-1][1] * k), nome, fill=CORES[i % 7])
    im.save(saida / f'rotas-{tipo}.png')
    print(saida / f'rotas-{tipo}.png')
