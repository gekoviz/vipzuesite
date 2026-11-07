# Cromático v2 — relatório de implementação (07/11/2026)

Branch `feat/cromatico-v2`. **Não publicado** — aguarda autorização.

Fonte da verdade: Mocha `#5B4632`, Marfim `#F3EDE3`, Páprica `#D7673F`, Páprica Profunda `#9F3930`, Grafite `#22201D` (já presentes em `css/tokens.css`, que não precisou mudar).

## Arquivos alterados

| Arquivo | O que mudou |
|---|---|
| `js/light-field.js` | Só cor. `PALETTE_REFINED = ["#332B23","#47392B","#5B4632","#8D4B34","#C65D3C","#D7673F"]`; `BEIGE = { from .48, to .82, amt .58 }` (núcleo sem alteração); `#contato` passou de `light` para `dark`. `FIELD_CAP`, paradas, movimento, raios, seeds e ruído intactos. |
| `js/scroll-narrative.js` | Removida a fase de saída da 03 (`T.exit`, 0.97–1): sem compressão, inclinação, queda de opacidade nem máscara arrastando. Ao fim do trilho o palco se solta inteiro e a 03 sobe como bloco. O eagle mantém só o empurrão de entrada (`push`), que termina em 0.97. |
| `css/sections.css` | (1) Saiu o fade por `animation-timeline: view()` da figura da 03 (`@property --s03-fig-fade` + keyframes). Fica só a máscara estática no caminho sem movimento (`html:not(.s03-motion)`, ≥ 1024 px). (2) Saiu a regra `data-field-flip` (canvas espelhado). (3) `.closing` ganhou o contrato de cor (fundo Mocha, painel Grafite, tinta Marfim, botão Páprica/Grafite); painel `.closing__action` com `linear-gradient(158deg, #302A22 0%, #22201D 46%, #28241F 100%)`. (4) **Removido o filete de 1 px `#contato::before`** (a linha decorativa 05 → 06), em todos os breakpoints. |
| `index.html` | `#contato` de `surface-beige` + `data-field-flip` para `surface-dark` (mesmos `data-cta`, `aria-disabled`, textos e links). |
| `css/hero.css` | Cores da Hero derivadas da paleta: halo `rgb(215 103 63)` → `rgb(198 89 58)`, base `rgb(62 38 33)`, atmosfera e apoio da headline em `rgb(44 34 30)`; o CTA da Hero voltou ao `#D7673F` com texto Grafite (saiu o `#E4622F`). |

Não tocados: `hero.js`, `hero-voo.js`, `footer-curtain.js`, `menu.js`, `config.js`, ShinyButton, acordeão, menu, cortina do rodapé, integrações (`data-cta`, `aria-disabled`, WhatsApp), SEO e analytics.

## Verificação (local, navegador do app, Chromium)

- **Campos por seção:** Hero, Método, CTA, FAQ e rodapé `dark`; Para quem é e 03 `light`. Títulos Marfim nas escuras, Grafite nas claras.
- **03 → Método (1440 × 900):** em p = 1 a headline está com opacidade 1 e sem transform; a águia inteira, sem máscara (`mask-image: none`). Ida e volta (6000 → 4800 → 5400) dão os mesmos valores em cada ponto, e o recarregamento no meio da passagem também. Nenhuma duplicação: a 03 sobe como bloco e a Método entra em corte seco.
- **05 → 06:** `#contato::before` e `#para-quem-e::after` sem conteúdo; os véus longos da emenda (0–169 px conforme a largura) sem fundo pintado. Zoom em 1440 confirma o corte Marfim/Mocha sem linha.
- **CTA final:** fundo Mocha com campo escuro, headline Marfim (6,9:1 no pior ponto medido), painel Grafite em degradê. Texto do painel 13,9:1; nota (Marfim .78) 9,0:1, então o alpha atual ficou. Botão Páprica com texto Grafite. A águia não foi tocada (sem filter).
- **Larguras 360, 390, 430, 768, 1024, 1440, 1920:** sem rolagem lateral (a diferença de 15 px a partir de 768 é a barra de rolagem). Painel, campo e emenda conferidos em cada uma.
- **Console:** sem erros. `node tools/test-hero-voo.mjs` 11/11. `node tools/build-site.mjs`: 275 arquivos. `git diff --check` limpo.

## Contraste sobre o fundo composto (pixels lidos do canvas WebGL)

| Onde | Texto | Pior medido | Situação |
|---|---|---|---|
| Método, cards | parágrafo 15 px, Marfim .74 sobre Grafite .62 | ≈ 6:1 | ok |
| CTA | headline 84 px | 6,88:1 | ok |
| FAQ | perguntas 20 px | **4,21:1** | abaixo de 4,5 onde o pico Páprica passa |
| FAQ | título 64 px | 4,28:1 | ok (texto grande) |
| Rodapé | links legais 14 px | **3,94–4,05:1** | abaixo de 4,5 sobre o pico |

**Causa:** a rampa nova é mais clara no alto. O pico alcançável com `FIELD_CAP 0.72` fica ≈ `#B05839`, contra ≈ `#9B492A` antes. Mesmo Marfim pleno chega só a 4,19:1 ali, então mexer só no texto não resolve. Para corrigir é preciso mudar o campo (rampa ou `FIELD_CAP`, que a especificação proíbe) ou pôr um apoio local atrás desses textos (mudança de desenho). **Não alterei; decisão do usuário.**

## Desvios declarados

- **Águia da Hero:** continua com o tom quente gravado no arquivo, que o usuário aprovou na rodada anterior. A especificação pede sem filtros na foto, mas não há filter CSS; o ajuste está no próprio webp.
- **Voo da águia:** continua desligado, por pedido anterior do usuário.
- **Borda do painel do CTA:** Marfim 14 % (julgamento meu, para o painel Grafite não sumir sobre o Mocha).
- **Nota do CTA:** alpha .78 mantido (9,0:1).
- **Mobile, `.s03-seam`:** a águia de costura do mobile ficou, porque não é efeito de saída.

## Não verificado

- Safari / iPhone e Firefox (só Chromium).
- `prefers-reduced-motion`: o navegador do app não emula essa preferência. O código do caminho sem movimento (`html:not(.s03-motion)`) não foi alterado além da troca do fade pela máscara estática.
- Fallback sem WebGL renderizado: conferido só pelo CSS (`.surface-dark` = Mocha / Marfim, `.surface-beige` = Marfim / Grafite), não forçando a perda do contexto.
- Rolagem rápida com roda/trackpad físico: testada com saltos programáticos e roda simulada; o render é função pura do progresso, mas a sensação ao vivo não foi vista.

## Evidências

`docs/qa/cromatico-v2/` (fora do git): `antes-s03-a/b`, `antes-1440-emenda-05-06`, `antes-1440-filete-05-06-zoom`, `depois-1440-{hero, s03-fim-p1, s03-passagem-metodo, metodo, para-quem-e, emenda-05-06-zoom, cta, faq, rodape}`, `depois-390-{emenda-05-06, cta}`.
