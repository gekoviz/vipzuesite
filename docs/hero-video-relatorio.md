# Hero desktop — voo da águia controlado pela rolagem

Relatório de entrega (§132 do prompt mestre). Branch `feat/hero-voo`. Não houve push nem deploy.

## Arquivos alterados

| Arquivo | O quê | Por quê |
|---|---|---|
| `assets/hero/voo/voo-000.webp` … `voo-240.webp` (novos) | 241 quadros, 1600×890, WebP 0,8 com alfa, 13 MB | O voo recortado do master |
| `assets/hero/voo/manifest.json` (novo) | Lista determinística dos quadros, fps e tamanho | O JS lê a lista; o build copia os quadros por ela |
| `js/hero.js` | Prólogo na timeline existente, camada canvas, carregador, entrada da headline no fim do voo e queda para a Hero original | O controlador (único) |
| `css/hero.css` | Regra `.hero__prologue` (camada absoluta, z 1, sem eventos) | O elemento só existe no desktop, criado pelo JS |
| `tools/build-site.mjs` | Passa a seguir `.json` referenciados (e o que eles citam) | Sem isso, os quadros (nomes montados no JS) ficariam fora do `site-vercel/` |
| `tools/recortar-voo.html` (novo, fora do site) | Recorte reproduzível: master → quadros + manifest | §48. Mesmo algoritmo e parâmetros que geraram os quadros. Nesta forma (seletor de arquivo e de pasta), **não foi executada de ponta a ponta**: os quadros publicados saíram das mesmas funções, rodadas no console |
| `docs/qa/hero-video/*.png` (locais; `docs/qa` é ignorado pelo git) | Capturas antes e depois | Evidência |

Não mudaram: `tokens.css`, `fonts.css`, `config.js`, outras seções, textos, links, cores, shader, easings, durações e a geometria do zoom.

## Breakpoint e isolamento do mobile

- **Desktop real do projeto:** ≥1024 px com movimento. É a mesma fronteira que já separava a Visão desktop do fluxo de cards (`FLOW_QUERY = (max-width: 1023.98px)` em `hero.js` e `@media (min-width: 1024px)` no CSS).
- **Condição do prólogo:** `story && !flow && !prologueFailed`, dentro do mesmo `gsap.matchMedia`. Fora dela, `OFF = 0`, não se cria canvas, não se pede manifest nem quadro, e `--story-h` fica sem estilo inline.
- **Medido contra a versão de antes** (cópia da `main` servida lado a lado):

  | Viewport | Altura da página | Caixas de águia, título e CTA | Canvas | Pedidos do voo |
  |---|---|---|---|---|
  | 360×800 | igual | iguais | — | 0 |
  | 390×844 | igual | iguais | — | 0 |
  | 430×932 | igual | iguais | — | 0 |
  | 768×1024 | igual | iguais | — | 0 |
  | 1023×768 | igual | iguais | — | 0 |

## Master

`IMG_5747.MP4`, mantido em Downloads e fora do repositório:
- H.264, 1928×1072, 24,0 fps constante, 241 quadros, 10,042 s, 13,4 MB.
- Um único keyframe.
- Trilha AAC, descartada: os quadros não têm som.
- Fundo branco (254–255), sem alfa.
- Todos os quadros são úteis: a águia já aparece à esquerda no quadro 0. Saída pela direita por volta de 2,4–3,2 s. Pose frontal estável de 8,8 a 10 s.

## Formato escolhido

**Sequência WebP com alfa, desenhada num Canvas 2D** (rota A do §38):
- **MP4 ficou de fora:** não tem alfa (o branco cobriria o Mocha e o campo de luz) e, com um keyframe só, cada busca por `currentTime` decodifica o filme desde o início.
- **WebM VP9 com alfa ficou de fora:** não é confiável no Safari.
- **Tamanho:** testei o quadro mais pesado em 1928 px (73 KB), 1600 px (56 KB) e 1440 px (48 KB). Escolhi 1600 px a 0,8: total de **13 MB em 242 pedidos** (manifest + 241 quadros, de 11 a 96 KB cada).
- **24 fps mantidos:** é o fps do master.

## Fundo branco e transparência

O recorte foi feito por mim no navegador e não precisou de outro asset:
- alfa pela distância do branco;
- só conta como fundo o claro ligado à borda (inundação), então os brilhos do bico e dos olhos continuam opacos;
- erosão de 1 px no alfa;
- a cor dos pixels de borda vem dos vizinhos internos.

A primeira versão deixava um fio claro de 1 px, que a erosão eliminou.

Conferido a 100% sobre Grafite, Páprica, Mocha e Marfim: sem franja branca na cabeça, bico e olhos. As capturas `depois-1440-*` mostram a águia sobre o campo de luz, sem retângulo.

**Limite:** nas pontas das asas com borrão de movimento sobra um leve tom acinzentado. É o borrão do próprio vídeo; aparece por poucos quadros e em movimento.

## Onde a fase entra

O pin existente é estendido. Não há pin novo, e o palco continua sticky por CSS:
- A timeline de `hero.js` ganha `OFF = 260` svh no início. `at(svh)` passou a ser `(svh + OFF) / TOTAL`; nenhuma duração (`len`) mudou.
- `TOTAL` vai de 244 para 504 só no desktop, e `--story-h` passa a ser `TOTAL + 100svh`, aplicado inline e removido no cleanup.
- A narrativa usa `t − OFF`, e `__vzStory.atmosphere` é publicado já deslocado. Com isso o campo de luz muda de composição nos mesmos pontos relativos.
- **Segmentos** (parametrizados em `PROLOGUE`):
  - 0–200: voo (`introClip`);
  - 200–224: pose final e troca para a águia estática (`holdFinal`);
  - 224: entrada original da headline;
  - 224–260: leitura;
  - de 260 em diante: a Visão como era.
- **Página no desktop:** cresce exatamente 260 svh, só na Hero (1997 px em 1024×768; 2340 px em 1440×900). Medido seção a seção em 1024: as demais têm a mesma altura.
- O fim da Hero continua o mesmo: em 1440, a passagem para a seção 03 acontece em narr 222–242 e a troca em 244.

## Rolagem → quadro e volta

- `quadro = round(clamp(t / 200) × 240)`, com `t` = tempo aplicado da própria timeline (já suavizado pelo `scrub: 0.6`).
- Não há listeners de wheel ou touch nem relógio próprio. O desenho acontece no `onUpdate` da timeline e só quando quadro ou enquadramento mudam.
- Subir a página volta aos quadros anteriores (testado 218 → 205 → 150 → 60 → 150 → 228).
- **Carregamento:**
  - primeiro o manifest, o quadro 0 e o 240;
  - o resto depois do `load`, 6 por vez, a partir do quadro que a rolagem pede;
  - se o quadro pedido ainda não chegou, desenha o mais próximo já carregado e troca assim que o certo chega;
  - `decode()` só numa janela de ±3 quadros, para não manter 241 bitmaps RGBA (~1,4 GB teóricos);
  - os bitmaps já decodificados ficam por conta do cache do navegador. **Memória não medida.**
- **Recarga no meio:** com a rolagem restaurada em 150 svh, a página volta no quadro 180 com a headline oculta. Em 250 svh, volta com a headline e o CTA visíveis.

## Fim do vídeo → entrada original

- A entrada é a mesma função de antes (palavra por palavra, mola de 0,62 s, stagger de 0,07 s; CTA com `vz-emphasized` de 0,7 s logo depois).
- A única diferença: no desktop ela não toca no load. Toca uma vez, quando `t ≥ 224`, isto é, depois do último quadro e da troca para a águia estática.
- `gsap.to` virou `gsap.fromTo` com os mesmos valores iniciais do `set` anterior, para poder partir sempre do estado oculto.
- **Uma vez só (§14):** se a pessoa volta ao voo depois da entrada, headline e CTA não repetem a animação.
  - Ficam inteiros até 12 svh antes da borda.
  - Nesse trecho somem presos à rolagem (`autoAlpha`, então o CTA invisível não recebe foco).
  - Voltam inteiros ao passar a borda de novo.
- **Mesma posição de antes:** título em (109, 290) e CTA em (112, 573, 332×57) a 1440. O contraste é o mesmo da Hero anterior, porque a composição sob o texto é a mesma.

## Troca de águias e passagem para o zoom

- **Pose final:** o último quadro é colocado com os olhos sobre os olhos da águia estática (`VOO_EYES`, pontos medidos no master).
- **Enquadramento:** nos últimos 30 svh do voo, a imagem sai de tela cheia e assenta nesse enquadramento. Em 200–218 as duas trocam por opacidade e ficam inteiras por mais 6 svh.
- **Desvio medido por comparação de pixels** (águia estática redesenhada sobre o quadro 240, busca do menor erro): até 2 px CSS em 1024×768, 1280×800, 1366×768, 1440×900 e 1920×1080. Depois de ajustar a constante, 1 px em 1280×720 e em 1440×900.
- **Diferença de tom:** a águia do vídeo é um pouco mais quente que a estática (erro médio de luminância de cerca de 17 em 255). A troca por opacidade cobre isso.
- A partir de 260 o zoom, as frases e a passagem são as de sempre. Em 1440 a narrativa começa em 262 svh com t = 2.

## O que foi testado de verdade

Os testes rodaram no Chromium do painel do app e no Chrome via DevTools, com emulação de viewport. A aba de teste ficou em segundo plano: nas medições de movimento troquei `requestAnimationFrame` por `setTimeout` (só no teste) para a timeline andar.

- **Desktop:** 1024×768, 1280×720, 1280×800, 1366×768, 1440×900 e 1920×1080. Prólogo montado, quadro 240 no fim do voo e alinhamento medido.
- **Logo abaixo do breakpoint:** 1023×768, igual à versão de antes.
- **Mobile e tablet:** 360, 390, 430 e 768×1024, iguais (tabela acima).
- **Troca de largura ao vivo:** 1440 → 900 → 1440. Na saída, 0 canvas, `--story-h` removido, 0 pedidos novos. Na volta, 1 canvas e os mesmos 3 ScrollTriggers. Nenhum erro no console.
- **Movimento reduzido no desktop** (`prefers-reduced-motion: reduce`, 1440): Hero estática, título e CTA visíveis, nenhum canvas, 0 pedidos do voo.
- **Mídia com falha** (manifest em 404): o prólogo é desmontado e a Hero volta à de sempre (altura 3096 px, a original), com a entrada de sempre (palavras em ~1,2 s, CTA logo depois). Um aviso aparece no console só em localhost.
- **Rede lenta** (Slow 3G): os arquivos da página chegam antes e o manifest só termina aos 17 s. O limite de 8 s dispara e a Hero de sempre fica no lugar. Num 3G lento, então, o voo não aparece; é a escolha segura (§104/§106).
- **Build:** `node tools/build-site.mjs` gera 270 arquivos, com os 241 quadros + manifest (13 MB). `git diff --check` limpo. `node --check js/hero.js` OK.

**Não testado:**
- Safari (macOS e iPhone) e Firefox;
- trackpad e roda de mouse físicos, PageDown e barra de rolagem (a rolagem foi por `scrollTo`);
- tela com DPR 2 real;
- medição de memória e de FPS durante a rolagem.

## Limites e pontos em aberto

1. **Pose final "centralizada":** o §10 pede a águia centrada na composição; o §91, alinhada à referência da Hero antiga. Segui o §91: a pose para exatamente sobre a águia estática (olhos em cerca de 55–60% da largura). É isso que permite a troca sem salto e mantém a coluna do título livre. Centralizar de verdade exigiria mover também a águia estática da Hero. **Decisão do usuário (06/11): manter alinhada.**
2. **Abertura:** no quadro 0 a águia já está entrando pela esquerda e não há headline. A primeira tela do desktop mostra só a águia, o campo de luz e o header. Não acrescentei indicação de rolagem (o prompt proíbe UI nova).
3. **Header:** continua como era, posicionado no topo da página. Sai da tela quando se rola, o que já acontecia antes; não ficou fixo.
4. **Distância da Hero no desktop:** de 344 para 604 svh. São 2 telas a mais de rolagem até a Visão.
5. **Peso:** 13 MB de quadros no desktop, carregados depois do `load`. Uma visita que só passa pela Hero baixa tudo isso.
6. **Nitidez em 1920:** a tela cheia amplia o quadro de 1600 px cerca de 1,2×, e o voo fica um pouco mais macio que a águia estática. Um perfil de 1920 px custaria cerca de 30% a mais.

## Deploy

Nada foi publicado. A branch `feat/hero-voo` é local, sem push.
