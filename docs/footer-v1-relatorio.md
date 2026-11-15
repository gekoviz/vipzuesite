# Footer V1.0 — relatório

Data: 15/11/2026 · Prompt: `VIPZUE_Prompt_Mestre_Footer.txt` · Referência aprovada: imagem 31 (1536×865), comparada no mesmo tamanho

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | O `<footer>` foi refeito: duas colunas de texto, camada `.vz-foot__bg` e assinatura `.vz-foot__mark`. Saíram os ícones, os containers quadrados, as camadas do feixe e a wordmark letra a letra. O `<script src="js/beam-footer.js">` deixou de carregar (o arquivo fica no projeto) |
| `css/sections.css` | O bloco "08 — Footer · V1.0" substitui o "08 — Footer (UI.12)". O bloco da rodada 6 virou só um aviso, porque a altura de tela e o lvh do celular passaram para o bloco novo. Saíram também as regras de celular da grade antiga do rodapé |

Ficaram como estavam: Hero, Deep Zoom, Método, Para quem é, CTA, FAQ, a cortina do rodapé (`js/footer-curtain.js` e o bloco "Rodapé em cortina"), `js/sections.js`, `js/config.js` e as páginas legais.

O rodapé deixou de ter o atributo `data-beam-footer`. Por isso:
- `js/light-field.js` não cria mais o campo WebGL antigo dele. O arquivo não mudou, só não acha o seletor;
- `js/beam-footer.js` não roda.

## 2. Background reutilizado

O rodapé usa o mesmo sistema da CTA final e da FAQ, sem dependência nova:

- **Jade Sky:** a receita V4 de `css/vz-atmosphere.css`, sem mudança. Os focos ficam no `.site-footer.vz-foot`: A em 0% 0%, B em 46% 102%, C em 63% 40% e D Mocha difuso.
- **Paper MeshGradient:** a instância do pool de `js/vz-atmosphere.js`, a 0,14. Não há contexto WebGL novo: o rodapé tem um canvas, e o pool pausa fora da tela e com movimento reduzido.
- **Luz Páprica local** (`.vz-foot__bg::before`): os três focos da referência, em tokens Páprica e Páprica Profunda:
  - canto superior esquerdo, 0% 0%, intenso;
  - centro-direita, 63% 41%, difuso;
  - pé, 45% 100%, o mais intenso, subindo para a assinatura.
- Abaixo de 1024 px as luzes têm geometria própria em elipses largas, porque em % de uma coluna alta virariam faixas.
- Sem arcos, anéis, feixe nem faixas.

## 3. Grade

A grade fica no `.vz-foot__bg::after`, com a mesma técnica da CTA e da FAQ:
- duas `linear-gradient` de 1 px em Grafite Quente `#22201D`, sem pontos nas interseções;
- passo de 56 px, como o prompt pede (48 px no tablet, 44 px no celular);
- opacidade composta de cerca de 14%: some no escuro e só aparece sobre a luz;
- cobre o rodapé inteiro, com `pointer-events: none`;
- ordem das camadas: base → Jade/Paper → luz → grade → texto e assinatura.

## 4. Duas colunas

`.vz-foot__cols` é um CSS Grid de duas colunas:
- a esquerda começa em 6,25vw;
- a direita começa em 63,8vw, com largura `calc(63.8vw − 6.25vw)`.

As duas colunas são grids de linhas com o mesmo passo fixo (`--vz-foot-row`: 56 px; 44 no tablet). O `<ul>` da coluna Legal usa `display: contents`, então "Legal", "Política" e "Termos" ocupam as linhas 1–3. O alinhamento vem da construção, não de margens: o teste mede Δ 0 px nos três pares.

A 4ª linha ("Todos os direitos reservados.") existe só na esquerda.

O texto é Switzer 400, 21,4 px, line-height 1,3, −0,015em, em Marfim `#F3EDE3`, sem negrito, itálico ou ícones. O hover só muda a cor, e o foco tem contorno Marfim de 2 px.

No celular é uma coluna, na ordem do prompt, com 22 px entre itens e 38 px entre os grupos.

## 5. Destinos

| Item | Destino |
|---|---|
| Contato | `href="#contato"` + `data-cta="whatsapp"`, o mesmo mecanismo dos CTAs da Hero e do menu. Quando o número de WhatsApp for preenchido em `js/config.js`, o link passa a abrir o WhatsApp sozinho |
| Instagram | `data-link="instagram"`. **Pendente:** `js/config.js` ainda não tem o perfil, então o item fica visível, sem link e sem foco. Nada foi inventado |
| Política de Privacidade | `/privacidade`, a página que existe. A rota `/politica-de-privacidade` do prompt não existe, e mantive a real |
| Termos de Uso | `/termos-de-uso` |

As duas páginas legais respondem 200.

"Legal" é o rótulo da coluna (um `<p>` que nomeia o `<nav>`), não um link.

## 6. Assinatura

Mantive a forma de sempre:
- a mesma Gloock e o mesmo espaçamento −0,02em da wordmark anterior;
- agora num único `<p aria-hidden="true">`, porque a marca já é lida em "© 2026 VIPZUE".

| | Referência | Render |
|---|---|---|
| Tinta: x | 80–1430 | 80–1446 |
| Largura | — | 1350 px de avanço = 87,9% |
| Altura das capitulares | 303 px | 305 px |

A assinatura fica centrada e com a base a cerca de 6% da altura.

**Cor:** gradiente recortado no texto (`background-clip: text`):
- `#6A180A`/`#7B1D0C` nas pontas e `#A7250D` no meio;
- um foco `#D3310B`/laranja onde a luz do pé sobe (em torno de P–Z–U);
- um reflexo leve vindo do foco da direita.

Sem contorno, `text-shadow` ou animação, e com `pointer-events: none`.

## 7. Comparação com a referência (1536×865, medida em pixels)

| Medida | Referência | Render |
|---|---|---|
| Linhas, topo das capitulares | 122 · 177 · 233 · 291 | 123 · 178 · 235 · 292 |
| Coluna esquerda: x | 96 | 97 |
| Coluna direita: x | 981 | 982 |
| "Todos os direitos reservados." | x 96–368 | x 97–367 |
| Assinatura | x 80–1430, y 507–810 | ver § 6 |

Capturas em `docs/qa/footer-v1/` (pasta fora do git):

| Arquivo | Conteúdo |
|---|---|
| `antes/` | Estado anterior |
| `r3/`, `r4/` | Render final |
| `comparacao-1536.jpg` | Referência × render |
| `folha-desktop.jpg`, `folha-celular.jpg` | Folhas de viewports |
| `referencia-31.webp` | A referência |

## 8. Testes

| Teste | Resultado |
|---|---|
| `t95-footfunc` 1536×865, 1280×720, 768×1024, 390×844 e movimento reduzido | Tudo PASS |
| Capturas 1536×865, 1440×900, 1280×720, 1024×768, 768×1024, 390×844, 375×812 | Overflow 0, cortina ligada, um canvas, console limpo |
| Contraste `t20` no rodapé (4 viewports) | Os 28 textos reais passam de 4,5:1 (mínimo cerca de 12:1) |
| `t19-func` | 15/15 (1440) e 18/18 (390) |
| `t32-func` (Hero) | TUDO OK |
| `t85-faqfunc` (FAQ) | 11/11 |
| `t75-ctafunc` (CTA) | 9/10; o "falho" está explicado abaixo |
| Build `tools/build-site.mjs` | OK |

O `t95-footfunc` cobre:
- textos literais e ordem;
- nenhum ícone, imagem ou botão;
- destinos e páginas legais com 200;
- pares de linhas alinhados;
- fonte, peso e cor;
- assinatura Gloock com 85–91% da largura, centrada e sem tocar nos textos;
- sem overflow e sem barra de rolagem interna (`overflow: clip`);
- Tab com foco visível;
- Paper do pool sem o campo WebGL antigo;
- grade presente;
- camadas sem clique;
- `inert` enquanto a cortina cobre o rodapé;
- console.

**Contraste da assinatura:** o `t20` mede a assinatura como 1:1. Ela pinta com `-webkit-text-fill-color: transparent` e o gradiente recortado, então o script lê a cor transparente. É decorativa (`aria-hidden`), e logotipos também ficam fora do critério de contraste.

**Sobre o t75:** o assert 5 volta a acusar um canvas a mais ao voltar à CTA. É o pool usando a 2ª vaga (FAQ e rodapé na tela ao mesmo tempo), dentro do teto de 2, o mesmo caso já explicado no relatório da FAQ.

## 9. Diferenças e pendências

- **Saturação:** a luz da referência é um laranja-vermelho muito saturado. O sistema usa os tokens Páprica e Páprica Profunda, como na CTA e na FAQ, e a luz fica mais "pêssego" que a imagem. A assinatura usa os HEX de referência do prompt.
- **Manchas do Paper:** o shader desenha manchas escuras móveis, discretas a 0,14, que não existem na imagem estática.
- **Altura:** o rodapé tem no mínimo uma tela (`max(720px, 100svh)`; `100lvh` no celular), para a cortina e o "uma seção por tela". Em telas altas a assinatura continua na base e o espaço do meio cresce.
- **Celular e tablet:** a assinatura fica em 88% da largura, então a altura dela é bem menor que no desktop e o meio fica mais vazio.
- **Pendentes:** perfil do Instagram e número do WhatsApp em `js/config.js`; conferir num iPhone real.
