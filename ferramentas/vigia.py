"""O Vigia dos sites da família (07/11/2026): confere se cada endereço abre (200), se é o site certo (um trecho do
título) e quanto falta para o certificado HTTPS vencer. Escreve o relatório em Markdown na saída e sai com erro se
algum site estiver com problema. Roda pelo .github/workflows/vigia.yml a cada 30 minutos; no computador:

    python3 ferramentas/vigia.py
"""
import datetime
import socket
import ssl
import sys
import urllib.request

SITES = [
    ('Família Linu', 'https://familia.linupedia.com.br/', 'Família Linu'),
    ('Linu Sites', 'https://sites.linupedia.com.br/', 'Linu Sites'),
    ('Digital Linu', 'https://digital.linupedia.com.br/', 'Digital Linu'),
    ('Linu Seguro', 'https://seguro.linupedia.com.br/', 'Linu Seguro'),
    ('Linu Farol', 'https://farol.linupedia.com.br/', 'Linu Farol'),
    ('LinuPedia', 'https://linupedia.com.br/', 'LinuPedia'),
]
# O Caddyfile usa o perfil “shortlived” da Let's Encrypt para todos os sites (certificado de 6 dias, renovado sozinho
# quando falta cerca de um terço). Menos de 2 dias quer dizer que a renovação travou.
DIAS_MINIMOS = 2


def dias_do_certificado(host):
    ctx = ssl.create_default_context()
    with socket.create_connection((host, 443), timeout=15) as s, ctx.wrap_socket(s, server_hostname=host) as t:
        fim = datetime.datetime.strptime(t.getpeercert()['notAfter'], '%b %d %H:%M:%S %Y %Z')
    return (fim - datetime.datetime.now(datetime.UTC).replace(tzinfo=None)).days


def conferir(nome, url, trecho):
    host = url.split('/')[2]
    problemas = []
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'vigia-familia-linu'})
        with urllib.request.urlopen(req, timeout=20) as r:
            html = r.read(400_000).decode('utf-8', 'replace')
            if r.status != 200:
                problemas.append(f'respondeu {r.status}')
            elif trecho not in html:
                problemas.append(f'abriu, mas sem “{trecho}” na página')
    except Exception as e:  # fora do ar, DNS, tempo esgotado, certificado inválido
        problemas.append(f'não abriu ({e.__class__.__name__}: {e})')
    try:
        dias = dias_do_certificado(host)
        if dias < DIAS_MINIMOS:
            problemas.append(f'o certificado HTTPS vence em {dias} dias')
    except Exception as e:
        dias = None
        problemas.append(f'não deu para ler o certificado ({e.__class__.__name__})')
    return problemas, dias


def main():
    linhas, ruins = [], 0
    for nome, url, trecho in SITES:
        problemas, dias = conferir(nome, url, trecho)
        estado = 'ok' if not problemas else '; '.join(problemas)
        ruins += bool(problemas)
        linhas.append(f'| {nome} | {url} | {estado} | {dias if dias is not None else "?"} |')
    agora = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).strftime('%d/%m/%Y %H:%M')
    print(f'Conferência de {agora} (Brasília).\n\n| Site | Endereço | Estado | Dias do certificado |\n|---|---|---|---|')
    print('\n'.join(linhas))
    sys.exit(1 if ruins else 0)


if __name__ == '__main__':
    main()
