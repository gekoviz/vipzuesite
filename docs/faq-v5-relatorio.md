# FAQ (Seção 07) — V5.0

Prompt: "VIPZUE — PROMPT MESTRE DE IMPLEMENTAÇÃO V5.0 · FAQ" (08/11/2026), com a REF_01 (desktop) e a REF_02 (celular). A REF_03 e a REF_04 (estado anterior) não vieram anexadas; o "antes" foi capturado no próprio site (`antes-*.jpg`).

**Não publicado:** sem deploy e sem push. O trabalho está na branch `feat/faq-v5`, a partir da `main` publicada (`ce41eb3`).

**Status:** implementado e validado no Chrome (headless, emulação de celular e desktop). **Safari iOS, Firefox, Android e iPhone real: não testados.**

## 1. Branch, estado do git e arquivos

- **Antes:** `main` em `ce41eb3`, árvore limpa (`git status --short` vazio).
- **Depois:** branch `feat/faq-v5` com quatro arquivos de código alterados, mais este relatório e o `ANDAMENTO`.

| Arquivo | O que mudou |
|---|---|
| `index.html` | só a seção `#faq`. Cinco perguntas no lugar de seis; classes `.vz-faq*` acrescentadas sem tirar nenhuma; as duas palavras do título já vêm em `<span>` no HTML; o comentário da seção foi atualizado. |
| `css/sections.css` | o bloco "07 — FAQ · porte sem React do 21st.dev" (rodada 4) foi **substituído** pelo "07 — FAQ · V5.0". Nenhuma outra regra mudou. |
| `js/sections.js` | o bloco da FAQ: o accordion é o mesmo (só mudou de lugar dentro do bloco); a entrada passou de IntersectionObserver + CSS para uma timeline GSAP com um ScrollTrigger. |
| `js/light-field.js` | `#faq` saiu da lista `FIELD_SECTIONS` (uma linha + comentário). O canvas WebGL da FAQ cobriria o fundo em CSS; é o mesmo caso da 04 e da 06. |

Ficaram como estavam:
- Hero, Seções 02–06, rodapé, cabeçalho e navegação;
- SEO, metas, `js/config.js`, tokens globais e o sistema de rolagem.

Nenhum pacote foi instalado. Não há React, TypeScript, Tailwind, shadcn, Radix nem Motion no projeto, e nada disso entrou.

## 2. Seletores reais usados

| Papel | Elemento no DOM |
|---|---|
| root | `section#faq.section.surface-dark.faq.vz-faq` (o id não mudou; `vz-faq` foi acrescentada) |
| título | `h2#faq-title.t-display-l.faq__title.vz-faq__title[data-faq-title]` |
| palavras | `span.faq__word.vz-faq__title-word` × 2, com um espaço de texto real entre elas |
| lista | `div.accordion.faq__list.vz-faq__list[data-accordion]` |
| item | `div.accordion__item.vz-faq__item` × 5 |
| pergunta | `h3.accordion__heading > button.accordion__trigger.vz-faq__trigger#faq-N-btn[aria-controls="faq-N"][aria-expanded]` |
| resposta | `div.accordion__panel#faq-N[role="region"][aria-labelledby="faq-N-btn"] > .accordion__panel-in > p.vz-faq__answer` |
| seta | `svg.accordion__icon` (a mesma de antes, 16 px) |

## 3. Copy: de seis para cinco

| # | Antes | Agora |
|---|---|---|
| 01 | O que é uma Landing Page Estratégica? | igual (pergunta e resposta) |
| 02 | Qual a diferença para um site comum? | igual (pergunta e resposta) |
| 03 | Minha empresa já possui um site. Ainda faz sentido? | pergunta igual; na resposta, "não **representa** mais" virou "não **apresenta** mais" e "alguns **dos** cenários" virou "alguns cenários" |
| 04 | A VIPZUE também desenvolve o design e o site? | **Qual é o prazo de entrega da Landing Page?**, com a resposta nova |
| 05 | Como funciona o processo após solicitar o projeto? (três etapas) | **Como funciona o processo após o primeiro contato?**, com a resposta nova: Diagnóstico → Estratégia → Construção → Entrega |
| 06 | Como funciona o orçamento? | **removida do markup** (não está escondida) |

- Os textos são literais, conferidos caractere a caractere no navegador.
- Não havia JSON-LD `FAQPage` na página, e nenhum foi criado.
- Nada entrou entre o título e a lista: nem descrição, nem e-mail, nem link.

## 4. Fundo

Um único `background` no root, em CSS, estático: sem imagem, canvas, vídeo ou animação. As camadas e os tons são os do contrato da §30. Só a força e a posição da luz principal foram calibradas, dentro das faixas da §31.

**Desktop (≥ 768px):**

```css
background-color: var(--vz-faq-mocha); /* #5B4632 */
background-image:
  radial-gradient(ellipse 67% 70% at 72% 50%, rgb(215 103 63 / var(--vz-faq-glow-a)) 0%, rgb(159 57 48 / 0.43) 42%, rgb(159 57 48 / 0) 82%),
  radial-gradient(ellipse 69% 71% at 38% 61%, rgb(91 70 50 / 0.27) 0%, rgb(44 27 20 / 0) 78%),
  linear-gradient(116deg, #20120E 0%, #312219 39%, #391F16 68%, #21130F 100%);
```

**Celular (≤ 767px):**

```css
background-image:
  radial-gradient(ellipse 115% 62% at 56% 52%, rgb(215 103 63 / var(--vz-faq-glow-a)) 0%, rgb(159 57 48 / 0.39) 38%, rgb(159 57 48 / 0) 79%),
  linear-gradient(178deg, #190D0A 0%, #321810 28%, #462016 58%, #24120F 100%);
```

| Parâmetro | Prompt | Implementado | Por quê |
|---|---|---|---|
| luz, desktop ≥ 1200px | 76% 53%, .66 | **72% 50%, .72** | mais perto da REF_01, onde a luz fica acima e à esquerda; .72 é o teto da faixa |
| luz, 768–1199px | (não especificado) | **72% 50%, .58** | nessa largura as respostas abertas passam por cima do miolo da luz; a .72 elas ficavam em 3,7–3,9:1 |
| luz, celular | 56% 52%, .61 | **56% 52%, .52** | o piso da faixa; a .61–.70 as respostas abertas ficavam em 3,8:1 e as perguntas em 4,6:1 |

**Comparação com as referências.** Amostrei a cor média em pontos fixos de fundo: REF_01 a 1448 × 1086 e REF_02 a 390 px, com o texto escondido só na captura de calibração.

| Ponto (desktop) | REF_01 | Implementado |
|---|---|---|
| alto, à esquerda | (23, 6, 2) | (34, 20, 15) |
| alto, no centro | (50, 13, 1) | (60, 36, 27) |
| miolo da luz | (184, 51, 1) | (155, 74, 48) |
| meio, à direita | (48, 12, 1) | (108, 47, 35) |
| embaixo, no centro | (31, 7, 1) | (62, 39, 30) |

A composição é a mesma: bordas escuras, luz no centro-direita no desktop e no centro no celular, e base escura. A distância que resta:

- a referência usa um laranja-avermelhado saturado (azul ≈ 0), que não está na paleta; com a Páprica #D7673F a luz sai mais terrosa;
- na referência a luz é uma faixa diagonal, estreita e intensa; os tamanhos das elipses do contrato são fixos, então a luz aqui é mais larga e mais suave;
- as bordas da referência são quase pretas; o contrato pede que o escuro "permaneça marrom quente, não #000000".

A comparação está em `comparacao-REF_01-desktop.jpg` e `comparacao-REF_02-celular.jpg`.

## 5. Driver da animação

**GSAP 3.13 + ScrollTrigger (Ramo A).** A página já carrega os dois pela CDN, e o `hero.js` e o `scroll-narrative.js` já os usam, então nada foi instalado nem registrado de novo.

- Antes (rodada 4), a FAQ tinha a sua própria entrada, com IntersectionObserver + transições CSS. Ela escondia o título e a lista pelo CSS antes de o JS rodar, contra a §62. Essa entrada saiu.
- Agora há **uma** timeline e **um** ScrollTrigger no root. O estado escondido só é aplicado **depois** que o gatilho existe.
- Sem GSAP (a CDN falhou), com movimento reduzido, com a FAQ já acima da tela ou em qualquer erro, nada é escondido.

## 6. Parâmetros implementados

| | Valor |
|---|---|
| gatilho | `start: "top 82%"` no root, uma vez; `refreshPriority: -1`, para ser calculado depois dos palcos que vêm antes na página |
| palavras ("Perguntas", "frequentes") | opacidade 0 → 1, y 12 → 0px, desfoque 6 → 0px; 0,40s; +0,08s; `power2.inOut` |
| perguntas (5) | opacidade 0 → 1, y 10 → 0px; 0,35s; +0,07s; `power2.out`; começam em 0,36s |
| fim | todos os estilos inline são removidos (sem opacidade, transform ou filtro residual) e o gatilho é desfeito |

**Medido no navegador** (rAF, tempo a partir do primeiro quadro visível da 1ª palavra, celular 390 × 844):
- palavras: 0 e +83ms (esperado 0 e +80);
- perguntas: +383, +400, +483, +550 e +617ms (esperado +360, +430, +500, +570 e +640).

As diferenças são do tamanho de um ou dois quadros do Chrome headless (16–33ms). No desktop, o headless renderiza por software e teve quadros longos, então a medição a 1440 é menos precisa. Os valores do código são os da tabela.

**Três escolhas além do snippet do prompt:**
1. **Opacidade em vez de `autoAlpha`.** Com `autoAlpha`, as perguntas ficariam com `visibility: hidden` até a entrada, e o Tab pularia a FAQ. Com opacidade elas continuam alcançáveis, e o foco termina a entrada na hora (`focusin`).
2. **`onLeave` e `onEnterBack` terminam a entrada na hora.** Assim um salto (âncora, recarga lá embaixo) nunca deixa nada invisível.
3. **O título já vem dividido no HTML** (dois `<span>` com texto real e um espaço real entre eles), em vez de ser dividido pelo JS. O `h2` é lido como uma frase só; não há `aria-label` nem `aria-hidden`.

## 7. Accordion

É o mesmo:
- um aberto por vez, e clicar no aberto fecha (`type="single"` collapsible);
- `aria-expanded` e `aria-controls`, com regiões rotuladas pelo botão;
- setas, Home e End movem o foco;
- painel por `grid-template-rows` 0fr → 1fr em 0,2s, fechado com `visibility: hidden` (fora do Tab e da leitura);
- seta que gira 180° em 0,2s;
- sem JS, todas as respostas ficam abertas.

Única adição: no celular, a pergunta aberta perde 11px do padding de baixo (23 → 12px), para a resposta começar a 12px dela. O prompt pede 10–14px. A transição é de 0,2s, igual à do painel.

## 8. Diagramação

| | Desktop ≥ 1200px | 768–1199px | Celular ≤ 767px |
|---|---|---|---|
| padding da seção | `clamp(94px, 8vw, 130px)` | o mesmo | `clamp(66px, 12vw, 92px)` |
| título | `clamp(60px, 5.3vw, 82px)` / .98, −.035em | `clamp(44px, 5.8vw, 64px)` | `clamp(31px, 8.3vw, 45px)` / 1 |
| lista | `min(100% − 96px, 1060px)`, 76px abaixo do título | o mesmo | `100% − 44px`, 48px abaixo |
| pergunta | `clamp(17px, 1.35vw, 19px)` / 1.4, peso 500 | o mesmo | `clamp(16px, 4.2vw, 18px)` / 1.4 |
| padding da pergunta | `clamp(24px, 2.2vw, 34px)` (ver abaixo) | 24px | 23px, mínimo 56px |
| resposta | `clamp(15px, 1.15vw, 17px)` / 1.6, marfim a **.92**, até 78ch | o mesmo | `clamp(14.5px, 3.8vw, 16px)` / 1.55 |

- **Padding das perguntas no desktop.** O prompt dá 24px "como ponto de partida, ajustando até preservar o espaçamento da referência". Na REF_01 cada linha ocupa ~6,8% da largura (~98px a 1448). A 24px elas ficavam em 75px; com `clamp(24px, 2.2vw, 34px)` ficam em ~91px a 1440.
- **Tinta das respostas.** Está em .92, e não .86. A §85 pede "pelo menos" .86; a .86 a resposta aberta sobre o miolo da luz caía para 4,3–4,4:1 no desktop.
- **"Uma seção por tela" no desktop.** A regra que já existia, `min-height: 100svh` com o conteúdo centrado e encaixe `proximity` da rolagem (rodada 6, a partir de 1024 × 600), continua. Ela não foi acrescentada agora e não fixa a altura: ao abrir uma resposta, a seção cresce.

## 9. Verificação

Chrome headless, emulação de toque abaixo de 768px. As 13 telas são as 12 do prompt mais 1920 × 1080.

**Resultado da suíte automática:** 120 verificações, **120 PASSOU**, 0 falhas, nenhum erro no console.

**Conteúdo (§93)**

| Verificação | Resultado |
|---|---|
| "Perguntas frequentes" uma vez, em `h2` | PASSOU |
| exatamente cinco perguntas; as cinco perguntas e respostas literais | PASSOU |
| "orçamento", "design e site" e o texto antigo do processo ausentes do DOM | PASSOU |
| sem e-mail, descrição ou texto de demonstração; nada entre o título e a lista | PASSOU |
| resposta 05 com as quatro etapas, na ordem | PASSOU |
| sem JSON-LD `FAQPage` (não havia e não foi criado) | PASSOU |

**Comportamento (§94)**

| Verificação | Resultado |
|---|---|
| tudo fechado depois da entrada; a rolagem não abre nada | PASSOU |
| um aberto por vez; clicar no aberto fecha; a seta faz parte do alvo | PASSOU |
| teclado: Enter, Espaço, setas, Home, End; Tab com anel de foco visível | PASSOU |
| respostas fechadas fora do Tab e da leitura, mas presentes no DOM | PASSOU |
| toque: abrir, trocar e fechar; alvos ≥ 44 × 44 px (≥ 56px de altura) | PASSOU |
| entrada: antes do gatilho, palavras e perguntas a opacidade 0, com **1** gatilho no root | PASSOU |
| entrada: disparou com o topo da FAQ a 0,807 (1440) e 0,776 (390) da altura da tela; o alvo é 0,82, e a diferença é o passo da rolagem | PASSOU |
| entrada: no fim, nenhum estilo inline, opacidade 1, sem transform e sem filtro; 0 gatilhos | PASSOU |
| entrada: subir e descer de novo não repete nem esconde nada (opacidade mínima vista: 1) | PASSOU |
| movimento reduzido: tudo visível desde o início; abertura sem transição | PASSOU |
| sem GSAP (CDN bloqueado) e sem JS: tudo legível; sem JS, as respostas ficam abertas | PASSOU |
| recarregar com a FAQ na tela, recarregar lá embaixo, voltar no histórico | PASSOU |

**Visual (§95)**

| Verificação | Resultado |
|---|---|
| semelhança com a REF_01 e a REF_02 | **PARCIAL**: a composição é a mesma; a cor e a forma da luz, não (ver Observações) |
| fundo em CSS, sem canvas WebGL, nas 13 telas | PASSOU |
| título inteiro, centrado, em uma linha, nas 13 telas | PASSOU |
| linhas de 1px a .25; setas de 16px, centradas na pergunta | PASSOU |
| contraste AA: título ≥ 3:1, perguntas e respostas ≥ 4,5:1, com a resposta aberta sobre a luz | PASSOU |
| sem rolagem lateral nas 13 telas | PASSOU |
| emenda 06 → 07 | **PARCIAL**: há um degrau (ver Observações) |
| emenda 07 → 08 | PASSOU (o véu de 72px foi mantido) |

**Técnico (§96)**

| Verificação | Resultado |
|---|---|
| nenhum pacote, React, Tailwind ou TypeScript | PASSOU |
| as outras seções iguais às de produção (comparação de estilos e caixas, 6 telas) | PASSOU |
| um `h1` só; nenhum id duplicado; nenhum botão dentro de botão | PASSOU |
| `git diff --check`, build e fins de linha CRLF | PASSOU |
| Safari iOS, Firefox, Chrome Android e iPhone real | **NÃO TESTADO** |

Na comparação com a produção, as únicas diferenças fora da FAQ são esperadas:
- a origem da URL da onda da Seção 03 (localhost × vipzuesite);
- a posição de um elemento escondido do rodapé (`site-footer__wash`), que muda com a altura da página;
- o campo WebGL da FAQ, que existe na `main` e saiu na branch.

O `favicon.ico` com 404 já acontecia antes.

**Por tela** (contraste mínimo: título / perguntas / respostas):

| Tela | Título | Lista | Pergunta | Resposta | Contraste |
|---|---|---|---|---|---|
| 320 × 568 | 31px, 1 linha | 276px | 16px | 14,5px | 13,35 / 6,04 / 5,28 |
| 360 × 800 | 31px | 316px | 16px | 14,5px | 13,08 / 6,00 / 5,24 |
| 375 × 812 | 31,1px | 331px | 16px | 14,5px | 13,08 / 5,96 / 5,24 |
| 390 × 844 | 32,4px | 346px | 16,4px | 14,8px | 13,08 / 6,00 / 5,24 |
| 393 × 852 | 32,6px | 349px | 16,5px | 14,9px | 13,23 / 6,00 / 5,24 |
| 414 × 896 | 34,4px | 370px | 17,4px | 15,7px | 13,08 / 5,87 / 5,31 |
| 430 × 932 | 35,7px | 386px | 18px | 16px | 13,02 / 5,87 / 5,24 |
| 768 × 1024 | 44,5px | 672px | 17px | 15px | 9,50 / 7,19 / 4,93 |
| 1024 × 768 | 59,4px | 928px | 17px | 15px | 8,58 / 8,85 / 4,95 |
| 1280 × 720 | 67,8px | 1060px | 17,3px | 15px | 8,98 / 9,23 / 5,14 |
| 1440 × 900 | 76,3px | 1060px | 19px | 16,6px | 8,52 / 9,00 / 4,75 |
| 1536 × 864 | 81,4px | 1060px | 19px | 17px | 8,77 / 8,80 / 4,70 |
| 1920 × 1080 | 82px | 1060px | 19px | 17px | 7,86 / 8,64 / 5,03 |

Em todas: 5 itens, título em 1 linha, sem campo WebGL, sem rolagem lateral. Com a 01, a 04 ou a 05 aberta, há sempre um painel aberto só, com a altura igual à do conteúdo.

## 10. Capturas reais

Ficam em `docs/qa/faq-v5/`; o git ignora essa pasta, então os arquivos ficam só nesta máquina.

- **Antes (§91):**
  - `antes-1440x900.jpg` (fechada) e `antes-1440x900-aberta1.jpg`;
  - `antes-390x844m.jpg` e `antes-390x844m-aberta1.jpg`;
  - `antes-emenda-06-07-*.jpg` e `antes-emenda-07-08-*.jpg`.
- **Depois, nas 13 telas:**
  - `depois-<tela>.jpg` e `depois-<tela>-fim.jpg`;
  - `depois-<tela>-aberta1|4|5.jpg` (§97: 01 aberta no desktop; 04 e 05 abertas no celular);
  - emendas `depois-emenda-06-07-*.jpg` e `depois-emenda-07-08-*.jpg`.
- **Movimento (§98):** `entrada-quadros-1440x900.jpg` e `entrada-quadros-390x844m.jpg`, quadros reais por screencast com o tempo de cada um.
- **Referências (§99):** `comparacao-REF_01-desktop.jpg` e `comparacao-REF_02-celular.jpg`.
- **Emenda 06 → 07 com e sem o esfumado da CTA:** `var-06-07-*.jpg`.

## 11. `git diff --check` e build

- `git diff --check`: sem erro.
- `node tools/build-site.mjs`: `site-vercel/` com 279 arquivos, sem referência quebrada.
- Fins de linha: CRLF em todos os arquivos alterados (0 linhas com LF sem CR).
- Não há `package.json` nem testes automatizados no projeto; a verificação é a da seção 9.

## Observações (honestas)

1. **A emenda 06 → 07 tem um degrau, e a causa está na CTA, não na FAQ.**
   - O esfumado do pé da CTA (`3c6475d`, publicado hoje) foi feito para casar com o campo WebGL da FAQ antiga, que era mais claro no topo. Contra o topo escuro da FAQ nova, ele termina claro e a FAQ começa escura.
   - Maior salto de cor na linha da emenda, medido em 8 colunas:

     | Tela | Hoje | Sem o esfumado da CTA |
     |---|---|---|
     | 1440 × 900 | 122 | 59 |
     | 1024 × 768 | 138 | 61 |
     | 768 × 1024 | 105 | 68 |
     | 390 × 844 | 118 | 15 |

   - Tirar o esfumado deixa a passagem quase contínua no celular e reduz o salto à metade no desktop. Isso mexe na CTA, que o prompt da FAQ não autoriza, então ficou como está. Pela mesma regra, não clareei o topo da FAQ para disfarçar o corte.
   - Capturas: `depois-emenda-06-07-*.jpg` (hoje) e `var-06-07-*.jpg` (com e sem o esfumado).
2. **A distância das referências vem do contrato.**
   - A REF_01 e a REF_02 usam um laranja-avermelhado bem mais saturado (azul ≈ 0), luz em faixa diagonal estreita e bordas quase pretas.
   - O contrato fixa a paleta (Mocha, Páprica, Páprica profunda), o formato das elipses e as faixas de força e posição; nesses limites, a luz sai mais terrosa e mais larga.
   - Os tipos também são menores que os da referência: na REF_01 as perguntas medem ~28px e o título ~6,1vw; o prompt dá 19px e 5,3vw. Na REF_02 o título mede ~9,9vw; aqui, 8,3vw.
   - Chegar mais perto exigiria sair do contrato (cor fora da paleta e outra forma de luz). Isso fica para decisão.
3. **"Uma seção por tela" no desktop** (rodada 6) foi mantida: `min-height: 100svh` com o conteúdo centrado, de 1024 × 600 para cima. Não é uma altura fixa; ao abrir uma resposta, a seção cresce.
4. **O véu de baixo (`.veil--end`, 72px até a cor do rodapé) foi mantido.** O maior salto de cor na emenda 07 → 08 fica em 127 (1440), 133 (1024), 103 (768) e 48 (390); sem o véu, seriam 149, 156, 141 e 99.
5. **Legibilidade acima da referência.**
   - As respostas estão a .92 de opacidade, não .86; a §85 pede "pelo menos" .86.
   - A luz está a .72 no desktop largo, mas cai para .58 entre 768 e 1199px e para .52 no celular. Esse é o piso da faixa do celular.
   - Com os valores do prompt, as respostas abertas sobre o miolo da luz ficavam em 3,7–4,4:1.
6. **`js/light-field.js` foi alterado** (uma linha + comentário), embora não esteja na lista de arquivos da FAQ. O canvas WebGL desenhava por cima do fundo em CSS e escondia a cor do contrato. É o mesmo caso das Seções 04 e 06.
7. **A entrada usa opacidade, e não `autoAlpha`,** para o Tab continuar chegando às perguntas antes de a entrada acontecer. O foco na FAQ termina a entrada na hora.
8. **Medição do movimento no desktop.** No Chrome headless o desktop é renderizado por software e tem quadros longos, então os tempos a 1440 são menos precisos que os do celular. As folhas de quadros mostram a ordem e o desfoque, mas não a fluidez num navegador real.
9. **Não testado:** Safari iOS, Firefox, Chrome Android e iPhone real. Não afirmo nada sobre eles.
