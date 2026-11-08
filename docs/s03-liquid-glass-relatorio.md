# Seção 03 — V5: águia no galho, composição editorial e quatro Liquid Glass Cards — relatório (07/11/2026)

Branch `feat/s03-liquid-glass`. **Publicado em produção** em 07/11/2026 (`main` em `453fe60`), com autorização do usuário ("Sim, publicar"). Conferido no site publicado: arquivos iguais aos locais e o mesmo comportamento em 1440 × 900, 1366 × 768 e 390 × 844.

Pedido: "VIPZUE — PROMPT MESTRE V5 — Reconstrução visual da Seção 03". A referência é a composição aprovada, a segunda imagem enviada.

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | Só a `#o-que-fazemos`: troca da imagem da águia, quebra da headline, copy do texto 1 e a `ol#s03Insights` exata da especificação, depois do palco. |
| `css/sections.css` | Variáveis e regras da `.s03`: a águia sem máscara e com `contain`, e o novo bloco "SECTION 03 / INSIGHTS GLASS (V5)". |
| `js/scroll-narrative.js` | `revealS03Insights` / `resetS03Insights`, uma comparação no `render(p)` já existente, `teardown()` e o estado inicial fora da narrativa. |
| `assets/secao03/aguia-galho-1536.webp` | Novo: o asset enviado (1536 × 1024, 334 KB, transparência real), sem alteração. |
| `assets/secao03/aguia-galho-960.webp` | Novo: o mesmo asset reduzido para 960 × 640 (130 KB), para o `srcset`. |

**Não tocados:**
- Hero (voo, cards, mobile), Método, Para quem é, CTA final, FAQ, rodapé e navegação;
- SEO, analytics, integrações e `js/config.js`;
- `js/light-field.js` e as transições entre as outras seções.

Os blocos alterados do CSS e do JS estão todos dentro da Seção 03 (conferido no `git diff -U0`).

Nenhuma dependência nova, sem React, Tailwind, TypeScript, shadcn ou Motion.

O arquivo antigo `assets/secao03/aguia-perfil-941.webp` continua no repositório, mas nenhuma página o usa mais. Ele não foi apagado: a remoção fica para quando você autorizar.

## 2. Águia

```html
<img class="s03__eagle" src="assets/secao03/aguia-galho-960.webp"
     srcset="assets/secao03/aguia-galho-960.webp 960w, assets/secao03/aguia-galho-1536.webp 1536w"
     sizes="52vw" width="1536" height="1024" alt="" decoding="async" loading="lazy" draggable="false">
```

**Posição:** quadrante superior direito, encostada à direita (`--s03-eagle-right: 0`), com `object-fit: contain`. A máscara de fim, que existia para o corte reto da águia de perfil, saiu. A nova imagem tem transparência e o galho e as garras ficam inteiros.

**Tamanho:** `--s03-eagle-h = min(61svh, 34.3vw, espaço livre à direita da headline)`, centralizada na faixa superior (`--s03-eagle-top`).

**Movimento:** os transforms da narrativa são os mesmos de antes. Só o `transform-origin` passou para o olho da nova águia (31,6 % × 18,6 %).

**Medidas no momento 1:**

| Viewport | Águia (x, y, largura × altura) | Folga headline → águia | Folga texto 1 → águia |
|---|---|---|---|
| 1536 × 865 | 749, 15, 792 × 528 | 168 px | 108 px |
| 1440 × 900 | 720, 47, 724 × 483 | 264 px | 104 px |
| 1366 × 768 | 686, 17, 684 × 456 | 149 px | 97 px |
| 1280 × 720 | 654, 20, 629 × 420 | 233 px | 189 px |
| 1920 × 1080 | 929, 19, 996 × 664 | sem colisão na linha | 243 px |
| 1024 × 768 | 653, 121, 374 × 249 | 66 px | 219 px |

As folgas foram medidas pelo canal alfa real do asset: são pixels da ave, não a caixa da imagem.

Em todos os viewports e nos três momentos: **0** pixels da águia sobre a headline ou os textos, e **0** dentro dos cards.

Abaixo de 1024 px, a figura da 03 continua oculta, como já era com a águia de perfil. A cena mobile (painéis e águia em voo na divisa) não mudou.

## 3. Headline e texto 1

- **Headline:** `Apenas encontrar sua<br> empresa não é suficiente.` O espaço depois do `<br>` mantém as palavras separadas quando o Word Reveal divide o texto (o `splitWords` lê `textContent`). A quebra é controlada pelo markup, e o `text-wrap: balance` no desktop a sustenta. Quebra depois de "sua" confirmada em todos os viewports desktop, com e sem a narrativa.
- **Cor e margem:** `#22201D` (já era o token da seção) e margem de 5,3vw.
- **Texto 1:** "Entre descobrir seu negócio e decidir entrar em contato, seu cliente precisa de respostas: o que você oferece, se faz sentido para ele, como funciona e qual é o próximo passo." Alinhado à esquerda, com `max-width` de 700 px limitado pelo espaço até a águia. Tem 3 linhas em 1366–1920 px e 4 em 1280 × 720 e 1024 × 768.
- **Momentos 2 e 3:** copy, ordem, tempos e animações inalterados.

| Viewport | Corpo da headline | Topo da headline | Topo do texto 1 |
|---|---|---|---|
| 1536 × 865 | 60 px | 160 px (18,5 %) | 364 px (42 %) |
| 1440 × 900 | 57,6 px | 168 px | 367 px |
| 1920 × 1080 | 60 px | 201 px | 412 px |
| 1280 × 720 | 52 px | 120 px | 289 px |

## 4. Cards

**HTML:** idêntico ao da especificação.
- `ol#s03Insights.s03-insights` com `aria-label` e `aria-hidden="true"` inicial;
- quatro `li.s03-insight--0N`;
- duas camadas `.s03-insight__liquid--a|b` em cada card;
- `.s03-insight__content` com número, `h3` e descrição;
- a copy exata dos quatro cards.

**Seletores novos:**
- `.s03-insights`, `.s03-insights.is-revealed` e `.s03-insights.is-leaving`;
- `.s03-insight`, `.s03-insight--01…04` e `.s03-insight__liquid(--a|--b)`;
- `.s03-insight__content`, `__number`, `__title` e `__description`;
- os keyframes `s03-liquid-flow-a` e `s03-liquid-flow-b`.

**Posição no desktop com a narrativa:** a `ol` fica fora do palco, na 2ª linha de uma grade da própria seção, como faixa `sticky` (`bottom: clamp(38px, 6,3svh, 56px)`). Ela acompanha o palco quadro a quadro sem um segundo palco sticky e sem ScrollTrigger novo (ver o desvio 1).

| Viewport | Faixa (topo → base) | Card | Espaço entre cards |
|---|---|---|---|
| 1536 × 865 | 573 → 811 (66–94 %) | 340 × 238 | 20 px |
| 1440 × 900 | 602 → 844 | 318 × 242 | 19 px |
| 1366 × 768 | 508 → 720 | 302 × 211 | 18 px |
| 1280 × 720 | 477 → 675 | 283 × 198 | 17 px |
| 1920 × 1080 | 782 → 1024 | 435 × 242 | 20 px |
| 1024 × 768 | 508 → 720 | 226 × 211 | 14 px |

**Folgas:**
- texto mais baixo → topo dos cards: ≥ 40 px em todos os momentos;
- descrição → base do card: ≥ 38 px.

**Tablet e celular (fluxo, depois da cena dos painéis):**
- 768 × 1024: 2 colunas, cards de 205 px, raio de 28 px;
- 360–430 px: 1 coluna, cards de 170 px, raio de 22 px, padding 22/24, título de 24 px e descrição de 16 px.

Em todas essas larguras, a varredura completa da seção dá **0** px de sobreposição com painéis ou headline e nenhuma rolagem lateral.

### Material

| Propriedade | Valor |
|---|---|
| Fundo | `linear-gradient(145deg, rgb(91 70 50 / .76), rgb(34 32 29 / .74))`; a especificação pedia .52/.50 (ver o desvio 3) |
| Vidro | `backdrop-filter: blur(10px) saturate(112%)`, com o prefixo `-webkit-` |
| Borda | 1 px Marfim a .72 |
| Raio | 28 px (22 no celular) |
| Sombra | `inset 0 1px 0` Marfim .32 e `0 14px 30px` Mocha .15 |
| Fallback sem blur | .90/.88 |
| Número | Páprica (`--color-paprika`), 600, algarismos tabulares |
| Título | Marfim, 600, `font-synthesis: none` |
| Descrição | Marfim |

### Líquido

- **Ciclos:** camada A com `s03-liquid-flow-a` em 13 s; camada B com `s03-liquid-flow-b` em 17 s. Ambas `ease-in-out infinite alternate` e só CSS.
- **Velocidade e fase:** nem a velocidade nem a fase dependem do GSAP ou do progresso da rolagem.
- **Pausa:** o líquido fica pausado até a primeira entrada e corre com `is-revealed`. Na saída, `is-leaving` o mantém correndo durante os 600 ms do esmaecer (ver a seção 5).

| Card | A: posição e opacidade | B: posição e opacidade | Atrasos (fases distintas) |
|---|---|---|---|
| 01 | −34 % / 52 %, **.45** | −27 % / 47 %, **.18** | −2 s / −8 s |
| 02 | 55 % / −43 %, .70 | 48 % / −33 %, .24 | −7 s / −3 s |
| 03 | 38 % / 27 %, .19 | −22 % / 49 %, .12 | −11 s / −5 s |
| 04 | 59 % / 53 %, .82 | 48 % / 54 %, .26 | −5 s / −13 s |

O card 01 no fluxo (tablet e celular) usa .32/.14. Os valores em negrito ficaram abaixo da especificação (.78/.26); o motivo está no desvio 4.

### Entrada

- Esmaecer de 600 ms (`ease`) e subida de 18 px (`cubic-bezier(0.2, 0.7, 0.2, 1)`) no `li`. A `visibility` da lista cai 600 ms depois da saída.
- **Movimento reduzido:** cards no fluxo e visíveis, líquido parado nas posições de referência e nenhuma transição.

## 5. Integração com a narrativa e comportamento na rolagem

`js/scroll-narrative.js` ganhou três coisas:

- `revealS03Insights()`: adiciona `is-revealed` e põe `aria-hidden="false"`.
- `resetS03Insights()`: tira `is-revealed`, põe `aria-hidden="true"` e, se os cards estavam à vista, adiciona `is-leaving`. Um `transitionend` da `visibility` da própria lista retira `is-leaving` quando ela termina de ficar oculta.
- No `render(p)` já existente: `const insightsOn = p > T.p[0].in[0]`, o início real do texto 1 (0,20). O DOM só é escrito quando o estado muda.

**Sem a narrativa:**
- No `teardown()`, por exemplo numa troca de breakpoint, os cards são revelados.
- Fora do modo `.s03-motion` (celular, tablet, desktop baixo ou movimento reduzido), também são revelados, no fluxo.

**Não mudou nada em:**
- o ScrollTrigger: o mesmo único, com os mesmos `start`, `end`, `scrub` e `pin`;
- o palco e o sistema de narrativa: nenhum palco sticky novo e nenhuma mudança no sistema;
- a altura da seção: 3633 px em 1536 × 865, igual à da `main`.

### Rolagem real com a roda do mouse

Em 1536 × 865, 1440 × 900, 1366 × 768, 1280 × 720, 1920 × 1080 e 1024 × 768: descida da seção inteira até o Método e depois subida até antes do texto 1, com um gravador por quadro.

| Critério | Resultado |
|---|---|
| Entrada | Exatamente quando p passa de 0,20 (ex.: 0,1898 → 0,2060). |
| Saída | Só quando p volta para menos de 0,20 (ex.: 0,2035 → 0,1953). Nenhuma outra troca no percurso. |
| Líquido durante a rolagem | 0 reinícios (o tempo da animação nunca volta). Com os cards visíveis, 0 quadros congelados e 0–1 ms de diferença acumulada contra o relógio. |
| Saída de 600 ms | `is-leaving` presente em todos os quadros do esmaecer e em nenhum quadro oculto. |
| Salto | Os cards andam com o palco: diferença de 0 px por quadro, inclusive na saída para o Método. |
| Duplicação | 4 cards, 1 lista e as mesmas 8 animações (os mesmos objetos) do início ao fim. |
| Resíduo | Depois da volta: `visibility: hidden`, opacidade 0 nos quatro cards e `aria-hidden="true"`. |
| Prova de movimento | Com a página parada no momento 1, capturas em 0, 3 s e 6 s: os cards mudam (diferença média de 0,4–0,7 por canal) e o texto 1 não muda (0). Arquivos `v5-<vp>-liquido-t0/t1/t2.jpg`. |

**Correção feita nos testes:** o CSS da especificação pausava o líquido no mesmo instante em que `is-revealed` saía. Na volta, isso congelava as manchas durante os 600 ms em que os cards ainda estão visíveis, o que contraria a §88. Por isso entrou o `is-leaving`.

**Comportamento anterior à V5:** o encaixe `scroll-snap-type: y proximity` do Método (rodada 6) segura a rolagem lenta para cima no início do Método. No Chrome headless, uma roda de 90–240 px volta para o ponto de encaixe. Isso acontece igual na `main` (medido lado a lado) e não foi tocado, porque está fora do escopo.

## 6. Testes

| Teste | Resultado |
|---|---|
| Layout desktop, três momentos (1536 × 865, 1440 × 900, 1366 × 768, 1280 × 720, 1920 × 1080, 1024 × 768) | Quebra depois de "sua"; 0 colisões da águia; folgas da seção 4; sem rolagem lateral |
| Alturas baixas (1280 × 600, 1366 × 650, 1536 × 700, 1920 × 700, 1024 × 600, 1440 × 560) | Sem sobreposição: topo e espaçamentos em rampa svh, cards com altura automática |
| Sem a narrativa (1440 × 500; movimento reduzido em 1536 × 865, 1100 × 800 e 390 × 844) | Cards no fluxo e visíveis, `aria-hidden="false"`, 120 px (56 no celular) entre o texto e os cards, líquido parado no movimento reduzido |
| Celular e tablet (360 × 800, 390 × 844, 430 × 932, 768 × 1024) | Colunas e medidas da seção 4, sobreposição 0, blur ativo, líquido correndo, divisa com a águia em voo preservada |
| Contraste real (10 viewports, pixels sob cada linha, 12 instantes do ciclo do líquido) | Descrições ≥ 4,55:1, títulos ≥ 4,56:1, números 1,42–1,65:1 (ver limitações) |
| Rolagem real (6 viewports) | Seção 5 |
| Desempenho, `main` (sem cards) × branch, 1536 × 865, 2 rodadas | Rolagem e repouso com mediana de 16,7 ms e p95 de 16,8 ms nos dois; nenhuma tarefa longa; 0–2 quadros acima de 34 ms nos dois |
| `node tools/test-hero-voo.mjs` | 11/11 |
| `node tools/build-site.mjs` | `site-vercel/` com 276 arquivos, incluindo os dois assets novos |
| `git diff --check` | Limpo; arquivos em CRLF |
| Console | 0 erros e 0 avisos em todas as rodadas |

**Evidências** em `docs/qa/s03-liquid-glass/`, pasta ignorada pelo git:
- `v5-<vp>-momento1/2/3.jpg` (desktop);
- `v5-<vp>-fim-paineis/cards/divisa.jpg` (celular e tablet);
- `v5-<vp>-movimento-reduzido-*.jpg` e `v5-1440x500-sem-narrativa-*.jpg`;
- `v5-<vp>-liquido-t0/t1/t2.jpg`;
- `antes-*` (estado anterior).

## 7. Desvios da especificação, todos medidos

1. **A `ol` fica fora do palco**, como faixa sticky na grade da seção. No celular, `buildPanels` transforma o palco no trilho dos painéis, e os cards dentro dele seriam presos à cena. A especificação também pede posicionamento só por CSS. A faixa acompanha o palco com diferença de 0 px por quadro.
2. **O esmaecer fica no `li`, não na lista.** Um ancestral com opacidade < 1 desliga o `backdrop-filter` dos filhos no Chrome, e o vidro perderia o blur durante a entrada.
3. **Vidro a .76/.74 em vez de .52/.50.** Com os valores da especificação, o Marfim das descrições ficou em 2,75–3,07:1 e o dos títulos em 2,63–2,9:1, porque o fundo Marfim da seção atravessa o vidro. Diminuir o pigmento (a alavanca da §80) não resolve: o problema é o fundo claro, não a Páprica. Com .76/.74, todas as descrições passam de 4,5:1, mas **os cards ficam visivelmente mais escuros que os da referência.** É o maior desvio visual; a decisão está na seção 9.
4. **Card 01 com .45/.18 em vez de .78/.26**, ou .32/.14 no fluxo. A borda da mancha sobe até a 2ª linha da descrição durante o ciclo, e com o valor original o contraste caía para 4,04–4,16:1. Aqui é a alavanca da própria §80.
5. **Título com peso 600.** O 700 da fonte não está carregado no site, e o `font-synthesis: none` evita o negrito falso.
6. **Entre 1024 e 1199 px com a narrativa, 4 colunas, não 2.** Uma grade 2 × 2 não cabe no palco fixo de 100svh junto com a headline e o texto. As 2 colunas valem no fluxo, sem a narrativa.
7. **Águia um pouco menor que na referência e centralizada na faixa superior.** O teto é o espaço livre à direita da headline, o que garante folga real em 1280 × 720 e 1024 × 768.
8. **Headline com 60 px (52–60 conforme a largura).** Na referência ela parece cerca de 15 % maior. Foi mantida a escala tipográfica do site.
9. **Texto 1 com linhas equilibradas (`text-wrap: balance`)**, sem as quebras nas vírgulas da referência. Fica em 4 linhas em 1280 × 720 e 1024 × 768.
10. **Adaptações para alturas baixas:** topo, espaçamentos, altura dos cards e corpos dos cards seguem rampas em svh.

## 8. Limitações reais

- **Testes só no Chrome (headless e emulação de celular).** Safari, iPhone e Firefox não foram testados. O desempenho foi medido sem GPU real: a comparação com a `main` vale, mas o custo do blur em hardware fraco não foi medido.
- **Números Páprica sobre o vidro com 1,42–1,65:1.** A cor é obrigatória pela especificação. São rótulos decorativos, e o título ao lado carrega o significado.
- **`aria-hidden="true"` inicial (HTML da especificação).** Sem JavaScript, leitores de tela não leem os cards. Com JS, eles são liberados na entrada ou imediatamente fora da narrativa.
- **Numeração repetida no tablet e no celular:** a cena mostra os painéis 01–03 e, logo depois, os cards 01–04.
- **Monitores muito largos dão cards alongados** (1920 px: 435 × 242).
- **A primeira imagem enviada foi usada como asset**, embora a especificação a chame de "estado anterior": é a águia recortada com transparência que a composição aprovada mostra.
- **Início do líquido:** na primeira entrada, o Chrome segura o tempo das animações por 2–3 quadros (cerca de 180 ms), enquanto o card ainda está surgindo. Depois disso não há mais pausa.

## 9. Decisão do usuário sobre o material

O material dos cards era o único ponto em que a fidelidade visual e a leitura entravam em conflito:

- **.76/.74:** leitura AA em todos os viewports, vidro mais escuro que o da referência.
- **Especificação literal (.52/.50):** fiel ao tom da referência, mas as descrições ficam em cerca de 3:1.

**Decidido em 07/11/2026:** manter .76/.74 (resposta do usuário: "Keep readable (.76)"). O desvio 3 fica aprovado.
