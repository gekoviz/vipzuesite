# Rodada 5 — Ajustes: relatório

Feita na branch `feat/rodada5`, a partir da `main` em `e80bac2` (rodada 4 em produção).

A §11 pede publicar a cada commit, mas o push na `main` é bloqueado pelo auto mode ("Production Deploy"). Por isso os commits foram publicados de uma vez, depois da confirmação do usuário (como na rodada 4).

**Publicado em produção em 02/11/2026:** fast-forward da `main` (`e80bac2` → `626b744`) com push.

**Prova de deploy:** `curl -sI https://vipzuesite.vercel.app/js/handoff.js` → `HTTP/1.1 404 Not Found`. O HTML publicado traz os novos `span.veil`.

**`vz-check-r5` em produção** (aba em primeiro plano):

| Largura | PASS | FAIL | WARN | NA |
|---|---|---|---|---|
| 390 × 844 | 36 | 0 | 1 | 0 |
| 768 × 1024 | 30 | 0 | 1 | 1 |
| 1024 × 768 | 38 | 0 | 1 | 0 |
| 1366 × 650 | 38 | 0 | 1 | 0 |
| 1440 × 900 | 38 | 0 | 1 | 0 |

- `A.sem-js` dá PASS em produção (404, sem tag).
- O WARN é o `Z.manual`, e o NA é o `E.lampada` a 768.
- Os números são idênticos aos do local. Salvo indicação, os de (5) e (6) abaixo são do servidor local (`http://localhost:5173/`), no Chrome via DevTools.

## (1) Resumo em 5 linhas

1. **O efeito de entrada 04 → 05 saiu.** Foram retirados o `js/handoff.js`, o invólucro `.handoff`, os `data-handoff*` e o patch `data-covered`. O véu 04 → 05 continua igual, agora na classe genérica `.veil`.
2. **Véus novos:** um longo no fim da 06 (06 → 07) e um curto no começo e no fim da 07 (07 → rodapé). O Carvão encontra o Carvão no mesmo pixel nas duas divisas.
3. **Rodapé do celular (≤ 767px) com a altura da tela** (844px em 844px). A cortina continua ligada e a wordmark em 100% da largura.
4. **Botão da 06** nas cores do Primary CTA sobre fundo claro (Grafite #22201D, texto Marfim, contraste 14,0:1, hover Carvão, anel de foco Grafite). O efeito é o mesmo, e o botão da Hero não muda.
5. **04 no desktop (≥ 1024px):** quatro cards em linha (01–04, ✦ e destaque que nasce no 02 e acompanha o ponteiro) e headline à esquerda em 2 linhas. `vz-check-r5`: **36/30/38/38/38 PASS e 0 FAIL** em 390/768/1024/1366×650/1440; o único WARN é o `Z.manual`.

## (2) Arquivos alterados

| Arquivo | O que mudou |
|---|---|
| `js/handoff.js` | **Apagado** (o efeito da rodada 4). |
| `index.html` | (ver lista abaixo) |
| `css/sections.css` | (ver lista abaixo) |
| `js/light-field.js` | Reverte o patch `data-covered`. O `drawAll` voltou a `if (fl.inView && !fl.field.lost()) fl.field.draw(fl.state, fl.comp);`. |
| `js/footer-curtain.js` | A cortina liga com `h <= smallViewport() + 1`. A folga de 1px cobre o arredondamento do rodapé de 100svh. |
| `js/beam-footer.js` | O teto de altura da wordmark não vale em ≤ 767px. Lá o rodapé tem altura de tela, e o teto a encolheria. |
| `docs/rodada5-relatorio.md`, `docs/ANDAMENTO.md` | Este relatório e a entrada do dia. |

**`index.html`:**
- Sai o invólucro `div.handoff[data-handoff]` e os `data-handoff-*` da 04 e da 05.
- Sai a tag do `js/handoff.js`.
- Os véus 04 → 05 viraram `span.veil.veil--short.veil--end` (último filho da `#metodo`) e `span.veil.veil--long.veil--start` (primeiro filho da `#para-quem-e`).
- 06: `span.veil.veil--long.veil--end` como último filho.
- 07: `span.veil.veil--short.veil--start` como primeiro filho e `span.veil.veil--short.veil--end` como último.
- Nenhum texto muda (`G.copy-intacta` PASS).

**`css/sections.css`:**
- O bloco da dobra e do efeito da rodada 4 virou o bloco `.veil` da §3.3:
  - `:root` com `--veil-stops`, `--veil-short` e `--veil-long` (com a variante ≤ 1023px);
  - modificadores `--short`, `--long`, `--end` e `--start`;
  - `isolation: isolate` nas 04, 05, 06 e 07.
- `--pq-veil` aponta para `--veil-long`.
- As duas regras de reserva da águia voltaram a `.s03-seam + .section`.
- 06: `padding-bottom: calc(var(--veil-long) + var(--space-md))`. Ver o ajuste da media de 767px em (3).
- Bloco 08: rodapé do celular em coluna com `min-height: 100svh`.
- Bloco da 06: `@property --shiny-bg` e as cores do ShinyButton sob `.closing`.
- Bloco da 04 no desktop: `@property --hl`, os quatro cards em linha e o título com `max-width: 8.4em`.

**Commits** (os 6 da §11, mais uma correção):

| # | Commit | Mensagem |
|---|---|---|
| 1 | `d604d8f` | refactor(dobra): retira o efeito de entrada 04 → 05 e reabriga o véu em .veil |
| 2 | `a03c0ea` | feat(dobra): véus 06 → 07 e fim da FAQ |
| 3 | `cffb7ab` | feat(rodape): rodapé do celular na altura da tela |
| 4 | `72d7749` | feat(cta): botão da 06 nas cores do Primary CTA sobre fundo claro |
| 5 | `ce18433` | feat(s4): cards em linha e headline à esquerda no desktop |
| — | `5feca01` | fix(s4): o card 02 fica aceso com o ponteiro sobre ele mesmo (ver (3)) |
| 6 | este | docs: exceções E14–E18 e relatório da rodada 5 |

## (3) Ajustes em relação ao prompt, e por quê

1. **Padding da 06 no celular.**
   - A regra `.closing { padding-block: var(--space-5xl); }` da media `max-width: 767px` vinha depois do novo `padding-bottom` e o anulava. Com isso, o `B.respiro-06` dava −56px a 390: o conteúdo entrava no véu.
   - Ela virou `padding-top: var(--space-5xl);`, com um comentário.
   - Agora o respiro é de **24px** a 390 e a 1440. O topo da 06 não muda.
2. **Destaque dos cards da 04 com o ponteiro sobre o próprio 02** (commit `5feca01`).
   - No CSS da §7.3, a regra que apaga o 02 quando há ponteiro na lista, `.journey:has(…:hover…) .journey__stage:nth-child(2)`, tem especificidade (0,5,0).
   - Ela vencia a do card sob o ponteiro, que tem (0,3,0), também quando o ponteiro estava no próprio 02. Resultado medido com ponteiro real: `--hl` = `0,0,0,0` (os quatro apagados).
   - Entrou um `:not(:hover, :focus-within)` nessa regra.
   - Medido depois, com ponteiro real em 1440:
     - em repouso, `0,1,0,0`;
     - sobre cada card, `1,0,0,0` · `0,1,0,0` · `0,0,1,0` · `0,0,0,1`;
     - fora dos cards, volta a `0,1,0,0`.
3. **`max-width` do título da 04:** ficou **8.4em**, sem ajuste. O título fica em 2 linhas ("O que entregamos / é uma página.") em 1024, 1280, 1366, 1440 e 1920px, com a Gloock real.
4. **Texto dos cards da 04:** 15,12px em 1440 (o `clamp(0.9375rem, 1.05vw, 1rem)` da §7.3). Entrelinha de 1,5, Marfim a 74%.
5. **Altura do rodapé:** sem ajuste. A 390×844 dá 844px, igual à tela.
6. **Montagem do CSS da §7.3:** no texto extraído do PDF, a §7.4 caiu no meio do bloco CSS (quebra de página). O bloco foi colado na ordem do código, inteiro e dentro da mesma `@media (min-width: 1024px)`.

**Medidas da §7.4** (largura × altura dos 4 cards; todos os nomes em 1 linha):

| Largura | Cards (cada) | Título |
|---|---|---|
| 1024 | 219 × 477 | 2 linhas · 45,6px |
| 1280 | 280 × 433 | 2 linhas · 57,0px |
| 1366 | 283 × 443 | 2 linhas · 60,8px |
| 1440 | 282 × 452 | 2 linhas |
| 1920 | 282 × 492 | 2 linhas · 64px |

O padding não foi mexido. A 1024px o card tem 219px de largura (a §7.4 estimava ~223px), e "Diagnóstico" e "Construção" cabem em uma linha.

## (4) Exceções E14–E18 e tokens novos

| # | Regra quebrada | O que muda | Por que existe | Função que resolve | Vale só para |
|---|---|---|---|---|---|
| E14 | Escala de texto dos cards = a da 03 (`--t-card-*`, rodada 4 §3) | Parágrafo da 04 em 15–16px, peso regular, Marfim a 74% | Quatro colunas não comportam a escala da 03; referência da Experiência | Hierarquia: número, nome em negrito, texto apagado | Seção 04, ≥ 1024px |
| E15 | UI.08: Primary CTA sem brilho nem degradê permanente | O ShinyButton mantém a borda cônica viva, os pontos e o brilho; só as cores seguem a UI.08 | A Experiência confirmou o efeito (já aceito na Hero) | CTA final com efeito, legível no bege | Só `#contato .shiny-cta` |
| E16 | Cortes retos entre seções (rodada 4, E11: véu só na 04 → 05) | Véu duplo na 06 → 07 e véu curto no fim da 07 | Pedido da Experiência: "não ficar esse negócio feio"; rodapé "conectado" | Dobra de contraste claro → escuro e escuro → escuro | 06 → 07 e 07 → rodapé |
| E17 | Rodapé com a altura do conteúdo | `min-height: 100svh` no celular, sem mudar o desenho | "Uma seção tem que ocupar o viewport do telefone" | Rodapé = seção da tela, cortina com borda limpa | Rodapé, ≤ 767px |
| E18 | Linguagem visual dos cards da 04 = a dos cards da 03 (luz por rolagem, canto de 28px) | Contorno fino, número grande, ✦, destaque por ponteiro, canto de 24px | Pedido da Experiência (referência) | Leitura em quatro colunas | Seção 04, ≥ 1024px |

**Registro da rodada 4 atualizado:**
- **E10** (efeito de entrada) fica **revogada**: o efeito deixou de existir.
- **E11** passa a valer também para a 06 → 07 e a 07 → rodapé (E16).
- **C15** passa a: "a 03 → 04, a 04 → 05, a 06 → 07 e a 07 → rodapé têm véu; a 05 → 06 é emenda contínua (campo espelhado); as demais divisas são cortes retos".

**Tokens e variáveis:**
- **Novos:** `--veil-stops`, `--veil-short`, `--veil-long` e `--veil-h` (interna), na `.veil`; `--hl` (registrada com `@property`); `--journey-pad`, `--journey-line`, `--journey-fill`, `--journey-hl-1`, `--journey-hl-2`; `--shiny-bg` (agora registrada com `@property`, para a transição de 180ms).
- **Sobrescritos só na 06:** `--shiny-bg-subtle`, `--shiny-fg` e `--shiny-highlight*`.
- **Saem:** `--s45-veil-stops`, `--s45-veil-dark`, `--s45-veil-light` e `--handoff-h`.

Nenhuma exceção entrou nos tokens-base nem nos componentes-base.

## (5) Registro de conformidade

| # | Item | Prova | Resultado | Evidência |
|---|---|---|---|---|
| R1 | Deploy da rodada no ar; `js/handoff.js` = 404 | `A.sem-js`; curl | PASS | curl = 404; `A.sem-js` PASS em produção nas cinco larguras. |
| R2 | Rodada 4 presente (pré-requisito) | §2.1 | PASS | Produção em `e80bac2`; `handoff.js` = 200 antes da rodada (`antes-*`: `A.sem-js` FAIL, como esperado). |
| R3 | Efeito removido (sem invólucro, sem transform/sticky, 04 e 05 irmãs) | `A.sem-*`, `A.irmaos` | PASS | `s03-seam → #metodo → #para-quem-e → #contato → #faq` irmãos em `main`; sem transform/sticky em 5 posições de rolagem. |
| R4 | Dobra 04 → 05 e 03 → 04 intactas | `A.dobra-*`; `3.*` do r3c; capturas | PASS | Véus de 72 + 153px (390) / 72 + 217px (1440). Título da 05 com 192/256px de padding-top. r3c `3.irmao` volta a PASS. `3.fiapo` (390): FAIL já existente em produção, ver (6). |
| R5 | Emenda 06 → 07 | `B.*`; capturas | PASS | Véus de 152/73/72px (390) e 216/73/72px (1440). Fim da 06 = topo da 07 (7906,3 / 9406,0). Respiro de 24px. `isolation: isolate` nas quatro. |
| R6 | FAQ → rodapé | `B.faq-rodape`, `C.*`; capturas | PASS | Fim da 07 = começo do rodapé (8736,5). Rodapé de 844px em 844 (svh). Cortina ligada (`--curtain-h` 844px). Wordmark em 100%. Marca (118–244) → Legal (613–719) → wordmark (747–844). |
| R7 | 05 e emenda 05 → 06 sem alteração | `B.campos`; r4 `E.espelho`; captura | PASS | Campos: 04 escuro, 05 claro, 06 claro, 07 escuro, rodapé escuro. r4 `E.espelho` PASS. |
| R8 | Botão da 06 | `D.*` | PASS (390 e 1440) | Fundo 34,32,29 · texto 243,237,227 · 14,0:1. Hover/foco → `--color-cta-primary-light-hover`. Anel de 2px Grafite. Animação `shiny-angle`, raio 360px. Hero continua 18,14,11. |
| R9 | Cards da 04 no desktop | `E.*`; capturas | PASS (1024, 1366, 1440) | 4 × 282×452 com vãos de 24px (1440). Números de 48px. ✦ por máscara. `--hl` 0,1,0,0. Título em 2 linhas. Contraste de 9,1:1 em repouso, 6,1:1 no miolo do destaque e 18,0:1 no nome. Texto de 15,12px. |
| R10 | Linha do tempo no celular e no tablet | `E.celular-tablet`, `E.lampada` | PASS | 390: 1 coluna, ponto de 15px, lâmpada ligada. 768: 2 colunas, ponto de 15px. |
| R11 | Sem rolagem horizontal; ≤ 6 contextos | `F.*` | PASS | scrollWidth 375 (390) / 1425 (1440); 6 canvases. |
| R12 | Copy intacta | `G.copy-intacta` | PASS | Cinco regiões iguais à linha de base, em todas as larguras. |
| R13 | Regressões r3c/r4 conforme a §10.2 | `vz-check-r3c.js`, `vz-check-r4.js` | PASS fora dos itens previstos, mais um artefato do r3c | Ver (6). |
| R14 | Movimento reduzido / sem WebGL / sem JS | §8, §10.6–7 | PASS (sem JS: não testado) | Ver a lista abaixo. |
| R15 | iPhone real | relato | **Não feito** | Sem aparelho nesta sessão. |

**R14 em detalhe:**
- **Movimento reduzido a 390:** 34 PASS; cortina desligada; rodapé com 844px.
  - Único FAIL: `D.efeito` ("animação none"). Vem da regra que já existia em `css/base.css:403`, que congela o giro de todo `.shiny-cta` com movimento reduzido, inclusive o da Hero. É o comportamento pedido; não é regressão.
- **Sem WebGL a 390:** 35 PASS; `B.isolamento` PASS (isolate nas quatro); véus presentes; cortina ligada.
  - O WARN `B.campos` é esperado: sem WebGL não existe `__vzLightField`.
- **1440×1500:** 38 PASS, 0 FAIL.

## (6) `vz-check-r5`, `vz-check-r4` e `vz-check-r3c`: antes e depois

"Antes" é a produção na rodada 4 (`e80bac2`); "depois" é o local em `5feca01`.

**`vz-check-r5`:**

| Largura | Antes | Depois |
|---|---|---|
| 390 × 844 | 15 PASS · 11 FAIL · 1 WARN | **36 PASS** · 0 FAIL · 1 WARN |
| 768 × 1024 | 10 PASS · 10 FAIL · 1 WARN · 1 NA | **30 PASS** · 0 FAIL · 1 WARN · 1 NA |
| 1440 × 900 | 12 PASS · 14 FAIL · 3 WARN | **38 PASS** · 0 FAIL · 1 WARN |
| 1366 × 650 | não medido antes | **38 PASS** · 0 FAIL · 1 WARN |
| 1024 × 768 | não medido antes | **38 PASS** · 0 FAIL · 1 WARN |

- O WARN que sobra é sempre o `Z.manual`, conferido nas capturas de (7).
- O NA a 768 é o `E.lampada` ("só no celular").
- Os FAIL de antes eram exatamente o que a rodada muda: `A.*` (efeito e véu), `B.veus`, `C.*` (rodapé de 446px), `D.*` (botão 18,14,11) e `E.*` (cards em 2×2 a 1440).

**`vz-check-r4`** (antes: 35/34/36 PASS, 0 FAIL):

| Largura | Depois | FAIL / WARN | Previsto na §10.2? |
|---|---|---|---|
| 390 | 25 PASS · 4 FAIL · 1 WARN | `0.deploy`, `C.veus`, `D.efeito`, `E.botao-igual-hero` | Sim (os quatro) |
| 768 | 24 PASS · 4 FAIL · 2 WARN | os mesmos 4 + `A.hierarquia` WARN | Sim; `A.hierarquia` a 768 já existia na rodada 4 (nome 27,6px, parágrafo 18px, headline 40px) |
| 1440 | 24 PASS · 5 FAIL · 2 WARN | os mesmos 4 + `A.escala` FAIL e `A.cor` WARN | Sim (E14 e E18: parágrafo de 15,12px, abaixo do nome) |

- O total de PASS cai porque os blocos C e D do r4 param no primeiro FAIL (as classes e os atributos deixaram de existir).
- `A.hierarquia` e `A.nome-fonte` dão PASS a 1440: o nome de 20–24px continua maior que o parágrafo.

**`vz-check-r3c`** (antes = local da rodada 4, `f-3c-*`):

| Largura | Antes | Depois | Mudou |
|---|---|---|---|
| 390 | 37 PASS · 7 FAIL · 4 WARN | 39 PASS · 7 FAIL · 1 WARN | ver lista abaixo |
| 768 | 34 PASS · 7 FAIL · 1 WARN · 1 NA | 34 PASS · 6 FAIL · 1 WARN · 1 NA | `3.irmao` e `7.contiguas` → PASS; `4.igual-hero` → FAIL (previsto) |
| 1440 | 34 PASS · 7 FAIL · 1 WARN · 2 NA | 33 PASS · 7 FAIL · 1 WARN · 2 NA | `3.irmao` e `7.contiguas` → PASS; `4.igual-hero` → FAIL (previsto); `2.contraste` → FAIL (artefato) |

**O que mudou a 390:**
- `3.irmao` e `7.contiguas` → PASS.
- Os WARN `3.respiro`, `3.headline-x` e `3.sub-eixo` sumiram: eram artefatos do `offsetTop` dentro do invólucro.
- `4.igual-hero` → FAIL (previsto).
- `3.fiapo` → FAIL. Ele já falhava em produção depois da rodada 4 (`prod-3c-390`: 46 PASS e 1 FAIL, que era o `3.fiapo`), e falha igual depois do commit 1. Não vem desta rodada: a 03 não foi tocada.

**FAIL que continuam iguais desde a rodada 4** (a r3c compara com a 3C):
- `1.#contato`, `1.#faq` e `1b.claro=03`: a 06 virou clara e a 07 escura na rodada 4.
- `5.estrutura`: a 07 deixou de ser bege.
- `9.copy`: a copy da 04/05 mudou na rodada 4. A linha de base certa é a da §2.6, e por ela `G.copy-intacta` dá PASS.

**`2.contraste` a 1440 é um artefato do checker:**
- Os dois textos acusados são os parágrafos dos cards 03 e 04 (4,30 e 4,03:1).
- O r3c só ignora textos sobre "cards próprios" quando um ancestral tem `background-color`/`background-image`. Agora o `.journey__stage` é `transparent` e a placa do card (Carvão a 62% + gradiente) mora no `::before`. Por isso o r3c mede esses parágrafos direto sobre o canvas, sem a placa.
- O r5 mede com a placa: `E.contraste` dá 9,1:1 em repouso e 6,1:1 no miolo do destaque.
- A 390 e 768 o `2.contraste` dá PASS.

**Rolagem longa** (§10.8: topo → fim → topo, duas vezes, em passos de 40px):

| | Quadros | p50 | p95 | p99 | Máx. | > 50 ms | Contextos perdidos |
|---|---|---|---|---|---|---|---|
| Local 390×844 | 656 | 16,7 | 16,9 | 33,4 | 83,4 | 1 | 0 |
| Local 1440×900 | 752 | 16,7 | 33,3 | 50,1 | 83,4 | 10 | 0 |
| Produção (rodada 4) 1440×900 | 758 | 16,7 | 33,3 | 50,1 | 83,5 | 8 | 0 |

Os quadros acima de 50 ms caem nos mesmos lugares antes e depois (FAQ, rodapé e Hero), nenhum na 04. Uma primeira medida local deu 16–20 quadros, com máximo de 233–284 ms. Ela foi feita logo depois de recarregar, e as repetições ficaram nos números da tabela.

## (7) Capturas

Ficaram no scratchpad da sessão (não versionadas):
- **04 em 1440:** `c5-04-1440.png` (repouso, destaque no 02), `c5-04-1440-hover1.png` (ponteiro no 01, antes da correção de (3)), `c5-04-1440-hover3.png` (ponteiro no 03) e `antes-04-1440.png`.
- **Emenda 06 → 07:** `antes-0607-390.png` / `depois-0607-390.png`, `antes-0607-1440.png` e `c2-0607-1440.png`.
- **Botão da 06 (390):** `antes-cta-390.png` / `depois-cta-390.png`.
- **Rodapé no fim da página (390):** `antes-fim-390.png` / `depois-fim-390.png` e `c3-rodape-390.png`.

O que se vê nelas:
- **06 → 07:** o bege afunda no Carvão e a 07 nasce dele, sem corte reto.
- **06:** o botão sai em Grafite com texto Marfim sobre o bege.
- **Rodapé:** marca no alto, "Legal" acima da wordmark e wordmark na base, em uma tela inteira.
- **04 em 1440:** título em 2 linhas à esquerda, 01–04, o 02 com gradiente Bronze → Café → Carvão e o ✦ no canto.

Não foram feitas: as capturas em 1024 e 1920px, a do ponteiro sobre o 02 e o 04, e a cortina em 3 posições. Esses estados foram medidos por script (ver (3)).

## (8) O que ficou

- **iPhone real (R15):** não feito. O que conferir: rodapé de tela com a barra de endereço encolhendo, cortina, véus 06 → 07 e a 04 em paisagem (≥ 1024px).
- **Teste sem JS:** não feito. Pelo código: os véus são HTML + CSS e o rodapé de tela é CSS; sem JS, só a cortina não liga.
- **Contraste do miolo do destaque com conta-gotas** (§7.4): não feito à mão. O script dá 6,1:1.
- **Capturas que faltam:** ver o fim de (7).
- **`3.fiapo` a 390:** anterior a esta rodada; a 03 não foi tocada.
- **`A.hierarquia` a 768:** o mesmo WARN da rodada 4.

## (9) Dúvidas da §12

São da Experiência. Abaixo, o que ficou aplicado em cada uma e como mudar.

1. **Rodapé do tamanho da tela só no celular (≤ 767px).**
   - Aplicado: só no celular.
   - Para os tablets: trocar `767px` por `1023px` na media do bloco 08 de `css/sections.css` e no `matchMedia` de `js/beam-footer.js`.
2. **Card em destaque da 04.**
   - Aplicado: nasce no 02 e acompanha o ponteiro, com gradiente Bronze/Café/Carvão.
   - Para um card fixo: apagar as duas regras de `:hover` (a do `:has` e a do card sob o ponteiro).
3. **Véu no fim da FAQ.**
   - Aplicado: mantido.
   - Para tirar: apagar o `<span class="veil veil--short veil--end">` da `#faq`.
4. **Fonte da headline da 04.** Mantida a Gloock; só o layout segue a referência. A sans da referência seria decisão de Marca.
5. **Texto dos cards da 04.**
   - Aplicado: 15–16px (E14).
   - Para 17–18px, os cards ficam mais altos (hoje 433–492px de altura).
6. **Headline e diagramação da 06.** Não tocadas, como pedido. Ficam para a próxima rodada.
7. **Estado pressionado do botão.** Continua `translate: 0 1px`, igual ao da Hero. Alinhar à UI.08 (escala ≈ 0,985) vale para os dois botões.
8. **"Legal" no rodapé do celular.**
   - Aplicado: logo acima da wordmark, com a marca no alto.
   - Para juntar o "Legal" à marca no topo, o caminho provável é trocar `align-content: space-between` por `start` no `.site-footer__grid`. Isso não foi testado: precisa de captura antes de aplicar.
