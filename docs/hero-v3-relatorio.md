# VIPZUE — Hero V3.0 · relatório

Data: 13/11/2026. A base é a `main` 5a328fc (Atmosfera V2.0).

O prompt dizia para não fazer commit nem deploy. O usuário pediu no chat para **publicar direto**: "faça esse e ja publique direto". Por isso a mudança foi publicada na `main`, que faz o deploy em vipzuesite.vercel.app.

Referências aprovadas:
- desktop: `IMG_6050.PNG`, 1672×941;
- mobile: `IMG_6048.PNG`, 941×1672.

Cópias delas estão em `docs/qa/hero-v3/ref-*.png`, que fica fora do git.

## 1. Arquivos

| Arquivo | Situação | O que mudou |
|---|---|---|
| `index.html` | alterado | Preload da águia nova e das duas fontes. `<img>` único da águia frontal no lugar do `<picture>` antigo. Copy da CTA. Camadas `.hero__veil` e `.hero__grid`. Estrutura Liquid Glass nos dois cards. `<svg>` com o filtro `#vz-hero-liquid-refraction`, definido uma única vez. |
| `css/hero.css` | alterado | Bloco "HERO V3.0" no fim do arquivo. Fora dele, só a posição e a proporção de `.hero__figure` (916/921, rosto em 51,2%, olhos em 30,5%) e a imagem do close estático. |
| `css/fonts.css` | alterado | Dois `@font-face` da Playfair Display: 700 normal e 900 itálico, subconjunto latino. |
| `js/hero.js` | alterado | Só as frações dos olhos do arquivo novo: `EYE_L` (0,368; 0,304) e `EYE` (0,656; 0,306; d 0,0655). A timeline, as durações e as fases continuam iguais. |
| `js/hero-display-cards.js` | alterado | O card em destaque agora também ganha profundidade (`z`) e escala, lidas do CSS (`--vzc-cycle-depth`, `--vzc-cycle-scale`). O retorno e o `resetPose` zeram os dois. |
| `assets/hero/aguia-frontal-918.webp` | novo | A águia frontal: 916×921, WebP q 0,9, 253 KB. |
| `fonts/playfair-display-700.woff2`, `fonts/playfair-display-900-italic.woff2`, `fonts/playfair-display-OFL.txt` | novos | Fontes de @fontsource/playfair-display 5.3.0, com a licença OFL. |

Nenhuma outra seção foi alterada e nenhuma dependência foi adicionada.

## 2. Assets

**Águia.** A fonte é a imagem que o usuário enviou (`IMG_6033.PNG`, que na verdade é um JPEG de 1672×941 com fundo branco). Não houve geração por IA.
- Recorte: preenchimento a partir das bordas dos pixels quase brancos (mínimo ≥ 212, croma ≤ 45), seguido de um *color-to-alpha* numa faixa de 3 px para limpar o contorno.
- A base da plumagem esfuma no próprio alfa: um smoothstep de 83% a 99,5% da altura. Por isso a imagem não tem máscara CSS e o close da Visão continua sem re-rasterizar.
- A fonte recortada fica em `assets/source/hero/aguia-frontal-recorte.png`, que está fora do git.
- Olhos medidos no arquivo: esquerdo (0,368; 0,304), direito (0,656; 0,306), íris 6,55% da largura, centro do rosto em x 0,512.

**Fontes.** Playfair Display 700 e 900 itálico. Ambas carregam (`document.fonts`: as duas "loaded") e têm preload com `crossorigin`.

## 3. Tipografia

- **Headline:** Playfair Display 700, com `font-synthesis: none`. "presença digital" em 900 itálico Páprica `#D7673F`.
  - O texto e as quebras são os mesmos da referência: no desktop, 4 linhas (`br-d`); no celular, 3 linhas (`br-m`).
  - Tamanho: desktop `clamp(44px, 3.8vw, 62px)`, leading 0,985, tracking −0,045em. Celular `clamp(29px, 8.7vw, 49px)`, leading 1,02.
- **Posição:** no desktop, o topo fica a cerca de 18% da altura, na coluna esquerda. No celular, fica logo abaixo do cabeçalho.
- **Animação de entrada:** a mesma de antes (`splitWords`, que preserva o `<span class="hero__accent">` e os `<br>`).

## 4. CTA

- **Copy:** "Quero uma página na altura do meu negócio". Switzer 600.
  - Desktop: 16 px, altura 64 px.
  - Celular: `clamp(12.5px, 3.6vw, 14px)`, altura 55 px, em uma linha de 360 a 430 px.
- **ShinyButton intacto:** borda de luz (`shiny-angle` animando), hover, foco, `href="#contato"`, `data-cta="whatsapp"` e `data-hero-cta`, conferidos no teste funcional.

## 5. Display Cards

- **Ciclo automático, sem hover:** uma única timeline GSAP de 6 s. Cada card fica 3 s em destaque e as transições duram 0,55 s na ida e 0,6 s na volta.
- **Card em destaque:**
  - desktop: sobe 20 px, avança 28 px em `z` e cresce para 1,025;
  - celular: 12 px, 14 px e 1,015.
- **Inclinação:** fica na superfície, a mesma nos dois estados.
  - desktop: `rotateX(6°) rotateY(−16°) rotateZ(−7°)`;
  - celular: `rotateX(5°) rotateY(−14°) rotateZ(−7°)`.
- **Pausas:** durante a rolagem (retoma 0,7 s depois de parar), com a aba oculta, com o palco fora da tela e na Visão (os cards saem quando a headline sai).
  - O ponteiro sobre os cards ainda pausa no desktop, como antes, mas o ciclo não depende dele.
- **Movimento reduzido:** os dois planos ficam parados e separados o bastante para ler os dois inteiros.
- **Layout:**
  - Desktop: à direita do rosto, com largura `clamp(316px, 25.5vw, 420px)`.
  - Celular em retrato: sobrepostos à esquerda, sobre a plumagem, começando na altura da ponta do bico, como na referência mobile.
- Os cards não têm badge, ícone nem borda neon.

## 6. Liquid Glass

As camadas, de baixo para cima:
- `vz-lg__backdrop`: backdrop real com `blur(9px) saturate(118%)`;
- `vz-lg__optical`: brilho especular com o filtro SVG `#vz-hero-liquid-refraction` (feTurbulence + feDisplacementMap + especular, com os parâmetros do prompt), em opacidade 0,2;
- `vz-lg__tint`: película Mocha/cobre, com a luz Páprica no canto superior esquerdo;
- `vz-lg__rim`: contorno fino que clareia no canto inferior direito.

Regras do material:
- Nada anima dentro do vidro: não há ondas.
- O texto (`.vz-hero-cards__body`, z-index 10) fica fora de qualquer camada filtrada e nunca é distorcido.

Fallbacks:
- sem `backdrop-filter`: fundo opaco de 88%;
- com `prefers-reduced-transparency`: fundo de 94%, sem as camadas backdrop e óptica.

Contraste dos textos dos cards, medido sobre o fundo real e já com a película: mínimo 4,60 ("Seu cliente já pesquisa…", desktop 1536). Passa o AA.

## 7. Fundo

O Jade Sky e o Paper MeshGradient da Atmosfera V2.0 foram preservados: a mesma instância, sem uma segunda. Sobre eles, de baixo para cima:
1. **`.hero__bg`:** base espresso avermelhada, translúcida, com luz Páprica no canto superior esquerdo e no pé da tela.
2. **Atmosfera V2.0.**
3. **`.hero__veil`**, acima da atmosfera: véu espresso de 16% (dentro da faixa de 0 a 22%) mais a luz quente da referência no canto e no pé. É a camada que dá o calor da referência sem esconder o shader.
4. **`.hero__grid`:** grade de 82 px com linhas a 4,5% e opacidade 0,42, que só aparece de perto.

O véu e a grade usam a mesma máscara `--wipe-hide` da passagem, então somem com o resto da Hero.

## 8. Validação

Todas as capturas estão em `docs/qa/hero-v3/` (fora do git).

**Matriz de telas.** 12 viewports, sem overflow horizontal em nenhuma:
- desktop: 1920×1080, 1536×864, 1440×900, 1366×768, 1280×800, 1024×768;
- celular: 430×932, 414×896, 393×852, 390×844, 375×812, 360×800.

Nas 12, a headline não toca o olho nem o bico. Em 1024 e 1280, a plumagem do alto da cabeça encosta em "presença", como na referência.

**Comparação lado a lado com as referências.** Arquivos `cmp-v1-*` a `cmp-v3.jpg`, `final-desk.jpg`, `final-mob.jpg` e `fin2.jpg`.
- Iguais à referência: composição, escala da cabeça, posição dos olhos, tipografia, cards inclinados e a luz no canto e no pé.
- Diferença conhecida: o fundo da referência é mais saturado do que permite o véu de até 22% sobre a atmosfera. A legibilidade e a atmosfera foram preservadas.

**Funcional** (`t32-func.mjs`, desktop 1536 e celular 390), todos OK:
- cards aparecem sem interação;
- 1 timeline do ciclo;
- alternância first/second;
- `matrix3d` no destaque;
- pausa ao rolar e retomada;
- pausa com a aba oculta e retomada;
- CTA (copy, fonte, destino, analytics, borda animando);
- cards fora do ar na Visão;
- console sem erros.

Dois casos merecem nota:
- **Resize desktop → celular → desktop:** a primeira medição falhou porque a espera do teste era curta demais logo após rolar de volta ao topo. Refeito com espera (`t32-rs.mjs`, `t32-back.mjs`): os cards voltam e o ciclo retoma nos dois sentidos.
- **Movimento reduzido:** cards parados (tempo 0), dois planos legíveis. A Hero com movimento reduzido é estática, então não há Visão em que esconder os cards.

**Deep Zoom / Visão.** O voo é o mesmo: mesmas fases e durações, só as frações dos olhos novas. Capturas `func-*-zoom-{0,40,90,146,200}.jpg` mostram:
- o close termina enquadrando o olho no desktop e no celular;
- não há salto nem flash.

**Contraste.** `t20-contrast.mjs` na Hero em 1536, 1024, 390 e 360: 78 medições, 0 abaixo do AA.

**Shader.** No celular, o MeshGradient da Hero avança 603 ms de quadro em 5 s, com diferença média de cor de 8,07 níveis RGB.

**Desempenho.** Medido em headless, onde há muito ruído.
- Hero com tudo ligado: 57–60 fps no desktop e 57 fps no celular, o mesmo patamar da produção.
- Isolando as camadas (cards, filtro, blur, véu, grade), nenhuma tem custo mensurável acima do ruído.

**Build.** `node tools/build-site.mjs` gerou 285 arquivos; a águia nova e as duas fontes entram em `site-vercel/`.

**Pendente:** conferir no iPhone/Safari real (filtro SVG em elemento HTML e `backdrop-filter`).
