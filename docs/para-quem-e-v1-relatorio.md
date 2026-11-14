# Seção "Para quem é" V1 — relatório

Data: 14/11/2026 · Prompt: `VIPZUE_PROMPT_MESTRE_PARA_QUEM_E_V1.txt` · Referência aprovada: imagem 28 (1688×932)

## O que mudou

A antiga seção de cards (`.pq*`) foi substituída inteira pela composição editorial escura. O `#para-quem-e` e os dois links do cabeçalho continuam os mesmos.

| Arquivo | Mudança |
|---|---|
| `index.html` | Markup novo da seção: headline, tríade, painel da águia, título, parágrafo, CTA e as duas curvas em SVG |
| `css/sections.css` | Bloco "05 — Para quem é · V1" (no lugar de "cards rodada 4"): base, celular, tablet (768–1179) e desktop (≥ 1180) |
| `css/fonts.css` | Só o comentário: a família "Switzer S4" (700/600/400) agora também serve à headline desta seção |
| `js/light-field.js` | `#para-quem-e` saiu de `FIELD_SECTIONS`. A seção tem um só canvas, o Paper da atmosfera, em vez de dois |
| `assets/aguia-visor-786.webp` | Novo, 786×372, 56 KB |

## Copy (literal, conferida por teste)

- H2: "Negócios diferentes." / "Páginas com propósitos." (Switzer 700)
- Tríade: Inovação · Tecnologia · Experiência (400)
- H3: "A estratégia começa" / "no seu negócio." (400)
- Parágrafo: "Entendemos o que você oferece, para quem e com qual objetivo. A partir disso, criamos uma página que comunica seu valor, esclarece dúvidas e facilita o seu processo." (400)
- CTA: "Fale sobre seu projeto" + seta Páprica (600)

## Decisões e pendências

1. **Águia provisória (recortada da referência).** Não havia um arquivo da águia com visor em alta. O painel usa um recorte da própria referência aprovada (x 294–1080, y 368–740), sem IA e sem a águia da Hero. **Pendente:** substituir pelo arquivo original em alta. Basta trocar o `assets/aguia-visor-786.webp`, de preferência por um de 1572×744 (2×) com `srcset`.
2. **Fundo.** Reusa a atmosfera V4 (Jade + Paper vivo), calibrada para o preto-vinho da referência:
   - A forte no canto superior esquerdo;
   - B e D discretos;
   - C desligado;
   - Paper a 10 %;
   - base `#140806` com as bordas em `#1A100C`, a sombra das vizinhas, para a emenda não marcar.

   As variáveis usam `#para-quem-e.vz-aud`, porque o preset `[data-vz-atmosphere="dark"]` vem depois no CSS e, só com a classe, as anulava.
3. **Curvas de luz.** São SVG com halo, brilho e núcleo, e moram dentro do `.vz-aud__inner`, que escala só pela largura como o texto. Assim nunca cruzam a headline, o CTA ou a águia (conferido de 1180 a 1920). **Abaixo de 1180 px as curvas ficam escondidas**, porque nessa grade cruzariam a headline e o CTA.
4. **CTA.**
   - Mesma regra dos outros CTAs: `href="#contato"` + `data-cta="whatsapp"`. Vira wa.me quando o número for preenchido em `js/config.js`.
   - O projeto não tem analytics.
   - Área de toque ampliada para 44 px por um pseudo-elemento, sem mudar o layout.
5. **Headline no celular.** As duas linhas são fixas, com `clamp(26px, 7,9vw, 42px)`, para "Páginas com propósitos." caber em uma linha de 360 a 767 px.

## QA (local, Chrome headless)

**Ajuste à referência em 1536×848** (medido pela tinta): headline, tríade, painel, título, parágrafo e CTA ficam a até 5 px da referência. A seção mede 848 px de altura. Comparação: `docs/qa/para-quem-e-v1/comparacao-1536.jpg`.

**Viewports:** 1920×1080, 1536×848, 1440×900, 1366×768, 1280×800, 1180×820, 1024×768, 820×1180, 768×1024, 430/414/393/390/375/360 (celular).
- Overflow horizontal 0 em todos.
- Console sem erros.
- Um canvas vivo na seção.

Folhas: `folha-desktop.jpg`, `folha-tablet.jpg` e `folha-celular.jpg`.

**Testes** (`t65-audfunc`, em 1536×848, 1024×768 e 390×844):

| Teste | Resultado |
|---|---|
| Shader vivo | Pixels do Paper da seção diferentes entre dois quadros com 4 s de intervalo (diferença média RGB de 7 a 9,8) |
| Aba oculta de verdade (outra aba na frente) | `visibilityState hidden`; rAF de cerca de 91 a cada 1,5 s cai para 0 a cada 2 s, e o shader para |
| Movimento reduzido | Sem Paper na seção (0 canvas), conteúdo visível |
| CTA | Texto, `#contato`/`whatsapp`; `:focus-visible` com sublinhado, contorno de 2 px marfim e seta deslocada 3 px |
| Âncora do cabeçalho | Leva ao topo da seção (top 0) |
| Descer até o fim e voltar | Sem canvas duplicado (o total de canvases não cresce) |
| Águia e curvas | Águia carregada com `alt`; curvas `aria-hidden` |

**Contraste** (`t20-contrast`, texto real sobre o fundo real, 8 viewports): 139 medições, **0 abaixo do AA**.

**Regressão do site:** `t19-func` 15/15 (1440) e 18/18 (390); `t32-func` (Hero) 13/13.

**Build:** `node tools/build-site.mjs` gerou 287 arquivos. `aguia-visor-786.webp` está em `site-vercel/assets`.

## Pendente

- Conferir num iPhone real.
- Trocar a águia provisória pelo arquivo em alta (item 1).
