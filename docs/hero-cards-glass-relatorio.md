# Display Cards V5 — vidro, diagramação e celular — relatório (08/11/2026)

Pedido: "VIPZUE — PROMPT MESTRE V3 — HERO DESKTOP + MOBILE — DISPLAY CARDS, GLASS EFFECT E COMPOSIÇÃO FINAL", com as
referências 1536 × 864 (desktop) e 864 × 1536 (celular). Branch `feat/hero-cards-glass`. **Não publicado.**

## 1. Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `css/hero.css` | Bloco `.vz-hero-cards*` (material, diagramação, regra de ocultação e bloco do celular) e as variáveis da Hero no celular (`@media (max-width: 767px) .hero`). |
| `js/hero-display-cards.js` | Corte de elegibilidade (desktop **ou** celular em retrato) e pausa do ponteiro só com mouse/touchpad. |
| `index.html` | Card 1 em caixa baixa ("Presença forte / Marca valorizada / Mais oportunidades") e o comentário do bloco. |

**Não tocados:** `js/hero.js`, `js/config.js`, a águia (mesmo arquivo), o fundo, o header, o CTA (mesma função e
estilo), a Seção 03 e as outras seções. Nenhuma dependência nova.

## 2. Seletores — desktop

- `.vz-hero-cards`: variáveis `--vzc-mocha/ivory/paprika/graphite`, `--vzc-pad-x`, `--vzc-pad-y` e `--vzc-font`. Saíram `--vzc-glass-base` e `--vzc-glass-ink`. Posição, largura, `--vzc-h1/h2`, `--vzc-step`, `--vzc-shift` e `--vzc-lift` iguais.
- `.vz-hero-cards__surface` e o `@supports` do blur: o vidro novo (item 4). Inclinação, opacidade de entrada e transições iguais.
- `.vz-hero-cards__body`: um bloco à esquerda, centrado na altura, `padding: var(--vzc-pad-y) var(--vzc-pad-x)`, fonte e espaçamento no corpo. Saíram os paddings por card.
- `.vz-hero-cards__statement` (+ `span`): três linhas, 400, line-height 1,35, sem caixa alta.
- `.vz-hero-cards__argument`, `-lead` e `-outcome`: um parágrafo contínuo (sem grid), 400, line-height 1,34.
- Destaque (`[data-active] … __surface`) e hover: o mesmo vidro com contorno e halo mais fortes.
- Regra de ocultação (ver item 8).

## 3. Seletores — celular

- `@media (max-width: 767.98px) and (orientation: portrait)`, no fim da parte dos cards (depois das regras de movimento reduzido): `.vz-hero-cards`, `__stack`, `__motion`, `__surface`, `__body`, `__statement`, `__argument`, `__argument-lead` e `__argument-outcome`.
- `@media (max-width: 767px) .hero`: `--hl-size`, `--hl-leading`, `--content-top`, `--eagle-w`, `--face-x` e `--eyes-y` (enquadramento; valores anteriores documentados no comentário).

## 4. Material glass

| Propriedade | Valor |
|---|---|
| Borda | 1 px `rgb(243 237 227 / .60)` (Marfim) |
| Raio | 16 px no desktop, 12 px no celular |
| Fundo com blur | `rgb(91 70 50 / .32)` (Mocha). A especificação partia de .25; ver "Desvio 1" |
| `backdrop-filter` (+ `-webkit-`) | `blur(11px) saturate(140%)`, estático, nunca animado |
| Sombras | `inset 0 1px 0` Marfim .20 (brilho no alto), `inset 0 -1px 0` Marfim .07 (na base), `0 0 12px` Páprica .18 (halo), `0 12px 30px` Grafite .20 |
| Contenção | `overflow: hidden`, `isolation: isolate`, texto em camada própria (`z-index: 1`) |
| Fallback sem `backdrop-filter` | `rgb(91 70 50 / .82)`: Mocha quase opaco, leitura independente do fundo (§72) |
| Destaque | borda Marfim .82; sombras .28/.09; halo Páprica 18 px .30; sombra 0 14 32 Grafite .26 (mesma transição de 0,65 s) |
| Hover (mouse) | borda .92; halo 22 px .36 |

A transparência fica só na pintura do fundo. Borda, sombra e texto ficam opacos, sem `opacity` global nem blur no texto.
Canvas, shader e JS de vidro: nenhum.

## 5. Reaproveitamento da Seção 03

Vem do `.s03-insight` da 03:
- a receita em camadas (fundo desfocado → superfície Mocha translúcida com blur estático → contorno Marfim fino com brilho interno no alto → texto por cima);
- o fallback opaco em `@supports`;
- o cuidado de pôr a opacidade de entrada na superfície e não no grupo (o que mantém o blur).

Fica de fora:
- os gradientes líquidos animados (`s03-liquid*`);
- o gradiente Mocha→Grafite de 145° da 03. Na Hero escura, o vidro é mais transparente (Mocha sólido translúcido), como pede §28.

A 03 não foi alterada.

## 6. Diagramação do desktop

- **Card 1:** "Presença forte / Marca valorizada / Mais oportunidades", à esquerda, mesma escala e peso 400, line-height 1,35, −0,015em, sem caixa alta, centrado na altura; o espaço livre fica à direita.
- **Card 2:** um parágrafo só, à esquerda, em três linhas: "Seu cliente já pesquisa, compara / e decide no digital. Sua empresa / precisa estar à altura." Line-height 1,34, sem colunas e sem centralização.
- **Escala:** a coluna de texto é a largura interna do plano menos o padding (`clamp(16px, 1,45vw, 24px)`). As três linhas exatas do card 2 só acontecem com a coluna entre 14,31em e 15,05em (Switzer 400, −0,015em, medido no navegador), então a fonte sai dessa largura: `clamp(15px, coluna ÷ 14,7, 19px)`.

| Tela | Fonte | Plano (externo) |
|---|---|---|
| 1280 × 720 | 15 px | 256 × 112 |
| 1366 × 768 | 15,4 px | 266 × 112 |
| 1440 × 900 | 16,3 px | 282 × 112 |
| 1536 × 864 | 16,6 px | 288 × 112 |
| 1920 × 1080 | 16,3 px | 288 × 112 |

As quebras foram conferidas nas cinco telas (medidas com o plano sem inclinação) e o texto fica dentro da superfície em todas.

**Desvio 2 (referência × especificação).** Na referência desktop os cards são ~17 % maiores (≈ 338 × 147 px em 1536),
planos, alinhados pela esquerda e sem sobreposição. A especificação manda manter posição, dimensões externas, distância
e inclinação ("Não reposicionar o conjunto…", "Não alterar a largura externa do card"). Mantive a geometria, e por isso
o texto fica em 15–16,6 px em vez dos ~17,8 px da referência. Se quiser os cards no tamanho e alinhamento da
referência, é uma rodada à parte.

## 7. Celular — posição e dimensões finais

- Os mesmos dois cards, **planos** (como na referência), empilhados à esquerda.
- **Âncora vertical:** o 1º card começa em `--eyes-y + 0,142 × altura da águia`, ou seja, abaixo dos olhos, na altura do bico, sobre as penas. Fica ancorado na águia e não em % da tela, então acompanha qualquer altura.
- **Horizontal:** `left: 4,6%`; largura `max(42,6%, 150px)`. O piso de 150 px só atua abaixo de ~352 px.
- **Espaço entre os cards:** `clamp(8px, 1,1svh, 13px)`.
- **Corpo:** padding `clamp(8px, 2,35vw, 12px)` em cima e embaixo, `clamp(9px, 2,35vw, 14px)` à direita e `clamp(12px, 4,6vw, 20px)` à esquerda; fonte `clamp(10px, 2,75vw, 12px)`; line-height 1,32; −0,01em.
- **Card 2:** quatro linhas exatas ("Seu cliente já pesquisa, / compara e decide no digital. / Sua empresa precisa / estar à altura."), com as duas frases em bloco e `text-wrap: balance`.

Posições em repouso:

| Tela | Card 1 (x, topo–base) | Card 2 (topo–base) | Largura | Fonte | Olhos (y) |
|---|---|---|---|---|---|
| 432 × 768 (= referência) | 20, 460–529 | 538–623 | 184 | 11,9 | 373 |
| 430 × 932 | 20, 460–529 | 539–624 | 183 | 11,8 | 373 |
| 390 × 844 | 18, 430–493 | 502–579 | 166 | 10,7 | 351 |
| 375 × 812 | 17, 418–479 | 488–562 | 160 | 10,3 | 343 |
| 360 × 800 | 17, 407–465 | 474–546 | 153 | 10 | 334 |
| 360 × 640 (9:16) | 17, 402–460 | 468–540 | 153 | 10 | 329 |
| 320 × 694 | 15, 373–431 | 439–510 | 150 | 10 | 309 |

**Referência em 432 × 768:**

| Elemento | Referência | Implementado |
|---|---|---|
| Card 1 | x 20,7–204, y 460–535 | x 20–204, y 460–529 |
| Card 2 | y 545–628 | y 538–623 |
| Fonte | ~12,1–12,7 px | 11,9 px |

**Composição (pequenos ajustes, §G), em 432 × 768:**

| Elemento | Referência | Antes | Depois |
|---|---|---|---|
| Headline (topo / tamanho) | ~75 px / 33,3 px | 60 / 29,4 px | 74 / 33,3 px |
| CTA | 188–227 | 157–202 | 185–230 |
| Olhos (y) | 365 | 379 | 373 |
| Centro do rosto (x) | ~300 | 272 | 300 |

- A headline segue em três linhas ("Seu negócio pode ter / crescido mais do que / a presença digital dele.").
- A águia é o mesmo arquivo, ~9 % menor (`min(107,6vw, 70svh)`) e mais à direita, para os olhos ficarem livres e os cards caberem à esquerda.

Conferido em todas as telas:
- os cards não cobrem os olhos (o 1º, mesmo no destaque, para ≥ 40 px abaixo da linha dos olhos e termina à esquerda do olho esquerdo);
- nada se aproxima do CTA;
- a altura da Hero não muda (os cards são absolutos).

**Desvio 3.** A headline maior desfaz parte da revisão no iPhone de 24/10 (28,9 → 26,5 px em 390): agora são 30 px em
390, como na referência. Voltar é trocar uma linha (valores antigos no comentário do CSS).

## 8. Autoplay no celular

- **Mesmo controlador, mesma timeline:** o ciclo de 6 s, `x/y` e easing não mudaram.
- **Elegibilidade:** `ELIGIBLE = DESKTOP, MOBILE`, com `MOBILE = "(max-width: 767.98px) and (orientation: portrait)"`. O `hero.js` já informava "pronta" e "faixa" em todos os ramos (com voo, mobile legado e Hero estática), então não precisou de mudança.
- **Ponteiro:** `pointerenter` só pausa com `(hover: hover) and (pointer: fine)`; no toque, tocar no card não congela o ciclo.
- **Pausas preservadas:** rolagem (retoma 0,7 s depois de parar), fora da tela (IntersectionObserver), aba oculta e movimento reduzido (cards parados).
- **Sem listeners nem timelines novos:** só uma `matchMedia` a mais, lida no `onEnter`.
- **Regra de ocultação corrigida na origem:** a regra única com `!important`, que escondia tudo abaixo de 1024 px e em toda tela de toque, passou a valer só para tablet (768–1023 px), desktop baixo ou sem mouse/touchpad (≥ 768 px) e celular deitado. Não há regra nova empilhada. Tablet (768–1199) continua como era.
- **GSAP:** no celular o invólucro animado só troca `position`, `top`, `left`, `width` e `height`; `x/y` continuam do GSAP. A superfície (que não é do GSAP) perde a inclinação. O empilhamento usa fluxo flex, não `x/y`.

## 9. Preservação do desktop

Comparação com as medidas "antes" desta tarefa, em 1280 × 720, 1366 × 768, 1440 × 900, 1536 × 864 e 1920 × 1080, nos
dois destaques:
- **Idênticos:** headline, CTA, águia, linha dos olhos, centro do rosto, header, card 1 e retângulo do grupo.
- **Card 2:** ±1 px de arredondamento da inclinação. Em 1280 volta de 123 para os 112 px declarados: o texto antigo em colunas fazia o card crescer, e o novo cabe na altura mínima.
- Ciclo, tempos e amplitude iguais.

## 10. Testes executados (Chrome headless, `localhost:5173`)

| Teste | Resultado |
|---|---|
| Quebras e texto dentro do card: 5 telas desktop × 2 destaques, 7 telas de celular × 3 estados | OK em todas |
| Contraste real do texto sobre o vidro (texto oculto, pixels do fundo), 2 destaques | Sem falhas AA em 12 telas: desktop ≥ 4,64:1 (pior caso: card 1 em 1280 × 720) e celular ≥ 5,64:1 (320 × 694). Fallback sem blur (Mocha .82): sem falhas em 1280, 1440 e 390 |
| Autoplay §68 em 1536 × 864, 1280 × 720 e 390 × 844 (Hero com rolagem narrativa): abrir → pronta → parado alterna → rolagem pausa (tempo congelado) → parou, retoma (~0,6–0,7 s) → fora da Hero pausa e oculta → volta visível e rodando → águia sem reinício (opacidade 1 o tempo todo, nenhum setup novo) | 12/12 em cada |
| Sem duplicação: 1 grupo e 2 tweens por card, antes e depois de sair e voltar | OK |
| Mouse sobre o card pausa e, ao sair, retoma (desktop) | OK |
| Toque no card não pausa (celular) | OK |
| Aba oculta pausa e, ao voltar, retoma | OK |
| Movimento reduzido: visível e parado | OK |
| Autoplay em 320 × 694 e 360 × 640 (Hero estática, sem rolagem narrativa) | 11/12. Ver abaixo |
| Overflow horizontal | Nenhum novo. 320 × 694 já tinha `scrollWidth` 348 antes (não vem dos cards: terminam em x 172) |
| `node tools/test-hero-voo.mjs` | 11/11 |
| `node tools/build-site.mjs` | ok (276 arquivos) |
| `git diff --check` / CRLF | ok / 0 linhas LF sem CR |

**Sobre o 11/12 nas telas estáticas.** Ao sair da Hero o ciclo pausa (palco fora da tela, tempo congelado), mas o grupo
mantém a classe de visível. Nessa Hero não existe "faixa" da Visão, então os cards rolam junto com ela. É o comportamento
que já existia; quem falhou foi o critério do teste, que pedia "oculto".

**Não testado:**
- Safari/iPhone e Firefox (o `-webkit-backdrop-filter` está presente);
- aparelho real com toque;
- tablet: fora do escopo, continua oculto como antes.

## 11. Screenshots reais

Em `docs/qa/hero-cards-glass/`, pasta local ignorada pelo git, como as das rodadas anteriores:

| Pedido | Arquivos |
|---|---|
| Desktop antes | `antes-<tela>-card1.jpg` / `-card2.jpg` (5 telas) |
| Desktop depois, card 1 e card 2 em destaque | `depois-<tela>-card1.jpg` / `-card2.jpg` |
| Mobile antes | `antes-<tela>.jpg` (6 telas) |
| Mobile depois | `depois-<tela>.jpg` (7 telas) |
| Mobile, card 1 e card 2 em destaque | `depois-<tela>-card1.jpg` / `-card2.jpg` |

## 12. Pendências e desvios

1. **Vidro a .32 em vez de .25.** Com .25, o card 1 sobre o halo Páprica ficava em 4,34–4,42:1 em 1280–1440 (abaixo de AA para 15–17 px). Com .30 passava raspando (4,55); com .32 tem margem. Segue a preferência registrada de legibilidade acima da referência. Voltar para .25 é uma linha.
2. **Cards desktop menores que na referência,** por manter a geometria (item 6).
3. **Headline do celular maior,** desfazendo parte da revisão de 24/10 (item 7).
4. **Fonte de 10 px nos celulares de 320–360 px:** é o piso da especificação. Fica legível no contraste medido, mas é pequena.
5. **Vidro da referência:** parece mais leitoso e claro que o nosso, que segue os valores da §28 (com o ajuste do item 1). E o CTA da referência é de um laranja mais vivo; o nosso manteve a identidade.
6. **Não testado** em Safari/iPhone, Firefox e aparelho real.
