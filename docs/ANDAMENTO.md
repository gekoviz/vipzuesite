# Andamento — VIPZUE 2026

## 30/10/2026 — Águia 3D na divisa dos cards (prévia)

**Pedido:** trocar a águia que fica abaixo dos cards pelo modelo `eagle 3d model.glb`, interativa e sem girar loucamente; movimento limpo, seguindo o mouse. Durante o trabalho: "não precisa girar de ponta-cabeça, foque nas laterais" e "deixa do tamanho da águia que estava".

**Modelo:** gerado pelo Tripo. Malha única de ~284 mil triângulos, 3 texturas (~5,7 MB), sem esqueleto nem animação, 14,5 MB no total. As asas não batem: o movimento é do corpo inteiro.

**Feito:**
- `js/eagle3d.js`: three.js 0.160 via jsDelivr, carregado só quando a divisa chega a ~1 tela de distância.
  - A imagem 2D fica até o primeiro quadro 3D; se algo falhar, ela permanece.
  - Enquadramento de 3/4 de frente, com cabeça e garras à mostra.
  - **Com mouse:** vira para os lados até ±22°, com inclinação vertical mínima (±4°) e um leve inclinar das asas na curva, amortecido (~0,4s).
  - **Sem mouse (toque):** a virada lateral acompanha a passagem pela tela (±12°).
  - Flutuação lenta sempre. Movimento reduzido: quadro parado. Só desenha com a águia na tela.
- `css/sections.css`: caixa larga (140% da tela, até 760px), centrada na divisa, com a asa direita saindo pela borda como a águia anterior (cortada na divisa, sem rolagem lateral).
  - As reservas acima e abaixo da divisa e a imagem 2D de espera são dimensionadas pela altura da caixa.
- `index.html`: importmap do three.js, caixa `data-s03-eagle3d`, `<script type="module">`.
- `tools/build-site.mjs` agora copia `.glb`.
- Só abaixo de 1024px, onde existem os cards. No desktop, a águia de perfil aprovada da S03 continua.

**Verificado (Chrome headless):**
- 390×844 e 768×1024 com mouse à esquerda e à direita.
- 3D pronto em ~8s no teste local. Sem erros, sem rolagem lateral.
- Capturas em `docs/qa/aguia3d/`.

**Compressão (autorizada pelo usuário):**
- `gltf-transform optimize`: simplificação (284 mil → 85 mil triângulos), malha meshopt, texturas WebP 1024px.
- 14,5 MB → 0,8 MB. Visual equivalente nas mesmas capturas.
- O 3D fica pronto em 3–4s no teste local (antes ~8s).
- `js/eagle3d.js` passa a usar o `MeshoptDecoder` do three.js.
- O original continua em `Downloads/eagle 3d model.glb`.
- Publicado a pedido do usuário.

## 30/10/2026 — Seção "Como fazemos" (método): nova copy com 4 etapas

**Pedido:** o usuário colou a copy nova do método (Diagnóstico, Estratégia, Construção, Entrega).

**Feito (`index.html`, `css/sections.css`):**
- Texto aplicado literalmente. O título "Como fazemos" foi mantido.
- A frase de abertura ("O que entregamos é uma página. O que a torna estratégica é o propósito por trás de cada decisão.") virou o subtítulo.
- Cada etapa mantém a estrutura existente: número, nome em caixa alta, frase em Gloock e parágrafo.
- Nova 4ª etapa: "Entrega".
- Grade das etapas de 3 colunas para 2 × 2 no desktop e no tablet, porque os parágrafos ficaram longos (~50 palavras). No celular continua 1 coluna.
- Parágrafo até 56 caracteres por linha (antes 40).
- `aria-label` da lista atualizado.

**Verificado (Chrome headless):**
- 1440, 768 e 390: grade correta, sem rolagem lateral, sem erros.
- Capturas em `docs/qa/metodo/`.
- `site-vercel/` remontada. Nada enviado ao GitHub.

## 27/10/2026 — Divisa S03 → S04 sem faixa cinza no iPhone

**Relato (print do iPhone, vipzuesite.vercel.app):** ao rolar para cima ou para baixo, uma faixa de "outra cor" aparecia entre o bege da S03 e o escuro da S04.

**Causa:**
- A volta ao escuro era desenhada no canvas fixo do campo de luz, a cada quadro, pela posição medida da S04.
- No Safari do iPhone a rolagem é composta antes de o JavaScript redesenhar, então a borda pintada chegava atrasada.
- Nesse intervalo aparecia o bege do canvas por baixo do véu de 50% da S04: a faixa cinza. No Chrome do computador a rolagem é sincronizada e não aparecia.

**Correção (`js/light-field.js`, `css/sections.css`):**
- A S04 tem o próprio canvas: o mesmo shader e o mesmo relógio, só a rampa escura, na composição da Hero.
  - Ele fica `sticky` num invólucro do tamanho da seção, a 50% sobre o Carvão opaco (o mesmo véu de antes).
  - A borda superior é a da própria seção e rola junto com a página: não há atraso possível.
- O canvas fixo voltou a ter só a passagem escuro → bege da S03.
- Os dois canvas pausam quando saem da tela. Em perda de contexto, a S04 cai no grafite sólido.

**Verificado (Chrome):**
- O canvas da S04 coincide com o topo e a base da seção (0px de diferença).
- Contraste: 0 falhas em 390 e 768; em 1440, só amostras dentro da própria headline.
- Desktop 1440 idêntico ao baseline. Sem erros, sem overflow.
- Não verificado no iPhone real; é lá que o atraso acontecia.

## 27/10/2026 — Seção 04 com o fundo da Seção 01 (Hero) — substitui a entrada "fundo da Seção 03" abaixo

**Pedido:** "deixa o fundo da seção 4 igual da 1".

**Feito:**
- **Campo de luz (`js/light-field.js`):** ganhou uma segunda frente, de bege para escuro, presa ao topo da S04, com borda nítida como a divisa original entre a S03 bege e a S04 escura.
  - Com a S04 ocupando mais da metade da tela, o campo usa a composição de luz da abertura da Hero, não a do close.
  - O campo segue animado enquanto a S04 está na tela.
- **S04 (`index.html`, `css/sections.css`):** de volta a `surface-dark`, com as cores originais (marfim, champagne na jornada). Com o campo ativo, o fundo é um véu Carvão de 50% sobre ele; sem WebGL, fica o grafite sólido.
  - Medido: os focos de luz do campo chegam a ~149,119,87 atrás do texto. Sem véu, o texto secundário a 75% caía para 2,7–3,3:1 e o rótulo champagne para 2:1.
  - O rótulo "Exemplo" agora usa Champagne Claro.
- **Desfeito:** o degradê na base da águia de perfil do desktop, criado só para o fundo bege contínuo. Com a S04 escura, a divisa volta a ser o fim natural do recorte. Desktop 1440 idêntico ao baseline.
- O CSS da S04 voltou ao estado de antes da entrada "fundo da Seção 03", mais o véu.

**Verificado (Chrome headless com a aba em primeiro plano):**
- Numa aba oculta, o campo pausa (correto) e as capturas saem com um quadro atrasado.
- Contraste medido sobre o fundo real capturado, em várias posições de rolagem:
  - 0 falhas em 390×844 e 768×1024.
  - Em 1440, as 4 leituras abaixo do mínimo eram amostras dentro da própria headline.
- Sem erros no console.
- Evidência em `docs/qa/secao04-fundo/escuro-*.jpg`.
- `site-vercel/` remontada. Nada enviado ao GitHub.

## 27/10/2026 — Seção 04 ("Seu cliente encontrou sua empresa. E depois?") com o fundo da Seção 03

**Pedido:** "coloca o mesmo fundo da seção 03 na seção 04".

**Feito:**
- A S04 deixou de ser `surface-dark` e passou a `surface-beige`. Com o campo de luz ativo, ela fica transparente e mostra o mesmo campo de luz bege da S03 (`css/sections.css`). Sem WebGL, fica no bege sólido #B8AA96.
- O campo de luz continua animado enquanto a S04 está na tela (`js/light-field.js`, que agora também observa `#por-que-importa`).
- **Cores:**
  - Texto em grafite. O secundário também em grafite: o campo tem sombras mais fundas que o #B8AA96, e o marrom #4A372B caía para 3,7–4,3:1 nas letras de 16px. A hierarquia fica no tamanho.
  - Linha e marcadores da jornada passaram de Champagne para Bronze, porque o champagne some no bege.
  - O rótulo "Exemplo" ficou em grafite.
  - Os cards do exemplo continuam escuros (Café) com texto marfim.
- **Desktop:** a águia de perfil da S03 é recortada na base do palco. Com o mesmo bege dos dois lados, o recorte virava uma linha reta. Agora, só quando o palco começa a subir, a base da águia ganha um degradê que cresce com a rolagem, até 30% da tela (`js/scroll-narrative.js`). Com o palco fixo, nada muda: desktop 1440 idêntico ao baseline.

**Verificado (Chrome headless):**
- Contraste medido sobre o fundo real capturado, ao redor de cada bloco de texto, em várias posições de rolagem: 0 falhas em 390×844.
- Em 1440, as duas leituras abaixo do mínimo eram a amostra encostando na própria headline.
- Sem erros no console.
- Evidência em `docs/qa/secao04-fundo/`.

**Pasta `site-vercel` atualizada** com esta versão.

## 27/10/2026 — S02 → S03: cobertura da águia no Safari, saída mais curta, cards sem paradas

**Pedido:** correção pontual, sobretudo no mobile. Três pontos: faixa descoberta na base da S02; percurso longo entre a águia e a headline da S03; cards parados enquanto se rola.

**Medido antes (Chrome, 390×844):**
- O zoom termina em y≈1080 e a 3ª frase some em y≈1680, sem mudança.
- A headline só aparecia em y≈1880: eram ~200px só com a borda difusa da luz (24% da tela).
- Do aparecimento até 25% da tela: 640px (0,76 tela, movimento natural).
- Cada card ficava parado 896, 812 e 373px enquanto as palavras acendiam.

**1. Faixa na base (`css/hero.css`, `js/hero.js`, `css/sections.css`)**
- **Causa:** o palco sticky da Visão tinha `100svh`, mas o campo de luz fixo tem `100lvh`. No Safari, com as barras recolhidas, sobrava abaixo do palco uma faixa (lvh − svh) só com o fundo, sem águia, vinheta e sombra.
- **Agravante:** o asset da águia tem a base transparente. O alfa cai de 0,68 a 90% da altura para 0 na borda, então o próprio desenho termina antes do palco.
- **Correção:** o palco pinta `100lvh`. A caixa da Hero troca 100svh por 100lvh, então a rolagem fica a mesma, e a S03 sobe `−100lvh`, começando onde o palco se solta.
- O conteúdo do palco é ancorado pelo alto em svh. O enquadramento do close usa um medidor de `100svh` (js/hero.js), então o olho não desce quando as barras aparecem. A timeline não é reconstruída a cada gesto da barra.
- A passagem por geometria passou a medir em pixels do palco, e não da janela. Assim a frente plena continua exatamente no topo da S03 com qualquer estado das barras (diferença medida: 0px).
- No desktop, lvh = svh: sem mudança.
- Não reproduzível no Chrome (lá svh = lvh); falta confirmar no iPhone.

**2. Saída S02 → S03 mais curta (`js/hero.js`, `css/hero.css`)**
- Abaixo de 1024px, a borda difusa da luz passou de 24% para 12% da tela (`WIPE_SOFT_FLOW`). Cores e acabamento são os mesmos; só a extensão encolheu.
- A cauda reservada da timeline encolheu junto: no empilhado, `WIPE_LEN` 143 → 129 e `--story-h` 415 → 403svh; no tablet deitado, 122 → 110 e 446 → 434svh.
- A narrativa da S02 (zoom e três frases) ficou intacta nas mesmas posições.
- A headline continua na posição final do layout, sem translate no bloco. A formação por palavra tem no máximo 7px de deslocamento vertical.
- **Depois:** a headline aparece ~120px após a 3ª frase (antes ~200px). Chega a 25% da tela em 600px (0,71 tela). Da 3ª frase à headline no alto: 720px (antes 840px).

**3. Cards sem paradas (`js/scroll-narrative.js`)**
- **Removido:** o plano com patamares (`buildReadingPlan`/`samplePlan`/`PX_PER_WORD`).
- **Novo:** `sampleContinuous`. A composição percorre T = C − H num trecho de T + extra (extra ≤ 25% de T e do palco), com velocidade de 100% nas pontas e ~60% no meio, nunca zero. Trilho = H + T + extra.
- Sem deslocamento interno (T ≤ 1, ex.: tablet retrato) não há sticky: fluxo natural.
- **Progresso de cada card** pela posição na tela (distância virtual): começa com o topo a 88% da tela e termina com a base a 55%. Fases de entrada, luz e palavras sem mudança, assim como `getWordOpacity` e o repouso de 75%.
- **Medido (sem nenhuma amostra parada):**

| Tela | Velocidade da composição | Revelação por card |
| --- | --- | --- |
| 390×844 | 65–100% | 540, 540 e 460px |
| 360×740 | 60–100% | 500, 580 e 480px |
| 320 de largura | 60–105% | 480, 600 e 400px |
| 768×1024 | fluxo natural | 520, 520 e 480px |
| 1000×700 | 85–100% | 420, 420 e 380px |

  - Em todos, a última palavra acende com a base do card a ~50% da tela.
  - A revelação de um card começa enquanto o anterior termina, sempre na ordem 01 → 02 → 03.

**Verificado (Chrome headless, emulação; não é Safari real):**
- Recarga no meio do card 02 cai no mesmo estado. Texto a 125% e rotação recalculam a cena.
- Movimento reduzido: fluxo natural, tudo aceso. Desktop 1440×900 idêntico ao baseline.
- Sem overflow horizontal e sem erros no console.
- Evidência em `docs/qa/secao03-paineis/`: `continuo-390-card0N-{15,50,90}.jpg` (início/meio/fim de cada card), `continuo-390-varredura.json` (amostras a cada 20px) e `passagem-390-antes/depois.json`.
- Não houve gravação em vídeo: a continuidade está comprovada pela varredura de 20 em 20px.

## 26/10/2026 — Seção 03: leitura mais lenta (palco sticky local), sem barras, tipografia do card 03 nos três

**Pedido:** prompt `VIPZUE_S03_Motion_Leitura_Lenta_Sem_Barras_Claude.md`. Três mudanças: devolver a coreografia formação → entrada do card → número/luz → palavras com mais percurso de leitura; tirar as barras e o rodapé; aplicar aos cards 01 e 02 a tipografia do 03.

**Antes (medido):** os cards só acendiam durante a passagem natural da lista. Por card havia ~260px de rolagem para ~30 palavras. O 01 e o 02 eram Switzer 400, e o 03 era 500.

**Agora (abaixo de 1024px, `js/scroll-narrative.js`):**
- **Palco sticky local:** o `.s03__grid` (headline + lista) fica sticky dentro do `.s03__stage`, que vira o trilho.
  - Medidas: C = altura natural do conteúdo; H = min(C, 100svh − 16); T = C − H.
  - Nos trânsitos a composição sobe 1:1 com a rolagem. Nas leituras ela para e o card em foco avança.
  - Trilho = H + T + R, então o fim coincide com a base do conteúdo, sem faixa vazia depois. A águia da divisa continua no mesmo lugar, depois do trilho.
- **Percurso de leitura:** 28px por palavra (`PX_PER_WORD`, a única constante de ritmo; subir para 32 se ainda estiver rápido), limitado entre 45% e 125% do palco.
  - 390×844: 896, 812 e 373px. Antes eram ~260px por card.
- **Progresso local de cada card:**
  - 0–14%: entrada do `<li>` (sobe 16px, escala 0,985 → 1, rotateX 3° → 0) junto com luz, contorno e número.
  - 14–86%: palavras de 75% a 100%, com a distribuição do Word Reveal (0,8 / 0,2).
  - 86–100%: texto completo.
- **Headline:** a mesma formação por palavra, agora entre 98% e 45% da tela. Termina antes de o palco fixar.
- **Palco do tamanho do conteúdo (tablet retrato):** quando o conteúdo cabe na tela, o palco fixa com a headline a 48px do alto, o mesmo respiro da chegada.
- **Fallback:** sem plano possível (palco < 360px ou card maior que o palco), a seção fica em fluxo natural, tudo aceso. O mesmo vale para movimento reduzido.
- **Medição:** só no refresh (`refreshInit` do ScrollTrigger, ResizeObserver, fontes). Por quadro há apenas cálculo numérico.

**Barras:** removidos do HTML o rodapé `.s03__card-foot`, a barra e o preenchimento; removidas também as regras de CSS e o `--r` do JS. O card termina na copy, com o padding já aprovado do corpo.

**Tipografia:** `.s03__text` dos cards usa Switzer 500 nos três, com `font-synthesis: none`, 18px/27px e tracking −0,09px. A exceção do último card foi retirada. O desktop não muda.

**Verificado (Chrome headless, emulação; não é Safari real):**
- Telas: 390×844, 360×740, 320×568, 768×1024, 844×390 e 1000×700.
- Sequência 01 → 02 → 03 sem progresso simultâneo; o card em leitura fica inteiro na tela.
- Fim do trilho na base do conteúdo, com 16px de folga.
- Scroll reverso volta ao estado inicial.
- Recarga no meio do card 02 cai no mesmo estado.
- Texto a 125% e rotação replanejam a cena.
- Movimento reduzido: fluxo natural e tudo aceso.
- A passagem Hero → S03 continua com a headline a 48px da luz.
- Desktop 1440×900 idêntico ao baseline. Sem overflow horizontal nem erros no console.
- Evidência em `docs/qa/secao03-paineis/`: `leitura-390-00…11-*.jpg` (sequência início/meio/fim de cada card) e `leitura-768-card01-fim.jpg`.

**Divergência consciente:** o prompt pede a entrada do card (sobe 16px). Antes, você tinha pedido para tirar um deslocamento de 8px do texto ("o nome fica se mexendo"). Agora o movimento é do card inteiro e só nos primeiros 14% do percurso. Durante a leitura o card fica parado. Se incomodar, é só zerar.

## 26/10/2026 — Seção 03: sem vão na passagem, cards com luz e borda em gradiente, leitura pelo scroll

**Pedido:** prompt `VIPZUE_S03_Correcao_Gap_Gradiente_Motion_Claude.md`. Três correções juntas: tirar o vão vazio entre a Seção 02 (a Visão da Hero) e a Seção 03; dar aos cards a superfície do Course Design Cards (luz no canto superior direito, contorno em gradiente) na paleta VIPZUE; ligar headline → card 01 → 02 → 03 ao scroll.

**Causa do vão (medida, 390×844, antes):** não era espaço no fluxo nem padding duplicado. Era o descompasso entre duas velocidades. No empilhado, a frente de luz era uma fase da timeline da Hero (`power1.inOut`, ~1 tela) e chegava a subir ~2× mais rápido que a rolagem. A seção 03 sobe a 1×. Entre a luz e a headline abria uma faixa bege sem conteúdo, de até ~350px: a headline ficava a 597px com o bege já em ~230px. Em tablet deitado (1000×700), na troca a headline ainda estava a 71% da tela.

**Correção:**
- Abaixo de 1024px, a passagem deixou de ser fase da timeline. A frente de luz agora é presa à posição da própria seção 03 (`js/hero.js`, ScrollTrigger "passage").
- A linha bege plena coincide com o topo da seção, 1:1 com a rolagem e sem scrub. A headline fica 48px abaixo da luz durante toda a passagem, em qualquer velocidade.
- A seção começa onde o palco se solta (sobreposição de 100svh). A cauda da timeline cresceu só o necessário para caber os 124% de tela da passagem:
  - empilhado: `WIPE_LEN` 143, `--story-h` 415svh;
  - tablet deitado: 122 / 446svh.
- Narrativa da Seção 02, Hero e desktop inalterados. O shader não mudou: ele só recebe o mesmo `wipe` por outra fonte.
- Orçamento de espaço: `--s03-top` 48px no celular e no tablet (antes 64/80). Headline → lista 32px; cards a 16px.

**Cards (abaixo de 1024px):**
- Quatro camadas, com HTML novo dentro de cada `<li>`: massa `#141210`; superfície radial no canto superior direito (Marrom → Café → Carvão); camada de luz (Bronze/Café → Café → Carvão); contorno de 1,5px em `padding-box`/`border-box` que clareia para Bronze e, aceso, para Champagne.
- A luz parte de 28% (visível sem hover) e vai a 100% com `--a`.
- Número em pill Grafite: marfim 75% → Champagne Claro.
- Rodapé em fluxo com a linha de progresso (Bronze → Champagne Claro) ligada a `--r`.
- Raio local de 24px no celular e 28px no tablet. Copy em 18px/1.5 e padding de 24/28px.
- Sem datas, avatares, porcentagens ou botões.
- O `<li>` não recebe transform; o tilt (gravitate) passou para o `.s03__card`.
- Não reintroduzi o deslocamento de 8px do card ao acender que o prompt pede: ele foi retirado antes a seu pedido ("o nome fica se mexendo").

**Motion (`js/scroll-narrative.js`):**
- Headline: a mesma formação por palavra (CharacterV1), agora pela rolagem. Ela corre enquanto o topo vai de 98% a 78% da tela e termina antes do card 01; nunca fica abaixo de 75% de opacidade.
- Cards: linha de ativação a 72%. O card seguinte encerra o anterior; o último termina com a base a 55% da tela.
- Fases de cada card: 0–10% luz, contorno e número; 10–94% palavras (repouso 75%, mesma distribuição do Word Reveal) com a linha no mesmo progresso; 94–100% pausa de leitura.
- Cumulativo e reversível; recarga no meio cai no estado certo.

**Verificado (Chrome headless, emulação; não é Safari real):**
- Passagem em 390×844, 430×932, 768×1024 e 1000×700: a frente de luz coincide com o topo da seção em todos os quadros. A headline fica a 48px da luz; na troca, no topo (48px).
- 320×568 e 375×667: Hero estática (regra antiga de altura <700px). A seção vem em fluxo, também com 48px.
- Sequência 01 → 02 → 03 correta, com rolagem lenta e com embalo.
- Recarga no meio da seção: estado imediato. Texto a 125%: remede e não gera overflow.
- Movimento reduzido: tudo aceso e legível.
- Águia da divisa a ≥24px acima e ≥29px abaixo dos cards.
- Sem overflow horizontal e sem erros no console. Desktop 1440×900 idêntico ao baseline aprovado.
- Contraste no pior caso, texto a 75% sobre o centro da luz: 4,55:1. Número: 8,4:1 em repouso e 11,4:1 aceso.
- Evidência: `docs/qa/secao03-paineis/gap-antes-*.jpg` e `gap-depois-*.jpg`.

**Pendente:** validação no iPhone real (barras do Safari mudam a altura visível; a frente segue a posição da seção, mas o momento da troca usa a altura do ScrollTrigger).

## 26/10/2026 — Seção 03: cards no estilo do "course-design-cards" (21st.dev)

**Pedido:** "joga nos card pra ficarem igual" ao componente `course-design-cards`.

**O que veio no pedido:** só a estrutura TSX e as variáveis de cor. O CSS das classes (`.card`, `.progress-bar`…) não veio, então foi reproduzida a linguagem do card:
- superfície escura;
- marcador no alto (o lugar da data);
- texto claro;
- barra de progresso com acento.

**Adaptações à marca e ao conteúdo**
- **Cores:**
  - o fundo do componente (#232228) virou o Grafite Quente #22201D, quase igual;
  - o acento virou Champagne #C3A881, no lugar do verde, laranja, vermelho e azul, que estão fora da paleta.
- **Fora (conteúdo inventado):** data, porcentagem, avatares (fotos de pessoas, removidas em 24/10), "2 days left" e os botões "+" e "…".
- **Barra:** mostra a leitura real de cada card (`--r` = a mesma proporção das palavras reveladas).
- **Tilt (gravitate):** continua; o spotlight voltou aos 15% do componente original, que funcionam no fundo escuro.
- **Estados ao acender:**
  - borda de marfim 8% para Champagne 38%;
  - marcador de marfim 55% para Champagne;
  - véu carvão 45% no pendente;
  - palavras de 75% a 100%.
- **Arquivos:**
  - `index.html`: `.s03__bar` decorativo em cada painel;
  - `css/sections.css`: bloco abaixo de 1024px; marcador e barra ocultos no desktop; removido o arranjo de número acima do texto abaixo de 375px;
  - `js/scroll-narrative.js`: `--r` por painel.

**Validação** (Chrome em emulação, 390×844, 768×1024, 320×568, desktop 1440)
- Sequência igual.
- Águia ≥ 24px.
- Sem overflow e sem erros.
- Desktop idêntico.

**Link:** o túnel foi reaberto (a sessão anterior encerrou os processos): https://joke-either-dat-jean.trycloudflare.com

## 26/10/2026 — Seção 03: tilt nos cards (21st.dev, tom_ui "tilt-card", efeito gravitate)

**Pedido:** aplicar o componente `tilt-card` (efeito "gravitate") aos cards da Seção 03. O pedido anterior, do `be-ui-tilt-card`, foi interrompido pelo usuário antes de qualquer mudança.

**Port, sem React/Tailwind/TS e sem dependências** (`js/scroll-narrative.js` → `bindTilt`, `css/sections.css`):
- **Mesma lógica do componente:**
  - eventos de ponteiro;
  - `rotateX = (py − 0,5) × 2 × limite` e `rotateY = (px − 0,5) × −2 × limite`;
  - `scale3d(1,05)`, `perspective(1200px)`, `transition: transform 0,2s ease-out`, `transform-style: preserve-3d`;
  - spotlight radial de 200% que segue o ponteiro (opacidade 0 → 1 em 0,3s).
- **Valores do demo:** gravitate, 18°.
- **Adaptações:**
  - spotlight branco a 50%, porque o de 15% some no marfim;
  - `pointerdown` já inclina, porque no toque sem arrastar não existe `pointermove`;
  - `pointerup` e `pointercancel` devolvem o card ao repouso, porque a rolagem cancela o ponteiro.
- O conteúdo fica acima do spotlight.
- O progresso dos painéis passou a medir a posição de layout (`offsetTop`), que a inclinação não altera.
- Só existe abaixo de 1024px (onde há cards), com movimento permitido.

**Bug corrigido no caminho** (`css/hero.css`):
- A caixa da Hero (z-index 2) se estende sobre a 03, que sobe por baixo dela, e capturava toques e cliques sobre os cards mesmo depois da troca.
- Agora `.js-story .hero` tem `pointer-events: none` e só `.hero__stage` recebe. O CTA da Hero continua clicável no celular e no desktop.

**Validação** (Chrome em emulação, eventos reais de toque e mouse via CDP)
- **Toque a 390:** o dedo encostado inclina o Painel 02 em −10,8° / 12,6° com escala 1,05 e spotlight visível; ao soltar, volta ao repouso.
- **Mouse a 768:** −8,8° / 10,6°; ao sair, volta ao repouso.
- Sem overflow horizontal.
- Sequência dos painéis igual.
- Sem erros de console.
- **Evidências:** `docs/qa/secao03-paineis/tilt-*.jpg`.
- **Não validado:** iPhone real.

## 26/10/2026 — Seção 03 no celular: sem tela vazia na passagem + texto parado nos cards

**Problemas** (print do iPhone)
- Depois da luz da Hero ficava uma tela bege inteira sem informação: na correção anterior a 03 vinha uma tela inteira abaixo do palco.
- Rolando para cima e para baixo perto da linha de ativação, o texto dos cards subia e descia. Era o deslocamento de 8px do corpo ao acender.

**Correção** (abaixo de 1024px; desktop sem mudança)
- **Passagem mais longa** (`js/hero.js` + `css/hero.css`):
  - No palco empilhado (celular e tablet em retrato) a passagem final da luz dura cerca de uma tela de rolagem: `WIPE_LEN` foi de 34 para 116.
  - Com isso, `TOTAL` = 340 e `--story-h` = 392svh, mantendo a mesma proporção de 0,86svh por unidade. As três frases da Hero têm o mesmo ritmo de antes.
  - O desktop continua com 34 / 258.
- **Seção 03 subindo por baixo da luz** (`css/sections.css`):
  - A seção sobrepõe o palco só durante essa passagem: `--s03-overlap` = 101,5svh − 200px no empilhado e 36svh nas demais telas abaixo de 1024px. Fica visível desde então.
  - As camadas escuras do palco cobrem o que está acima da frente de luz, então a headline e os cards só aparecem sobre o bege, sobem pela rolagem e acendem ao cruzar 82%.
  - Na troca, a headline está a cerca de 30% da altura, com o Painel 01 concluído e o 02 começando.
- **Formação da headline** (`js/scroll-narrative.js`): por tempo, quando ela entra na tela, sem esperar o fim da Hero.
- **Cards:** o corpo não se desloca mais ao acender. Só a superfície, a borda, o número e as palavras mudam.

**Validação** (Chrome em emulação)
- **Telas:** 390×844, 768×1024, 320×568, movimento reduzido e desktop 1440.
- **Passagem e cards:** sem tela vazia entre a Hero e a seção, nenhum texto sobre a parte escura, e o texto dos cards fica parado (mesma posição em todos os estados).
- **Embalo de 900px a partir da frase 3 de 3:** para no meio da passagem, com a headline a 40% e o Painel 01 em leitura.
- **Águia:** ≥ 24px dos cards.
- **Desktop:** idêntico, sem erros.
- **Não validado:** iPhone real.
- **Evidências:** `docs/qa/secao03-paineis/abertura-390-*.jpg`.

## 26/10/2026 — Seção 03 no celular: abertura pela rolagem (substitui a "entrada corrigida" abaixo)

**O que o usuário viu no iPhone:** ao rolar depois da frase 3 de 3, a seção abria rápido demais e o embalo do dedo levava para o fim dela.

**Causa:** abaixo de 1024px a 03 continuava sobreposta ao fim da Hero (`.js-story .next-section { margin-top: -100svh; min-height: 100svh }`).
- Na troca, a headline e os três cards já estavam inteiros na tela.
- O prompt da adaptação mandava não manter margens negativas de viewport, e a fórmula de 82% dele pressupõe cards entrando por baixo.
- A tentativa anterior (cópia fantasma na Hero + painéis redistribuídos) tratava o sintoma: foi desfeita.

**Correção** (só abaixo de 1024px; desktop sem mudança)
- **`css/sections.css`:** `.js-story .next-section.s03 { margin-top: 0; min-height: 0 }`. A seção vem depois do palco da Visão. Quando a luz termina, a headline e os cards sobem pela rolagem.
- **`js/scroll-narrative.js`:**
  - Os painéis usam a fórmula exata do prompt (linha a 82%, `start = topo[i] − linha`, `end = topo[i+1] − linha`; o último, `fim − linha + gap`), sem redistribuição.
  - A headline se forma por tempo (0,9s) quando o topo dela cruza 90% da altura visível, depois que a Hero termina.
- **`js/hero.js`:** voltou ao que era (cópia fantasma, aviso `vz:wipe` e ordem da cópia desfeitos). Corrigido no caminho um `$$` que tinha virado `$` na restauração.
- A seção 03 ficou maior, porque a altura já não se sobrepõe à Hero. Os cards acendem ao longo de ~700px de rolagem a 390×844.

**Validação** (Chrome em emulação: 390×844, 768×1024, 320×568, movimento reduzido, desktop 1440)
- A headline entra por baixo e se forma. O Painel 01 acende ao cruzar 82%, o 02 depois, o 03 por último.
- Embalo de 900px em 250ms a partir da frase 3 de 3: para com a headline no meio da tela, o Painel 01 em leitura e o 02 visível.
- Águia ≥ 24px dos cards.
- Sem erros de console.
- Desktop idêntico ao baseline.
- **Não validado:** iPhone real.
- **Evidências:** `docs/qa/secao03-paineis/entrada-390-*.jpg`.

## 26/10/2026 — Seção 03 no celular: entrada corrigida (tela vazia + headline parada)

**Origem:** dois vídeos do usuário no iPhone mostraram três problemas:
- uma tela bege vazia na passagem da Hero;
- os painéis prontos antes da headline;
- a headline parada no meio da formação quando a rolagem para.

**Decisão do usuário:** não usar o tilt (TiltCard do 21st.dev) nos painéis. No toque ele se desliga, e no desktop a seção não tem cards.

**Correções**
- **`js/hero.js`, cópia da passagem:** a cópia usada na passagem da Visão era clonada de `.next-section__inner`, que não existe mais, e por isso aparecia vazia.
  - Abaixo de 1024px ela clona a headline e os painéis da 03 (classe `s03`, sem `data-s03-*`), na mesma posição que terão quando a seção real assumir. No desktop a cópia continua vazia.
  - É refeita ao cruzar 1024px.
  - Os painéis da cópia só aparecem junto com a headline, porque a luz sobe de baixo e a leitura começa pelo título.
  - Ela avisa `vz:wipe` a cada passo da luz.
- **`js/scroll-narrative.js`:**
  - A formação da headline no celular e no tablet agora é por tempo (0,9s), e não mais por distância de rolagem.
  - Começa quando a luz revela a headline na cópia (ou quando a seção entra na tela, sem a Visão) e se aplica à cópia e à seção real ao mesmo tempo, então a troca não aparece.
  - Voltando para antes disso, a formação se desfaz.
  - A folga até o Painel 01 caiu de 0,14 para 0,04 da altura visível.
- **`css/sections.css`:** na cópia, os painéis ficam no estado pendente, igual à seção real no instante da troca.

**Validação** (Chrome em emulação, 390×844 e 768×1024)
- A headline aparece e se forma junto com os painéis, já está formada antes da troca e nunca fica parada pela metade.
- Na troca não há salto: a cópia e a real ficam no mesmo topo (64/80px).
- A sequência dos painéis está igual.
- Desktop 1440: números idênticos ao baseline, com a cópia vazia como antes.
- **Não validado:** iPhone real.
- **Evidências:** `docs/qa/secao03-paineis/passagem-390-*.jpg`.

## 26/10/2026 — Seção 03 abaixo de 1024px: painéis numerados + águia em voo na divisa

**Pedido:** "Implemente a adaptação da Seção 03…".
- Abaixo de 1024px, a seção vira headline + três painéis editoriais que acendem com a rolagem.
- A águia nova atravessa a divisa com a seção seguinte.
- O desktop (≥ 1024px) foi preservado.
- Link público atualizado com o OK do usuário. O túnel antigo tinha expirado no Cloudflare; o novo é https://salvador-florida-nil-silk.trycloudflare.com, servindo só a cópia de leitura (POST recusado).

**Diferenças entre o prompt e o projeto real**
- **Stack:** o prompt fala em React/Motion, mas o projeto é HTML/CSS/JS com GSAP + ScrollTrigger, que já estavam carregados e são a fonte de rolagem da página. Nenhuma dependência nova.
- **Seção seguinte:** a seção real depois da 03 é "Seu cliente encontrou sua empresa. E depois?" (`#por-que-importa`, fundo grafite), não o Método. A águia atravessa essa junção, que é a real. Na seção seguinte mudou só o `padding-top`.
- **Sequência dos painéis:** no celular, a 03 assume pela passagem da Visão já no topo, com os painéis na tela. A fórmula da linha de 82% faria os três acenderem juntos. Nesse caso, os limites (com as mesmas proporções) são redistribuídos entre o fim da formação da headline e o fim do Painel 03 a 45% da altura visível. Entrando por baixo, vale a fórmula original.
- **Margem negativa da Hero:** o `margin-top: -100svh` da passagem da Hero foi mantido, porque é dela, não da 03.

**Asset**
- `Downloads/IMG_5104.PNG`: 1024×1536 RGBA com transparência real (53% de pixels totalmente transparentes, sem halo branco).
- Fonte em `assets/source/secao03/aguia-voo-1024x1536.png`.
- Publicada como `assets/secao03/aguia-voo-640.webp` e `-1024.webp`, com alfa, em `srcset`/`sizes` e carregamento lazy.

**Arquivos**
- **`index.html`:**
  - os três textos viraram `<ol>` com três `<li data-s03-panel>` (número `aria-hidden` + o mesmo `<p data-s03-scene>`), que servem às duas apresentações;
  - âncora `.s03-seam` de altura zero entre as seções (pos → move → img);
  - o `<head>` liga o palco só a partir de 1024px.
- **`css/sections.css`:**
  - bloco `< 1024px`: painéis marfim, borda de 1px, raio de 12px, véu de 4% e número Switzer 500 com 40px, todos guiados por `--a` (0→1) via `color-mix`;
  - corpo animado com deslocamento de até 8px; a âncora e as reservas: 3.ª seção `0,87 × largura + 40px`, seção seguinte `0,63 × largura + 24px`;
  - abaixo de 375px, o número fica acima do texto;
  - removidos a águia lateral e os blocos de retrato e do celular da versão anterior.
- **`js/scroll-narrative.js`:**
  - `buildPanels`: um ScrollTrigger com três progressos, a formação da headline (o mesmo CharacterV1 do desktop) e a acomodação da águia de −16px a 0 entre 95% e 65%;
  - medição só no refresh (ResizeObserver + fontes);
  - Word Reveal com repouso de 0,75;
  - removido o `fitEagle`.
- O desktop não foi tocado.

**Validação** (Chrome headless, emulação)
- **Telas:** 320×568, 375×667, 390×844, 430×932, 768×1024, 1000×700, texto com zoom de 125% e movimento reduzido.
- **Rolagem:** reversa e rápida.
- **Sequência:** correta em todas.
- **Águia:** a ≥ 24px do último painel e a ≥ 29px do título seguinte.
- **Sem:** overflow horizontal, erros de console.
- **Desktop 1440:** idêntico ao baseline.
- **Não testados:** Safari ou iPhone real, recarga no meio da página, mudança real de orientação.
- **Evidências:** `docs/qa/secao03-paineis/`.

## 25/10/2026 — Seção 03 no celular: texto de volta ao tamanho de leitura, águia sem encostar no texto

**Pedido**
- Headline e texto de volta ao tamanho anterior.
- Águia grande, de baixo até em cima.
- A águia não pode ficar por cima do texto, nem o texto por cima da águia.
- Desktop sem mudança.

**Limite geométrico** (busca exaustiva com a silhueta real do arquivo)
- Num celular em retrato, com o texto nesse tamanho, nenhuma águia que vá do canto inferior até o topo deixa o olho visível sem cobrir palavras. Isso vale mesmo com o texto 30% menor.
- O usuário escolheu "nada sobrepõe".

**Solução** (`js/scroll-narrative.js`, `fitEagle`)
- No celular em retrato, o script calcula a maior águia possível para cada aparelho:
  - o pé passa da borda inferior;
  - o olho fica em cerca de 88% da largura;
  - fica a pelo menos 16px de todas as palavras dos três textos, com folga para a aproximação e a deriva.
- O cálculo usa a tabela da silhueta em 200 faixas, tirada dos pixels do WebP.
- Roda só no refresh (resize, rotação, fontes carregadas), nada por quadro. Grava as variáveis `--s03-eagle-*` na seção.
- As caixas das palavras somam a cadeia de `offsetParent`: no Chrome, elementos transformados viram offsetParent.
- Sem JS ou com movimento reduzido: águia ancorada no pé, abaixo do texto.

**Resultado** (Chrome em emulação)
- 320×568, 360×800, 375×667, 375×812, 390×844 e 430×932 sem colisão, com pelo menos 21px até qualquer palavra.
- A cabeça fica logo abaixo do fim do texto mais longo, e o corpo vai até a borda inferior.
- Desktop inalterado: distância mínima de 70px.
- Removido: o enquadramento "igual à arte" (fonte de cerca de 11px).

## 25/10/2026 — Seção 03 no celular igual à referência + efeitos da águia

**Pedido:** no celular, a composição igual à arte `ref-mobile-1152x1366.png` (em `assets/source/secao03/referencias/`). O usuário escolheu os tamanhos de fonte da arte, e não a versão "legível". O desktop fica como está.

**Medição da arte** (pixel a pixel, convertida em vw, 1vw = 11,52 px da arte):
- **Headline:** Gloock 86,5 px, passo 91, margem 75, primeira linha de base em 264. No celular: 7,51vw com entrelinha 1,052, cerca de 29 px em 390.
- **Texto:** 32,6 px, passo 48, medida de cerca de 600, primeira linha de base em 557. No celular: 2,83vw com entrelinha 1,473 e medida de 52,1vw, cerca de 11 px em 390.
- **Águia, por marcos:**
  - na arte: olho (992, 469) e ponta do bico (689, 534);
  - no asset: olho (744, 541) e bico (325, 631);
  - mesma escala nos dois eixos (0,72);
  - no celular: largura 61,4vw colada à borda direita, bico em cerca de 60% e olho em cerca de 87%.
- **Linhas de base:** posicionadas pelas métricas medidas (Gloock 0,90em, Switzer 1,10em). A comparação lado a lado está em `docs/qa/secao03-aguia/comparacao-mobile-390.jpg`.
- **Altura:** o palco do celular é mais alto que a arte (118,6vw). O quadro fica um pouco acima do centro, e o pé da águia se dissolve, porque o arquivo termina num corte reto.

**Efeitos da águia** (`js/scroll-narrative.js`, todos funções do mesmo progresso da rolagem, reversíveis, em todos os tamanhos):
1. **Chegada:** quando a headline termina de assentar, junto com o Texto 1, a águia converge como as palavras da formação: vem 8% à direita, com rotateY de −9° sob perspectiva e escala 1,04. Na formação e na subida da headline ela ainda não está no palco, porque nos celulares baixos a headline cruzaria a cabeça dela.
2. **Leitura:** aproximação lenta de 3,5%, com transform-origin no olho, e deriva de −1,2% ao longo dos três textos.
3. **Saída:** sobe 18 px e esmaece com a headline.

**Validação** (Chrome em emulação):
- Celular em 320×568, 375×667, 390×844 e 430×932; desktop em 1440×900.
- Nenhuma colisão em nenhum estado. O ponto mais próximo é "de" a 8–10 px do bico, como na arte (cerca de 6 px).
- Contraste do texto: 6,4:1 ou mais.
- Movimento reduzido sem colisão e sem overflow.

## 25/10/2026 — Seção 03: refinamento visual e responsivo + águia da seção

Pedido "REFINAMENTO VISUAL E RESPONSIVO DA SEÇÃO 03". Referências: `Downloads/IMG_5071.PNG` (desktop) e `IMG_5072.PNG` (mobile).

**Asset**
- `Downloads/IMG_5075.PNG`: 941×1672, RGBA, fundo transparente, águia de perfil olhando para a esquerda.
  - Original em `assets/source/secao03/aguia-perfil-941x1672.png`.
  - Publicado como `assets/secao03/aguia-perfil-941.webp` (244 KB, alfa preservado, sem redimensionar).
- `IMG_5074.PNG` (paisagem) olha para a direita. Usá-la exigiria espelhar, o que o pedido proíbe. Guardada em `assets/source/secao03/`, sem uso.
- Pixels visíveis do arquivo:
  - topo da cabeça a 21,8% da altura;
  - ponta do bico em x 34,5%, y 37,7%;
  - olho em ≈ x 78%, y 31,5%;
  - borda direita e borda inferior com corte reto.

**Arquivos**
- `index.html`: `.s03__figure` com a `<img>` dentro do palco.
  - Decorativa: `aria-hidden`, `alt=""`, lazy, `draggable=false`.
- `css/sections.css`: bloco `.s03` reescrito com variáveis locais.
  - Removidos: a grade de 12 colunas da seção, a escala `--s03-close` e o peso 500/600 dos parágrafos.
- `js/scroll-narrative.js`: uma linha. A figura recebe a opacidade de formação da headline.
- Fundo, shader, Hero e outras seções sem mudança.

**Composição por faixa**
- **Desktop ≥ 1024 e tablet em paisagem** (referência desktop):
  - margem de 7vw (exceção local ao container);
  - headline a 25svh, em Gloock 400, 52–60px;
  - texto em Switzer 400, 22–24px, até ~62% da largura;
  - águia com altura 89,5vw, colada à borda direita: bico em ~67% e olho em ~89%;
  - corpo recortado pelo palco.
- **Retrato (tablet e celular) e telas baixas:** a referência mobile (quase quadrada) não cabe com fonte legível.
  - A águia ancora no pé do palco: corpo até a borda inferior, cabeça à direita abaixo do fim da leitura.
  - Tablet: altura min(75svh, 100vw).
  - Celular: altura max(92vw, min(136svh − 660px, 60svh, 132vw)). Com 92vw, o bico nunca alcança a coluna de texto.
- **Mobile:**
  - margem de 24px;
  - headline com 33px a 390, quebrando em "Apenas encontrar / sua empresa não / é suficiente.";
  - texto com 18px a 390 e entrelinha 1,5;
  - coluna de leitura de 66vw − 40px.

**Cor**
- Parágrafos em grafite com alfa local 0,88, em `color` (não em `opacity`).
- Com o token de 0,75, o contraste dava 4,05–4,2:1 sobre o ponto mais escuro do campo bege. Com 0,88, o mínimo medido é 5,2:1.

**Motion**
- Tempos, ranges e efeitos sem mudança.
- Única adaptação: a águia acompanha a opacidade de formação da headline. Sem isso, ela surgiria de uma vez quando a seção assume.

**Validação** (Chrome headless em emulação)
- Viewports: 1920×1080, 1536×768, 1440×900, 1366×600, 1280×800, 1024×768, 1000×700, 834×1194, 768×1024, 430×932, 390×844, 375×812, 375×667, 360×800, 320×568 e 844×390.
- Também: movimento reduzido e zoom de texto de 125%.
- Medido:
  - distância de cada palavra à silhueta visível (alfa × máscara): mínimo de 41px na formação e de 46px no zoom;
  - nenhum overflow horizontal;
  - CLS 0;
  - headline e águia na mesma posição nos três textos e ao rolar de volta;
  - figura nunca passa do fim da seção.
- Capturas em `docs/qa/secao03-aguia/`.

## 25/10/2026 — Seção 03: o mesmo fundo da Hero, na cor bege acinzentado

- **Pedido:** a seção 03 com o mesmo fundo da Hero (mesmo campo de luz), só que na cor do Background Secundário.
  - Pela especificação (UI.02), o Grafite Quente estrutura o universo escuro e o Bege Acinzentado #B8AA96 cria ruptura e respiro.
  - A seção 03 é o principal momento de elevação de consciência: a mudança de fundo tem intenção.
- **Passo intermediário** (mesmo dia): a seção ficou com o campo escuro da Hero. Substituído por este.
- `js/light-field.js`:
  - `field()` calcula o campo de luz uma vez (mesmos blooms, composição do close, Silk, deriva, vinheta e grão nos dois estados).
  - A Hero usa a rampa escura de antes, sem mudança.
  - A seção 03 usa `beigeLab()`:
    - sombras: #B8AA96 com 22% de bronze #8A6A4B;
    - fundo: #B8AA96;
    - luzes: champagne claro #E7D6B7 e marfim #F3EDE3.
  - Removido o preset claro antigo (layouts LD/LM, Silk reduzido, sem vinheta).
  - A passagem escuro → claro de baixo para cima continua igual.
- `css/hero.css` e `css/sections.css`:
  - fallback #B8AA96;
  - texto grafite #22201D;
  - anel de foco grafite.
- **Contraste do texto sobre o campo** (pixels do canvas sob a copy): mínimo 5,7:1 e máximo 11,9:1, em 390×844 e 1440×900. Teste em emulação no Chrome.

## 25/10/2026 — Seção 03, revisão: uma cena com quatro estados (headline persistente + espaço narrativo)

- **Problema da 1ª versão:** cada elemento (headline, P1, P2, P3) era uma cena própria, centralizada no palco, que saía antes da seguinte. Resultado: quatro telas isoladas.
- **Nova estrutura** (`index.html`, `css/sections.css`): um palco sticky com dois territórios na mesma grade.
  - Headline no alto (âncora da tese).
  - Logo abaixo, `.s03__slot`: os três parágrafos na mesma célula, topo alinhado.
- **Linha do tempo** (`js/scroll-narrative.js`, um ScrollTrigger, scrub 0,4):
  - formação no centro do palco, −0,03–0,14;
  - assentamento no alto, 8% menor, 0,14–0,20; a headline permanece até a saída;
  - P1 entra 0,20–0,27, revela 0,25–0,42, leitura plena até 0,47, sai 0,47–0,52;
  - P2 entra 0,505–0,555, revela 0,52–0,69, sai 0,74–0,79;
  - P3 entra 0,775–0,815, revela 0,79–0,93, leitura plena até 0,97;
  - saída 0,97–1 (headline e conclusão sobem 18px e esmaecem para 40%).
- **Referências** (demos abertas no 21st.dev e código conferido):
  - Word Reveal: `getWordRange` / `getWordOpacity` originais (REVEAL_SPAN 0,8, WORD_WINDOW 0,2, linear), com o progresso local de cada parágrafo. Repouso 0,30. Conclusão com 0,76 / 0,24.
  - CharacterV1: x = distância ao centro × k e rotateX proporcional, todas as peças convergindo juntas e sob perspectiva. Por palavra (preserva a Gloock), k = 22px/9px e 3,2°/1,6° (desktop/mobile).
- **Acessibilidade:** texto completo uma vez (visually-hidden) e palavras visuais `aria-hidden`; h2 e p preservados.
- **Tipografia:**
  - Headline assentada: `clamp(3rem, 4.8vw, 5.25rem)` no desktop, `clamp(2.3rem, 10vw, 2.9rem)` no mobile.
  - Parágrafos em Switzer 500, entrelinha 1,28 (mobile 1,26): desktop `clamp(1.75rem, 2.4vw, 2.5rem)`, mobile `clamp(1.6rem, 7.4vw, 1.95rem)` (27,75px em 375; 28,9px em 390; 31,2px em 430).
  - Conclusão em Switzer 600 (o peso disponível mais próximo de 550), maior, entrelinha 1,14, medida 17em.
- **Movimento reduzido ou altura < 560px** (celular deitado): fluxo normal, sem trilho.
- **Verificado** (Chrome headless, emulação; Safari/iOS real não testado):
  - Encaixe no palco em 320×800, 375×667, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×720, 1366×600, 1440×900 e 1728×1117.
  - Recarga no meio, volta, rolagem rápida, resize no meio e celular deitado.
  - Hero e seção 02 sem regressão.
  - Vídeos `revisao-*.webm` em `docs/qa/secao03-narrativa/`.

## 25/10/2026 — Seção 03 "Por que isso importa?": narrativa tipográfica por scroll

- **Conteúdo:**
  - Saíram da seção (estrutura, estilos e regras exclusivas): íris, trio "Negócio + Cliente ideal + Objetivo comercial", "Landing Pages Estratégicas", os dois parágrafos antigos e a premissa.
  - Entrou a copy definitiva: h2 em Gloock 400, dois parágrafos em Switzer 500 e a conclusão em Switzer 600, maior.
  - Mantidos o `id="o-que-fazemos"` (links do menu) e o `data-next` (passagem da Hero e estado claro do campo de luz).
- **Referências:**
  - Os arquivos `.tsx` citados no pedido não vieram anexados.
  - O projeto é estático com GSAP (sem React, Motion ou Lenis). A lógica dos dois componentes foi recriada em `js/scroll-narrative.js`, sem dependências novas.
- **Uma linha do tempo:** um ScrollTrigger (scrub 0,4) sobre a rolagem nativa, num trilho de 420svh no desktop e 460svh no mobile, com um único palco sticky de 100svh.
  - Macro (composição): a headline se forma por palavras que convergem para a posição final, inspirada no CharacterV1 e limitada a ±34px, 16px e 8° (mobile ±14px, 8px e 4°). Palavras inteiras preservam o kerning da Gloock.
  - Cada cena entra, estabiliza e cede o lugar: 0,19–0,25 headline sai, 0,24–0,30 entra o parágrafo 1, 0,47–0,52 / 0,50–0,56 troca para o parágrafo 2, 0,74–0,79 / 0,77–0,83 entra a conclusão.
  - Micro (leitura): revelação por palavra, inspirada em getWordOpacity, com ritmo pelo tamanho das palavras. Opacidade de repouso 0,28 (conclusão 0,24). Intervalos: 0,29–0,43, 0,55–0,70 e 0,82–0,94, com a conclusão visível até o fim.
- **Sem movimento** (movimento reduzido, falha do script em 3s): texto em fluxo normal, inteiro e visível, sem trilho.
- **Hero, seção 02, campo de luz, `hero.js` e `light-field.js`:** sem alteração. A cópia revelada na passagem mostra só a superfície clara, e a headline se forma logo depois.
- **Verificado** (Chrome headless, emulação; Safari/iOS real não testado):
  - Estados em 1440×900 e 390×844.
  - Todos os blocos cabem no palco em 320×800, 360×800, 390×844, 430×932, 768×1024, 1280×720, 1366×600, 1440×900 e 1728×1117.
  - Recarga no meio da seção, volta, saída para a seção seguinte, movimento reduzido.
  - Hero e seção 02 idênticas ao estado anterior; console limpo.
  - Vídeos em `docs/qa/secao03-narrativa/`.
- **Em aberto:**
  - Depois da conclusão entra a seção escura "Seu cliente encontrou sua empresa. E depois?" (`#por-que-importa`), não o Método.
  - Em 320px a headline do CTA final transborda (problema anterior).

## 25/10/2026 — Seção 03 ("O que fazemos"): estado claro do campo de luz (#B8AA96)

- **Sistema reutilizado:** `js/light-field.js` (o mesmo shader WebGL1 Bloom + Silk, o mesmo relógio e o mesmo rAF). Nenhum shader, canvas ou laço novo.
  - O campo escuro original virou a função `darkLab()`, sem mudança de cálculo.
  - Entrou `lightLab()`, com as mesmas fases e a mesma deriva dos blooms, e um uniform `u_state` (frente, borda, Silk do claro, ondulação).
  - Os dois estados se misturam em OKLab. Cada um só é calculado onde aparece.
- **Preset claro:**
  - Base `#B8AA96`.
  - Marfim `#F3EDE3` amplo e fraco atrás da copy, mais um secundário menor.
  - Champagne `#C3A881` pontual no alto.
  - Densidade `#4A372B` e `#22201D` só nos cantos inferiores (no retrato, abaixo da borda).
  - Silk no claro com amplitude 0,55 (Hero: 0,9) e paleta base → champagne → marfim, que só clareia.
  - Sem vinheta no claro. Grão do shader a 60%.
  - Composições próprias para paisagem e retrato.
- **Passagem 222–256svh (a mesma janela da antiga subida do marfim):**
  - Uma frente sobe de baixo para cima, com borda difusa de 24% levemente ondulada pelo Silk.
  - Águia, vinheta do close e faixa do topo se apagam um pouco à frente do claro: máscara `--wipe-hide` no CSS e, na águia ampliada, a mesma linha convertida para as coordenadas dela.
  - O texto da cópia surge sobre o claro já estabelecido. É reversível pela rolagem.
  - `hero.js` publica `__vzStory.wipe` (progresso aplicado da timeline).
- **Arquitetura:**
  - O canvas saiu do palco e virou `canvas.page-light-field`, fixo atrás da página (z-index −1, `100lvh`). Assim continua vivo atrás da seção 03 depois do handoff.
  - Com o campo ativo (`html.has-light-field`), palco e seção 03 ficam transparentes. A seção real fica `visibility: hidden` até assumir (`.is-revealed`).
  - Roda só enquanto a Hero ou a seção 03 estão na tela (IntersectionObserver); as seções seguintes têm fundo próprio.
  - Sem storytelling (movimento reduzido ou tela baixa), a frente é o topo real da seção 03, em quadro estático.
  - Fallback sem WebGL ou com o contexto perdido: Hero de estúdio em CSS e seção 03 `#B8AA96` (a cópia sobe em bege).
- **Light Context na seção 03:**
  - Texto secundário em grafite a 78% (75% daria 4,3:1 sobre o bege).
  - "+" do trio e "Não apenas de layout e estética." passaram de bronze (2,1:1) para marrom `#4A372B`.
  - Copy, tipografia e layout inalterados.
- **Verificado** (Chrome headless, emulação; Safari/iOS não testado):
  - Hero e seção 02: fundo idêntico ao anterior, com relógio congelado. As diferenças estão só no botão animado e no texto em transição.
  - Contraste real sobre o campo vivo (3 instantes): corpo ≥ 4,6:1 em 320×800, 360×800, 390×844, 430×932, 1280×720, 1440×900 e 1728×1117.
  - Ida e volta 02 ↔ 03; pausa fora da tela; movimento reduzido; perda de contexto; 1 canvas; console limpo.
  - Capturas e vídeos em `docs/qa/secao03-light/`.

## 24/10/2026 — Seção 02: atmosfera desde a 1ª frase, Switzer 600 e saída curta

- **Causas encontradas:**
  - A atmosfera do close era a águia indo a 0,3 (118–151svh) mais a vinheta (50–134), e a composição de luz do fundo seguia o zoom (até ~146). A 1ª frase já estava legível em ~54svh, sobre a águia crua.
  - Depois da 3ª frase (fim em 228) havia ~92svh sem mensagem: 12 de espera, 52 de marfim (240–292) e 28 de repouso (292–320).
- **Atmosfera** (janela própria, 14–54svh, `ATMOSPHERE` em `js/hero.js`):
  - Águia 1 → 0,36 e vinheta 0 → 0,55, com `sine.inOut`.
  - O fundo (`js/light-field.js`) lê os marcos publicados em `window.__vzStory` e passa à composição do close na mesma janela.
  - Estável nas três etapas. O zoom e a narrativa mantêm as janelas próprias (6–146 e 44–228).
- **Saída:** marfim em 222–256 (34svh) e handoff em 258. TOTAL caiu de 320 para 258; `--story-h` 420 → 358svh no desktop e 375 → 322svh no empilhado. O zoom contínuo do desktop termina junto com a passagem.
- **Frases:** Switzer 600 (Fontshare passou a carregar 400, 500 e 600; a cópia pública inclui `switzer-600.woff2`), marfim, tracking −0,015em.
  - Cada frase tem dois grupos `.visao-narrativa__line` em bloco: "Páginas estratégicas para / apresentar melhor o seu negócio.", "Para antecipar as dúvidas / dos seus potenciais clientes.", "E conduzi-los / ao próximo passo." A cópia acessível contínua é preservada.
  - Mobile: `clamp(20px, (100vw − 48px)/15,2, 26px)`, entrelinha 1,22 (22,5px em 390). Tablet: `clamp(28px, 3.4vw, 34px)`, bloco de 520px. Desktop: `clamp(32px, 3vw, 42px)`, entrelinha 1,18, bloco de 660px. A linha mais longa mede 14,9em.
  - Resultado: 2 linhas em todas as frases de 360 a 1878 de largura; em 320, a 1ª frase usa 3 linhas.
- **Verificado** (Chrome headless, emulação; Safari/iOS não testado):
  - Estados em 390×844 e 1440×900: transição, etapas 1–3, saída, entrada da seção 03 e retorno.
  - Quebras em 320, 360, 390, 430, 768×1024, 1024×768, 1280×720, 1440×900 e 1878×830.
  - Console limpo; `node --check`.
  - Capturas em `docs/qa/secao02-refino/` (antes-*, final-*). Ritmo em gravação ainda não produzido.

## 24/10/2026 — Ajuste desktop: headline, CTA, narrativa e águia contínua (mobile inalterado)

- **Motivo** (gravação do usuário, área útil ~1878×830): a headline ficava em ~60px (limitada pela altura), espremida à esquerda, com aparência de "mobile adaptado". A águia parava de se mover ao fim do zoom (~45% da cena).
- **Headline desktop:** `clamp(48px, min(4.6vw, 9svh), 84px)`. Resultado: 75px em 1878×830, 66px em 1440×900, 74px em 1600×900, 84px em 1920×1080, 59px em 1280×720, 48px em 1024×768.
- **Posição da águia no desktop:** calculada a partir do espaço da headline (`--face-x` = início do container + 7,7em + 56px + 26% da águia, entre 56vw e 70vw). Em telas largas a águia desliza para a direita; o texto fica a 42–49px do contorno da cabeça em todos os tamanhos medidos.
- **CTA desktop:** padding e fonte acompanham a escala (16–19px; 403×69px em 1878).
- **Narrativa desktop:** bloco de até 640px (antes 480), frases em `clamp(40px, 3.3vw, 60px)` (antes 32–40px) e contador em `clamp(14px, 1vw, 17px)`.
- **Águia contínua (só desktop):** depois do zoom (146svh), a escala segue lenta e linear até o fim da passagem (292svh): s50 → s50×1,14, ancorada no olho (medido 2,91 → 3,05 → 3,15).
- **Mobile conferido inalterado** em 390×844: headline 26,5px, CTA 14px, frases 24px, contador 14px, escala fixa no close.
- Capturas em `docs/qa/ajuste-desktop/`.

## 24/10/2026 — Campo de luz procedural (Bloom Field + Silk num só shader WebGL)

- **Arquivo novo:** `js/light-field.js`, módulo isolado. Um canvas WebGL1 (`.hero__light-field`) no `.hero__bg` do palco sticky compartilhado por Hero e close, com um fragment shader, um triângulo de tela cheia e um único rAF.
  - Substitui `js/aurora.js` e `js/silk.js`, que continuam no projeto sem carregar.
- **Bloom** (onde está a luz): 5 fontes gaussianas com centro, raio, intensidade e fase estática (semente 184). Deriva de (sin(ph·0,55/0,43 + p) − sin(p))·0,035 com ph = t·0,20, zero em t = 0, sem arredondamento.
  - As fontes: bronze principal atrás e ao lado da cabeça; champagne pequeno acima e à direita; café lateral amplo; campo escuro na headline (no close, no texto); volume inferior.
  - Quatro composições (Hero paisagem e retrato, close paisagem e retrato), interpoladas pela proporção da tela e pelo progresso da rolagem (suavizado). Distâncias em lado curto, então círculos não viram elipses.
- **Combinação:** soma com compressão 1 − e^(−1,5x) (sem clipar), multiplicada pelo campo escuro.
- **Silk** (como a luz respira): o laço de `shade()` com 3 iterações e amplitude 0,34. Vira campo de modulação: deformação de 0,05 do domínio e ±12% de luminância.
  - Na Hero a força é 0,9; no close cai para 0,3, para não disputar com as penas.
- **Cor:** rampa em OKLab (constantes calculadas em JS) #141210 → #22201D → #2F251F → #4A372B → #8A6A4B → #C3A881. Vinheta de 0,16 (0,12 no close) e um único grão, o do shader. São 3 uniforms no total.
- **Desempenho:**
  - DPR máximo de 1,5 em mobile e toque, 2 no desktop.
  - Buffer interno a 60% e teto de ~1,3 MP (ex.: 864×540 em 1440×900, 351×760 em 390×844).
  - ResizeObserver só redimensiona o buffer, sem recriar o contexto.
  - Pausa com a aba oculta, fora da tela e após a passagem; para no `pagehide` e retoma no `pageshow`.
- **Robustez:**
  - Perda de contexto: volta às camadas CSS de estúdio (fallback) e, ao restaurar, recompila e continua do mesmo instante.
  - Sem WebGL: o mesmo fallback CSS.
  - Movimento reduzido: quadro estático, atualizado com a rolagem.
- **Verificado** (Chrome headless com SwiftShader, emulação; Safari/iOS não testado):
  - Hero e close em 1440×900 e 390×844; também 360×800, 320×800, 430×932, 1280×720 e 1728×1117.
  - Pausa na passagem, perda e restauração de contexto, movimento reduzido; console limpo.
  - Capturas em `docs/qa/light-field/` (antes-*, v1-*).

## 24/10/2026 — Gradiente mesh na paleta quente

- **Pedido do usuário:** manter o gradiente mesh animado (estrutura do Violet Aurora), com as cores quentes do Silk antigo (referência: a gravação `entrada-390x844.webm`).
- **`js/aurora.js`:** mesmas posições, raios, intensidades e movimento. Cores: night violet → #0B0907 (base); violet → champagne #C3A881; deep violet → bronze #8A6A4B; lavender → #E7D6B7.
- **`css/hero.css`:** fundo #0B0907. A faixa do menu, a atmosfera sob a águia e o apoio da headline voltaram ao escuro quente original (os overrides violeta saíram).
- **Verificado** em 1440×900 e 390×844 (Hero e close na etapa 3): anima, pausa após a passagem e retoma; console limpo. Capturas `docs/qa/aurora/*-quente-*`.
- **Brilho dourado mais forte** (pedido do usuário): intensidades champagne 0,30 → 0,58 e 0,25 → 0,45, bronze 0,35 → 0,50, champagne claro 0,15 → 0,32. Headline legível sobre o apoio de contraste. Capturas `docs/qa/aurora/*-quente2-*`.

## 24/10/2026 — Fundo da Hero e do close: Violet Aurora no lugar do Silk

- **Decisão do usuário:** aplicar o gradiente "Violet Aurora" (21st.dev, mesh) ao fundo do site, ou seja, ao palco da Hero e do close do olho.
- **Implementação:** `js/aurora.js`. Camadas radiais em CSS mais grão em overlay, animadas por requestAnimationFrame (ph = t·0,20, amt = 0,25, fase estática por blob, deslocamento zero em t = 0, sem arredondamento).
  - Pausa com a aba oculta, com o palco fora da tela e após a passagem.
  - Com movimento reduzido, fica em quadro estático.
- **Pilha:** na ordem do gerador, com a intensidade de cada cor. O CSS exportado pela referência ficava quase liso.
- **Estilos:** `.has-aurora` em `css/hero.css` esconde as camadas de estúdio e tem faixa violeta no topo para o menu.
- **Silk:** `js/silk.js` continua no projeto, mas deixou de ser carregado (basta trocar o script em `index.html` para voltar).
- **Verificado** em 1440×900 e 390×844: anima na Hero e no close, para depois da passagem e retoma ao voltar; console limpo. Capturas em `docs/qa/aurora/`.
- **Atmosfera e apoio da headline:** a atmosfera sob a águia e o apoio de contraste da headline (desktop e mobile) passaram para o violeta #140B2E, com as mesmas densidades (`.has-aurora`, no fim de `css/hero.css`).

## 24/10/2026 — Seção 02: fundo restaurado + narrativa em três etapas (substitui a mensagem única)

**Fundo:** o asset é o mesmo arquivo (`aguia-1400/900.webp`), sem filtros novos. O que havia mudado na rodada anterior foi revertido:
- **Opacidade da águia:** tinha ficado 100% opaca no close. Voltou a ir de 1 a 0,3 em 118–151, com os reflexos do Silk aparecendo através.
- **Vinheta:** voltou de 0,35 para 0,55, com o raio da regra original.
- **Enquadramento:** volta ao original — olho ao centro no mobile (fy 0,355, ajuste de +1,5% para a frase não tocar a íris) e à direita no desktop (fx 0,64, fy 0,5).
- **Escala do close no mobile:** passou a ser calculada pelo tamanho do olho na tela (25,7% da largura). Assim a águia maior da abertura não aumenta a ampliação.
- **Gradiente de contraste da mensagem:** removido.

**Narrativa:**
- **Copy:** fonte única nos três `<p data-narrative-phrase>` do HTML:
  - "Páginas estratégicas para apresentar melhor o seu negócio."
  - "Para antecipar as dúvidas dos seus potenciais clientes."
  - "E conduzi-los ao próximo passo."
- **Bloco no alto da cena** (irmão da águia, nunca ampliado com ela): contador "0N / 03" em Switzer 14px, `tabular-nums`, 0,08em; linha de 1px (trilha 0,18 e progresso 0,65 em `scaleX`); frases em Gloock 400 marfim, todas na mesma célula de grid para não haver saltos.
  - Mobile: topo em `clamp(64px, 11svh, 120px)`, largura útil com margens de 24px, `clamp(24px, 6vw, 28px)`/1,16.
  - Tablet em retrato: topo em 10svh.
  - Desktop: topo em `clamp(96px, 14svh, 160px)`, máx. 480px à esquerda do container, `clamp(32px, 2.7vw, 40px)`/1,12.
- **Progresso** (`js/hero.js`, `getNarrativeState`, função pura): calculado no `onUpdate` da timeline existente com o tempo aplicado.
  - Janela narrativa 44–228svh: começa depois da saída da headline (38) com o zoom em curso e termina antes da passagem (240).
  - Três terços: 16% de entrada (8px → 0), leitura estável e 16% de saída (−4px); uma frase por vez.
  - O contador muda na fronteira, com a frase invisível. A linha avança de 0 a 100% e aparece e some com o bloco.
- **Acessibilidade:** no modo animado, um texto contínuo gerado das mesmas frases é lido uma vez, e a apresentação visual fica `aria-hidden`. Contador e linha são `aria-hidden`.
- **Fallback** (movimento reduzido, tela baixa, falha do JS): as três frases em fluxo, sem contador nem linha, sobre um recorte estático do olho.

**Verificado (Chrome headless, emulação; não em aparelho físico):**
- Etapas em 390×844 e 1440×900:
  - t36: nada visível, headline já fora;
  - t74: 01 / 03 e frase 1;
  - t104: troca;
  - t135: 02 / 03 e frase 2;
  - t196: 03 / 03 e frase 3;
  - t226: saindo;
  - t250: oculto.
- Voltando, retorna à etapa 2; o salto direto cai na etapa 3.
- Viewports 320, 360, 450×800, 768×1024 e 1024×768: a frase nunca cruza a íris.
- Movimento reduzido conferido; console limpo.
- Capturas em `docs/qa/secao02-narrativa/`.

## 24/10/2026 — Seção 02 (close do olho): mensagem única

**Implementado (aguardando aprovação visual):**
- **Removidos da cena:**
  - os rótulos Negócio, Cliente ideal e Objetivo comercial;
  - os três anéis, o disco artificial da pupila e a linha de visão;
  - todas as animações desses elementos (desenho, alinhamento, convergência no emblema) e o fade-out da águia.
  - A pupila natural é da imagem e não foi tocada. O emblema e o trio de "O que fazemos" seguem como estavam: aquela seção não foi alterada.
- **Mensagem** (HTML real, um só `<p>`): "Páginas estratégicas para empresas que precisam apresentar melhor o negócio, antecipar dúvidas e conduzir potenciais clientes ao próximo passo."
  - Gloock 400 em marfim; o fechamento ("conduzir potenciais clientes ao próximo passo.") em champagne.
  - Escala local: mobile `clamp(26px, 6.8vw, 34px)`/1.18, tablet `clamp(30px, 4vw, 38px)`/1.16, desktop `clamp(36px, 3vw, 44px)`/1.14; tracking −0,015em; `text-wrap: pretty`.
- **Enquadramento do close:**
  - Mobile e tablet em retrato: olho no terço superior (fx 0,5 / fy 0,3) e mensagem a partir de 56svh, sobre as penas escuras.
  - Desktop: olho à esquerda (fx 0,3 / fy 0,46) e mensagem nas colunas 7–12 (máx. 560px), centrada na altura.
  - A águia continua visível; a vinheta em volta do olho caiu para 0,35.
  - Gradiente de contraste localizado (embaixo no mobile, à direita no desktop), que entra junto com a mensagem.
- **Timeline** (`js/hero.js`): TOTAL 430 → 320svh (`--story-h` 420svh no desktop, 375svh no empilhado). O tempo que sustentava o diagrama foi removido.
  - Fases: aproximação 6–146, close com mensagem até 236, passagem marfim 240–292.
- **Entrada da mensagem:** por estado (`data-state` waiting/visible), calculado no `onUpdate` da timeline com o progresso aplicado do zoom (já suavizado pelo scrub).
  - Mostra com zoom ≥ 0,985 e antes de 232; esconde abaixo de 0,85 ou a partir de 236 (histerese, sem piscar).
  - Bloco inteiro: opacidade e 8px em 500ms `cubic-bezier(0.22, 1, 0.36, 1)`; saída em 150ms.
  - Sem timeout; sincroniza também no refresh do ScrollTrigger (recarregamento e redimensionamento).
- **Sem storytelling** (movimento reduzido, tela baixa ou falha do JS): bloco em fluxo, com recorte estático do olho (`background-position` calculado para o olho) e a mensagem visível.

**Verificado (Chrome headless, emulação; não em aparelho físico):**
- Estados ao longo da rolagem em 1440×900 e 390×844 (oculta a 100, visível a 150 e 200, oculta a 239 e depois; volta ao subir).
- Salto direto para o meio da cena.
- Viewports 320, 360, 450×800, 768×1024 e 1024×768: o texto nunca cobre o olho, sem overflow novo.
- Movimento reduzido em 390 e 1440.
- Console limpo; `node --check` nos JS.
- Capturas em `docs/qa/secao02/`.

## 24/10/2026 — Revisão no iPhone (Safari)

- **Problema:** no iPhone, com as barras do Safari, a águia (posicionada por % da altura) subia sobre o CTA, e sobrava fundo vazio embaixo.
- **Mobile:**
  - Headline 28,9 → 26,5px em 390 (`clamp(23px, min(6.8vw, 4.2svh), 34px)`), começando em header + 8px.
  - CTA com 44px de altura (Switzer `clamp(12.5px, 3.6vw, 14px)`), 16px abaixo da headline.
- **Águia ancorada no fim do CTA:** `--copy-bottom` é calculado só com variáveis, e `--eyes-y = copy-bottom + 20px + 23,4% da altura da águia`. Ela ficou maior (`min(118vw, 70svh)`) e preenche o fundo.
  - Medido: cerca de 23px entre o CTA e a cabeça em 390×664, 375×629, 430×739, 390×844, 360×800 e 320×568.
  - O zoom e o diagrama se recalculam a partir dessa posição. Passagem e retorno conferidos em 390×844.
- **Diagrama:** o disco escuro sobre o olho (pupila) foi removido da cena; ficam os três anéis. O emblema da seção 02 mantém o ponto.
- **Pendente de confirmação do usuário:** onde entra o texto "Landing Pages estratégicas para empresas que precisam apresentar melhor o negócio, antecipar dúvidas e conduzir potenciais clientes ao próximo passo".

## 24/10/2026 — Hero: hierarquia, headline, CTA ShinyButton (ajuste final)

**Base:** prints do usuário (relógio "17:26" como referência de tamanho do logo; faixa verde a liberar para o CTA no mobile; marca azul para o CTA no desktop), no prompt "VIPZUE — Ajuste final da Hero". A marca azul do desktop pareceu acima da headline na foto, mas o texto pede o CTA **abaixo** dela; segui o texto.

**Implementado (aguardando aprovação visual):**
- **Header/logo** (variáveis locais em `.site-header, .menu-overlay, .hero`; tokens globais intactos, porque o rodapé usa `--logo-width`):
  - Mobile: logo 124 → 78px (~14px de altura) e header 72 → 52px; o menu mantém 44×44.
  - Desktop: logo 156 → 140px e header 96 → 84px.
- **Headline** (Gloock 400, texto inalterado):
  - Mobile: 35,1 → 28,9px em 390, `clamp(25px, min(7.4vw, 4.6svh), 38px)`, entrelinha 0,92, tracking −0,03em. Topo em 68px (antes 96). 3 linhas: "Seu negócio pode ter / crescido mais do que / a presença digital dele." até 320px.
  - Desktop: 64 → 62,4px em 1600, entrelinha 0,92, tracking −0,035em. 4 linhas.
  - Manter "presença digital" junta no desktop exigiria −17% ou mover a águia. O contorno da cabeça foi medido em x≈703 (1600), 629 (1440), 560 (1280) e 450 (1024).
  - Tablet em retrato: `min(7vw, 4.8svh)`.
- **Cor:** marfim #F3EDE3; só "presença digital" em champagne #C3A881 (`.hero__accent`, cor sólida, sem sombra, gradiente ou brilho).
- **Contraste:** apoio escuro discreto atrás da headline no mobile (0,62 → 0,52 sob o texto, dissolvendo em 72px). Testado ligado e desligado em dois momentos do Silk (`docs/qa/hero-hierarquia/overlay-*`).
- **Entrada palavra por palavra:** o plugin GSAP SplitText saiu. No lugar, `splitWords()` em `js/hero.js` é equivalente ao SplittingText de referência:
  - segmentos por `/(\s+)/`;
  - palavras em inline-block com `aria-hidden`;
  - texto integral num `.visually-hidden`;
  - slide-up de 20px, mola damping 20 / stiffness 200, stagger 0,07s.
  O destaque e as quebras ficam preservados.
- **CTA "Quero uma Landing Page estratégica"** (`.shiny-cta` em `css/base.css`): adaptação do ShinyButton.
  - Mantido: cápsula, borda conic animada com brilho percorrendo o contorno, textura de pontos, shimmer e respiração no hover.
  - Trocado: azul por champagne e champagne claro sobre café e carvão; Inter por Switzer 500. Shimmer reduzido.
  - Destino real do projeto: `data-cta="whatsapp"` (wa.me quando houver número em `js/config.js`; hoje leva a `#contato`).
  - Foco visível. Com movimento reduzido fica parado.
  - Entra depois da última palavra. Sai com a headline pelo scroll; `autoAlpha` impede clique enquanto está invisível.
- **Posição:**
  - Mobile: CTA a 24px da headline; águia subiu 3svh (`--eyes-y` 50 → 47svh), deixando 46–67px entre o CTA e a cabeça.
  - Desktop: CTA 40px abaixo da headline, alinhado ao logo e à headline, no espaço negativo à esquerda; águia sem alteração.
  - Tablet em retrato: águia 54 → 56svh (36px até o CTA).

**Verificado (Chrome headless via CDP):**
- Viewports: 320, 360, 375, 390, 430, 768×1024, 1024×768, 1280×720, 1440×900, 1600×900.
- Rolagem: a headline e o CTA saem e voltam; o diagrama aparece e a passagem para a seção seguinte funciona.
- Foco por teclado, movimento reduzido e console limpo.
- `node --check` em todos os JS. Não há build, typecheck nem lint (projeto estático).
- **Pendência anterior, fora da Hero:** overflow horizontal de 28px em 320px vindo do título da seção final ("acompanhou?"). Não foi alterado.
- Capturas e vídeos em `docs/qa/hero-final/` e `docs/qa/hero-hierarquia/`.

## 24/10/2026 — Headline reintroduzida na abertura (sem subheadline e sem CTA)

**Texto:** "Seu negócio pode ter crescido mais do que a presença digital dele." É a única headline definida para a Hero (especificação, seção 8.1). A frase da imagem de referência não aparece no projeto e não foi usada.

**Implementado (aguardando aprovação):**
- **Markup** (`index.html`): o `h1#hero-title` voltou a ser visível. As quebras são manuais, com `<br class="br-d">` no desktop e `<br class="br-m">` no empilhado. Subheadline e CTA continuam no `<template>`.
- **Desktop:** 4 linhas na coluna esquerda, centradas na altura e à esquerda da cabeça da águia. Tamanho `clamp(40px, min(4vw, 7.4svh), 76px)`: 64px em 1600×900 (o texto vai até x≈685, antes da cabeça) e 51px em 1280×720.
- **Mobile e tablet em retrato:** composição própria com 3 linhas no topo, acima da cabeça da águia. Tamanho `clamp(30px, min(9vw, 5.6svh), 46px)` no mobile e `min(8vw, 5.6svh)` no tablet.
- **Enquadramento da águia:** no mobile, mantido. No tablet em retrato, `--eyes-y` passou de 48 para 53svh, para a cabeça não encostar na última linha.
- **Contraste:** um apoio escuro discreto atrás do texto (`.hero__content::before`) mantém AA quando um reflexo champagne do Silk passa atrás. No desktop é radial à esquerda; no empilhado é um gradiente no topo.
- **Animação** (`js/hero.js`):
  - Entrada: o `h1` sobe 18px com fade, uma vez.
  - Rolagem (0–40svh, `power1.inOut`): o invólucro `.hero__content` sobe 6% da tela, desfoca até 6px e esmaece até 0.
  - Ela some antes de a aproximação levar a cabeça da águia até a coluna do texto (~30svh, opacidade ≈0,19) e muito antes da íris (123svh).
  - Reversível pelo scrub: volta ao subir.
  - Entrada e rolagem animam elementos diferentes, sem disputa.
- **Movimento reduzido:** headline estática e visível.

**Verificado (Chrome headless, CDP):**
- Desktop 1600×900: estado inicial e saída em 15, 30 e 60svh; na volta, 25 e 0svh (opacidade 1 → 0,80 → 0,19 → 0 → 0,17 → ~1).
- Mobile 450×800: o mesmo percurso.
- Também conferidos: 375×740, 768×1024, 1280×720 e movimento reduzido.
- Sem overflow; console limpo.
- Capturas em `docs/qa/headline/`.

## 24/10/2026 — Ajustes da direção quente (diagrama, passagem, águia)

**Aprovado pelo usuário como base (não definitivo):** a paleta quente, o Silk adaptado, a identidade, a presença da águia, o logo e a navegação.

**Implementado (aguardando aprovação):**
1. **Águia no desktop** (ajuste fino): `--eagle-w` passou de `min(57vw, 128svh)` para `min(54vw, 122svh)` e `--face-x` de 56,5vw para 59vw. A coluna esquerda ficou mais livre para a futura headline. O mobile ficou inalterado, e o espaço superior continua livre de propósito.
2. **Cena de leitura** (desktop): os conceitos passaram de display-md para display-lg, com espaçamento `space-md`. A íris foi para `fx 0.64`, o que equilibra a composição e afasta o anel de "Objetivo comercial". O empilhado (mobile) continua em display-md.
3. **Convergência** (`js/hero.js`): as palavras viajam em bloco, sem defasagem, e nada se cruza no caminho.
   - Desktop: as palavras pousam primeiro (350–378); depois a íris vai para a esquerda por baixo da linha do trio e só no fim sobe ao emblema (362–390).
   - Mobile: a ordem se inverte, com a íris primeiro (350–378) e depois as palavras (362–390).
4. **Passagem para a seção clara:**
   - A superfície marfim começa a subir junto com a convergência (360–412, antes 372–422), então a tela não fica escura e vazia sob o trio.
   - A borda difusa ficou mais curta (`WIPE_SOFT` caiu de 24% para 12%).
   - Cada bloco de texto da seção 02 na cópia (emblema e trio, título, parágrafos e premissa) só aparece quando o marfim pleno já passou do seu topo (`applyWipe`, rampa de 60px). Assim, nenhum texto fica sobre a faixa intermediária.
   - As versões claras de íris e palavras saem em 386–396.
5. **Headline e CTA:** continuam fora da Hero, e a simulação anterior foi descartada. O botão champagne com luz circulante segue implementado (`.btn--primary-dark`), sem ser exibido na Hero.

**Verificado:**
- Desktop 1600×900: abertura, aproximação, leitura, convergência, passagem e "O que fazemos".
- Mobile 450×800: os mesmos pontos.
- Reversão: ao voltar para a leitura, as palavras ficam visíveis e o texto da cópia fica oculto.
- Sem overflow.
- O console só registra o favicon ausente (404), que já existia.
- Capturas em `docs/qa/quente-v2/`.

## 24/10/2026 — Direção quente (referências desktop 1600×900 e mobile 900×1600)

**Implementado (aguardando aprovação visual):**
- **Silk sem violeta** (`js/silk.js`). A estrutura técnica e os parâmetros do shader ficam iguais; só a paleta mudou para tons quentes VIPZUE: #0B0907 → #17110C → #C3A881 (champagne) → #17110C → #0B0907. O fundo de espera (`.has-silk .hero__bg`) também passou a #0B0907. Uma faixa escura no topo (`::after`) mantém o menu legível quando um reflexo passa atrás dele.
- **Águia** (`css/hero.css`): mesmo PNG oficial, proporção 1043×1377 preservada.
  - Desktop: lado direito, cabeça no terço superior, corpo preenchendo o canto inferior direito. Valores: `--eagle-w: min(57vw, 128svh)`, `--face-x: 56.5vw`, `--eyes-y: 36svh`.
  - Mobile: enquadramento próprio, com a cabeça à direita na metade da tela e o corpo entrando por baixo, sem cortar olhos ou bico. Valores: `min(106vw, 62svh)`, `63vw`, `50svh`.
  - Tablet em retrato: `min(100vw, 68svh)`, `66vw`, `48svh`.
  - A aproximação até o olho se recalcula sozinha (`measure()`).
- **CTA principal** (`.btn--primary-dark` em `css/base.css`; token `--radius-pill` em `css/tokens.css`):
  - visual: cápsula de fundo café escuro, borda champagne de 1px, texto marfim e brilho quente sutil;
  - luz contínua: um ponto de luz percorre a borda, num anel cônico com máscara e `@property` que dá uma volta em 6s;
  - sem animação com movimento reduzido nem no CTA desativado (sem WhatsApp configurado);
  - vale para o CTA do menu, o CTA final e o CTA guardado no `<template>` da Hero;
  - **desvio registrado:** o UI.08 previa raio 10 e preenchimento champagne; a mudança segue decisão do usuário.
- **Correção encontrada no teste** (`js/hero.js`): ao recarregar a página no meio da Visão, a entrada devolvia a águia sobre o diagrama. A entrada agora anima a `<img>`, não o invólucro que a timeline de rolagem controla.
- **Não feito, conforme o pedido:** headline e CTA continuam fora da Hero, no `<template>`.
  - Na simulação de QA (`desktop-1600x900-simulacao-titulo-cta.jpeg`), o título antigo de 3 linhas a 120px invade a águia.
  - Ao reintroduzir, ele precisa ocupar uma coluna à esquerda (~6 colunas, ~80px), como na referência.

**Verificado (Chrome via DevTools):**
- 1600×900: abertura, aproximação, diagrama e passagem para a seção 02.
- 450×800 (DPR 2): abertura, diagrama e CTA do menu animado (dois quadros, a luz no topo e depois na base).
- Movimento reduzido: Silk estático e CTA sem animação.
- Sem overflow; console limpo.
- Capturas em `docs/qa/quente/`.

## 24/10/2026 — Background Silk (WebGL1) na Hero e no diagrama

**Fonte:** "Calm Violet Silk Shader Hero Background" (DHxWhy, licença MIT), obtido do registro do 21st.dev com a chave gratuita do usuário (`API_KEY_21ST` do ambiente; nada pago).
- Arquivo de implementação: `components/ui/calm-violet-silk-shader-hero-background.tsx` (não o Usage).
- **Correspondência conferida:** o `main()` é idêntico ao trecho colado pelo usuário. As cores são #140B2E, #3C02A4, #6D4AFF, #3C02A4, #140B2E (`colorCount 5`) e o cursor já vinha desativado.

**Implementado (aguardando aprovação visual):** `js/silk.js`.
- React → JavaScript nativo; VERT, FRAG e UNIFORMS extraídos por script, sem redigitar; atribuição MIT no cabeçalho.
- Um canvas WebGL1 no fundo do palco (`.hero__bg`), montado uma vez e contínuo da abertura até o fim do diagrama.
- Cursor desativado: sem listeners de ponteiro, presença 0; `pointer-events: none`.
- DPR máximo 2, mais o teto original de 2 megapixels.
- Pausa quando:
  - a aba fica oculta;
  - o palco sai da tela;
  - o palco é entregue à seção 02 (`is-handed-off`).
  Retoma ao voltar.
- Movimento reduzido: um quadro estático, sem loop.
- Fallback: se o WebGL ou o shader falhar, o fundo CSS de estúdio continua.
- Limpeza de recursos no `pagehide`.
- Com o shader ativo, as camadas de estúdio (luz, brilho, sombra, vinheta, grão) saem para preservar as cores originais. A atmosfera de base sob a águia e o túnel do diagrama permanecem.

**Verificado (Chrome via DevTools, WebGL por GPU):**
- 1440×900: abertura, aproximação, diagrama e passagem.
- 390×844 (DPR 2): abertura e diagrama.
- 390×844 com DPR 3 e movimento reduzido: canvas em 2×, sem loop.
- O canvas renderiza durante a Visão, para no fim (handoff) e nas seções seguintes, e retoma ao voltar ao diagrama. Nenhum canvas fora da Hero.
- Sem overflow; console limpo.
- Capturas em `docs/qa/silk/`.
- **Não testado diretamente:** pausa por aba oculta (lógica igual à do original) e desempenho em aparelho físico.

**Ponto de identidade, para decisão do usuário:** o preset é violeta e diverge da paleta quente oficial (grafite, café, champagne). As cores foram mantidas conforme instrução explícita.

## 24/10/2026 — Revisão do scroll inicial V3 (Hero, águia, permanência do diagrama)

Base: vídeo `REFERENCIAS/IMG_0380.MP4` (32,4s; quadros extraídos) e dois prints do usuário: "essa parte seria ideal ficar mais tempo" (diagrama) e "em vez de chegar e explodir aqui" (círculo branco). No vídeo, a abertura inteira passa em ~7s de rolagem e o diagrama fica visível ~2s.

**Implementado (aguardando aprovação visual)**
1. **Hero sem headline, subheadline e CTA.**
   - A copy foi preservada em `<template data-hero-copy>`: não renderiza, não ocupa espaço, não recebe foco nem cliques.
   - O título da página continua como `h1` visualmente oculto (`#hero-title`), para leitores de tela.
   - Header e navegação mantidos.
   - A divisão da headline em palavras (para a máscara) saiu do JS e volta quando a headline for reintroduzida.
2. **Águia reenquadrada pelo rosto** (`--face-x` = centro do rosto, 45% da largura do arquivo; `--eyes-y` = linha dos olhos):
   - desktop: 118svh de altura, centralizada, olhos a 42svh;
   - tablet em retrato: `min(92vw, 62svh)` de largura, olhos a 38svh;
   - mobile: `min(118vw, 56svh, 560px)` de largura, olhos a 40svh.
   - Aproximação recalibrada (escala 1,6 → 2,9 no desktop).
3. **Diagrama com permanência.** Timeline reescrita em svh de rolagem (`TOTAL = 430`; palco de 530svh no desktop e 470svh no empilhado):
   - composição completa aos 219svh e estável até 350svh (~130svh de permanência);
   - convergência ao emblema entre 350 e 390;
   - fundo contínuo: a luz da parede acompanha a câmera e fica atrás da íris; o túnel escurece só até 55% (antes ia a 100%).
4. **Fim sem explosão.** O círculo `clip-path` que se expandia foi substituído por uma luz marfim que sobe com borda difusa (máscara vertical de 24%) entre 372 e 422svh. Íris e palavras já pousaram no emblema e no trio antes da luz chegar; a borda troca a cor de cada elemento ao passar.

**Pendência técnica — item 04 (background Silk / WebGL): NÃO implementado**
- O shader completo não está disponível. A página pública do 21st.dev mostra só um trecho parcial e exige "Unlock the shader code". O trecho colado na conversa começa no meio de `main()`.
- O MCP `21st` está configurado apenas no projeto VIPZUE DFN (com chave de API) e não está conectado a esta sessão.
- Para implementar sem inventar código, falta:
  1. o cabeçalho do shader (`precision`, declarações de `u_resolution`, `u_time`, `u_colors` e dos uniforms empacotados `u_scene`, `u_shape`, `u_surface`, `u_finish`, `u_transform`, `u_space`, `u_cursor`, e como se desempacotam em `u_scale`, `u_rotate`, `u_offset`, `u_drift`, `u_warp`, `u_detail`, `u_seed`, `u_blur`, `u_contrast`, `u_saturation`, `u_hue`, `u_brightness`, `u_vignette`, `u_grain`, `u_cursor*`);
  2. o comentário de cabeçalho com os VALORES dos parâmetros e das cores do preset "Calm Violet Silk";
  3. as funções `fbm`, `palette`, `shade`, `hueRotate`, `grainHash` (e o ruído base);
  4. o início de `main()` (`screenUv`, `p`, `uv`, cursor).
- Observação de identidade: o preset é violeta. Quando o código chegar, as cores precisarão ser avaliadas frente à paleta VIPZUE antes de qualquer troca, que precisa da sua aprovação.
- A estrutura já comporta o canvas: camada de fundo do palco (`.hero__bg`), que termina com a cena no fim da Visão.

**Arquivos modificados:**
- `index.html` (copy da Hero em `<template>`, `h1` acessível);
- `css/hero.css` (enquadramento da águia, altura do palco, máscara da passagem);
- `js/hero.js` (timeline em svh, permanência, passagem por luz);
- `REFERENCIAS/IMG_0380.MP4` (cópia) e `docs/referencias/quadros/sheet-0380.jpg`.

Seções 02–08, menu, FAQ, fontes, logos e componentes não foram alterados.

**Verificado** (Chrome headless via DevTools Protocol, script em scratchpad; o MCP de DevTools não conectou nesta sessão):
- **1440×900:** 12 estados de 0 a 432svh. Águia de 804×1061px com olhos a 42%; diagrama idêntico entre 230 e 345svh; passagem sem flash.
- **1280×720:** abertura, diagrama e passagem.
- **390×844 e 360×800:** águia própria (460×608 e 425×561), cabeça inteira; diagrama vertical; passagem legível.
- **Reversibilidade** (1440, descendo vs. subindo, de 60 a 415svh): diferença máxima de 0,18. A volta ao topo restaura o estado inicial.
- **Movimento reduzido:** Hero estática de 900px, sem camadas da Visão.
- Sem overflow horizontal e console sem erros em todos os casos.
- **Correção feita durante o QA:** as versões claras do trio e do emblema agora saem entre 398 e 414svh, porque antes ficavam claras sobre claro na faixa de transição do mobile.
- **Não medido:** desempenho de quadros desta versão. O Chrome headless usou renderização por software, cujos números não representam o aparelho real. A passagem anima uma máscara (repinta a camada 02); medir em navegador real.

## 24/10/2026 — Landing Page completa V1 (estrutural)

**Decisão do usuário:** construir a página inteira de uma vez para avaliar ritmo e estrutura (vale só para esta V1). Correção durante a execução: remover tudo relacionado às pessoas (fotos e menções). **Estado: implementada e verificada, aguardando aprovação visual.** Hero/Visão preservadas.

### Seções
| Seção | Superfície | Composição |
| --- | --- | --- |
| 01 Hero + Visão | carvão (escuro) | preservada; só integração |
| 02 O que fazemos | marfim | topo revelado pela Visão; acrescida a premissa "Partimos do negócio, do cliente e do objetivo. Não apenas de layout e estética." (proposta derivada de 8.3) |
| 03 Por que isso importa? | grafite | headline da fonte, jornada Descoberta → Informação → Confiança → Contato (diagrama HTML/CSS com as perguntas da fonte), frase de atrito, exemplo da clínica em dois cards café (rotulado como exemplo) |
| 04 Método | marfim | "Como fazemos" + 01/02/03 com numerais Gloock bronze, linha de progressão e listas da fonte em texto corrido |
| 05 Para quem é | bege | título fixo à esquerda (desktop), 6 situações da fonte em lista com títulos curtos (títulos: proposta) |
| 06 CTA final | carvão | headline e subheadline da fonte, CTA e nota de fricção (nota: proposta) |
| 07 FAQ | marfim | accordion acessível com 6 perguntas respondidas a partir do documento |
| 08 Footer | bege | UI.12: logo escura, Instagram, WhatsApp, Privacidade, Termos, copyright |

### Arquivos
- Novos: `css/sections.css`, `js/sections.js` (destinos, accordion, entradas), `js/config.js` (WhatsApp, Instagram, Privacidade, Termos).
- Alterados: `index.html` (seções 02–08, classe `js-reveal` no head), `css/tokens.css` (espaçamento de seção mobile 80px), `tools/preparar-assets.html`.
- Removidos: `assets/source/equipe/` (fotos), por decisão do usuário.

### Decisões técnicas
- Componentes reutilizados: `.btn` (primário escuro, estado `aria-disabled`), utilitários `.t-display-*`, `.t-body-lg`, `.section` e superfícies `.surface-dark/-ivory/-beige` com `--text-2` e `--rule`.
- Contraste (medido, todos AA):
  - texto secundário sobre bege e copyright usam marrom `#4A372B` (4,93:1), porque grafite a 75% daria 4,3:1 e a 55% daria 2,8:1 (AUDITORIA §B);
  - foco em superfícies claras com anel grafite.
- Destinos: sem dado real, o CTA final fica indisponível (`aria-disabled`, sem `href`); CTAs da Hero e do menu levam a `#contato`; links do footer sem `href` (não focáveis, não simulam páginas).
- Motion: entradas simples (opacidade + 16px, 400ms, curva emphasized) via IntersectionObserver, escalonadas em 80ms por grupo; nada fixado além da Visão; seção 02 sem entrada própria (precisa coincidir com a cópia revelada pela pupila).

### Verificado (Chrome via DevTools)
- 1440×900, 1280×720, 1024×768, 834×1112, 390×844 e 360×800: sem overflow horizontal em nenhum.
- FAQ: clique, setas, Home/End, `aria-expanded` e `hidden` sincronizados.
- Menu mobile: 4 links chegam ao topo exato da seção, fecham o overlay e liberam a rolagem.
- Rolagem completa (todas as entradas disparam) e volta ao topo com a Hero intacta.
- Movimento reduzido: todo o conteúdo visível, sem fixação.
- Contraste de 22 estilos de texto: todos AA. Console sem erros.

### Pendências
- **Comerciais:** número do WhatsApp e mensagem inicial (há proposta em `js/config.js`); URL do Instagram; páginas de Privacidade e Termos.
- **FAQ sem resposta autorizada** (não publicadas): prazo de desenvolvimento; o que fornecer para começar; o que está incluído; o que acontece depois da entrega. Garantia só se houver política real.
- **Copy proposta, a validar:** premissa da seção 02; títulos curtos das 6 situações; nota do CTA; respostas do FAQ (derivadas do documento).
- **Assets:** águia HD; logo SVG; ícone oficial do WhatsApp (usado o `message-circle` do Lucide).

### Oportunidades futuras de direção de arte e motion
- 03: jornada com objeto atravessando as etapas (referências ROSSO/POUR) e as perguntas da clínica revelando-se como mensagens.
- 04: progressão 01→02→03 controlada pela rolagem, reaproveitando a linguagem da íris.
- 06: retorno da íris/águia como fecho visual da narrativa "Visão → contato".

## 23/10/2026 — Visão implementada (cenas 02 e 03)

Conceito aprovado pelo usuário ("Aprovo o conceito Visão. Pode implementar."). **Implementação aguardando aprovação visual.** A cena 01 (Hero v2 aprovada) não mudou.

**O que foi feito**
- Palco sticky de 380svh (340svh no empilhado). Timeline mestre GSAP com scrub de 0,6s (`js/hero.js`):
  - 0–22%: a cena 01 sai;
  - 2–52%: câmera até o olho direito da águia (origem medida no arquivo: x 0,562, y 0,234);
  - 44–60%: íris SVG de três anéis desenhada sobre o olho, com as palavras Negócio, Cliente ideal e Objetivo comercial;
  - 56–82%: anéis giram até alinhar as aberturas, palavras convergem e a linha de visão é traçada;
  - 82–96%: íris e palavras vão ao emblema e ao trio da seção 02, e a pupila abre como diafragma (`clip-path`) mostrando uma cópia inerte da seção 02.
  - No fim, a seção real (idêntica) assume e fica interativa (`is-handed-off`).
- Seção 02: emblema (íris alinhada) + trio "Negócio + Cliente ideal + Objetivo comercial" (conteúdo-base 8.3). Com movimento reduzido, esse é o estado estático.
- Anéis desenhados como `<path>` com início explícito e abertura em unidades próprias. `vector-effect` e `pathLength` foram descartados porque deslocavam a abertura conforme a escala.
- Desempenho:
  - ajuste tonal da águia gravado no WebP (`tools/preparar-assets.html`) em vez de `filter` CSS;
  - sem máscara na águia durante a Visão;
  - camadas animadas promovidas.
- Mobile e tablet em retrato: uma palavra acima e duas abaixo da íris, eixo vertical, giro de 90° na chegada ao emblema.

**Verificado (Chrome via DevTools)**
- Estados de 0 a 100% em 1440×900; estados principais em 1280×720, 768×1024 e 390×844.
- Reversibilidade numérica: descendo e subindo, diferenças até cerca de 2px nos pontos válidos; o estado inicial é restaurado exatamente.
- Troca para a seção real: diferença média de 3/765 por pixel; o texto do corpo fica 1px mais baixo apenas em posição de rolagem fracionária.
- Desempenho em 1440×900:
  - 2ª passada: 60fps estáveis (máximo 17ms), sem tarefas longas e CLS 0;
  - 1ª passada: 6 travadas pontuais de rasterização inicial;
  - CPU 4× mais lenta: mediana de 60fps, p95 de cerca de 30fps, travadas isoladas (até 333ms) na abertura da seção.
- Movimento reduzido: Hero estática e seção 02 com emblema alinhado.

**Limitações e pendências**
- A águia em 3,2× usa o arquivo de 1043px: fica suave no zoom máximo; `aguia-hero-hd.png` (2400×3200) resolve.
- `aguia-olho-macro.png` (opcional) não foi recebido; a íris assume o centro sobre o olho fotográfico.
- Não testado em Safari/iOS, Firefox ou aparelho físico.
- Pendências anteriores continuam: WhatsApp, logo SVG.

## 23/10/2026 — Proposta da experiência cinematográfica V2 (somente planejamento)

- Os cinco vídeos de `REFERENCIAS/` foram decodificados e amostrados; os quadros com tempos estão em `docs/referencias/quadros/`.
- Proposta completa em `docs/PROPOSTA_EXPERIENCIA_CINEMATOGRAFICA_V2.md` (conceito "Visão": águia → olho → íris de três anéis → alinhamento → pupila revela O que fazemos).
- `tools/dev-server.mjs` passou a aceitar requisições Range (necessário para buscar quadros de vídeo). Nenhum código da Hero foi alterado.
- **Estado: aguardando aprovação.**

## 23/10/2026 — Hero v2 (direção de arte refeita)

**Motivo:** v1 tecnicamente funcional, mas com fundo genérico, tipografia sem presença editorial, espaçamentos pouco refinados e relação texto/águia/fundo fraca (avaliação do usuário).

**Decisões do usuário (23/10):**
- Exceção local de escala aprovada: headline monumental de 112–120px no desktop grande, reduzida em notebooks e telas menores.
- Headline inteira em marfim; sem destaque champagne.
- Aprovados: headline em 3 linhas, águia emergindo atrás da última linha, fundo low-key de estúdio, sem arco, sem paisagem, legenda e CTA na base esquerda, composição assimétrica com profundidade.

**Estado: APROVADA pelo usuário em 23/10/2026** ("Aprovo a Hero v2"). Pendências que não bloqueiam: destino real do CTA (WhatsApp), águia em resolução maior e logo em SVG.

**Implementado:**
- Headline `clamp(52px, min(8.3vw, 12.6svh), 120px)`: 120px em 1920×1080, ~113px em 1440×900, ~91px em 1280×720; tablet em retrato `min(9vw, 12.6svh)`. Quebras fixas medidas em Gloock: "Seu negócio pode ter / crescido mais do que / a presença digital dele." Mobile (<768px) em quebra natural balanceada. Recuo óptico de −0.045em alinha o "S" ao logo.
- Águia: 108svh no desktop, topo da cabeça calculado pela posição real da última linha (`--eagle-top`, via JS; fallback em CSS) e ajustado por `--eagle-offset`. Texto na frente, águia no plano do meio.
- Fundo: parede grafite com queda para carvão, luz principal bronze/marrom superior-esquerda da cabeça, brilho rasante, sombra difusa atrás do corpo, vinheta e micrograin em soft-light. Atmosfera carvão na base para o peito afundar no ambiente. Arco removido.
- Legenda (subheadline 4 colunas + CTA) ancorada na base esquerda, 64px da borda inferior no desktop.
- Scroll readaptado: headline sai pela máscara linha a linha (−150% + opacidade), legenda desce e some, águia sobe para o espaço liberado (escala 1.08; 1.06 empilhado), luz acompanha com 60% do deslocamento; frases da subheadline entram na base esquerda; etapa 3 inalterada (seção 02 sobe, águia recua e escurece).

**Verificado (Chrome via DevTools):** 1920×1080, 1440×900, 1280×720, 768×1024, 390×844; rolagem 14/20/32/45/70% e retorno ao topo em 1440×900; etapa 2 no mobile; reduced motion; sem overflow horizontal; console limpo.

## 23/10/2026 — Hero v1 (protótipo visual + scroll storytelling)

**Tarefa ativa:** primeira versão da Hero (Header integrado + Hero). As demais seções não foram desenvolvidas; a seção 02 aparece apenas como área de passagem com o conteúdo-base do original (8.3).

**Estado:** implementada e verificada no navegador. **Não aprovada** pelo usuário.

### Fontes consultadas
- `Downloads/VIPZUE_Especificacao_Contexto_Claude.md` (pacote de 22/10, com o original V2 anexo; UI.19 lido para os tokens).
- Referência UP&UP Partners (Behance, projeto 240177071): página observada em desktop. Absorvido: headline editorial de grande escala, objeto protagonista único dialogando com o texto, ambiente tonal monocromático. Excluído: paleta violeta, paisagem 3D, mockup de dispositivo. O vídeo local (`59ef9fbe….mp4`) exibiu apenas o primeiro quadro no navegador disponível; **o movimento da referência não foi observado**.

### Stack
- HTML/CSS/JS estáticos, sem build e sem npm. `tools/dev-server.mjs` (Node, sem dependências). Rodar: `node tools/dev-server.mjs` → http://localhost:5173
- GSAP 3.13.0 + ScrollTrigger + CustomEase via jsDelivr (gratuitos). Curvas dos tokens criadas com CustomEase.
- Fontes: Gloock (Google Fonts, OFL) e Switzer 400/500 (Fontshare, ITF Free Font License). Clash Display não utilizada.

### Assets aplicados
| Arquivo | Origem | Uso |
| --- | --- | --- |
| `assets/brand/vipzue-logo-marfim.png` (1200×206) | logo marfim enviada, recortada sem alteração de desenho | Header e menu mobile |
| `assets/brand/vipzue-logo-champagne.png`, `…-marrom.png` | idem | reservadas (Footer usará a versão escura) |
| `assets/hero/aguia-1400.webp` (1043×1377, 466 KB) / `aguia-900.webp` (303 KB) | `Telegram Desktop/IMG_4841.png`, recortada e convertida | Protagonista da Hero |
| Fotos de pessoas | — | removidas do projeto por decisão do usuário (24/10/2026) |

Originais intocados em `assets/source/`. Reprocessar: abrir `/tools/preparar-assets.html` com o servidor rodando.

### Composição
- Desktop: headline à esquerda (7 colunas), águia à direita dentro de um arco em superfície café (#2F251F) com contraluz champagne contida; olhar da águia aponta para o texto.
- Mobile e tablet em retrato: águia no alto, texto ancorado embaixo com scrim carvão; águia nunca esticada (`aspect-ratio` fixo).
- Fundo inteiramente em CSS/SVG: gradiente tonal grafite→carvão, foco café, micrograin SVG (token 0.03).

### Motion (scroll = 200svh dentro de 300svh; scrub 0.6s)
| Elemento | Intervalo | Estado inicial → final |
| --- | --- | --- |
| Header | 0.04–0.16 | visível → oculto, y −16px (não sticky) |
| Subheadline + CTA | 0.05–0.17 | → opacidade 0, y −24px |
| Palavras da headline | 0.08–0.28 (stagger) | → opacidade 0, yPercent −35 |
| Águia (figura) | 0.04–0.46 | desktop: x −14%, y +3%, escala 1.14; empilhado: y +5%, escala 1.10 |
| Arco / contraluz | 0.04–0.46 | arco scaleX 1.22 (1.12 empilhado); luz opacidade 0.85→1, escala 1.25 |
| Frases (desdobramento da subheadline) | 0.22 / 0.30 / 0.38 | máscara yPercent 110→0; anterior cai para opacidade 0.32 |
| Seção 02 | 0.50–1.00 | sobe sobre o palco (rolagem nativa) |
| Águia / escurecimento | 0.50–1.00 | y −10% (−8% empilhado); véu carvão 0→0.75 |

Entrada (tempo, uma vez): águia 1.2s, arco (clip-path) 1.2s, palavras 0.5s com stagger 0.04, apoio 0.5s, header 0.4s; curva emphasized.
Reduced motion ou tela baixa (<560px; <700px no mobile): Hero estática em fluxo normal, sem frases duplicadas, sem entrada.

### Exceções propostas (aguardando aprovação)
1. Scroll-linked na Hero com amplitude acima do teto de parallax (32px): pedido explícito do usuário para storytelling de ~3 telas.
2. Entrada da águia e do arco em 1.2s (acima do token slow de 500ms).
3. Display XL limitado também pela altura: `clamp(52px, min(6.7vw, 10.5svh), 96px)` para caber em telas de 720–800px.
4. Contraluz champagne e arco café como linguagem própria da Hero.
5. Seção 02 em marfim: provisório, apenas para demonstrar a passagem.

### Verificação realizada (Chrome via DevTools, emulação)
- 1440×900: entrada, 0%, 15%, 30%, 47%, 68%, 88%, 100% e retorno ao topo (estado inicial restaurado).
- 1280×720, 768×1024 (retrato), 390×844 (2x, touch): composição e etapas 2/3.
- Reduced motion em 1440×900: Hero estática de 900px, seção 02 em fluxo.
- Menu mobile: abre com foco no fechar, trava rolagem, Esc fecha e devolve o foco.
- Sem overflow horizontal; console sem erros.
- Não verificado: Safari/iOS real, Firefox, tablet em paisagem, dispositivos físicos.

### Pendências
- Destino real do CTA (número/link do WhatsApp e mensagem inicial). Hoje aponta para `#contato`, que não existe.
- Âncoras `#metodo`, `#para-quem-e`, `#faq` ainda sem seção.
- Validação da copy final da Hero (o texto usado é o conceito em estudo do original).
- Logo em SVG oficial e águia em resolução maior (ver lista de assets complementares).

### Próximo passo proposto
Revisão da Hero pelo usuário; após aprovação, ajustes e só então a seção 02.
