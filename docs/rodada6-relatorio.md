# Rodada 6 — Seção 06, emendas, rodapé e uma seção por tela: relatório

Feita na branch `feat/rodada6`, a partir da `main` em `130597b` (rodada 5 em produção).

A §11 pede publicar a cada commit, mas o push na `main` é bloqueado pelo auto mode ("Production Deploy"). Os cinco commits de código foram validados no servidor local (`http://localhost:5173/`, Chrome via DevTools) e publicados de uma vez, depois da confirmação do usuário (como nas rodadas 4 e 5).

**Publicado em produção em 02/11/2026:** fast-forward da `main` (`130597b` → `f9a0303`) com push, mais a correção `b624036`.
- **O primeiro deploy não saiu.** O `tools/build-site.mjs` procura caminhos de assets no texto do CSS, inclusive em comentários. Um comentário do bloco da 06 citava `assets/img/aguia-cta-1200.webp`; o build o resolveu relativo a `css/`, não achou o arquivo e parou.
- **A correção (`b624036`)** tira o caminho do comentário; nenhuma regra muda. O build local passou a gerar o `site-vercel/` com os três WebP.

**Prova de deploy:**
- `curl` dos três WebP em produção: 200, `image/webp`, com 38 980, 88 062 e 180 438 bytes.
- O HTML publicado traz o `.closing__panel` e a microcopy nova.
- `js/handoff.js` continua 404.

**`vz-check-r6` em produção** (aba em primeiro plano): o mesmo resultado do local nas cinco larguras.

| Largura | PASS | FAIL | WARN | NA |
|---|---|---|---|---|
| 390 × 844 | 38 | 1 | 2 | 14 |
| 768 × 1024 | 39 | 0 | 2 | 14 |
| 1366 × 768 | 48 | 5 | 3 | 0 |
| 1440 × 900 | 49 | 4 | 3 | 0 |
| 1920 × 1080 | 49 | 3 | 3 | 1 |

- As FAIL e os WARN são os mesmos do local, explicados em (7).
- A única diferença é o `B.img-peso`, que dá NA em 390, 768 e 1920: a imagem veio do cache, sem medida de transferência. Os pesos foram conferidos pelo curl, acima.

Salvo indicação, os números de (3) a (7) abaixo são do servidor local.

## (1) Resumo em 5 linhas

1. **Botão (Hero e 06):** o hover só acende (filete mais claro, halo, pontos 0,22 → 0,45, cintilância 0,32 → 0,6). Sem o quadrado do `span::before`, sem trocar o arco, sem `shiny-breathe` e com a mesma velocidade da borda: 119–120°/s parada e no hover (antes, o hover caía para 71°/s).
2. **06:** título à esquerda e card escuro à direita com a águia pousada na borda (desktop); título e depois o card (celular e tablet). Microcopy nova (E19). A 06 cabe em uma tela: 768/900/1080px em 1366×768, 1440×900 e 1920×1080.
3. **Emendas:** no desktop, a 04 → 05 e a 06 → 07 trocam o véu preto por uma linha Dourada de 1px. A 05 → 06 ganha uma linha Bronze em todas as larguras. O celular e o tablet seguem com os véus da rodada 5.
4. **Rodapé:** a altura da tela em todas as larguras (900px em 900, 768 em 768, 844 em 844), wordmark centralizada (Δ 0,0px do centro da caixa) e nada da FAQ acima dele no fim da página (y = 0).
5. **Uma seção por tela no desktop:** `min-height: 100svh` e conteúdo centralizado nas 04–07; encaixe da rolagem com **`proximity`** (Plano B da §7.1), só da 04 ao rodapé. Com `mandatory`, a rolagem saltava dentro dos palcos `sticky` da Hero e da 02/03 (ver (4)). `vz-check-r6`: 39/40/48/49/50 PASS em 390/768/1366/1440/1920 (antes: 16/15/17/18/18).

## (2) Arquivos alterados

| Arquivo | Commit | O que mudou |
|---|---|---|
| `css/base.css` | 1 | O bloco "ShinyButton (CTA da Hero)" virou o bloco da §3.2 ("Hero e 06 — rodada 6"). Saem o `span::before` (o quadrado), o `shiny-breathe` e a segunda animação "reverse paused". O hover só muda `--shiny-shine`, o halo e a opacidade de `::before`/`::after`. Movimento reduzido: o seletor `span::before` saiu da regra que já existia (o resto igual). |
| `index.html` | 2 | A `#contato` ganhou o `.closing__panel` (com o `data-reveal`), a `img.closing__eagle` (`width="1200" height="804"`, `alt=""`, `loading="lazy"`, `decoding="async"`, `srcset` 480/800/1200w) e a microcopy nova. Título, texto e rótulo do botão iguais. |
| `assets/img/aguia-cta-480.webp` | 2 | Novo: 480×322, 38 KB, com alfa. |
| `assets/img/aguia-cta-800.webp` | 2 | Novo: 800×536, 86 KB, com alfa. |
| `assets/img/aguia-cta-1200.webp` | 2 | Novo: 1200×804, 176 KB, com alfa. |
| `css/sections.css` | 2 | O bloco `.closing` original vira o da §4.4. **Saem** os dois blocos da rodada 5 ("06 — CTA final: respiro…" e "06 — ShinyButton sobre o bege", com o `@property --shiny-bg`) e as regras antigas da 06 nas medias de 1023 e 767px. |
| `css/sections.css` | 3 | Novo bloco "Emendas — rodada 6" no fim do arquivo (§5). |
| `css/sections.css` | 4 | O bloco "08 — Rodapé no celular (rodada 5)" vira o da §6.2, sem `@media`, com a wordmark centralizada. |
| `js/beam-footer.js` | 4 | As duas trocas da §6.3 no `fit()`: (a) `rest` medido com o rodapé na altura natural (sem o `min-height` e sem a altura da cortina, restaurados na mesma leitura); (b) o teto de altura volta a valer em todas as larguras, e sai o comentário "celular (≤ 767 px)". |
| `css/sections.css` | 5 | Novo bloco "Uma seção por tela no desktop — rodada 6" no fim do arquivo (§7), com o Plano B. |
| `docs/rodada6-relatorio.md`, `docs/ANDAMENTO.md` | 6 | Este relatório e a entrada do dia. |

Não mudaram: `js/config.js`, `js/journey-lamp.js`, `js/light-field.js`, `js/footer-curtain.js`, imagens e fontes existentes, tokens-base.

### Diferenças em relação ao HTML da §4.1

- **`has-field` e `data-field="light"` não entram no HTML.** Eles são postos pelo `js/light-field.js` só quando o campo WebGL sobe (e o `has-field` sai quando o contexto se perde). Deixá-los fixos no HTML quebraria a reserva "sem WebGL". O HTML manteve os atributos originais (`data-field-flip`); com WebGL, o JS acrescenta os dois, como antes.
- **O botão continua com `aria-disabled="true"` e sem `href`,** em vez do `href="#"` do prompt. É o estado que o `js/sections.js` deixa quando o `js/config.js` está sem número de WhatsApp, e era o HTML da rodada 5. Com número, o JS põe o `href` do WhatsApp e tira o `aria-disabled`. O `B.botao-ganchos` dá WARN por isso ("href vazio: confirme que o config.js preenche").

## (3) Tabela de alturas das seções (§2.3), antes e depois

Altura em px e em % da tela. "Antes" é a produção na rodada 5 (`130597b`); "depois" é o local em `b326f15`.

| Tela | | Hero | 02-03 | 04 Método | 05 Para quem é | 06 Contato | 07 FAQ | Rodapé |
|---|---|---|---|---|---|---|---|---|
| 1280×720 | antes | 2477 (344%) | 3024 (420%) | 965 (134%) | 1304 (181%) | 923 (128%) | 810 (112%) | 672 (93%) |
| | depois | 2477 (344%) | 3024 (420%) | 965 (134%) | 1131 (157%) | **720 (100%)** | 810 (112%) | **720 (100%)** |
| 1366×768 | antes | 2642 | 3226 | 982 (128%) | 1316 (171%) | 1038 (135%) | 814 (106%) | 682 (89%) |
| | depois | 2642 | 3226 | 982 (128%) | 1131 (147%) | **768 (100%)** | 814 (106%) | **768 (100%)** |
| 1440×900 | antes | 3096 (344%) | 3780 (420%) | 997 (111%) | 1346 (150%) | 1087 (121%) | 817 (91%) | 684 (76%) |
| | depois | 3096 (344%) | 3780 (420%) | 997 (111%) | 1130 (126%) | **900 (100%)** | **900 (100%)** | **900 (100%)** |
| 1536×864 | antes | 2972 | 3629 | 1037 (120%) | 1334 (154%) | 1081 (125%) | 817 (95%) | 684 (79%) |
| | depois | 2972 | 3629 | 1037 (120%) | 1126 (130%) | **864 (100%)** | **864 (100%)** | **864 (100%)** |
| 1920×1080 | antes | 3715 | 4536 | 1037 (96%) | 1383 (128%) | 1141 (106%) | 817 (76%) | 684 (63%) |
| | depois | 3715 | 4536 | **1080 (100%)** | 1124 (104%) | **1080 (100%)** | **1080 (100%)** | **1080 (100%)** |

- A 05 encolheu 128–259px em todas as telas: perdeu a reserva do véu longo (`--veil-long: 0px` no desktop, E21).
- A 06 encolheu porque perdeu o padding do véu e o conteúdo agora é lado a lado.
- A Hero e a 02-03 não mudam: já passam da tela, então o `min-height: 100svh` não as alcança. **Nenhuma ficou com vazio** (dúvida 6).
- Em todas: `pinSpacer` 0, as quatro seções filhas de `main` (agora `display: flex`), 5 véus, cortina presente, 5 campos, header `absolute`.

## (4) Ajustes em relação ao prompt, e por quê

1. **`--closing-eagle-ratio: 0.670` e `width/height` 1200×804.** São do arquivo real (recorte justo pelo alfa: 1477×990 a partir de (41,16) no PNG de 1536×1024). `B.var-ratio` PASS (0,670 contra 0,670).
2. **`--closing-perch: 0.15`, fora da faixa sugerida (0,06–0,14).** Nesta águia, o que pousa é a base reta do corpo com as garras na frente. Com 0,10, as garras ficavam acima da borda, e só a ponta encostava no card. Com 0,15, as garras descem 29–49px sobre a borda (15% da altura da águia), dentro dos 5–25% do `B.aguia-na-borda`. O texto começa 26–45px abaixo delas (mínimo 8).
3. **`--closing-eagle-w`:** ficou em **0,84**, sem ajuste (84% do card; faixa do checker 74–92%).
4. **`font-size` do título:** sem ajuste. Ficou em 79px (1366), 84px (1440) e 92px (1920), em **5 linhas** sem palavra partida, ocupando 49% do container (máximo 55%).
5. **WebP de 1200 com 201 KB na qualidade 0,82:** baixada para **0,76** nos três tamanhos, como manda a §4.2. Os WebP saíram do canvas do Chrome (`toBlob('image/webp', 0.76)`): não há Python/PIL nem `sharp` nesta máquina, e nada foi instalado.
6. **`mandatory` × `proximity` (§7.1).** Medido em 1440×900, rolando a cada 100–350px e vendo onde a página para:

   | Variante | Resultado |
   |---|---|
   | `mandatory`, todas as seções no encaixe (o CSS da §7) | Trava. As posições 1296–2196 e 2196–3096 ficam inalcançáveis: a rolagem salta para 1296, 2196 ou 3096, no meio das animações da Hero e da 02. |
   | `mandatory`, Hero com `start` e 02 com `end` | Trava igual (1296–3096). |
   | `mandatory`, sem a Hero e a 02/03 no encaixe | Pior: de 0 a 5850, tudo salta para 5976 (a 04). |
   | `proximity`, todas no encaixe | Ainda puxa a rolagem no meio da Hero (1350 → 1296; 1950–2400 → 2196; 2850–3000 → 3096). |
   | **`proximity`, encaixe só na 04, 05, 06, 07 e rodapé** | **Hero e 02/03 livres de 0 a 5550; encaixe da 04 em diante.** |

   **Por quê:** a 02 sobe 100svh por cima da Hero (`margin-top: -900px` a 1440; a 02 desliza por baixo do palco sticky). O Chrome invalida a área de encaixe da Hero assim que qualquer área da 02 entra na tela. Não há `mandatory` possível sem mexer no layout da Hero/02, o que esta rodada não permite. Ficou a última linha: é o Plano B da §7.1 com a regra da própria §7.1 para seções fixadas ("não encaixe essas"). O comentário no CSS registra isso.

   **Teste de mão** (1440×900, no navegador do app, com entrada real):
   - **Roda do mouse,** de ponta a ponta, 5 dentes por vez: 500, 1000 … 5000, 5500, 6000 (a 04 rola por dentro), 6073 (fim da 04), 6573, 7073, 7573, 8103 (encaixe na 06), 8603, 9003 (encaixe na 07), 9503. Nenhuma trava.
   - **Menu:** as quatro âncoras caem exatamente no topo da seção (2196/2196, 5976/5976, 6973/6973, 9003/9003).
   - **Home / End:** 0 e 9903 (o fim real).
   - **Espaço** (uma tela) a partir da 04: vai direto ao topo da 05 (6973). **Seta ↓:** anda 40px.
   - **PageDown:** anda 787px por vez (7761, 8548, 9335) **sem encaixar**. É a limitação do `proximity`: perto de uma borda ele encaixa; longe, deixa parar no meio.
   - **Não testado:** trackpad (sem aparelho com trackpad nesta sessão).

   **O custo:** o "nunca duas seções meio a meio" vale quando a rolagem para perto de uma borda. Com passos grandes (PageDown, roda de 5 dentes), dá para parar com metade da 06 e metade da 07 (8603). Ver a dúvida 5.
7. **Seções excluídas do `min-height`:** nenhuma. A Hero e a 02/03 já passam da tela.

## (5) Exceções E19–E22, revogações e tokens

| # | Regra quebrada | O que muda | Por que existe | Função que resolve | Vale só para |
|---|---|---|---|---|---|
| E19 | §8.7: microcopy de redução de fricção junto ao CTA final (dizer que não é compra) | A microcopy perde "e o orçamento. Não é uma compra: é o início da conversa." e fica "Ao clicar, você será direcionado ao WhatsApp para conversar sobre o seu projeto." | Pedido direto da Experiência (02/11, 13h14) | Ainda reduz fricção: diz para onde o clique leva (WhatsApp) e sobre o quê (o projeto) | `#contato` |
| E20 | UI.14: ilustração só abstrata | Uma águia figurativa pousada no card do CTA | Pedido da Experiência (referência: o outro site da VIPZUE) | Assinatura da marca no ponto de conversão; decorativa (`alt=""`) | `#contato` |
| E21 | Rodada 4 E11 / rodada 5 E16: véu nas emendas no desktop | A 04 → 05 e a 06 → 07 deixam o véu e viram uma linha de 1px; a 05 → 06 ganha uma linha em todas as larguras | Pedido da Experiência: "tirar esse efeito preto, usar uma linha minimalista" | Emenda limpa, com a mesma receita do filete do rodapé | 04 → 05 e 06 → 07 em ≥ 1024px; 05 → 06 em todas |
| E22 | Altura da seção definida pelo conteúdo (padrão do site até a rodada 5) | `min-height: 100svh`, centralização vertical e `scroll-snap` (`proximity`, da 04 ao rodapé; ver (4)) | Pedido da Experiência: "cada seção ocupa o viewport; nada aparece por baixo" | Uma ideia por tela, emendas limpas | Desktop, ≥ 1024px de largura e ≥ 600px de altura |

**Registro das rodadas anteriores atualizado:**
- **E15** (UI.08, botão sobre fundo claro): **perde as cores** sobre o bege (o botão da 06 está agora sobre o card escuro, com as cores da Hero). **Mantém** a parte do efeito (borda cônica viva, pontos, brilho) para o ShinyButton em geral.
- **E16** (véus 06 → 07 e fim da FAQ): no que toca a 06 → 07, passa a valer **só abaixo de 1024px** (acima, vale E21). O véu curto do fim da FAQ continua em todas as larguras.
- **E17** (rodapé na altura da tela, só ≤ 767px) é **ampliada:** o rodapé tem a altura da tela em todas as larguras.
- A regra de ouro da rodada 5 ("a 06 não se toca") cai nesta rodada, a pedido da Experiência. A copy do título, do texto e do rótulo do botão continua intocada.

**Tokens e variáveis:**
- **Novos:** `--closing-eagle-w` (0,84), `--closing-eagle-ratio` (0,670), `--closing-perch` (0,15) e `--closing-p` (`clamp(12px, 1.75svh, 17px)`, base em `em` do painel no desktop).
- **Mudam:** `--veil-long` vale `0px` em ≥ 1024px (abaixo disso, igual à rodada 5).
- **Saem:** `--shiny-bg` como propriedade registrada (`@property`), que volta ao estado anterior à rodada 5.

Nenhuma exceção entrou nos tokens-base nem nos componentes-base.

## (6) Registro de conformidade

| # | Item | Prova | Resultado | Evidência |
|---|---|---|---|---|
| R1 | Deploy da rodada no ar; WebP da águia = 200 | curl; `A.sem-quadrado` | PASS | `main` em `b624036`. Três WebP = 200 (38 980 / 88 062 / 180 438 bytes). `A.sem-quadrado` PASS em produção nas cinco larguras. |
| R2 | Rodada 5 presente (pré-requisito) | §2.1 | PASS | Produção em `130597b`; `vz-check-r5` em produção 36/30/38/38/38 PASS, 0 FAIL. |
| R3 | Botão: sem quadrado, mesmo arco e mesma velocidade no hover, só acende; Hero e 06 iguais | `A.*` | PASS (390, 768, 1366, 1440, 1920) | 119–120°/s parada e no hover (antes: 120 → 71°/s). Arco 5% → 5%, ângulo 0deg → 0deg, uma animação (`shiny-angle 3s`). Hover: pontos 0,22 → 0,45, cintilância 0,32 → 0,6. Capturas `c1-hero-hover-a/b/c.png` sem retângulo. |
| R4 | 06: título à esquerda, card à direita com a águia na borda, uma tela; celular: título, depois card | `B.*`; capturas | PASS | Lado a lado: título 49% do container, vão de 38–159px, centros verticais com 0px de diferença. 06 = 100% da tela em 1366/1440/1920. Celular: título termina em 343, painel começa em 383. |
| R5 | Microcopy nova exata; resto da copy intacto | `B.copy`, `F.*` | PASS | `F.copy-06-hash` c5270609/296 (o alvo); `F.copy-intacta` PASS em todas as larguras. |
| R6 | Águia: alfa real, WebP em três tamanhos, pesos, width/height/ratio reais | `B.img-*`, `B.var-ratio` | PASS, com um falso positivo | 38/86/176 KB (metas 50/100/180). Ratio 0,670 = 0,670. Alfa: os quatro cantos dão 0. O `B.img-alfa` dá FAIL por um ponto só, explicado em (7). |
| R7 | 05 → 06: mesma cor, separadas por uma linha (todas as larguras) | `C.filete-05-06`; captura | PASS (390, 768, 1366, 1440, 1920) | Filete de 1px no `#contato::before`; 05 e 06 coladas (0,0px de vão). |
| R8 | Desktop: 04 → 05 e 06 → 07 em linha, sem faixa preta; celular/tablet com os véus da rodada 5 | `C.*`; capturas | PASS | `C.filetes`, `C.veus-saem`, `C.var-veu` (0px) e `C.faq-rodape` (véu de 72px) no desktop; `C.mobile-intacto` (véus de 152–153px) a 390. Capturas `c3-0405-1440.png` e `c3-0607-1440.png`. |
| R9 | Rodapé na altura da tela em todas as larguras; wordmark centralizada e larga; cortina ligada | `E.*`; capturas | PASS, com um falso positivo | 844/1024/768/900/1080px em telas de mesma altura. Wordmark a 100% da caixa (87% em 1366×650 e 83% em 1280×620: WARN previsto). Δ 0,0px do centro da caixa. Cortina ligada. Fim da página: rodapé em y = 0. `E.wordmark-centro` é falso positivo, ver (7). |
| R10 | Desktop: cada seção ocupa a tela, nada aparece por baixo, encaixe da rolagem | `D.*`; teste de mão | **Parcial** (Plano B) | `D.altura` WARN (seções acima da tela, ver (3)). `D.container` e `D.centro` PASS. `D.snap` FAIL: `proximity` e sem encaixe na Hero/02, de propósito, ver (4). `D.sem-fresta` e `D.vizinha-escondida` (1366 e 1280×620): sobreposição da Hero/02, que já existia, ver (7). |
| R11 | Regressões da rodada 5 conforme a §10.2 | `vz-check-r5.js` | PASS fora dos itens previstos | Ver (7). |
| R12 | Sem rolagem horizontal; ≤ 6 contextos WebGL | `B.sem-rolagem-horizontal`; r5 `F.*` | PASS | Sem rolagem horizontal; 6 canvases. A 320px, a 06 cabe (águia 46–274, card 24–296, botão 47–273); a águia da Hero passa de 320, como já passava em produção. |
| R13 | Movimento reduzido / sem WebGL / sem JS | §8, §10.6–7 | PASS (sem JS: não testado) | Ver a lista abaixo. |
| R14 | Skills de auditoria rodadas, resumo colado | §10.11 | **Não rodadas como skills** | As medidas equivalentes vieram dos checkers e de scripts, ver abaixo. |
| R15 | iPhone real, Safari e Firefox | relato | **Não feito** | Sem aparelho, Safari ou Firefox nesta sessão. Só o Chrome (DevTools e o navegador do app). |

**R13 em detalhe:**
- **Movimento reduzido (1440):** 50 PASS. Borda parada (`--shiny-angle` 300deg, `animation: none`), sem encaixe (`scroll-snap-type: none`), sem cortina e rodapé com 900px (a altura da tela). Com o movimento reduzido, a Hero encolhe para 1405px (156%) e não se sobrepõe à 02, então `D.sem-fresta` também dá PASS.
- **Sem WebGL (1440):** 49 PASS. A 06 fica no bege liso, com a linha, a águia e o texto legíveis (captura `f-06-1440-nogl.png`). Nenhum `has-field` na página. Só os mesmos FAIL do caso com WebGL.
- **Sem JS:** não testado. A 06 é HTML/CSS e a águia é uma `<img>` comum.

**R14 em detalhe (o que foi medido no lugar de cada skill):**
- **contrast:** `B.contraste`, no pior ponto do gradiente do card: texto de 10,4 a 10,9:1 e microcopy de 7,3 a 7,4:1.
- **overflow:** sem rolagem horizontal em 390/768/1366/1440/1920; a 320, ver R12.
- **a11y:** um `h2` na 06; ordem do DOM = ordem de leitura; águia com `alt=""`; linhas em pseudoelemento ou `aria-hidden`.
- **anim-lint:** o botão só anima `--shiny-angle` e as opacidades; nenhuma transição longa de `transform` no painel (`G.transicoes`).
- **performance / assets:** águia `lazy`, WebP, com `width`/`height` (sem CLS), 38–176 KB.
- **deadspace:** 06 centrada (centros com 0px de diferença); seções esticadas centralizadas (`D.centro`).
- **responsive:** as cinco larguras, mais 320, 1366×650, 1280×620 e 1920×1600.
- **Não feitos:** `vsdesign` (não há fotos da Experiência em `docs/design/`), `seam` e `spec-check` como passes próprios.

**Rolagem longa** (§10.8: topo → fim → topo, duas vezes, em passos de 40px, 1440×900):

| | Quadros | p50 | p95 | p99 | Máx. | > 50 ms | Contextos perdidos |
|---|---|---|---|---|---|---|---|
| Local, 1ª passada (logo após recarregar) | 742 | 16,7 | 50 | 83,3 | 183 | 30 | 0 |
| Local, 2ª passada | 742 | 16,7 | 33,3 | 50 | 67 | 6 | 0 |
| Local, 3ª passada | 742 | 16,7 | 33,3 | 66,6 | 100 | 17 | 0 |
| Produção (rodada 5), 1ª | 752 | 16,7 | 33,1 | 50,2 | 383 | 14 | 0 |
| Produção (rodada 5), 2ª | 752 | 16,7 | 33,3 | 50,2 | 101 | 11 | 0 |
| Local 390×844 | 674 | 16,7 | 50 | 83,4 | 250 | 29 | 0 |

A variação entre passadas é grande (6 a 30 quadros acima de 50ms no local). A rodada 6 fica na mesma faixa da produção. Os quadros lentos caem no rodapé e na FAQ (desktop) e na Hero (celular). Nenhum contexto WebGL perdido.

## (7) `vz-check-r6` e `vz-check-r5`: antes e depois

**`vz-check-r6`.** "Antes" = produção na rodada 5; "depois" = local em `b326f15`:

| Tela | Antes (PASS/FAIL/WARN/NA) | Depois (PASS/FAIL/WARN/NA) |
|---|---|---|
| 390 × 844 | 16 / 12 / 4 / 11 | 39 / 1 / 2 / 13 |
| 768 × 1024 | 15 / 13 / 4 / 11 | 40 / 0 / 2 / 13 |
| 1366 × 768 | 17 / 21 / 4 / 0 | 48 / 5 / 3 / 0 |
| 1440 × 900 | 18 / 20 / 4 / 0 | 49 / 4 / 3 / 0 |
| 1920 × 1080 | 18 / 20 / 4 / 0 | 50 / 3 / 3 / 0 |
| 1366 × 650 | — | 47 / 4 / 5 / 0 |
| 1280 × 620 | — | 46 / 5 / 5 / 0 |
| 1920 × 1600 (janela alta) | — | 50 / 3 / 3 / 0 |

**Todas as FAIL que sobram, e por quê:**
- **`B.img-alfa`** (390, 1366, 1440; não a 768 e 1920): falso positivo. O checker lê cinco pontos: os quatro cantos (todos 0) e o **centro da primeira linha**. Com o recorte justo pelo alfa, a primeira linha é o alto da cabeça da águia. Nela só os pixels x = 241–262 (de 489) são opacos, bem no centro; o alfa sobe para 248–253 nos pixels de baixo (pena, não fundo). Não há retângulo (capturas).
- **`E.wordmark-centro`** (desktop): falso positivo. O checker compara com `innerWidth / 2`, que inclui a barra de rolagem clássica do Windows (15px). Contra a área visível (`clientWidth / 2` = 712,5 a 1440), a wordmark está a 0,1px; contra a caixa, a 0,0px. A 390 (barra que não ocupa espaço) dá PASS com Δ 0,2px.
- **`D.snap`** (desktop): `proximity`, e a Hero e a 02/03 sem ponto de encaixe, de propósito (ver (4)).
- **`D.sem-fresta`** (desktop): a emenda acusada é Hero → 02. A 02 tem margem de cima negativa de uma tela (−900px a 1440×900) e sobe por baixo do palco da Hero; isso já existia antes da rodada e não muda nesta. Com movimento reduzido (sem o palco), dá PASS.
- **`D.vizinha-escondida`** (1366×768 e 1280×620): no topo da 02, o palco sticky da Hero ainda cobre a tela (`elementFromPoint` → `div.hero__stage`). Já dava FAIL em produção a 1366 antes da rodada (`antes-1366`). A 1440 e 1920 dá PASS.

**WARN:** `B.botao-ganchos` (o `href` vazio, ver (2)); `Z.manual`; `D.altura` (seções acima da tela, ver (3)); `B.06-uma-tela` a 1366×650 (104%) e 1280×620 (108%), telas baixas, aceitável; `E.wordmark-largura` a 1366×650 (87%) e 1280×620 (83%), o encolhimento previsto na §6.4 com a cortina ligada.

**`vz-check-r5` (regressão).** Produção antes: 36/30/38 PASS a 390/768/1440, 0 FAIL. Local depois:

| Tela | PASS | FAIL | WARN | NA |
|---|---|---|---|---|
| 390 × 844 | 31 | 5 | 1 | 0 |
| 768 × 1024 | 24 | 6 | 1 | 1 |
| 1440 × 900 | 29 | 9 | 1 | 0 |

Todas as FAIL estão na tabela de mudanças de propósito da §10.2, mais uma pedida pela §6.3:
- `A.dobra-altura`, `B.altura`, `B.respiro-06` (1440): os véus saem no desktop (E21).
- `C.desktop-igual` (768, 1440): o rodapé tem a altura da tela fora do celular (E17 ampliada).
- `D.cores`, `D.hover`, `D.foco` (todas): o botão da 06 perde as cores UI.08 sobre o bege. **A diferença no botão da Hero é só o hover;** `D.efeito`, `D.botao` e `D.hero-intacto` seguem PASS.
- `G.copy-intacta` (todas): só em contato (E19).
- `C.js` (todas): "beam-footer.js sem o patch do teto". A §6.3(b) manda tirar a exceção do celular que a rodada 5 pôs; o teto volta a valer em todas as larguras.

Todo o resto do r5 segue PASS, incluindo os véus do celular e do tablet, a linha do tempo da 04 abaixo de 1024px e os cards da 04.

## (8) Capturas

Ficaram no scratchpad da sessão (não versionadas):
- **Botão da Hero no hover**, em 3 instantes (≈ 0,15s, 1s e 1,8s): `c1-hero-hover-a/b/c.png`. Sem retângulo; a borda continua girando.
- **06:** `antes-06-1440.png` e `antes-06-390.png`; depois, `c2-06-1366.png`, `c2-06-1920.png`, `c2-06-390.png` e `f-06-1440-nogl.png` (sem WebGL).
- **Emendas a 1440:** `antes-0405-1440.png` / `c3-0405-1440.png` e `antes-0607-1440.png` / `c3-0607-1440.png`.
- **Fim da página a 1440:** `antes-fim-1440.png` / `c4-fim-1440.png`.

O que se vê nelas:
- **06 no desktop:** título em 5 linhas à esquerda; card Bronze → Café → Carvão à direita; a águia com as garras sobre a borda de cima do card; sem retângulo em volta dela.
- **06 a 390:** título, depois a águia e o card; o botão em 2 linhas dentro do card.
- **Emendas no desktop:** uma linha fina, sem faixa preta (antes: 216–260px de véu).
- **Fim da página:** o rodapé na tela inteira, com a marca e o "Legal" no alto e a wordmark centrada na base. Nada da FAQ aparece.

Não foram feitas: o lado a lado com as fotos da Experiência (não estão no projeto), as capturas a 768, a cortina em 3 posições e o botão da 06 no hover.

## (9) O que ficou

- **Encaixe da rolagem:** só `proximity`; ver a dúvida 5.
- **Botão sem foco por teclado enquanto o `js/config.js` não tiver número:** o `a` sem `href` não recebe Tab. O `Z.manual` (7) ("Tab até o botão: anel de foco visível") só pode ser conferido com o número preenchido. Já era assim na rodada 5.
- **Trackpad, iPhone, Safari e Firefox:** não testados (R15).
- **Skills de auditoria como passes próprios** (R14) e **`vsdesign`** contra as fotos da Experiência.

## (10) Dúvidas da §12

1. **A águia.**
   - **Arquivo:** a águia do outro site da VIPZUE (`VIPZUE-SITE/assets/aguia_diagnostico.png`, 1536×1024, com alfa real). A cópia de trabalho ficou em `assets/source/secao06/aguia-diagnostico-1536x1024.png`, fora do git.
   - **Recorte e proporção:** recorte justo pelo alfa, 1477×990, proporção 0,670.
   - **A pegada:** as garras pegam a borda com `--closing-perch: 0.15` (15% da altura; ver (4)). Sem halo, conferido a 200% sobre o bege e sobre o marrom do card.
   - **Ajuste:** se a pegada não estiver como nas fotos, é só mexer no `--closing-perch`.
2. **Microcopy:** ficou exatamente como pedido (E19). Fica com a Experiência decidir se quer uma frase que ainda diga que o clique não compromete nada.
3. **06 → 07 no desktop:** apliquei a linha também aí, como o prompt manda. A decisão de manter ou voltar ao véu fica com a Experiência; voltar seria uma rodada própria (o véu tira 140–260px da altura de uma tela).
4. **Linha 05 → 06 no celular e no tablet:** aplicada em todas as larguras. Para ficar só no desktop, basta mover o `#contato::before` para dentro do `@media (min-width: 1024px)`.
5. **Encaixe da rolagem.** O `mandatory` não é viável sem mexer na Hero/02 (ver (4)). O `proximity` encaixa perto das bordas e deixa passos grandes pararem entre duas seções. A 04 passa da tela: 111% em 1440×900, 128% em 1366×768, 100% em 1920×1080. Enxugar o respiro dela seria uma decisão de desenho.
6. **Hero, 02 e 03:** nenhuma ficou com vazio. Já passam da tela (344% e 420%), então o `min-height` não as alcança.
7. **Headline da 06:** 52px no celular e no tablet; 79px (1366), 84px (1440) e 92px (1920) no desktop; 5 linhas, 49% do container. Maior ou menor fica com a Experiência.
8. **Paleta Âmbar/Terra e "escada":** fora desta rodada, como pedido.
9. **Estado pressionado do botão:** continua `translate: 0 1px`, igual à Hero. Alinhar à UI.08 (escala ≈ 0,985) fica para uma decisão da Experiência.
