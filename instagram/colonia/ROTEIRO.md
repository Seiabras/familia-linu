# A Colônia do Linu: roteiro da Temporada 1

Proposta de 16/11/2026, ainda em rascunho: nada vai ao ar antes de o texto e a data de cada episódio serem aprovados
(`linuarquivos/INSTAGRAM.md`, seção 7). A ficha do projeto, com a referência e os riscos, está em
`linuarquivos/projetos/colonia-do-linu.md`.

## A série numa frase

Antes de viajar o mundo, o Linu morava numa ponta de pedra na beira da Antártica. **Cada pessoa que segue a LinuPedia
ganha um pinguim nessa colônia**, e cada episódio conta uma coisa que acontece de verdade com os pinguins-de-barbicha.
A Temporada 1 termina com o Linu partindo; da Temporada 2 em diante, cada episódio é uma parada da viagem (um país, uma
língua), o que liga a série à LinuPedia sem virar propaganda.

## As regras da série

- **Fato com fonte, invenção dita como invenção.** O que acontece com os pinguins (ninho, ovos, skua, foca, krill) é
  real e tem a fonte no último quadro e na legenda. O Linu, os apelidos e as conversas são invenção.
- **A colônia cresce com o perfil.** A cena de cada episódio é desenhada com o número de seguidores do dia (um pinguim
  sem nome por pessoa) e os pinguins do mural com o cachecol e o ofício de cada um.
- **Quem comenta entra na história.** Na legenda: “Diz nos comentários o que o seu pinguim faz na colônia”. A cada
  episódio, de dois a cinco pinguins do mural ou dos comentários aparecem com o apelido. Só com o apelido que a pessoa
  escolheu; nunca o nome verdadeiro sem ela pedir.
- **Um gancho no fim.** Todo episódio fecha com uma pergunta que o próximo responde, e a temporada tem um mistério que
  só se resolve no fim (o krill).
- **O Linu é o único com acessório e aparece maior** (`instagram/DESIGN.md`). Os moradores têm o cachecol e o objeto
  do ofício, nada na cabeça.
- **Só bicho da Antártica:** pinguim, skua, petrel-gigante, foca-leopardo, krill. Urso-polar nunca.

## O formato de um episódio

| Peça | Como é |
|---|---|
| Reel | 30 a 45 s, 1080 × 1920, de 5 a 8 cenas da colônia em pixel art (a mesma grade de `js/colonia-pinguim.js`), com legenda na tela em Pixelify Sans e trilha feita em código, como os reels da Trupehh (`INSTAGRAM.md`, seção 4) |
| Capa | `epNN-capa.png` (`node ferramentas/instagram/colonia.mjs`): a cena e a placa “Episódio N”, com o título no miolo, para o corte 3:4 do perfil |
| Último quadro | “O que é verdade neste episódio”, com a fonte, e “Monte o seu pinguim: link na bio” |
| Legenda | O episódio em 3 a 5 frases, a pergunta para os comentários, as fontes e poucas hashtags do assunto |
| Ritmo | **Um episódio a cada 15 dias** no começo, alternando com a roda de posts do perfil; só passar a semanal se a produção aguentar |

## Os personagens

- **O Linu:** o pinguim-de-barbicha da LinuPedia (o desenho de `img/mapa-linu/`, nunca redesenhado). Curioso, quer saber
  o porquê de tudo, e é por isso que um dia vai embora.
- **Os moradores:** os pinguins do mural, cada um com um ofício que existe de verdade na vida da colônia: construtor de
  ninhos, pescador de krill, guardião das pedras, vigia do céu, babá da creche, mergulhador, cantor e morador.
- **Quem ameaça:** a skua e o petrel-gigante (no céu, atrás de ovos e filhotes) e a foca-leopardo (no mar). São bichos
  fazendo o que bicho faz, não vilões; a série não põe maldade neles.

## Os episódios

| Ep. | Título | O que acontece | O que é verdade | Gancho |
|---|---|---|---|---|
| 1 | A primeira pedra | O Linu chega a uma ponta de pedra vazia, na beira da geleira, e começa a juntar pedrinhas. Os primeiros pinguins chegam (os primeiros seguidores). | O pinguim-de-barbicha faz um ninho redondo de pedras. | Uma pedra do ninho some durante a noite. |
| 2 | Dois ovos | Os ninhos se enchem; cada casal tem dois ovos, e os dois revezam no ninho. | São dois ovos; o macho e a fêmea chocam em turnos de uns 6 dias. | No céu, uma sombra que não é nuvem. |
| 3 | A sombra no céu | A skua passa baixo. Os vigias do céu dão o alarme. | Em terra, a skua e o petrel-gigante são os principais predadores, quase sempre de ovos e filhotes. | Quem vai proteger os ninhos de noite? |
| 4 | Os guardiões das pedras | A colônia se organiza: os guardiões ficam na borda, e o pinguim-de-barbicha mostra o gênio que tem. | É tido como o pinguim mais bravo: ataca o que chega perto do ninho, até outro pinguim. | Um ovo começa a rachar. |
| 5 | Trinta e sete dias | Os filhotes nascem, cinzentos e fofos. | Os filhotes nascem com uns 37 dias de choco, com as costas cinzentas e a frente branca. | Os pais precisam ir ao mar ao mesmo tempo. E os filhotes? |
| 6 | A creche | Os filhotes ficam juntos enquanto os pais pescam; as babás da creche entram em cena. | Com 20 a 30 dias, os filhotes saem do ninho e se juntam numa creche. | Por que ninguém na colônia dorme direito? |
| 7 | Dormir dez mil vezes | O episódio leve: o Linu tenta dormir e cochila a cada poucos segundos. | Pinguins-de-barbicha chocando dormem em cochilos de uns 4 s, mais de 10 mil por dia (a conferir na fonte, abaixo). | Os pescadores voltam do mar com menos krill. |
| 8 | O mar escuro | Na saída para o mar, a foca-leopardo espera. Os mergulhadores aprendem a sair em grupo. | No mar, a foca-leopardo é o principal predador. | Por que é preciso ir cada vez mais longe para achar krill? |
| 9 | Onde está o krill? | O mistério da temporada: o krill está se afastando. O Linu quer entender o porquê. | O krill está diminuindo com as mudanças do clima, e a colônia sente; na Ilha Elefante, a população caiu pela metade em uns 50 anos (a conferir na fonte, abaixo). | O Linu decide ir ver o mundo para entender. |
| 10 | A partida | A colônia, já com todos os seguidores, se despede do Linu. Os pinguins com nome aparecem todos. | Com 50 a 60 dias, os filhotes trocam as penas e vão para o mar. | A primeira parada da viagem (Temporada 2). |

## Os mistérios da temporada

- Quem anda levando as pedras dos ninhos? (Responder só se a fonte confirmar o roubo de pedras entre
  pinguins-de-barbicha; está documentado em pinguins-de-adélia. Sem fonte, o mistério muda.)
- Por que o krill está ficando cada vez mais longe? (O episódio 9.)
- O que tem do outro lado da geleira?
- Para onde o Linu vai quando partir? (O episódio 10 e a Temporada 2.)

## Fatos e fontes

Lido em 16/11/2026: o artigo “Chinstrap penguin” da Wikipédia em inglês. Pela regra das fontes, o que é número ou
afirmação científica tem de ser conferido na fonte que o artigo cita antes de ir ao ar.

| Fato | Episódio | Situação |
|---|---|---|
| Ninho redondo de pedras; dois ovos; turnos de uns 6 dias; filhotes com uns 37 dias; creche aos 20 a 30 dias; troca de penas e mar aos 50 a 60 dias | 1, 2, 5, 6, 10 | Wikipédia; conferir os números na fonte citada |
| Skua-parda, skua-polar-do-sul e petrel-gigante-do-sul como predadores em terra, quase sempre de ovos e filhotes | 3 | Wikipédia; conferir na fonte citada |
| O mais bravo dos pinguins, ataca até outros pinguins perto do ninho | 4 | Wikipédia; conferir na fonte citada |
| Cochilos de uns 4 s, mais de 10 mil por dia, umas 11 h de sono por metade do cérebro | 7 | Conferir no estudo original (Libourel e outros, *Science*, 2023, sobre os microcochilos de pinguins-de-barbicha) |
| Foca-leopardo como principal predador no mar; perda de 5% a 20% por ano | 8 | O número fica de fora até ser conferido |
| Krill diminuindo com o clima; queda de 50% na Ilha Elefante (expedição de 2019) e de 63% na Ilha Zavodovski (estudo de 2026) | 9 | Conferir as duas fontes; o de 2026 é recente e precisa de fonte primária |
| Roubo de pedras entre vizinhos | mistério | Sem fonte para o pinguim-de-barbicha ainda |
