# Seção 03 no celular — composição editorial — relatório (08/11/2026)

Pedido: "VIPZUE — PROMPT MESTRE DE IMPLEMENTAÇÃO V3 · Seção 03 Mobile · Composição editorial, águia no galho,
narrativa scroll-driven e quatro Liquid Glass Cards 2×2", com a referência REFERENCIA_FINAL_MOBILE_SECAO03.

- Branch `feat/s03-mobile-editorial`.
- **Não publicado.** O prompt pede "não publique".
- Testado no Chrome headless com emulação de celular (toque, `mobile: true`).
- **Safari/iOS e aparelhos reais: não testados.**

Escopo: só a Seção 03 abaixo de 768 px. Desktop (≥ 1024) e tablet (768–1023) ficaram iguais, conferido por sonda e por
pixels (seção 7). As outras seções não foram tocadas.

## 1. Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `index.html` | As classes do prompt nos elementos que já existiam:<br>- `s03--editorial-mobile`, `s03-mobile__headline`, `s03-mobile__eagle`, `s03-mobile__narrative`, `s03-mobile__feature-grid`, `s03-mobile__feature-card`;<br>- a headline embrulhada em três `span.s03-mobile__headline-line` (mesmas palavras, mesmo `<br>` do desktop, agora `.s03__br-desk`);<br>- no `<head>`, a classe `s03-motion-m`, com a mesma trava de 3 s da `s03-motion`. |
| `css/sections.css` | O bloco antigo do celular foi removido: placas, raio e lista de cards em 1 coluna. Entrou o bloco "VIPZUE · S03 MOBILE · composição editorial" (só `max-width: 767.98px`). |
| `js/scroll-narrative.js` | A mesma `build()` do desktop agora aceita `build("mobile")` (seção 4). O ramo dos painéis ficou restrito a 768–1023 px. |

**Não tocados:**
- `js/hero.js`, `js/section3-liquid-glass.js`, `js/light-field.js` e `js/config.js`;
- o asset da águia (mesmo `src`/`srcset`);
- os textos;
- os tweens do desktop;
- as Seções 01, 02 e 04 a 08 e o rodapé.

Nenhuma dependência nova.

## 2. O que mudou, em ordem

1. **Headline.** É o mesmo `h2`, em três linhas fixas: "Apenas encontrar / sua empresa / não é suficiente.".
   - As linhas vêm dos spans do markup. O corte em palavras do Word Reveal (`splitWords(…, lines)`) mantém cada palavra dentro da linha dela.
   - O texto lido e a ordem das palavras não mudaram.
   - No desktop e no tablet os spans são inline e a quebra continua a do `<br>`.
2. **Águia.** É a mesma `aguia-galho-*.webp`, no alto à direita, cortada pela borda; a seção usa `overflow-x: clip`.
   - Foi calibrada pelos pixels opacos do asset (medidos no navegador), não pela caixa da imagem.
   - Não intercepta toque (`pointer-events: none`).
3. **Placas narrativas.** Não são mais pintadas no celular: sem superfície, gradiente, número, luz, raio, sombra ou tilt.
   - Os três textos ficam direto sobre o fundo claro, em Grafite.
   - Os wrappers continuam no DOM porque são os alvos do GSAP.
4. **Cards.** Os quatro cards são os mesmos do desktop (mesmo DOM, mesmo vidro, mesma onda), em 2 × 2: 01 | 02 / 03 | 04.
   - Abaixo de 340 px viram 1 coluna (fallback do §18). Isso só acontece no 320.
5. **Narrativa no celular.** O `.s03__stage` vira o trilho: altura do palco mais 3,2 alturas de tela, o mesmo percurso do desktop (420svh − 100svh).
   - Ficam presos (sticky) a coluna headline + texto e a figura da águia, com a altura do próprio conteúdo, não 100svh.
   - A grade vem em fluxo logo depois do palco. Ela nunca passa por baixo dele e nunca bloqueia a 04.

## 3. Valores finais em 390 × 844 (medidos no navegador)

| Item | Valor |
|---|---|
| Headline | Gloock 31,59 px (`clamp(30px, 8.1vw, 39px)`), entrelinha .94 (29,69 px), espaçamento −0,025em, Grafite `#22201D`, topo 68 px, recuo 18 px, largura 246 px (limite `min(74%, 310px)`), 3 linhas |
| Águia | `top: 44px`, `right: -39vw` (−152,1 px), `width: min(92vw, 400px)` (358,8 px); olho em ≈ (299, 88) |
| Texto narrativo | 15,21 px (`clamp(15px, 3.9vw, 17px)`), entrelinha 1,43, Grafite, recuo 20 px, topo 273 px |
| Grade | 2 colunas de 171 px, gap 12/12 px, margem `32px 18px 0`; topo em 392 px na soltura |
| Card | `min-height` 163,8 px (`clamp(154px, 42vw, 182px)`), raio 18 px, padding `14px 13px` |
| Número | 24 px, Páprica Profunda `#9F3930` |
| Título | 15,21 px, 600, entrelinha 1,15 |
| Descrição | 12,95 px, entrelinha 1,28; espaçamentos de 8 px |
| Cortes de título/descrição | 0 (em 320, 360, 390 e 430) |

Por tela:
- **Águia:**
  - 375–430 px: `top 44px; right -39vw; width min(92vw, 400px)`;
  - 360–374 px: `right: -43vw`;
  - abaixo de 360 px: `top 58px; right -47vw; width 88vw`.
- **Headline em 320 px:** 29 px.

**Folga real** entre os pixels opacos da águia e o que está perto dela, medida em todos os pontos da narrativa (p 0,25 / 0,4 / 0,6 / 0,85 / 1):

| Tela | Até as letras da headline | Até o texto |
|---|---|---|
| 320 | ≥ 11 px | ≥ 38 px |
| 360 | ≥ 12 px | ≥ 21 px |
| 375 | ≥ 11 px | ≥ 16 px |
| 390 | ≥ 13 px | ≥ 11 px |
| 393 | ≥ 14 px | ≥ 16 px |
| 414 | ≥ 15 px | ≥ 19 px |
| 430 | ≥ 16 px | ≥ 18 px |

## 4. A timeline do desktop reaproveitada, sem mudar tweens

`build()` é a mesma função do desktop, com:
- a mesma linha do tempo `T` (formação, assentamento, três parágrafos);
- o mesmo Word Reveal;
- os mesmos movimentos da águia e o mesmo `render(p)`;
- um único `ScrollTrigger` com `scrub`.

No celular (`build("mobile")`) só muda a geometria:
- **Centro da formação:** é o meio da tela visível (no desktop, o palco tem 100svh).
- **Fim do gatilho:** `+= percurso medido`, em vez de `bottom bottom`.
- **Percurso:** 3,2 × a altura visível (100svh, medida por um elemento oculto, para a barra do Safari não reconstruir a cena), recalculado em todo `refresh`. Um `ResizeObserver` na coluna presa refaz o `refresh` se a altura do texto mudar (fontes, zoom de texto).
- **Marco dos cards:** no desktop eles entram com o texto 1 (`T.p[0].in[0]`). No celular a grade fica depois do palco, então o marco é a chegada dela a 92% da altura visível, e nunca antes do texto 1:
  - em 390 × 844, p = 0,858;
  - cai dentro da revelação do texto 3 (0,79–0,93).

  Assim os cards não animam fora da tela (§484).

Controle de execução:
- Os modos são exclusivos por `matchMedia`:
  - desktop: `≥ 1024px` e altura ≥ 560;
  - painéis: 768–1023;
  - celular: `≤ 767.98px` e altura ≥ 560, com movimento permitido.
- Cada modo tem um único controlador; o `teardown` limpa o anterior.
- Na 03 há um segundo gatilho, que já existia: a passagem da Hero (`js/hero.js`). Ele termina exatamente onde a narrativa começa (em 390, 1612 → 2557, e a narrativa vai de 2557 → 5258), sem sobreposição e sem pin do GSAP.

## 5. Vidro e onda

- Os quatro cards usam o vidro da rodada anterior (`vz-s3-glass`, `vz-s3-glass-card`, três camadas, mesmo SVG).
- Não há segunda implementação, segundo observer nem segundo loop.
- O revelar e o reverter da narrativa chamam os mesmos `revealS03Insights` / `resetS03Insights`, que ligam e desligam a onda.

Testado em cada tela:
- as 4 ondas rodam depois de reveladas, com fases diferentes;
- seguem rodando com a rolagem parada e durante a rolagem, com o tempo só avançando;
- pausam fora da tela e retomam com os mesmos nós e as mesmas animações;
- pausam com a aba oculta;
- param na reversão.

Quadros reais do card 02, 2,2 s de intervalo: `onda-<tela>-card02-quadro1..3.jpg`.

## 6. Matriz de testes

Chrome headless. "Celular" = emulação com toque.

| Tela | Resultado |
|---|---|
| 390 × 844, 360 × 800, 430 × 932 | **PASSOU** 24/24 cada: modo, gatilhos, estados A–H, soltura junto (headline, águia e grade), águia nunca sob a grade, marco dos cards, onda (rodando, fases, rolando, parado, fora da tela, volta, aba oculta), card intacto, sem rolagem lateral, S04 livre, reversão, revelar de novo, console limpo, movimento reduzido |
| 320 × 568, 375 × 812, 393 × 852, 414 × 896 | **PASSOU** 24/24 cada. O 414 foi repetido sozinho: na primeira rodada, com três Chromes headless ao mesmo tempo, o driver ficou em p = 0 por 6 s no estado B (quadro congelado do ambiente; o mesmo teste, sozinho, passa 24/24). |
| 768 × 1024 (tablet) | **PASSOU**: sonda igual ao "antes" em 5 posições; capturas 0% de pixels diferentes |
| 1024 × 768, 1280 × 720 | **PASSOU**: sonda igual em 12 pontos; capturas 0% diferentes |
| 1440 × 900 | **PASSOU**: sonda igual em 11 de 12 pontos; capturas 0% diferentes (ver nota abaixo) |
| Contraste no celular (7 telas; T1, T2, T3, soltura e grade, pior de 4 quadros da onda) | **PASSOU**, 0 falhas. Piores valores: headline 10,34; texto 5,33; número 3,61 (texto grande, mínimo 3); título 8,38; descrição 6,18 |
| Contraste com movimento reduzido (390, 360, 430) | **PASSOU**, 0 falhas. Piores valores: texto 4,95; número 3,44; título 7,45; descrição 5,52 |
| `node tools/test-hero-voo.mjs` | **PASSOU** 11/11 |
| `node tools/build-site.mjs` | **PASSOU** (278 arquivos) |
| `git diff --check` / CRLF | **PASSOU** / 0 linhas LF sem CR |
| Safari iOS, Android real, Firefox | **NÃO TESTADO** |

Nota sobre o 12º ponto em 1440 (p 0,25): a entrada dos cards é uma transição CSS de 600 ms. O "antes" foi capturado a
95% dela e o "depois" no fim. As caixas são iguais, e em p 0,35 os dois estão em 1.

## 7. Capturas

Todas em `docs/qa/s03-mobile/` (local; `docs/qa/` não vai para o git).

- **390 × 844**, quadros em ordem:
  - `final-390x844m-000-A-entrada`, `…-008-formando`, `…-017-assentando`;
  - `…-030-inicio-headline-aguia`;
  - `…-045-T1`, `…-060-T1-T2`, `…-072-T2`, `…-083-T2-T3`, `…-095-T3-cards`;
  - `…-100-soltura`, `…-112-depois-da-soltura`;
  - `…-grade`;
  - `…-passagem-04-a/b`.
- **Folha de contato:** `final-390x844m-sequencia.jpg`.
- **Outras telas** (início + grade): `final-<tela>-030-inicio-headline-aguia.jpg` e `final-<tela>-grade.jpg` em 430, 360, 320, 375, 393 e 414.
- **Movimento reduzido:** `reduzido-<tela>-inicio.jpg` / `-grade.jpg`.
- **Desktop e tablet antes/depois:**
  - `antes-1440x900-p0.3.jpg` × `depois2-1440x900-p0.3.jpg` (e p0.96);
  - o mesmo em 1280, 1024 e 768;
  - mapas `diff-*.png` (vermelho = |Δ| > 24; nenhum).
- **Folga da águia:** `aguia-f1-*.jpg` e as séries `aguia-p*`.

## 8. Desvios (o que não segue o prompt ao pé da letra)

1. **Espaçamento da headline: −0,025em, não −0,045em.** O prompt pedia −0,045em "só se a tipografia tolerar". Em ampliação de 3×, −0,045em funde as serifas do Gloock ("nc", "ra" de "encontrar"; "Ap"), e −0,035em ainda encosta. Em −0,025em as letras se separam; o desktop usa −0,02em.
   - Literal, se preferir: `#o-que-fazemos.s03 .s03-mobile__headline { letter-spacing: -0.045em; }`, e a águia precisa recuar ~8 px.
2. **Cor do texto dos cards:**
   - títulos e descrições em Grafite;
   - números em `#9F3930`;
   - o Marfim e o `#D7673F` do prompt não foram usados.

   É a decisão de 08/11 na rodada do vidro (o usuário respondeu "o melhor"): o Marfim fica em 1,35–1,96:1 sobre o vidro claro. A versão literal está no relatório do vidro (`docs/s03-glass-onda-relatorio.md`, §7.1).
3. **Número a 24 px no mínimo**, não 23 px em 390. É o piso de texto grande da WCAG, para o `#9F3930` passar em 3:1.
4. **Cards entram ao chegar na tela, não com o texto 1.** A grade fica depois do palco, como pede o §412. Revelar no texto 1 animaria cards fora da tela (§484). O desktop continua revelando no texto 1.
5. **Composição em relação à referência:**
   - **Olho da águia:** (299, 88) contra (286, 83) na referência, 13 px à direita por causa do espaçamento da headline.
   - **Texto 1:** começa em 273 px. Na referência (escalada para 390) ele começa em ≈ 226 px, porque o galho do asset desce mais e o texto não pode encostar nele.
   - **Pino:** durante a narrativa a metade de baixo da tela fica só com o fundo claro, já que só headline, águia e texto ficam presos (§412). A referência é um pôster com tudo junto; o "Estado E" pede que a grade venha depois da soltura.
6. **Águia em voo da divisa 03→04 mantida no celular.** Fica fora do escopo; ela já existia e a 04 reserva espaço para ela.
7. **Rolagem lateral de 28 px em 320 × 568 ao abrir a página.** Vem da seção do CTA (`#contato`), não da 03. É igual em produção (medido em `vipzuesite.vercel.app`) e fica fora do escopo.

## 9. Correção encontrada na validação

Nas capturas da grade, a águia ficava presa por mais um palco (360 px) depois da soltura, e a grade passava por cima dela.

- **Causa:** a figura sticky usava `margin-bottom` negativa para sobrepor a coluna. O sticky mantém a caixa de margem dentro do trilho, então a figura soltava 360 px depois da coluna.
- **Correção:** a margem negativa passou para o topo da coluna (`margin-top`). As duas têm a mesma altura e o mesmo topo, e soltam no mesmo pixel.
- **Testes novos:**
  - headline, águia e grade sobem o mesmo tanto depois da soltura;
  - a base da águia nunca passa do topo da grade (p 1,02–1,20).
