"""As rotas da família com os preços dos irmãos (07/11/2026). Lê o rotas.json e o precos.json de cada irmão e
reescreve, no index.html, o bloco das rotas (entre <div class="rotas" ...> e o fim dele) e os “a partir de” da legenda
(<p class="ilha-preco" data-irmao="…">). O resto da página continua sendo editado à mão.

    python3 ferramentas/rotas.py               com os preços atuais do GitHub (é o que o Actions roda antes de publicar)
    python3 ferramentas/rotas.py --local       com os repositórios irmãos ao lado deste, no computador
    python3 ferramentas/rotas.py --conferir    só diz se a página está em dia (sai com erro se não estiver)
"""
import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).resolve().parent.parent
FONTES = {  # onde mora o preço de cada irmão: o repositório e o arquivo
    'sites': ('linu-sites', 'ferramentas/pagina/precos.json'),
    'digital': ('digital-linu', 'precos.json'),
    'seguro': ('linu-seguro', 'precos.json'),
    'farol': ('linu-farol', 'precos.json'),
}
NOMES = {'sites': 'Linu Sites', 'digital': 'Digital Linu', 'seguro': 'Linu Seguro', 'farol': 'Linu Farol'}
ILHA = {'sites': ('ilha-sites-p.png', 66, 41), 'digital': ('ilha-digital-p.png', 58, 35), 'seguro': ('ilha-seguro-p.png', 61, 37)}


def ler(irmao, local):
    repo, arquivo = FONTES[irmao]
    if local:
        texto = (RAIZ.parent / repo / arquivo).read_text(encoding='utf-8')
    else:
        url = f'https://raw.githubusercontent.com/Seiabras/{repo}/main/{arquivo}'
        texto = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'familia-linu'}), timeout=30).read().decode()
    dados = json.loads(texto)
    if irmao == 'sites':  # o Linu Sites guarda por moeda; os mensais têm o nome começando com plano_
        return {k: {'valor': v, 'tipo': 'mensal' if k.startswith('plano_') else 'unico'} for k, v in dados['BRL'].items() if isinstance(v, int)}
    return dados['servicos']


def brl(v, html=True):
    return ('R$&nbsp;' if html else 'R$ ') + f'{v:,}'.replace(',', '.')


def soma(itens, html=True):
    u = sum(p['valor'] for p in itens if p['tipo'] == 'unico')
    m = sum(p['valor'] for p in itens if p['tipo'] == 'mensal')
    b = (lambda t: f'<b>{t}</b>') if html else (lambda t: t)
    partes = ([b(brl(u, html))] if u else []) + ([b(brl(m, html)) + ' por mês'] if m else [])
    return ' + '.join(partes)


def rotas_html(rotas, precos):
    blocos = []
    for r in rotas:
        itens = [(k, sid, nome, precos[k][sid]) for k, sid, nome in r['itens']]
        paradas = []
        for k, *_ in itens:
            if k not in paradas:
                paradas.append(k)
        stops = ''.join(f'<li><img class="pixel" src="img/{ILHA[k][0]}" alt="" width="{ILHA[k][1]}" height="{ILHA[k][2]}"><span>{NOMES[k]}</span></li>' for k in paradas)
        lis = '\n'.join(f'              <li>{nome}<span class="valor">{brl(p["valor"])}{" por mês" if p["tipo"] == "mensal" else ""}</span><small class="de-{k}">{NOMES[k]}</small></li>' for k, _, nome, p in itens)
        valores = [p for *_, p in itens]
        msg = (f'Olá, Família Linu! Quero um orçamento da rota {r["nome"]}: ' + ', '.join(n for _, _, n, _ in itens)
               + f'. Estimativa pela página: a partir de {soma(valores, False)}.')
        dest = r.get('destaque')
        blocos.append(f'''          <article class="rota{' rota-destaque' if dest else ''}">
            <h3 class="rota-nome">Rota {r["nome"]}</h3>
            <p>{r["texto"]}</p>
            <ol class="rota-paradas" data-mov-grupo="lado" title="As ilhas desta rota">{stops}</ol>
            <ul class="rota-itens">
{lis}
            </ul>
            <p class="rota-total">a partir de {soma(valores)}</p>
            <a class="botao{'' if dest else ' botao-linha'}" href="https://wa.me/5524981013398?text={quote(msg)}" target="_blank" rel="noopener">Pedir esta rota</a>
          </article>''')
    return '\n'.join(blocos)


def main():
    local = '--local' in sys.argv
    precos = {k: ler(k, local) for k in FONTES}
    rotas = json.loads((RAIZ / 'rotas.json').read_text(encoding='utf-8'))['rotas']
    pagina = RAIZ / 'index.html'
    antes = pagina.read_text(encoding='utf-8')
    abre = '<div class="rotas" data-mov-grupo="sobe">'   # as rotas entram em cascata (js/movimento.js)
    ini = antes.index(abre) + len(abre + '\n')
    fim = antes.index('        </div>\n        <p class="rotas-nota" data-mov="aparece">', ini)
    depois = antes[:ini] + rotas_html(rotas, precos) + '\n' + antes[fim:]
    # a legenda: o menor preço de entrega única de cada irmão (no Linu Sites, o site de apresentação); o mensal fica de
    # fora para não comparar coisas diferentes
    menor = {'sites': precos['sites']['apresentacao']['valor'],
             'digital': min(p['valor'] for p in precos['digital'].values() if p['tipo'] == 'unico'),
             'seguro': min(p['valor'] for p in precos['seguro'].values() if p['tipo'] == 'unico'),
             # o farol é mensal por natureza: o menor plano mensal
             'farol': min(p['valor'] for p in precos['farol'].values() if p['tipo'] == 'mensal')}
    rotulo = {'sites': 'Site a partir de', 'digital': 'Serviços a partir de', 'seguro': 'Serviços a partir de',
              'farol': 'Painel a partir de'}
    sufixo = {'farol': ' por mês'}
    depois = re.sub(r'(<p class="ilha-preco" data-irmao="(\w+)">).*?(</p>)',
                    lambda m: m.group(1) + f'{rotulo[m.group(2)]} {brl(menor[m.group(2)])}{sufixo.get(m.group(2), "")}' + m.group(3), depois)
    if '--conferir' in sys.argv:
        # a versão dos arquivos (?v=, do versao-arquivos.py) não conta na comparação
        sem_v = lambda s: re.sub(r'\?v=[0-9a-f]{8}', '', s)
        igual = sem_v(depois) == sem_v(antes)
        print('As rotas estão em dia.' if igual else 'As rotas não batem com os preços dos irmãos.')
        sys.exit(0 if igual else 1)
    if depois != antes:
        pagina.write_text(depois, encoding='utf-8')
        print('index.html: rotas e legenda atualizadas com os preços dos irmãos.')
    else:
        print('Nada a mudar: as rotas já estão com os preços atuais.')


if __name__ == '__main__':
    main()
