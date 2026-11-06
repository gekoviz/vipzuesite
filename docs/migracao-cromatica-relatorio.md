# Migração cromática — relatório (§64)

Branch `feat/cores`, a partir de `4045f68` (rodada 6 publicada). **Não publicada.** Só cor mudou: copy, layout, geometria, máscaras,
alfas de efeito, stops e animações ficaram iguais, com as exceções listadas no item 12.

Paleta: Mocha #5B4632 · Marfim #F3EDE3 · Páprica #D7673F · Grafite #22201D · Areia #E5D4BB.
Derivados: #332B23, #47392B, #674933, #A55A3A, #6A3C2B, #6E4B34, #4A3B2C, #E2B99C, #F4EFE6, #F7F2EB, #ECCCBA, #2B2620, #52402F, #8D5337.

## 1. Arquivos modificados

| Arquivo | O que mudou |
|---|---|
| `css/tokens.css` | Paleta + derivados como tokens; semânticos remapeados; tokens novos de foco (`--color-focus-on-dark/-light`); removidos `charcoal`, `coffee`, `brown`, `bronze`, `beige`, `champagne-light`. |
| `css/base.css` | Fundo do `body`, foco, botão primário (`.btn--primary-dark`) e o CTA brilhante (`.shiny-cta`, incluindo o `@property --shiny-shine`). |
| `css/hero.css` | Palco, faixas do topo, luz, sheen, sombra, atmosfera, vinheta, destaque "presença digital", apoio da headline, Visão (sombra, narrativa, barra de progresso), scrim do celular. |
| `css/sections.css` | Superfícies claras, cards da 03 (desktop e celular), Método, Para quem é, CTA final (06), FAQ, rodapé (copy, links, tooltip, wordmark), filete do `#contato`, indicador do Método no celular. |
| `js/light-field.js` | Rampas do shader (`PALETTE` escura e `LIGHT` clara). Stops e parâmetros intocados. |
| `js/hero.js` | Só comentários. |
| `js/motion-debug.js` | Cores do painel de debug (não aparece para o visitante). |
| `index.html` | `meta theme-color` (#5B4632), cores dos SVGs inline e um comentário. |

`js/config.js`, `silk.js` e `aurora.js` não foram tocados (os dois últimos não são carregados pela página).

## 2. Tokens finais

- Marca: `brand-primary` = Mocha, `brand-secondary` = Marfim, `brand-accent` = Páprica.
- Fundos: `bg-primary` = Mocha; `bg-secondary` = `bg-light` = Marfim; `bg-deep` = #332B23.
- Superfícies: `surface-dark` = Grafite; `surface-light` = Areia.
- Texto: `text-on-dark` = Marfim; `text-on-light` = Grafite. As opacidades de texto secundário (0,75) e apagado (0,50) foram mantidas.
- Links: `link-on-dark` = Marfim (hover #F7F2EB); `link-on-light` = Grafite.
- Bordas: as rgba trocaram o canal para Marfim e Grafite, com os mesmos alfas.
- CTA (escuro e claro): fundo Grafite, texto Marfim, hover #2B2620.

**Consumidores separados.** Antes, o foco usava o token de link/acento. Agora tem tokens próprios: Marfim no escuro e Grafite no claro. A Páprica não serve como anel de foco sobre o Mocha (fica abaixo de 3:1).

Nas superfícies claras, o `--text-2` passou a ser Grafite com a opacidade do token. O CTA final (06) deixou de herdar o `--journey-hl-1` do Método: agora tem gradiente próprio (`panel-top` → Mocha → `panel-base`).

## 3. Rampas do shader (`js/light-field.js`)

- **Escura (`PALETTE`)**: #332B23 → #47392B → #5B4632 → #674933 → #A55A3A → #D7673F.
  - Seis cores, nas mesmas posições (`STOPS`) de antes.
- **Clara (`LIGHT`)**:
  - `BRONZE` #E2B99C (sombra clara);
  - `BASE` #F3EDE3;
  - `CHAMP_L` #F4EFE6;
  - `IVORY` #F7F2EB.
  - Os mixes (`BEIGE.*`) não mudaram.
  - Os nomes das chaves continuam os antigos (são identificadores internos do shader), com comentário da nova função de cada uma.
- `STOPS`, `BEIGE`, velocidade, ruído, resolução e o resto do shader estão iguais. O diff do arquivo é só a troca de valores e comentários.

## 4. Mapa por seção

| Seção | Fundo | Superfície | Texto | Acento |
|---|---|---|---|---|
| Hero (01) | Campo WebGL na rampa Mocha→Páprica; fallback CSS Mocha / #332B23 | — | Marfim | Páprica ("presença digital"), luz Páprica atrás da águia |
| Visão / passagem (02) | Campo escuro | Sombra #332B23 | Marfim | Barra de progresso Páprica |
| O que fazemos (03) | Campo escuro | Cards Mocha → #52402F → #47392B, borda que acende em #8D5337/Páprica | Marfim | Número do card: chip Grafite |
| Método (04) | Campo escuro | Cards Grafite 62% com realce #6A3C2B/Mocha; borda Páprica conforme o realce | Marfim | Indicador: halo e borda Páprica, núcleo Marfim (celular) |
| Para quem é (05) | Marfim | Placa Areia 78%; visual Mocha → Grafite com brilho #8D5337 | Grafite | — |
| CTA final (06) | Campo escuro | Card #6E4B34 → Mocha → #4A3B2C, borda #8D5337; filete #6A3C2B | Marfim | Botão (item 6) |
| FAQ (07) | Campo escuro | — | Marfim | Foco Marfim |
| Rodapé | Mocha (e o campo) | — | Marfim 95% | Wordmark preenchida em #332B23; tooltip com texto Grafite |

## 5. Hero e "presença digital"

O destaque usa Páprica pura, e o apoio da headline no desktop é Grafite. Com o gradiente original (alfa .72 → .45 a 55%), a Páprica caía para 2,62:1 em 1920. O apoio foi aprofundado (§12): os pontos onde o campo fica mais claro estão justamente onde a Páprica precisava de contraste.

Contraste medido por pixels: a tinta do texto foi escondida, a tela capturada e o pior pixel de fundo sob cada glifo medido.

| Largura | "Presença digital" (mín.) |
|---|---|
| 360 / 390 / 430 | 3,45 |
| 768 | 3,34 |
| 1024 | 3,85 |
| 1366 | 3,93 |
| 1440 | 3,80 |
| 1920 | 3,24 / 3,27 / 3,32 (três quadros do campo animado) |
| 1440 sem WebGL | 3,67 |
| 1440 com movimento reduzido | 3,76 |

Todas as medidas ficam ≥ 3:1. É texto grande (display), e o pedido exigia 3:1.

No resto da Hero:
- título em Marfim ≥ 8,9:1;
- menu ≥ 4,83:1.

## 6. Botões

**CTA principal** (`.btn--primary-dark` e `.shiny-cta`):
- Fundo de #2B2620 a Grafite; texto Marfim; borda Páprica a 50%.
- Anel cônico e pontos em Páprica / #ECCCBA.
- Brilho do hover em Marfim; halo Páprica.

**Animação:** `@property`, keyframes, durações, ângulos e máscaras estão iguais. Só mudaram as cores e o valor inicial do `@property --shiny-shine`.

No `vz-check-r6`, os itens de botão (velocidade da borda, hover sem quadrado) seguem iguais à linha de base de produção.

## 7. Cards e indicadores

- **03, desktop e celular:** os mesmos gradientes radiais e a mesma lógica de acender por `--a` / `--hl`, só com as cores novas. O spotlight usa #ECCCBA a 15%.
- **Método:**
  - No desktop, mantém o mesmo mecanismo de realce, com borda `color-mix` Páprica proporcional ao realce.
  - No celular, o indicador passou a ter núcleo Marfim (§12). Halo e borda continuam Páprica.
- **Varredura de texto sobre os cards:** 0 falhas. A 03 fica em 5,27:1 e o Método em 4,79:1, ambos em 390.

## 8. SVGs e fallbacks

**SVGs inline do `index.html`:**
- estrutura: #C3A881 → Areia;
- conteúdo: #E7D6B7 → Marfim;
- tinta: #141210 → Grafite;
- relógio: disco Grafite, aro Páprica;
- placeholder Mocha;
- botão tracejado e X em Páprica;
- gradiente `#pq-img` de Páprica a Mocha;
- botão e selo em Páprica, com aro Grafite;
- molduras em Areia.

Contagem final no HTML: #E5D4BB ×23, #F3EDE3 ×12, #D7673F ×6, #22201D ×4, #5B4632 ×3.

**Fallbacks:**
- Sem WebGL, o palco usa `bg-primary` e o `.has-silk .hero__bg` usa #332B23.
- O `meta theme-color` é #5B4632.
- Sem JS, a Hero aparece no fundo CSS, igual ao modo sem WebGL (captura `nojs-1440-hero.png`).

## 9. Contrastes medidos (fundo efetivo, por pixel)

Método: a tinta do texto foi escondida, a tela capturada no Chrome (DevTools) e a luminância WCAG calculada no pior pixel sob cada linha.

| Componente | Estado | 390 | 1440 | Sem WebGL (1440) |
|---|---|---|---|---|
| Título da Hero | parado, topo | ≥ 8,9 | ≥ 8,9 | — |
| "Presença digital" | ver item 5 | 3,45 | 3,80 | 3,67 |
| 03, texto dos cards | aceso | 5,27 | — | — |
| Método | aceso | 4,79 | 5,10 | 5,10 |
| Para quem é | — | 11,39 | — | 6,54 |
| CTA final (06): texto / microcopy | — | 6,92 / 5,62 | 7,02 / 5,60 (1920, pela geometria do gradiente) | — |
| FAQ | — | 4,81 | 5,62 | 5,13 |
| Rodapé (copy e links) | campo a 100% | 5,99 | ≥ 4,76 | 5,18 |
| Frases da Visão | movimento reduzido (texto grande) | — | ≥ 4,63 | — |

Total da varredura: **0 falhas** em 390, em 1440 e sem WebGL.

## 10. Antes/depois e viewports

**Capturas** (locais, em `docs/qa/migracao-cromatica/`, pasta fora do git):
- `antes-*` e `depois-*` em 1440 e 390: hero, close, passagem, s03, metodo, pq, contato, faq, fim, e o menu em 390;
- `nogl-*` (sem WebGL);
- `rm-*` (movimento reduzido);
- `nojs-1440-hero.png`.

**Viewports com contraste da Hero medido:** 360×800, 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900 e 1920×1080.

**Layout:** as posições de rolagem das seções são iguais antes e depois em 1440 e 390.

**`vz-check-r6`** (o checker da rodada 6), comparado à linha de base de produção:

| Largura | Agora (PASS/WARN/FAIL/NA) | Produção | Diferença |
|---|---|---|---|
| 390 | 38/2/2/13 | 38/2/1/14 | `B.contraste` (falso positivo, ver item 14); `B.img-peso` NA → PASS |
| 768 | 39/2/1/13 | 39/2/0/14 | o mesmo `B.contraste`; `B.img-peso` |
| 1366 | 47/3/6 | 48/3/5 | o mesmo `B.contraste` |
| 1440 | 48/3/5 | 49/3/4 | o mesmo `B.contraste` |
| 1920 | 49/3/4 | 49/3/3/1 | o mesmo `B.contraste`; `B.img-peso` |

As demais FAIL e WARN são as mesmas da produção (explicadas em `docs/rodada6-relatorio.md`).

## 11. Verificações

**Feitas:**
- contraste por pixel (itens 5 e 9);
- `vz-check-r6` em 390, 768, 1366, 1440 e 1920;
- movimento reduzido (`prefers-reduced-motion` emulado);
- sem WebGL (`getContext` bloqueado por initScript);
- sem JS (scripts removidos antes de rodar);
- busca de resíduos (item 13);
- `node tools/build-site.mjs`: 28 arquivos, sem erro;
- console sem erros.

**Não feitas:**
- Safari / iPhone real;
- Firefox;
- dispositivos físicos;
- trackpad;
- auditoria de performance (a migração não muda shader, imagens nem scripts, só valores de cor);
- capturas antes/depois em 360, 430, 768, 1024, 1366 e 1920 (nessas larguras foi medido o contraste da Hero, não foram tiradas capturas comparativas);
- menu aberto em 1440.

## 12. Ajustes feitos depois da validação

| Onde | Antes → depois | Motivo |
|---|---|---|
| Apoio da headline (desktop, `hero.css`) | Grafite .72 em 0% → .45 em 55% → 0 a 100% **para** .80 em 0% → .66 em 70% → 0 a 100% | "Presença digital" dava 2,62:1 em 1920; agora ≥ 3,24:1 |
| `--text-2` do campo escuro (`.has-field[data-field="dark"]`) | Marfim .88 → **.95** | O pico Páprica do campo (~#8E5539) derrubava para 4,4:1; agora ≥ 4,8:1 |
| Copy do rodapé (`.site-footer.has-field`) | 88% → **95%** | 4,35:1 em 1440 × 900; agora ≥ 4,76:1 |
| Links do rodapé (`.has-field .footer-link`) | 88% → **95%** | Mesmo caso |
| Copy do rodapé (base, sem campo) | 70% → **95%** | Sem WebGL: 3,64:1; agora 5,18:1 |
| Links do rodapé (base) | 78% → **95%** | Sem WebGL: 4,18:1 |
| Indicador do Método (celular) | Núcleo Páprica → **Marfim** | A Páprica sobre o campo escuro fica abaixo de 3:1 (objeto gráfico); halo e borda seguem Páprica |

As correções de alfa são todas em texto secundário e ficam abaixo de 1, como o prompt permite.

## 13. Ocorrências antigas preservadas

- `js/light-field.js`: os nomes `BRONZE` e `CHAMP_L` continuam como identificadores (com os valores novos). Renomear mexeria no shader sem ganho visual.
- Comentários históricos: `base.css` ainda cita "o preenchimento champagne do UI.08" ao descrever a referência aprovada em 24/10. Fica como registro da decisão, não como cor.
- `#000` e `rgb(0 0 0 / …)` aparecem só em máscaras (`mask-image`) e não pintam nada.
- A águia (WebP/PNG) e as imagens são assets fotográficos e não foram recoloridas.
- `silk.js` e `aurora.js` têm as cores antigas, mas não são carregados.

**Busca de resíduos** (#141210, #2F251F, #4A372B, #8A6A4B, #C3A881, #B8AA96, #E7D6B7, 20 18 16, 11 9 7, 195 168 129, 231 214 183, 138 106 75, charcoal, coffee, `--color-brown`, champagne, cobre, óxido, vinho, petróleo) nos arquivos carregados:
- zero ocorrências de cor;
- "cobre"/"descobre" aparecem só como verbo em comentários.

Todas as HEX e rgb literais restantes pertencem à paleta ou aos derivados. O #8E5539 aparece só num comentário, como o pico medido do campo.

## 14. Limitações e conflitos

- **Falso positivo do `vz-check-r6` (`B.contraste`)**:
  - O que o checker faz: ele reconstrói o fundo do card da 06 lendo `--journey-hl-1` e os tokens `--color-brown` / `--color-charcoal`, com fallback #4A372B e #141210.
  - Por que erra: depois da migração, o card tem gradiente próprio e não usa mais `--journey-hl-1` (que vem vazio). Os tokens antigos não existem.
  - Resultado: ele mede contra um fundo que não existe e acusa 2,06 a 2,38:1.
  - O que mostra a medição real: com a mesma geometria do checker e os stops reais (#6E4B34 / #5B4632 / #4A3B2C), dá 6,91 / 5,58 em 390 e 7,02 / 5,60 em 1920, o que bate com os pixels (6,92 / 5,62).
- A Páprica do "presença digital" fica entre 3,24 e 3,45:1 nas larguras mais exigentes. Atende ao mínimo de texto grande (3:1), mas não a 4,5:1. Por isso a Páprica não é usada como tinta de texto pequeno em nenhum lugar.
- O campo WebGL é animado. Os mínimos são de quadros capturados (três em 1920), não uma garantia matemática de todos os quadros.
- Nada foi testado em Safari, iPhone, Firefox ou aparelho real.
