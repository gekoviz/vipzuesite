# Rodada 3C — Correção e fechamento das seções 03 → 08: relatório

Publicado em produção em 02/11/2026 00:26 (UTC): fast-forward da `main` para a `feat/rodada3` (`457aab3`), feito depois da confirmação do usuário.
O primeiro push na `main` tinha sido bloqueado pelo auto mode ("Production Deploy"). Por isso os commits da rodada foram publicados de uma vez, e não um a um como pede a §2.2.

## (1) Resumo em 5 linhas

1. **Cenário (A) da §2.1.** A rodada 3 estava completa na branch `feat/rodada3`, com push, mas sem merge (o prompt anterior mandava "só branch/preview"). Não achei URL de preview: a Vercel não publica status nos commits, e os endereços `vipzuesite-git-feat-rodada3-…` dão 404.
2. **Etapa 0 em produção, com `vz-check-r3c`:**

   | Largura | PASS | FAIL | WARN | NA |
   |---|---|---|---|---|
   | 390 | 15 | 14 | 2 | 2 |
   | 768 | 12 | 13 | — | 3 |
   | 1440 | 12 | 12 | — | 4 |
   | 1366×650 | 12 | 12 | — | 4 |

   Em todas, `0.deploy` deu FAIL: `footer-curtain.js` responde 404 e o ar está antes da rodada 3.
3. **A 3C acrescentou sobre a branch três deltas:**
   - o teto de brilho `FIELD_CAP = 0,72` no shader, com o canvas escuro a 100% em vez do véu de 50% e o `--text-2` escuro a 0,88;
   - a copy e os links legais do rodapé a 88%;
   - o teto de altura da marca no `fit()`, para a cortina ligar em janela baixa.
4. **Depois, no local** (aba em primeiro plano, `preserveDrawingBuffer` forçado só no teste, ver §6):

   | Largura | PASS | FAIL | WARN | NA |
   |---|---|---|---|---|
   | 390 × 844 | 47 | 0 | 0 | 0 |
   | 768 × 1024 | 41 | 0 | 0 | 1 |
   | 1440 × 900 | 41 | 0 | 0 | 2 |
   | 1366 × 650 | 41 | 0 | 0 | 2 |

   Copy idêntica nas 5 regiões.
5. **Luz média da 04:** 66% da Hero a 390 (antes 39%), 61% a 768 e 63% a 1440. O pior contraste fica dentro do limite em todas as larguras.
6. **No endereço publicado, depois do deploy:** os mesmos números do local (47/41/41/41 PASS, 0 FAIL, 0 WARN), com `0.deploy` PASS nas 4 larguras.

## (2) Arquivos alterados

A rodada 3 já está descrita em `docs/rodada3-relatorio.md`. Abaixo, só os deltas da 3C:

- **`js/light-field.js`**
  - **Shader (§4.1a, três edições):**
    - teto suave de brilho por `u_state.z`;
    - `draw([front, soft, warp, cap = 0], …)`;
    - `uniform4f(loc.state, front, soft, cap, warp)`;
    - mais o comentário da linha 89.
    - O canvas fixo (Hero e 03) chama `draw` com 3 valores, então `cap` vale 0 e o ramo do teto nunca entra.
  - **Bloco dos campos (§4.1):**
    - `FIELD_CAP = 0.72`;
    - `FIELD_MODES.dark.state = [-1, .004, 0, FIELD_CAP]` e `light.state = [2, .004, 0, 0]`;
    - a API ganha `cap` e `fields()[].cap`.
- **`css/sections.css`**
  - **§4.2:** `.has-field[data-field="dark"]` com `--field-opacity: 1` (antes 0,5) e `--text-2: rgb(243 237 227 / .88)` (antes .85).
  - **§9.3:** `.site-footer__copy` a 88% (antes 80%) e `.has-field .footer-link` a 88% (antes 80%; ver §3).
- **`js/beam-footer.js`:** `fit()` com teto de altura (§9.4b, código do prompt sem alteração).

## (3) Ajustes em relação ao prompt, e por quê

- **Links legais do rodapé a 88%.** Esta regra não está no prompt; foi criada na rodada 3 (era 80%).
  - Com o campo do rodapé a 100%, "Política de Privacidade" e "Termos de Uso" mediram 4,47:1 a 1366×650, abaixo do mínimo de 4,5:1.
  - Subiram para 88%, a mesma regra da copy (§9.3), e passaram. A cor do texto foi ajustada; o campo não mudou (§4.3).
  - A especificidade é baixa (0,2,0) para o hover/foco continuar acendendo para `--bf-ink` quando os links tiverem destino.
- **`FIELD_CAP` sem mudança:** 0,72, como no prompt.
- **Já estava aplicado (rodada 3):** divisa, headline, 05/06, FAQ e cortina. Não reapliquei nada; o script confirma (§5).

## (4) Exceções registradas (UI.20)

Formato: regra quebrada · o que muda · por que existe · função que resolve · vale só para.

| # | Regra quebrada | O que muda | Por que existe | Função que resolve | Vale só para |
|---|---|---|---|---|---|
| E1 | UI.12 Footer: fundo bege, claro e simples | fundo escuro (campo da Hero), wordmark gigante com feixe, cortina de entrada | decisão da Experiência (rodada 3) | fecha a página com a marca em destaque, no mesmo fundo da abertura | rodapé |
| E2 | Alinhamento centralizado só com intenção clara (L1796–1803) | título e lista da FAQ centralizados em coluna única de 768px | estrutura do componente de referência pedido | leitura de FAQ curta, uma coluna | Seção 07 |
| E3 | Blur extremamente restrito (L1963–1994) | desfoque de 6px → 0 nas palavras do título da FAQ, 0,4s, uma vez | efeito de entrada do componente de referência | leitura em sequência do título | Seção 07 (`.faq__word`) |
| E4 | Movimento ligado à rolagem só com função clara (L2848, L3665–3670) | rodapé em cortina (`position: fixed` + `clip-path`) | pedido da Experiência | revela o rodapé sem nova camada de transição | rodapé |
| E5 | Cor de texto secundário = token (`--text-2`) | grafite a 0,92 (claro) e marfim a 0,88 (escuro) nas seções com campo | contraste medido no canvas: o token reprova nos pontos extremos | manter ≥ 4,5:1 | Seções 04–08 com campo |
| E6 | Botão primário em contexto escuro = `.btn--primary-dark` | ShinyButton da Hero no CTA final | pedido: o botão do 06 igual ao da Hero | consistência do CTA principal | Seção 06 |
| E7 | Margem da página de 24px no celular | título da 04 a 18px (−6px) | alinhamento óptico pedido ("um pouco mais à esquerda") | peso do título grande junto à águia | Seção 04, só celular |
| E8 | Campo de luz de uma seção fora da Hero e da 03 | 05, 06, 07 e rodapé com canvas próprio | o padrão principal/secundário pedido | fundos iguais aos da Hero e da 03, sem aproximação | Seções 05–08 |
| E9 | O fundo "igual ao da Hero" é o campo da Hero sem alteração | campo escuro com teto de brilho (luz máxima L ≈ 0,11) | texto pequeno ≥ 4,5:1 em qualquer ponto do campo; a Hero a 100% dá 2,8:1 no foco mais claro | `FIELD_CAP` no shader (`u_state.z`) | Seções 04, 06 e rodapé |
| E10 | Opacidade dos links do rodapé (78%) | links legais a 88% sobre o campo | 4,47:1 medido a 1366×650 a 80% | manter ≥ 4,5:1 | rodapé com campo |

Nenhuma exceção entrou nos tokens nem nos componentes-base.

## (5) Registro de conformidade

Medido no endereço publicado (https://vipzuesite.vercel.app/) depois do deploy. Os números são iguais aos do local.

| # | Item | Resultado | Evidência |
|---|---|---|---|
| C1 | Deploy da rodada em produção | PASS | `curl -sI …/js/footer-curtain.js` dá HTTP 200; o `index.html` tem Last-Modified 02/11/2026 00:26:05 GMT; `0.deploy` PASS no endereço publicado nas 4 larguras. |
| C2 | 5 campos, ≤ 6 canvases | PASS | `1.api` 5 campos; `1.contextos` 6 canvases; `1.visiveis` ≤ 2 |
| C3 | 04 com o fundo da Hero (teto) | PASS | `1b.teto` 0,72 nos 3 escuros; `1b.escuro~hero` 66% / 61% / 63% / 67% (390 / 768 / 1440 / 1366) |
| C4 | 05 com o fundo da 03 | PASS | `1b.claro=03` 0,0 níveis (limite 14) |
| C5 | 06 com o fundo da Hero | PASS | `1b.escuro=escuro` 0,0 níveis (limite 10) |
| C6 | FAQ com o fundo da 03, `surface-beige` | PASS | `1b.claro=03` 0,0; `1.#faq` light, fundo de reserva rgb(184 170 150) |
| C7 | Rodapé com o fundo da Hero | PASS | `1.[data-beam-footer]` dark; `1.canvas-rodape` = altura do rodapé |
| C8 | Divisa 03 → 04 no celular | PASS | `3.veu` 186/72px (390) e 200/72px (768); `3.aguia-por-cima` z 2 > véu 1; `3.irmao` |
| C9 | Headline da 04 no celular | PASS | `3.padding-topo` 148,1px (era 189,1); `3.respiro` 25px; `3.headline-x` 18,0px; `3.fiapo` com folga de 10px |
| C10 | Botão da 06 = Hero | PASS | `4.igual-hero` com 66 propriedades iguais nas 4 larguras; `4.cabe`; `4.cta` |
| C11 | FAQ | PASS | `5.*`: 6 itens, 2 palavras, um aberto por vez, chevron −1, ArrowDown |
| C12 | Rodapé: marca, rótulos, sobre o campo | PASS | `6.wordmark` (88% a 390, 84% a 1440, 74% a 1366×650); `6.rotulos` Champagne claro; `6.preenchimento` |
| C13 | Cortina (também em janela baixa) | PASS | `6.cortina-estado` / `6.cabe-na-tela`: 450px em 844 (390), 684px em 900 (1440), 624px em 650 (1366). A 1280×600: 576px em 600, cortina ligada. |
| C14 | Contraste ≥ 4,5:1 (3:1 grande) | PASS | `2.contraste`: 45 / 45 / 33 / 33 textos, 0 abaixo do limite |
| C15 | Só a 03 tem véu | PASS | `7.sem-veu`; `7.contiguas` com vãos de 0px |
| C16 | Sem rolagem horizontal | PASS | `8.overflow`: 390 = 390, 768 = 768; 1425 em 1440 e 1351 em 1366 (a barra de rolagem é a diferença) |
| C17 | Copy intacta | PASS | `9.copy`: idêntica à linha de base nas 5 regiões, nas 4 larguras |

## (6) `vz-check-r3c.js`: antes e depois

| Largura | Antes (produção, Etapa 0) | Depois (produção, após o deploy; igual ao local) |
|---|---|---|
| 390 × 844 | 15 PASS · 14 FAIL · 2 WARN · 2 NA | **47 PASS** |
| 768 × 1024 | 12 PASS · 13 FAIL · 3 NA | **41 PASS · 1 NA** |
| 1440 × 900 | 12 PASS · 12 FAIL · 4 NA | **41 PASS · 2 NA** |
| 1366 × 650 | 12 PASS · 12 FAIL · 4 NA | **41 PASS · 2 NA** |

Os NA que restam são os que o próprio script explica:
- `3.headline` só vale até 767px;
- `3.aguia-por-cima` não se aplica no desktop, onde a divisa não tem a águia em voo.

**Limite do script nesta máquina.** O script lê o canvas com `drawImage`, mas os campos são criados sem `preserveDrawingBuffer`. No Chrome com GPU (esta máquina), essa leitura volta preta:
- a luz da Hero sai 0;
- `1b.escuro~hero` dá NaN;
- `1b.claro=03` compara preto com preto;
- `2.contraste` reprova falsamente 22 textos claros.

Por isso, a rodada "depois" recarregou a página com um script de inicialização que força `preserveDrawingBuffer: true` só no teste; o código do site não mudou. Imagino que o prompt tenha sido medido com WebGL por software (SwiftShader), onde a leitura funciona. **Ao rodar no endereço publicado num navegador com GPU, use o mesmo ajuste,** ou os itens de pixel não valem.

## (7) Capturas

Feitas durante a validação (sem arquivo no repositório): a 04 a 390 com o campo a 100% e teto, mostrando o bronze quente da Hero e o texto legível. As capturas da rodada 3 estão listadas em `docs/rodada3-relatorio.md`.

**Não feitas:**
- a série completa antes/depois da §13.3;
- a sequência de fundos rolando devagar da §13.2 (que o script mede em `1b.*`);
- a comparação visual Hero/03 antes/depois do shader. Por construção, `cap = 0` no canvas fixo não entra no ramo do teto.

## (8) O que ficou

- **iPhone/Safari real:** não testado. Pontos de risco:
  - o `fixed` dentro de `clip-path`;
  - a barra de endereço que encolhe;
  - o limite de 6 contextos WebGL (a página tem exatamente 6).
- **Não testados nesta rodada:** rolagem longa em aparelho, bfcache e rotação. As skills de auditoria (§13.10) também não foram rodadas.
- **Botão da 06 sem número no `config.js`:** aparência ativa, não clicável.
- **"Mais à esquerda":** título a −6px (x = 18), subheadline no eixo de 24px.

## (9) Dúvidas para a Estratégia/Experiência

1. **Botão da 06 sem número:** manter a aparência ativa ou mostrar um estado "indisponível"?
2. **Links legais a 88% (E10):** de acordo?
3. **Script de checagem:** incluir o `preserveDrawingBuffer` no próprio script (ou ler o canvas dentro do quadro de desenho), para os itens de pixel valerem em navegador com GPU?
