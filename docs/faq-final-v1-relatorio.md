# FAQ final V1.0 — relatório

Data: 15/11/2026 · Prompt: `VIPZUE_PROMPT_MESTRE_FAQ_FINAL_V1_0.txt` · Referência aprovada: imagem 30 (1448×1086), comparada no mesmo tamanho

## 1. Arquivos

| Arquivo | Mudança |
|---|---|
| `index.html` | `#faq`: nova camada `.vz-faq__bg` (luz + grade), chevron mais largo e fino (`viewBox="4 7.5 16 9"`, traço 1,5), comentário. Perguntas, respostas, IDs e ARIA não mudaram |
| `css/sections.css` | Bloco "07 — FAQ final · V1.0" substitui o "07 — FAQ · V5.0" (mesmo lugar, antes do rodapé) |
| `js/sections.js` | A entrada da FAQ trocou o GSAP/ScrollTrigger por IntersectionObserver por elemento + transições CSS. O accordion é o mesmo |

Nenhuma outra seção foi alterada (Hero, Método, Para quem é, CTA, header, rodapé, SEO, páginas legais, WhatsApp).

## 2. Dependências

**Nenhuma instalada.** O site é HTML/CSS/JS estático, sem React, Tailwind, shadcn, Radix nem Motion. Instalar React só para esta seção mudaria a arquitetura, e o prompt pede para não reestruturar. O componente Hirael/21st.dev foi portado:

| No original (React) | Aqui |
|---|---|
| `Accordion` (Radix) | O accordion que já existia: `button` + `region`, `aria-expanded`/`aria-controls`, Enter/Espaço, ↑/↓/Home/End, altura por grid 0fr → 1fr em 0,26 s |
| `FaqTitle` (`whileInView`, once) | Cada palavra: opacidade 0 → 1 e +16 px → 0, 0,50 s easeOut, atraso 0,20 s + 0,08 s por palavra, as duas em Marfim |
| `FaqCard` (`whileInView`, once) | Cada barra: opacidade 0 → 1 e +20 px → 0, 0,45 s easeOut, atraso índice × 0,10 s |
| `useReducedMotion` | Com movimento reduzido nada é escondido e as transições saem |
| `FaqBadge`, `FaqDescription` | Não renderizados |

Cada elemento tem a própria observação e revela quando **ele** entra na tela (no celular, as barras de baixo esperam a rolagem). Acabou a entrada, as classes saem e não fica opacidade nem transform residual. As barras são clicáveis e alcançáveis pelo Tab durante a transição, e o foco revela tudo na hora.

**Comportamento do accordion:** um item aberto por vez (`type="single"` collapsible). É o comportamento que a FAQ aprovada já tinha, preservado como o prompt manda, no lugar do `multiple` do exemplo.

## 3. Conteúdo

As cinco respostas vêm do `index.html` publicado (FAQ V5.0, 08/11/2026) e não mudaram. O diff dessa seção não toca em nenhum `<p class="vz-faq__answer">`. O teste confere o título literal, as cinco perguntas na ordem, cinco respostas, `h2` com `aria-labelledby` e nenhum `h1`, badge ou descrição.

## 4. Composição

**Fundo (de trás para a frente):**
1. Base espresso avermelhada `#1F0803`, voltando a `#1A100C` nas emendas.
2. Jade Sky: a receita V4 sem mudança, só os focos desta seção (canto superior esquerdo, pé à esquerda do centro, atrás do título, Mocha difuso).
3. Paper MeshGradient do pool a 0,14, sem instância nova.
4. Luz Páprica local (`.vz-faq__bg::before`) em três núcleos estáticos: canto superior esquerdo, atrás do título e da 1ª barra, e o foco que sobe do pé.
5. Grade Grafite Quente (`::after`): 1 px, células de 64 px (56 no tablet, 44 no celular), a mesma da CTA.

Tudo é absoluto: acompanha a altura real quando uma resposta abre.

**Título:** Boska 700, Marfim, centralizado. 81 px na referência; o celular quebra em duas linhas.

**Barras:**
- largura total do container: 1226 px na referência, `min(1226px, 100% − 2 × 7,67vw)`;
- 92 px de altura mínima, gap de 27 px, raio de 24 px (18 no celular);
- superfície espresso/mocha em degradê vertical (`#57200C` → `#2A1105`);
- borda Páprica de 1 px a 0,78 e halo de 16 px a 0,22, sem vidro nem blur;
- pergunta em Switzer 600 Marfim, chevron fino à direita que gira 180°;
- resposta em Switzer 400 Marfim a 0,88.

**Escala:** a composição mede como a referência até 1448 px e para de crescer quando o container chega a 1226 px. Em telas 16:9, os respiros verticais também respeitam a altura (`svh`).

## 5. Comparação com a referência (1448×1086, medida em pixels)

| Medida | Referência | Render |
|---|---|---|
| Título (caixa das letras) | x 365–1075 (710) | x 368–1079 (711) |
| Barras: x / largura | 111 / 1226 | 111 / 1226 |
| Topos das barras | 287 · 407 · 528 · 648 · 771 | 289 · 410 · 530 · 651 · 772 |
| Altura das barras | ~94 | 94 |
| Texto da 1ª pergunta | x 157–659 (502) | x 160–665 (505) |
| Chevron | x 1273–1294 | x 1269–1290 |
| Vão abaixo da 5ª barra | 221 | 220 |

Capturas em `docs/qa/faq-v1/`:

| Arquivo | Conteúdo |
|---|---|
| `antes/` | Estado anterior |
| `r7/` | Todos os viewports |
| `folha-desktop.jpg`, `folha-celular.jpg` | Folhas de viewports |
| `emendas/`, `emendas-antes/`, `folha-emendas*.jpg` | Emendas CTA → FAQ e FAQ → rodapé |
| `camadas/` | Diagnóstico das camadas do fundo |
| `referencia-30.webp` | A referência |

## 6. Testes

| Teste | Resultado |
|---|---|
| `t85-faqfunc` 1448×1086, 390×844, 360×640 e movimento reduzido | Tudo PASS |
| Reveal abaixo da dobra (375×460) | 1c e 1d PASS |
| Viewports 1920×1080, 1536×864, 1448×1086, 1366×768, 1024×768, 768×1024, 390×844, 375×812, 320×640 | Overflow horizontal 0; um canvas vivo por seção; console limpo |
| Contraste `t20` (fechada, 2ª aberta, 5ª aberta) | 95 medições, 0 abaixo do AA |
| `t19-func` | 15/15 (1440) e 18/18 (390) |
| `t32-func` (Hero) | TUDO OK |
| `t75-ctafunc` (CTA) | 9/10; o "falho" está explicado abaixo |
| Build `tools/build-site.mjs` | 289 arquivos |

O `t85-faqfunc` cobre:
- entrada armada antes e revelada ao chegar;
- clique durante a entrada;
- nada some ao rolar de volta (uma vez só);
- copy e estrutura;
- Boska e Switzer 600;
- borda de 1 px sem blur;
- um item aberto por vez, com a seta girando;
- resposta longa sem corte e dentro da barra;
- fundo e atmosfera com a altura nova;
- teclado (foco 2 px Marfim, Enter, ↓);
- shader vivo e console.

**Sobre o t75:** depois de rolar até o fim e voltar à CTA, a página tem 4 canvas em vez de 3. Não é duplicação: o pool continua com no máximo 2 vagas e um canvas por seção (`__vzAtmosphere.stats`: `slots: 2`, `budget: 2`). Como a FAQ ficou mais curta em 16:9, no fim da página ela aparece junto com o rodapé e recebe a 2ª vaga, como a política do pool prevê. O assert do teste ("nunca mais canvas que antes") era mais estrito que essa política.

O projeto não tem lint nem typecheck.

## 7. Diferenças restantes

- **Saturação:** a luz da referência é um laranja-vermelho muito saturado (núcleos perto de `#FB6C18`, meio-tons perto de `#DB2B00`). O sistema usa os tokens Páprica `#D7673F` e Páprica Profunda `#9F3930`, como na CTA. A luz fica menos "neon" que a imagem.
- **Canto superior esquerdo:** na referência o brilho encosta na borda de cima. Aqui ele nasce do escuro nos primeiros 64 px (110 px no celular), para a emenda com o pé da CTA não marcar linha.
- **Manchas do Paper:** o shader desenha manchas escuras móveis. A 0,14 elas são discretas, mas não existem na imagem estática.
- **Telas 16:9:** a referência é 4:3. Em 1536×864 a FAQ tem cerca de 990 px, mais que uma tela, porque a largura e o tamanho das barras seguem a referência. Em 1920×1080 cabe numa tela.
- **Tablet e celular:** a seção tem a altura do conteúdo (754–808 px), então o começo do rodapé aparece embaixo. O degrau FAQ → rodapé já existia.
- **Pendente:** conferir num iPhone real.
