# Seção 03 Mobile V1.0 — relatório

Data: 21/11/2026 · Prompt: Seção 03 Mobile V1.0 (reconstrução cromática, profundidade e correção da rolagem). Escopo: só abaixo de 768 px.

## 1. Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `index.html` | Script do `<head>`: no celular, a classe `s03-motion-m` (narrativa presa) deu lugar a `s03-reveal-m` (revelação no fluxo). A segurança de 3 s também remove a classe nova |
| `js/scroll-narrative.js` | O ramo de celular do `gsap.matchMedia` deixou de montar a narrativa presa. Agora um único IntersectionObserver revela cada bloco uma vez |
| `css/sections.css` | Quatro blocos novos "S03 Mobile V1.0", no fim do arquivo, todos dentro de `max-width: 767.98px` |

Desktop (≥ 1024 px) e tablet (768–1023 px) não mudaram (ver § 7). A montagem antiga do celular (`build("mobile")` e as regras `.s03-motion-m`) ficou no código sem uso. Como o prompt pedia uma intervenção cirúrgica, não removi nada.

## 2. Rolagem

### Mecanismo encontrado
GSAP ScrollTrigger com `scrub: 0.4` sobre um trilho medido em JS:
- percurso de 2,4 alturas de tela, mais o palco e a coluna de cards;
- `position: sticky` na coluna headline + texto, na figura da águia e na faixa dos cards (sem pin do GSAP);
- os três textos se revelavam palavra por palavra, partindo de uma opacidade de repouso de 0,3, e se substituíam no mesmo lugar;
- cada card entrava num marco fixo do progresso.

### Causa medida (390 × 844, antes)
- A seção tinha 3.455 px.
- A headline ficava parada na tela por cerca de 1.500 px de rolagem (casos A e C do § 66). A página avançava; o conteúdo é que ficava preso.
- O texto 1 passava cerca de 500 px de rolagem em 0,71 de opacidade.
- Os cards ficavam em opacidade 0–0,1 enquanto já ocupavam a tela.

Não havia bloqueio de toque, `preventDefault` nem scroll lock.

### O que mudou
- No celular nada fica preso. Sem pin, sem scrub, sem trilho e sem espaçador, a seção passa a ter a altura do conteúdo: 1.685 px.
- A base em fluxo que já existia no CSS (antes usada só com movimento reduzido ou com o celular deitado) virou o layout do celular.
- **Revelação:** um IntersectionObserver com threshold 0,12 e margem inferior −8%. Os nove blocos (headline, águia, três textos e quatro cards) ganham `is-in` uma única vez e deixam de ser observados.
- **Animação:** só opacidade e a propriedade `translate`, para não brigar com transforms existentes. Easing `cubic-bezier(.22, 1, .36, 1)`.

  | Bloco | Deslocamento | Duração |
  |---|---|---|
  | Textos | 12 px | 280 ms |
  | Headline | 12 px | 350 ms |
  | Águia | 12 px | 450 ms |
  | Cards | 14 px | 320 ms, com até 70 ms entre cards que entram juntos |

- **Salto e recarga:** a margem superior do observer é estendida, então tudo o que já passou acima da tela conta como visto. Um salto de rolagem ou uma recarga no meio da seção não deixam nada oculto.
- **Movimento reduzido:** tudo visível, sem animação.
- **Altura da tela:** nada depende dela.

## 3. Fundo

- **Base:** `#170A06`, mais o gradiente 180° Espresso/Shadow (0 / 30 / 60 / 85 / 100%). Fica na `.vz-atmosphere`, que tem a altura real da seção. O quadro da atmosfera, preso à tela, ficou transparente.
- **Jade:** a mesma receita e os mesmos focos, com intensidade reduzida (k: A 0,4, B 0,3, C 0,22, D 0,08).
- **Paper:** continua do pool, a 0,14 (antes 0,2). Não há canvas novo.
- **Luz presa à tela:** a luz Páprica do canto do quadro, que acompanhava a rolagem e caía atrás dos cards, saiu no celular.
- **Luz do topo da seção:** radial de 78% × 36% em 12% / 0, com os stops do prompt. Pertence ao início da seção.
- **Grade:** a mesma (44 px, 1 px), agora Marfim a 0,045. Dissolve nos últimos 96 px do quadro para não terminar seca na junção com a 04.

## 4. Águias

- **Águia no galho:** luz ambiente sob o asset, no `::before` da figura.
  - Âncora: as mesmas medidas que posicionam a águia, recalibradas abaixo de 375 e de 360 px.
  - Centro: no corpo da ave visível. O asset é cortado pela borda direita, e o centro de 65% do invólucro cairia fora da tela.
  - Tamanho: 130% × 110% do invólucro.
  - Stops: os do prompt (0,62 / 0,42 / 0,18 / 0).
- **Águia em voo da divisa:** luz secundária no `::before` da divisa, sob o asset, com os stops do prompt. Uma máscara a dissolve antes da junção, para não marcar a 04.

Assets, escalas, posições e recortes não mudaram (mesma geometria medida).

## 5. Cards

| Item | Mudança |
|---|---|
| Superfície | A película passou a ser Espresso 145°: `#371C16` → `#2D1712` 52% → `#241009`, a 0,94–0,95 |
| Reflexos internos | `inset 0 1px rgba(243,237,227,.07)` e `inset 0 -1px rgba(23,10,6,.28)` |
| Borda | O contorno existente, agora uniforme `rgba(243,237,227,.18)` |
| Sombras | `0 14px 30px rgba(23,10,6,.32)` e `0 0 18px rgba(215,103,63,.06)` |
| Gap | 16 px. Dimensões, padding, raio, textos e ordem não mudaram |
| Números e títulos | A variação local `#E37B56` só aqui; a Páprica institucional não mudou |
| Descrições | Marfim pleno |
| Onda (reflexo curvo) | Ver abaixo |

Na onda, o asset, a janela, a máscara original, os keyframes e as fases são os mesmos. Só a parte que passa atrás do texto ficou mais baixa (§ 49):
- é uma faixa a 0,3, combinada por interseção com a máscara original;
- os cards têm altura fixa de 170 px, então a faixa é exata;
- abaixo do texto, a onda continua em 100%.

## 6. Contraste (pixels reais com o texto transparente; cards em 4 instantes da onda)

| Texto | Antes (no ar, 390) | Depois (pior caso entre 320, 375, 390 e 430) |
|---|---|---|
| Headline | 7,2 | 10,3 |
| Textos 1–3 | 12,4 | 7,1 |
| Números (28 px) | 3,8 | 5,4 |
| Títulos (24 px) | 1,4 (sobre a onda) | 4,7 |
| Descrições (16 px) | 2,0 (sobre a onda) | 7,5 |

O 7,1 dos textos é o pior pixel, sobre a luz do topo em 320 px; a mediana fica acima de 14.

## 7. Testes executados

| Teste | Resultado |
|---|---|
| `t125-s03mfunc` em 320, 360, 375, 390, 414 e 430 × altura de cada um | Tudo PASS. Cobre: sem pin ou espaçador; só o fundo em sticky; rolagem lenta (headline acompanha, 0 px preso); fim com os 9 blocos em opacidade 1; reversa (nada some); rápida (saltos sem pausa e pulo para depois da seção); altura do documento estável; recarga no meio; sem rolagem horizontal; console limpo |
| Mesmo teste com movimento reduzido, e o celular deitado (740 × 360) | PASS |
| Desktop e tablet: estilos computados (21 propriedades, mais `::before`/`::after`) e geometria de todos os elementos da 03 e da divisa, antes × depois, em 1536 × 865, 1024 × 768 e 768 × 1024, com e sem movimento reduzido | **0 diferenças** |
| `t104-s03func` em 1536 e 1024 | Os itens de tempo (pool e sequência da narrativa) oscilam igualmente no código de antes e no de depois. É o headless deste ambiente atrasando quadros, não uma regressão. A prova de não-mudança do desktop é a comparação determinística acima |
| Build `tools/build-site.mjs` | OK, 288 arquivos. `node --check` do JS OK |
| Lint e typecheck | O projeto não tem |
| Capturas em `docs/qa/s03-mobile-v1/` | `antes/`, `r1`–`r4`, `folha-*`, `topo-r2.jpg`, `cards-r3.jpg`, `divisa-comparacao.jpg`, `r4-comparacao.jpg` |

## 8. Limitações

- **Safari iOS:** a gravação de referência é do Safari, mas os testes rodaram só no Chromium (headless, emulação de toque). O comportamento foi construído sem dependência de altura de tela nem de eventos de toque, mas falta conferir num iPhone real.
- **Revelação durante a rolagem:** no Chromium headless, as transições só avançam quando há quadro desenhado; o teste força um quadro antes de medir. Num navegador real isso não se aplica.
