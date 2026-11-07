# Hero desktop — correção V2 do voo da águia (relatório)

Data: 06–07/11/2026 · Branch local `fix/hero-voo-v2` (a partir de `main` 555f1cf) · **Não publicado** (o prompt V2 pede
explicitamente para não publicar; nada foi enviado à Vercel nem à `main`).

Base: `VIPZUE_PROMPT_MESTRE_HERO_DESKTOP_V2_115_TOPICOS.txt`. Este relatório substitui, para o desktop, as decisões do
`docs/hero-video-relatorio.md` (V1) onde elas conflitam.

## 1. Arquivos alterados

| Arquivo | O que mudou | Por quê (V2) |
|---|---|---|
| `js/hero-voo.js` (novo) | Motor sem DOM: `validateManifest`, `frameMap`, `createFrameStore`, `createRenderer`, `createCoordinator` | §24–31, §44: contratos testáveis fora do navegador |
| `js/hero.js` | Prólogo religado ao motor; preparação/ativação; entrada agrupada (`entrance`); header fixo por fase; fallback sem `scrollTo` | §16–21, §36–41, §43, §48–50 |
| `css/hero.css` | `.is-prologue` (sem atmosfera e sem sombra do texto sobre a ave; estática oculta até o pouso); `.has-prologue` (transições de volta); `.site-header.is-prologue-fixed`; transição do canvas | §36, §37 |
| `index.html` | `<script src="js/hero-voo.js" defer>` antes de `hero.js` | carregar o motor |
| `assets/hero/voo/manifest.json` | Formato estendido: `version`, `frames[{url, sourceTime}]`, `firstFrame`, `finalFrame`, `alpha`, `finalAnchor` (olhos) | §24: fim do `FRAME.w/h` fixo no código |
| `tools/recortar-voo.html` | Passa a gravar o manifesto no formato novo | manter o processo reproduzível |
| `tools/test-hero-voo.mjs` (novo) | 11 testes de lógica (os 10 do §55 + timeout) | §55 |

Mobile, Seção 3, `tokens.css`, `fonts.css`, `config.js`, shader e quadros (`voo-*.webp`): **sem alteração**.

## 2. Diagnóstico anterior → correção

| V1 publicada | V2 local |
|---|---|
| Quadro escolhido por `tl.time()` com `scrub: 0.6` (ave atrasada ~0,6s) | `onUpdate` do **mesmo** ScrollTrigger dá a rolagem bruta → `coord.updateRaw()` (hero.js `onRaw`); a Visão continua com o scrub 0,6 |
| Hold de 24svh + leitura 36svh; entrada em 224 | Voo 160 + zona da Hero 40 + Visão 244 = **444svh** (caixa 544svh). Entrada automática **no pouso** (160), sem rolagem extra |
| Pouso = rolagem ≥ 224 | Pouso = recibo `exact` do **quadro 240** desenhado na geometria atual e rolagem ≥ 160 (`renderCurrentTarget` → `commit`) |
| Voltar ao voo reescondia título/CTA (`titleBound`, `killTweensOf` a cada rolagem) | Trava `visit.completed/bypassed` fora do `matchMedia`; depois do pouso nenhum quadro é pedido e a Hero fica pronta |
| `img.onload` tratado como pronto; todos os 241 `Image` retidos | `fetch` → Blob → `createImageBitmap`; estados queued/fetching/downloaded/decoding/decoded/failed; LRU por bytes (128MiB decodificado, 32MiB comprimido), 4 downloads e 2 decodes simultâneos, janela −4/+12 invertida com o sentido, primeiro/último protegidos, `close()` nos descartes |
| Busca o quadro carregado mais próximo em toda a sequência | Substituto só a ±2; senão mantém o último quadro válido |
| Bordas apagadas sempre (6/10/4/22%) | Removidas do voo. Só existe uma máscara **específica do pouso** (topo 4%, direita 10%, base 22%) com intensidade = progresso do assentamento (0 durante a travessia) |
| Enquadramento cover → final nos últimos 30svh de 200 | Matriz única (tela cheia) para todo o voo; assentamento restrito aos últimos 40 quadros (rolagem 133–160), quando a ave já estabiliza — ver §4 |
| Sombra `.hero__content::before` e `.hero__atmosphere` sobre a ave | Desligadas em `.is-prologue`; voltam com transição de 0,8s na entrada |
| Header `absolute` (fora da tela no fim do voo); logo/menu entravam aos 0,6s | Header oculto e `inert` no voo; no pouso entra com o efeito original (y −8→0, 0,4s); `position: fixed` só enquanto `t < OFF+30` (até o fim da sua saída original) |
| `fonts.ready` disparava o título | No desktop com voo a fonte só libera o recurso; quem toca é o coordenador |
| Falha → `mm.revert`, `OFF = 0` e `scrollTo(y − offPx)` | Antes da ativação: Hero original sem percurso. Depois: estado final funcional, percurso mantido, **nenhum `scrollTo`** |

## 3. Mídia

- Fonte efetiva: a sequência já publicada (241 WebP 1600×890 com alfa, de `IMG_5747.MP4` 1928×1072, 24 fps). Nenhum
  quadro foi reexportado. `2399381009772745787(1).mp4` (920×512, 30 fps, 301 quadros) não foi usado: menor resolução que
  o master atual. A gravação de monitor não foi usada como fonte.
- Manifesto: `version 2026-11-06.1`, `firstFrame 0`, `finalFrame 240`, `alpha: true`, `sourceTime = (i+0,5)/24`
  (o mesmo instante que a ferramenta de recorte busca). `finalAnchor`: ponto médio dos olhos (992,2; 323,2) e distância
  321,3 px — os valores afinados por comparação de pixels na V1. Os olhos individuais no manifesto são derivados desses
  dois números (o olho real não está exatamente na horizontal).
- Mapeamento: linear, `round(p × 240)`; sem tabela não linear.

## 4. Pouso: o último quadro não é a mesma imagem que a águia estática (decisão pendente)

Medido nesta rodada (§35 manda comparar):

- **Olhos e bico coincidem** (1–2 px CSS, como na V1).
- **Corpo e cor não coincidem.** O quadro 240 mostra a cabeça com ombros e asas, cortados pelas bordas do quadro do
  vídeo, em tom mais dourado. A estática (`aguia-1400.webp`) é um busto completo, mais escuro, cujas penas vão até a base.
- **Matriz única nos olhos (sugestão do §32) não serve para a travessia.** No enquadramento dos olhos, o quadro do vídeo
  ocupa 1182×657 px dentro de 1440×900 (x 124–1305, y 87–744). A ave encosta nas bordas do quadro em praticamente
  todo o voo (bbox medido a cada 4 quadros), então seria cortada em linha reta no meio da tela.

Implementado agora (opção A, provisória):
- voo em tela cheia com matriz fixa;
- assentamento nos últimos 40 quadros, com máscara do pouso;
- no pouso, o canvas sai em 0,3 s sobre a estática opaca já alinhada.

Evidência:
- `docs/qa/hero-video/v2-1440-pouso-canvas.png`: último quadro;
- `docs/qa/hero-video/v2-1440-pouso-estatica.png`: Hero pronta.

Na troca, o peito "cresce" e a cor escurece.

Alternativa do próprio V2 (opção B): usar o último quadro como pose estática do desktop, em tela cheia, sem
assentamento. Isso muda a composição aprovada da Hero desktop:
- a águia fica cerca de 37% maior, com ombros e mais dourada;
- o zoom da Visão precisa ser reancorado nela.

Isso é redesenho, por isso **não foi feito sem aprovação**.

## 5. Distâncias de rolagem

| Voo | Px por quadro (1440×900) | Ticks de roda (~100 px) para atravessar |
|---|---|---|
| 140svh | 5,25 | 12,6 |
| **160svh (mantido)** | 6,0 | 14,4 |
| 180svh | 6,75 | 16,2 |

A escolha por sensação de rolagem real (roda, trackpad) **não foi testada**: o painel do navegador estava oculto (rAF
estrangulado) e não há entrada física aqui. 160 fica como valor de partida, a confirmar na A/B do usuário.

## 6. Dono de cada camada por fase (§108)

| Fase | Quadro / canvas | Águia estática | Palavras + CTA | Logo/menu | Header (posição) | Atmosfera / sombra do texto | Visão |
|---|---|---|---|---|---|---|---|
| preparing | vazio (ainda não montado) | oculta (`.is-prologue`) | ocultos (`entrance.prepareHidden`) | oculto, `inert` | absolute | desligadas | timeline original (OFF 0) |
| scrubbing / finalizing | coordenador (rolagem bruta) | oculta | ocultos | oculto, `inert` | fixed | desligadas | parada (t < OFF) |
| revealing | sai em 0,3s | visível | `entrance.playOnce` | `entrance.playOnce` (+0,15s) | fixed | voltam (0,8s) | parada até OFF |
| ready | escondido, bitmaps liberados | timeline da Visão | visíveis; o pai é da Visão | timeline da Visão (saída 8–28) | fixed até OFF+30, depois absolute | Visão | scrub 0,6 |
| fallback | escondido | visível | entrada ou estado final | visível | como ready | voltam | como ready |

## 7. Evidências (Chrome via DevTools MCP e painel embutido do app; só Chromium)

Página em segundo plano: o rAF foi substituído por um timer de 16 ms para a lógica rodar. As medições de tempo real
(FPS, jank) **não são válidas** nesse ambiente.

- **Fluxo 1440×900:**
  - quadro exato em 20/60/100/140/150/158 svh;
  - pouso em 160, com headline, CTA e logo/menu entrando sozinhos (opacidade 1);
  - voltar a 100 svh mostra a Hero pronta, sem voo;
  - Visão: saída do header 8–28, frases 44–228, passagem em 446;
  - capturas `v2-1440-*`.
- **1280×720, 1366×768, 1920×1080:** quadro exato, pouso confirmado, CTA dentro da tela, header no topo (top 0).
- **Avanço rápido (topo → 205 svh):**
  - desvio para a Hero pronta;
  - palavras e CTA a 1 antes de o pai começar a sair;
  - canvas escondido.
- **Âncora na URL (`#metodo`):** Hero original, sem percurso, 0 pedidos de quadro.
- **Link "Pular para o conteúdo" durante o voo:** desvio para a Hero pronta; o navegador segue a âncora normalmente.
- **404 no manifesto / 404 no último quadro:** Hero original, sem percurso (`docH` 10803, igual sem voo).
- **404 nos quadros 98–102 durante o voo:**
  - fallback com estado final funcional;
  - percurso mantido (544svh);
  - posição de rolagem intacta;
  - `completed: false` (não conta como sucesso).
- **Slow 3G:** a preparação esgota (5 s) e a Hero original aparece, sem percurso.
- **Movimento reduzido:** Hero estática, 0 pedidos.
- **Resize no mesmo quadro (1440→1280):** nova revisão, redesenho, canvas não vazio, 1 canvas, 3 ScrollTriggers.
- **Desktop → 390 → desktop, sem recarregar:**
  - no mobile não sobra nada: header absolute, sem `inert`, sem canvas, total 353;
  - de volta ao desktop: Hero pronta, percurso mantido (444), 0 pedidos novos, 3 ScrollTriggers;
  - o voo interrompido não recomeça.
- **Recarregar com rolagem restaurada:** a visita segue sem voo (Hero original na posição restaurada).
- **Mobile 360/390/430 e tablet 768×1024, local × produção:** mesmos números em `docH`, altura da Hero, total 353,
  transform da águia e frases a 0/20/80/200/330 svh, e handoff. 0 pedidos `/voo/`.
- **Desempenho do motor (indicativo, página em segundo plano):**
  - para frente a 2× a velocidade do vídeo: 100% dos quadros exatos;
  - ré rápida: o último quadro válido fica na tela até no máximo 10 quadros atrás;
  - 130 svh em 0,6 s: índices saltados, como esperado, e termina exato;
  - pico de 124,9 MiB decodificados (orçamento 128); no máximo 2 decodes e 4 downloads simultâneos; 11,5 MiB comprimidos;
  - desenho ≤ 0,2 ms.
- **Console:** sem erros nem avisos.
- **Build:** `node tools/build-site.mjs` gera 271 arquivos (inclui `js/hero-voo.js`).

## 8. Checklist (§114)

| Item | Resultado |
|---|---|
| Quadro segue a rolagem bruta | PASS |
| Sem sombra/atmosfera sobre a ave no voo | PASS |
| Sem bordas apagadas na travessia | PASS |
| Logo/menu/headline/CTA ausentes no voo e entrando sozinhos no pouso | PASS |
| Header fisicamente visível após o pouso | PASS (top 0 em 4 tamanhos) |
| Sem replay depois do pouso | PASS |
| CTA completo antes da saída do pai em avanço rápido | PASS |
| Fallback antes/depois da ativação sem `scrollTo` | PASS |
| Âncora, link de pular, reload restaurado | PASS |
| Mobile/tablet idênticos à produção | PASS (360/390/430/768) |
| Movimento reduzido sem quadros | PASS |
| Cache dentro do orçamento | PASS (124,9/128 MiB) |
| Testes de lógica | PASS (11/11) |
| Pouso sem salto de corpo/cor | **FAIL**: imagens diferentes (§4); decisão do usuário |
| Calibração 140/160/180 por sensação real | NÃO TESTADO |
| FPS / jank / p95 de desenho em GPU real | NÃO TESTADO (painel oculto) |
| bfcache | NÃO TESTADO (só o código: `pageshow` reconcilia) |
| WebGL indisponível | NÃO TESTADO nesta rodada |
| Safari, Firefox, iPhone, DPR 2 em tela real | NÃO TESTADO |
| A/B A–D (§100) | NÃO FEITO: depende da decisão do §4 e de olho humano |

## 9. Não publicado

Nada foi enviado à `main` nem à Vercel. Os commits ficam na branch local `fix/hero-voo-v2`.
