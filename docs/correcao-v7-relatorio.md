# Correção visual e responsiva V7: relatório

Status: implementada e verificada na branch `feat/mesh-v61-fitas`, por cima da V6.1 "Fitas" (também não commitada).
**Sem commit e sem publicação.** Data: 08/11/2026.

Base de comparação:
- **antes**: a árvore de trabalho no início da V7 (V6.1 sem as correções). As capturas estão em `docs/qa/correcao-v7/antes/`.
- **produção**: `vipzuesite.vercel.app`, `main` e7c0339 (V6.0). Usada para separar o que é regressão do que já existia.
- **depois**: o estado atual. As capturas estão em `docs/qa/correcao-v7/depois/`, `vps/`, `vps-rm/`, `I/` e nas pastas por tarefa.

Ferramentas: Chrome 130+ headless via CDP (scripts próprios, sem dependências), emulação de toque e de dispositivo
móvel nos viewports < 768 px.

**Safari/WebKit não verificado.** Não há WebKit nem Playwright instalados nesta máquina, e instalar algo para isso
ficou fora do escopo. Para a barra dinâmica do Safari foi feita uma **simulação**: a FAQ e a sonda da cortina passam a
medir 100svh numa tela 83 px maior. O iPhone real continua pendente.

## 1. Arquivos modificados pela V7

| Arquivo | O que a V7 mudou |
|---|---|
| `css/tokens.css` | 01c: tokens do ambiente escuro `--env-dark-*`, fonte única da identidade da Hero. 01d: tokens do vidro líquido `--vz-glass-*`, fonte única do material da Seção 03. |
| `css/hero.css` | Fundo da Hero lido dos tokens (mesmos valores). Cards da Hero no celular: vidro da 03, ~7% menores, vão de 20 px pelo `gap`, excursão do ciclo em CSS. |
| `css/sections.css` | Método (base, luz presa à tela), CTA (base e destaque legível), FAQ (tokens, `min-height` no celular), véu do fim da FAQ, rodapé (sombra quente, 100lvh no celular), Seção 03 (vidro por tokens, sem overrides no celular, texto, apoio atrás da coluna, montagem da narrativa em grade com cards sticky). |
| `css/vz-mesh-overlay.css` | A película da FAQ nasce transparente na borda de cima (emenda CTA → FAQ). |
| `index.html` | `span.vz-env` decorativo dentro de `#metodo`. |
| `js/hero-display-cards.js` | A excursão vertical do ciclo vem do CSS (`--vzc-cycle-rise/-drop`) e é reavaliada ao trocar de layout. |
| `js/scroll-narrative.js` | Celular: percurso 3,2 → 2,4 telas, marcos de entrada dos quatro cards, `--s03-m-cards` e `data-s03-shown`. Desktop intacto. |
| `js/light-field.js` | Sem a história da Hero (telas baixas, movimento reduzido), a 03 usa a composição do close e o perfil da Hero fica fixo. |
| `js/vz-mesh-overlay.js` | No Método, a película entra depois do `.vz-env`. |
| `js/hero.js` | Correção do defeito antigo: depois de recarregar abaixo da Hero e subir, o conteúdo e o cabeçalho voltam visíveis (opacity + visibility no lugar de autoAlpha). |

Os outros trechos de `css/vz-mesh-overlay.css` e `js/vz-mesh-overlay.js` que aparecem no `git diff` são da V6.1. Cada
trecho da V7 tem um comentário "V7" com a causa: `grep -n "V7" css/*.css js/*.js index.html`.

**Não foram tocados:**
- `js/hero-voo.js` e `js/config.js` (nem o número do WhatsApp). Em `js/hero.js` só mudou a correção acima: o voo, o pouso e o close da águia não foram tocados;
- os arquivos e as fotografias das águias, o logotipo, as headlines e os textos de CTA;
- os links, o menu, o conteúdo da FAQ e a estrutura do rodapé;
- SEO, metadados, `sitemap.xml`, `robots.txt` e Analytics.

## 2. Tarefas A–I: causa, arquivo, mudança e validação

### A. Ambientes escuros unificados à Hero (a FAQ como referência secundária)
- **Causa.** Cada seção escura tinha a própria base:
  - Método: Grafite Quente `#22201D`;
  - CTA: uma "noite" com 75–83% de preto, `#17120D`;
  - rodapé: sombras oliva medidas em `#463527`;
  - Hero: `#352821`.
- **Arquivos.** `tokens.css` (01c), `sections.css` (Método, CTA, FAQ, rodapé) e `hero.css` (tokens, com os mesmos valores).
- **Mudança.** Método, CTA, FAQ e rodapé compõem as mesmas camadas da Hero: a profundidade `#332B23`, a sombra dos cantos `#2C201B`, a sombra quente lateral e as luzes Páprica e Páprica Profunda, sempre a partir dos tokens. A geometria das luzes não mudou.
- **Regressão encontrada e corrigida.** Com a base nova, o destaque da CTA no celular caiu para 3,88:1. Agora usa Páprica 80% com Marfim 20% e mede ≥ 4,86:1.
- **Validação.**
  - Folhas `A/folha-390.jpg` e `A/folha-1440.jpg`.
  - Emendas escuras na mesma família cromática (matiz 9–23°).
  - Contraste: veja §5.

### B. Continuidade do fundo do Método no celular
- **Causa.** Os gradientes tinham o tamanho da seção (1659 px de altura em 390 × 844). O radial cobria só a metade de cima e o linear terminava em Grafite, então Construção e Entrega ficavam sobre Grafite chapado.
- **Arquivos.** `sections.css` ("04 — Método, fundo"), `index.html` e `js/vz-mesh-overlay.js`.
- **Mudança.** As luzes passaram para `span.vz-env`, uma camada do tamanho da tela presa (sticky) dentro da seção, e a seção guarda só a base. No desktop a seção tem a altura da tela, então nada muda.
- **Regressão encontrada no QA final e corrigida.** Com a luz presa à tela, o fundo atrás das penas (`penas-s04.webp`) ficou mais claro. O parágrafo ativo das etapas caiu para um pior pixel de 2,78–3,03:1 em 320–390, contra 3,25–3,44 em produção.
  - Pela regra da rodada que calibrou as penas ("mover para a direita e/ou reduzir a opacidade, sem véu"), elas foram de −44vw a 0,5 para **−58vw a 0,42**.
  - Pior pixel ativo em 9 pontos do Método:

    | Largura | Depois | Produção |
    |---|---|---|
    | 320 | 3,69 | 3,25 |
    | 360 | 4,06 | 3,38 |
    | 390 | 5,13 | 3,44 |
    | 430 | 5,82 | 5,64 |

  - **Resíduo a 320.** Dois pontos ficam abaixo de 4,5: 3,56 (produção mede igual) e 4,24. São 0,17% dos pixels, nas pontas das penas e no halo. Mesmo sem as penas, 320 chega a só 4,52.
- **Validação.**
  - `A/390x844m-m0…m5`: seis pontos do Método, do início à saída.
  - `vps/*-metodo-fim.jpg`: o fim do Método em todos os viewports.

### C. Cards auxiliares da Hero no celular
- **Causa.** O material era outro, não o vidro da 03. O vão parado era de 9 px e chegava a 45 px no destaque do 1º card, porque o vão vinha do movimento e não do layout.
- **Arquivos.** `hero.css` (bloco retrato do celular) e `js/hero-display-cards.js`.
- **Mudança.**
  - Material: o vidro da 03 pelos tokens `--vz-glass-*`, sem onda.
  - Tamanho: largura `max(40%, 145px)` (antes 42,6%, piso 150) e padding menor. A letra não mudou.
  - Vão: `gap: 20px` no layout, com a excursão do ciclo reduzida a 3/2 px no celular. No desktop continua 36/22 px.
  - O ciclo GSAP, os tempos, o destaque alternado e os textos continuam os mesmos.
- **Validação.** `C/folha-hero.jpg` (antes × depois, 320–430). Medidas a 390:

  | Medida | Antes | Depois |
  |---|---|---|
  | Largura dos cards | 166,1 px | 156 px (−6%) |
  | Altura dos cards | 62,7 / 76,9 px | 58,5 / 72,6 px (−6,7% / −5,6%) |
  | Vão aparente num ciclo | 9–45 px | 20–23 px |

  - O 2º card fica em 4 linhas de 320 a 430.
  - Os cards não cobrem os olhos, o bico nem o CTA.
  - Desktop a 1440: 286,1 × 133,7, igual ao antes.

### D. Texto narrativo da 03 no celular
- **Mudança.** `clamp(18px, 4.6vw, 21px)`, line-height 1,4 e a tinta do desktop: Grafite com `--s03-text-alpha` (padrão 0,88), Switzer 400.
- **Arquivo.** `sections.css` (bloco editorial da 03 no celular).
- **Validação.**
  - A 390: 18 / 25,2 px, `rgba(34,32,29,.88)` (antes 15,2 / 21,75 px, Grafite a 100%).
  - A palavra final termina com opacidade 1 (`wmin` medido).

### E. Cards da 03 no celular com o vidro exato do desktop
- **Causa.** Três overrides só do celular: desfoque 7 px, onda ×0,88 e véu de leitura por cima da tinta.
- **Arquivos.** `tokens.css` (01d) e `sections.css`.
- **Mudança.**
  - Os overrides saíram. O material vem dos tokens e é idêntico nos dois: desfoque 10 px, saturação 135%, mesma tinta, contorno e reflexos. Geometria e ondas ficaram.
  - Em telas baixas (320 × 568, 375 × 667) os números dos cards ficavam em 2,85:1. A correção foi no fundo, não no vidro:
    - uma luz Marfim desfocada atrás da coluna (`.s03-mobile__feature-grid::before`), que não é ancestral do vidro;
    - sem a história da Hero, o campo de luz usa a composição do close na 03 (`light-field.js`).
- **Validação.** `E/folha.jpg`. Contraste:
  - com movimento: 167 medições a 320 × 568, 375 × 667 e 390 × 844, nenhuma falha;
  - com movimento reduzido: 52 medições, nenhuma falha;
  - números ≥ 3,10:1 (o mínimo de texto grande é 3:1).

### F. Narrativa da 03 no celular: sem vão vazio
- **Causa.** O conteúdo preso media ~360 px e o trilho 3,2 telas, e os cards vinham **depois** do trilho. A metade de baixo da tela ficava vazia por ~2.700 px de rolagem e o card 01 só chegava no fim.
- **Arquivos.** `sections.css` (narrativa no celular) e `js/scroll-narrative.js`.
- **Mudança.**
  - É a mesma montagem do desktop: a seção em grade e a faixa dos cards sticky dentro do trilho, presa 24 px abaixo do texto. Os dois soltam no mesmo pixel.
  - Cada card entra no seu marco do progresso (`CARDS_M`) por `data-s03-shown`, que só muda opacidade e translate de entrada do próprio card. O reverso sai na ordem inversa.
  - Percurso de 3,2 para 2,4 telas.
  - Uma única autoridade de rolagem (o ScrollTrigger da narrativa), sem pin do GSAP e sem `transform` no layout.
- **Validação.** `F/` (varreduras a 320, 360, 390 e 430) e `t19-func`.

  | Medida a 390 | Antes | Depois |
  |---|---|---|
  | Seção | 4099 px | 3455 px |
  | Página | 12213 px | 11782 px |

  - Vão texto → card 01 em repouso: 24–25 px (alvo 24, faixa 16–28). Durante a subida de entrada do card (18 px) e a troca de texto, o vão fica em 20–36 px por instantes.
  - Sequência de cards ao descer: `0 0 0 0 0 1 2 2 2 3 4 4 4 4 4 4 4`. Ao subir: `4 … 3 2 2 2 1 0 …`.
  - Não há pin-spacer, a onda só toca com o card revelado e visível, e o desktop ficou inalterado.
  - A faixa vazia que sobra fica só durante a formação da headline e a entrada do texto 1 (progresso < 0,3), antes de haver texto para acompanhar.

### G. FAQ no celular
- **Causa.** A FAQ media 631 px numa tela de 844. Enquadrada, mostrava a CTA em cima ou o rodapé embaixo, e produção mostra o mesmo.
- **Arquivo.** `sections.css`: `.faq.vz-faq { min-height: 100svh; height: auto }` abaixo de 768 px. A FAQ já era `position: relative`; não há scroll snap; o conteúdo e a entrada GSAP ficaram iguais.
- **Validação.**
  - A FAQ ocupa a tela inteira (`faq|faq|faq`) em 320, 360, 375, 390, 393, 414 e 430.
  - Aberta, cresce (873 px a 390, 953 px a 320) e fica coberta até o fim (`G/folha-faq-aberta.jpg`).
  - Folhas `G-antes/` × `G/`.

### H. Rodapé no celular
- **Causa provada.** O véu curto do fim da FAQ (`#faq > .veil--end`) levava o fim da FAQ ao Carvão `#332B23`, mais claro e acinzentado. Virava uma faixa de 72 px que deslizava sobre o rodapé durante a cortina, em todas as larguras.
- **A cortina não era a causa.** O overlay da cortina continua. Com a barra do Safari recolhida (100lvh > 100svh), o próprio ciclo de vida dela se desliga, porque o rodapé fica mais alto que a sonda, e o rodapé entra no fluxo.
- **Arquivo.** `sections.css`:
  - `#faq > .veil--end { background: none }`;
  - rodapé no celular com `min-height: 100vh; min-height: 100lvh; padding-bottom: env(safe-area-inset-bottom)`.
- **Validação.**
  - O fim da página mostra só o rodapé (topo, meio e base) em todos os 11 viewports, com movimento normal e reduzido.
  - Na simulação do Safari: cortina desligada, rodapé com 844 px no fluxo, fim só com rodapé.
  - Links legais alcançáveis e contraste do rodapé ≥ 5,46:1.

### I. Emendas sem cores novas
- **Encontrado na verificação.** CTA → FAQ no desktop mostrava uma linha reta (`#352017 → #5B3121`). O fundo das duas seções casa (`#351E16 → #341E16` com a película escondida), mas as fitas da FAQ (V6.1) começavam com força total na borda de cima. Produção (V6.0, sem fitas) não tinha a linha.
- **Arquivo.** `css/vz-mesh-overlay.css`: a película da FAQ nasce transparente na borda e fica inteira depois de `clamp(160px, 28svh, 280px)`.
- **Validação.**
  - Média de cor em faixas de 24 px de −192 a +192 px em volta de cada emenda, com o texto oculto, em 320, 390, 768, 1024, 1280 e 1440 (`I/`).
  - A única emenda escuro/escuro (CTA → FAQ) ficou contínua em todos: `#352017 → #351F17` (1440, 1280, 1024, 768) e `#1D110C → #1B0E0A` (320).
  - As emendas claro ↔ escuro (Hero → 03 em telas baixas, 03 → Método, Método → 05, 05 → CTA) continuam em corte seco, como antes e como em produção. O prompt permite isso: "as transições entre seções claras e escuras podem continuar contrastantes".
  - FAQ → rodapé é a borda da cortina, sem véu cinza.
  - Nenhum flash branco, nenhum buraco revelando o `body` e nenhum pseudo-elemento depois da sua seção (`elementFromPoint` em cada parada).

## 3. Antes × depois (capturas)

- Página inteira:
  - antes: `antes/folha-390.jpg`;
  - depois: `depois/folha-390.jpg` e `depois/folha-1440.jpg` (23 + 20 capturas);
  - produção: `I-prod/`.
- Cards da Hero: `C/folha-hero.jpg`.
- Seção 03: `folha-s03-antes.jpg`, `F/`, `E/folha.jpg`.
- FAQ e rodapé: `G-antes/` × `G/`, `G/folha.jpg` (inclui a simulação do Safari), `G/folha-1440.jpg`, `G/folha-faq-aberta.jpg`.
- Emendas: `I/folha-390.jpg`, `I/folha-1440.jpg`, `I/folha-320.jpg`. O antes da emenda CTA → FAQ está em `I/folha-1440-antes.jpg`.
- Movimento reduzido: `vps-rm/folha-rm-390.jpg`.

## 4. Viewports testados

| Viewport | Overflow horizontal | Erros JS | Recursos ≥ 400 | FAQ ≥ tela | Fim só rodapé |
|---|---|---|---|---|---|
| 320 × 568 | 0 | 0 | favicon* | 670 ≥ 568 | sim |
| 360 × 800 | 0 | 0 | favicon* | 800 | sim |
| 375 × 812 | 0 | 0 | favicon* | 812 | sim |
| 390 × 844 | 0 | 0 | favicon* | 844 | sim |
| 393 × 852 | 0 | 0 | favicon* | 852 | sim |
| 414 × 896 | 0 | 0 | favicon* | 896 | sim |
| 430 × 932 | 0 | 0 | favicon* | 932 | sim |
| 768 × 1024 | 0 | 0 | favicon* | 672 (tablet, fora da tarefa G) | sim |
| 1024 × 768 | 0 | 0 | favicon* | 768 | sim |
| 1280 × 720 | 0 | 0 | favicon* | 755 | sim |
| 1440 × 900 | 0 | 0 | favicon* | 900 | sim |

\* `/favicon.ico` dá 404 também em produção: o site não declara ícone. Isso é metadado e ficou fora do escopo.

- O percurso completo foi feito em 390 × 844 e 1440 × 900 (`depois/`).
- Com movimento reduzido, 390, 320 e 1440: sem erro, sem overflow, FAQ cobrindo a tela e cortina desligada como previsto.

### Testes funcionais (§15.5), 390 × 844 e 1440 × 900

| Teste | 390 | 1440 |
|---|---|---|
| Rolagem para baixo e reversa | OK (cards 0→4→0 em ordem) | OK |
| Rolagem interrompida (salto, vaivém) | OK (estado = passagem gradual) | OK |
| Recarga no meio da página | OK (a 03 reconstrói o estado) | OK |
| Resize (430, 360) e orientação (844 × 390 e volta) | OK (sem overflow; `--s03-m-cards` re-medido) | OK (1280, 1024, 1600) |
| Histórico: âncora #faq e voltar; outra página e voltar | OK | OK |
| FAQ fechada → aberta → fechada (clique real) | OK | OK |
| CTA clicável sem envio (clique real interceptado) | OK (Hero e CTA final) | OK (Hero e CTA final) |
| Menu (abre, trava a rolagem, link leva à seção e fecha) | OK | navegação do cabeçalho OK |
| Movimento reduzido | OK (sem erros, sem overflow) | OK |

O CTA final aparece como "indisponível" (sem `href`) porque `js/config.js` não tem número de WhatsApp. O estado é o
mesmo do antes e de produção, e nada foi alterado ali.

**Defeito anterior à V7, encontrado no QA e corrigido (09/11/2026, com o aval do usuário).** Recarregar a página abaixo da Hero e subir até o topo deixava o cabeçalho, a headline e o CTA invisíveis (`opacity: 0; visibility: hidden`), também em produção.
- **Causa.** Os tweens de saída usavam `autoAlpha` e o gatilho da Hero tem `invalidateOnRefresh`. Recarregado lá embaixo, o fim (0) era gravado como início.
- **Correção** (`js/hero.js`). `fromTo` com `opacity` de início explícito, e `visibility: hidden` só quando o próprio tween chega ao fim. Animação e tempos iguais.
- **Validação.**
  - Cinco sequências (recarga no meio, outra página e voltar, âncora e voltar, salto ao fundo, voltar no topo) em 390, 1024 e 1440: tudo visível e clicável.
  - Saída normal na rolagem idêntica à de produção ponto a ponto (opacidade, y e oculto no fim) em 390 e 1440.
  - Testes funcionais 18/18 (390) e 15/15 (1440).

**Achado de contraste anterior à V7.** O destaque Páprica da headline da Hero ("presença digital") mede 2,58:1 a 320 e
2,73–2,76:1 a 390 e 430. É texto grande, então o mínimo é 3:1. Produção mede igual: 2,58 e 2,75–2,76. A headline e a
tipografia são protegidas pelo prompt e o fundo da Hero manteve os valores, então ficou como estava, registrado.

Os cards da Hero no celular melhoraram. Em produção, o texto deles caía para 1,35–1,65:1 em alguns instantes, sobre a
película. Agora, na mesma medição (topo da Hero em 320, 390 e 430, três instantes), não há falha.

## 5. Desempenho e integridade

- **WebGL.** 4 contextos no celular e 5 no desktop, iguais aos de produção. A V7 não cria canvas nem contexto.
- **Laços de animação.** As chamadas de `requestAnimationFrame` por quadro, paradas, são iguais ou menores que em produção. São 2 cargas por lado, em Chrome headless.

  | Ponto | Local | Produção |
  |---|---|---|
  | Hero | 4,08–4,09 | 4,07–4,10 |
  | Seção 03 | 3,07–3,41 | 3,07–3,61 |
  | FAQ | 2,26–2,39 | 2,42–5,11 |

  A V7 não acrescenta nenhum `requestAnimationFrame` próprio.
- **ScrollTrigger.** Nenhum `ScrollTrigger.refresh()` durante a rolagem. O ResizeObserver da narrativa só agenda um refresh quando o tamanho real muda (`box|cards`). O fim de dois gatilhos (faixa de luz e FAQ) a 1440 passou de 10313 para 9806: no antes ele ficava desatualizado e além da rolagem máxima, e agora bate com ela.
- **Rolagem contínua da página inteira.** O p95 do intervalo entre quadros ficou equivalente ao de produção (local 50–75 ms × produção 47–65 ms, em headless sem GPU, ruidoso). Picos isolados aparecem nos dois.
- **Geometria do desktop (1440).** É a mesma do antes: seções, alturas, cards da Hero (286,1 × 133,7) e a narrativa da 03. Só mudaram as cores de fundo do Método e da CTA (tarefa A) e o fim do gatilho desatualizado.
- **Contraste final.** Varredura de todo o texto visível em 14 pontos da página, em 390, 320, 768 e 1440: 456 medições. As únicas falhas foram:
  - o destaque da headline da Hero, anterior à V7 e igual em produção;
  - o texto das etapas do Método no celular, que foi corrigido.

  Na reverificação depois da correção, o Método teve 63 medições: passa em 390, 768 e 1440 e deixa 2 pontos a 320. Em produção, os mesmos pontos falham 3 vezes (320 e 390). A película nunca é a causa: "sem película" mede igual.
- **Arquivos.** Tudo continua em CRLF.

## 6. Matriz de aceite A01–A25

| ID | Critério | Estado | Evidência |
|---|---|---|---|
| A01 | Hero preservada visualmente | APROVADO | 1440 igual ao antes; emenda da Hero `#5B3828` × produção `#5D3928`; `depois/` × `antes/` |
| A02 | Método, CTA, FAQ e rodapé com a identidade escura da Hero | APROVADO | tokens 01c; `A/folha-*`; emendas na mesma família |
| A03 | Nenhuma seção escura com fundo legado inconsistente | APROVADO | Grafite `#22201D` (Método) e `#17120D` (CTA) saíram; sombras do rodapé quentes |
| A04 | Campo do Método coerente até o último trecho | APROVADO | `A/390x844m-m0…m5`; `vps/*-metodo-fim`; penas recalibradas, com contraste melhor que produção em 320–430 |
| A05 | Cards da Hero com o vidro da 03 | APROVADO | estilo computado = tokens `--vz-glass-*` (mesma tinta, 10 px / 135%) |
| A06 | Cards da Hero sem onda interna | APROVADO | sem elemento de onda; capturas `C/` |
| A07 | Efeito dos cards da Hero funcionando | APROVADO | ciclo medido em 6,5 s: destaque alternado, mesmos tempos |
| A08 | Cards da Hero reduzidos sutilmente | APROVADO | 166,1 → 156 px de largura; −5,6% a −6,7% de altura |
| A09 | Cards da Hero mais próximos | APROVADO | vão aparente de 9–45 px para 20–23 px |
| A10 | Águia, headline e CTA intactas | APROVADO | sem sobreposição em 320–430; clique do CTA a 390 |
| A11 | Texto da 03 com a presença do desktop | APROVADO | 18 / 25,2 px, Grafite a 0,88, Switzer 400 |
| A12 | Texto final sem opacidade residual | APROVADO | opacidade mínima das palavras = 1 no fim |
| A13 | Quatro cards com a materialidade do desktop | APROVADO | material idêntico; contraste: 0 falhas em 219 medições |
| A14 | Quatro cards em coluna 1×4 | APROVADO | capturas `F/`, `vps/` |
| A15 | Ondas internas funcionando | APROVADO | onda toca com o card revelado e visível (medido) |
| A16 | Revelação do texto 01 como no desktop | APROVADO | mesmo `createWordReveal`; `F/` |
| A17 | Card 01 logo abaixo do texto 01, sem grande vão | APROVADO | 24–25 px em repouso; entra durante a revelação do texto 1 |
| A18 | Textos 02 e 03 progridem corretamente | APROVADO | sequência para baixo e reversa em `t19-func` |
| A19 | Sem pin-spacers nem trilhos vazios | APROVADO | 0 pin-spacer; seção de 4099 para 3455 px |
| A20 | FAQ com fundo em toda a extensão | APROVADO | ≥ tela em 7 celulares; aberta, coberta até o fim |
| A21 | CTA não fica sobre a FAQ | APROVADO | topo da FAQ = `faq\|faq\|faq` em todos os celulares |
| A22 | Rodapé sem resíduo da FAQ | APROVADO | véu cinza removido; fim só com rodapé em 11 viewports e na simulação do Safari |
| A23 | Rodapé com cobertura cromática e conteúdo íntegros | APROVADO | 100lvh; contraste ≥ 5,46:1; links legais alcançáveis (Chromium; WebKit real não verificado) |
| A24 | Desktop sem regressão de geometria | APROVADO | medidas a 1440 idênticas; 1024 e 1280 sem overflow; narrativa desktop inalterada |
| A25 | Desempenho, menu, links e efeitos principais funcionando | APROVADO | sem laço ou contexto novo; menu, FAQ, CTA e histórico OK; o defeito antigo da Hero após recarga foi corrigido (§4) |

## 7. Pendências

- iPhone/Safari real (barra dinâmica, `100lvh`, áreas seguras).
- Decidir se o destaque da headline da Hero (2,58–2,76:1, anterior à V7) entra numa rodada de legibilidade. A headline é protegida.
- Método a 320: os dois pontos residuais (3,56 e 4,24) só fecham com as penas a ≤ 0,34 ou fora do texto.
- Commit e publicação só quando forem pedidos.
