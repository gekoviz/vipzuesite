# Mesh Drift V6.1 "Fitas": a película visível, nas referências 22.jpg e 23.jpg

Status: em teste na branch `feat/mesh-v61-fitas` (a partir da `main` publicada, `e7c0339`). **Não publicado.**

## 1. O pedido

Depois da V6.0 publicada, o usuário escreveu: "nao mudou nada. os fundo ta o mesmo, principalmente os gradiente do
codigo. leia o codigo e replique. analise as foto também como deve ficar". Mandou duas referências:
- **22.jpg (Hero):** fundo marrom escuro, fitas de luz Páprica em arco que passam pelo alto e em volta da cabeça da
  águia, um brilho atrás da cabeça e uma fita larga no canto inferior esquerdo;
- **23.jpg (Seção 03):** fundo marfim-pêssego, dobras de cetim (faixas claras com sombra rosada) e um calor rosado
  atrás da águia no galho.

## 2. Por que a V6.0 não aparecia

O código do prompt V6.0 limitava a película a alfa 0,105 no escuro e 0,032 no claro, com teto de 0,12 dentro do
shader. Ela era composta em `soft-light` e recortada por máscaras radiais estreitas. A V6.0 mediu um efeito de 1 a 5 de
média (máximo cerca de 14) numa soma RGB de 765: abaixo do limiar da percepção, como o relatório da V6.0 já dizia. Além
disso, na Hero a película entrava **abaixo** do `.hero__bg`, cujo halo com 50% de opacidade a cobria.

O shader do prompt desenha manchas gaussianas que derivam. As fotos mostram **fitas**, um desenho que esse shader não
tem: subir o alfa sozinho daria manchas coloridas, não as fitas da 22.jpg.

## 3. O que mudou

### `js/vz-mesh-overlay.js`
- **Mesh Drift mantido** (mesmos campos gaussianos, fbm e grão), com alfa visível: 0,2 no escuro e 0,22 no claro
  (teto do shader de 0,12 → 0,6), e warp maior (0,035 → 0,12 no escuro; 0,02 → 0,08 no claro), para as manchas
  fluírem.
- **Fitas novas, sobre o Mesh Drift**, deformadas pelo mesmo fbm, quebradas em trechos que viajam devagar:
  - escuro: anéis elípticos em volta de um foco, com halo Páprica Profunda e núcleo fino aceso (os arcos da 22.jpg);
  - claro: ondas paralelas de cetim, com crista fina clara, brilho curto e sombra pêssego (as dobras da 23.jpg).
- **Quadro do tamanho da tela:** o canvas fica num `div.vz-mesh-view`, preso (`sticky`) dentro da camada da seção, como
  o campo de luz fixo da Hero e da 03:
  - o desenho não desliza sob o palco fixo da 03;
  - o foco das fitas acompanha a águia;
  - seções altas não pagam pixels a mais (na V6.0, o canvas cobria a seção inteira).
- **Foco por seção** lido de um marcador (`i.vz-mesh-anchor`) posicionado pelo CSS. Ele resolve qualquer unidade (vw,
  svh, `var(--face-x)`) e só é lido no attach e no resize.
- **Zonas de silêncio (legibilidade acima da referência):**
  - caixas de todo texto visível da seção e do menu do topo, medidas pela extensão real do texto (Range, não a caixa do
    bloco) e só com o texto visível (`checkVisibility`), até 12 caixas;
  - dentro delas as fitas somem e o Mesh Drift cai a 20%, com 64 px de borda difusa;
  - medidas no attach e no resize, a cada mudança de rolagem e a cada 12 quadros (em movimento reduzido, a cada
    rolagem).
- **Calma no close da Hero** (`data-vz-mesh-calm="[data-visao-shade]"`): a opacidade da sombra do close (0 → 0,55,
  animada pelo `hero.js`, que não mudou) recolhe as fitas. Sem isso, com a águia ampliada e escurecida, os anéis em volta
  do rosto viravam um redemoinho por cima da face.
- **Inserção na Hero** depois do `.hero__bg` (antes, só depois do `.section-light-field`).
- **Sem mudança:** o ciclo de vida (contextos que migram, 1 no celular e 2 no desktop, 1ª película com a página
  ociosa), os limites de DPR e de pixels, a queda sem WebGL e a perda de contexto.

### `css/vz-mesh-overlay.css`
- composição `normal` (antes, `soft-light`);
- a máscara radial vai para o quadro e fica ampla;
- `overflow: clip` na camada, para o quadro poder ficar preso;
- foco das fitas por seção (`--vz-rib-x/y`) e, na Hero, raio, achatamento, ângulo, força e alcance dos anéis.

### `index.html`
- só `data-vz-mesh-calm="[data-visao-shade]"` no `.hero__stage`.

### Cores
Paleta oficial e derivados dela:
- **Escuro:** Páprica Profunda `#B04C27` no halo das fitas; "Páprica acesa" `#FF9A62` só no núcleo fino (a luz da fita).
- **Claro:** Pêssego claro `#EBC5B2` (Marfim com 30% de Páprica) no Mesh Drift; sombra do cetim `#E3A283`; crista
  `#FFFBF6` (Marfim aceso).

## 4. O que ficou diferente das fotos, e por quê

- **A fita larga do canto inferior esquerdo da 22.jpg é fraca no site.** Na foto, ela passa por trás de "digital dele."
  e do botão. No site, duas camadas da Hero ficam acima da película e garantem o AA da headline:
  - o apoio Grafite atrás do texto (`.hero__content::before`, 0,8 → 0,66);
  - a névoa da base (`.hero__atmosphere`, que também funde o corpo da águia).

  Não mexi nelas. As fitas da Hero passam pelo alto e em volta da cabeça, onde a foto as mostra mais fortes. Para ter a
  fita de baixo como na foto, seria preciso afinar esse apoio (decisão de design, não tomada aqui).
- **As fitas não passam atrás dos textos** em nenhuma seção: somem perto deles (zonas de silêncio). Nas fotos elas
  cruzam o texto, mas a regra do projeto é a legibilidade primeiro.
- As outras seções escuras (Método, CTA, FAQ, rodapé) e a 05 (clara) não tinham foto. Receberam a mesma linguagem: anéis
  no escuro, cetim no claro, com o foco na luz que cada seção já tem.

## 5. Testes

(preenchido abaixo)

## 6. Evidências

Capturas em `C:\Users\genis\AppData\Local\Temp\claude\eed0ed86903c9b32\2ca5f773-19e9-49e1-b9b8-64e4d345e2a9\scratchpad\t18\`
e, para o repositório (ignorado pelo git), `docs/qa/mesh-v61/`.

## 7. Pendências

- Conferir num iPhone e num Android reais: a GPU de celular paga mais pelo shader novo (fitas + zonas de silêncio).
- Safari anterior ao 16 não tem `overflow: clip`: o quadro não fica preso e cobre só a 1ª altura de tela de cada seção.
  É uma queda aceitável.
