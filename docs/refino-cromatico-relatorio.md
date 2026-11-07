# Refinamento cromático e limpeza visual — relatório (07/11/2026)

Pedido: "VIPZUE — Refinamento cromático e limpeza visual da landing page existente".

- Branch local: `feat/refino-cromatico`.
- **Não publicado.** A entrega é a implementação revisável no projeto.
- Os cinco HEX institucionais não mudaram:
  - Mocha `#5B4632`;
  - Marfim `#F3EDE3`;
  - Páprica `#D7673F`;
  - Páprica Profunda `#9F3930`;
  - Grafite `#22201D`.

## 1. Arquivos alterados

| Arquivo | O que mudou |
|---|---|
| `js/light-field.js` | Perfil escuro refinado (`PALETTE_REFINED` + uniform `u_tone`); curva clara recalibrada (`BEIGE` com miolo) |
| `css/hero.css` | Máscara horizontal no apoio escuro da headline (`.hero__content::before`); `none` no layout empilhado |
| `css/sections.css` | Sem ✦ nos cards do Método; sem sublinhado no hover do FAQ; sem os dois filetes do footer; destaque do card do Método com mais Páprica |

Não mudou:
- nenhum HTML;
- nenhum texto, fonte, geometria, tempo de animação ou `FIELD_CAP`;
- nenhum canvas, shader ou RAF novo;
- nenhum filtro global.

## 2. Parâmetros — antes → depois

**Perfil escuro (Hero, Método, FAQ, rodapé)**

| | Antes | Depois |
|---|---|---|
| Anchors da rampa (`STOPS` 0 / .18 / .36 / .56 / .78 / 1) | `#332B23 #47392B #5B4632 #6B402D #B04C27 #D7673F` | `#332B23 #47392B #5B4632 #7A351B #B64619 #D7673F` |
| Luminância OKLab dos anchors 3 e 4 | 0,418 / 0,540 | 0,418 / 0,540 (igual) |
| Croma no x 0,60 | 0,074 (`#71412D`) | 0,108 (`#7F371B`) |
| Pico dos campos com teto (x ≈ 0,70) | `#9B492A` C 0,118 | `#A4411A` C 0,140 |
| `STOPS`, `FIELD_CAP` (0,72) | — | sem mudança |

A luz deixa de passar por marrom e vai direto ao matiz da Páprica (40°). A luminância de cada ponto do campo continua a mesma, então o contraste do texto também.

**Perfil claro (Marfim → Páprica Profunda: seções 03, 05 e 06)**

| | Antes | Depois |
|---|---|---|
| Curva | `0,40 · seg(x, 0,34, 0,70)` | `0,46 · seg(x, 0,30, 0,60) + 0,16 · seg(x, 0,60, 0,74)` |
| Área aberta típica (x ≈ 0,47) | `#EBD6CB` | `#DFBAAE` |
| Miolo dos focos (x ≥ 0,74) | `#D6A599` (40%) | `#C58275` (62%) |

**Destaque do card do Método**

| | Antes | Depois |
|---|---|---|
| `--journey-hl-1` | `#6A3C2B` | `#7A351B` |
| Borda Páprica no destaque | 70% | 85% |

**Apoio escuro da headline (Hero desktop)**

| | Antes | Depois |
|---|---|---|
| `mask-image` | nenhuma | opaca até container + 7,1 × fonte (a 1440: x 590), 0,55 no meio (652), zero antes do olho (713) |

## 3. Como a seção 02 (close) foi preservada

- O shader recebe `u_tone` e mistura, anchor a anchor, o perfil legado (0) com o refinado (1).
  - No canvas principal, `u_tone = 1 − composição`, sendo a composição Hero 0 → close 1.
  - O reforço cede na mesma janela de rolagem que já leva a luz da Hero para a do close.
- No close estabelecido o tom medido foi 5,7 × 10⁻⁷, ou seja, zero: a saída é a mesma de antes.
- Ao voltar para a Hero, o tom volta a 1,000.
- A curva clara não alcança o close: lá a frente escuro → claro é 0 (`m = 0`), e só a rampa escura é calculada.
- Os campos das seções usam `tone: 1` fixo.

## 4. Sombra sobre a águia

- **Camada:** `.hero__content::before`, um `radial-gradient` Grafite de 62vw que serve de apoio de leitura da headline.
  - Ele fica no contexto de empilhamento do texto, que está acima da águia.
  - A 1440 chegava a ~0,6 de Grafite sobre o lado esquerdo da cabeça, incluindo o olho.
- **Correção:** uma máscara horizontal presa às mesmas variáveis que posicionam a águia (`--face-x`, `--eagle-w`, `--container-left`, `--hl-size`). Por isso acompanha qualquer largura.
  - Medido: 1920 vai de 956 a 1099; 1366, de 529 a 649; 1024, de 381 a 485.
  - No layout empilhado (≤ 767, ou ≤ 1023 em retrato) a máscara é `none` e o apoio do celular segue como estava.
- **Rejeitado:** mover o apoio para trás da águia. O `.hero__bg` continuaria escurecendo o close, porque o apoio some junto com a headline.

## 5. Estrelas ✦ (quatro pontas)

- Eram 4 instâncias, uma por card do Método, desenhadas por `#metodo .journey__detail::after`: máscara SVG de 18 × 18 no canto de baixo.
- A regra foi removida. O glifo e o path não existem em mais nenhum lugar.
- O `padding-bottom` de 36 px do card ficou, com o comentário atualizado. A altura dos cards não mudou: 452 px a 1440 e 253 px a 390.

## 6. Sublinhado do FAQ

- Removidos o bloco `@media (hover: hover) { .faq .accordion__trigger:hover span { text-decoration: underline … } }` e o token `--faq-underline`.
- Nenhuma regra `:hover` sobre a pergunta continua ativa.
- Seguem como estavam:
  - `.faq .accordion__trigger:focus-visible`, com outline de 2 px e offset de 4 px;
  - as bordas dos itens, com 1 px de Marfim a 0,2.

## 7. Os dois filetes do footer

- Eram `.site-footer__label::after`: uma linha de 1 px em gradiente Páprica, que crescia com `--bf-line` sob "© 2026 VIPZUE" e sob "Legal".
- Removidos:
  - a regra;
  - o estado `data-in="false"`;
  - a entrada na lista de movimento reduzido.
- O `padding-bottom: 13px` do label ficou, para não mudar a geometria.
- `.site-footer__rule` e `#contato::before` continuam intactos e conferidos.

## 8. Evidências

Ficam em `docs/qa/refino/`, pasta ignorada pelo git.
- **Antes:** `antes-1440-{hero,close,s03,metodo,pq,cta,faq,footer}.png`.
- **Depois:**
  - `depois-1440-{hero-sombra,hero,close,metodo,s03,pq,cta}.png`;
  - `depois-{1920,1366,1024,390}-hero.png`;
  - `depois-390-{metodo,pq}.png`;
  - `depois-rm-1440-metodo.png`;
  - `nogl-1440-{hero,metodo}.png`.
- **Fundos sem texto, usados no contraste:** `bg-*.png`.
- **Geometria de antes:** `geo-antes-1440.json`.

## 9. Testes e contraste (WCAG 2.2)

**Método de medição**
- O texto é escondido (`color: transparent`) e a tela é capturada.
- O fundo composto é amostrado no retângulo de cada texto, no pior pixel: percentil 3 para texto escuro e 97 para texto claro.
- A opacidade efetiva da cadeia de elementos entra na conta.
- O campo anda com o tempo, então os números valem para o quadro medido. A seção 03 também foi checada em node, pelo pior caso da deriva.

| Onde (1440 × 900, salvo indicação) | Texto | Pior caso | Exigido |
|---|---|---|---|
| Hero | headline Marfim (66 px) | 11,2:1 | 3:1 |
| Hero | "presença" / "digital" Páprica (66 px) | 3,65 / 4,33:1 | 3:1 (grande) |
| Hero a 1024 | "presença" Páprica (48 px) | 3,80:1 | 3:1 |
| Hero | menu Marfim a 0,75 | 5,17:1 | 4,5:1 |
| 03 | título | 6,48:1 | 3:1 |
| 03 | parágrafo Grafite a 0,88 (23 px) | 5,33:1 (node: 5,01 no pior ponto da deriva) | 4,5:1 |
| Método | título / subtítulo | 7,62 / 7,74:1 | — |
| Método | parágrafo do card em destaque (Marfim a 0,74) | 5,12:1 | 4,5:1 |
| Método a 390 | texto direto no campo | 5,28:1 | 4,5:1 |
| 05 | título / lead (0,92) | 11,45 / 10,34:1 | — |
| 05 a 390 | lead (0,92) | 5,40:1 | 4,5:1 |
| 06 | título | 10,58:1 (390: 6,49) | 3:1 |
| 06 | nota do painel (0,78) | 5,40:1 | 4,5:1 |
| FAQ | título / perguntas | 5,70 / 7,45:1 | — |
| Rodapé | links legais / © | 5,31 / 7,50:1 | 4,5:1 |
| Rodapé | ícones sociais (não-texto, 0,62) | 3,5:1 | 3:1 |

**Outras verificações**
- **Geometria a 1440:** altura do documento 12603 = 12603.
  - Iguais à base, com tolerância de 1 px: cards do Método, detalhes, cards da 05, painel da 06, perguntas do FAQ, labels e links do rodapé.
- **Geometria a 390:** altura 9815 nos dois casos (antes medido com `git stash`). Cards, rodapé e FAQ idênticos.
- **Larguras 1920, 1366, 1024, 768, 390 e 360:** sem rolagem horizontal. Máscara `none` em 768 (retrato), 390 e 360.
- **Movimento reduzido:** o campo fica estático, com tom 1 no Método. Sem erros no console.
- **Sem WebGL** (`getContext("webgl")` → `null`):
  - nenhuma `.has-field`;
  - as seções voltam ao sólido institucional;
  - a luz CSS da Hero é a mesma família Páprica, sem pintura dupla;
  - a máscara também libera a águia aqui.
- **Testes automáticos:**
  - `node tools/test-hero-voo.mjs`: 11/11;
  - `node --check js/light-field.js`: ok;
  - `node tools/build-site.mjs`: 274 arquivos.

## 10. Limitações

- **Luz CSS da Hero sem WebGL** (`.hero__light`): mantida com os anchors antigos (`#B04C27` / `#6B402D`). É o mesmo elemento que faz o fundo do close nesse modo, sem estado que separe Hero de close, e trocá-la mudaria a seção 02. A cor já é da família Páprica (`#D7673F` no centro).
- **Lead da 05 a 390:** o pigmento chega à borda do lead (pior pixel `#C69387`). Passa com 5,40:1, mas ali o Marfim fica menos puro do que no desktop.
- **Campo vivo:** os números de contraste são de um quadro. A margem do pior caso foi checada em node pela deriva do campo, que não reproduz o grão nem a vinheta.
- **Navegadores:** testado só no Chrome (DevTools), em desktop e em emulação móvel. Sem teste em Safari ou iPhone reais.
