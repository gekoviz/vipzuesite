# Atmosfera V4 — Fusion (Jade Sky + Paper MeshGradient, família DARK)

Relatório no formato do Anexo F do prompt mestre V4. Data: 14/11/2026.

## 1. Estado de partida

- `main` em `597ec8e` (Hero V3.0 publicada). Atmosfera V2.0 no ar: Jade Sky (CSS) + Paper MeshGradient (WebGL) em todas as seções.
- A página alternava famílias: S03 (`#o-que-fazemos`) e "Para quem é" (`#para-quem-e`) eram LIGHT (Marfim/Bege). As outras eram DARK.
- Cada seção ainda tinha focos próprios que competiam com a Jade:
  - Hero: radiais em `.hero__bg` e `.hero__veil`;
  - Método: fundo em `.vz-env`;
  - CTA: `--vz-cta-glow`, `--vz-cta-glow-low` e `--vz-cta-fade-warm`;
  - FAQ: `--vz-faq-glow-a`;
  - Footer: fundo próprio.
- O light-field em contexto "claro" usava `LIGHT.DEEP #9F3930`. Sobre um fundo escuro, isso virava uma esfera vermelha.
- Baseline capturada em `docs/qa/atmosfera-v4/antes/` (pasta de QA, fora do git).

## 2. Mapa real das camadas (de trás para a frente, por seção)

1. Cor de fundo da seção: `--vz-atm-shadow #1A100C`.
2. Base `--vz-atm-ground`: gradiente vertical simétrico (shadow → `#22150F` → `#2A1913` → `#22150F` → shadow). O pé de uma seção e o topo da seguinte ficam no mesmo tom, então a emenda não forma faixa.
3. `.vz-atmosphere__jade::before`: os 4 radiais do Anexo A (focos A–D) com blur leve (0.4cqmin).
4. `.vz-atmosphere__mesh--live.is-live`: Paper MeshGradient (`#1A100C`, `#40261C`, `#9F3930`, `#D7673F`, velocidade 0.12) com opacidade de 0.24.
5. light-field (canvas da página e canvases por seção), agora com paleta espresso/Páprica.
6. Conteúdo.

Pool de Paper:
- no máximo 2 instâncias vivas no desktop e 1 no celular;
- a prioridade vai para a seção com maior área visível;
- a seção que já tem instância ganha +10 pp de histerese;
- o rodapé é medido pela cortina (`[data-footer-curtain]`), não pela seção.

## 3. Alterações por arquivo

| Arquivo | O que mudou |
|---|---|
| `index.html` | `#o-que-fazemos` e `#para-quem-e`: `data-vz-atmosphere="light"` → `"dark"`. Conteúdo intacto. |
| `css/vz-atmosphere.css` | Preset dark com os tokens shadow/base/mid/lift e a base `--vz-atm-ground`. Focos A–D calibrados para desktop e celular. Mesh a .24. Máscara de emenda (32px no topo, 96px no pé), composta com o "furo" da CTA (intersect) e com a entrada da FAQ. Rodapé sem borda inferior. O preset LIGHT fica só como salvaguarda. |
| `js/vz-atmosphere.js` | Paleta dark do Paper. Pool com `HOLD = 0.1` (histerese). Visibilidade real da cortina do rodapé (`watch`). |
| `js/light-field.js` | Só a paleta: `PALETTE_REFINED` passa a espresso→Páprica e `LIGHT = { BASE #1A100C, DEEP #563326 }`. `frontState`, `sectionTarget` e os tempos não mudaram. |
| `css/hero.css` | `.hero__bg` vira só a base escura (sem radiais concorrentes). `.hero__veil` vira um véu plano. `.hero__atmosphere` fica só com o fade inferior. `.next-section` passa para o escuro. O halo da águia (`.hero__bg::before`) não mudou. |
| `css/sections.css` | S03 e "Para quem é" recoloridas (só tinta: color, background, border, fill, stroke, text-shadow). Foco visível on-dark onde o fundo ficou escuro. Vidro dos cards da S03 em espresso translúcido. Plaquetas de "Para quem é" em Mocha/Páprica. Método, CTA e FAQ usam a base `--vz-atm-ground` e perderam os glows próprios. Rodapé `--bf-bg #1A100C`. |

## 4. Receita final (desktop; o celular está entre parênteses)

| Foco | Centro | Raios | k |
|---|---|---|---|
| A — Páprica | 0% 2% (0% −5%) | 41% × 50% (70% × 32%) | .95 |
| B — Páprica | 50% 103% (54% 108%) | 52% × 48% (80% × 40%) | .98 |
| C — Telha | 76% 44% (90% 54%) | 40% × 55% (58% × 48%) | .45 |
| D — Mocha | 28% 70% (15% 72%) | 58% × 66% (90% × 62%) | .32 |

O Paper fica a 0.24 sobre a Jade. As emendas usam 32px no topo e 96px no pé.

## 5. Compatibilidade

- **Sem WebGL:** o Paper fica `unavailable` (um único aviso no console) e o light-field desliga. A Jade em CSS e a base seguram o visual sozinhas: tudo escuro, com focos (`life/fallback.jpg`).
- **Movimento reduzido:** o Paper não é criado (`display: none`). A Jade fica estática e não há outros efeitos de movimento (`life/fallback.jpg`, linha de baixo).
- **Aba oculta e resize:** o pool pausa e retoma sem criar instâncias novas. Sem overflow.

## 6. Cores e conteúdos

- Conteúdo, copy, geometria, Deep Zoom, cards 3D da Hero, luz da CTA, reveals e ondas da S03, accordion e cortina: preservados.
- Paleta usada: `#1A100C`, `#22150F`, `#2A1913`, `#40261C`, `#563326`, `#9F3930`, `#D7673F`, Marfim `#F3EDE3`.
- **PDF de referência (`VIPZUE_Landing_Page_Completa_Visual_2026.pdf`): NÃO IMPLEMENTADO.** Foi usado só como leitura de atmosfera. Copy, layout e imagens diferentes do site atual não foram copiados, como o prompt manda.
- O JPEG de fundo limpo citado no prompt não veio nos anexos, então não foi usado.

## 7. Evidências (`docs/qa/atmosfera-v4/`, fora do git)

- `antes/` (baseline) e `v2/` (resultado): 12 pontos por viewport, folhas `sheet-1440.jpg` e `sheet-390.jpg` (captura completa em 1440×900 e 390×844).
- `layers/`: os 4 estados (base / base+Jade / base+Paper / fusão) em `#contato` e `#metodo` a 1440. Jade com 4 radiais; Paper com opacidade 0.24.
- Paper com a rolagem parada: diferença média RGB entre dois quadros a 4s de 1.66–2.01 com o Paper e 0 sem ele. Ou seja, o movimento vem só do Paper.
- Contraste: 140 medições (10 alvos × 1440 e 390), nenhuma abaixo de WCAG AA.
- Viewports 320×568, 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080:
  - overflow horizontal 0 em toda a rolagem;
  - 0 erros;
  - todas as 7 atmosferas `dark`;
  - Paper vivo no máximo 1 até 430px e 2 a partir de 768px.

## 8. Performance

- Pool limitado: no máximo 2 contextos WebGL do Paper no desktop e 1 no celular.
- 3 voltas completas de rolagem:
  - desktop: `created 2`, `disposed 0`, 5 canvases, estável nas três voltas;
  - celular: `created 1`, 4 canvases.
- Não há vazamento nem recriação.
- Um único blur, na camada da Jade, com raio pequeno (0.4cqmin).

## 9. Funcionalidade

- Hero (t32-func), 1440 e 390: tudo OK. Ciclo dos cards, pausas (rolagem, aba oculta), CTA (copy, destino, analytics), Deep Zoom, resize e console limpo.
- Testes gerais (t19-func): 15/15 no desktop e 18/18 no celular.

## 10. Pendências

- Conferir num iPhone real (Safari): emendas com máscara composta, `cqmin` e o pool com 1 Paper.
- O WebGL do Chrome headless é software. A fluidez do Paper num aparelho real ainda precisa ser vista.
- Opcional: rever a força do halo da águia (`.hero__bg::before`, .55) agora que a base da Hero ficou mais limpa.
