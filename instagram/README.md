# Instagram da LinuPedia: o mosaico das ilhas

O começo do perfil da LinuPedia (11/11/2026), que é a vitrine da LinuPedia, da família Linu e dos projetos que ela
traz (`linuarquivos/INSTAGRAM.md`, seção 8). As peças saem de `ferramentas/instagram/mosaico.mjs`; não editar as
imagens à mão.

## O mosaico 3 × 2

O design do perfil (a Antártica do Linu: a geleira, o mar, os icebergs, as cores e as letras) está no
[`DESIGN.md`](DESIGN.md). No perfil, seis posts formam o mapa das ilhas, com as pontes passando de um quadro para o
outro. Cada quadro tem 1080 × 1440 (o 3:4 da grade do perfil, sem corte).

| | coluna 1 | coluna 2 | coluna 3 |
|---|---|---|---|
| linha de cima (com a geleira) | Linu Sites (`quadro-00`) | Família Linu (`quadro-01`) | Digital Linu (`quadro-02`) |
| linha de baixo | Linu Seguro (`quadro-10`) | LinuPedia (`quadro-11`) | Linu Farol (`quadro-12`) |

`grade.png` é a prévia do perfil.

## A ordem de postar

O Instagram põe o post mais novo em cima à esquerda, então o mosaico se posta **de trás para frente**, sempre em
múltiplos de 3 (um post solto no meio desloca o desenho todo):

1. Linu Farol (`quadro-12`)
2. LinuPedia (`quadro-11`)
3. Linu Seguro (`quadro-10`)
4. Digital Linu (`quadro-02`)
5. Família Linu (`quadro-01`)
6. Linu Sites (`quadro-00`)

Cada post é um carrossel de dois slides: o quadro do mosaico e o `detalhe-<irmão>.png` (o que faz, o preço “a partir
de” e o endereço).

- **Publicar pelo app do celular**, escolhendo o tamanho original (3:4): pelo computador, o Instagram pode cortar em 4:5
  e o desenho perde a continuidade entre os quadros.
- **Antes do primeiro post**, o perfil tem de estar vazio ou com um número de posts múltiplo de 3.

## As legendas

| Post | Legenda |
|---|---|
| Linu Farol | No farol, uma luz para cada coisa do seu site: no ar, cadeado, rapidez e trancas, mais as visitas, o Google e o Instagram. Todo mês, o painel diz se está tudo aceso. Painel a partir de R$ 50 por mês. Link na bio. |
| LinuPedia | O acampamento onde o Linu nasceu: idiomas e áreas do conhecimento para estudar de graça, sem propaganda. Link na bio. |
| Linu Seguro | No iglu, cada bloco é uma proteção: golpes, senhas, cópias de segurança, e-mail e site. Serviços a partir de R$ 250. Link na bio. |
| Digital Linu | No estúdio: vídeo, redes sociais, anúncios, marca e automação para pequenos negócios. Serviços a partir de R$ 200. Link na bio. |
| Família Linu | A casa do meio. As pontes são as rotas: pacotes que passam por mais de uma ilha, com uma conversa só. Rotas a partir de R$ 2.100. Link na bio. |
| Linu Sites | Na estação, a planta é desenhada: sites, sistemas e aplicativos sob medida, para o celular, o tablet e o computador. Site a partir de R$ 1.200. Link na bio. |

Os preços são os “a partir de” de cada site em 11/11/2026: conferir antes de postar.

## A bio

- **Link:** https://familia.linupedia.com.br/links (a página de links da família, no lugar de um Linktree; `links.html`).
- **Texto sugerido:** “A LinuPedia e a família Linu: estudar de graça, e site, redes e segurança para pequenos negócios,
  cada um na sua ilha.”
