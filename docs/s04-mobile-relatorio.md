# Seção 04 no celular — linha viva / Método — relatório (08/11/2026)

Prompt: "VIPZUE — PROMPT MESTRE DE EXECUÇÃO · SEÇÃO 04 MOBILE · LINHA VIVA / MÉTODO", com as referências REF_01 (mockup, 14.webp) e o asset de penas (15.webp).

- **Branch:** `feat/s04-mobile-linha`, a partir de `9419171` (Seção 03 mobile, também não publicada).
- **Publicação:** nada publicado. O `vipzue.com` não foi tocado ("PUBLICAÇÃO: não fazer deploy nem alterar vipzue.com sem autorização").
- **Onde vale:** só abaixo de 768 px (`max-width: 767.98px`). Tablet e desktop ficaram iguais ao "antes" (seção 6).

**Estado antes de editar** (`git status --short`): árvore limpa no `9419171`. Não havia alteração de terceiros a preservar.

## 1. Arquivos alterados e por quê

| Arquivo | Mudança |
|---|---|
| `index.html` | Só atributos e uma classe, aditivos, sem tocar em texto nem em ordem:<br>- no `<ol class="journey">`: a classe `vz-s4m-steps` e `data-vz-s4m-steps`;<br>- nos quatro `<li>`: `data-vz-s4m-step="0…3"`;<br>- nos `<h3>`: `data-vz-s4m-title`;<br>- nos `<p>`: `data-vz-s4m-copy`;<br>- o comentário da seção atualizado. |
| `css/sections.css` | Saíram as regras do ponto "tubelight" do celular (`.journey--lamp`). Entrou no fim do arquivo o bloco "VIPZUE · S04 MOBILE · linha viva" (linhas 3043–3214), só dentro de `@media (max-width: 767.98px)`. Dois comentários antigos foram atualizados para apontar para o bloco novo. |
| `js/journey-lamp.js` | O ramo do celular (o ponto que acendia sozinho) virou a linha viva (linhas 25–203). O ramo do desktop, da linha 205 em diante, não mudou: o `git diff` não tem nenhum trecho depois da linha 203. |
| `assets/secao04/penas-s04.webp` | Novo. É a plumagem 15.webp do chat: 941 × 1672, 366 KB, canal alfa preservado (cantos com alfa 0; 53% do quadro totalmente transparente). |

Nada foi instalado. Não entrou React, canvas, shader, WebGL, vídeo nem engine nova. A linha usa o GSAP/ScrollTrigger que o site já carrega.

## 2. Controladores reais reutilizados (arquivo:linha)

| O quê | Onde |
|---|---|
| O controlador da 04 que já existia: o mesmo IIFE, os mesmos auxiliares `clamp01`, `smooth` e `layoutTop` e o mesmo padrão `gsap.matchMedia` | `js/journey-lamp.js:7–23` |
| Montagem só no celular (com movimento e com movimento reduzido); fora do breakpoint, a limpeza do `matchMedia` desmonta tudo | `js/journey-lamp.js:202–203` |
| Curva em S do prompt (§17), com amplitude de até 35 px limitada pela borda da tela | `js/journey-lamp.js:47–55` |
| Montagem: um SVG, nove caminhos (3 trechos × base, glow e core) | `js/journey-lamp.js:57–74` |
| Medição dos quatro centros e dos caminhos | `js/journey-lamp.js:80–109` |
| Progresso (frente, ativo, estados, `--vz-s4m-k`, dashoffset) | `js/journey-lamp.js:118–154` |
| Um único `ScrollTrigger.create` sem pin (`start: 0`, `end: "max"`) | `js/journey-lamp.js:163–170` |
| Remedição: `refreshInit` (162), `ResizeObserver` do `<ol>` coalescido por rAF (175–182), `pageshow` (183), `document.fonts.ready` (184) | `js/journey-lamp.js` |
| Limpeza: mata o gatilho, desconecta o observer, remove os ouvintes, o SVG, as classes e as variáveis | `js/journey-lamp.js:186–199` |
| Pintura | `css/sections.css`:<br>- plumagem: 3072;<br>- SVG: 3086;<br>- camadas: 3096–3121;<br>- ponto (`::before`) e estados: 3124–3164;<br>- textos: 3166–3194;<br>- movimento reduzido: 3197–3214. |

## 3. Asset de penas

| Item | Valor |
|---|---|
| Arquivo | `assets/secao04/penas-s04.webp` (941 × 1672, 366 KB, alfa real) |
| URL local validada | `http://localhost:5173/assets/secao04/penas-s04.webp`, carregada com status 200 pelo `::after` em 360, 375, 390 e 430. Nenhum recurso da página com status ≥ 400. |
| No build | `site-vercel/assets/secao04/penas-s04.webp`, com o `url()` reescrito em `site-vercel/css/sections.css` |
| Posição final | `top: 28%`, `height: 72%`, `right: -44vw`, `opacity: .5`, `pointer-events: none`, `user-select: none`, `z-index: 0` (abaixo da linha e dos textos). Em 390 a caixa fica com 480 × 853 px, saindo 171,6 px pela direita. |

## 4. Como a geometria recalcula os quatro centros

`measure()` (`js/journey-lamp.js:80`) lê, para cada etapa:

```
x = li.offsetLeft + left(::before) + width(::before) / 2
y = li.offsetTop + top(::before) + height(::before) / 2
```

Os valores são relativos ao `<ol>`. A posição no documento é `layoutTop(ol) + y`. Com esses centros, `measure()`:
- redefine o `viewBox`;
- reescreve os três `d`;
- mede `getTotalLength()`;
- grava `strokeDasharray = length length` no glow e no core.

**Quando roda:**
- `refreshInit` do ScrollTrigger, que cobre resize, rotação e mudança de breakpoint;
- `ResizeObserver` no `<ol>`, que cobre quebras de texto reais e fontes, no máximo uma vez por quadro;
- `pageshow` (inclusive voltar pelo histórico);
- `document.fonts.ready`.

Nunca por quadro: durante a rolagem só se escrevem o dashoffset, a classe de estado e `--vz-s4m-k`, e só quando o valor muda.

**Por que offsets e não `getBoundingClientRect` (desvio do §17/§18):** as etapas entram com o `data-reveal`, que as desloca 16 px com transform até aparecerem. O `getBoundingClientRect` mediria a posição de entrada; os offsets dão a posição final.

**Verificado:** as extremidades de cada trecho caem nos centros reais dos pontos com erro de até 0,75 px, em 360, 375, 390 e 430, depois de resize celular → desktop → celular → paisagem → celular → 360.

## 5. Onde a rolagem controla a linha e os textos

Em `render(y)` (`js/journey-lamp.js:118`), chamado pelo `onUpdate` e pelo `onRefresh` do gatilho:
1. `front = scrollY + innerHeight × 0,54` (linha 129).
2. **Ativo:** o maior `i` cujo centro a frente já alcançou; Diagnóstico como fallback na entrada da seção (130–133).
3. **Estados:** anteriores `is-vz-complete`, o ativo `is-vz-active`, seguintes `is-vz-future` (135).
4. **Aproximação** (§14 e §19), só na etapa seguinte. `--vz-s4m-k` vai de 0 a 1 nos últimos 18% do trecho, com suavização (136–144). Ele:
   - firma o aro e acende um halo local no ponto, ainda sem núcleo;
   - leva título e parágrafo de atenuado até 1.
5. **Trecho i:** `t = clamp01((front − centro_i) / (centro_i+1 − centro_i))` e `strokeDashoffset = comprimento × (1 − t)` no glow e no core (146–153).

O núcleo champanhe só aparece quando a frente passa o centro do ponto. Nos quadros da seção 7, a 6 px do centro o ponto ainda é futuro (k 0,96); a 6 px depois, já é ativo.

## 6. Matriz de testes (Chrome headless com emulação de celular; dev server local)

| Teste | Resultado |
|---|---|
| Funcional, em 360 × 800, 375 × 812, 390 × 844 e 430 × 932 | **PASSOU** 207/207. Cobre:<br>- estrutura: 1 SVG, 9 caminhos, `aria-hidden`, sem eventos de ponteiro;<br>- extremidades nos centros (±0,75 px);<br>- corredor: linha a ≥ 9,5 px da borda e borda do traço a ≥ 12 px do texto;<br>- estados e opacidades em cada ponto;<br>- 50% e 90% de cada trecho (preenchimento ±2%, k, opacidade do próximo);<br>- fim: Entrega ativa, linha inteira;<br>- reversão até o Diagnóstico e antes do primeiro ponto (linha vazia);<br>- sem pin/sticky;<br>- passagens 03→04 e 04→05 sem salto;<br>- penas com status 200;<br>- `sw = iw`. |
| Limpeza e orientação | **PASSOU**. Sequência: celular → desktop 1440 → celular → desktop 1280 → celular → paisagem 844 × 390 → celular → 360 → desktop.<br>- No desktop: 0 SVG, nenhuma classe ou variável da linha, gatilhos do ScrollTrigger e ouvintes `pageshow` iguais aos do desktop recém-carregado.<br>- De volta ao celular: 1 SVG, e gatilhos e ouvintes iguais aos do celular recém-carregado. |
| Movimento reduzido (390 e 360) | **PASSOU**: textos em opacidade 1 em todos os pontos; linha inteira (dashoffset 0, sem tracejado) |
| Contraste (WCAG AA), 4 telas × 8 posições (cada ponto, o meio de cada trecho, o fim) | **PASSOU**, 0 falhas. Piores valores:<br>- headline 5,22;<br>- subheadline 4,95;<br>- título ativo 5,63 / parágrafo ativo 5,62;<br>- título futuro 3,23 (texto grande, mínimo 3) / parágrafo futuro 4,56;<br>- título concluído 5,26 / parágrafo concluído 4,62. |
| Contraste com movimento reduzido (390, 360, 430) | **PASSOU**, 0 falhas (pior parágrafo 5,62) |
| Desktop 1440 × 900, 1280 × 720, 1024 × 768 e tablet 768 × 1024 | **PASSOU**.<br>- Sonda igual ao "antes" em todos os pontos, fora uma posição explicada abaixo; a classe aditiva `vz-s4m-steps` foi descontada da comparação.<br>- Capturas estáveis com 0% de pixels diferentes.<br>- 0 SVG da linha.<br>- Os cards e a luz do desktop (`journey--fx`) continuam. |
| Águia da divisa 03→04 no celular | **PASSOU**: mesma caixa em 38/38 pontos medidos contra o "antes" (390, 360, 430, 375). Headline e subheadline iguais em 38/38. Altura da 04 igual nas quatro telas. |
| Seção 03 no celular (`t9-func`, 390, 360, 430) | **PASSOU** 24/24 em cada tela |
| `node tools/test-hero-voo.mjs` | **PASSOU** 11/11 |
| `node tools/build-site.mjs` | **PASSOU** (279 arquivos) |
| `git diff --check` / CRLF | **PASSOU** / 0 linhas LF sem CR nos três arquivos |
| Safari iOS, Android real, Firefox | **NÃO TESTADO** |

**A posição que diferiu no desktop:** a primeira posição de rolagem (meia tela antes da 04) pega a headline da 04 no meio da entrada. Duas rodadas do MESMO código já diferem ali (headline 452 ↔ 462 px em 1280; 14,6% de pixels) e "antes × depois" difere na mesma ordem. Não é mudança de CSS. Nas posições seguintes tudo é idêntico.

## 7. Capturas reais (todas em `docs/qa/s04-mobile/`)

**Estados do §27 em 360 × 800, 390 × 844 e 430 × 932.** Arquivos `final-<tela>-1-diagnostico-ativo.jpg` até `-7-volta-diagnostico.jpg`. Estados lidos na página no momento de cada captura (a = ativo, c = concluído, f = futuro):

| Captura | Estados | Notas |
|---|---|---|
| 1 Diagnóstico ativo | `afff` | |
| 2 transição 1→2 a 50% | `afff` | trecho 1 meio cheio |
| 3 Estratégia ativa | `caff` | |
| 4 transição 2→3 a 50% | `caff` | |
| 5 Construção ativa | `ccaf` | |
| 6 Entrega ativa | `ccca` | |
| 7 volta por rolagem ao Diagnóstico | `afff` | |

**Captura longa** (a seção inteira, 390 × 1659), com o estado que a própria página calcula:
- `final-390-captura-longa-construcao-ativa.jpg`: estados `ccaf`;
- `final-390-captura-longa-entrega-ativa.jpg`: estados `ccca`.

Como foi feita: viewport de 390 de largura alto o bastante para a seção inteira, rolado para que a frente (54% da altura) caia logo depois do ponto. Nada foi congelado nem injetado. A primeira tentativa, com `captureBeyondViewport`, redimensionava a página durante a captura e mostrava um estado misturado; foi descartada.

**Movimento.** `final-390x844m-quadros-dois-pontos.jpg`: 12 quadros reais, a −90, −55, −25, −6, +6 e +40 px da chegada da frente.
- Linha de cima: chegada à Estratégia. Linha de baixo: chegada à Construção.
- Mostram a linha avançando, o halo de aproximação crescendo (k 0 → 0,53 → 0,96) e o núcleo acendendo só depois do centro, junto com o texto pleno.

**Zoom.**
- `zoom-final-390x844m-ponto-ativo.png`: núcleo champanhe, anel Marfim, aro Páprica, halo.
- `zoom-final-390x844m-corredor.png`: curva, ponto concluído, ativo e futuro.

**Desktop.** `final-1440x900-secao04.jpg`: os quatro cards como antes. As capturas `depois-1440x900/1280x720/1024x768/768x1024m-rolagem*.jpg` são as comparadas com as `antes-*`.

**Antes.** `antes-*-rolagem*.jpg` e `antes-*-ponto*.jpg` (nas 8 telas).

## 8. Valores finais (medidos no navegador)

| Item | Valor |
|---|---|
| Ponto | 19 px (era 15 px), mesmo centro vertical. Centro em x = 33,5 px da tela, nas quatro telas. |
| Corredor | Texto começa em 64 px. A curva vai até 10 px da borda (amplitude 23,5 px, dentro dos 20–35 px do §17). A borda do traço fica a ≈ 29 px do texto (mínimo do §22: 12 px). |
| Trechos | 245–325 px de comprimento (variam com as quebras de texto de cada tela) |
| Linha | Igual ao §16:<br>- base Páprica .24, 1,45 px;<br>- glow Páprica Profunda .38, 5,5 px, sombra 4 px;<br>- core `#D7673F`, 2,05 px, reflexo champanhe 2 px. |
| Ponto ativo | Igual ao §16: núcleo `#FFD5A6`, aro `#D7673F`, anel Marfim interno de 2 px, halos de 5 / 12 / 26 px |
| Opacidades | Título: futuro .62 → 1 (com k) · ativo 1 · concluído .86.<br>Parágrafo: futuro **.76** → 1 · ativo 1 · concluído **.86** (ver desvios). |
| Transições | 170 ms só na opacidade do texto e nas cores e sombras do ponto. O texto nunca se move. |

## 9. Desvios (o que não segue o prompt ao pé da letra)

1. **Opacidade dos parágrafos: .76 no futuro e .86 no concluído; o prompt pede .58 e .83.** Com .58, o pior trecho do parágrafo futuro ficava em 3,55:1, e com .83 o concluído ficava em 4,42:1. Isso já acontece no próprio campo Mocha/Páprica, sem as penas, e o AA exige 4,5:1. O fundo sozinho exige pelo menos .71 e .84. Os títulos ficam como no prompt (.62 / .86), porque passam (texto grande). A versão literal são dois números em `css/sections.css:3180` e `:3193`, mas reprova no AA.
2. **Penas em `right: -44vw` e `opacity: .5`; o ajuste inicial é −30vw / .58.** O prompt permite ajustar esses valores quando a pena cobre letras ("mover imagem mais à direita e/ou reduzir opacidade"). Na posição inicial, em 360 px, a pena ficava sob o fim das linhas de Construção e Entrega: o parágrafo ATIVO caía a 4,6:1 e o futuro não passava com nenhuma opacidade.
   - Testei sete combinações. As que passaram: −40vw/.42, −42vw/.46 e −44vw/.5. Fiquei com a mais visível das três.
   - As que reprovaram: −38vw/.44 (4,42) e top 34%/−40vw/.46 (4,30).
   - top e height continuam 28% / 72%.
3. **Os pontos são o `::before` de cada etapa**, não um elemento `data-vz-s4m-dot` / `.vz-s4m-dot`. Não existe um nó de ponto no HTML, e o prompt proíbe criar outra bolinha por cima. As regras do §16 para `.vz-s4m-dot` foram aplicadas, valor por valor, ao `::before`.
4. **A plumagem é o `::after` do `<ol>`**, com o webp de fundo (`contain`, alinhado embaixo à direita), não um `<img class="vz-s4m-feathers">`. Um `<img>` dentro do `<ol>` não é HTML válido. O pseudo-elemento não entra na árvore de acessibilidade (equivale a `aria-hidden` + `alt=""`). O §09 permite "usar a imagem como background limitado dentro de um wrapper exclusivo".
5. **Asset:** o 15.webp do chat (941 × 1672, alfa conferido), não o `ASSET_01_PENAS_S04_RGBA.png` de 1024 × 1536, que não está no projeto.
6. **Limite da curva: 10 px da borda da tela**, em vez do `Math.max(7, …)` do §17. As coordenadas são relativas ao `<ol>`, que começa a 24 px da borda. Com o 7 do prompt, a curva ficaria limitada a 31 px da borda e seria quase reta. Com 10 px da borda real, a amplitude é de 23,5 px.
7. **Medição por offsets** em vez de `getBoundingClientRect` (seção 4): imune ao transform da entrada `data-reveal`.
8. **Halo de aproximação no ponto seguinte** (§19: "o marcador seguinte gradualmente ganhar um halo local na aproximação"). Aro mais firme e halo de até 12 px; sem núcleo. O critério 12 ("nenhuma bolinha acende antes") foi lido como o núcleo/estado ativo, que só vem na chegada (quadros da seção 7).

## 10. Os 22 critérios de aceite

| # | Critério | Resultado |
|---|---|---|
| 1 | Garra existente igual, uma instância, na fronteira | **PASSOU**: caixa idêntica ao "antes" em 38/38 pontos; nenhum arquivo dela tocado |
| 2 | Headline, subheadline e copies idênticas | **PASSOU**: o diff do HTML só tem atributos; caixas da headline/sub iguais em 38/38 |
| 3 | 4 blocos em altura natural, sem cards | **PASSOU**: altura da 04 igual ao "antes" (1751 / 1705 / 1659 / 1485) |
| 4 | Exatamente 4 marcadores originais, sem duplicados | **PASSOU**: os mesmos `::before`; o SVG não desenha pontos |
| 5 | Linha única e contínua pelos centros reais | **PASSOU**: extremidades ±0,75 px em 4 telas e após resize |
| 6 | Trilha-base visível, baixa intensidade | **PASSOU** (Páprica .24, 1,45 px; capturas) |
| 7 | Núcleo `#D7673F`, penumbra `#9F3930`, reflexo champanhe | **PASSOU** (§16 literal) |
| 8 | Ilumina gradualmente, inclusive parado no meio | **PASSOU**: 50% e 90% medidos (±2%) e capturas 2 e 4 |
| 9 | Futuro atenuado, ativo 100%, passado legível | **PASSOU**, com .76 / .86 nos parágrafos (desvio 1) |
| 10 | Halo do nó com a materialidade do hover desktop | **PASSOU** no zoom e nos quadros: valores do §16; a avaliação estética final é sua |
| 11 | Ao subir, linha, halo e opacidades regridem | **PASSOU**: reversão até o Diagnóstico e antes do 1º ponto |
| 12 | Nenhuma bolinha acende antes de a linha alcançá-la | **PASSOU**: estado ativo só com a frente ≥ centro (−6 px futuro, +6 px ativo) |
| 13 | Plumagem na região inferior, atrás dos textos, sem bloco preto | **PASSOU**: do fim da Estratégia ao fim da Entrega, alfa real, z-index abaixo da linha e dos textos |
| 14 | Fundo Mocha/Páprica da Hero / 04 desktop | **PASSOU**: o campo do celular é o preset aprovado (§68), sem mudança |
| 15 | Sem overflow; nenhum texto coberto | **PASSOU**: `sw = iw` em todas as posições; 0 falhas de contraste; linha a ≈ 29 px do texto |
| 16 | Não interfere no desktop | **PASSOU**: sonda e pixels iguais; 0 SVG; `journey--fx` mantido |
| 17 | Safari iOS e Chrome mobile sem repinturas instáveis | **NÃO TESTADO** em aparelho. Só Chrome headless com emulação, sem erros. Durante a rolagem só mudam dashoffset, uma classe e uma variável. |
| 18 | Trocar orientação e voltar não duplica | **PASSOU**: 1 SVG, gatilhos e ouvintes iguais aos do recém-carregado |
| 19 | Movimento reduzido mantém tudo visível | **PASSOU**: textos 1, linha inteira estática |
| 20 | Console limpo, sem 404, sem dependências extras | **PASSOU** |
| 21 | Passagens 03→04 e 04→05 preservadas | **PASSOU**: sem pin na 04, posição da 04 constante durante a rolagem, a 05 começa onde a 04 termina; Seção 03 ver abaixo |
| 22 | Regra mobile antiga que deixe o fundo diferente | **PASSOU**: nenhuma encontrada. O fundo do celular é o preset Mocha/Páprica aprovado (`css/sections.css`, bloco "04 — Método, fundo Mocha/Páprica — V6"); nada a corrigir. |

**Seção 03 no celular (regressão):** **PASSOU** 24/24 em 390 × 844, 360 × 800 e 430 × 932 (`t9-func`). Os itens incluem modo, gatilhos sem sobreposição, estados A–H, soltura do palco, onda, reversão, "S04 livre", console limpo e movimento reduzido.

## 11. Limitações não resolvidas

- **Aparelho real:** Safari iOS, Android e Firefox não testados. Tudo foi conferido no Chrome headless com emulação de celular.
- **Durante a entrada das etapas** (`data-reveal`, cerca de 0,6 s, quando a etapa chega à tela), o ponto sobe 16 px até o lugar enquanto a linha já está na posição final. A etapa está quase transparente nesse momento.
- **Ponto ativo:** o §15 sugere um núcleo de 7–9 px; o §16 (o "alvo de pintura fechado") pinta o disco inteiro de champanhe com anel Marfim de 2 px, o que dá um núcleo visível de cerca de 12 px. Segui o §16.
- **Anel do ponto futuro:** o §13 fala em "anel Páprica Profunda"; o §16 usa Páprica .50. Segui o §16.
