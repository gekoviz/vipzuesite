# Seção 04 — Método — V6: reconstrução fiel à referência aprovada — relatório (07/11/2026)

Branch `feat/s04-metodo`. **Não publicado**: aguarda a sua autorização.

Pedido: "VIPZUE — PROMPT MESTRE DE IMPLEMENTAÇÃO — SEÇÃO 04 — MÉTODO". A referência é a imagem aprovada enviada na conversa, calibrada em 1536 × 864.

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | Só a `#metodo`: a headline em duas `span.why__title-line`, o novo `p.why__aside` (`strong` + `span`) e `aria-labelledby="method-title"`. A subheadline antiga continua no HTML, visível só abaixo de 1024 px. |
| `css/sections.css` | O bloco "04 — Método, desktop (≥ 1024 px) — V6" substitui o da rodada 5. Entra o bloco novo "04 — Método, fundo Mocha/Páprica — V6". A `#metodo` sai da lista de centralização da rodada 6, mas continua no scroll-snap. |
| `js/light-field.js` | `["#metodo", "dark"]` sai de `FIELD_SECTIONS` (o canvas cobria o fundo novo), mais dois comentários. |

**Não tocados:**
- Hero, Seção 03, Para quem é, CTA, FAQ, rodapé e navegação;
- SEO, analytics e `js/config.js`;
- `js/journey-lamp.js`, `js/sections.js` e `js/scroll-narrative.js`.

Nenhum ScrollTrigger, sticky, canvas ou shader novo, e nenhuma dependência. O campo luminoso das seções 05 a 08 está intacto: `has-field` e um canvas em cada uma, como na `main`.

## 2. Seletores modificados

- **Desktop (≥ 1024 px):**
  - `#metodo` (palco: `min-height: 100svh`, padding, variáveis) e `#metodo > .container`;
  - `.why__head` (grade), `#metodo .why__title`, `.why__title-line`, `.why__sub` (oculta);
  - `.why__aside`, `.why__aside strong`, `.why__aside span`;
  - `.journey`, `.journey__stage`, `.journey__stage:nth-child(2)`, as duas regras de `:hover` / `:focus-within` (a lógica da rodada 5 sem mudança), `.journey__stage::before` e `.journey--fx .journey__stage`;
  - `#metodo .journey__name::before`, `#metodo .journey__detail`;
  - `@media (1024–1239 px) .journey__stage` (`--hl-ry`).
- **Todas as larguras:** `#metodo` (fundo e `--text-2`).
- **Abaixo de 1024 px:** `#metodo` (fundo do celular e do tablet) e `.why__aside` (oculto).

## 3. Headline

| Propriedade | Valor |
|---|---|
| Fonte | Gloock 400 (`--font-display`). A Epicene Display não está no projeto: veja §12. |
| Tamanho | `clamp(60px, 5.55vw, 94px)`, 85,2 px em 1536 |
| Entrelinha / espaçamento | 0,95 / −0,035em |
| Cor | Marfim `#F3EDE3` (`--color-ivory`) |
| Quebra | "O que entregamos é" / "uma página.", pelo markup (`.why__title-line { display: block }`) e igual em todos os desktops testados |
| Posição | Sem transform. Padding do palco: `calc(13.6svh − 0.081 × tamanho)` |

**Medido em 1536 × 864 contra a referência:**

| Medida | Medido | Referência |
|---|---|---|
| x | 80 (5,2 %) | 80 |
| Topo das maiúsculas | 117,5 (13,6 %) | 117,6 |
| Borda direita da 1ª linha | 810 (52,7 %) | 818 (53,3 %) |

## 4. Parágrafo

| Propriedade | Valor |
|---|---|
| Fonte | Switzer (`--font-body`). A Founders Grotesk não está no projeto: veja §12. |
| 1ª frase | `strong` 600, linha própria, `text-wrap: balance` |
| 2ª frase | `span` 400, `text-wrap: pretty` |
| Tamanho | `clamp(24px, 1.85vw, 29px)`, 28,4 px em 1536 (a medida da referência é ≈ 28) |
| Entrelinha / espaçamento | 1,32 / −0,015em |
| Largura máxima / topo | 15,5em / `padding-top: 0.38em` |
| Cor | Marfim |

**Em 1536:**
- x 998 (65,0 %), ante 1000 na referência;
- topo das maiúsculas 131,3 (15,2 %), ante 131,4;
- largura 440 px (28,6 %);
- três linhas idênticas às da imagem, iguais em 1280, 1366, 1440 e 1920.

## 5. Grade e geometria

**Grade:**
- palco: `padding-inline: clamp(44px, 5.2vw, 90px)`, base `clamp(56px, 13.7svh, 130px)`, `justify-content: space-between` e espaço mínimo de `clamp(24px, 5svh, 64px)`;
- topo: `minmax(0, 1.8fr) minmax(300px, 1fr)`, `column-gap: clamp(70px, 6vw, 112px)`;
- cards: 4 colunas, `gap: clamp(16px, 1.45vw, 24px)` (22 px em 1536), raio 28, `min-height: clamp(300px, 47.4svh, 440px)`, padding `clamp(22px, 1.85vw, 28px)` × `clamp(18px, 1.55vw, 26px)`;
- números 45 px, nomes 28,4 px e descrições 18,3 / 1,3 (em 1536).

**Em 1536 × 864:**

| Elemento | Especificação | Medido | Referência |
|---|---|---|---|
| Cards x | 5–6 % | 80 (5,2 %) | 80 |
| Cards y | 38–42 % | 318 (36,8 %) | 337 (39 %) |
| Altura dos cards | 44–48 % | 428 (49,5 %) | 409 (47,3 %) |
| Margem de baixo | 12–15 % | 118 (13,7 %) | 118 |
| Largura do card | 325–335 | 327 | 331 |

**Seção inteira na tela, sem rolagem lateral:** 1280 × 720, 1366 × 768, 1440 × 900, 1536 × 864, 1920 × 1080 e 1152 × 864. Veja §12 para 1024 × 768 e para as telas baixas.

## 6. Cores (só as cinco da marca, com alfa)

**Fundo do desktop (≥ 1024 px), sobre `#22201d`:**
1. sombra Grafite à esquerda: `ellipse 50% 85% at 0% 38%`, `.62`;
2. núcleo Páprica: `30% 44% at 61% 25%`, `1 → .6 (42%)`;
3. extensão Páprica: `26% 34% at 79% 18%`, `.42`;
4. campo Páprica Profunda: `72% 92% at 62% 22%`, `.95 / .62 / .26`;
5. foco profundo na borda direita: `50% 70% at 97% 40%`, `.4`;
6. calor na base: `80% 55% at 50% 100%`, `.16`;
7. diagonal: `114°`, Profunda `.1` → Mocha `.26`.

O ponto de partida da especificação (base Mocha a 100 %) deixava a faixa de baixo marrom-oliva. A calibração foi feita contra a imagem.

**Celular e tablet (< 1024 px):** o preset literal da especificação:
- `radial 112% 56% at 77% 17%`: Páprica `.67` → Profunda `.5` (38 %) → transparente (82 %);
- `linear 165°`: `#22201d` → `#5b4632` (48 %) → `#22201d`.

**Placa dos cards:** `linear-gradient(150deg, Grafite .86, Mocha .42)` e contorno Páprica `.40` no repouso.

## 7. Destaque e hover

A lógica é a da rodada 5:
- o card 02 nasce aceso;
- o card sob o ponteiro (ou com foco) assume o destaque;
- `--hl` vai de 0 a 1 em 0,45 s;
- tilt e spotlight são do `js/journey-lamp.js`, sem mudança.

A V6 só intensifica a resposta:

| Elemento | Repouso → aceso |
|---|---|
| Contorno | Páprica `.40` → `1.0` |
| Anel | `0 0 0 1px` Páprica `.6` |
| Halo | `22px .62` + `56px .22` |
| Sombra | `0 15px 38px` Profunda `.26` |
| Brilho interno do topo | Marfim `.08` → `.20` |
| Luz | `radial 160% × 90% at 30% 0%`: Páprica `.98 / .9 (20%) / .55 (35%)` → Profunda `.5 (54%) / .2 (76%)` → transparente |
| Descrição | Marfim `.88` → `1` |

Entre 1024 e 1239 px a luz encurta para 68 % da altura (`--hl-ry`).

**Conferido:**
- só o card sob o ponteiro acende (0/1/0/0 → 1/0/0/0 → … → 0/0/0/1);
- o 02 volta quando o ponteiro sai;
- depois da rolagem reversa o hover continua funcionando;
- com movimento reduzido o destaque troca sem tilt.

## 8. Celular e tablet

**Só o fundo mudou.** Comparada à `main` em 360 × 800, 390 × 844, 430 × 932 e 768 × 1024, no topo e no meio da seção, a geometria é idêntica:
- seção, linhas da headline, subheadline, lista, os quatro blocos e `scrollWidth`;
- estilos do texto iguais;
- `journey--lamp` ativo no celular.

**Tablet:** usa o mesmo preset do celular. Com o campo do desktop, o núcleo Páprica caía atrás da subheadline e do 2º card da grade 2 × 2, e a descrição ficava em 4,3:1.

## 9. Contraste (pixels reais, texto oculto, pior 2 %)

| Viewport | Headline | Parágrafo | Card aceso: número / nome / descrição | Cards apagados (descrição) |
|---|---|---|---|---|
| 1536 × 864 | 3,44 | 3,32 (28 px) | 3,20 / 3,63 / 4,77 | ≥ 7,59 |
| 1440 × 900 | 3,44 | 3,32 (27 px) | 3,18 / 3,53 / 4,62 | ≥ 7,74 |
| 1366 × 768 | 3,44 | 3,30 (25 px) | 3,14 / 3,62 / 4,72 | ≥ 7,66 |
| 1280 × 720 | 3,44 | 3,30 (24 px) | 3,13 / 3,56 / 4,71 | ≥ 7,59 |
| 1920 × 1080 | 3,42 | 3,32 (29 px) | 3,26 / 3,70 / 4,86 | ≥ 8,06 |
| 1024 × 768 | 3,50 | 3,34 (24 px) | 3,14 / 3,83 / 5,30 | ≥ 7,78 |

- Card aceso = pior caso entre o repouso e o hover em cada card, com o spotlight.
- Headline, parágrafo, números e nomes têm ≥ 24 px (texto grande na WCAG): mínimo de 3:1.
- Descrições: mínimo de 4,5:1.

**Celular e tablet:** mínimo de 4,98:1 (360, 390, 430 e 768). Na `main`, 390 × 844 e 768 × 1024 tinham 5 e 4 textos abaixo de 4,5:1 (4,01 a 4,46).

**Desktop na `main`:** a descrição do card sob o ponteiro já ficava em 4,1:1.

**Três ajustes nasceram desta medição (§81: "legível sobre a Páprica… no repouso e no hover"):**
- piso de 24 px no parágrafo e nos nomes (só muda abaixo de 1297 px);
- a passagem Páprica → Profunda do card aceso termina onde a descrição começa (antes: 3,6 a 4,4);
- tablet com o preset do celular.

Em 1536 a diferença visual da luz do card é mínima: a captura fica praticamente igual à calibrada.

## 10. Testes (Chrome headless, servidor local)

- **Geometria:** 1280 × 720, 1366 × 768, 1440 × 900, 1536 × 864, 1920 × 1080, 1024 × 768, 1152 × 864, 1280 × 600 e 1440 × 700.
- **Celular e tablet:** 360 × 800, 390 × 844, 430 × 932 e 768 × 1024, comparados à `main`.
- **Entrada:** seção a 60 %, 30 % e 0 %. O reveal é o mesmo de antes: headline visível e cards entrando no mesmo ponto. No fim, sem transform residual e com opacidade 1.
- **Rolagem reversa:** passos de 170 px de volta da 05 até antes do Método. Deslocamento linear, sem saltos e sem resíduo de opacidade ou transform.
- **Movimento reduzido:** geometria igual (seção 864, cards 318 a 745), sem `journey--fx` e com o hover trocando o destaque.
- **Contraste:** 10 viewports, repouso e hover nos quatro cards.
- **Regressão:**
  - campos de luz das seções 05 a 08 iguais aos da `main`;
  - emendas 03 → 04 e 04 → 05 iguais;
  - `node tools/test-hero-voo.mjs` 11/11;
  - `node tools/build-site.mjs` ok;
  - `git diff --check` limpo;
  - CRLF nos três arquivos (0 LF sem CR);
  - console sem erros em todos os testes.

## 11. Checklist §95

| Item | Status |
|---|---|
| Background desktop equivalente à referência | ✓ Calibrado contra a imagem. É CSS estático: sem o drift e o grão do WebGL (§12). |
| Paleta Mocha/Páprica | ✓ Só as cores da marca. |
| Headline na posição superior correta | ✓ Topo das maiúsculas a 13,6 %. |
| Headline com tamanho visual equivalente | ✓ 1ª linha com 730 px de largura, ante 738 na referência. A fonte é a Gloock (§12). |
| Headline em exatamente duas linhas | ✓ Todos os desktops. |
| Subheadline antiga removida do desktop | ✓ `display: none` em ≥ 1024 px. Continua no celular e no tablet (§66). |
| Novo parágrafo à direita | ✓ |
| Primeira frase em negrito | ✓ Switzer 600, o mais pesado carregado. |
| Segunda frase regular | ✓ |
| Founders Grotesk no parágrafo | ✗ Não existe no projeto. A Switzer fica até você enviar os arquivos (§12). |
| Texto direito em escala discreta | ✓ 28 px em 1536, ≈ 1/3 da headline. |
| Espaço negativo entre headline e parágrafo | ✓ 188 px em 1536. |
| Quatro cards preservados | ✓ |
| Copy dos cards intacta | ✓ Texto do repositório sem mudança. |
| Cards posicionados desde o início | ✓ Só CSS, sem transform; a seção cabe na tela. |
| Bordas visíveis no repouso | ✓ Páprica .40. |
| Hover luminoso intensificado | ✓ |
| Card Estratégia em hover semelhante à referência | ✓ |
| Sem liquid glass nos cards | ✓ Sem blur, sem vidro. |
| Sem efeitos novos de movimento | ✓ |
| Sem regressões do GSAP | ✓ `test-hero-voo` 11/11; nada de GSAP mudou. |
| Sem salto entre as seções | ✓ Rolagem reversa linear; emendas iguais. |
| Mobile preservado estruturalmente | ✓ Geometria idêntica à da `main`. |
| Background mobile atualizado | ✓ |
| Sem overflow horizontal | ✓ `scrollWidth` igual à largura em todos os viewports. |
| Sem erros novos de console | ✓ |
| Sem alterações em outras seções | ✓ |

## 12. Desvios e limitações

- **Fontes:** a Epicene Display e a Founders Grotesk não estão no projeto. Uso as fontes do site (Gloock e Switzer), sem instalar nada. O tamanho foi calibrado pela largura medida na imagem, mas as proporções das letras não são as mesmas. Por isso a 2ª linha da headline fica 17 px mais baixa que na referência (linhas de base em 182 e 264, ante 175 e 246), com o topo e a largura iguais. A captura não é tipograficamente fiel enquanto as fontes originais não entrarem.
- **Negrito 600, não 700:** a Switzer 700 não é carregada. `font-synthesis: none` evita o negrito falso.
- **Cards 19 px mais altos:** a copy do card 04 no repositório é mais longa que a da imagem (11 linhas, ante 9 nos outros). Com os 409 px da referência, a última linha encostaria na base. Os cards começam a 36,8 % (referência 39 %), e a base fica no mesmo ponto.
- **Fundo em CSS, não WebGL:** o preset da especificação é CSS, e o canvas do Método saiu porque cobria o fundo. O resultado é estático: sem o drift lento e o grão do campo. Se você quiser o movimento de volta, dá para compor esse fundo no shader existente (outro passo, a medir).
- **Breakpoint em 1024 px:** é o do projeto (a especificação fala em 1200). Entre 1024 e 1199 px a composição de desktop já vale.
- **1024 × 768:** o parágrafo de 24 px quebra em 5 linhas na coluna de 300 px, e a seção fica com 820 px (52 px a mais que a tela, crescendo sem sobrepor). Na `main` ela tinha 986 px.
- **Telas baixas:** em 1280 × 600 e 1440 × 700 a seção cresce (680 e 773 px), porque os cards precisam de altura para a copy. Na `main` eram 965 e 997 px.
- **Encaixe `proximity`:** a roda lenta para cima, logo abaixo do Método, fica presa no topo da 05. É o mesmo comportamento na `main` (testado) e não foi tocado.
- **Só Chrome:** nada foi testado em Safari, Firefox ou iPhone real. `text-wrap: balance/pretty`, `:has()` e `@property` têm fallback aceitável (quebra comum, destaque fixo no 02 e transição instantânea).

## 13. Evidências (`docs/qa/s04-metodo/`, fora do git)

| Evidência | Arquivos |
|---|---|
| Antes, desktop | `antes-<viewport>-entrando/enquadrado/saindo.jpg` (5 desktops) |
| Antes, celular e tablet | `antes-<viewport>-topo/meio.jpg` |
| Depois, desktop | `depois-<viewport>-entrando/enquadrado/saindo.jpg` e `v6-<viewport>-enquadrado.jpg` (7 desktops) |
| Card 02 em hover | `v6-1536x864-hover2.jpg` (e `hover1/3/4`, `repouso`) |
| Início da seção | `v6-1536x864-entrando-60.jpg` e `-entrando-30.jpg` |
| Celular e tablet com o fundo novo | `depois-<viewport>-topo/meio.jpg` (360, 390, 430, 768) |
| Movimento reduzido | `v6-1536x864-reduzido-hover1.jpg` |
| Rolagem reversa | `v6-1536x864-reversa.jpg` |
