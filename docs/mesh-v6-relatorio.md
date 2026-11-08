# Mesh Drift (V6.0) — película translúcida atrás do conteúdo de todas as seções

Prompt: "VIPZUE — PROMPT MESTRE V6.0 · Mesh Drift / ShaderBackground como sobreposição translúcida em TODAS as seções — desktop e mobile" (08/11/2026). As capturas e os mockups citados no prompt não vieram anexados; o "antes" foi capturado no próprio site (`docs/qa/mesh-v6/antes-*.jpg`).

**Status:** implementado na branch `feat/mesh-v6`. O prompt proibia commit e publicação; a publicação foi pedida depois por você ("agiliza aí… pra nós publicar logo"), com os testes já fechados. Validado no Chrome headless com a GPU real da máquina (Intel Iris Xe, ANGLE/Direct3D 11), em emulação de celular, tablet e desktop. **Safari iOS, Firefox, Android e iPhone real: não testados.**

## 1. Branch, estado do git e arquivos

- **Antes:** `main` em `f22e323` (= produção), árvore limpa.
- **Depois:** branch `feat/mesh-v6`, um arquivo alterado e dois novos (mais este relatório, o `ANDAMENTO` e as evidências em `docs/qa/mesh-v6/`).

| Arquivo | O que mudou |
|---|---|
| `index.html` | `+9 −7`: o `<link>` do CSS novo logo depois do `sections.css`; o atributo `data-vz-mesh` em sete roots; o `<script defer>` novo depois do `footer-curtain.js`. Nenhuma classe, texto ou outro atributo mudou. |
| `css/vz-mesh-overlay.css` | **novo** (169 linhas). O CSS do prompt na íntegra, mais as variáveis de foco/raio por seção (§ 2) e duas exceções comentadas: a máscara da Hero (composta com a cortina da história) e o blend normal na 05. |
| `js/vz-mesh-overlay.js` | **novo** (430 linhas). O JS do prompt (shaders, presets, `Renderer`, seleção por área visível, pausa, movimento reduzido), com cinco adaptações marcadas `VIPZUE (adaptação)` (§ 4). A 4 e a 5 mudam o ciclo de vida dos contextos e foram aprovadas por você depois do 1º relatório ("Sim, aplicar"). |

Ficaram como estavam:
- fundos, gradientes, tokens, imagens e textos de todas as seções;
- timelines, gatilhos e animações GSAP;
- a CTA, a FAQ, o cabeçalho, o rodapé e o `js/light-field.js`;
- SEO, sitemap, analytics e `js/config.js`.

Nenhum pacote foi instalado. Não há React, Tailwind nem build novo. O `tools/build-site.mjs` leva os dois arquivos novos sozinho: 281 arquivos em `site-vercel/`, eram 279. As cópias são idênticas às da raiz.

Conferências de arquivo:
- `git diff --check`: limpo;
- os dois arquivos novos: sem espaço no fim de linha;
- quebras de linha CRLF nos três arquivos (LF sem CR = 0, sem BOM);
- `node --check js/vz-mesh-overlay.js`: OK.

## 2. Mapa de roots, presets e focos

A película é um `div.vz-mesh-layer` com um `canvas` dentro. Fica com `position: absolute`, `inset: 0`, `z-index: −1` e `pointer-events: none`. O root passa a ser um grupo isolado, então a camada fica acima do fundo do root e atrás de todo o conteúdo.

A máscara radial (`--vz-mesh-focus-x/y`, `--vz-mesh-radius-x/y`) concentra a película na luz que a seção **já tinha**. Cada foco foi tirado das capturas de antes e dos gradientes do próprio CSS.

| Seção | Root (seletor real) | Preset | Foco X Y · raio X Y (desktop) | Abaixo de 1024 px | Abaixo de 768 px | Onde a camada entra |
|---|---|---|---|---|---|---|
| 01 Hero | `.hero__stage` (o palco sticky, § 4.1) | dark | segue o halo: `--face-x` `--eyes-y` (67% 40% sem JS) · 62% 82% | = | raio 110% 60% | 1º filho do palco; máscara composta com `--wipe-hide` |
| 03 O que fazemos | `#o-que-fazemos` | light | 62% 40% · 95% 90% | = | 80% 40% · 110% 80% | 1º filho |
| 04 Método | `#metodo` | dark | 62% 24% · 80% 85% | 77% 17% · 110% 60% | = | 1º filho |
| 05 Para quem é | `#para-quem-e` | light | 58% 24% · 90% 80% | = | 82% 30% · 110% 60% | depois do `.section-light-field` (canvas opaco); blend **normal** (§ 4.5) |
| 06 CTA | `#contato` | dark | 70% 32% · 85% 90% | 50% 45% · 110% 70% | = | 1º filho |
| 07 FAQ | `#faq` | dark | 72% 50% · 90% 95% | = | 56% 52% · 115% 80% | 1º filho |
| 08 Rodapé | `.site-footer` (`data-beam-footer`) | dark | 50% 50% · 105% 95% (o feixe muda de lugar) | = | = | depois do `.section-light-field` |

A Seção 02 não tem root próprio: os cards da Hero ficam dentro do palco da Hero e recebem a película dele. O cabeçalho não é seção e ficou de fora.

**Nenhum root ficou sem película** (o prompt pede PENDENTE se algum ficasse).

Presets do prompt, sem mudança:
- **dark:** alfa 0,105, deriva `timeScale` 0,35, grão 0,012;
- **light:** alfa 0,032, deriva 0,24, grão 0,005.

O shader ainda trava o alfa em 0,12 (`clamp(u_shape.z, 0.0, 0.12)`). Os tetos do prompt (0,12 dark / 0,04 light) não foram passados.

## 3. Inventário cromático por seção

"Δ" é a contribuição real da película na tela, em soma RGB de 0 a 765. Foi medida no **mesmo instante**: captura com a camada e, um quadro depois, com ela escondida, em movimento reduzido. "Deriva" é quanto essa contribuição muda em 2,5 s, com movimento, só nas seções sem outra animação rodando.

| Seção | Base preservada | Δ 390 (média / máx.) | Δ 1440 (média / máx.) | Deriva em 2,5 s | GSAP / animações | Resultado |
|---|---|---|---|---|---|---|
| 01 Hero | sim (§ 5.1) | 1,17 / 8 | 0,95 / 7; nos cards de vidro 2,48 / 11 | não medida (cards e águia animam junto) | intocadas; a película sai à frente do claro com a cortina (§ 6, `historia-hero30-*`) | PASSOU |
| 03 O que fazemos | sim; o único estilo calculado que mudou foi `isolation: auto → isolate` no root, que já era contexto de empilhamento (`z-index: 1`) | 2,66 / 14 (topo), 2,36 / 13 (meio) | 2,44 / 13, 2,27 / 11; nos cards 1,79 / 8 | 1,44–1,91 | intocadas; palco preso e onda dos cards (suítes t8/t9) | PASSOU |
| 04 Método | sim | 4,62 / 12 | 1,74 / 10 | 0,47–0,73 | intocadas; lâmpada da jornada | PASSOU |
| 05 Para quem é | sim | 0,81 / 7 (topo), 0,07 / 5 (meio) | 0,99 / 9, 0,87 / 8 | 0,70–0,77 | intocadas | PASSOU (com o blend normal, § 4.5) |
| 06 CTA | sim | 0,82 / 7 | 0,86 / 12 | não medida (botão anima junto) | intocadas | PASSOU |
| 07 FAQ | sim | 1,69 / 7 | 2,18 / 8 | 0,59–0,71 | intocadas; acordeão aberto com a película (`faq-aberta-*`) | PASSOU |
| 08 Rodapé | sim | 3,05 / 6 | 2,80 / 6 | 1,40–2,24 | intocadas (cortina) | PASSOU |

Leitura: a película age no fundo, em volta da luz que já existia. Textos, águia, fotos e cards opacos não mudam. Os painéis de vidro deixam ver a película atrás deles, sem amplificar: Δ nos cards da mesma ordem que fora deles. Os mapas `onde-age-390x844m.jpg` e `onde-age-1440x900.jpg` mostram onde ela age, em cada seção.

## 4. Adaptações ao código do prompt e decisões

1. **Root da Hero = `.hero__stage`, não `section.hero`.**
   - `section.hero` tem cerca de 344svh, fica com `z-index: 2` e passa por cima da Seção 03 durante a história. Uma camada nele rolaria atrás de um palco sticky e cobriria a 03.
   - O palco é o root visual que tem o fundo (o § 30 permite o root visual).
   - A camada usa a mesma máscara de saída do halo (`--wipe-hide`, de `js/hero.js`), composta com a radial (`mask-composite: intersect`). Assim o filme escuro sai junto com o escuro quando o claro da 03 entra.
2. **Adaptação 1 (JS): ponto de inserção.** Na 05 e no rodapé, o `js/light-field.js` já põe um canvas **opaco** com `z-index: −1`. Pela ordem do DOM, a película entra logo depois dele, para ser pintada por cima desse fundo e não por baixo.
3. **Adaptação 2 (JS): área visível.**
   - O rodapé é `position: fixed` dentro da cortina (`.footer-curtain`, recortada por `clip-path`). Medido sozinho, ele parece sempre visível e prenderia o único contexto do celular. Mede-se a cortina, como o `light-field.js` já faz.
   - Root com `visibility: hidden` não disputa contexto. É o caso do palco da Hero depois da troca e da 03 antes de ser revelada.
4. **Adaptação 3 (JS): sem WebGL, nenhuma camada entra no DOM.**
   - No código do prompt, `if (!gl) return;` deixava a camada vazia no lugar.
   - Medido: só por existir, ela trocava o antisserrilhado das letras da seção. Sem WebGL nenhum, as bordas das letras da FAQ mudavam até 208 de soma RGB; sem WebGL só na película, até 5 sob o cabeçalho.
   - Agora a camada só entra no DOM com o WebGL pronto (`attach`), e o fallback ficou idêntico ao original pixel a pixel (§ 5.2).
5. **05 Para quem é com blend normal** (§ 15 do prompt).
   - Sobre o Marfim, `soft-light` com alfa 0,032 não tinha efeito: no máximo 3 a 5 de soma RGB, e de 0,0% a 0,1% dos pixels acima de 3.
   - Só essa camada volta à composição normal.
   - Na Hero e na 03 isso já acontece por natureza: os dois são grupos isolados com fundo transparente (o fundo deles é o canvas fixo atrás da página), e o `soft-light` dentro deles se comporta como alfa normal.
6. **Adaptação 4 (JS, aprovada por você): contextos que migram entre as seções.**
   - No código do prompt, sair de uma seção destruía o contexto WebGL, e entrar na seguinte criava outro, com nova compilação do shader. Ao percorrer a página eram 8 criações.
   - Agora cada contexto é criado e compilado **uma vez**. Na troca de seção, a camada muda de lugar no DOM, ainda depois do canvas opaco do `light-field.js` onde ele existe, e os uniforms passam a ser os do preset da seção nova.
   - O 1º quadro na seção nova já é desenhado com o preset dela.
   - Os tetos são os mesmos: no máximo 1 contexto no celular e 2 a partir de 768 px. O contexto que sobra fica parado e fora do DOM.
   - Se o navegador perder um contexto, fica o fundo original, e um contexto novo nasce na próxima rolagem. Depois de 3 perdas, a película desiste.
   - Sem WebGL, ou com erro no shader, ela também não tenta de novo na mesma página.
   - Verificado: em movimento reduzido (quadro fixo) a película nova desenha exatamente o que a antiga desenhava (§ 5.2).
7. **Adaptação 5 (JS, aprovada por você): a 1ª película espera a página ficar ociosa** (`requestIdleCallback`, no máximo 1 s; no Safari, 200 ms). A compilação cara não disputa os primeiros quadros.
   - Ela não espera o `load` da página. Na 1ª tentativa, que esperava, uma recarga com o CDN do GSAP lento (13,8 s) deixou a página sem película todo esse tempo.
   - Agora ela aparece de 0,4 a 0,7 s depois do DOMContentLoaded, inclusive em recarga no meio da página.

## 5. Testes

### 5.1 Desligado × antes e ligado × antes

- **Película desligada** (script bloqueado; CSS e atributos presentes) **× antes** (`main`), em movimento reduzido, 10 pontos × 390 e 1440: **idêntico pixel a pixel nas 20 capturas**. Folhas: `folha-390.jpg` e `folha-1440.jpg` (antes | desligado | ligado).
- **Estilos calculados dos roots:** iguais aos de antes, menos `isolation: isolate` na 03 e os atributos novos.
- **Ligado × antes:** a tabela do § 3. Mapas: `dif-antes-ligado-*.jpg`.

### 5.2 Bordas: queda, aba, movimento reduzido, perda de contexto, recarga (390 × 844 e 1440 × 900)

| Caso | 390 | 1440 |
|---|---|---|
| Laço: um desenho por quadro da página, sem laço duplicado | PASSOU | PASSOU (56/56) |
| Aba oculta: laço para; ao voltar, retoma sem duplicar | PASSOU (0 desenhos; 39/39) | PASSOU (0; 56/56) |
| Movimento reduzido ligado em execução: para; desligado: retoma | PASSOU | PASSOU |
| Movimento reduzido desde o início: quadro parado (0 desenhos em 1,5 s), camada presente, FAQ visível | PASSOU | PASSOU |
| Sem WebGL só na película: Hero, 03 e FAQ idênticas à página com o script bloqueado **e** à captura de antes; sem camada, sem erro | PASSOU (0 / 0) | PASSOU (0 / 0) |
| Sem WebGL nenhum: idêntico à página com o script bloqueado; sem camada, sem erro | PASSOU (0) | PASSOU (0) |
| Falha de compilação do shader: um aviso `[VIPZUE mesh] fallback original preservado`, camada removida, idêntico ao antes | PASSOU (0) | PASSOU (0) |
| Perda de contexto (`WEBGL_lose_context`): laço para, sem erro; ao voltar à seção, contexto novo | PASSOU | PASSOU |
| Recarga no meio da 03 e no meio do Método: camada só na seção visível, sem duplicata, contextos no teto | PASSOU | PASSOU |
| Ir a outra página e voltar no histórico: sem camada duplicada | PASSOU | PASSOU |

Exceções no console: nenhuma. O único aviso é o da falha de compilação provocada de propósito.

### 5.3 Matriz das 14 telas (com movimento)

Cada tela rola do topo ao fim em 16 passos e volta, e em cada passo confere:
- contextos da película vivos (teto: 1 abaixo de 768 px, 2 acima);
- uma camada por root, no máximo;
- estilo e caixa da camada iguais aos do root;
- canvas com DPR ≤ 1,25 / 1,5 e área ≤ 700 k / 1,4 M px;
- nenhum texto, botão, imagem ou card coberto pela camada (`elementFromPoint`);
- sem rolagem lateral.

Depois da rolagem, confere que os ouvintes não cresceram. No celular, também gira a tela e volta.

| Tela | DPR emulado | Película (contextos, máx.) | WebGL vivos na página (máx.) | Ouvintes scroll / resize | Giro | Resultado |
|---|---|---|---|---|---|---|
| 320 × 568 | 3 | 1 | 4 | 4→4 / 6→6 | OK | PASSOU |
| 360 × 800 | 3 | 1 | 4 | 4→4 / 8→8 | OK | PASSOU |
| 375 × 812 | 3 | 1 | 4 | 4→4 / 8→8 | OK | PASSOU |
| 390 × 844 | 3 | 1 | 4 | 4→4 / 8→8 | OK | PASSOU |
| 393 × 852 | 3 | 1 | 4 | 4→4 / 8→8 | OK | PASSOU |
| 414 × 896 | 3 | 1 | 4 | 4→4 / 8→8 | OK | PASSOU |
| 430 × 932 | 3 | 1 | 4 | 4→4 / 8→8 | OK | PASSOU |
| 768 × 1024 | 2 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |
| 820 × 1180 | 2 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |
| 1024 × 768 | 2 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |
| 1280 × 720 | 1 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |
| 1440 × 900 | 2 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |
| 1536 × 864 | 1,25 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |
| 1920 × 1080 | 1 | 2 | 5 | 4→4 / 7→7 | — | PASSOU |

Nas 14 telas, os sete roots receberam a camada em algum momento da rolagem, e o console ficou sem erros.

Com o código final, a matriz foi repetida, também sem falhas. Os contextos da película **criados** na rolagem inteira (ida e volta, mais o giro no celular) foram:
- 1 abaixo de 768 px;
- 2 de 768 px para cima.

Com o código do prompt eram 8 a cada passagem.

"WebGL vivos na página" inclui os 3 contextos que já existiam (`js/light-field.js`): o fixo da página, o da 05 e o do rodapé.

### 5.4 Suítes que já existiam, rodadas nesta branch

São as suítes das versões anteriores, rodadas sem mudança contra a branch, com a película ligada e o **código final** (contextos migrantes). As cópias gravaram as evidências no rascunho, e as pastas publicadas de `docs/qa` ficaram intocadas.

| Suíte | Telas | Resultado |
|---|---|---|
| FAQ V5.0 (`t14-func`): copy, acordeão, teclado, sem GSAP/JS, recarga, layout e **contraste real sobre o fundo com a película** | 13 telas | **0 falhas** (120 verificações) |
| CTA V4.0 (`t12-func`): botão, cópia, movimento reduzido, histórico e contraste | 9 telas | **0 falhas** (16 verificações); contraste de todos os textos acima do mínimo |
| Seção 03 no celular (`t9-func`): estados A–H, onda, reversão, soltura do palco, aba oculta, movimento reduzido | 390, 430, 360 | **72/72 OK** |
| Onda dos cards da 03 (`t8-func`) | 1440, 390 | **32/32 OK** |
| Linha viva da 04 no celular (`t10-func`, com as opacidades publicadas da V3.1: `FC=.76 CC=.86`) | 390, 360, 375, 430 | **207/207** |

Com o código antigo (contexto recriado a cada seção), a linha viva tinha dado 206/207.
- A falha era a linha não montada 1,5 s depois de passar de desktop para celular.
- Medida à parte, a 1ª troca fria levava 431 ms com a película, contra 23 ms sem ela: era o custo de criar o contexto.
- Com os contextos migrando, a falha sumiu.

Uma rodada da linha viva usou as opacidades antigas (anteriores à V3.1) e acusou 30 falhas falsas. Foi descartada.

### 5.5 Regressão contra a produção (estilos calculados e caixas de todos os elementos, menos a camada nova)

Produção (vipzuesite.vercel.app = `main` `f22e323`) × branch. Para cada elemento de cada seção, do cabeçalho e do rodapé, em 6 telas (390, 360, 768, 1024, 1536, 1920), foram comparados:
- a caixa;
- 24 estilos calculados, incluindo `isolation`, `mix-blend-mode`, `opacity` e `transform`.

A camada nova fica fora da comparação.

- **Com movimento reduzido**, sem animações, só sobram as diferenças esperadas:
  - `isolation: auto → isolate` no root da 03;
  - o endereço do SVG da onda (produção × localhost).

  A única outra diferença foi um subpixel na CTA no 390: 385,45 → 385,67 px de altura. Nesse momento a CTA nem tinha camada, porque no celular a única camada estava na Hero.
- **Com movimento**, aparecem também diferenças de instante das animações: a onda dos cards, o brilho do botão, os cards da Hero e a entrada da jornada no 360. Elas não se repetem com movimento reduzido.
- Em todas as telas e nos dois lados, os campos WebGL que já existiam são os mesmos (05 e rodapé), nenhum recurso deu erro (fora o `favicon.ico` do servidor local) e o console ficou limpo.

### 5.6 Desempenho (medido nesta máquina; não vale como medida de celular real)

A GPU é a real (Intel Iris Xe, ANGLE/Direct3D 11), não um emulador de software.

**O problema do código do prompt.** Ao sair de uma seção, o contexto WebGL era destruído; ao entrar na seguinte, outro era criado e o shader, compilado de novo. Ao percorrer a página eram 8 criações. Isso foi corrigido com a adaptação 4 (§ 4.6).

**A medição justa.** Usei um navegador novo, frio, a cada carga, com três estados alternados e 3 cargas por estado:
- sem película (script bloqueado);
- código antigo (servido por interceptação);
- código novo.

Para cada seção, a medida é o maior intervalo entre quadros no 1,5 s depois de chegar nela. As 1ªs rodadas usavam um navegador só para várias cargas. A 1ª carga, sempre fria, caía com a película, e isso exagerava o custo dela e escondia o custo da própria página. Por isso foram refeitas.

| Seção (1440, desktop) | Sem película | Código antigo | Código novo |
|---|---|---|---|
| 03 | 1017 ms (pior 1083) | 1217 (1475) | 747 (1333) |
| Método | 267 (283) | **3333 (4478)** | 665 (678) |
| Para quem é | 167 (167) | 550 (**4136**) | 209 (267) |
| CTA | 283 (317) | 534 (600) | 500 (550) |
| FAQ | 300 (467) | 1067 (**6048**) | 283 (367) |
| Rodapé | 150 (167) | 500 (**7362**) | 133 (150) |
| Hero (volta) | 283 (350) | 467 (517) | 300 (467) |

| Seção (390, celular) | Sem película | Código antigo | Código novo |
|---|---|---|---|
| 03 | 117 (180) | 100 (433) | 629 (1200) |
| Método | 367 (400) | 500 (533) | 367 (667) |
| Para quem é | 150 (167) | 233 (**2158**) | 233 (284) |
| CTA | 500 (617) | **1067** (1084) | 400 (683) |
| FAQ | 217 (233) | 400 (417) | 150 (167) |
| Rodapé | 150 (186) | 483 (717) | 150 (250) |
| Hero (volta) | 517 (550) | 417 (**3298**) | 417 (450) |

Os valores são a mediana de 3 cargas; entre parênteses, a pior carga.

**Contextos da película criados por carga:** 8 no código antigo; **1** no novo, no celular e no desktop.

Leitura:
- O código antigo tinha travadas de 2 a 7 s na 1ª chegada a várias seções, com o navegador frio.
- O novo fica no nível da página sem película, que já trava 0,3 a 1 s na 1ª pintura de algumas seções: a 03 no desktop, a CTA e a Hero no celular.
- Sobram, no desktop, cerca de +0,4 s no Método e +0,2 s na CTA na 1ª chegada. No celular, uma carga em três chegou a 1,2 s na 03.

O que a medição cobre:
- Foi feita com a 1ª versão da adaptação 5, que esperava o `load`. A versão final só antecipa o nascimento da 1ª película (0,4 a 0,7 s depois do DOMContentLoaded), sem mudar o ciclo de troca de seção.
- **Com o navegador aquecido**, a película não muda os quadros por segundo em nenhuma seção: cerca de 56 a 61, o teto do ambiente.
- **Custo de uma criação de contexto**, com o navegador frio:
  - 1ª criação: link de 219 a 389 ms e 1º desenho de 50 a 114 ms;
  - com o navegador morno: cerca de 15 a 25 ms no total;
  - agora isso acontece uma vez por página.
- **Linha viva:** a única falha da 1ª rodada (207 → 206, a linha não montada 1,5 s depois de passar de desktop para celular) não se repetiu com o código novo: 207/207 (§ 5.4).
- **Abertura da página:** a medição é ruidosa nos dois estados, e não dá para afirmar um número.

## 6. Evidências (§ 63) — `docs/qa/mesh-v6/`

| § 63 | Arquivo(s) |
|---|---|
| 1. desligado × original | `antes-*`, `desligado-*` (10 pontos × 390 e 1440) e `folha-390.jpg` / `folha-1440.jpg` |
| 2. ligado × original | `ligado-*`, `dif-antes-ligado-*`, `onde-age-*` |
| 3. 03 clara no 390, águia e cards inteiros | `ligado-390x844m-s03.jpg`, `ligado-390x844m-s03-meio.jpg`, `historia-s03-35-390x844m.jpg` |
| 4. Hero no 1440 | `ligado-1440x900-hero.jpg`, `dif-antes-ligado-1440x900-hero.jpg`, `historia-hero30-1440x900.jpg` |
| 5. CTA e FAQ no 390 e no desktop | `ligado-{390x844m,1440x900}-{cta,faq}.jpg` |
| 6. dois quadros com 2–3 s de intervalo, parado | `quadros-faq-390x844m.jpg`, `quadros-faq-1440x900.jpg` (t e t + 3 s, com a contribuição da película em cada um); `mov-*-t2.5.jpg` |
| 7. acordeão aberto e história presa | `faq-aberta-*.jpg`, `historia-hero30-*.jpg`, `historia-s03-35-*.jpg` |
| 8. contextos, ouvintes e console | § 5.2 e § 5.3 |

Medições das evidências novas (par ligado/escondido no mesmo instante, com movimento):

| Evidência | 390 | 1440 |
|---|---|---|
| Hero a 30% da história | méd. 1,15 / máx. 6 | méd. 1,38 / máx. 7 |
| 03 a 35%, palco preso | méd. 2,98 / máx. 13 | méd. 5,14 / máx. 219 (\*) |
| FAQ: o quanto a película muda de t para t + 3 s | méd. 0,91 / máx. 26 | méd. 0,75 / máx. 4 |
| Acordeão aberto, 1ª pergunta | méd. 1,99 / máx. 8 | méd. 2,43 / máx. 9 |

(\*) O pico de 219 está nos cards. É a onda animada deles, que andou entre as duas capturas: o mapa `historia-s03-35-1440x900.jpg` mostra que a águia e os textos não mudam.

Com o acordeão aberto, a camada da FAQ acompanha a altura nova da seção (759 px no 390, 939 px no 1440, canvas igual).

## 7. Observações críticas

1. **O efeito está no limiar da percepção.** Dentro dos tetos autorizados, a película soma em média 1 a 5 de soma RGB, e no máximo cerca de 14, num total de 765. Em tela comum, a maioria das pessoas não vai perceber a diferença lado a lado. Ela aparece como um leve movimento de luz no fundo, mais visível no Método, na 03 e no rodapé. Para ficar evidente, seria preciso passar dos tetos (0,12 / 0,04), e isso pede nova autorização visual.
2. **Desempenho na troca de seção: corrigido** (§ 4.6, § 5.6).
   - O código do prompt recriava o contexto a cada seção, e isso dava travadas de 2 a 7 s com o navegador frio.
   - Com os contextos migrando, a página cria 1 contexto e fica no nível da página sem película.
   - O custo que sobra é o da 1ª pintura de cada seção, que a página já tinha.
3. **`soft-light` só age de verdade no Método, na CTA, na FAQ e no rodapé.** Na Hero e na 03, os grupos isolados fazem a película se comportar como alfa normal, por cima de um fundo transparente. Na 05, o blend normal foi escolhido (§ 4.5).
4. **Contextos WebGL na página.**
   - O teto do prompt vale para os contextos novos e foi cumprido: 1 no celular, 2 a partir de 768 px. Agora eles também são **criados** uma vez só: 1 no celular e até 2 no desktop por página.
   - Somando os 3 que já existiam, a página chega a 4 contextos vivos no celular e 5 no desktop.
   - Tablets de 768 e 820 px ganham 2 contextos, porque a regra do prompt é `max-width: 767.98px`.
5. **Arredondamento da área.** O `Math.round` do código do prompt pode passar o teto de pixels em até 0,05% (ex.: 406 × 1725 = 700 350). A matriz aceita 1% de tolerância por isso.
6. **Vidro.** Os cards de vidro da Hero e da 03 deixam ver a película atrás deles. Medido: sem amplificação, com Δ nos cards da mesma ordem que fora deles.

## 8. Pendências

- **iPhone real / Safari iOS, Firefox e Android: não testados.**
- Conferir num iPhone e num Android reais com a película no ar.
