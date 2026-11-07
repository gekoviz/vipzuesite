# Display Cards V4 — relatório (07/11/2026)

Branch `feat/display-cards-v4`. **Publicado em produção** em 07/11/2026 (`main` em `6a5244f`).

## 1. Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `index.html` | Só o conteúdo interno dos dois cards. |
| `css/hero.css` | Só o bloco `.vz-hero-cards*`. |

**Não tocados:**
- `js/hero-display-cards.js` e `js/hero.js`, sem nenhuma linha alterada;
- `js/light-field.js`, a águia, o fundo, a headline, o CTA e o header;
- outras seções, breakpoints globais, Hero mobile, imagens, fontes, SEO e analytics.

Nenhuma dependência nova.

## 2. HTML corrigido

```html
<p class="vz-hero-cards__statement">
  <span>PRESENÇA FORTE</span>
  <span>MARCA VALORIZADA</span>
  <span>MAIS OPORTUNIDADES</span>
</p>
…
<p class="vz-hero-cards__argument">
  <span class="vz-hero-cards__argument-lead">Seu cliente já pesquisa, compara e decide no digital.</span>
  <span class="vz-hero-cards__argument-outcome">Sua empresa precisa estar à altura.</span>
</p>
```

**Preservado:**
- cluster, wrappers de movimento e superfícies;
- `id="vzHeroCards"`, `hidden`, `data-active`;
- as classes `--first` e `--second`;
- `data-hero-cards`. A estrutura da especificação não trazia esse atributo, mas o `hero.js` encontra o grupo por ele; sem ele, os cards nunca apareceriam.

O texto lido em sequência continua igual ao da V3, sem nenhuma mudança de copy.

## 3. Classes CSS alteradas

**`.vz-hero-cards`**
- Variáveis `--vzc-glass-base`, `--vzc-glass-ink` e `--vzc-glass-accent`.
- `--vzc-h1` passou a 112 e `--vzc-h2` também a 112 (ver item 4).
- A opacidade do esmaecer saiu daqui (ver o desvio 2 no item 5).

**Bloco do esmaecer**
- `.is-shown` e `.was-shown`: listas de transição sem `opacity`.
- Novas regras: `.is-shown .vz-hero-cards__surface` e `.was-shown .vz-hero-cards__surface`.

**`.vz-hero-cards__motion--second`**
- `height: auto`.
- A superfície do 2º card ganhou `min-height: var(--vzc-h2)`.

**`.vz-hero-cards__surface`**
- Saiu a centralização flex.
- Material de vidro: fallback a 88 % e `@supports` com blur.
- Borda a .34 e `opacity: 0` (esmaecer).
- `transform`, `transform-origin`, `transform-style`, sombra e transição de borda e sombra ficaram iguais.

**Texto**
- `.vz-hero-cards__body`: topo e esquerda, com os paddings da especificação.
- `.vz-hero-cards__statement` (+ `span`): 13 px / 600 / 1,4 / 0,035em, alinhado à esquerda, `gap` de 7 px.
- `.vz-hero-cards__argument`: grid de três colunas.
- Novas: `.vz-hero-cards__argument-lead` (500) e `.vz-hero-cards__argument-outcome` (600).

**Destaque**
- A borda do card ativo passou a .56; a sombra ficou igual.

**Mantidos sem mudança:** hover (borda .72), `perspective` e posições `top`/`left`/`right`, `z-index` dos wrappers, os breakpoints do componente, o corte desktop-only e o movimento reduzido.

**Fade `::after`:** não existia na implementação VIPZUE, então não havia o que remover.

## 4. Dimensões finais

| Largura da tela | Largura dos cards | Card 1 | Card 2 |
|---|---|---|---|
| 1920 | 288 | 112 | 112 |
| 1440 | 282 | 112 | 112 |
| 1366 | 266 | 112 | 112 |
| 1280 | 256 | 112 | **123** |
| 1100 (faixa 1024–1199) | 236 | 112 | **123** |

- **Card 1, 112 em vez de 120:** desvio 1 no item 5.
- **Card 2, 123 abaixo de ~1330 px:** a coluna da frase fica com 97 px (78 px na faixa 1024–1199) e a frase quebra em 5 linhas. O card cresce o necessário para manter 14 px embaixo, sem reduzir a fonte (5.8 e 9.4 da especificação). Ainda é menor que o card 2 da V3, que tinha 126.
- **Posição:** o topo de cada card está no mesmo pixel da V3. Por exemplo, em 1440 × 900 o card 1 fica em y = 362 e o card 2 em y = 496, antes e depois. A largura, a ancoragem e a distância entre os cards (98 px) não mudaram.

## 5. Desvios da especificação (medidos, não estéticos)

**1. Card 1 com 112 px, não 120.**
- Com o texto do card 2 agora no topo, um card 1 de 120 px, ao voltar no fim do seu destaque, passa por cima da 1ª linha do card 2. Isso dura cerca de 150 ms, até a troca para o card 2.
- Medi a cobertura da 1ª linha do card 2 em t = 2,999 s:

| Altura do card 1 | Pontos cobertos |
|---|---|
| 120 px | 30/88 |
| 116 px | 22/88 |
| 112 px | 0/88 |

- Com 112 px, o card 1 fica com 16 px de respiro em cima e 26 px embaixo do texto.
- Evidência: `diagnostico-card1-120px-retorno-t2999` e `depois-1440-retorno-card1-t2999`.

**2. Esmaecer de entrada e saída nas superfícies, não no grupo.**
- No Chrome, opacidade abaixo de 1 em um ancestral desliga o `backdrop-filter` dos filhos.
- Com o esmaecer no grupo, o vidro entrava sem desfoque, com as penas nítidas, e o desfoque surgia de uma vez no fim (nitidez medida 8,16 a 0,999 contra 0,44 a 1). Isso é a "piscada de material" que o item 12.4 proíbe.
- Agora a opacidade fica na própria superfície, com os mesmos tempos: 0,5 s ease-out na entrada e 0,3 s na saída e na volta.
- Medido no retorno da Visão: nitidez 1,72 com opacidade 0,49 e 0,25 com 0,92. O desfoque fica ativo durante todo o esmaecer.
- Classes, JS, visibilidade e deslocamento de 8 px ficaram iguais.
- Evidência: `diagnostico-opacidade-no-grupo-{1, 0.999, 0.9}`.

**3. Coluna da conclusão com mínimo de 6,3em (≈ 82 px), não `minmax(0, 1fr)`.**
- "Sua empresa" mede 79,3 px. Com a proporção 1,4 : 1 pura, abaixo de ~1420 px a coluna fica com 74–78 px e a conclusão vira uma palavra por linha: Sua / empresa / precisa / estar à / altura.
- Com o mínimo, a conclusão fica sempre em 3 linhas.
- De ~1420 px em diante, a proporção 1,4 : 1 vale inteira.

**4. Paddings por card.**
- Card 1: 16 / 16 / 14 / 18 (item 4.4).
- Card 2: 16 / 17 / 14 / 17 (item 5.7). O padding direito do card 2 não estava especificado, então mantive os 17 px do bloco de referência.

## 6. Material (backdrop-filter)

```css
background: rgb(34 32 29 / 0.88);                    /* sem suporte */
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  background: linear-gradient(135deg, rgb(34 32 29 / 0.66) 0%, rgb(34 32 29 / 0.56) 100%);
  -webkit-backdrop-filter: blur(10px) saturate(112%);
  backdrop-filter: blur(10px) saturate(112%);
}
```

- **Mesmo material** nos dois cards, ativo ou não, sem grayscale e sem opacidade reduzida.
- **Blur:** estático, sem animação.
- **Bordas:** Páprica a .34 em repouso e .56 no destaque, com 1 px.
- **Texto:** Marfim opaco e nítido.

## 7. Alinhamento do card 1

- As três expressões começam no mesmo x, a 18 px da borda, com uma linha cada em todas as larguras.
- O texto começa a 16 px do topo, com 7 px entre as expressões, e não há centralização.
- A área livre fica à direita: "MAIS OPORTUNIDADES" mede 151 px, num card de 236 a 288 px.

## 8. Distribuição do card 2

| Largura | Frase | Conclusão | Reserva à direita |
|---|---|---|---|
| 1920 | 120 px, 3 linhas | 86 px, 3 linhas | 26 px |
| 1440 | 117 px, 3 linhas | 84 px, 3 linhas | 25 px |
| 1366 | 105 px, 4 linhas | 82 px, 3 linhas | 23 px |
| 1280 | 97 px, 5 linhas | 82 px, 3 linhas | 21 px |
| 1100 | 78 px, 5 linhas | 82 px, 3 linhas | 20 px |

- O vão entre as colunas é de 10 px.
- Os dois blocos começam no topo (y = 16) e são alinhados à esquerda.
- A 3ª coluna fica vazia: não há elemento nela.
- Do fim da conclusão até a borda sobram de 47 a 53 px (vão + reserva + padding).

## 9. JavaScript

`git diff` vazio em `js/`. Os testes abaixo confirmam que o comportamento ficou igual.

## 10. Testes

Chrome headless por CDP, na GPU real (ANGLE, Intel Iris Xe, D3D11), sem dependências novas. O painel do app fica em segundo plano e não completa a entrada da Hero.

| Teste | Resultado |
|---|---|
| Conteúdo | 3 expressões e 2 blocos, cópia literal, sem elementos extras. |
| Overflow do corpo | 0 nas 5 larguras. Texto dentro da superfície projetada nos dois destaques. Rolagem lateral: nenhuma. |
| Tipografia computada | Switzer 13 px; 600 / 0,455 px (card 1); 500 e 600 / normal (card 2); tudo alinhado à esquerda. |
| Contraste (pior pixel atrás do texto, texto escondido) | ≥ 8,82:1 em 1280, 1366, 1440 e 1920, nos dois destaques; média 9,5–13:1. Fundo atrás do texto 100 % quente (R ≥ G ≥ B), sem cinza neutro. |
| Sem backdrop-filter (fallback 88 %) | Pior 9,9:1. |
| Colisões | Nenhuma com o texto da headline, o CTA, o logo ou o menu nas 5 larguras e nos 3 momentos do ciclo. Vão até a headline ≥ 397 px. |
| Sobreposição na troca | Card 1 sobre a 1ª linha do card 2: 0/66 pontos entre 2,7 e 2,999 s. Card 2 sobre a 3ª linha do card 1: 0/33. |
| Ritmo (13 s) | Trocas em 0 / 2,96 / 5,95 / 8,95 / 11,95 s. Timeline de 6,000 s, 1 controlador, 0 tweens em superfície, corpo ou texto. |
| Rolagem | Pausa na hora, cards visíveis; retoma ≈ 0,7 s depois. |
| Hover | Pausa, fica parado e retoma ao sair. |
| Visão e retorno | Somem a partir de 80 px e o ciclo pausa; voltando ao topo, reaparecem e seguem. |
| Movimento reduzido | Ciclo parado, invólucros sem transform, dois planos legíveis. |
| 390 × 844 e 768 × 1024 (toque) | `display: none`, sem rolagem lateral. |
| Quadros (3 × 10 s com blur, 3 × 10 s sem, alternados) | Idênticos: 60 fps, p99 de 16,9 ms, nenhum quadro acima de 34 ms. |
| Console | Sem erros nem avisos. |
| `node tools/test-hero-voo.mjs` | 11/11. |
| `node tools/build-site.mjs` | 275 arquivos. |
| `git diff --check` | Limpo. |

## 11. Screenshots

Em `docs/qa/display-cards-v4/`, fora do git:

- **Antes:** `antes-{1280x720, 1440x900}-card{1,2}-{destaque, zoom}`.
- **Depois:** `depois-{1280x720, 1366x768, 1440x900, 1920x1080, 1100x700}-card{1,2}-{destaque, zoom}`.
- **Estados:** `depois-1440-movimento-reduzido`, `depois-1440-visao-sem-cards`, `depois-1440-fallback-sem-backdrop-zoom`, `depois-1440-retorno-card1-t295` e `-t2999`.
- **Diagnóstico dos desvios:** `diagnostico-card1-120px-retorno-t2999` e `diagnostico-opacidade-no-grupo-{1, 0.999, 0.9}`.

## 12. Limitações

- **Navegadores:** testado só no Chromium. Safari e Firefox não foram testados.
  - O Safari usa `-webkit-backdrop-filter` (incluído).
  - No Firefox antigo, sem suporte, vale o fallback a 88 %.
  - A regra de opacidade no ancestral também vale no Safari e no Firefox atuais; a correção do desvio 2 serve aos três.
- **Métricas de fonte:** podem variar um pouco entre navegadores. Se a frase quebrar em uma linha a mais, o card 2 cresce sozinho em vez de cortar texto.
- **Aba oculta:** não foi testada de fato (o headless não troca a visibilidade); o código desse caminho não mudou.
