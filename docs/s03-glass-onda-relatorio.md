# Seção 03 — vidro translúcido e onda Páprica — relatório (08/11/2026)

Pedido: "VIPZUE — PROMPT MESTRE DE EXECUÇÃO · SEÇÃO 03 · GLASS TRANSLÚCIDO E ONDA PÁPRICA", com a referência 12.jpg
(fundo claro, cards translúcidos, texto claro, ondas Páprica/champanhe nas quinas). Branch `feat/s03-glass-onda`.
**Não publicado** (o prompt diz "NÃO publique").

Escopo: só o material e a luz interna dos quatro cards da 03, no desktop e no celular. Layout, posições, tamanhos,
tipografia (tamanho, peso, entrelinha), textos, águia, headline, GSAP/rolagem e outras seções não mudaram.

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | Classe `vz-s3-glass` na lista; em cada card, `vz-s3-glass-card` + `data-vz-wave`, as três camadas decorativas no lugar das duas `s03-insight__liquid` e os atributos `data-vz-s3-number/title/copy` no texto. Script novo antes de `js/scroll-narrative.js`. |
| `css/sections.css` | Material antigo do `.s03-insight` removido; bloco novo "VIPZUE · Seção 03 · material glass aprovado". |
| `js/section3-liquid-glass.js` (novo) | Controlador do loop da onda. |
| `js/scroll-narrative.js` | Cria o controlador e o liga ao revelar/reverter dos cards (3 linhas + comentário). |
| `assets/ui/vz-s3-wave.svg` (novo) | A onda: um único SVG vetorial, reutilizado pelos quatro cards. |

**Não tocados:** `js/hero.js`, `js/light-field.js`, `js/config.js`, a águia, a headline, as Seções 01, 02, 04 a 08 e o
rodapé. Nenhuma dependência nova. Sem WebGL, Canvas, `requestAnimationFrame`, React, Tailwind ou TypeScript.

O prompt descrevia o SVG e o HTML das camadas, mas não trazia o arquivo nem a marcação prontos. Os dois foram escritos
aqui, seguindo as regras dele.

## 2. Onde estão as camadas (spans)

`index.html`, linhas 261–297. Cada `<li>` tem, nesta ordem, antes do `.s03-insight__content`:

```html
<span class="vz-s3-glass__material" aria-hidden="true"></span>
<span class="vz-s3-glass__wave-window" aria-hidden="true"><span class="vz-s3-glass__wave"></span></span>
<span class="vz-s3-glass__rim" aria-hidden="true"></span>
```

Quinas (`data-vz-wave`):
- 01: `bottom-left`
- 02: `top-right`
- 03: `bottom-right-soft`
- 04: `bottom-right`

O texto ganhou só atributos (`data-vz-s3-number`, `data-vz-s3-title`, `data-vz-s3-copy`). As classes, a ordem e as
palavras continuam as mesmas.

## 3. Onde está o SVG

`assets/ui/vz-s3-wave.svg` (4 KB), `viewBox 0 0 1000 1000`, `preserveAspectRatio="none"`. Ele foi desenhado para a quina
inferior esquerda; o CSS gira ou espelha a janela nas outras quinas. Camadas, de trás para frente:
- penumbra Páprica Profunda (#9F3930), com desfoque largo;
- núcleo Páprica (#D7673F → #E07A4C → #FFD5A6 → #F0A273 → transparente), com desfoque médio;
- brilho interno champanhe (#FFD5A6 a .38);
- halo e linha da crista (champanhe #FFD5A6/#FFE9D2, sumindo nas pontas);
- uma segunda linha fina.

É usado como `background-image` do `.vz-s3-glass__wave`. O build copia o arquivo para `site-vercel/assets/ui/`
(conferido: idêntico ao original).

## 4. CSS antigo substituído

Removido do `.s03-insight`: o fundo em gradiente (.76/.74), a sombra e o `backdrop-filter`. Ficou só `border: 1px solid`;
a cor e o material vêm do bloco novo.

Saíram também:
- todas as regras `.s03-insight__liquid*` e o `@keyframes s03-liquid-flow`;
- as variáveis de foco por card (`--01` a `--04`) e a regra `html:not(.s03-motion) .s03-insight--01`;
- o `@supports` de fallback antigo;
- a regra do líquido no movimento reduzido.

Dimensões, padding, raio, grid, entrada e transform dos cards continuam nas regras de antes, sem mudança.

## 5. Valores finais

| Item | Valor |
|---|---|
| Película (material) | `linear-gradient(128deg, Mocha .30 0%, .19 47%, .27 100%)`, dentro da faixa .19–.30 do prompt |
| Blur | `blur(10px) saturate(135%)` (+ `-webkit-`); 7 px no celular; estático |
| Contorno | 1 px `rgb(255 239 221 / .76)` (champanhe) + aro interno (`.vz-s3-glass__rim`: .27 / .41 no alto / Páprica .23 embaixo) |
| Sombra | `0 11px 26px rgb(73 43 27 / .11)`, `inset 0 1px 0 rgb(255 248 237 / .43)` |
| Janela da onda | 50% × 50% do card, na quina indicada; máscara radial (bordas dissolvidas); a janela não se move |
| Intensidade da onda | 01 .84 · 02 .92 (a mais forte) · 03 .52 (suave) · 04 .86; × .88 no celular |
| Onda | 175% da janela, `@keyframes vz-s3-wave-drift` 10 s `ease-in-out` infinito: sobe → avança à direita → desce → volta (translate de −9%/9% a 15%/−20%, rotação de −8° a 9°) |
| Fases | atrasos −1 s, −4 s, −6,6 s, −8,2 s: os quatro nunca estão na mesma pose |
| Fallback sem `backdrop-filter` | Mocha .34 / .27 / .32 |
| Movimento reduzido | `animation: none`; a onda fica parada na pose neutra |

A animação é só `transform` na onda. O card não tem transform nem opacidade animados pela onda (testado).

## 6. Controlador e callbacks

`js/section3-liquid-glass.js` tem a lógica do prompt:
- uma instância por lista (`cardsRoot.__vzS3LiquidGlass`);
- `IntersectionObserver` com threshold .15;
- ouve `visibilitychange`, a troca de `prefers-reduced-motion`, `pagehide` e `pageshow`;
- liga a classe `vz-s3-glass--playing` só quando os cards estão **revelados, na tela, com a aba visível e sem
  movimento reduzido**.

Como a página usa scripts clássicos com `defer`, a função fica exposta como `window.createVzSection3LiquidGlass` e não
como `export`.

- **Quem liga o loop:** `revealS03Insights()` → `s03Glass?.markRevealed()` (`js/scroll-narrative.js:50`). Na narrativa
  do desktop isso acontece no mesmo marco de antes (progresso 0,20, início do texto 1). No fluxo, acontece logo na
  montagem.
- **Quem desliga:** `resetS03Insights()` → `s03Glass?.markUnrevealed()` (`js/scroll-narrative.js:59`). A chamada é
  direta, e não no `transitionend`. Ao remontar a narrativa (cruzar 1024 px e voltar), revelar e reverter acontecem no
  mesmo quadro, sem transição, e o `transitionend` nunca chegava. Isso deixava a onda tocando com os cards ocultos;
  um teste pegou o defeito, que foi corrigido.
- **`destroy()`:** existe e solta tudo (observer e quatro listeners), mas não é chamado. A página não tem desmontagem
  global, e as desmontagens por modo do `gsap.matchMedia` deixam os cards visíveis no fluxo, onde a onda tem de
  continuar. Fica pronto para quando houver uma.

## 7. Desvios

### 7.1 Cor do texto (diferente da referência)

Com o vidro claro de verdade, o Marfim do prompt fica sobre o Marfim do fundo: títulos, descrições e números Páprica
ficaram entre 1,35 e 1,96:1. Foi medido nos pixels sob cada linha, em 4 momentos do ciclo da onda.

| Variante | Resultado |
|---|---|
| Literal (Marfim + Páprica #D7673F) | 1,35–1,96:1. Captura: `docs/qa/s03-glass-onda/v1-1440x900.jpg` |
| B: véu escuro local atrás do texto Marfim | descrições 3,8–4,6:1, números 1,3:1; o card vira a placa cinza que o prompt proíbe (`varB-1440x900-t5.jpg`) |
| **C: tinta invertida (adotada)** | títulos e descrições Grafite #22201D (`text-shadow 0 1px 0` Marfim .35), números Páprica Profunda #9F3930; mesmo vidro claro (`varC-1440x900-t5.jpg`) |

Versão literal em uma linha, se preferir a referência à leitura: números `#D7673F`; títulos e descrições `#F3EDE3` com
`text-shadow: 0 1px 3px rgb(34 32 29 / .55)`.

### 7.2 Véu de leitura no fluxo

O campo de luz (`canvas.page-light-field`) é fixo na tela e, no estado claro da 03, pinta os focos com Páprica Profunda.
- **Narrativa do desktop:** os cards ficam presos embaixo e nunca chegam ao foco.
- **Fluxo** (celular, tablet, desktop com altura < 560 px ou com movimento reduzido): cada card passa por baixo do foco
  ao rolar. O vidro antigo (.76) escondia o foco; o translúcido deixa passar.

Varrendo a rolagem inteira, sem véu:

| Modo | Números | Descrições |
|---|---|---|
| Desktop com movimento reduzido | 1,56:1 | 4,0:1 |
| Tablet 768 | 2,33:1 | — |
| Celular | 3,01:1 (no limite) | — |

Correção local, como o prompt pede: só no fluxo (`html:not(.s03-motion)`), a película ganha uma segunda camada. É um
reflexo Marfim de cima para baixo: `linear-gradient(172deg, Marfim .52 0%, .42 42%, .18 74%, 0 100%)`, pela variável
`--vz-s3-read-veil`.
- Fica abaixo da onda, que continua inteira.
- Clareia a parte do texto e não escurece o vidro.
- Na narrativa a variável fica vazia, e o desktop principal não muda.
- Testado também em .42: o número do card 04 ficava em 2,71:1.

## 8. Resultados por tela (Chrome headless)

**Geometria:** cards, textos e quebras iguais ao "antes" nas 8 telas: 1280 × 720, 1440 × 900, 1920 × 1080,
1536 × 864, 768 × 1024, 390 × 844, 430 × 932 e 360 × 800.

**Contraste** (pior caso, 2º percentil dos pixels sob as linhas, sem contar `text-shadow`):

| Modo | Números (≥ 3) | Títulos | Descrições (≥ 4,5) |
|---|---|---|---|
| Narrativa 1280, 1440, 1920, 1536 (4 momentos da onda) | ≥ 3,24 | ≥ 7,86 | ≥ 6,67 |
| Celular 390, 430, 360 (varredura de rolagem) | ≥ 4,21 | ≥ 8,75 | ≥ 5,59 |
| Tablet 768 (varredura) | ≥ 3,71 | ≥ 8,69 | ≥ 7,19 |
| Desktop 1280 × 540, fluxo (varredura) | ≥ 3,05 | ≥ 6,47 | ≥ 5,03 |
| Desktop com movimento reduzido, 4 telas (varredura) | ≥ 3,02 | ≥ 6,51 | ≥ 5,12 |

Nenhuma falha.

**Funcionamento:** desktop 18/18 em 1280, 1440 e 1920; fluxo 14/14 em 390, 430, 360 e 768. 1440 e 390 foram
refeitos depois do véu, com o mesmo resultado. O que foi verificado:
- SVG 200;
- uma instância, com as três camadas antes do conteúdo;
- parado antes da revelação, inclusive depois de remontar a narrativa;
- revela no mesmo marco (p 0,19 oculto, 0,215 revelado);
- quatro ondas rodando, em fases diferentes;
- continua rolando (tempo só avança) e parado;
- pausa fora da tela e retoma com os mesmos nós e as mesmas animações;
- aba oculta, `pagehide` e `pageshow`;
- reverter para e revelar de novo retoma;
- card sem transform da onda;
- sem overflow;
- movimento reduzido: cards visíveis e ondas paradas.

**Prova de movimento:** dois quadros reais do card 02, com 2,6 s de intervalo, sem pausar nada:
`movimento-<tela>-card02-quadro1/2.jpg`.

**Regressões:**
- `test-hero-voo` 11/11;
- `build-site` ok (278 arquivos, SVG copiado);
- `git diff --check` limpo;
- CRLF em todas as linhas dos cinco arquivos;
- diff só no bloco da 03.

**Não testado:** Safari, iPhone e aparelho real. O `-webkit-backdrop-filter` está presente, mas o vidro e a onda não
foram vistos no WebKit.

## 9. Diferenças que ficam em relação à 12.jpg

Comparado a olho com a imagem anexada, sem sobreposição. Não é idêntico:
1. **Texto:** escuro (Grafite e Páprica Profunda); na referência é claro (item 7.1).
2. **Números:** Páprica Profunda, mais escura que o laranja vivo da referência.
3. **Onda:** a forma e as cores seguem a referência (núcleo Páprica, crista champanhe). Em algumas fases do ciclo o
   brilho fica mais arredondado que a faixa da imagem (ex.: quadro 2 do card 02), e a crista passa de leve atrás da 2ª
   linha da descrição do card 01.
4. **Fundo:** na referência é liso. Aqui o foco Páprica do campo de luz aparece através do vidro quando o card passa por
   ele (no fluxo), e o véu de leitura deixa o alto do card mais fosco que na imagem.
5. **Composição:** a da página (headline, águia, cards embaixo), sem mudança. A referência mostra só os cards.

Capturas em `docs/qa/s03-glass-onda/` (fora do git): `antes-*`, `depois-*`, `movimento-*`, `reduzido-*`, `ph1/ph2-*`
(fases fixas), `v1-*` (literal), `varB/varC-*`.
