# Hero Mobile V5.0 — relatório

Data: 21/11/2026 · Prompt: Hero Mobile V5.0 (prompt mestre), referência visual 32.webp

## 1. Escopo e arquivos

| Arquivo | Mudança |
|---|---|
| `css/hero.css` | Bloco novo "HERO MOBILE V5.0" no fim do arquivo, todo dentro de `@media (max-width: 767.98px)`. Os cards ficam também dentro de `and (orientation: portrait)` |

Nada mais mudou:
- HTML, JS, a águia (asset, posição e tamanho), a copy e o destino do CTA continuam os mesmos;
- desktop e tablet não leem nada do bloco novo;
- não há elemento novo, animação nova nem canvas novo.

## 2. Fundo, luz e halo

As camadas existentes ganharam outra função:

| Camada | O que faz agora no celular |
|---|---|
| `.hero__bg` | Base Espresso/Shadow: linear 180° `#241009` 0 → `#170A06` 42% → `#241009` 74% → `#170A06` 100%. O halo antigo (`::before`, sob o Paper) zera para não somar duas luzes. A faixa do menu (`::after`) passa a ser Shadow, só do lado do menu |
| Jade (`.vz-atmosphere`) | Quatro focos com funções separadas: canto do cabeçalho (k 0,62), profundidade central (0,12), calor atrás da cabeça (0,55) e fechamento do pé (0,32). O Paper fica a 0,16 |
| `.hero__veil` | Recebe a luz localizada, de cima para baixo nesta ordem: vinheta lateral; luz do topo (72% × 32% em 4% 0%); halo da cabeça; luz secundária da plumagem |
| `.hero__grid` | Marfim a 0,045 |
| `.hero__content::before` | Scrim da headline em Shadow: 0,62 → 0,42 → 0 |

O halo e a luz da plumagem usam as mesmas variáveis que posicionam a águia (`--face-x`, `--eyes-y`, `--eagle-w`, `--eagle-h`), então acompanham a águia em qualquer largura. Na largura de 390 px o centro do halo fica a 50% × 32% do invólucro da águia, como o prompt pede.

Novas cores existem só como variáveis locais `--hero-mobile-*`.

**Desvio do prompt, para cumprir o próprio prompt (§08, separação da cabeça):**
- **O problema:** com a elipse especificada (140% × 95% do invólucro, stops 18/38/56/76%), o halo ficava quase todo escondido atrás da própria águia. No celular a cabeça ocupa quase toda a largura, e só os stops fracos (≤ 0,18) passavam do contorno. A captura `docs/qa/hero-m-v5/r1/` mostra a separação praticamente igual à de antes.
- **O ajuste:** os raios passaram para 190% × 180% do invólucro, e os stops andaram um pouco para fora (24/46/64/84%). Cores e alfas são os do prompt.
- **O resultado:** o Páprica médio agora contorna a cabeça e os ombros. Ver `r2/halo-com.jpg` e `r2/halo-sem.jpg` (sem a águia, para mostrar o halo isolado).

## 3. CTA

| Item | Valor |
|---|---|
| Largura | `clamp(268px, 75vw, 328px)`, máx. 100%. Mede 268 px em 320, 293 px em 390 e 323 px em 430 |
| Altura e padding | Altura mínima 54 px, padding 13/14 |
| Texto | Switzer 600, `clamp(11.75px, 3.3vw, 13.5px)`, Espresso `#241009` |
| Preenchimento | 110° `#D7673F` / `#F0753F` / `#D7673F` |
| Sombras | As três do prompt |
| Hover e foco | Só o glow sobe, de 0,22 para 0,30 |
| Foco visível | Marfim 2 px, offset 3 px |

A luz da borda (camada cônica e `--shiny-angle`) é a mesma de antes e continua girando. Com movimento reduzido, fica parada em 300°.

O `href="#contato"`, o `data-cta="whatsapp"` e o comportamento do clique não mudaram.

## 4. Cards

| Item | Valor |
|---|---|
| Largura | Card 1 `clamp(145px, 38vw, 170px)`; card 2 `clamp(153px, 40vw, 182px)`, deslocado 18 px. Cerca de 30% menores que antes: em 390, 156 e 160 px contra 197 e 193 px |
| Texto | 11,5 px / 1,32 e 11,25 px / 1,34, Switzer 500 Marfim |
| Superfície | Vidro escuro aquecido a 145°, borda 1 px `rgb(255 169 119 / .42)`, raio 13 px |
| Sombras | As do prompt; no card 2 o glow e o reflexo interno são mais fracos |
| Backdrop | `blur(8px) saturate(115%)` |
| Inclinação | −8° e −6° |

No celular, a película e o contorno do Liquid Glass do desktop ficam ocultos, porque davam borda dupla e tom mais claro. O desktop continua com eles.

**Posição:**
- topo a 55% da altura do invólucro da águia;
- à esquerda, `clamp(14px, 5.5vw, 25px)`.

Em todas as larguras os cards ficam à esquerda e abaixo do bico, sem cobrir olhos nem bico (teste automático e capturas).

O ciclo de destaque, de 6 s, é o mesmo de sempre. O card ativo ganha só um contorno mais claro.

## 5. Contraste (pixels reais sob cada linha, com o texto transparente)

| Texto | Meta | Mínimo medido (320–430 px) |
|---|---|---|
| Headline Marfim | ≥ 7:1 | 13,9:1 |
| Acento Páprica da headline | ≥ 4,5:1 | 4,59:1 (mediana 5,05) |
| Texto do CTA | ≥ 4,5:1 | 5,36:1 |
| Card 1 | ≥ 4,5:1 (alvo 7) | 9,3:1 |
| Card 2 | ≥ 4,5:1 (alvo 7) | 9,0:1 |

Os cards foram medidos sem a rotação. Com a rotação, a caixa de cada linha inclui pixels de fora do card, já na plumagem, e isso distorce a leitura.

## 6. Testes

| Teste | Resultado |
|---|---|
| Geometria e capturas em 320×568, 360×780, 375×812, 390×844, 414×896 e 430×932 | Águia no mesmo retângulo de antes em todas; overflow 0; 1 canvas; console limpo. Folha em `docs/qa/hero-m-v5/folha-mobile.jpg` |
| Funcional `t116-herofunc` nas 6 larguras e com movimento reduzido | Destino e atributos do CTA, altura ≥ 54 px, luz da borda girando (parada com movimento reduzido), clique para a âncora, foco por teclado (Marfim 2 px / 3 px), ciclo dos cards, cards fora de olhos e bico, menu abre e fecha, sem overflow, console limpo |
| Desktop 1536×865 e 1024×768, tablet 768×1024 | Mesma geometria de antes (águia, título, CTA e cards). Comparação lado a lado em `comparacao-1536.jpg` |
| Build `tools/build-site.mjs` | OK, 288 arquivos |

Nota sobre a luz da borda: no Chromium headless, o valor de `--shiny-angle` às vezes fica igual entre duas leituras próximas. O código de antes faz o mesmo (amostrado lado a lado), então não é regressão.

## 7. Limitações e pendências

- Testado só no Chromium (headless). O `backdrop-filter` e o conic animado podem render diferente no Safari iOS.
- **Pendente:** conferir num iPhone real.
- **Ainda sem dados (fora desta tarefa):** número do WhatsApp e URL do Instagram em `js/config.js`.
