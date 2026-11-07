# Display cards na Hero desktop — relatório

Pedido: "VIPZUE — PROMPT MESTRE V2 · DISPLAY CARDS NA HERO DESKTOP". Branch local `feat/hero-display-cards`, **não publicado**.
Origem visual: display-cards de Codehagen/21st.dev, reescrito em HTML/CSS/JS nativos (sem React, Tailwind, shadcn, TS, lucide).

Arquivos: `index.html` (grupo + 1 script), `css/hero.css` (bloco no fim), `js/hero-display-cards.js` (novo), `js/hero.js` (avisos de estado).
Intocados: `js/light-field.js`, águia/voo, headline, CTA, mobile, seção 03, ScrollTrigger/pin/track/scrub.

## (a) Onde está montado
Dentro de `.hero__stage`, logo após `.hero__content` (mesmo `z-index: 3`, depois no DOM), antes das camadas da Visão (z 4–6) —
por isso a Visão cobre os cards naturalmente. `position: absolute`, à direita da cabeça da águia:
`top: calc(50svh - 128px)`, `right: clamp(32px, 3vw, 64px)`; a partir de 1500 px, `top` nunca acima de `--eyes-y + 56px` e `right: 32px`.
O 2º card fica na altura da última linha da headline ("dele."), o 1º logo acima.

Estrutura: assinatura (texto) → pilha com dois cards → frase de apoio. Títulos em `<p>` (não poluem a hierarquia de títulos);
grupo `role="group"` com `aria-label`. Nenhum link, botão, ícone, badge, bolinha ou filete; nada clicável.

## (b) Tokens
Cores: `--color-ivory` (texto), Mocha `#5B4632` → Grafite `#22201D` no fundo do card (a .96), borda Páprica `rgb(215 103 63 / .3)`
(ativo .62, hover .72), rodapé `#EDC2B3` (Páprica clareada para AA). Assinatura com respaldo radial em Grafite (`::before`).
Fonte `--font-body` (Switzer) 600/500/400. Variáveis do bloco: `--vzc-w: clamp(284px, 21.5vw, 316px)`, `--vzc-h: 148px`,
`--vzc-step: 88px`, `--vzc-shift: 28px`, `--vzc-lift: 56px`. Inclinação `skewY(-8deg)` na superfície, corpo contra-inclinado.

## (c) Dimensões medidas (getBoundingClientRect, Hero pousada)
| Viewport | Grupo [x0, y0, x1, y1] | Distância ao olho direito | scrollWidth extra |
|---|---|---|---|
| 1280×720 | 942, 232, 1226, 631 | ~108 px | 0 |
| 1366×768 | 1016, 256, 1310, 666 | ~80 px | 0 |
| 1440×900 | 1072, 322, 1382, 735 | ~66 px | 0 |
| 1920×1080 | 1557, 445, 1873, 858 | assinatura abaixo da linha dos olhos | 0 |
| 1366×650 | 1016, 197, 1310, 607 | — | 0 |
| 1200×800 | 865, 272, 1149, 679 | ~70 px | 0 |
| 1199×800, 1280×600, 1024×768 | oculto (`hidden`, `display:none`) | — | 0 |
| 360×800, 390×844, 430×932, 820×1180 | oculto | — | 0 |

CTA (`href="#contato"`) continua clicável (hit-test no centro acerta o CTA) e não cruza o grupo.

**Limite de composição:** em toda largura desktop a faixa livre à direita da cabeça é mais estreita que o grupo (≈ 235 px a 1440),
então os cards cobrem as penas externas do lado direito da cabeça e do pescoço. Olhos, bico, rosto, headline e CTA nunca são cobertos.

## (d) Ociosidade e pausas
Uma única timeline GSAP pausável (`repeat: -1`, ~12 s): 1º card sobe e fica à frente ~3,9 s, volta; 2º desce e fica à frente, volta.
O ciclo só corre com: grupo visível, palco na tela (IntersectionObserver, limiar .25), sem rolagem há 1 s, sem ponteiro sobre o grupo,
aba visível. Rolar congela o ciclo onde está **sem esconder** os cards; retoma após 1 s parado. Sem RAF, intervalo ou ScrollTrigger próprios.

## (e) Detecção de fase
O controlador não lê a rolagem para decidir fase; `js/hero.js` informa:
- `setHeroReady(true)` — fim da entrada (prólogo: `entrance` concluída ou atalho; sem prólogo: tween do CTA; Hero estática).
- `setHeroRange(bool)` — em `render()`: `tl.time()·TOTAL < OFF + ZOOM.start`, exatamente onde a headline começa a sair.
Medido a 1440: `heroRange` vira `false` no mesmo passo em que `.hero__content` sai de opacidade 1 (0,9927).

## (f) Quem é dono de cada transform
Raiz: só classes (`is-shown`/`was-shown`) — opacidade/visibilidade/entrada pelo CSS. `.vz-hero-cards__motion`: só `x/y` do GSAP.
`.vz-hero-cards__surface`: só `skewY` do CSS. Nenhum elemento tem dois donos.

## (g) Movimento reduzido
CSS: sem transições, cards separados (passo = altura + 18 px), sem deslocamento. JS: `resetPose()`, ciclo nunca inicia.
Achado e corrigido nesta rodada: com movimento reduzido no desktop nenhuma condição do `gsap.matchMedia` da Hero casa e `setup()` não roda,
então os cards nunca eram avisados. `js/hero.js` agora observa `STORY_QUERY` fora do `setup()` e marca a Hero estática como pronta.
Medido a 1440: card 1 [380–528], card 2 [546–694] — sem sobreposição.

## (h) Limpeza
`dispose()` remove scroll, visibilitychange, pointerenter/leave, os dois `matchMedia` e o IntersectionObserver, limpa o timer, mata a
timeline, `clearProps: transform`, esconde o grupo. `create()` é chamado uma vez no carregamento (fora do `setup` do matchMedia),
então remontagens da Hero não duplicam ouvintes.

## (i) Testes
Passaram:
- Oculto no carregamento e durante o voo; aparece só depois do CTA (CTA opacidade 1 em ~2,1 s, cards em seguida).
- Ciclo alternado; rolagem pausa sem piscar e retoma em 1 s; hover pausa; aba oculta pausa (e retoma após o ocioso de 1 s,
  pois a troca de visibilidade dispara 2 eventos de scroll); palco fora da tela pausa e esconde; volta à Hero reaparece sem refazer voo/entrada.
- Some no início da Visão; reaparece ao voltar (esmaecer curto).
- Viewports de segurança e mobile/tablet ocultos; resize 1440 → 1100 → 1440 esconde e restaura.
- Sem GSAP (bloqueado): cards parados e visíveis, CTA visível, console sem erros.
- Contraste AA sobre fundo composto (assinatura 5,36–5,69:1; rodapé inativo 5,36–5,61:1).
- `node tools/test-hero-voo.mjs` 11/11; `node tools/build-site.mjs` inclui `js/hero-display-cards.js`.

Abaixo do AA (aceito): rodapé do card 1 a 4,14:1 enquanto o card 2 está ativo e o cobre parcialmente.

Não testados: Safari/iOS, Firefox, dispositivos reais, perfil de desempenho com trace (observado só: ciclo parado fora da Hero, um único tween ativo).

**Ponto para decisão:** iPad Pro 12,9" em paisagem (1366×1024) já recebe a Hero desktop do site e, pelo corte 1200×650, também os cards
(sem hover; o ciclo roda). Se "tablet" deve excluir esse caso, a opção é somar `(hover: hover) and (pointer: fine)` ao corte.

## (j) Screenshots reais (Chrome via DevTools, pasta `docs/qa/cards/`, fora do git)
`antes-1280.png`, `antes-1440.png` · `depois-1280-c1.png`, `depois-1280-c2.png`, `depois-1440-c1.png`, `depois-1440-c2.png`,
`depois-1366-c2.png`, `depois-1920-c1.png`, `depois-1366x650.png`, `depois-1200x800.png` · `voo-1440-oculto.png`, `visao-1440-oculto.png`,
`reduzido-1440.png`.
