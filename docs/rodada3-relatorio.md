# Rodada 3 — Seções 04 a 08: relatório

Branch `feat/rodada3`, a partir da `main` em `abe1b2e`. Nada foi para a `main`; a decisão do merge fica com quem escreveu o prompt.
Commits, na ordem da §14 (mais uma correção de contraste, entre o 5 e o 6):

| # | Commit | Escopo |
|---|---|---|
| 1 | `d88e06a` feat(campos): campo de luz por seção (04 a 08) e CSS dos fundos | §4 |
| 2 | `4fa7685` fix(divisa): véu 03 → 04 no celular e tablet; headline da 04 sobe | §5 |
| 3 | `80f9a0f` feat(s5-s6): fundo claro na 05; fundo escuro e ShinyButton na 06 | §6–7 |
| 4 | `30d41b0` feat(s7): FAQ no padrão 21st.dev (entradas, accordion único) | §8 |
| 5 | `4d1a87c` feat(s8): rodapé sobre o campo da Hero, marca legível, cortina | §9 |
| 5a | `bcb1231` fix(s8): links legais do rodapé a 80% (contraste ≥ 4,5:1 sobre o campo a 768px) | §9.6 |
| 6 | docs: exceções E1–E8 e relatório da rodada 3 | §12, §14 |

## (1) Resumo em 5 linhas

1. As seções 04, 05, 06, FAQ e rodapé ganharam campo de luz próprio: 5 canvases registrados, escuro na 04, 06 e rodapé, e claro na 05 e na FAQ.
2. A divisa 03 → 04 tem véu em todas as larguras. No celular (390) a headline da 04 subiu de 189,1px para 148,1px de padding-top, com 25px de respiro abaixo do corpo da águia.
3. O CTA da 06 virou o ShinyButton da Hero, e a FAQ foi portada do 21st.dev: título por palavra, lista que sobe e accordion com um item aberto por vez.
4. O rodapé fica sobre o campo escuro. A marca está legível em repouso (champagne de 36% a 9%) e o rodapé entra em cortina (fixo + clip-path), com `inert` enquanto está coberto.
5. No `vz-check-r3.js`, o resultado foi de 11/12/14 PASS para 33/34/40 PASS em 1440/768/390. Restam 2/1/1 FAIL, todos falsos positivos do script (explicados na §5), e a copy ficou idêntica nas 5 regiões.

## (2) Arquivos alterados

- **`js/light-field.js`**
  - O bloco das linhas 292–450 foi trocado pelo do prompt: `FIELD_SECTIONS`, `FIELD_MODES` dark/light e um campo por seção.
  - O rodapé é observado pelo invólucro da cortina.
  - Expõe `window.__vzLightField.fields()`.
- **`css/sections.css`**
  - Fundos `.has-field[data-field=dark|light]` (§4.2).
  - Véu da 03 em todas as larguras e a regra da headline da 04 no celular, com `--why-seam-clear` 0,47, título −6px e 10,2vw abaixo de 392px (§5).
  - `.closing__cta` (§7).
  - Bloco da FAQ trocado; saíram `@keyframes panel-in` e as regras antigas do accordion na media de 1023px e no movimento reduzido (§8).
  - Rodapé sobre o campo (§9.3), links legais a 80% (5a) e a cortina no fim do arquivo (§9.5).
- **`index.html`**
  - `#faq` passou a `surface-beige`.
  - Título com `data-faq-title`; lista com `faq__list` e sem `data-reveal`.
  - Os 6 ícones viraram chevron, e cada resposta ficou dentro de `.accordion__panel-in`.
  - O botão do 06 passou a `.shiny-cta`.
  - Invólucro `.footer-curtain` em volta do `<footer>` (inalterado por dentro) e `<script src="js/footer-curtain.js" defer>`.
- **`js/sections.js`**: o bloco "FAQ: accordion acessível" foi trocado pelo porte do prompt (§8.4).
- **`js/beam-footer.js`**: `.observe(root)` passou a `.observe(root.closest("[data-footer-curtain]") || root)` (§9.4).
- **`js/footer-curtain.js`** (novo): o código da §9.5, sem alteração.

`config.js`, textos, imagens, fontes, tokens, Hero, S02, S03 (exceto o véu) e menu não foram tocados.

## (3) O que ajustei em relação ao prompt, e por quê

- **`defer` no script da cortina.** A §9.5 mostra `<script src="js/footer-curtain.js"></script>` sem `defer`. Como todos os outros scripts do fim do `<body>` são `defer`, um script sem ele rodaria antes do `beam-footer.js`. Com `defer`, a ordem pedida ("depois de beam-footer.js") se mantém.
- **Links legais do rodapé a 80% (commit 5a).** A 768×1024, "Política de Privacidade" (marfim a 78%) mediu 4,49:1 sobre o foco mais claro do campo, abaixo do mínimo de 4,5. Passou a 80%, igual à copy da §9.3.
  - A regra usa `.has-field .footer-link` (especificidade 0,2,0) de propósito. Assim o hover e o foco (`.footer-link[href]:hover`) continuam acendendo para `--bf-ink` quando os links tiverem destino.
- **Divisões de bloco.** As regras antigas da FAQ que o bloco novo tornava mortas foram removidas:
  - `.faq__title` / `.accordion` na media de 1023px;
  - a margem do título;
  - a animação e o movimento reduzido do accordion antigo, incluindo o `@media` que ficou vazio.
- **Botão do 06 abaixo de 380px.** A 320px o botão tem 279px numa coluna de 272px. Por isso, abaixo de 380px o texto pode quebrar (`white-space: normal`, centralizado). A 390 ele cabe em uma linha (24–336px numa coluna de 24–366px).

## (4) Exceções registradas (UI.20)

Formato: regra quebrada · o que muda · por que existe · função que resolve · vale só para.

| # | Regra quebrada | O que muda | Por que existe | Função que resolve | Vale só para |
|---|---|---|---|---|---|
| E1 | UI.12 Footer: fundo bege, claro e simples | fundo escuro (campo da Hero), wordmark gigante com feixe, cortina de entrada | decisão da Experiência (rodada 3) | fecha a página com a marca em destaque, no mesmo fundo da abertura | rodapé |
| E2 | Alinhamento centralizado só com intenção clara (L1796–1803) | título e lista da FAQ centralizados em coluna única de 768px | estrutura do componente de referência pedido | leitura de FAQ curta, uma coluna | Seção 07 |
| E3 | Blur extremamente restrito: só overlays/menus/modais (L1963–1994) | desfoque de 6px → 0 nas palavras do título da FAQ, 0,4s, uma vez | efeito de entrada do componente de referência | leitura em sequência do título | Seção 07 (`.faq__word`) |
| E4 | Movimento ligado à rolagem só com função clara (L2848, L3665–3670) | rodapé em cortina (`position: fixed` + `clip-path`) | pedido da Experiência | revela o rodapé sem nova camada de transição | rodapé |
| E5 | Cor de texto secundário = token (`--text-2`) | grafite a 0,92 (claro) e marfim a 0,85 (escuro) nas seções com campo | contraste medido no canvas: o token reprova nos pontos extremos | manter ≥ 4,5:1 | Seções 04–08 com campo |
| E6 | Botão primário em contexto escuro = `.btn--primary-dark` | ShinyButton da Hero no CTA final | pedido: o botão do 06 igual ao da Hero | consistência do CTA principal | Seção 06 |
| E7 | Margem da página de 24px no celular | título da 04 a 18px (−6px) | alinhamento óptico pedido ("um pouco mais à esquerda") | peso do título grande junto à águia | Seção 04, só celular |
| E8 | Campo de luz de uma seção fora da Hero e da 03 | 05, 06, 07 e rodapé com canvas próprio | o padrão principal/secundário pedido | fundos iguais aos da Hero e da 03, sem aproximação | Seções 05–08 |
| E9 | Opacidade dos links do rodapé (78%) | links legais a 80% sobre o campo | 4,49:1 medido a 768px no foco mais claro | manter ≥ 4,5:1 | rodapé com campo |

Nenhuma exceção entrou nos tokens nem nos componentes-base.

## (5) `vz-check-r3.js`: antes e depois

Rodado no site local (Chrome via DevTools, aba visível, página na frente a ~60 fps), com `window.__vzCopyBaseline` preenchido com a impressão digital de antes.

| Largura | Antes (local = publicado) | Depois |
|---|---|---|
| 1440 × 900 | 11 PASS · 12 FAIL · 2 NA | **33 PASS · 2 FAIL · 1 NA** |
| 768 × 1024 | 11 PASS · 12 FAIL · 2 NA | **34 PASS · 1 FAIL · 1 NA** |
| 390 × 844 | 14 PASS · 13 FAIL · 2 WARN · 1 NA | **40 PASS · 1 FAIL** |

FAILs e NAs que restam:

- **`4.igual-hero` — FAIL nas três larguras, "difere em: ::afterheight". É falso positivo.**
  - O `::after` do `.shiny-cta` (css/base.css:316) é um quadrado com `width: 100%; aspect-ratio: 1`. A altura dele segue a largura do botão, e a largura segue o texto.
  - O texto do 06 é mais longo que o da Hero. A 1440 os `::after` medem 379,9px e 330,8px.
  - Todas as outras 65 propriedades comparadas são iguais (CSS idêntico), incluindo a altura dos botões (56,8px nos dois).
  - O script aceita `height` como WARN, mas a regex dele não cobre o prefixo `::after`.
- **`3.aguia-por-cima` — FAIL só a 1440, "z-index da águia auto · véu 1". É falso positivo.**
  - A partir de 1024px a águia da divisa é `display: none` (css/sections.css, "Águia da divisa: só abaixo de 1024px"): no desktop não há águia na divisa.
  - A 768 e a 390 o item passa (águia 2, véu 1).
- **`3.headline` — NA a 1440 e 768.** A regra vale só até 767px; a 390 todos os itens da headline passam.

Linhas que mudaram, a 390: padding-top da 04 de 189,1 → 148,1px; fiapo livre (folga de 10px); respiro de 25px (alvo 20–60); headline em x = 18,0px; subheadline em x = 24,0px; título 39,8px em 2 linhas; véu de 186/72px.

### Medições que precisaram de correção do ambiente

- **Aba escondida.** No painel embutido do app, a aba ficou `visibilityState: hidden` e o Chrome do DevTools ficou a 2 fps com a janela encoberta. Nos dois casos as transições não andam, então `5.unico-aberto` e `5.chevron-180` falharam por tempo. Com a página na frente (61 fps), passam nas três larguras.
- **Contraste lido como preto.**
  - O canvas é criado sem `preserveDrawingBuffer`, então o `drawImage` do script lê o buffer já limpo: o canvas inteiro vem preto (luminância 0,000). As seções escuras "passavam" por acaso e as claras reprovavam a 1,29:1.
  - Para medir o campo de verdade, os testes recarregaram a página com um script de inicialização que liga `preserveDrawingBuffer` só no teste. Nada no código do projeto mudou.
  - Com isso, a medição seção a seção (cada uma na tela, esperando o campo desenhar) dá, a 1440:

    | Seção | Luminância do canvas | Textos | Pior razão |
    |---|---|---|---|
    | 04 | 0,006–0,099 | 2 | 6,45:1 |
    | 05 | 0,286–0,720 | 14 | 4,81:1 |
    | 06 | 0,006–0,098 | 4 | 5,08:1 |
    | FAQ | 0,286–0,720 | 8 | 5,71:1 |
    | rodapé | 0,006–0,091 | 3 | 5,36:1 |

  - No script oficial, `2.contraste` passa nas três larguras: 33 textos a 1440, 45 a 768 e 45 a 390, todos com 0 abaixo do limite. A 768 isso vale depois do commit 5a.
- **Sugestão para o script:** mantê-lo como está e documentar que exige `preserveDrawingBuffer` (ou ler o canvas dentro do quadro de desenho).

### Outros testes

- **Copy:** `9.copy` deu "texto idêntico à linha de base em todas as regiões" nas três larguras.
- **Movimento reduzido (390):**
  - `has-curtain` false, rodapé `position: relative` em fluxo, `data-in="true"`, `inert` false.
  - A FAQ não é dividida em palavras (0 `.faq__word`; o título lê "Perguntas frequentes"), a lista tem opacidade 1 e a transição do painel é de 0s.
  - Os 5 campos continuam existindo.
- **Sem WebGL (390, `getContext('webgl')` → null no teste):**
  - Nenhum campo e nenhum canvas.
  - Fundos sólidos: 04 rgb(34 32 29), 05 rgb(184 170 150), 06 rgb(20 18 16), FAQ rgb(184 170 150), rodapé rgb(20 18 16). No rodapé a lavagem original volta a aparecer.
  - Console sem erros nem avisos.
- **Cortina:** altura do rodapé de 684px a 1440×900 (o prompt previa 683), 455px a 768 e 450px a 390.
  - Fim da página: rodapé inteiro, 394–844px a 390 e 216–900px a 1440.
  - Rodapé coberto: `inert`.
  - FAQ subindo sobre o rodapé parado (390): rodapé em top 394, invólucro em top 694.
- **Accordion (390):** abrir #1 deixa 1 aberto; abrir #3 fecha #2; clicar no aberto fecha todos.
  - ArrowDown e End movem o foco.
  - Painel aberto com 178px; chevron em matrix(−1…) quando aberto.
- **Overflow:** scrollWidth 390/768 e 1425 a 1440 (a barra de rolagem é a diferença).

## (6) Capturas

Feitas durante a validação, sem arquivo no repositório:

- FAQ a 390 com o 1º item aberto;
- cortina a 390 no meio da rolagem (FAQ saindo, rodapé parado por baixo);
- rodapé a 390 no fim da página;
- rodapé a 1440 no fim da página (wordmark legível, 84% da largura).

**Não feitas:** a série antes/depois completa nas três larguras pedida na §13.2 (divisa, 04 inteira, 05, 06 lado a lado com a Hero, feixe passando, cortina em três posições).

Da divisa do desktop, o script confirma o véu de 270/96px a 1440 (mesmas regras e stops de antes). A comparação visual pixel a pixel antes/depois não foi feita.

## (7) O que ficou

- **iPhone/Safari real:** não testado (sem aparelho). Pontos de risco:
  - `position: fixed` dentro de `clip-path`;
  - a barra de endereço que encolhe;
  - o teto de 6 contextos WebGL (a página tem exatamente 6).
  - Se a cortina trepidar no celular, a saída prevista na §9.5 é `&& matchMedia("(min-width: 768px)").matches` no `apply()`.
- **Desempenho em aparelho e rolagem longa de ponta a ponta duas vezes** (§13.6): não feitos em aparelho; em emulação não houve `webglcontextlost` nem erro de console.
- **Botão "voltar" (bfcache) e rotação do aparelho** (§9.5): não testados.
- **Skills de auditoria** (contrast, seam, overflow, deadspace, responsive, a11y, anim-lint, spec-check, vsdesign — §13.8): não rodadas nesta rodada.
- **Site publicado:** a validação foi só no local, por decisão do usuário (01/11/2026). A branch está no GitHub, mas a Vercel não publica status nos commits e não foi achada URL de prévia; o script não rodou numa versão publicada.
- **Botão do 06 sem número de WhatsApp:** tem a aparência ativa da Hero, mas não é clicável (`aria-disabled="true"`, `cursor: default`) até o `config.js` ter o número.
- **"Mais à esquerda" (headline da 04):** interpretado como −6px de alinhamento óptico só no título (x = 18px), com a subheadline no eixo de 24px. O ajuste é feito por `--why-title-shift`.

## (8) Dúvidas para a Estratégia/Experiência

1. **Botão do 06 sem número:** manter a aparência ativa ou mostrar um estado "indisponível" visível até haver número (regra de duas linhas)?
2. **Links legais do rodapé:** subi para 80% (E9). Prefere mais contraste (85%, como `--text-2` escuro) ou manter 80%?
3. **Script de checagem:** ajustar `4.igual-hero` (aceitar `::after` height) e `3.aguia-por-cima` (NA quando a águia está `display: none`)?
