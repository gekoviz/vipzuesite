# Seção 03 no celular — V3.1 · revisão cirúrgica dos cards

Prompt: "VIPZUE — PROMPT MESTRE DE IMPLEMENTAÇÃO V3.1 · REVISÃO CIRÚRGICA" (08/11/2026).
Branch `feat/s03-mobile-cards-1x4`, a partir da main publicada (`b5ec99e`). **Não publicado.**

Status: **implementado e validado no Chrome (headless, emulação de celular)**. Safari iOS e aparelho real: **não testados**.

## 1. Arquivos alterados

| Arquivo | O que mudou |
|---|---|
| `css/sections.css` | a regra "Celular: uma coluna" (1 × 4, publicada antes da V3) volta inteira; o bloco da composição editorial perde as medidas da grade 2 × 2 |
| `index.html` | só o comentário que descrevia os cards ("2 × 2" → "coluna 1 × 4 já publicada") |
| `docs/s03-mobile-v31-relatorio.md`, `docs/ANDAMENTO.md` | este relatório e o registro |

Nada mudou em JS, copies, SEO, Hero, Método, Para quem é, CTA, FAQ, footer, navegação nem `js/config.js`.

## 2. O diff, explicado

1. **Regra "Celular: uma coluna" (`@media (max-width: 767px)`) restaurada byte a byte como estava em `56f220e`**:
   - uma coluna;
   - vão 14px;
   - card com 170px de altura mínima e raio 22px;
   - conteúdo com 22px × 24px;
   - título 24px e descrição 16px.

   A V3 tinha trocado esses valores pelos da grade 2 × 2. Só o comentário diz agora que a 2 × 2 foi revogada.
2. **No bloco "S03 MOBILE · composição editorial" (`@media (max-width: 767.98px)`), saíram**:
   - `grid-template-columns` de duas colunas, o vão de 12px, a margem e o alinhamento da grade;
   - altura, raio e `height` dos cards;
   - o padding 14px 13px do conteúdo;
   - as regras de fonte de número, título e descrição;
   - o padding de 12px 11px abaixo de 360px;
   - a regra inteira abaixo de 340px.

   **Nenhum CSS novo para `[data-vz-s3-number]`, `[data-vz-s3-title]` ou `[data-vz-s3-copy]`.**
3. **Uma única linha nova**: `margin-inline: var(--page-margin)` na grade.

   O motivo: a regra de 1023px posiciona a grade com `--s03-inset`, e a composição editorial baixou essa variável para 18px por causa da headline. Antes da V3, a grade usava a margem de página (24px). Sem essa linha, os cards ficariam 12px mais largos que os publicados.
4. **Ficaram como estavam na V3 (o topo pedido pela referência 01)**:
   - headline em 3 linhas, águia no galho e textos narrativos;
   - o palco sticky;
   - a entrada dos cards: opacidade 0 e 18px abaixo → `.is-revealed`, 600ms.

## 3. Valores finais a 390 × 844 (calculados no navegador)

Topo, com a narrativa em p = 0,45 (texto 01 preso):

| Item | Valor |
|---|---|
| headline | `font-size` 31,59px (`clamp(30px, 8.1vw, 39px)`), `line-height` 29,69px (0,94), `letter-spacing` −0,79px (−0,025em), 3 linhas, x 18 / y 68, 246 × 89px |
| águia | `top` 44px, `right` −152,1px (−39vw), largura 358,8px (`min(92vw, 400px)`); caixa em x 182 / y 43 |
| narrativa | margem lateral 2px dentro do recuo de 18px → 20px da borda; y 273, largura 350px; 115,9px abaixo da headline |

Cards — publicado antes da V3 (`56f220e`), V3 (`9419171`, a 2 × 2) e agora (V3.1):

| Medida (390 × 844) | Antes da V3 | V3 (2 × 2) | **V3.1** |
|---|---|---|---|
| colunas | 1 (342px) | 2 (171px) | **1 (342px)** |
| card (x, largura × altura) | 24, 342 × 170 | 18, 171 × 163,8 | **24, 342 × 170** |
| vão entre cards | 14px | 12px | **14px** |
| distância do bloco anterior | 32px | 32px | **32px** |
| padding do conteúdo | 22px 24px | 14px 13px | **22px 24px** |
| raio | 22px | 18px | **22px** |
| número | 28px, `rgb(159, 57, 48)` | 24px | **28px, `rgb(159, 57, 48)`** |
| título | 24px / 27,6px | 15,21px / 17,49px | **24px / 27,6px** |
| descrição | 16px / 21,6px | 12,95px / 16,57px | **16px / 21,6px** |

**Contrato de não alteração** (§43):
- 32 propriedades calculadas de cada um destes elementos: a grade, os 4 cards, o conteúdo, número, título e descrição, o material e a borda do vidro, e a janela da onda;
- mais as caixas, os vãos e a classe;
- medido nos 7 celulares (320, 360, 375, 390, 393, 414 e 430).

Resultado: **6.797 de 6.797 valores idênticos ao publicado antes da V3.** Ficaram de fora só `opacity` e `transform` do momento da entrada.

Nos 7 celulares os cards têm x = 24, largura = largura da tela − 48, altura 170 e vãos de 14px. A coluna não cabe numa tela e não foi comprimida: são duas telas de cards, e a página rola.

## 4. A timeline do desktop

Continua a mesma, sem uma linha de JS alterada. `js/scroll-narrative.js` roda `build("mobile")` com a timeline do desktop:
- headline → T1 → T2 → T3 → soltura;
- os cards são revelados quando o progresso passa de `geo.cardsAt`, medido a partir de `s03Insights.offsetTop`. Por isso a marca acompanha a coluna mais alta sozinha, sem depender da forma da grade.

O teste funcional (abaixo) confirma:
- entrada, T1/T2/T3, soltura e revelação;
- o reverso (03 → 02 → 01);
- nenhum pin do GSAP e uma narrativa só por breakpoint.

## 5. Vidro e onda

- **Material, borda e janela da onda**: idênticos ao publicado (fazem parte das 6.797 propriedades acima).
- **A onda roda sozinha**: dois quadros do card 02, com 1,6s de diferença e sem rolar, têm 9–10% dos pixels diferentes em 390, 430 e 360 (`v31-*-onda-card02-quadro1/2.png`).
- **Teste funcional (passou nos 7 celulares)**:
  - 4 ondas rodando, com fases diferentes;
  - a onda continua com a rolagem parada;
  - pausa fora da tela e volta ao reaparecer;
  - pausa com a aba oculta e retoma quando ela fica visível;
  - não mexe no card (opacidade 1, sem transform);
  - fica estática no movimento reduzido.

## 6. Matriz de testes

| Tela | Resultado |
|---|---|
| 320 × 568, 360 × 800, 375 × 812, 390 × 844, 393 × 852, 414 × 896, 430 × 932 | **PASSOU**: contrato dos cards idêntico ao publicado (6.797/6.797); funcional 24/24 em cada |
| 768 × 1024, 1024 × 768, 1280 × 720, 1440 × 900 | **PASSOU**: sonda de caixas idêntica à `56f220e` em 20/20 posições. Diferença de pixels de 0 a 0,143%, toda na faixa dos cards (a onda anda com o tempo) |
| Safari iOS / iPhone real | **NÃO TESTADO** |

Checklist do §42:

| # | Item | Resultado |
|---|---|---|
| 1 | headline em 3 linhas, no alto à esquerda, sem bater na águia | PASSOU |
| 2 | águia do galho do desktop, no alto à direita | PASSOU |
| 3 | mesmo fundo claro, sem retângulos de imagem | PASSOU |
| 4 | sem cards marrons narrativos nem badges 01/02/03 | PASSOU |
| 5 | textos 01, 02 e 03 inteiros | PASSOU |
| 6 | mesma animação do desktop, sem salto de seção | PASSOU |
| 7 | voltar a rolagem reverte a narrativa | PASSOU |
| 8 | o palco solta sem cobrir os cards nem a 04 | PASSOU |
| 9 | cards 01–04 em 1 × 4, mesma largura e altura do publicado | PASSOU |
| 10 | nenhum título ou descrição cortado, sem encolher | PASSOU |
| 11 | vidro claro, números em Páprica, tinta escura | PASSOU |
| 12 | ondas localizadas, com fases diferentes e loop próprio | PASSOU |
| 13 | rolagem parada não congela a onda; fora da tela e aba oculta pausam | PASSOU |
| 14 | movimento reduzido legível, com onda estática | PASSOU |
| 15 | desktop igual ao baseline | PASSOU |
| 16 | tablet sem regressão; demais seções intactas | PASSOU |
| 17 | `scrollWidth <= innerWidth + 1` | PASSOU (ver observação 2) |
| 18 | console sem erros | PASSOU |
| 19 | sem 2 pins ou 2 drivers no mesmo breakpoint | PASSOU |
| 20 | sem tela branca ou texto oculto no reload no meio da página | PASSOU no Chrome; no Safari iOS e no histórico do iOS: NÃO TESTADO |

**Contraste** (WCAG AA, pixels reais sob cada linha, pior caso de 4 quadros da onda; mínimos de 3 para texto grande e 4,5 para o normal):
- **Movimento normal, a 390, 360, 430 e 320**: tudo passou, exceto o caso da observação 1.
- **Movimento reduzido, a 390 e 320**: tudo passou.

Valores a 320 px, a tela mais apertada:

| Modo | Headline | Texto | Número | Título | Descrição |
|---|---|---|---|---|---|
| movimento normal | 10,34 | 5,33 | 3,26–4,15 com o card na tela (obs. 1) | 6,77 | 5,54 |
| movimento reduzido | 10,29 | 5,16 | 3,39 | 6,77 | 5,36 |

### Observações (honestas)

1. **Número "02" a 320 px quando o card entra pela borda de baixo.**
   - Com só ~7px do número visível na base da tela, o medidor acusou 2,32–3,35, variando de quadro a quadro. É um efeito passageiro do vidro naquele instante.
   - Medido nas mesmas posições de tela, o publicado antes da V3 dá a mesma coisa (2,36 a 7px da borda). A 20px da borda, no meio e a 24px do topo, as duas versões dão valores iguais (3,26–4,15).
   - Conclusão: **é anterior a esta mudança**. Como o prompt proíbe recolorir os cards, nada foi alterado.
2. **A 320 px a página é montada com 348px de largura**, e o Chrome reduz a escala para 92% para caber.
   - Não há rolagem lateral (`scrollWidth` = `innerWidth` = 348).
   - O publicado antes da V3 faz igual, então é anterior e não vem dos cards. A causa não foi investigada nesta rodada.

## 7. Capturas, `git diff --check` e build

As capturas ficam em `docs/qa/s03-mobile-v31/` (o git ignora essa pasta; os arquivos ficam só nesta máquina):
- **cards**:
  - `base56f-<tela>-cards*.jpg` (antes da V3);
  - `atual-v3-<tela>-cards*.jpg` (a 2 × 2);
  - `depois-<tela>-cards*.jpg` (V3.1);
  - nos 7 celulares;
- **sequência da 03 em 390, 430 e 360** (`v31-<tela>-*.jpg`): entrada, headline, águia + T1, T2, T3, soltura, cards 01–02 e 03–04 (duas telas) e a passagem para a 04;
- **onda**: `v31-<tela>-onda-card02-quadro1/2.png`;
- **desktop e tablet**: `desk-antes-*.jpg` / `desk-depois-*.jpg`.

`git diff --check`: limpo. CRLF: confirmado. `node tools/build-site.mjs`: 279 arquivos.
