# Rodada 4 — Seções 04 a 07: relatório

Publicado em produção em 02/11/2026, 04:50 UTC: fast-forward da `main` (`31e4ce4` → `9903e7c`), feito depois da confirmação do usuário.

Feita na branch `feat/rodada4`, a partir da `main` em `31e4ce4` (3C em produção). O primeiro push na `main` foi bloqueado pelo auto mode ("Production Deploy"). Por isso os commits foram publicados de uma vez, e não um a um como pede a §11.

**Prova de deploy:** `curl -sI https://vipzuesite.vercel.app/js/handoff.js` → `HTTP/1.1 200 OK`.

**`vz-check-r4` em produção** (aba em primeiro plano, mesmo ambiente do local):

| Largura | PASS | FAIL | WARN |
|---|---|---|---|
| 390 × 844 | 35 | 0 | 1 |
| 768 × 1024 | 34 | 0 | 2 |
| 1440 × 900 | 36 | 0 | 1 |
| 1366 × 650 | 36 | 0 | 1 |

`0.deploy` dá PASS. O `vz-check-r3c` em produção a 1366 × 650 dá 34 PASS e 7 FAIL, as mesmas do local, todas previstas (ver (6)). Os números de (5) e (6) abaixo são do local, e são idênticos aos de produção.

## (1) Resumo em 5 linhas

1. **04:** o nome de cada etapa passou para Switzer 600 (24px no celular → 30px no desktop), o subtítulo saiu (E-a) e o parágrafo usa a escala dos cards da 03 pelos tokens `--t-card-*`.
2. **05:** copy nova (E-b) em três cards com ilustração SVG sobre base marfim. No desktop é um mosaico 2×2 com degrau de 56px; abaixo de 1024px, uma coluna.
3. **Dobra 04 → 05:** véu duplo pelo Carvão profundo (72px na 04 e 153–217px na 05), com a mesma rampa cúbica da 03 → 04.
4. **Cores:** a 06 ficou bege, com o campo espelhado (`data-field-flip`); a 07 ficou escura. Fica 04 escura · 05 clara · 06 clara · 07 escura · rodapé escuro.
5. **Efeito de entrada da 05 sobre a 04** (`js/handoff.js`, JS puro). Resultado do `vz-check-r4`:
   - 390, 768, 1440 e 1366×650: **35/34/36/36 PASS, 0 FAIL**.
   - WARN: o `Z.manual` em todas as larguras e o `A.hierarquia` em 768.
   - Em 1440×1500, um FAIL esperado (§6.6), explicado em (6).

## (2) Arquivos alterados

| Arquivo | O que mudou |
|---|---|
| `index.html` | (ver lista abaixo) |
| `css/sections.css` | (ver lista abaixo) |
| `js/handoff.js` (novo) | O efeito da §6.4, mais o arredondamento do progresso (ver (3)). |
| `js/light-field.js` | `FIELD_SECTIONS`: 06 `light` e 07 `dark`; o patch `data-covered` no `drawAll`. |
| `docs/rodada4-relatorio.md`, `docs/ANDAMENTO.md` | Este relatório e a entrada do dia. |

**`index.html`:**
- 04: saem os 4 `<p class="journey__accent">`; a seção ganha `data-handoff-out` e o `span.seam45--dark`.
- 05: inteira nova (§4.3).
- Invólucro `div.handoff[data-handoff]` em volta da 04 e da 05.
- 06: `surface-beige` + `data-field-flip`.
- 07: `surface-dark`.
- Tag do `js/handoff.js` logo depois do `light-field.js`.

**`css/sections.css`:**
- Tokens `--t-card-*`; nome e parágrafo da 04 (`--step-name-*`); saem as regras do `.journey__accent`.
- Sai o legado `.audience*` e `.situation*`, inclusive na media de 1023px; entra o bloco `.pq` (§4.4).
- Dobra `.handoff` / `.seam45` e o CSS do efeito (§5.2 + §6.3).
- `.s03-seam + .handoff > #metodo` nas duas regras de reserva da águia.
- Campo espelhado.
- Sai o fundo escuro fixo do `.closing`.
- FAQ com as variáveis `--faq-*`.

Commits, na ordem da §11, mais uma correção:
1. `6aba76c` feat(s4)
2. `030fa09` feat(s5)
3. `a38427b` feat(dobra)
4. `920d1d1` feat(cores)
5. `b6f3118` feat(efeito)
6. `3032f0b` fix(efeito)
7. docs

## (3) Ajustes em relação ao prompt, e por quê

**Tokens `--t-card-*`:** valores tirados do `.s03__text`, que já existia.

| Largura | Tamanho | Linha | Peso | Tracking |
|---|---|---|---|---|
| Abaixo de 1024px | 1,125rem (18px) | 1,5 (27px) | 500 (`--font-weight-medium`) | −0,005em |
| A partir de 1024px | `clamp(1.375rem, 1.6vw, 1.5rem)` (23,04px a 1440) | 1,5 | 400 | −0,005em |

A 03 não foi apontada para os tokens (era opcional na §3.3); o `A.escala` acusa se as duas divergirem.

**Switzer:** o `css/fonts.css` carrega os pesos 400, 500 e 600. O 600 vem do arquivo, com `font-synthesis: none`.

**`--step-name-color` no desktop:**
- O prompt põe o nome com a mesma cor do parágrafo (`--text-2`).
- Mas nos cards do desktop (≥ 1024px) o parágrafo é marfim pleno (regra que já existia no `.journey__detail`).
- Por isso, acima de 1024px, o token passa a `var(--color-text-on-dark)`, para continuar igual ao parágrafo. O `A.cor` dá PASS nas quatro larguras.

**Ponto aceso:** alinhado, deslocamento de 0px em 390 e 1440. Não precisou de ajuste.

**Véu da 05 com 1px de sobreposição:** `top: -1px; height: calc(var(--s45-veil-light) + 1px)`.
- Problema: a 05 começa em posição fracionária (420,1px a 390), e na emenda aparecia uma linha clara de 1px (RGB 64,58,50 entre 19,17,15).
- A correção é a mesma da `.s03::before`. Depois dela, a emenda fica em 20 ± 1 em toda a largura.

**`js/handoff.js` com o progresso arredondado ao pixel:** `Math.round(...)` no `top`.
- Problema: a 768 a rolagem parava com a 05 a 0,34px do topo, e p = 0,9997. A 04 nunca era dada como coberta e o campo dela seguia desenhando (`D.progresso` FAIL).
- Com o arredondamento, PASS.

**`--color-ivory` não existe nos tokens:** os blocos `.pq` e `.faq` do prompt usam esse token com fallback, e o fallback `#f3ede3` vale. É o mesmo valor do marfim do projeto; não criei o token.

**A classe `.audience` ficou na 05:** como o HTML do prompt pede. Nenhuma regra de layout restou para ela (§4.6).

## (4) Exceções E10–E13 e tokens novos

| # | Regra quebrada | O que muda | Por que existe | Função que resolve | Vale só para |
|---|---|---|---|---|---|
| E10 | Movimento ligado à rolagem só com função clara | A 04 cola, encolhe e gira; a 05 sobe por cima (efeito do 21st.dev) | Pedido da Experiência | Entrada da 05 como "virada de página" | 04 → 05. Desligado com movimento reduzido; amplitude menor no celular |
| E11 | Cortes retos, sem véu, entre seções (3C §10) | Véu duplo na divisa 04 → 05 | Pedido da Experiência: o mesmo tratamento da 03 → 04 | Dobra de contraste escuro → claro | Só 04 → 05 |
| E12 | Alternância principal/secundário (3C §3.1) | 06 clara e 07 escura | CTA com a cor da 03/05; 07 e rodapé como um bloco | Continuidade bege 05 → 06 e escura 07 → rodapé | 06 e 07 |
| E13 | Um campo de luz por seção, na mesma orientação | Campo da 06 espelhado na vertical (`data-field-flip`) | Emenda 05 → 06 sem linha | `scaleY(-1)` no canvas | Só 06 |

Registro da 3C atualizado: o item "só a 03 tem véu" (C15) passa a "a 03 → 04 e a 04 → 05 têm véu; as demais divisas são cortes retos".

Tokens novos, todos locais (nenhum entra nos tokens-base):

| Grupo | Tokens |
|---|---|
| Escala de texto | `--t-card-size`, `--t-card-lh`, `--t-card-weight`, `--t-card-tracking` |
| Nome da etapa | `--step-name-color`, `--step-name-size` |
| Véu 04 → 05 | `--s45-veil-stops`, `--s45-veil-dark`, `--s45-veil-light` |
| 05 | `--pq-ink`, `--pq-gap`, `--pq-veil` |
| FAQ | `--faq-ink`, `--faq-rule`, `--faq-underline`, `--faq-focus` |
| Efeito | `--handoff-h` (definido pelo JS) |

## (5) Registro de conformidade

| # | Item | Prova | Resultado | Evidência |
|---|---|---|---|---|
| R1 | Deploy da rodada em produção | `0.deploy`; curl do `handoff.js` | PASS | curl do `handoff.js` = 200; `0.deploy` PASS em produção nas 4 larguras. |
| R2 | 3C presente | `0.rodada3c` | PASS | 4 larguras |
| R3 | 04: Switzer 600, sem subtítulo, escala da 03, cor | `A.*` | PASS (WARN a 768) | 390: nome 24px / parágrafo 18px (18/27/500). 1440: 30px / 23px (23,04/34,56/400). 768: `A.hierarquia` WARN, ver (6). |
| R4 | 05: copy, mosaico/coluna, contraste, entradas | `B.*` | PASS | Mosaico a 1440 (card 3 com degrau de 56px); coluna a 390 (x 24, largura 327px). Proporção 1,60. Contraste: título 7,1:1, subtítulo 6,2:1, cards 7,1:1. Entradas 5/5. |
| R5 | Dobra 04 → 05 e 03 → 04 intacta | `C.*`, `3.*` do 3C | PASS | Véus 72px + 153px (390) / 217px (1440). Ordem ok. Título 192/285px abaixo do topo da 05. 03 → 04 medida à mão: respiro 25px, headline em x=18, subheadline em x=24, igual à produção. |
| R6 | Efeito de entrada | `D.*` | PASS em 390/768/1440/1366×650 | p=.5 a 1440: `scale(0.91) rotate(-2deg)`. p=1: 05 no topo e 04 coberta. scrollWidth 1425 em 1440. Volta ok. |
| R7 | 06 bege, espelho, emenda 05 → 06 | `E.modos`, `E.classes`, `E.espelho`, `E.texto-06` + captura | PASS | Título 7,1:1, texto 6,2:1. Pixels na emenda a 390: variação ≤ 2 níveis de RGB. |
| R8 | 07 escura; rodapé intacto | `E.texto-07`, `E.modos`, `6.*` do 3C | PASS | Perguntas 8,1:1, respostas 6,7:1, linha clara. `6.*` do 3C: 10/10 PASS a 390. |
| R9 | Botão da 06 = Hero | `E.botao-igual-hero` | PASS | 18 propriedades iguais (3C `4.igual-hero`: 66). |
| R10 | Sem rolagem horizontal; ≤ 6 contextos | `F.*` | PASS | scrollWidth 375/1425; 6 canvases. |
| R11 | Copy: só E-a e E-b | `G.*` | PASS | 06, 07 e rodapé idênticos; 04 de 1318 → 1175 caracteres. |
| R12 | Regressões da 3C | `vz-check-r3c` | PASS fora dos itens previstos | Ver (6). |
| R13 | Movimento reduzido / sem WebGL / sem JS | §8, §10.6–7 | PASS (sem JS: não testado) | Reduzido a 390: 31 PASS, `D.efeito` PASS. Sem WebGL: 0 canvas; 05 e 06 em bege `rgb(184,170,150)`, 07 em escuro sólido; véus de 72 e 153px; console sem erros. |
| R14 | iPhone real | relato | **Não feito** | Sem aparelho nesta sessão. |

## (6) `vz-check-r4.js` e `vz-check-r3c.js`: antes e depois

**Ambiente:** DevTools com a aba em primeiro plano, recarregando depois de cada redimensionamento e com `window.__vzCopyBaseline` colado. Força-se `preserveDrawingBuffer` só no teste, como na 3C.

**`vz-check-r4`:**

| Largura | Antes (`main`) | Depois |
|---|---|---|
| 390 × 844 | 9 PASS · 16 FAIL · 4 WARN | **35 PASS** · 0 FAIL · 1 WARN |
| 768 × 1024 | 9 · 16 · 4 | **34 PASS** · 0 FAIL · 2 WARN |
| 1440 × 900 | 10 · 16 · 3 | **36 PASS** · 0 FAIL · 1 WARN |
| 1366 × 650 | 10 · 16 · 3 | **36 PASS** · 0 FAIL · 1 WARN |
| 1440 × 1500 | — | 35 PASS · 1 FAIL · 1 WARN |
| 390, movimento reduzido | — | 31 PASS · 1 NA · 1 WARN |

WARN e FAIL que restam:
- **`Z.manual`** (todas as larguras): conferência a olho. Foi feita; está em (7).
- **`A.hierarquia` a 768:**
  - O nome tem 27,6px, a headline 40px, e o teto do checker é 0,62 × 40 = 24,8px.
  - Os 27,6px vêm do `clamp(1.5rem, 1.2rem + 1.1vw, 1.875rem)` do próprio prompt, num tablet em que a headline ainda está no tamanho do celular.
  - Não mexi. Se quiser corrigir, o botão é o `--step-name-size`, por exemplo `clamp(1.5rem, 1.1rem + 1.1vw, 1.875rem)`, que dá 26px a 768.
- **`D.progresso` a 1440 × 1500 (FAIL esperado, §6.6):**
  - A 04 mede 1183px, menos que a janela, então ela cola no topo e não no pé; o checker exige o pé da 04 no pé da tela.
  - Conferido a olho em p = 0,5: a 05 cobre a 04 o tempo todo, sem vazamento e sem rolagem lateral (scrollWidth 1425).
- **`B.entradas` NA:** com movimento reduzido não há entradas, como o script explica.

**`vz-check-r3c`:**

| Largura | Antes (produção 3C) | Depois |
|---|---|---|
| 390 × 844 | 46 PASS · 1 FAIL | 37 PASS · 7 FAIL · 4 WARN |
| 768 × 1024 | 41 PASS | 34 PASS · 7 FAIL · 1 WARN · 1 NA |
| 1440 × 900 | 41 PASS | 34 PASS · 7 FAIL · 1 WARN · 2 NA |
| 1366 × 650 | 41 PASS | 34 PASS · 7 FAIL · 1 WARN · 2 NA |

O "antes" a 390 foi medido hoje em produção, nesta mesma janela. Os de 768/1440/1366 são os da 3C.

As 7 FAIL e o WARN `1b.escuro=escuro` são os itens que a §10.2 lista como mudando de propósito:
- `1.#contato` e `1b.escuro=escuro`: a 06 é clara.
- `1.#faq` e `1b.claro=03`: a 07 é escura.
- `7.contiguas`: há véu na 04 → 05.
- `3.irmao`: o irmão da águia agora é o `.handoff`.
- `9.copy`: mudaram só `metodo` (1318 → 1175) e `para-quem-e` (743 → 352).
- `5.estrutura` ("a seção ainda não é `.surface-beige`"): não está na lista da §10.2, mas é a mesma causa do `1.#faq`, porque a FAQ agora é `surface-dark`.

Fora isso, estes itens seguem PASS:
- FAQ: accordion, entradas, foco.
- Rodapé e cortina: `6.*`.
- Botão da 06: `4.*`.
- Contraste: `2.contraste`, 29 textos e 0 abaixo do limite a 390.

Duas notas sobre a 03 → 04 a 390:
- **WARN `3.respiro`, `3.headline-x` e `3.sub-eixo`: artefato do checker, não regressão.**
  - O script rola até a 04 pelo `offsetTop`, que agora é relativo ao `.handoff` (que tem `position: relative`). Por isso ele mede a 04 já colada e girada.
  - Medido à mão com a 04 no lugar certo: respiro 25px, headline em x=18, subheadline em x=24, idênticos à produção.
- **`3.fiapo` já falhava em produção** (46/1 a 390 × 844, medido hoje).
  - A águia mede 281px (limite de 36svh) e a linha 1 da headline passa 5px por cima da caixa da ponta da cauda (x 333 → 338).
  - É anterior a esta rodada e a 03/04 estão fora do escopo; não mexi. Ver (9).

## (7) Capturas

Feitas durante a validação, sem arquivo no repositório (mesmo padrão da 3C):
- **05 a 1440:** mosaico com título e subtítulo à esquerda, card 1 em cima à direita, card 2 embaixo à esquerda, card 3 embaixo à direita com degrau.
- **Dobra 04 → 05 a 390:** o campo da 04 afunda no carvão e o carvão se dissolve no bege, sem faixa. Antes da sobreposição de 1px havia a linha clara descrita em (3).
- **Emenda 05 → 06 a 390:** sem linha.
- **Cortina 07 → rodapé a 390, agora escuro sobre escuro:** a borda segue perceptível, porque o campo do rodapé é mais claro à direita; ela lê como borda de camada, não como defeito. Não ajustei a borda (§7.5).
- **Efeito a 1440:** p = .25 (`scale(0.955) rotate(-1deg)`), .5, .75 (`scale(0.865) rotate(-3deg)`).
- **Efeito a 390:** p = .5 (`scale(0.965) rotate(-0.75deg)`).
- **Efeito a 1440 × 1500:** p = .5.

Não feitos: a sequência completa de 5 quadros nas duas larguras e o vídeo ou GIF do efeito. A ferramenta de captura desta sessão não grava vídeo.

## (8) Frases removidas, palavra por palavra

**04, subtítulos das etapas (E-a):**
1. "Primeiro, entendemos o seu negócio."
2. "Depois, definimos o caminho."
3. "Transformamos estratégia em experiência digital."
4. "Sua estratégia, agora no ar."

**05, conteúdo antigo (E-b):**
- Lead: "Para empresas que:"
- Os seis itens:

| Chave | Texto |
|---|---|
| Site desatualizado | Já possuem um site, mas ele está desatualizado ou não representa mais o nível atual do negócio. |
| Site sem função comercial | Possuem um site que existe, mas não cumpre uma função comercial clara. |
| Sem presença estruturada | Ainda não possuem uma presença digital estruturada. |
| Dúvidas repetidas | Gastam tempo respondendo repetidamente informações que poderiam estar organizadas e acessíveis ao potencial cliente. |
| Apresentação profissional | Querem apresentar seus serviços, diferenciais e provas de maneira mais profissional. |
| Atrito até o contato | Precisam diminuir o atrito entre o momento em que alguém conhece a empresa e o momento em que decide entrar em contato. |

O título "Para quem são nossas Landing Pages Estratégicas?" continua.

**Valores antigos da FAQ clara (P6, para reverter o pedido 6):**
- texto `--color-text-on-light`;
- linha `--color-border-on-light`;
- sublinhado `rgb(34 32 29 / 0.5)`;
- foco `--color-brown`;
- resposta `--color-text-on-light`.

## (9) O que ficou

- **iPhone real (R14):** dobra sem faixa, efeito sem tranco com a barra de endereço encolhendo, sem `webglcontextlost` em duas rolagens inteiras.
- **Teste sem JS:** não foi feito. Pelo código: o efeito e os estados ficam sob `.is-handoff` e `html.js-reveal`, que só existem com JS.
- **Rolagem longa de ponta a ponta duas vezes** (§10.8): não feita como sessão separada. As rodadas do checker rolam a página inteira várias vezes e o console ficou sem erros.
- **Skills de auditoria** (§10.11): não rodadas nesta rodada.
- **`A.hierarquia` a 768:** decisão de tamanho, ver (6).
- **`3.fiapo` a 390 × 844:** anterior a esta rodada, ver (6).
- **A 04 durante o efeito no desktop:** só a faixa do canvas (100lvh) tem brilho; o resto da 04 é carvão, igual ao invólucro. Por isso a "folha" que gira parece mais curta que a seção, e o subtítulo da 04 pode aparecer sobre o carvão em p ≈ .75. Para a Experiência ver.

## (10) Dúvidas da §12, respondidas

1. **"FAQ" era o rodapé?** Apliquei: 07 escura e rodapé intacto. A reversão:
   - em `FIELD_SECTIONS`, `#faq` volta para `light`;
   - a classe volta para `surface-beige`;
   - as `--faq-*` voltam aos valores de (8).
2. **"Não mais claro que o parágrafo":** mesma cor do parágrafo.
   - Abaixo de 1024px é o `--text-2`; acima, marfim pleno, porque o parágrafo do card do desktop também é.
   - Mais forte: `--step-name-color: var(--color-text-on-dark)` em todas as larguras. Mais discreto: um tom abaixo do parágrafo.
3. **Fonte de acento:** usei Switzer 600, como a Experiência pediu. Clash Display exigiria `@font-face` e arquivo novos, que hoje não existem.
4. **Concordância da 05:** mantive a copy aprovada. O subtítulo termina em "cujo negócio:", e os itens misturam "O site está…", "Possui…" (singular) e "Querem…" (plural). Vale uma passada da Estratégia.
5. **"Card por card" no celular:** uma coluna com entrada individual de cada card. Um card por tela, com trava ou pino, seria outra rodada.
6. **Divisa 06 → 07:** continua em corte reto, sem véu.
7. **Ilustrações da 05:** são SVG desenhados na paleta e aguardam a Marca. A alternativa são capturas reais de "site antigo × site estratégico".
8. **Efeito no celular:** 0,93 e 1,5°. Para desligar, `mob: null` em `FX` (`js/handoff.js`).
