# Rodada 03 de cor — relatório

Feita em 06/11/2026, na branch `feat/cores-r3`, a partir de `bf4a7db` (a versão em produção). **Nada foi publicado.**

**Como foi medido.** O contraste é medido por pixel:
1. A tinta do texto é escondida.
2. A tela é capturada (Chrome DevTools).
3. Calcula-se a luminância WCAG no pior pixel sob cada linha de texto.

Mínimos: 4,5:1 para texto normal e 3:1 para texto grande. "Antes" é a produção (`bf4a7db`), medida na mesma posição e largura.

## Matriz dos quatro sintomas (§56)

| Sintoma reprovado | Causa encontrada | Correção | Prova |
|---|---|---|---|
| CTA ainda escuro | O `.btn--primary-dark` (CTA do menu mobile) continuava Grafite. O `.shiny-cta` já era Páprica, mas o miolo puxava para Grafite. | Tokens de CTA em Páprica com tinta Grafite. `.btn--primary-dark` com superfície Páprica e a órbita preservada (mesmos ângulos e alfas, cores claras). Miolo do `.shiny-cta` = Páprica 90% + Grafite; brilho = `--color-button-glint`. | Pintura no DOM: fundo rgb(215,103,63), tinta rgb(34,32,29) no menu, na Hero e na 06. Rótulo: 4,54–4,60:1 em 9 larguras, em repouso e com foco. `v3-390-menu.png`, `v3-1440-hero.png`. |
| Páprica fraca no Mocha | Rampa escura com as âncoras altas em #674933 / #9F4B2D (marrom-cobre). | Âncoras 0.56 → #6B402D e 0.78 → #B04C27: mais croma e matiz mais vermelho, sem clarear o que fica atrás do texto. `STOPS` voltaram às posições originais. | Atrás do texto do Método, no celular, o pico é #934A2E (antes, ~#8B553A, mais marrom). Contraste 5,13–5,22 (antes 4,78). `antes-390-metodo.png` × `depois-390-metodo.png`. |
| Ambiente claro sem Páprica Profunda | A rampa clara ia para um rosado claro (#C98468 misturado), lido como bege. | A rampa clara mistura Marfim → **#9F3930** (Páprica Profunda) até 40%, no trecho 0,34–0,70 do campo. | Fundo medido na 05 e na 06 de #F6F0E6 (base) a #D6B3A8 / #D9AB9E (mancha). `antes-390-pq.png` × `depois-390-pq.png`; 768 sem "rosa uniforme". |
| Emendas sujas | A Rodada 02 deu `display:none` em todos os véus. Isso tirou também o véu FAQ → rodapé, o filete da 06 e o espaço reservado no celular. A 03 → 04 continuava com névoa. | Véus restaurados como na rodada 6. Só os quatro véus das emendas 04/05, 06/07 e 03 → 04 ficam com `background: none`. Restaurados o `#contato::before` e o véu do fim da FAQ. | Emendas A (03/Método), B (Método/PQ) e C (CTA/FAQ) em corte seco em 1440. A em 390, com a águia que cruza intacta. `v2-1440-emendaA/B/C.png`, `v2-390-emendaA.png`. |

## Provas de aceite (§117)

1. **CTA da Hero em Páprica, órbita preservada.** Feito: o rótulo dá 4,54:1. Durações, máscaras e opacidades da animação ficaram iguais.
2. **Método e FAQ com atmosfera Páprica mais forte.** Feito, com 0 falhas em todas as larguras (tabela abaixo).
3. **Para quem é.** Base Marfim, mancha Páprica Profunda perceptível, cards Mocha opacos com texto Marfim a 7,62:1.
4. **CTA final.** Painel Mocha (gradiente de 158° com 5% de Páprica no topo e 5% de Grafite no pé) e botão Páprica a 4,54:1.
5. **Cortes secos em 03/Método, Método/PQ e CTA/FAQ.** Feito, sem linha nem névoa nas capturas.

## Mapa de tokens alterados

| Token / constante | Antes | Depois |
|---|---|---|
| `--color-light-mid` | #9F4B2D | #B04C27 |
| `--color-cta-primary-{dark,light}-bg` | Grafite | Páprica |
| `--color-cta-primary-{dark,light}-text` | Marfim | Grafite |
| `--color-cta-primary-{dark,light}-hover` | `--color-button-core` | Páprica |
| `--color-shadow-light`, `--color-button-core` | existiam | removidos (sem uso) |
| `--shiny-bg-subtle` | Grafite | Páprica 90% + Grafite |
| `--shiny-highlight` | — | `--color-button-glint` |
| `PALETTE` (escura) | …#674933, #9F4B2D, #D7673F | …#6B402D, #B04C27, #D7673F |
| `STOPS` | [0, .17, .34, .52, .72, 1] (R02) | [0, .18, .36, .56, .78, 1] (originais) |
| `LIGHT` / `BEIGE` (clara) | BASE + BRONZE/CHAMP_L/IVORY | BASE #F3EDE3, DEEP #9F3930; `from .34`, `to .70`, `amt .40` |
| `.hero__light` (sem WebGL) | Páprica/Mocha antigos | rgb(176 76 39 / .38) e rgb(107 64 45 / .22) |
| Apoio da headline a 70% | .72 | .66 (§19: sem aumentar os alfas) |
| `.pq-card__visual` (brilho) | rgb(141 83 55 / .6) | rgb(176 76 39 / .6) |

`FIELD_CAP` (0,72), blooms, velocidades, geometria, SVGs da 05, placas Mocha e tooltip do rodapé ficaram iguais.

## Rampas

- **Escura.** Em x = 0,70 (perto do teto onde fica o texto), a cor é #9B492A, com luminância 0,119: Marfim 95% dá 4,99:1.
  - Até x = 0,70 a rampa nova é igual ou mais escura que a anterior, então o texto sob o teto não pode piorar.
  - Na Hero (sem teto) ela fica +0,012 mais clara entre 0,75 e 0,80.
- **Clara.** O pigmento máximo (40%) dá ≈ #D6A599.
  - Grafite sobre o pico: 5,96:1. Sobre x = 0,75: 4,50:1.
  - Com 55%, ficaria 4,77 / 3,78, por isso não foi usado.
  - Com `from` em 0,42, a mancha virava só um halo em volta dos cards.

## Contraste medido (0 falhas em todas as varreduras)

Pior valor por seção:

| Largura | Hero (acento ≥ 3 / CTA / menu) | 03 | Método | Para quem é | 06 (botão / nota / painel) | FAQ | Rodapé |
|---|---|---|---|---|---|---|---|
| 360 | 3,45 / 4,54 / — | — | 5,16 | — | — | 5,53 | — |
| 390 | 3,47 / 4,54 / 4,57 | 5,29 | 5,16 | 7,06 | 4,54 / — / 7,33 | 5,16 (resposta mais longa aberta) | 6,22 |
| 430 | 3,45 / 4,54 / — | — | 5,13 | 6,42 | 4,54 com foco | — | — |
| 768 | 3,40 / 4,54 / 7,61 | 5,81 | 5,22 | 7,62 | 4,54 / 5,38 / 7,44 | 5,56 | — |
| 1024 | 3,85 / 4,54 / 4,98 | — | 5,10 | 7,62 | 4,54 / 5,40 / 7,44 | — | — |
| 1366 | 3,93 / 4,54 / 5,10 | 7,75 (palavras lidas) | 5,10 | — | — | — | — |
| 1440 | — | 6,25 | 5,10 | 7,62 | 4,54 / 5,38 / 7,40 | 5,63 | 5,38 |
| 1920 | 3,19–3,37 (8 quadros, ~40 s) | — | — | — | — | — | — |

**Estados especiais (1440):**
- **Movimento reduzido:** Hero 3,76 / 4,60 / 5,21; Método 5,10; PQ 7,62.
- **Sem WebGL:** Hero 3,73 / 4,54 / 4,94; Método 5,10; PQ 6,54. O fallback mostra a luz Páprica nova.

**Palavras da 03 a 0,26–0,39 de opacidade no desktop.** São a revelação por rolagem (`rest: 0.3` em `js/scroll-narrative.js`, que não mudou): é o estado "ainda não lido". As palavras já lidas ficam em 7,75–7,9:1.

## Preservação

- **Geometria em 1440:** idêntica à produção (altura total 10803 px; todas as caixas medidas iguais).
- **CTA da Hero em 390:** mesma posição da produção (24, 149, 269×44).
- **Altura em 390: 9512 → 9816 px.** São +152 px no topo da 05 e +152 px no pé da 06, porque `--veil-long` voltou a reservar espaço no celular, como antes da Rodada 02 (§37/§107). **Decisão sua:** ver abaixo.
- **Véus restaurados:**
  - véu do fim da FAQ (72 px);
  - filete de 1 px no topo da 06;
  - transições narrativas da 03;
  - no desktop, `--veil-long: 0px`, como na rodada 6.
- **`vz-check-r6`:**

  | Largura | Rodada 02 (PASS/WARN/FAIL/NA) | Rodada 03 |
  |---|---|---|
  | 1440 | 45/3/8 | 46/3/7 |
  | 390 | 36/2/4/13 | 38/2/2/13 |

  - **Voltaram a passar:** `C.filete-05-06`, `C.faq-rodape` e `C.mobile-intacto`.
  - **`C.veus-saem` é falso positivo:** o checker só olha `display`, e os dois véus estão sem pintura (`background: none`, 0–1 px).
  - **`C.filetes` cobra as linhas de 1 px da rodada 6 nas emendas 04/05 e 06/07:** o corte seco pedido agora as dispensa.
  - **Antigas e não relacionadas à cor:** `B.img-alfa`, `B.contraste` (heurística do checker), `D.snap`, `D.sem-fresta` e `E.wordmark-centro`.
- **Build:** `node tools/build-site.mjs` gerou 28 arquivos, sem erro. `git diff --check` limpo.
- **Resíduos:** a única ocorrência de #E5D4BB é um comentário histórico em `tokens.css`. Não restou nenhuma instrumentação no projeto: os scripts de medição foram injetados só em tempo de execução.

## Arquivos alterados

`css/tokens.css`, `css/base.css`, `css/hero.css`, `css/sections.css`, `js/light-field.js`.

## Decisões para você

1. **Espaçamento no celular (+152 px na 05 e na 06).**
   - É a restauração do layout de antes da Rodada 02, que zerou essa variável sem pedido.
   - Se preferir manter o mais compacto, basta voltar `--veil-long` a 0 até 1023 px. A cor não depende disso.
2. **Águia de perfil da 03 no desktop.**
   - Com o corte seco 03 → 04, a figura esmaecida (40%) agora termina em linha reta na borda da seção; antes o véu a dissolvia.
   - Alternativa: uma máscara de gradiente só na figura. Isso devolve a dissolução sem névoa na seção, mas muda um quadro da narrativa, então não apliquei sem aprovação.

## Limitações

- Não testei Safari, iPhone, Firefox nem aparelhos físicos. A emulação foi de Chrome.
- Na Hero em 1920, o acento "presença digital" fica entre 3,19 e 3,37:1: folga pequena acima de 3:1 (quadros animados).

## Capturas

Ficam em `docs/qa/rodada-03/` (pasta local, fora do git):
- antes e depois em 1440: Método, PQ, Contato, FAQ e emenda A;
- antes e depois em 390: Método e PQ;
- emendas A, B e C (`v2-*`);
- menu e Hero (`v3-*`).
