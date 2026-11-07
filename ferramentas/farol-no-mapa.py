"""O farol do Linu Farol no mapa (07/11/2026): tira a bandeira da ilha vaga da direita e desenha um farol pequeno
(11 × 23 na grade do mapa) no lugar, nos quatro mapas. À noite, as cores vêm do próprio mapa (cada cor do farol vira
a cor que o mapa da noite tem onde o mapa do dia tem a cor mais parecida) e a lanterna e a janela acendem.

    python3 ferramentas/farol-no-mapa.py

Roda uma vez sobre os mapas com a bandeira; as cópias de antes ficam no histórico do git."""
from collections import Counter
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
FAROL = """
....RRr....
...RRRRr...
..KKKKKKK..
..KGGGgGK..
..KGGGgGK..
.KKKKKKKKK.
..KWWWwWK..
..KRRRrRK..
..KRRRrRK..
..KWWWwWK..
..KWWDwWK..
..KWWWwWK..
.KRRRRRrRK.
.KRRRRRrRK.
.KWWWWWwWK.
.KWWWDWwWK.
.KWWWWWwWK.
.KRRRRRRrK.
KRRRRRRRRrK
KWWWWWWWWwK
KWWWWBWWWwK
KWWWWBWWWwK
SSSSSSSSSsS
"""
COR = {'R': (0xC8, 0x1E, 0x1E), 'r': (0x9E, 0x16, 0x16), 'W': (0xF4, 0xF7, 0xFA), 'w': (0xC9, 0xD3, 0xDC),
       'K': (0x3A, 0x2A, 0x2A), 'G': (0xA9, 0xC4, 0xD6), 'g': (0x86, 0xA3, 0xB8), 'D': (0x3A, 0x3F, 0x4A),
       'B': (0x6B, 0x3F, 0x22), 'S': (0x5B, 0x64, 0x70), 's': (0x44, 0x4B, 0x55)}
ACESA = {'G': (0xFF, 0xD9, 0x5A), 'g': (0xF5, 0xB3, 0x2E), 'D': (0xF5, 0xB3, 0x2E),
         # o mapa quase não tem vermelho para emprestar: as faixas da noite são fixas
         'R': (0x7A, 0x1F, 0x2A), 'r': (0x58, 0x16, 0x22)}
# (mapa, a bandeira: o mastro (x0, x1, y0, y1) e o pano (x0, x1, y0, y1), onde fica o pé do farol (centro x, base y))
LUGARES = {
    'largo': ((348, 349, 79, 101), (350, 359, 81, 90), (345, 107)),
    'alto': ((150, 151, 142, 162), (152, 161, 143, 151), (151, 163)),
}


def d2(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))


def apagar(px, caixa, w, lado=-1):
    """A bandeira vira o pedaço do mapa logo ao lado (à esquerda ou à direita, com a textura das ondas)."""
    x0, x1, y0, y1 = caixa
    passo = (x1 - x0 + 1) * lado
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = px[min(w - 1, max(0, x + passo)), y]


def main():
    linhas = FAROL.strip().split('\n')
    for tipo, (mastro, pano, (cx, base)) in LUGARES.items():
        dia = Image.open(RAIZ / 'img' / f'mapa-{tipo}-dia.png').convert('RGB')
        noite = Image.open(RAIZ / 'img' / f'mapa-{tipo}-noite.png').convert('RGB')
        # a cor da noite de cada cor do farol: onde o dia tem a cor mais parecida, o que a noite tem ali
        pd, pn = dia.load(), noite.load(); w, h = dia.size
        amostra = [(pd[x, y], pn[x, y]) for y in range(0, h, 2) for x in range(0, w, 2)]
        cor_noite = {}
        for k, c in COR.items():
            perto = sorted(amostra, key=lambda par: d2(par[0], c))[:40]
            cor_noite[k] = Counter(n for _, n in perto).most_common(1)[0][0]
        for img, px, noturno in ((dia, pd, False), (noite, pn, True)):
            apagar(px, mastro, w); apagar(px, pano, w, lado=1)   # o pano copia o mar da direita
            x0 = cx - 5; y0 = base - len(linhas) + 1
            for j, linha in enumerate(linhas):
                for i, ch in enumerate(linha):
                    if ch == '.':
                        continue
                    if noturno:
                        px[x0 + i, y0 + j] = ACESA.get(ch, cor_noite[ch])
                    else:
                        px[x0 + i, y0 + j] = COR[ch]
        dia.save(RAIZ / 'img' / f'mapa-{tipo}-dia.png', optimize=True)
        noite.save(RAIZ / 'img' / f'mapa-{tipo}-noite.png', optimize=True)
        print(f'mapa {tipo}: farol em ({cx}, {base})')


if __name__ == '__main__':
    main()
