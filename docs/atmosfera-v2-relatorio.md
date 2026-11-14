# VIPZUE — Atmosfera V2.0 (Jade Sky + Paper MeshGradient) · relatório

Data: 13/11/2026. Branch: `feat/atmosphere-v2`, criada da `main` 961bd56. **Sem commit e sem deploy.**
Decisões do usuário nesta etapa:
- A V2.0 **substitui** a película Mesh Drift V6.1 "Fitas". Saiu só a inclusão do script; os arquivos continuam no projeto.
- O pacote foi baixado com npm numa pasta temporária. Só o módulo final foi copiado para `assets/vendor/`.

## A. Arquivos

| Arquivo | Situação | O que é |
|---|---|---|
| `css/vz-atmosphere.css` | novo | Presets DARK e LIGHT, estrutura da camada, proteção de leitura (Hero e CTA), máscara de entrada da FAQ, movimento reduzido |
| `js/vz-atmosphere.js` | novo (módulo ES) | Gerenciador do MeshGradient: registro por seção, vagas que migram, teto de contextos, teto de resolução, pausa, descarte, fallback |
| `assets/vendor/paper-shaders-mesh-0.0.82.js` | novo | `@paper-design/shaders` **0.0.82** (Apache-2.0): só `ShaderMount`, `meshGradientFragmentShader` e as dependências internas deles, concatenados **sem alterar código** a partir do `dist/` do pacote (34 KB, sem minificar) |
| `assets/vendor/paper-shaders-LICENSE.txt`, `paper-shaders-NOTICE.txt` | novos | Licença e aviso do pacote (não vão para o site publicado; o cabeçalho do módulo cita a licença) |
| `index.html` | alterado | `data-vz-atmosphere` e o markup `.vz-atmosphere` em 7 roots; `<link>` do CSS novo e `modulepreload` do vendor; `js/vz-mesh-overlay.js` trocado por `<script type="module" src="js/vz-atmosphere.js">` |

Pontos de atenção:
- `css/vz-mesh-overlay.css` continua carregado de propósito. Ele dá aos roots `[data-vz-mesh]` o `position: relative; isolation: isolate` que está publicado. Sem ele, o empilhamento das camadas `z-index: -1` das seções mudaria. A película antiga não aparece porque nada cria `.vz-mesh-layer`.
- Os atributos `data-vz-mesh` ficaram no HTML pelo mesmo motivo.
- O build (`node tools/build-site.mjs`) gera 283 arquivos: saiu `vz-mesh-overlay.js` e entraram o CSS, o JS e o vendor. O vendor entra pelo `modulepreload`, porque o build não segue imports de JS.

## B. Seções

| Seção | Root | Preset | Observação |
|---|---|---|---|
| Hero | `.hero__stage` | DARK | Camada depois do `.hero__bg`. A headline tem proteção de leitura: sem foco atrás dela. Na passagem para a 03, usa a mesma `--wipe-hide` do halo |
| Visão | — | — | Não tem superfície própria: é a sombra `[data-visao-shade]` dentro do palco da Hero, que já tem a atmosfera |
| 03 "Apenas encontrar…" | `#o-que-fazemos` | LIGHT | Cards intocados. Camada como 1º filho; o campo de luz que o JS prepende continua por baixo |
| Método | `#metodo` | DARK | Camada depois do `.vz-env`. O quadro preso à tela mantém a atmosfera durante toda a rolagem longa |
| Para quem é | `#para-quem-e` | LIGHT | Antes do véu de entrada, que continua por cima |
| CTA | `#contato` | DARK | Proteção de leitura atrás da headline e da subheadline (ver C) |
| FAQ | `#faq` | DARK | Entra a partir do escuro no topo (mesma intenção da correção V7, tarefa I) |
| Rodapé | `.site-footer` | DARK | Cortina preservada (`.footer-curtain` e `js/footer-curtain.js` intocados) |

## C. Composição

```
root [data-vz-atmosphere]  (position/isolation já publicados, nada novo no root)
└─ .vz-atmosphere            absolute, inset 0, z-index -1, pointer-events none, aria-hidden, overflow clip
   └─ .vz-atmosphere__frame  sticky top 0, altura da seção ou no máximo 100lvh, container-type: size
      ├─ .vz-atmosphere__jade         inset −0.8cqmin, blur(0.4cqmin); ::before com os 4 radiais
      ├─ .vz-atmosphere__mesh         lugar estático (vazio, transparente)
      └─ .vz-atmosphere__mesh--live   criado pelo JS: canvas do ShaderMount, opacity var(--vz-atm-mesh-opacity)
```

Desvios do prompt:
- **`.vz-atmosphere__frame`.** É um único wrapper interno à camada. Nenhum elemento posicionado da seção passa a ter outro containing block. Existe para que as seções longas (Método, 03) tenham atmosfera do tamanho da tela durante toda a rolagem, com um canvas do tamanho da tela e não da seção inteira.
- **Proteção de leitura.** Na Hero e na CTA, a camada inteira (Jade e mesh) recua para 22% atrás do bloco da headline, por máscara radial (`--vz-atm-guard`). Os valores do preset não mudam. Sem a proteção, as palavras em Páprica da CTA caíam de 3,4–3,7:1 para 2,6–2,9:1 a 1440, e de 4,87 para 4,07:1 a 390.

## D. Paleta

DARK:
- Jade: A Páprica .28, B Páprica Profunda .26, C Mocha .55, D Páprica .10, nas posições e raios do prompt.
- Shader: #5B4632, #9F3930, #D7673F, #5B4632.
- Opacidade da camada do mesh: 0,14 (teto 0,18).

LIGHT:
- Jade: A .075, B .040, C .025, D .035.
- Shader: derivado do token claro real da seção, `--vz-atm-base: var(--color-bg-secondary)`, que o navegador resolve para `rgb(243, 237, 227)`:
  - 96% token + 4% Mocha;
  - 93% token + 7% Páprica;
  - 96% token + 4% Páprica Profunda;
  - 100% token.
- Opacidade da camada do mesh: 0,055 (teto 0,075).

## E. Shader

Versão `@paper-design/shaders` 0.0.82, fixada no nome do arquivo e no cabeçalho. Sem CDN, sem React, sem Tailwind e sem shadcn.

Uniforms:
- `u_colors`: RGBA de 0 a 1.
- `u_colorsCount`: 4.
- `u_distortion` 0,8; `u_swirl` 0,1; `u_grainMixer` 0; `u_grainOverlay` 0.
- Dimensionamento: `u_fit` contain, `u_scale` 1, `u_rotation` 0, `u_offsetX/Y` 0, `u_originX/Y` 0,5, `u_worldWidth/Height` 0.
- Velocidade: 0,12 no escuro e 0,08 no claro.

Política de instâncias:
- **Vagas.** Há 1 vaga no celular (até 767,98px) e 2 acima. Cada vaga é um `ShaderMount`, com seu contexto e programa, criado uma vez. As vagas vão para as seções mais visíveis: IntersectionObserver, fração da altura da tela, 21 limiares.
- **Migração.** Quando muda a seção mais visível, a vaga muda de seção no DOM e recebe as cores e a velocidade do preset novo (`setUniforms`, `setSpeed`), sem recompilar.
- **Seções sem vaga.** Ficam só com a Jade.
- **Vaga ociosa.** Para com `setSpeed(0)`. O `ShaderMount` também para sozinho fora da tela e com a aba oculta.
- **Descarte.** `dispose()` é usado quando sobra vaga (a tela encolheu para celular) e no movimento reduzido.
- **Registro.** Um por seção, sem duplicar.
- **Resolução.** `minPixelRatio` 1. `maxPixelCount` = min(teto, largura × altura × DPR-teto²):
  - celular: DPR 1,25 e 700 mil pixels;
  - desktop: DPR 1,5 e 1,4 milhão.
  - Recalculado no resize. Medido: 390×844 a 1×; 1440×900 com 1,296 milhão de pixels.
- **Fallback.** Sem WebGL2, erro de shader ou 3 perdas de contexto: só a Jade, com um aviso no console.
- **Movimento.** O tempo do shader corre sozinho, sem nenhum ouvinte de scroll. O único rAF é o do próprio `ShaderMount`; não há GSAP. A 1ª vaga nasce com a página ociosa (`requestIdleCallback`).

## F. Desempenho (headless, antes = produção 961bd56 com as Fitas, depois = local)

| Medida | Antes | Depois |
|---|---|---|
| Contextos WebGL criados na página (rolagem inteira) | 4 no celular, 5 no desktop | 4 no celular, 5 no desktop |
| Contextos da atmosfera vivos ao mesmo tempo (máx.) | — | 1 no celular, 2 no desktop, em todas as 10 larguras |
| Canvas da atmosfera (máx.) | — | 1 no celular, 2 no desktop |
| Criações do shader por rolagem completa | — | 1 no celular, 2 no desktop (descartes: 0) |
| FPS parado (Hero, 03, FAQ) a 1440 | 57–60 | 58–60 |
| Rolagem a 1440: p95, quadros > 34 ms | 31,9–33,7 ms, 3,2–4,6% | 21,3–29 ms, 0,4–2,5% |
| Rolagem a 390 (3 cargas): p95, quadros > 34 ms | 22,4–26,6 ms, 2–3,3% | 18,4–19,5 ms, 0,4–1,5% |
| Aba oculta | — | rAF da página: 248/s visível → 0/s oculta |

Sobre o acúmulo de contextos:
- A primeira versão do gerenciador criava e descartava um contexto por troca de seção: 15 a 17 criações por rolagem, cada uma recompilando o shader.
- Foi trocada pelas vagas que migram. O total de contextos ficou igual ao de produção, sem acúmulo.

## G. Evidências

Os arquivos ficam em `docs/qa/atmosfera-v2/`, que o git ignora.

- **Capturas antes e depois.** `antes/` e `depois/`: 6 pontos por largura (Hero, cards da 03, fim do Método, CTA, FAQ, fim) nas 10 larguras pedidas. Folhas comparativas em `cmp-390x844m.jpg` e `cmp-1440x900.jpg` (esquerda antes, direita depois).
- **Prova de movimento.** Medida em 5 s no mesmo lugar, pelo tempo do shader e pela leitura dos pixels do canvas:
  - escuro: +600 ms de tempo do shader (velocidade 0,12), variação média de 6,2 por canal RGB;
  - claro: +400 ms (velocidade 0,08), variação de 0,3–0,7, discreta por definição.
  - Capturas `extra/mov-*`.
- **Matriz por largura.** Nas 10 larguras:
  - overflow 0, sem erros JS e sem respostas ≥ 400 (fora o favicon, igual à produção);
  - FAQ cobre a tela em 9 das 10 larguras; a 768 não cobre, igual à produção;
  - o fim da página mostra só o rodapé;
  - cortina ativa.
- **Movimento reduzido.** Sem canvas e com `display: none` no mesh; só a Jade (`extra/reduced-390-cta.jpg` e matriz `depois-rm/`).
- **Fallback sem WebGL2.** Sem canvas, Jade presente, nenhum erro, só o aviso (`extra/fallback-1440-cta.jpg`).
- **Testes funcionais.**
  - 390: 18/18 — rolagem interrompida, vaivém, recarga no meio, resize e orientação, histórico, FAQ, CTAs, menu, sem erros.
  - 1440: 15/15.
- **Contraste, com e sem a atmosfera (CSS e JS bloqueados).** 233 medições em 1440, 1024, 768, 390 e 320, com **0 regressões**. Três casos ficam abaixo do AA, mas já estavam abaixo sem a atmosfera; são os resíduos da V7:
  - o destaque da headline da Hero (2,61 e 2,79:1; sem a atmosfera, 2,56 e 2,72);
  - um parágrafo do Método a 320 (3,24:1; sem a atmosfera, 3,69).

## H. Preservação

Ficaram intocados:
- todo CSS e JS existente; o diff fica restrito a `index.html`;
- o `display`, a altura, o `position` e o `overflow` dos roots;
- sticky, fixed, a pista de rolagem, as timelines e o GSAP;
- as fontes;
- a imagem da águia e o Deep Zoom e as passagens.

Também:
- O voo da águia não volta: `hero-voo.js` continua comentado. Não há scroll scrubbing.
- Nenhum transform, opacity, filter, isolation ou contain foi posto no root. A máscara e o filtro ficam só dentro da camada nova.
- A proteção de leitura da V7 continua valendo: o apoio Grafite da Hero e o véu da 05 ficam acima da camada.

## I. Limitações

- **iPhone/Safari real não testado.** Testado no Chromium headless. O WebKit precisa de WebGL2 (iOS 15+); sem ele vale o fallback da Jade.
- **Light quase imperceptível.** O claro é discreto por definição: opacidade 0,055 sobre cores a 4–7% do token. A Jade carrega quase toda a atmosfera na 03 e na 05.
- **Seções sem vaga.** Fora das 1 ou 2 seções mais visíveis, há só a Jade. A vaga chega em ~140 ms e entra em 1,2 s, e a seção que entra na tela é a que a recebe.
- **Pacote 0.0.x.** O `@paper-design/shaders` ainda é 0.0.x. A versão está fixada e vendorizada, e atualizar exige refazer a concatenação (os 5 arquivos do `dist/` listados no cabeçalho).
- **rAF do shader.** O `ShaderMount` tem o próprio laço de rAF enquanto anima. É o único rAF novo, e só existe com uma vaga visível e a aba ativa.
