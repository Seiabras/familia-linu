# Design do Instagram da LinuPedia: a Antártica do Linu

O documento único do perfil (11/11/2026). Tudo o que vai para o feed, os reels, os stories e os destaques segue
daqui. A regra de conteúdo (mais conteúdo original que propaganda, as séries, o calendário, agendar) está no
`linuarquivos/INSTAGRAM.md`; a identidade comum da família, no `linuarquivos/IDENTIDADE-LINU.md`.

## A ideia, numa frase

O perfil é a **Antártica onde o Linu mora**: um mar gelado com a geleira ao fundo e uma ilha para cada irmão. Quem
rola o perfil está olhando o mapa de cima; quem abre um post está visitando uma ilha.

Por que funciona: o Linu é um pinguim, as ilhas do mapa já são de neve e gelo, o Linu Seguro já é um iglu. A
Antártica junta tudo num lugar só sem inventar nada novo.

## O mundo

| Elemento | Como é | Onde aparece |
|---|---|---|
| A geleira | Neve no alto, parede de gelo com fendas, linha escura e espuma na água; a borda sobe e desce em degraus de 3 px | No alto do mosaico e no topo das capas |
| O mar | Faixas de cinco tons, da água de degelo (perto da geleira) ao fundo; a divisa ondula; marolas em fileiras desencontradas | Fundo do mosaico e dos stories |
| Icebergs | Topo em degraus até um pico, lado claro e lado de sombra, linha d’água branca e reflexo | Espalhados, nunca atrás de placa ou texto |
| As ilhas | As do mapa da Família Linu (`img/ilha-*.png`), recortadas do mar, com dois anéis de água rasa | Uma por post do mosaico |
| As pontes | Tábuas com contorno escuro, passando por baixo das ilhas e de um quadro para o outro | O mosaico |
| Pinguins | Pequenos, de frente, na beira da geleira; o Linu é o maior e o único com acessório | O mosaico e as capas |

- **Pixel art de verdade:** desenho numa grade fixa e ampliado em escala inteira (o mosaico é 540 × 480 em 6×). Nada
  de redimensionar pixel art por um número quebrado.
- **Só Antártica:** pinguim, foca, baleia, petrel, krill. Urso-polar é do Ártico e nunca entra.

## Cores

| Uso | Código |
|---|---|
| Neve | `#F4FBFF` (brilho `#FFFFFF`, sombra `#DCEFF9`) |
| Parede de gelo | `#C4E6F6`, fendas `#8CC2E2` |
| Contorno do gelo | `#1F4E7A` |
| Mar, do raso ao fundo | `#4FA3D6`, `#3D8CC6`, `#3278B4`, `#2A66A0`, `#24578C` |
| Marolas | `#7DBDE3` e `#A9D6EF` |
| Água rasa das ilhas | `#6FB1D4` e `#54BCE3` |
| Placas | papel `#FFF6DC`, borda e sombra `#1F2A44`, texto `#0F172A` |
| Cor de cada irmão (só no nome e nos destaques do post dele) | Sites `#1D4ED8`, Digital `#C2410C`, Seguro `#0E7490`, Farol `#B91C1C`, Família e LinuPedia `#2563EB` |

Sem degradê: o mar é feito de faixas, como a água do mapa. Sem brilho, sem roxo (a aurora da noite é verde, e só nas
peças de noite).

## Letras

- **Pixelify Sans** nos títulos, nas placas e nos endereços (a letra de pixel do mapa).
- **Nunito** no texto corrido dos slides.
- Título de capa com no máximo 6 palavras; slide com no máximo 40 palavras.

## As peças

| Peça | Medida | Como é |
|---|---|---|
| Quadro do mosaico | 1080 × 1440 (3:4) | Um pedaço do mapa, com a ilha e a placa do nome embaixo. O mosaico é 3 × 2: a linha de cima (Sites, Família, Digital) tem a geleira; a de baixo (Seguro, LinuPedia, Farol), o mar aberto |
| Segundo slide de um irmão | 1080 × 1440 | A carta náutica (papel `#EEF4F7` com grade), a ilha grande numa moldura, o nome na cor do irmão, o que faz, o preço “a partir de” numa placa e o endereço |
| Carrossel de conteúdo | 1080 × 1440 | Capa com a geleira em cima e o título numa placa; miolo na carta náutica |
| Reel e story | 1080 × 1920 | Mar e geleira; texto longe do topo e do pé |
| Capa de destaque | 1080 × 1920, círculo no meio | Uma ilha por destaque, no mar |

## O mosaico

- **3 × 2, seis posts:** Linu Sites, Família Linu e Digital Linu em cima; Linu Seguro, LinuPedia e Linu Farol embaixo. As
  pontes ligam a casa do meio aos irmãos e a LinuPedia ao iglu e ao farol.
- **Postar de trás para frente** (o mais novo fica em cima à esquerda) e sempre de 3 em 3: um post solto desloca o
  desenho todo. A ordem está no `README.md` desta pasta.
- **Depois do mosaico:** os posts seguintes entram em fileiras de 3 que continuam o mapa (mais mar, mais ilhas, a
  geleira de outro ângulo) ou em fileiras de conteúdo com capas da mesma família.

## Voz

A mesma da família: direta, calorosa, sem jargão. O Linu fala pouco e mostra muito. Nada de “transforme”, “eleve”,
“soluções”, emoji como ícone ou maiúsculas espaçadas.

## Séries que cabem neste mundo

- **Diário da Antártica:** curiosidades verdadeiras do continente e dos pinguins, com fonte (o Linu como guia). Os três primeiros (11/11/2026) são a fileira de cima do perfil: as capas são o planalto, as montanhas e o céu, que continuam o mosaico para cima (`ferramentas/instagram/diario.mjs`).
- **Uma ilha por vez:** o que cada irmão faz, com um caso real (só com o ok de quem é o cliente).
- **De onde vem a palavra:** a curiosidade da LinuPedia, nas línguas do app.
- **Bastidores da expedição:** como um projeto da família foi feito, do esboço ao ar.

## Onde está cada coisa

- Gerador: `ferramentas/instagram/mosaico.mjs`. Mudou uma cor ou uma posição: mudar aqui e no script, e refazer.
- Peças prontas, ordem de postar, legendas e bio: `instagram/README.md` e `instagram/mosaico/`.
- Links da bio: `links.html`, em https://familia.linupedia.com.br/links.
