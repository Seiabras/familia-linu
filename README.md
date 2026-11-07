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
| `index.html` | A página: abertura com o Linu e o álbum, os irmãos (o álbum de fotos), por onde começar, os pacotes da família, uma conversa só, a chamada da identidade e o contato. |
| `identidade.html` | A identidade visual da família, em `/identidade`. O `/identidade` do Linu Sites, do Digital Linu e do Linu Seguro leva para cá. A fonte é o `IDENTIDADE-LINU.md` do linuarquivos: mudou lá, muda aqui. |
| `404.html` | Página de erro. |
| `css/estilo.css` | Visual, com as três versões (celular até 699 px, tablet até 1099 px, computador) e o modo claro e escuro. |
| `js/tema-inicio.js` | Aplica o tema escolhido antes de pintar. |
| `js/familia.js` | O botão do tema, o copiar das cores (na identidade) e as entradas ao rolar. |
| `img/` | O Linu (`linu-frente.png`; `linu-album.png`, com o álbum), a estação do Linu Sites de dia e de noite, o iglu do Linu Seguro, os ícones e a imagem de compartilhar. |
| `fontes/` | Nunito (licença OFL, `OFL.txt`), servida pelo próprio site. |
| `arte/` | O pedido da pose do Linu com o álbum, feito pela API de imagens a partir do `linu-frente.png` (a tentativa aprovada em `aprovada.json`; as tentativas ficam fora do git). |
| `ferramentas/compartilhar/` | A imagem de compartilhar (`img/compartilhar.png`, 1200 × 630): `node ferramentas/compartilhar/gerar.mjs`. |
| `deploy/` | A publicação na VM: o `receber.sh`, a preparação, o bloco do Caddy, a conferência das páginas e o `ORACLE.md`. |
| `IDENTIDADE.md` | O objeto e a cor deste site. |
| `DIRETRIZES-UX.md` | As diretrizes de interface e desempenho de todos os projetos. |

## O que a página faz

- **O álbum dos irmãos:** uma foto de cada, presa com fita, com o objeto dele (a estação, o visor, o iglu, o caderno),
  o preço de entrada e o link. A estação do Linu Sites troca de dia para noite com o tema.
- **Por onde começar:** quatro frases (“Ainda não apareço na internet”, “Tenho medo de golpe”…), cada uma levando ao
  irmão certo ou ao Raio-X dele.
- **Pacotes da família:** só os que juntam os irmãos (Abrir as portas, Crescer com segurança, Tudo junto), cada item com
  a etiqueta de quem faz e o preço de referência do site dele. Os pacotes de um serviço só ficam no site de cada irmão.
  O botão abre o WhatsApp com a mensagem pronta (funciona sem JavaScript). **Mudou um preço num irmão, muda aqui:** os
  itens e os totais estão escritos no `index.html`.
- **Uma conversa só:** um contato, uma proposta, cada irmão faz a sua parte.

## Ver no computador

```bash
python3 -m http.server 8000
```
