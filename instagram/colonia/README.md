# A Colônia do Linu (protótipo de 16/11/2026)

Uma série em episódios nos reels da LinuPedia: cada pessoa que segue ganha um pinguim na colônia do Linu, e cada
episódio conta como vivem os pinguins-de-barbicha de verdade. Ainda não aprovada; nada daqui vai ao ar sem aprovação.

| Arquivo | O que é |
|---|---|
| [`ROTEIRO.md`](ROTEIRO.md) | A Temporada 1: as regras da série, o formato, os personagens, os 10 episódios, os mistérios e os fatos com a situação de cada fonte |
| `ep01-capa.png` | A capa do episódio 1 (1080 × 1920), feita por `node ferramentas/instagram/colonia.mjs` |
| `ep01-grade.png` | A mesma capa no corte 3:4 do perfil, para conferir que o título não some |
| `../../colonia.html` | A página do mural (`/colonia`): a cena da colônia, montar o pinguim e o mural. Fora do menu e com `noindex` até a série ser aprovada |
| `../../js/colonia-pinguim.js` | O desenho do morador e da cena, o mesmo na página e nas capas |

## O que falta para sair do protótipo

1. **O mural com servidor.** Hoje guarda só no navegador. Precisa de um serviço pequeno da família (na linu-2, como os
   outros), com o filtro de apelido no servidor, uma fila de moderação antes de o pinguim aparecer para todos e um
   jeito de apagar o próprio pinguim (LGPD). Guardar o mínimo: apelido, cor, ofício, lugar e @, se a pessoa quiser.
2. **A contagem de seguidores.** O Instagram não entrega a lista de quem segue, só o número (pela API de conta
   profissional). A colônia desenha esse número em pinguins sem nome, e os do mural com nome. A bio e a página têm de
   dizer isso do jeito que é.
3. **A colônia inteira.** A cena da página mostra até uns 130 pinguins. Com milhares, precisa de uma vista que aproxime
   e afaste (ou de várias pedras), a decidir antes de passar de mil.
4. **O reel do episódio 1:** as cenas, a legenda na tela e a trilha, pelos geradores de vídeo da Trupehh.
5. **As fontes do roteiro conferidas** (a tabela “Fatos e fontes” do `ROTEIRO.md`).
