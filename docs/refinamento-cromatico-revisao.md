# Revisão do refinamento cromático (commit `771d09c`)

Revisão feita em 06/11/2026 sobre o commit `771d09c` ("refinamento cromático — Páprica Profunda, cards Mocha, CTA Páprica e corte seco").
O commit está na `main` local e **não foi enviado**. A produção continua em `c5fa47a`.
Nada foi alterado no código durante a revisão.

**Como foi medido**
- Contraste por pixel: a tinta do texto é escondida, a tela é capturada e calcula-se a luminância WCAG no pior pixel sob cada linha de texto.
- A comparação é com a produção (`c5fa47a`), medida na mesma posição e largura sempre que houve dúvida.

## Veredito

**Não está pronto para publicar.** Há uma regressão de contraste no celular, causada pela Páprica mais forte no campo escuro:

| Onde (390 px) | Texto | `771d09c` | Produção | Mínimo |
|---|---|---|---|---|
| Método, detalhe do 1º estágio | Marfim 95% | **4,20** | 4,90 | 4,5 |
| Método, subtítulo | Marfim 100% | **4,42** | 5,21 | 4,5 |
| FAQ, perguntas 2 e 3 | Marfim 100% | **4,42 / 4,45** | 4,81 (rodada anterior) | 4,5 |

**Causa.** O pico de luz atrás do texto passou de #8B553A para #A05B3C (luminância 0,123 → 0,153).

**Por que o alfa não resolve.** Como o FAQ já está em Marfim a 100%, aumentar a opacidade do texto não resolve. O limite para Marfim puro passar 4,5:1 é luminância de fundo ≤ 0,149.

Todo o resto passou, com as ressalvas abaixo.

## Medições

### Hero, "presença digital" (Páprica, texto grande, mínimo 3:1)

| Largura | `771d09c` | Produção (rodada anterior) |
|---|---|---|
| 360 / 390 / 430 | 3,45 | 3,45 |
| 768 | 3,32 | 3,34 |
| 1024 | 3,85 | 3,85 |
| 1366 | 3,93 | 3,93 |
| 1440 | 3,76 | 3,80 |
| 1920 | 3,00–3,26; um quadro em **2,996** | 3,24–3,32 |

**Em 1920**, foram 33 quadros locais em três séries:
- duas séries ficaram estáveis em 3,10–3,26;
- uma série teve dois mergulhos, a cerca de 18 s de distância: 3,01 e 2,996.

A produção, medida do mesmo jeito em 8 quadros seguidos, ficou em 3,26–3,27. Não dá para afirmar que a produção nunca mergulha. Mas no `771d09c` o mínimo observado está no limite e uma vez abaixo dele.

**Restante da Hero:**
- Título: ≥ 8,23 (produção: 8,9).
- Menu: ≥ 4,74 (produção: 4,89). Passa.

### Varredura de texto

| Seção | 1440 | 390 |
|---|---|---|
| 03 | 0 falhas (pior 8,00, com o título formado) | 0 falhas (5,25) |
| Método | 0 falhas (5,10) | **5 falhas (4,20–4,47)** |
| Para quem é (cards Mocha) | 0 falhas (Marfim sobre Mocha 7,62) | 0 falhas (7,62) |
| CTA final (06) | 0 falhas (botão 4,54; nota 5,38) | 0 falhas (botão 4,54) |
| FAQ | 0 falhas (6,28) | **2 falhas (4,42 / 4,45)** |
| Rodapé | 0 falhas (4,84) | 0 falhas (5,73) |

Em 1440, a primeira passada na 03 acusou 7 palavras do título a 0,34 de opacidade. Era a animação de entrada do título em andamento (o código não mudou), não uma falha de cor.

### Botão Páprica (`.shiny-cta`)

Rótulo Grafite sobre a Páprica: **4,54:1** em todos os 6 quadros medidos (3 em repouso e 3 aceso, com foco visível, que usa as mesmas regras do hover).

Os brilhos que passam pelo botão são mais claros que a Páprica, então só aumentam o contraste. A folga é de 0,04. A Páprica Profunda (#9F3930) entra só no anel interno de 1px, não atrás do texto.

### `vz-check-r6`

| Largura | `771d09c` (PASS/WARN/FAIL/NA) | Produção |
|---|---|---|
| 1440 | 45/3/8 | 48/3/5 |
| 390 | 36/2/4/13 | 37/2/2/14 |

As FAIL novas são `C.filete-05-06`, `C.filetes`, `C.faq-rodape` e `C.mobile-intacto`. Todas cobram os filetes e véus da rodada 6, que o §8 do documento manda retirar. São esperadas; o checker ficou desatualizado em relação à decisão nova.

## Conferência do documento, item por item

| Decisão | Situação |
|---|---|
| §2 Areia sai, Páprica Profunda entra | Feito nos tokens. **Mas a #9F3930 quase não aparece:** o único uso visível é o anel de 1px do botão. Nas seções Marfim entra a mistura clara #C98468, que se lê como rosado claro, não como Páprica Profunda. |
| §3 Páprica mais reconhecível no escuro | Feito e visível (comparar `v2-390-metodo.png` com `prod-390-metodo.png`). **Causa a regressão de contraste acima.** |
| §4 Linguagem luminosa no Marfim | Feito na 03 (desktop), na 05 e na 06: os fundos medidos ficam entre #E6D4C7 e #F4EEE4. A mensagem do commit diz que a luz clara roda só na 05 e na 06, mas a 03 também recebe. |
| §5 Cards da 05 em Mocha | Feito. Texto Marfim a 7,62:1; ilustrações recoloridas; acentos em Páprica. Páprica sobre Mocha dá 2,49:1, o que serve como enfeite, mas não pode ser o único sinal de informação. |
| §6 CTA em Páprica | Feito no botão da Hero e no da 06 (`.shiny-cta`), com a animação preservada. O `.btn--primary-dark` do cabeçalho e do menu continua escuro; o commit diz "por decisão sua". O §6 fala em "botões principais", então confirme se foi decisão sua. |
| §7 Painel da 06 em Mocha | Feito (Mocha sólido). |
| §8 Corte seco | Feito: 04 → 05 e 06 → 07 sem faixa, conferido nas capturas de 1440. Os véus da 03 foram mantidos, por fazerem parte da narrativa. |
| Detalhe | Em `js/light-field.js`, o comentário diz que `deep` foi para 0.26, mas o valor é 0.32. |

## O que eu proporia para corrigir (não aplicado)

**1. Regressão do Método e do FAQ no celular.** Manter a Páprica mais presente mudando a **saturação**, não a claridade:
- No OKLab, as cores do topo da rampa escura ficam com mais croma e a mesma luminosidade (L), ou um pouco menor.
- Meta: luminância ≤ 0,145 onde há texto. Exemplo de ordem de grandeza: #A8523A (L 0,147, mais vermelho que o #A05B3C atual).
- Isso troca valores de derivados, não posições nem a geometria da luz.
- Alternativa mais simples, mas que perde parte do ganho visual: voltar as posições da rampa (`STOPS`) às da produção.

**2. "Presença digital" em 1920.** Depois do item 1, medir de novo. Se ainda mergulhar perto de 3,0, aprofundar um pouco o apoio da headline no desktop, como foi feito na migração anterior.

**3. Páprica Profunda nas seções Marfim.** Se a intenção do §4 é ver o #9F3930, e não um rosado, o pigmento #C98468 está claro demais. Mas um pigmento mais escuro reduz o contraste do texto Grafite nessas seções: hoje o pior caso é 8,0, então há folga. Essa é uma decisão visual sua, a ser tomada com capturas lado a lado.

**4. Botão do cabeçalho:** confirmar se fica escuro ou se também vai para a Páprica.

## Não verificado nesta revisão

- Varredura de texto em 360, 430, 768, 1024, 1366 e 1920 (só a Hero foi medida nessas larguras).
- Modo sem WebGL e movimento reduzido.
- Safari, iPhone, Firefox e aparelhos reais.

## Capturas

Ficam em `docs/qa/refinamento-cromatico/` (pasta local, fora do git):
- `v2-1440-pq.png`, `v2-1440-contato.png`, `v2-1440-emenda-04-05.png`, `v2-1440-emenda-06-07.png`;
- `v2-390-metodo.png` e `prod-390-metodo.png` (mesma posição, `771d09c` e produção).

---

## Correção aplicada (06/11/2026, depois da revisão)

O usuário aprovou a correção 1 ("saturar a Páprica sem clarear"). Ela foi aplicada junto com o apoio da headline (correção 2).

| Mudança | Antes → depois | Onde |
|---|---|---|
| Luz intermediária da rampa escura (cor que fica atrás do texto quando o campo vale ~0,72) | #A55A3A → **#9F4B2D** | `js/light-field.js` (`PALETTE`), `--color-light-mid` em `tokens.css`, brilho atrás da águia em `hero.css` |
| Apoio da headline no desktop, parada de 70% | Grafite .66 → **.72** | `css/hero.css` |
| Comentário de `deep` | dizia 0.26 → 0.32 (o valor real) | `js/light-field.js` |

**Por que #9F4B2D.** Tem o tom da própria Páprica (39,8° em OKLab, contra 43,2° do #A55A3A), mais croma (0,120 contra 0,109) e luminância 0,126 (contra 0,156). Fica mais vermelho sem clarear.

A sugestão anterior (#A8523A) não bastava: o texto Marfim a 95% sobre ela daria 4,31:1. O croma máximo da gama (#B43D03) sai alaranjado demais e foge da paleta.

As posições das paradas (`STOPS`), os blooms, as velocidades e a geometria não mudaram.

### Medições depois da correção

| Onde | Antes da correção | Depois | Produção (`c5fa47a`) |
|---|---|---|---|
| Método, 390 | 4,20 (5 falhas) | **4,78 / 4,81** (0 falhas, 2 quadros) | 4,88 / 4,90 |
| FAQ, 390 | 4,42 (2 falhas) | **5,08** (0 falhas, 2 quadros) | 4,81 |
| Método, 1440 | 5,10 | 5,10 (0 falhas) | 5,10 |
| FAQ, 1440 | 6,28 | 6,50 (0 falhas) | 5,62 |
| "Presença digital", 1920 (12 quadros seguidos) | 3,03–3,27 | **3,15–3,42** | 3,24–3,27 |
| Título da Hero, 1920 | 9,04–9,16 | 8,24–9,44 | 9,04 |

Atrás do texto do Método, no celular, o pico agora é #9B4E31: mais vermelho que o #8B553A da produção e com claridade parecida.

As duas mudanças só escurecem o fundo atrás de texto claro. Por isso não podem piorar as larguras não medidas de novo (360, 430, 768, 1024, 1366): ali os valores da revisão já passavam.

As seções claras, o botão e as superfícies dos cards não foram tocados.

**Build:** `node tools/build-site.mjs`, 28 arquivos, sem erro.

**Capturas:** `fix-1440-hero.png`, `fix-1440-faq.png` e `fix-390-metodo.png` (compare com `v2-390-metodo.png` e `prod-390-metodo.png`).

### Continua em aberto

- Páprica Profunda visível nas seções Marfim (item 3 acima): é uma decisão visual sua.
- Botão do cabeçalho escuro ou Páprica (item 4).
- Modo sem WebGL, movimento reduzido, Safari e iPhone não foram testados.
