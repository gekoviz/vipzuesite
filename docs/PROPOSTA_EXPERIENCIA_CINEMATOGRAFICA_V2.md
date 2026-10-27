# VIPZUE — Proposta da experiência cinematográfica V2

Data: 23/10/2026. Estado: **conceito aprovado e implementado; implementação aguardando aprovação visual** (ver docs/ANDAMENTO.md).

## 1. Inspeção das referências

Os cinco vídeos foram decodificados no Chrome (DevTools) e amostrados por tempo. Quadros com marcação de tempo em `docs/referencias/quadros/` (`sheet-*` = vídeo inteiro; `crop-*` = recorte ampliado da tela).

| Vídeo | Duração / formato | O que é |
| --- | --- | --- |
| IMG_0335 | 13,2s · 720×1280 | Gravação de notebook: site de satélites (fundo escuro, objeto 3D) |
| IMG_0336 — ROSSO | 7,7s · 720×1280 | Mockup de notebook: restaurante, massa no garfo |
| IMG_0337 — POUR/PLAY | 8,0s · 720×1280 | Mockup de notebook: café, Grind → Pour → Sip |
| IMG_0362 | 14,8s · 720×1280 | Tutorial: site de fones + processo de criação com IA |
| UP&UP Partners (59ef9fbe….mp4) | 49,3s · 1920×1080 | Demonstração do projeto Behance |

Limite: são gravações de tela (algumas filmadas por celular). Vejo a coreografia e a ordem dos estados, não curvas exatas nem a implementação.

### Observações por vídeo

**IMG_0335 (satélites)**
- 0,0–2,6s: o objeto protagonista entra pequeno, se aproxima e gira até dominar a tela; o texto se revela ao lado.
- 3,5–4,4s: o objeto se decompõe em módulos (vista explodida).
- 6,1→7,0s: uma imagem de uma grade se expande até ocupar a tela.
- 8,8–9,6s: recuo de câmera até o globo, com texto centralizado sobre ele.
- 11,4s: uma máscara diagonal troca uma camada de imagem por outra.
- Princípio: **câmera que se aproxima e se afasta de um mesmo objeto**, em várias escalas.

**IMG_0336 (ROSSO)**
- 1,1–2,6s: o texto do hero sobe normalmente, mas o objeto (massa) fica fixo e se alonga; a fronteira vermelho→creme passa **por baixo** dele.
- 3,0–5,0s: o objeto se desenrola em espiral, com ingredientes e anotações (sequência de imagens).
- 5,5–6,6s: o título da seção seguinte já está posicionado **atrás** dos elementos em queda, que pousam no prato final.
- Princípio: **o objeto é o fio de continuidade**; os cenários trocam atrás dele.

**IMG_0337 (POUR/PLAY)**
- 0,7–1,3s: o moedor sai pelo alto, mas os grãos continuam caindo e atravessam a fronteira para a seção seguinte.
- 4,6–5,6s: uma superfície líquida translúcida, de borda orgânica, sobe e funciona como **máscara**: dentro dela aparece a cena seguinte (a caneca).
- Palavra gigante sempre atrás do objeto.
- Princípio: **a transição é feita por um elemento do próprio universo** (líquido), não por um retângulo.

**IMG_0362 (fones)**
- 0,6–2,8s: a pessoa caminha até a câmera.
- 2,8→3,6s: aproximação até os fones, que ficam isolados e assumem o protagonismo.
- 12,3–14,6s: vista explodida dos fones e remontagem.
- O próprio vídeo mostra o método: imagem gerada → **imagem-para-vídeo** (Google Flow) → vídeo inserido no site. Esses efeitos são **sequências de vídeo controladas pela rolagem**, não 3D em tempo real.

**UP&UP Partners**
- 0–2,4s: a headline entra; o portal fica **na frente** de "PARTNERSHIP".
- 3,0–5,5s: a headline sobe e esmaece; a câmera percorre a paisagem para cima, e a base da imagem escurece até virar o preto da seção seguinte. **Não há borda.**
- 6,0–6,6s: texto revelado palavra por palavra, de cinza para branco.
- 8,2–16,4s: uma escultura central permanece no meio de uma grade enquanto o conteúdo muda ao redor.
- 26–30s: o objeto (globo) fica entre as letras de "WORLDWIDE".

### O que é reproduzível com recursos gratuitos

| Efeito | Recurso |
| --- | --- |
| Objeto fixo enquanto cenários passam por trás | CSS sticky + GSAP ScrollTrigger |
| Aproximação de câmera (escala/translação com origem num ponto) | GSAP, `transform` |
| Máscara orgânica ou circular revelando a cena seguinte | `clip-path` / máscara SVG animada pelo GSAP |
| Base escura que vira o fundo da seção seguinte | gradientes CSS |
| Desenho de linhas e anéis no scroll | SVG `stroke-dashoffset` (GSAP) |
| Texto revelado palavra a palavra | spans + GSAP (já usado na Hero) |
| Vista explodida, objeto girando, matéria fluida | **exige sequência de imagens** gerada por vídeo; ferramentas de imagem-para-vídeo normalmente não são gratuitas |

O que **não** será levado: cores, objetos (portal, satélite, massa, café, fones), paisagens, números e identidades das referências.

## 2. Conceito para a VIPZUE: "Visão"

A águia é a metáfora de **visão estratégica**. A câmera se aproxima da águia, atravessa a plumagem e chega ao **olho**. O olho se converte numa **íris de três anéis** (Negócio, Cliente ideal, Objetivo comercial), que giram até se **alinhar** num único eixo: a linha de visão. Quando os anéis se alinham, a **pupila se abre** e revela a seção O que fazemos.

Cadeia de continuidade (cada estado nasce do anterior):
**águia → olho → íris → alinhamento → pupila → seção.**

Isto não é uma sequência de cards, nem frases que aparecem e somem. Os três termos fazem parte de um mecanismo que se move e converge, como os grãos de café ou a massa da ROSSO.

## 3. Storyboard (desktop 1440×900; o palco fica fixo por cerca de 3 telas)

| Progresso | Estado visual |
| --- | --- |
| **0% — Apresentação** | **Hero v2 aprovada, sem alterações:** headline monumental em 3 linhas, águia emergindo atrás da última linha, ambiente low-key, legenda e CTA na base esquerda. CTA funcional. |
| **25% — Aproximação** | Header, legenda e CTA saíram. A headline saiu pela máscara, linha a linha. A águia cresceu (cerca de 1,7×) e foi para o centro; os olhos estão no centro óptico e o alto da cabeça ultrapassa o topo da tela. A vinheta fecha as bordas e a luz bronze se concentra no rosto: a sensação é de câmera avançando. |
| **50% — Travessia e íris** | A câmera passa pela plumagem: a águia está a cerca de 3,2× com origem no olho direito (o mais frontal). As penas escuras preenchem as bordas, o olho âmbar ocupa o centro e a foto escurece para cerca de 25%. Sobre o olho, três anéis SVG finos em champagne são desenhados (traço progressivo), cada um com uma abertura em ângulo diferente. As palavras **Negócio**, **Cliente ideal** e **Objetivo comercial** (Gloock) entram junto ao seu anel, cada uma em uma posição angular. |
| **75% — Alinhamento** | Os anéis giram em sentidos alternados até as aberturas se alinharem no eixo horizontal, voltado para a esquerda (para onde a águia olha). As três palavras deslizam até esse eixo e formam uma leitura única. Uma linha de visão de 1px em champagne é traçada da pupila até a margem: a convergência. Ao fundo resta apenas a textura da plumagem. |
| **100% — Revelação** | A pupila se expande como um diafragma circular (`clip-path: circle`) e revela o marfim da seção O que fazemos. O título **Landing Pages Estratégicas** aparece dentro da abertura. A íris de três anéis encolhe para cerca de 72px e se fixa no canto superior esquerdo da seção como seu emblema, mudando de champagne para marrom (#4A372B). A fixação termina e a seção segue com rolagem normal. |

## 4. Mapa de movimento

Intervalos em % do progresso do palco fixo.

| Elemento | Comportamento |
| --- | --- |
| Fundo (parede, luz, vinheta) | Permanece; a vinheta fecha entre 15 e 50%; a luz se concentra no rosto (0–35%) e some (60–80%) |
| Header | Desaparece entre 3 e 10% (não é sticky) |
| Legenda e CTA | Saem entre 4 e 14%; o CTA é clicável em 0% e volta ao subir |
| Headline (3 linhas) | Sai pela máscara, linha a linha, entre 6 e 22% |
| Águia | Escala 1→1,7 e centraliza (0–25%); escala 1,7→3,2 com origem no olho (25–50%); opacidade 1→0,25 (40–52%); some em 58% |
| Olho (foto) | Mantém-se como base da íris (45–60%); com o asset opcional de olho macro, entra por cima entre 42 e 50% |
| Anéis (SVG ×3) | Desenhados por traço (44–56%); rotação para alinhar (56–76%: externo +120°, médio −90°, interno +60°); escala 1→0,94 |
| Palavras (×3) | Entram junto ao anel (48–60%); deslizam para o eixo (62–76%); saem ou acompanham o emblema (88–96%) |
| Linha de visão | Traçada entre 74 e 82% |
| Pupila / diafragma | Recorte circular na seção 02, do raio da pupila até cobrir a tela (82–98%) |
| Título da seção 02 | Revelado dentro da abertura (88–100%) |
| Emblema (íris) | Encolhe e se fixa no canto superior esquerdo da seção (88–100%); champagne → marrom |

Persistem entre as cenas: o olho (que vira a íris) e a íris (que vira o emblema da seção 02). Não há troca brusca de cenário.

## 5. Plano de assets

**Reutilizados:** a águia oficial (`assets/hero/aguia-*.webp`), as logos, as fontes Gloock/Switzer e o fundo CSS da v2.

**Feito em código, sem imagem:** anéis, linha de visão, diafragma, vinheta e textura de granulação.

**Precisa ser produzido fora do código:**

| Nome | Finalidade | Resolução / proporção | Transparência | Camadas | Comportamento no scroll |
| --- | --- | --- | --- | --- | --- |
| `aguia-hero-hd.png` **(obrigatório)** | Mesma águia oficial (pose, luz e recorte idênticos) em alta resolução, para a aproximação de 3,2× sem perder nitidez | 2400×3200 px, 3:4, PNG | Sim, fundo totalmente transparente, sem halo claro | 1 | Escala 1→3,2 com origem no olho direito; esmaece de 40 a 58%. Converto para WebP (desktop e mobile) |
| `aguia-olho-macro.png` (opcional, recomendado) | Close do olho direito da mesma águia: íris âmbar nítida e penas escuras ao redor, para o momento em que o olho domina a tela | 2400×2400 px, 1:1, PNG | Não (preenche a tela) | 1; pupila **exatamente no centro** da imagem | Entra em fusão sobre a foto entre 42 e 50%, escala 1→1,15 até 60%, escurece sob os anéis |
| `vipzue-logo.svg` (já pendente) | Logo vetorial oficial | SVG | Sim | 1 | Fixa (header) |

**Sem `aguia-olho-macro`:** a íris SVG assume o centro mais cedo (por volta de 3× de escala), e a leve falta de nitidez do olho fica sob a escuridão e os anéis. Funciona, mas com menos impacto.

**Não é necessária sequência de imagens.** O movimento é de câmera sobre um sujeito rígido mais elementos vetoriais.

## 6. Plano técnico

- **Estrutura:** a mesma da v2. Palco CSS sticky dentro de um contêiner de cerca de 380svh (aproximadamente 3 telas de fixação). A seção 02 vem logo depois e recebe o recorte circular.
- **GSAP + ScrollTrigger** (gratuitos, já em uso): uma timeline mestre com rótulos `aproximacao`, `travessia`, `iris`, `alinhamento`, `revelacao`; `scrub` de 0,6s (para quando a rolagem para, reverte ao subir); `invalidateOnRefresh` para medidas responsivas.
- **Origem da aproximação:** coordenadas do olho medidas na imagem (fração x/y do arquivo) e aplicadas como `transform-origin`. Posição do olho exposta em variáveis CSS para alinhar a íris SVG com precisão.
- **Íris:** um SVG inline com três `<circle>`. As aberturas são feitas com `stroke-dasharray`, o desenho com `stroke-dashoffset` e o giro com `rotation` do GSAP (`transform-origin` no centro). As palavras ficam em HTML (selecionáveis e acessíveis), não dentro do SVG.
- **Diafragma:** `clip-path: circle(r at x y)` na seção 02, com o raio interpolado pelo GSAP, centralizado na pupila.
- **Desempenho:**
  - animar só `transform`, `opacity`, `clip-path` e `stroke-dashoffset`;
  - nenhum `filter` animado;
  - `will-change` só durante o trecho fixo;
  - imagens pré-carregadas por breakpoint (`<picture>`).
- **Quando uma sequência de imagens seria necessária:** só se a águia precisar se mover de verdade (virar a cabeça, piscar, abrir as asas, penas reagindo). Isso exige imagem-para-vídeo a partir da águia oficial, 90–150 quadros WebP (cerca de 4–8MB no desktop) e pintura em canvas. Não recomendo nesta etapa, porque as ferramentas de geração de vídeo normalmente não são gratuitas e o peso compromete o mobile.

## 7. Adaptação mobile (390×844 como referência)

- **0%:** Hero v2 mobile aprovada.
- **25%:** a águia centraliza e escala cerca de 1,4×; os olhos ficam a cerca de 40% da altura.
- **50%:** aproximação até o olho com 2,6× (mais contida). A íris ocupa 88vw. As palavras ficam **acima e abaixo** dos anéis, não em volta, para não comprimir a leitura.
- **75%:** o eixo de alinhamento fica **vertical**, apontando para baixo, para o conteúdo. As palavras empilham ao longo do eixo.
- **100%:** o mesmo diafragma; o emblema se fixa acima do título.
- **Desempenho:** a águia em WebP de 900–1200px, o olho macro em 1200×1200, rotação dos anéis com amplitude reduzida e altura de fixação de cerca de 320svh.
- **Telas baixas** (abaixo de 700px de altura): sem fixação; versão estática.

**Movimento reduzido:** sem fixação nem aproximação. A Hero fica estática, e a seção 02 começa com a íris **já alinhada** (estática) com as três palavras, seguida do título. O conteúdo fica completo.

## 8. Critérios de validação

1. **Fidelidade:** capturas em 0, 25, 50, 75 e 100% comparadas lado a lado com este storyboard, em 1920×1080, 1440×900, 1280×720, 768×1024, 390×844 e 360×780.
2. **Continuidade:** capturas a cada 5% (21 quadros). Em todos deve existir ao menos um elemento do estado anterior (águia, olho, íris ou pupila); nenhuma borda reta horizontal atravessa a tela.
3. **Suavidade:**
   - trace de Performance no Chrome com rolagem programada (com e sem CPU 4× mais lenta);
   - nenhuma tarefa acima de 50ms durante o trecho fixo;
   - CLS igual a 0;
   - apenas `transform`, `opacity` e `clip-path` nas camadas animadas.
4. **Reversibilidade:** rolar 0→100→0 e comparar as capturas de 25/50/75% na descida e na subida (devem coincidir após o assentamento do scrub); voltar ao topo restaura exatamente o estado 0%.
5. **Parada:** ao interromper a rolagem, o movimento assenta em até cerca de 0,6s e não continua sozinho.
6. **Legibilidade:**
   - palavras sobre a íris e o fundo de penas com contraste de pelo menos 3:1 (texto grande) e pelo menos 4,5:1 nas legendas;
   - CTA operável por teclado em 0%.
7. **Peso:** mídia da Hero até cerca de 1,2MB no desktop e cerca de 600KB no mobile.
8. **Movimento reduzido e telas baixas:** conteúdo completo, sem fixação.

## 9. Restrições respeitadas

- Paleta e fontes oficiais.
- Sem paisagem fantasiosa nem pôster.
- Sem cards, sem textos em imagens e sem números inventados.
- Arquitetura comercial mantida: a seção 02 continua sendo O que fazemos, com o conteúdo-base do documento. Os termos Negócio + Cliente + Objetivo vêm do próprio conteúdo-base (8.3).
- Hero v2 intocada até a aprovação.
