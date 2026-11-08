# CTA final (Seção 06) — V4.0

Prompt: "VIPZUE — PROMPT MESTRE DE EXECUÇÃO V4.0 · SEÇÃO CTA FINAL · DESKTOP + MOBILE" (08/11/2026), com a REFERENCIA_01 (desktop) e a REFERENCIA_02 (celular). A REFERENCIA_03 (estado atual) não veio anexada; o "antes" foi capturado no próprio site (`antes-*.jpg`).

**Não publicado:** sem deploy e sem push. O trabalho está na branch `feat/cta-v4`, a partir da `main` publicada (`4bfd270`).

**Status:** implementado e validado no Chrome (headless, emulação de celular e desktop). **Safari iOS e iPhone real: não testados.**

## 1. Branch e arquivos

| Arquivo | O que mudou |
|---|---|
| `index.html` | só a seção `#contato`. Ganhou classes `.vz-cta*`, um invólucro `.vz-cta__copy`, a headline nova (com `<br>` por largura), a subheadline nova (`<p>`) e a copy nova do botão. O aviso do WhatsApp foi removido. |
| `css/sections.css` | o bloco "06 — CTA final (rodada 6)" foi **substituído** pelo "06 — CTA final · V4.0". Nenhuma outra regra mudou. |
| `js/light-field.js` | `#contato` saiu da lista `FIELD_SECTIONS` (uma linha + comentário). O campo WebGL da 06 cobriria o fundo em CSS; é o mesmo caso da 04 em 07/11. |
| `docs/cta-v4-relatorio.md`, `docs/ANDAMENTO.md` | este relatório e o registro |

Ficaram como estavam:
- Hero, Seções 02–05, FAQ, rodapé, cabeçalho e navegação;
- SEO, metas, `js/config.js`, `js/sections.js` (o botão) e tokens globais.

Nenhum pacote foi instalado.

## 2. Seletores encontrados e adicionados

**Reais (mantidos):**
- `section#contato.section.surface-dark.closing[aria-labelledby=closing-title]`;
- `.container.closing__grid`;
- `h2#closing-title.t-display-xl.closing__title[data-reveal]`;
- `.closing__panel[data-reveal]`;
- `img.closing__eagle`;
- `.closing__action`;
- `p.t-body-lg.closing__lead`;
- `.closing__cta`;
- `a.shiny-cta[data-cta="whatsapp"][data-cta-final]`.

**Removido:** `p.closing__note` (o aviso do WhatsApp), com o espaço dele.

**Adicionados (classes nos mesmos nós):**

| Classe | Onde |
|---|---|
| `.vz-cta--v4` | raiz (`#contato`) |
| `.vz-cta__layout` | `.closing__grid` |
| `.vz-cta__copy` | div nova, só para agrupar headline e subheadline |
| `.vz-cta__headline` | o `h2` original |
| `.vz-cta__accent`, `.vz-cta__forte` | spans de cor |
| `.vz-cta__br--desktop`, `--mobile`, `--both`, `--button` | quebras |
| `.vz-cta__subheadline` | o `p` novo |
| `.vz-cta__visual` | `.closing__panel` |
| `.vz-cta__eagle` | a `img` |
| `.vz-cta__card` | `.closing__action` |
| `.vz-cta__card-copy` | `.closing__lead` |
| `.vz-cta__button` | o `a` |

As entradas `data-reveal` continuam no `h2` e no grupo águia + card; a subheadline também ganhou `data-reveal`, com o mesmo mecanismo.

## 3. A águia

O arquivo é o mesmo: `assets/img/aguia-cta-480.webp`, `-800.webp` e `-1200.webp`. É 1200 × 804 e só tem a ave, com fundo transparente. `srcset`, `sizes`, `width`/`height` e `alt=""` não mudaram, e nenhum filtro de cor foi aplicado (ficou o `drop-shadow` que já existia).

**Encaixe:** as garras são os 15% de baixo do arquivo e entram no card. Antes isso era um `translate` que empurrava a águia para baixo e deixava um vão acima dela. Agora é uma **margem inferior negativa** de largura × 0,67 × 0,15, que puxa o card para debaixo das garras sem espaço vazio.

A águia tem `z-index: 3`, acima do card (`2`), e `pointer-events: none`.

## 4. O botão

É o **mesmo nó**: `<a class="shiny-cta" data-cta="whatsapp" data-cta-final>`. O `js/sections.js` não foi tocado.

- **Destino:** o número do WhatsApp em `js/config.js` está vazio. Por isso o JS tira o `href` e põe `aria-disabled="true"`, exatamente como antes: hoje o botão não leva a lugar nenhum. Quando o número entrar no config, ele passa a abrir o `wa.me` sem mudar nada aqui.
- **Analytics:** **não existe** evento de clique (`whatsapp_click`, `gtag`, `dataLayer`) no repositório. Não há nada a preservar nem a duplicar.
- **Efeito:** as animações `shiny-angle`, `shiny-angle` e `shiny-shimmer` (3s) seguem intactas. No hover, a sombra Páprica acende e os brilhos sobem de .22 para .45 (`::before`) e de .32 para .60 (`::after`). Capturas: `botao-repouso-1536.png` e `botao-hover-1536.png`.
- **O que mudou:** só largura, padding, `font-size`, `line-height`, a quebra de linha e um `<br>` no rótulo ("Quero fortalecer minha / presença digital"). O nome acessível é a frase inteira.

## 5. Cores e gradientes por largura

As cores vêm dos tokens globais (`--color-mocha`, `--color-paprika`, `--color-paprika-deep`, `--color-ivory`, `--color-graphite`), sem mudar nenhum valor global.

**Fundo:** um único `background` em CSS, estático, sem imagem, vídeo, canvas nem animação.

| Camada | Todas | ≥ 1024px | < 1024px |
|---|---|---|---|
| base | `linear-gradient(112deg, Mocha 17% / 29% / 25% com preto)`, literal do prompt | — | — |
| luz principal | — | `ellipse 52% 66% at 70% 32%`: Páprica .56 → Páprica Profunda .25 em 42% → transparente em 78% | `ellipse 100% 46% at 50% 45%`: .44 → .20 em 46% → transparente em 80% |
| calor baixo | — | `ellipse 70% 83% at 54% 86%`: Páprica Profunda .13 → 73% (igual ao prompt) | `ellipse 90% 34% at 50% 80%`: .16 → 72% |

**Por que os radiais mudaram:** os pontos de partida do prompt eram `57% 69% at 73% 39%` com .38/.15 no desktop e `92% 49% at 50% 43%` com .30/.11 no celular. Comparei a cor do fundo em pontos fixos das referências com a captura real: atrás da águia, a luz saía com cerca de metade do brilho da referência. Por isso subi a intensidade e levei o centro para a cabeça da águia. A referência é mais vermelha (azul ≈ 0); a paleta do prompt vence (§03.6), então o tom continua Páprica/Mocha.

**Card:**
- fundo: `linear-gradient(155deg, Mocha 47% → 30% com preto)`;
- borda: 1px Páprica a .52;
- sombra: `0 15px 50px rgb(0 0 0 / .18)`;
- raio: 30px no desktop, 28px no tablet e 23px no celular.

**Sem `color-mix`:** um bloco `@supports not` traz os mesmos tons em hex. O fundo vira #17120D com a base #0F0C09 / #1A140F / #17120D, e o card #2B2118 → #1B150F.

**Textos:**
- headline em Marfim;
- destaque em Páprica: "presença digital forte" no desktop, só "presença digital" no celular ("forte" fica em Marfim);
- subheadline em Marfim a .86;
- card em Marfim;
- botão em Grafite sobre Páprica (o mesmo de antes).

## 6. Geometria final (calculada no navegador)

| Item | 1536 × 864 | 390 × 844 |
|---|---|---|
| malha | margem 112px; colunas 1,42fr / 1fr; vão 61px | margem 16px; coluna centralizada; seção com 100svh |
| headline | 62,21px; altura de linha 59,10px (.95); −2,18px (−.035em); **4 linhas**; x 112, y 265, 734px | 20,09px; altura de linha 20,09px (1,0); −0,50px (−.025em); **3 linhas**; topo em 42px; 358px |
| subheadline | 24px / 34,08px (1,42); largura máx. 26em (624px); 2 linhas; 28px abaixo do título | 15,21px / 21,75px (1,43); 350px; 2 linhas; 16px abaixo do título |
| grupo águia + card | 517px, x 907 | 320px (82vw), 27px abaixo da subheadline |
| águia | 362 × 242px (0,70 do card); 206px visíveis acima do card | 256 × 172px (0,80 do card); **146px** visíveis acima do card |
| card | 517 × 369px; padding 68 (37 de garras + 32) / 36 / 40; raio 30 | 320 × 240px; padding 42 (26 de garras + 16) / 23 / 28; raio 23 |
| texto do card | 24,58px / 34,41px (1,4); máx. 440px; 4 linhas | 15,6px / 21,84px (1,4); 4 linhas |
| vão texto → botão | 32px | 24px |
| botão | 407 × 89px; 22,27px / 25,61px (1,15); padding 17,8 / 26,7; 2 linhas | 271 × 57px; 15,99px / 18,39px; padding 9 / 16; 2 linhas |

Antes, para comparar:
- **1536:** título de 89px em 5 linhas; card de 514 × 380px com o aviso; botão de 359 × 55px em uma linha.
- **390:** título de 52px em 5 linhas; card de 342 × 372px; botão de 3 linhas.

### Onde me afastei dos números do prompt, e por quê

- **Headline do desktop em 4,05vw, não 4,15vw, e colunas 1,42fr, não 1,38fr.** Com os valores do prompt, a 4ª linha ("interesse pros seus clientes.") terminava a 2–3px da borda da coluna em 1280 e 1536. Qualquer diferença de fonte ou de renderização a quebraria em 5 linhas. Assim ficam ~25px de folga.
- **1024–1199px: headline em `clamp(42px, 4.2vw, 50px)`.** Com o mínimo de 45px, a 4ª linha quebrava em 1024. A margem lateral também é menor nessa faixa (duas colunas compactas, §48).
- **Respiro entre as garras e o texto do card: 32px no desktop** (o prompt dá 42–48). Na REFERENCIA_01 o texto começa logo abaixo das garras, e com 42–48 o card ficaria mais alto que o da referência.
- **Botão do desktop com 89px de altura e 22,3px de fonte.** O prompt diz 18–22px e ~58–64px para duas linhas; a REFERENCIA_01 mostra uma pílula de ~100px. Fiquei entre os dois, mais perto da referência.
- **Subheadline do celular quebra em "decidir entrar / em contato, …", não em "em contato, / …" como no mockup.** No mockup ela tem ~10px. Com os 14–16,5px do prompt, a 1ª linha do mockup não cabe em 350px.
- **Tablet (768–1023px):** a coluna do celular, em escala maior e centralizada na altura da tela. Não há referência para essa faixa.

## 7. Quebras sem duplicar o título

Há um só `h2`, o original. As quebras são `<br>`, e o CSS liga ou desliga cada uma por largura:
- `--desktop` depois de "uma" e de "forte";
- `--mobile` depois de "digital";
- `--both` depois de "mais".

O `textContent` é exatamente a frase aprovada (conferido), e um leitor de tela lê uma frase só. A cor de "forte" muda por CSS (Páprica no desktop, Marfim abaixo de 1024px).

## 8. Verificações

- `git diff --check`: limpo.
- CRLF: confirmado nos três arquivos.
- `node tools/build-site.mjs`: 279 arquivos.
- O projeto não tem lint nem testes automatizados (não há `package.json`). Os testes são os scripts de QA desta rodada.

## 9. Matriz de QA

Telas: 320 × 568, 360 × 640, 360 × 800, 375 × 812, 390 × 844, 393 × 852, 414 × 896, 430 × 932, 768 × 1024, 1024 × 768, 1280 × 720, 1280 × 800, 1536 × 864 e 1920 × 1080.

Em **todas as 14**:
- headline com o número certo de linhas e o destaque certo;
- subheadline em 2 linhas;
- botão em 2 linhas, clicável e sem nada por cima;
- sem rolagem lateral (`scrollWidth` = `innerWidth`);
- o card termina **dentro da primeira tela**, inclusive em 360 × 640 e 320 × 568 (524 de 568px).

| Tela | Headline | Card | Botão |
|---|---|---|---|
| 320–430 (celular) | 3 linhas | 4 linhas | 55–59px |
| 768 × 1024 (tablet) | 3 linhas | 3 linhas | 71px |
| 1024 a 1920 (desktop) | 4 linhas | 4 linhas | 72–92px |

**Contraste** (WCAG AA, pixels reais sob cada linha, pior 2%), nas 9 telas medidas:
- headline ≥ 12,98;
- destaque Páprica ≥ 4,61 (desktop e tablet: texto grande, mínimo 3) e ≥ 5,08 no celular (texto normal, mínimo 4,5);
- subheadline ≥ 8,49;
- card ≥ 13,9;
- botão 4,57 (o mesmo de antes; Grafite sobre Páprica).

### Checklist desktop (§87)

| # | Item | Resultado |
|---|---|---|
| 1 | fundo abstrato escuro, luz Páprica à direita, sem floresta | PASSOU |
| 2 | headline no quadrante central-esquerdo | PASSOU |
| 3 | headline em 4 linhas | PASSOU |
| 4 | só "presença digital forte" em Páprica | PASSOU |
| 5 | Gloock, a fonte editorial do site | PASSOU |
| 6 | subheadline literal, à esquerda | PASSOU |
| 7 | sem CTA extra | PASSOU |
| 8 | card inteiro, à direita | PASSOU |
| 9 | a mesma águia, centrada no card (centro 1166 × 1165,5) | PASSOU |
| 10 | garras sobre a borda | PASSOU |
| 11 | cabeça e bico visíveis | PASSOU |
| 12 | parágrafo centralizado | PASSOU |
| 13 | botão com copy nova e efeito original | PASSOU |
| 14 | nada abaixo do botão | PASSOU |
| 15 | sem penas, selos ou rolagem lateral | PASSOU |

### Checklist celular (§88)

| # | Item | Resultado |
|---|---|---|
| 1 | mesma família de fundo, luz atrás da águia | PASSOU |
| 2 | sem floresta nem textura | PASSOU |
| 3 | headline em 3 linhas, centralizada | PASSOU |
| 4 | só "presença digital" em Páprica; "forte" em Marfim | PASSOU |
| 5 | subheadline em 2 linhas | PASSOU |
| 6 | subheadline subordinada ao título | PASSOU |
| 7 | a mesma águia, central | PASSOU |
| 8 | garras na borda do card | PASSOU |
| 9 | card central, proporcional | PASSOU |
| 10 | texto do card inteiro | PASSOU |
| 11 | botão com 55–59px de altura e 2 linhas | PASSOU |
| 12 | efeito original do botão | PASSOU |
| 13 | aviso removido e card mais curto | PASSOU |
| 14 | uma seção só | PASSOU |
| 15 | primeira tela em 390 × 844 e 430 × 932 | PASSOU na emulação; no Safari real (barra dinâmica) **NÃO TESTADO** |
| 16 | telas baixas sem esconder a CTA | PASSOU |

### Checklist técnico (§89)

| # | Item | Resultado |
|---|---|---|
| 1 | só a CTA alterada | PASSOU (mais 1 linha no `light-field.js`, para o fundo da CTA aparecer) |
| 2 | nenhum pacote | PASSOU |
| 3 | asset da águia sem alteração | PASSOU |
| 4 | nada rasterizado | PASSOU |
| 5 | mesmo botão | PASSOU |
| 6 | hover / active / focus | hover PASSOU; active NÃO TESTADO; focus NÃO TESTÁVEL (sem `href` o link não recebe foco, igual a antes) |
| 7 | analytics sem duplicação | não se aplica: não há evento no repositório |
| 8 | nenhum ScrollTrigger novo | PASSOU |
| 9 | nenhum `overflow:hidden` cortando | PASSOU (só `overflow-x: clip` na raiz) |
| 10 | nenhum texto truncado | PASSOU |
| 11 | teclado | NÃO TESTÁVEL enquanto o botão estiver indisponível |
| 12 | movimento reduzido | PASSOU: tudo visível; a borda do botão para |
| 13 | console sem erros | PASSOU |
| 14 | sem 404 | PASSOU. O `favicon.ico` dá 404 também na `main`: é pedido automático do navegador, anterior a esta mudança |
| 15 | sem rolagem lateral | PASSOU nas 14 telas |
| 16 | CLS | PASSOU por construção (a `img` tem `width`/`height`; as fontes são as mesmas); não medido |
| 17 | outras seções inalteradas | PASSOU (ver abaixo) |

**Outras seções (item 17):** com movimento reduzido, comparei estrutura, caixas e estilos calculados de todos os elementos da Hero, 03, 04, 05, FAQ, rodapé e cabeçalho com a `main`, em 6 larguras. São idênticos, com duas exceções esperadas:
- a porta do servidor na URL da onda da 03 (o arquivo é o mesmo);
- um elemento oculto do rodapé fixo, cuja posição segue a altura da página.

Com movimento normal, as diferenças são só de estado de animação: o ângulo do brilho do botão da Hero, as ondas da 03 e o momento das entradas.

**Também conferido:**
- voltar no histórico: a CTA reaparece inteira;
- recarregar com a CTA na tela: nada fica oculto.

### Observações (honestas)

1. **Emenda 06 → 07 (CTA → FAQ).** Antes, as duas seções usavam o mesmo campo escuro, e a passagem era contínua: (90, 60, 43) → (89, 58, 42) no desktop. Com o fundo do prompt, a CTA termina quase preta, (31, 20, 15), e a FAQ começa no Mocha do campo dela, (89, 58, 42). Agora há um **corte seco** visível. Capturas: `emenda-06-07-antes-*.jpg` e `emenda-06-07-depois-*.jpg`. O prompt proíbe mexer na FAQ e pede "não introduzir outros efeitos" no fundo, então nada foi feito sem decisão. A alternativa é um esfumado só no pé da CTA, até o tom da FAQ.
2. **Ganho colateral:** a 320px a página era montada com 348px de largura e o navegador reduzia a escala para 92%. A causa era o título antigo ("acompanhou?" a 52px). Agora fica em 320px.
3. **A emenda 05 → 06 continua um corte seco**, claro → escuro, como antes.

## 10. Capturas reais

Ficam em `docs/qa/cta-v4/`; o git ignora essa pasta, então os arquivos ficam só nesta máquina.

- **§90:**
  - `CTA_DESKTOP_1536x864_REAL.png`
  - `CTA_DESKTOP_1280x720_REAL.png`
  - `CTA_MOBILE_390x844_REAL.png`
  - `CTA_MOBILE_430x932_REAL.png`
  - `CTA_MOBILE_360x800_REAL.png`
  - `CTA_MOBILE_360x640_FALLBACK_REAL.png`
  - `CTA_MOBILE_390x844_REDUCED_MOTION.png`
- **Antes e depois nas 14 telas:** `antes-<tela>.jpg` e `depois-<tela>.jpg`.
- **Botão:** `botao-repouso-1536.png` e `botao-hover-1536.png`.
- **Emendas:** `emenda-05-06-*.jpg`, `emenda-06-07-*.jpg` e `emenda-06-07-antes|depois-*.jpg`.

**Comparação com as referências:**
- **Desktop:** a mesma composição (4 linhas à esquerda, águia + card à direita), headline com 47,8% da largura (referência 47,7%), card a partir de 59% (referência 58%). O fundo é mais escuro e menos vermelho que o mockup, porque a paleta vence a amostra de pixels.
- **Celular:** headline com 75% da largura (igual), card com 82% (referência ~80%), 146px de águia visíveis (o prompt pede 145–175).

## 11. Deploy

**NÃO houve deploy nem push.** As mudanças estão só na branch local `feat/cta-v4`.
