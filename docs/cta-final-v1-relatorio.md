# CTA final V1.0 — relatório

Data: 14/11/2026 · Prompt: `VIPZUE_PROMPT_MESTRE_CTA_FINAL_V1_0.txt` · Referência aprovada: imagem 29 (1671×941; comparada a 1536×864)

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | `#contato`: h2 em três spans de linha, subheadline nova, botão sem `.shiny-cta`, camada `.vz-cta__grid`, `sizes` da águia |
| `css/sections.css` | Bloco "06 — CTA final · V1.0" substitui o "06 — CTA final · V4.0" (mesmo lugar, antes da FAQ) |
| `css/vz-atmosphere.css` | Só a regra `#contato > .vz-atmosphere`: abrigo atrás do texto menor e mais leve; a luz nasce do escuro nos primeiros 140 px |
| `css/fonts.css` | `@font-face` da Boska 700 normal e 500 itálico |
| `fonts/boska-700.woff2` (30 KB), `fonts/boska-500-italic.woff2` (33 KB) | Novos. Fontshare, ITF Free Font License, download autorizado pelo usuário |

Nenhuma outra seção foi alterada. O JS também não mudou.

## 2. Seletores

- Seção: `#contato.vz-cta--v4`
- Grade e luz local: `#contato .vz-cta__grid`, com `::before` (luz) e `::after` (linhas)
- Colunas e conteúdo: `.vz-cta__layout`, `.vz-cta__copy`, `.vz-cta__headline` (com `.vz-cta__line`, `.vz-cta__accent` e `.vz-cta__forte`), `.vz-cta__subheadline`
- Águia, card e botão: `.vz-cta__visual`, `.vz-cta__eagle`, `.vz-cta__card`, `.vz-cta__card-copy`, `.vz-cta__button`

## 3. Águia

A águia é o asset que já existia: `assets/img/aguia-cta-{480,800,1200}.webp`, 1200×804, com fundo transparente. A imagem tem só o animal, sem nenhuma interface.
- É decorativa: `alt=""` e `pointer-events: none`.
- Fica centrada no card, com desvio de 0 px medido.
- As garras descem 22 a 45 px sobre a borda superior do card, conforme a largura.
- Não cobre o texto do card: a folga fica entre 18 e 34 px.

## 4. Fontes

| Família | Pesos e estilos | Uso |
|---|---|---|
| Boska | 700 normal e 500 itálico real | Headline |
| Switzer | 400 e 600 | Textos e botão (já existia) |

O teste confirmou as fontes e as cores aplicadas:
- `document.fonts`: as duas faces da Boska com status `loaded`. `fonts.check` passou com "presença negócio".
- Headline em Boska 700 normal #F3EDE3.
- "presença digital" em Boska 500 italic #D7673F, com `font-synthesis: none`.
- "forte" em 700 normal #F3EDE3.
- Subheadline e card em 400; botão em 600.

**Desvio:** o letter-spacing da headline ficou em −0,004em, e não nos −0,035em do prompt. Com −0,035em a Boska ficava 9% mais estreita que a referência, que manda na escala.

## 5. Copy e estrutura

O teste confere a copy literal:
- **h2:** "Tenha agora uma presença digital forte que valorize seu negócio."
  - Três linhas visuais no desktop e no tablet; quebra natural no celular.
- **Subheadline:** "Entre descobrir sua empresa e decidir entrar em contato, seu cliente já está formando uma opinião. Uma página estratégica ajuda a mostrar o valor do seu negócio e prepara uma conversa mais informada."
- **Card:** "Estruture uma Landing Page pensada para o seu negócio, seu cliente e o próximo passo que você quer que ele realize."
- **Botão:** "Quero fortalecer minha presença digital"
  - Quebra pela largura, em duas linhas. Abaixo de 1024 px o rótulo quebra equilibrado, sem palavra órfã.

## 6. Cores

| Uso | Cor |
|---|---|
| Card | #5B4632 sob uma tonalização espresso (155°, .50 → .74), sem vidro |
| Borda do card e brilho | Borda de 1 px Páprica a .72; brilho de 16 px a .24, estático |
| Botão | #D7673F, texto #241009 |
| Texto | #F3EDE3 |
| Grade | Grafite Quente #22201D |
| Base | #170A06, voltando a #1A100C nas emendas |

## 7. Fundo

O fundo segue o sistema da Hero:
- **Jade:** a receita V4 em `css/vz-atmosphere.css`, sem mudança. Só os focos desta seção mudaram: canto superior esquerdo, flare embaixo à esquerda do centro, atrás da águia e Mocha difuso.
- **Paper MeshGradient:** a instância do pool de `js/vz-atmosphere.js`. Não há instância nova:
  - a seção tem sempre um único canvas;
  - o pool pausa fora da tela e com movimento reduzido;
  - o rAF para com a aba oculta.
- **Luz local** (`.vz-cta__grid::before`): três núcleos estáticos em Páprica e Páprica Profunda.
  - Motivo: a receita da Jade não passa de 50% de Páprica fora do centro e não chega à intensidade dos núcleos da referência.
  - As bordas de cima e de baixo esfumam, para as emendas com a 05 e a FAQ não marcarem linha.
  - Abaixo de 1024 px a luz tem geometria própria.
- **Grade** (`::after`): linhas de 1 px, células de 64 px (52 px abaixo de 1024), sem pontos nas interseções.
  - Opacidade composta em cerca de 21%: some no escuro e só aparece sobre a luz.

## 8. CTA

- O botão continua com o elemento, o `data-cta="whatsapp"` e o `data-cta-final`. `js/sections.js` não mudou.
- `js/config.js` ainda está **sem número de WhatsApp**. Por isso o botão continua indisponível: sem `href` e com `aria-disabled="true"`, como antes.
- Por esse mesmo motivo, hoje ele **não recebe foco por teclado**. O foco passa a funcionar quando o número for preenchido.
- Testei com um destino simulado: `:focus-visible` mostra contorno marfim de 2 px, Páprica e Switzer 600, e o alvo tem 61 a 92 px de altura.
- O efeito `.shiny-cta` saiu (borda que gira, pontos e cintilância), como pede o prompt.
- O projeto não tem analytics. Nada foi adicionado.

## 9. Viewports testados

- Desktop: 1920×1080, 1536×864, 1440×900, 1366×768, 1280×800, 1024×768
- Tablet: 834×1112, 768×1024
- Celular: 430×932, 414×896, 393×852, 390×844, 375×812, 360×800

Resultado em todos: overflow horizontal 0, console sem erros e um canvas vivo.

## 10. Capturas (`docs/qa/cta-final-v1/`)

| Arquivo | Conteúdo |
|---|---|
| `antes/` | Estado anterior |
| `final/` | Todos os viewports |
| `comparacao-1536.jpg` | Referência × render |
| `folha-desktop.jpg`, `folha-celular.jpg` | Folhas de viewports |
| `emendas/` | Emendas 05 → CTA e CTA → FAQ |

**Ajuste à referência em 1536×864:**
- Topo da headline, topo da águia, topo e base do card, largura do card e do botão, e altura do botão: a até cerca de 10 px.
- Altura da seção: 867 px.

## 11. Testes

| Teste | Resultado |
|---|---|
| `t75-ctafunc` (1920, 1536, 1280, 1024, 768, 390, 360 e movimento reduzido) | Tudo PASS |
| Contraste `t20` | 137 medições, 0 abaixo do AA; o menor é "presença digital", 3,69:1 (texto grande, mínimo 3:1) |
| `t19-func` | 15/15 (1440) e 18/18 (390), incluindo o clique nos CTAs |
| `t32-func` (Hero) | 13/13 |
| "Para quem é" | Inalterada |
| Build | `tools/build-site.mjs`: 289 arquivos, Boska incluída |

O `t75-ctafunc` cobre:
- shader vivo em dois quadros;
- aba oculta;
- CTA e foco;
- Boska real;
- copy;
- âncora `#contato`;
- canvas único ao voltar;
- águia apoiada no card sem cobrir texto, CTA ou headline;
- nada intercepta o clique.

O projeto não tem lint nem typecheck.

## 12. Diferenças restantes

- **Saturação:** a Páprica da referência é mais saturada (laranja quente) que o token #D7673F. Segui os HEX do prompt no botão, no destaque e na luz. Por isso o render fica menos "neon" que a imagem.
- **Desenho das letras:** Switzer e Boska desenham um pouco mais estreito que as fontes da imagem. A quebra da subheadline foi mantida pela largura da coluna, e o texto do card quebra igual à referência.
- **Altura no celular:** a CTA tem 880 a 920 px, um pouco mais que uma tela. O conjunto águia + card não é cortado.
- **Pendente:** conferir num iPhone real e preencher o número de WhatsApp em `js/config.js`.
