# Política de Privacidade — relatório de implementação (07/11/2026)

Página própria em `/privacidade`, ligada ao item "Política de Privacidade" do footer. Status: **feita e testada localmente, não publicada.**
Falta só o complemento do endereço (ver abaixo). **Não publicar enquanto houver `[A PREENCHER]` visível.**

## Auditoria do site (o que o texto declara)
| Item | Situação real hoje | Onde foi verificado |
|---|---|---|
| Formulários | Nenhum | `index.html` |
| GA4 / pixels / analytics | Nenhum | `index.html`, `js/` |
| Cookies, localStorage, sessionStorage | Nenhum uso | `js/` (busca por `cookie`, `Storage`, `sendBeacon`) |
| WhatsApp | Canal previsto; o número está vazio em `js/config.js`, então os CTAs ainda levam a `#contato` | `js/config.js`, `js/sections.js` |
| Terceiros carregados | Google Fonts (Gloock), jsDelivr (GSAP, só na página principal), Vercel (hospedagem) | rede no navegador |
| HTTPS | Sim (Vercel) | produção |

A política descreve só isso. O WhatsApp aparece como meio de contato e como serviço de terceiro. A página diz que **nesta data** o site não usa cookies nem GA4. Se isso mudar, o texto precisa ser revisado **antes** da mudança ir ao ar.

## Arquivos
- **Novos:**
  - `privacidade/index.html`: página sem scripts;
  - `css/privacidade.css`.
- **Alterados:**
  - `index.html`: item do footer passou de `data-link="privacy"` (pendente) para `href="/privacidade"`; comentário do footer atualizado;
  - `css/sections.css`: `.footer-link` ganhou `text-decoration: none`. Com destino real, o navegador passaria a sublinhar o item; o indicador do site é o traço do `::before` no hover/foco;
  - `tools/build-site.mjs`: o build lista as páginas (`PAGES`) e resolve os caminhos relativos de cada uma. Gera 273 arquivos, incluindo `privacidade/index.html` e `css/privacidade.css`.
- **Não tocados:**
  - `js/config.js`, `css/tokens.css`, `css/fonts.css`;
  - a Hero (desktop e mobile), `hero.js`, `hero-voo.js`, o WebGL, a Visão e a Seção 3;
  - CTAs e destinos de WhatsApp;
  - robots, sitemap e canonical.

## Conteúdo (16 seções)
1. Quem somos (controlador)
2. Dados tratados
3. Origem
4. Finalidades
5. Bases legais (art. 7º, II, V, VI e IX)
6. Cookies e armazenamento
7. Análise e eventos
8. WhatsApp e serviços externos
9. Compartilhamento
10. Conservação
11. Segurança (só HTTPS afirmado)
12. Direitos (art. 18)
13. Como solicitar
14. Transferência internacional (art. 33)
15. Alterações
16. Contato (e canal da ANPD)

O texto não afirma conformidade total com a LGPD, criptografia própria nem anonimização.

## Dados da empresa (informados pelo usuário em 07/11/2026)
- Preenchidos: razão social (Vipzue Ltda.), CNPJ, endereço (Travessa Manoel Costa Homem, nº 143 — Santaluz/BA; o nº 69 enviado antes foi substituído pelo 143), encarregado (atendido pelo canal oficial), conservação, segurança no atendimento e canal de privacidade (e-mail, com link `mailto:`).
- **Ainda pendente (1):** bairro e CEP do endereço.
- Os textos de conservação e segurança são os informados pela VIPZUE, adaptados à redação da página. A página não acrescenta nenhuma medida além delas.

Recomendação: revisão por profissional jurídico antes da publicação.

## Testes (Chrome via DevTools, servidor local)
| Teste | Resultado |
|---|---|
| URL direta | `/privacidade` e `/privacidade/` abrem; âncoras `#responsavel` etc. funcionam; 16/16 links do sumário apontam para seções existentes |
| Link do footer | Clique real (com a cortina do footer aberta) leva a `/privacidade` |
| "Voltar para o site" | Enter no link leva a `/` |
| Teclado | Ordem: pular conteúdo → logo → voltar → 16 itens do sumário → gov.br/anpd → voltar → topo (22 focáveis); foco com contorno marfim; o pular-conteúdo leva o foco ao sumário |
| Celular | 360 e 390: sem rolagem lateral (`scrollWidth` = largura); texto 16 px; logo 96 px |
| Contraste | Texto suave sobre o ponto mais claro (Mocha) 5,75:1; sob o brilho Páprica 5,05:1; sobre o Grafite 9,78:1; marcador pendente 6,47:1 |
| Correção de contraste | O rótulo "Legal" e os números do sumário em Páprica davam 2,5:1. Passaram para o marfim suave; a Páprica ficou só em traços e marcadores |
| Correção de sumário | O título "Nesta página" herdava o estilo de h2 (corrigida a especificidade); item longo do sumário com número fora de linha (link passou a inline) |
| Assets do voo | A página carrega só 3 CSS locais, Google Fonts, logo e 2 fontes Switzer: 0 scripts, 0 pedidos `voo`/GSAP/`hero` |
| Console | Página sem erros próprios. O único 404 é `/favicon.ico`, que o site inteiro já não tem (não criado aqui) |
| Site principal | Footer: os dois itens legais com mesma cor, tamanho e sem sublinhado em repouso. Hero abre no 1º quadro do prólogo. `test-hero-voo` 11/11. Console só com o aviso preexistente de imagens lazy sem dimensões |

Capturas (fora do git): `docs/qa/privacidade-desktop.png`, `privacidade-360.png`, `privacidade-390.png`, `privacidade-home-1440.png`.

## Limitações
- **Rota na Vercel:** `/privacidade` sem barra deve servir o índice da pasta, mas isso só se confirma depois do deploy. O `vercel.json` não usa `cleanUrls`.
- Itens do sumário têm ~22 px de altura no celular. O espaçamento entre linhas mantém a área de toque utilizável, mas fica abaixo do alvo ideal de 44 px.
- Não testado: Safari/iPhone real, Firefox, leitor de tela real.
- "Termos de Uso" continua pendente no footer.
