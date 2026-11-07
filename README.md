# Família Linu

O endereço que junta os irmãos: **https://familia.linupedia.com.br**. O [Linu Sites](https://sites.linupedia.com.br)
faz o site, o [Digital Linu](https://digital.linupedia.com.br) cuida das redes e dos anúncios, o
[Linu Seguro](https://seguro.linupedia.com.br) protege o negócio, e a [LinuPedia](https://linupedia.com.br) é onde o
Linu nasceu. Cada irmão vive no seu repositório, com publicação própria; este também.

Uma página só e a identidade da família, sem dependências: HTML, CSS e um pouco de JavaScript. A cada push na `main`,
o GitHub Actions entrega o site na VM da Oracle e o Caddy serve o subdomínio (detalhes em
[`deploy/ORACLE.md`](deploy/ORACLE.md)).

## Como está organizado

| Arquivo / pasta | O que tem |
|---|---|
| `index.html` | A página: o mapa das ilhas na abertura (com os nomes por cima), a legenda (as ilhas), para onde ir, as rotas da família (os pacotes que passam por mais de uma ilha), uma conversa só, a chamada da identidade e o contato. |
| `identidade.html` | A identidade visual da família, em `/identidade`. O `/identidade` do Linu Sites, do Digital Linu e do Linu Seguro leva para cá. A fonte é o `IDENTIDADE-LINU.md` do linuarquivos: mudou lá, muda aqui. |
| `404.html` | Página de erro. |
| `css/estilo.css` | Visual da carta náutica, com as três versões e o modo claro e escuro. |
| `css/marcas.css` | A posição dos nomes das ilhas por cima do mapa, em porcentagem (gerada junto com o `index.html`). |
| `css/fontes-pixel.css` | A Pixelify Sans dos títulos, servida pelo próprio site (`fontes/pixelify-sans-*.woff2`, licença em `fontes/OFL-pixelify.txt`). |
| `js/tema-inicio.js` | Aplica o tema escolhido antes de pintar. |
| `js/familia.js` | O botão do tema, o copiar das cores (na identidade) e as entradas ao rolar. |
| `img/mapa-*.png` | O mapa em pixel art: largo (384 × 216, mostrado em 2× ou 3×) e alto (176 × 312, em 2×), de dia e de noite. |
| `img/ilha-*.png` | Cada ilha recortada do mapa largo (a legenda); as `-p` são a metade, reduzidas por média, para as rotas. |
| `img/` (o resto) | O Linu (`linu-frente.png`, `linu-album.png`), os ícones e a imagem de compartilhar. |
| `fontes/` | Nunito (texto) e Pixelify Sans (títulos), licença OFL. |
| `arte/` | Os pedidos à API de imagens: o mapa de dia com cinco ilhas, com sete (`-dia7`, o que vale) e de noite, e o Linu com o álbum. A tentativa aprovada de cada um está em `aprovada.json`; as tentativas ficam fora do git. |
| `ferramentas/compartilhar/` | A imagem de compartilhar (`img/compartilhar.png`): `node ferramentas/compartilhar/gerar.mjs`. |
| `ferramentas/conferir-visual.mjs` | A conferência visual que o Actions roda antes de publicar (cópia do `linuarquivos/modelos/ferramentas/`): 390, 820 e 1280 px, claro e escuro; reprova com rolagem lateral, erro no console, arquivo faltando ou falha séria de acessibilidade, e guarda as capturas como artefato. No computador: `node ferramentas/conferir-visual.mjs --raiz . --playwright <pasta do playwright> --axe <axe.min.js>`. |
| `ferramentas/vigia.py` e `.github/workflows/vigia.yml` | O Vigia dos sites da família: a cada 30 minutos confere se os cinco endereços abrem, se são o site certo e se o certificado HTTPS não está para vencer; com problema, abre um aviso (issue) “Vigia: site com problema”, que o GitHub manda por e-mail, e fecha sozinho quando volta. Toda segunda, procura links quebrados nos quatro sites. |
| `deploy/` | A publicação na VM: o `receber.sh`, a preparação, o bloco do Caddy, a conferência das páginas e o `ORACLE.md`. |
| `IDENTIDADE.md` | O objeto e a cor deste site. |
| `DIRETRIZES-UX.md` | As diretrizes de interface e desempenho de todos os projetos. |

## O que a página faz

- **O mapa das ilhas:** sete ilhas, uma por irmão (a estação do Linu Sites, o estúdio do Digital Linu, o iglu do Linu
  Seguro, o acampamento da LinuPedia), a casa da Família no meio com o Linu no cais e duas ilhas vagas para os irmãos
  que vierem. De noite, as janelas acendem e aparece a aurora. O mapa é pixel art de verdade: a grade fica fixa e a
  página só mostra em 2× ou 3× exatos (o largo a partir de 800 px, em 3× a partir de 1200 px; o alto no celular).
- **Os nomes por cima:** HTML, não desenho; cada um leva ao site do irmão. A posição de cada nome está no
  `css/marcas.css`, em porcentagem da grade do mapa (384 × 216 no largo, 176 × 312 no alto).
- **As ilhas (a legenda), para onde ir e as rotas:** as rotas são os pacotes que passam por mais de uma ilha, com as
  paradas, os itens com a etiqueta de quem faz e o total. **Os preços vêm dos irmãos** (07/11/2026): as rotas ficam no
  `rotas.json` (cada item é o id de um serviço no `precos.json` do irmão), e o `ferramentas/rotas.py` reescreve o bloco
  das rotas e os “a partir de” da legenda. O Actions roda antes de cada publicação, com os preços atuais do GitHub, e
  publica de novo todo dia às 6h, então um preço mudado num irmão chega aqui no mesmo dia. No computador:
  `python3 ferramentas/rotas.py --local` (com os repositórios irmãos ao lado).
- **Irmão novo:** ocupa uma ilha vaga: pedir à API a ilha com a casa dele a partir do `img/mapa-*` atual (de dia e de
  noite), levar para a grade, e trocar a placa “Ilha vaga” pelo nome e o link.

## Ver no computador

```bash
python3 -m http.server 8000
```
