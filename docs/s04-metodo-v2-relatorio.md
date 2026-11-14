# Seção 04 · Método — V2.0 (reprodução visual da referência aprovada)

Relatório no formato do item 24 do prompt mestre definitivo da Seção 04 V2.0. Data: 14/11/2026.
Referência: imagem enviada pelo dono, 1670 × 941 px, comparada redimensionada para 1536 × 865 (mesma proporção).

## 24.1 Mapa real

| O quê | Onde |
|---|---|
| Seção | `index.html` — `section#metodo.why` (`data-vz-atmosphere="dark"`) |
| Headline | `h2#method-title.why__title` com dois `span.why__title-line` |
| Subheadline desktop | `p.why__aside > strong` (agora com `<em>` em "está no processo.") + `span` (2ª frase) |
| Subheadline celular | `p#method-sub.why__sub` ("O que a torna estratégica é o propósito por trás de cada decisão.") — intacta |
| Cards | `ol.journey.vz-s4m-steps > li.journey__stage`; número = `.journey__name::before` (contador CSS); título `h3.journey__name`; texto `p.journey__detail` |
| Destaque (hover) | CSS: variável registrada `--hl` (nasce 1 no card 02; passa ao card com `:hover`/`:focus-within`; transição 0,45 s) |
| 3D / spotlight | `js/journey-lamp.js` (tilt por `style.transform` com perspective 1200px, `--sx/--sy`, `.is-tilting`) — **não alterado** |
| Fundo | `.vz-env` (base) + `.vz-atmosphere` (Jade + Paper, V4) |
| Celular | linha viva `js/journey-lamp.js` (< 768 px) e cards 2 × 2 no tablet — **não alterados** |

Arquivos editados: `index.html` (só o `<em>`), `css/sections.css` (bloco novo "04 — Método, desktop — V2.0", logo depois do fundo do Método), `css/fonts.css` (4 `@font-face` da família "Switzer S4"). Adicionados: `fonts/switzer-700.woff2`, `fonts/switzer-500-italic.woff2` (Fontshare, licença gratuita ITF, baixados com autorização do dono). Nada removido.

Diferenças em relação às hipóteses do prompt:
- O estado sem ponteiro **já era** o 02 aceso (regra da rodada 5). Isso foi mantido, como o prompt manda ("preservar o estado default definido no código").
- A headline era Gloock (serifada) em duas linhas e o subtítulo ficava à direita, com uma 2ª frase. A 2ª frase ("O que faz a diferença é tudo que vem antes de ser entregue.") **saiu do desktop por decisão do dono** e ficou no HTML.
- A Switzer do site só tinha 400/500/600 normais. O 700 e o Medium Italic vieram em família à parte ("Switzer S4") para não mudar peso nem itálico de nenhum outro texto.

## 24.2 Tipografia (1536 × 865)

- Headline: Switzer S4 **700** real, **78,5 px** (`clamp(44px, 5.11vw, 88px)`), line-height 1,02, tracking −0,015em, Marfim `#F3EDE3`, centralizada, uma linha de 1920 a 1024.
- Subtítulo: Switzer **400**, **57 px** (`clamp(31px, 3.71vw, 64px)`), line-height 1,08, tracking −0,015em. "está no processo." em **Switzer Medium Italic 500 real** (`switzer-500-italic.woff2`, `font-synthesis: none`), Páprica `#D7673F`.
- Os tamanhos partiram de 70/51 px (prompt) e foram calibrados pela **largura da tinta** medida na referência: headline 1147 px na referência e 1159 px aqui; subtítulo 848 px na referência e 846 px aqui.
- Cards: número 48 px / 700, título 32 px / 700, texto 19 px / 400 / 1,28. As quebras de linha dos quatro textos ficaram **iguais às da referência** (10 linhas no 01, 11 no 04).
- Acentos (é, ç, ã, ó, á) vêm dos arquivos reais, sem fallback.

## 24.3 Composição (1536 × 865)

| Medida | Referência | Final |
|---|---|---|
| Topo da tinta da headline | 109 | 109 |
| Topo da tinta do subtítulo | 196 | 194 |
| Topo dos cards | ~318 | 317 |
| Base dos cards | ~745 | 744 |
| Cards (x) | 74 → 1470 | 70 → 1466 |
| Card (L × A) | ~335 × 427 | 336 × 427 |
| Gap | 16–20 | 17 |
| Raio | 34–42 | 38 |

O padding interno é 27 × 28 px.

Variáveis usadas, todas no wrapper real `#metodo`: `--why-top: clamp(40px, 11.3svh, 124px)` e `--why-bottom: clamp(56px, 13.9svh, 132px)`. Também `--why-pad-x: clamp(40px, 4.56vw, 76px)`, cards com `min-height: clamp(300px, 49.4svh, 460px)` e `gap: clamp(14px, 1.1vw, 20px)`. Não há posição absoluta nem altura fixa da seção, e o palco de 100svh é o de antes.

## 24.4 Fundo

- **Luz:** os quatro campos da referência ficaram nas variáveis da Jade **só do `#metodo`**, no desktop. A receita V4 não mudou.
  - A: canto superior esquerdo, 1% 6%, 40% × 60%, k 1.
  - C: Páprica Profunda atrás do subtítulo e do alto dos cards 02–03, 64% 33%, 30% × 24%, k .72.
  - B: base, um pouco à direita do centro, 62% 92%, 34% × 30%.
  - D: borda direita, 100% 52%, 24% × 40%, k .22.
  - Paper a .14 nesta seção (era .24).
- **Grade:** `#metodo::after` (pseudo livre), z-index −1, depois da atmosfera e atrás do conteúdo. Passo de 60 px, linhas de 1px em Marfim .045, camada a .38, `pointer-events: none`, sem animação. Só no desktop.
- Nenhum overlay captura o ponteiro: o hover, o tilt e o foco funcionam nos quatro cards (teste abaixo).

## 24.5 Hover / 3D

- **Preservado sem mudança:** `js/journey-lamp.js` inteiro (tilt, perspective, spotlight, `--a`, linha viva), o mecanismo `--hl` (seletores, nascimento no 02, `:hover`/`:focus-within`) e a transição de 0,45 s.
- **Ajuste só visual no `::before` do card:**
  - contorno em repouso a .26 (era .40), aceso pleno;
  - halo aceso mais firme (anel .95, 16 px a .85, 48 px a .38);
  - superfície espresso translúcida (preset 11.3 do prompt);
  - rampa Páprica do alto um pouco mais curta (ry 80%) e mais baixa (.94/.80/.46), para o contraste continuar AA com a tipografia maior.
- **Teste com ponteiro real (CDP), `--hl` por card:**
  - Diagnóstico 1/0/0/0;
  - Estratégia 0/1/0/0;
  - Construção 0/0/1/0;
  - Entrega 0/0/0/1;
  - 02 → 03 rápido 0/0/1/0;
  - ponteiro fora 0/1/0/0 (o default de antes).
- Em repouso, o transform de cada card é `perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)`, o mesmo do controlador original.

## 24.6 Validação

- **Comparação lado a lado:** `docs/qa/s04-v2/comparacao-1536.jpg` (referência em cima, final embaixo, ponteiro sobre Estratégia).
- **Baseline:** `docs/qa/s04-v2/antes/`.
- **Final:** `docs/qa/s04-v2/final/`, com 1536 sem hover e com hover em cada card, 1920/1440/1366/1280/1024 e celular 390/360. A folha `sheet-desktop.jpg` reúne os tamanhos de desktop.
- **Celular antes/depois:** `docs/qa/s04-v2/mobile-antes-depois.jpg`. Ficou idêntico: a mesma altura da seção (1659 px em 390, 1751 em 360), a linha viva, a subheadline própria, e o `why__aside` continua oculto.
- **Overflow:** 0 em todos os tamanhos. Console sem erros.
- **Contraste:**
  - 82 medições (6 desktops + 390 em três pontos da seção), nenhuma abaixo do AA;
  - card aceso com o ponteiro e o spotlight em cima: nome ≥ 3,16 (texto grande) e descrição ≥ 5,14, de 1024 a 1536;
  - "está no processo." ≥ 3,5 (texto grande, ≥ 31 px).
- **Funcional:**
  - `t32-func` (Hero): tudo OK;
  - `t19-func` celular: 18/18;
  - `t19-func` desktop: 1440 15/15; em 1536, 14/15. A falha (teste 8, navegação até `#metodo`) **também acontece na versão anterior**, então é do teste e não regressão;
  - com movimento reduzido, os testes da S03 que esperam animação falham igual na versão anterior (8/15 nos dois casos).
- **Build:** `node tools/build-site.mjs` passou com 286 arquivos, e os dois woff2 novos foram para `site-vercel/fonts/`. O projeto não tem lint nem typecheck.

### Diferenças que ficaram (e por quê)

- **Laranja mais vivo da referência**, em "está no processo.", no contorno e no fundo: a imagem é mais saturada que a Páprica `#D7673F`. O prompt proíbe criar cor nova, então o ganho veio de alfa e halo, e o tom ficou o institucional.
- **Desenho das letras:** a fonte da imagem parece ser outra sans, mais larga e redonda. Mantive a Switzer, como o prompt manda. O tamanho foi casado pela largura da frase.
- **Luz do alto do card aceso** um pouco mais baixa que a da imagem: é o limite para o texto continuar AA (regra do projeto: legibilidade acima da referência).

## 24.7 Limitações

- Testado em Chrome headless (Windows). Safari/iPhone real e Firefox ficam pendentes.
- O prompt dizia "NÃO EXECUTAR DEPLOY, COMMIT OU PUSH". A publicação foi feita mesmo assim, porque o dono pediu em 13/11 para publicar direto depois do QA (vipzuesite.vercel.app; vipzue.com não foi tocado).
