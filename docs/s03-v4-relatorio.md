# Seção 03 V4.0 — relatório

Data: 15/11/2026 · Prompt: `VIPZUE_PROMPT_MESTRE_SECAO_03_V4_0.txt`

**Sem referência visual:** a imagem final que o prompt cita como anexa não veio com a mensagem. Por isso a composição seguiu a descrição escrita do prompt (§07, §13, §14) e o sistema aprovado da CTA final. Não houve comparação de pixels com a referência.

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | Foram adicionadas duas camadas decorativas por card, `.vz-s3-lg__optical` e `.vz-s3-lg__tint`, logo depois de `.vz-s3-glass__material` (4 cards). A definição SVG `#vz-s03-liquid-refraction` (`.vz-s3-lg__svg-defs`) entrou uma vez, antes do `<ol>` dos cards. Nada foi removido nem renomeado |
| `css/sections.css` | Bloco novo "SEÇÃO 03 · V4.0", depois do bloco do vidro da 03. Só pintura |

Ficaram como estavam:
- os scripts `js/scroll-narrative.js`, `js/section3-liquid-glass.js` e `js/vz-atmosphere.js`;
- o asset `assets/ui/vz-s3-wave.svg` e os keyframes `vz-s3-wave-drift`, com duração, fases e play-state;
- a águia;
- a copy;
- as outras seções.

## 2. Fundo

A seção reutiliza o sistema da CTA final:

| Camada | Detalhe |
|---|---|
| Jade | Receita de `css/vz-atmosphere.css` inalterada; só os focos mudaram, no `#o-que-fazemos.s03`: A no canto superior esquerdo, B no pé central, C (calor discreto) atrás da águia e D Mocha difuso. O meio fica escuro. O celular tem geometria própria, com elipses largas |
| Paper MeshGradient | A instância do pool, a 0,2. Nenhum canvas, loop ou listener novo; o teste mede um canvas na 03 |
| Base | Espresso `#170A06`, a mesma da CTA |
| Luz Páprica local | Desktop: dois focos, canto superior esquerdo e pé central, nos tokens Páprica e Páprica Profunda. Abaixo de 1024 px fica só o foco do canto (ver § 6) |
| Grade | Grafite Quente `#22201D`, linhas de 1 px, opacidade composta de cerca de 21%. Passo de 56 px (48 no tablet, 44 no celular) |

**Onde mora o fundo:** dentro do quadro sticky da atmosfera (`.vz-atmosphere__frame`, do tamanho da tela):
- a base é o fundo do quadro;
- a luz fica no `::before`;
- a grade fica no `::after`.

O motivo é que a 03 é um trilho de 420svh com o palco preso, e assim luz e grade ficam presas junto com ele.

A `<section>` continua transparente, porque a passagem da Hero (a seção sobe por baixo do palco) depende disso. A emenda Hero → 03 e a emenda 03 → 04 foram capturadas e comparadas com o site no ar, sem diferença de transição.

Todas as camadas têm `pointer-events: none`. Não há filtro nem opacidade no container da seção.

## 3. Liquid Glass (cards)

A técnica é a da Hero (`.vz-lg__*`), com definição SVG própria da 03. Os parâmetros do filtro são os do prompt §33: baseFrequency 0,001 0,005, seed 17, scale 12, k3 0,035.

Ordem das camadas em cada card, de baixo para cima:

| z | Camada | Detalhe |
|---|---|---|
| 0 | `.vz-s3-glass__material` (existente) | `rgb(79 42 30 / .10)`, `blur(9px) saturate(118%)`; 7 px no celular |
| 1 | `.vz-s3-lg__optical` (nova) | Reflexo especular a 0,13 (0,11 no celular). É o único elemento com o filtro SVG |
| 2 | `.vz-s3-lg__tint` (nova) | Película Mocha a 145° |
| 3 | `.vz-s3-glass__wave-window` (existente) | A onda original. Só mudou o z-index |
| 4 | `.vz-s3-glass__rim` (existente) | Anel de 1 px em gradiente Marfim recortado por máscara, a 0,45 |
| 5 | `.s03-insight__content` | Conteúdo, acima de tudo |

Fallbacks:
- **sem `backdrop-filter`:** película a 0,82;
- **`prefers-reduced-transparency`:** película a 0,94 e sem a camada óptica.

O véu de leitura do fluxo (tablet e movimento reduzido) continua sobre o material.

## 4. Cores

| Elemento | Cor |
|---|---|
| Headline e os três textos | Marfim `#F3EDE3` pleno (antes 88%) |
| Números e títulos dos cards | Páprica `#D7673F` sólida, sem sombra, gradiente ou glow (saiu a sombra de 1 px dos títulos) |
| Descrições | Marfim |

Tipografia, pesos e tamanhos não mudaram.

## 5. Preservação (medida antes e depois)

Para medir, a narrativa foi percorrida descendo e subindo, em 12 posições.

| Item | Resultado |
|---|---|
| Narrativa | Ordem 000 → 100 → 010 → 001 → 010 → 100 → 000: nunca dois textos juntos e volta reversível. Igual ao baseline |
| Cards | Largura, altura, raio, padding, gap e fontes idênticos ao baseline em 1536 e 390. A entrada é a mesma: desktop junto com o texto 1; celular 1 → 2 → 4 |
| Águia | Mesmo retângulo em todos os estados |
| Ondas | `vz-s3-wave-drift` 10 s, fases −1/−4/−6,6/−8,2 s. As 4 andam com o scroll parado, pausam fora da tela e retomam ao voltar. Com movimento reduzido ficam paradas |

Capturas em `docs/qa/s03-v4/` (pasta fora do git):

| Pasta ou arquivo | Conteúdo |
|---|---|
| `antes/` | Baseline |
| `r1/`, `r2/` | Depois |
| `comparacao-1536.jpg` | Antes × depois |
| `folha-*.jpg` | Folhas de viewports |
| `seam-*` | Emendas |

## 6. Contraste (pixels sob cada linha, texto transparente, 4 momentos da onda)

| Texto | Resultado |
|---|---|
| Headline e textos | Mínimo 7,4:1 ("Apenas" sobre a luz do canto); o resto fica acima de 10:1 |
| Números e títulos dos cards, desktop e celular | 3,4–4,3:1. São texto grande (≥ 24 px), então o mínimo é 3:1 |
| Títulos no tablet (22 px, mínimo 4,5:1) | Páprica só passa de 4,5:1 sobre fundo quase preto. Escureci o véu de leitura do vidro só de 768 a 1023 px: 4,24–4,58:1, contra 3,93–4,62:1 no site no ar |
| Luz do pé no celular | Derrubava o número do card 03 para 2,98:1. Saiu abaixo de 1024 px (legibilidade acima da referência) e o número voltou a 3,4–3,6:1 |

**Pior pixel sobre a onda:** onde o brilho da onda passa atrás do texto (descrições dos cards 01 e 04 e título do 01 no celular), o pior pixel cai para cerca de 1,7–2,8:1. No site no ar o resultado é o mesmo (1,7–2,5:1). É a onda aprovada, que o prompt proíbe alterar. Fica registrado como pendência de direção, não desta tarefa.

## 7. Testes executados

| Teste | Resultado |
|---|---|
| `t104-s03func` em 1536×865, 1024×768 e 390×844, mais movimento reduzido em 1536 e 390 | Tudo PASS. Cobre: camadas e ordem; filtro só nas 4 ópticas; id único; cores; base, luz e grade; 1 canvas do pool; ondas paradas/rodando/pausa/retomada; narrativa; overflow 0; console |
| Capturas da narrativa (`t100`) em 1536×865, 1440×900, 1280×720, 1920×1080, 1024×768, 768×1024, 430×932, 390×844 e 375×812 | Sem erros de console |
| `t19-func` | 15/15 e 18/18 |
| `t32-func` (Hero) | TUDO OK |
| `t85-faqfunc` | 10/10 |
| `t95-footfunc` | 10/10 |
| `t75-ctafunc` | Sem falhas |
| Build `tools/build-site.mjs` | OK |

## 8. Limitações e pendências

- **Referência:** a imagem não veio. Se houver diferença de composição em relação a ela, basta enviá-la para comparar.
- **Navegadores:** testado só no Chromium (headless).
  - O filtro SVG em camada com `border-radius` e o `backdrop-filter` podem render diferente no Safari e no Firefox. Os fallbacks cobrem a ausência de `backdrop-filter`.
  - Safari iOS, Chrome Android e Firefox não foram testados.
- **Pendente:** conferir num iPhone real.
