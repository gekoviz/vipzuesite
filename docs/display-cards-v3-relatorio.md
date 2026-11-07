# Display Cards V3 — relatório (07/11/2026)

Branch `feat/display-cards-v3`. **Não publicado** — aguarda autorização.

## 1. Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `index.html` | Conteúdo interno do `#vzHeroCards` (mesmo cluster, mesmo lugar no DOM). |
| `css/hero.css` | Bloco `.vz-hero-cards*` (só ele). |
| `js/hero-display-cards.js` | Temporização do ciclo e retomada após rolagem. |

Não tocados: `js/hero.js` (o contrato `setHeroReady`/`setHeroRange` continuou servindo), `light-field.js`, `scroll-narrative.js`, outras seções, imagens, CTA/WhatsApp, SEO, analytics, fontes, header.

## 2. HTML removido e substituído

- **Removidos:** `.vz-hero-cards__signature` (a linha "PRESENÇA FORTE · …" sobre a águia), `.vz-hero-cards__support` (a frase abaixo dos cards) e os campos `__title` / `__description` / `__meta` dos dois cards, com as seis mensagens antigas. Também saíram os `data-card`, que não tinham uso.
- **Agora:**
  - card 1 `.vz-hero-cards__statement`, com três `<span>`: PRESENÇA FORTE / MARCA VALORIZADA / MAIS OPORTUNIDADES;
  - card 2 `.vz-hero-cards__argument`, com a mensagem inteira;
  - as superfícies viraram `<article>`;
  - `id="vzHeroCards"` adicionado; `data-hero-cards` mantido, porque é por ele que o `hero.js` encontra o grupo;
  - `data-active="first"` inicial.
- **Unicidade:** cada copy existe uma única vez no DOM.

## 3. CSS

- **Material:** `linear-gradient(135deg, #302A22 0%, #22201D 55%, #22201D 100%)` opaco (antes Mocha→Grafite a 96 %).
- **Borda:** Páprica a .35 em repouso, .65 no destaque e 1 px.
- **Texto:** `#F3EDE3`, sem opacidade reduzida (saiu o `opacity: .88` do card em espera).
- **Tipografia:**
  - card 1: Switzer 15 px / 600 / 1.4 / 0.04em, maiúsculas, centralizado, `gap` de 6 px;
  - card 2: Switzer 14 px / 500 / 1.45, centralizado, quebra natural, sem nowrap, ellipsis, clamp ou overflow escondendo texto.
- **Tamanhos:** card 1 com 112 px de altura e card 2 com 126 px; padding de 15 × 17 px e raio de 14 px. A largura é a mesma da V2.
- **Sombras e hover:** iguais à V2 (mesmos valores, mesma cor).
- **Removidos:** regras exclusivas das copies canceladas, incluindo o apoio radial da assinatura e as fontes menores da faixa 1024–1199.
- **Posição externa preservada:** `top`, `right`, `width`, `z-index` e breakpoints iguais. Sem a assinatura, a pilha subiria 32 px (29 px em telas baixas). Por isso a folga interna `--vzc-lift` ganhou exatamente essa altura, e os cards ficam no mesmo ponto da tela: em 1440 × 900 o 1º card repousa em y = 410, como antes.
- **Distância entre os planos:** `--vzc-step` passou de 88 para 98 px (94 em telas baixas). Assim o 2º card, ao voltar, não encosta na 3ª linha do 1º. A sobreposição continua (≈ 14 px).

## 4. Integração 3D

- Saiu o par `skewY(-8deg)` / `skewY(8deg)` (superfície inclinada e texto desinclinado).
- A superfície recebe `rotateX(4deg) rotateY(-8deg) rotateZ(-4deg)`. O `.body` não tem transform, então borda, sombra e texto são um objeto só e o texto acompanha o plano.
- **Desvio técnico:** a `perspective: 900px` fica no `.vz-hero-cards__motion`, o pai direto da superfície, e não no `.stack`. No stack ela não chegaria à superfície, porque o invólucro animado pelo GSAP achata o 3D dos filhos. O efeito é o mesmo pedido: perspectiva centrada em cada card.
- Nenhum tween toca superfície, corpo ou texto (verificado: 0 tweens nesses elementos).

## 5. Temporização

- Uma timeline só, `repeat: -1`:
  - 0 s: destaque do 1º card;
  - 0,55 s: o 1º chega à posição;
  - 2,4 s: o 1º volta;
  - 3 s: destaque do 2º;
  - 5,4 s: o 2º volta;
  - 6 s: recomeça.
- A duração de 6 s sai da construção: `MOVE_OUT = CYCLE_BEAT − RETURN_AT`, então o último retorno termina em 6,0. Não há tween vazio e há um aviso no console se a duração divergir.
- Saíram os 3,9 s de espera e o estado intermediário `none`.
- O 2º card vai a x 8 (antes 10), como na especificação.
- Retomada após rolagem: 700 ms (antes 1 s).
- Sem `setInterval`, RAF ou ScrollTrigger novos.

## 6. Estados preservados

Visibilidade só com a Hero pronta, saída na Visão, volta sem repetir a entrada, pausa por rolagem, ponteiro, aba oculta e palco fora da tela, movimento reduzido estático e `dispose` com limpeza. A única mudança é que o estado de repouso agora é `first`.

## 7. Testes executados

Chrome headless (Chrome instalado, dirigido por CDP com o WebSocket nativo do Node; sem dependências novas). Motivo: o painel do app ficou em segundo plano e não completava a entrada da Hero, e o navegador do DevTools reiniciava a cada chamada.

| Teste | Resultado |
|---|---|
| Conteúdo | 2 cards, 0 elementos antigos, cada copy 1×. |
| Linhas | Cada expressão em 1 linha em todas as larguras. Mensagem: 3 linhas (≥ 1280), 4 linhas (1100). |
| Overflow do corpo | 0 em todas as larguras. Texto dentro dos limites projetados da própria superfície nos dois destaques. |
| 1280×720, 1366×768, 1440×900, 1920×1080, 1100×700 | Visíveis na Hero pronta, sem cobrir olhos, bico, headline, CTA, logo ou menu (screenshots). |
| Ritmo (13 s) | Trocas em 0 / 2,99 / 5,98 / 8,98 / 11,98 s: sem atraso acumulado. Duração da timeline: 6,000 s. Controladores: 1. |
| Rolagem | Pausa na hora, cards visíveis, sem reset. Retoma ≈ 0,7 s depois do último evento. |
| Hover | Pausa, segura parado e retoma ao sair. |
| Visão | Cards somem e o ciclo pausa (a partir de 80 px de rolagem). Voltando ao topo, reaparecem e o ciclo segue. |
| Movimento reduzido | Ciclo parado em 0, sem transform nos invólucros, dois planos legíveis. |
| 390×844 e 768×1024 (toque) | Componente `display: none`, sem rolagem lateral. |
| Console | Sem erros nem avisos. |
| `node tools/test-hero-voo.mjs` | 11/11. |
| `node tools/build-site.mjs` | 275 arquivos. |
| `git diff --check` | Limpo. |

## 8. Screenshots (reais, `docs/qa/display-cards-v3/`, fora do git)

`antes-1440`, `antes-1280`, `depois-{1280x720, 1366x768, 1440x900, 1920x1080, 1100x700}-card1-destaque`, `…-card2-destaque`, `depois-1440-entrada-sem-cards`, `depois-1440-visao-sem-cards`, `depois-1440-movimento-reduzido`.

## 9. Limitações

- **Fase de voo:** o voo da águia está desligado desde o pedido anterior ("tire o video da aguia"), então não há fase de voo para fotografar. O screenshot de entrada mostra a Hero antes de ficar pronta, sem cards.
- **Aba oculta:** não foi testada de fato (o headless não troca a visibilidade). O código desse caminho não mudou.
- Testado só no Chromium (sem Safari ou Firefox). O antialiasing do texto em plano 3D pode variar entre navegadores.
