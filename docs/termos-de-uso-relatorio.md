# Termos de Uso — relatório de implementação (07/11/2026)

Página própria em `/termos-de-uso`, ligada ao item "Termos de Uso" do footer. Status: **feita e testada localmente na branch `feat/termos-de-uso`, não publicada.**

## Arquivos
- **Novos:**
  - `termos-de-uso/index.html`: página sem scripts, com 18 seções.
- **Renomeado:**
  - `css/privacidade.css` → `css/legal.css`: a mesma folha passa a servir as duas páginas legais, sem CSS duplicado.
  - A única adição é `.legal__footer-links`, que agrupa os links do rodapé das páginas legais.
- **Alterados:**
  - `privacidade/index.html`: aponta para `css/legal.css`; rodapé com link para Termos de Uso.
  - `index.html`: item do footer passou de `data-link="terms"` (pendente) para `href="/termos-de-uso"`; comentário do footer atualizado.
  - `tools/build-site.mjs`: `termos-de-uso/index.html` em `PAGES`. O build gera 274 arquivos.
- **Não tocados:**
  - Hero desktop/mobile, voo, WebGL, Visão, Seção 3, iluminação, textos comerciais, CTAs, WhatsApp e animações;
  - `js/*`, `css/sections.css`, `css/hero.css`, `css/tokens.css`, `js/config.js`;
  - `vercel.json`, robots, sitemap e canonical.

## Conteúdo
Seções 1 a 18 na ordem pedida. O texto parte do que o site realmente diz: diagnóstico → estratégia → construção, orçamento pelo WhatsApp, "o clique não representa uma compra". Também diz explicitamente que:
- o site não vende, não processa pagamento e não tem cadastro, login ou área de clientes;
- o site não mostra preços nem prazos; tudo isso fica para a proposta;
- pedir orçamento não obriga ninguém a contratar, e o clique no WhatsApp não é contratação nem gera cobrança;
- a contratação depende de proposta específica e de contrato. Os Termos de Uso não substituem o contrato de serviços;
- resultados comerciais não são garantidos, com o motivo explicado (fatores fora do controle da VIPZUE);
- os limites de responsabilidade preservam o que a lei não permite afastar e o CDC, quando aplicável;
- não há foro de eleição. Vale a competência legal, inclusive o foro do domicílio do consumidor.

Dados da empresa: os mesmos informados pela VIPZUE para a Política de Privacidade. Razão social, CNPJ, endereço e e-mail; nada foi inventado.

## Pontos para validação jurídica
1. **Foro:** o texto não fixa um foro. Se a VIPZUE quiser um foro para relações entre empresas (B2B), isso precisa de avaliação jurídica.
2. **Limitação de responsabilidade (item 12):** a redação é moderada, mas convém confirmar.
3. **Propriedade intelectual (itens 6 e 7):**
   - o texto diz que a marca e os materiais "pertencem à VIPZUE ou são usados com autorização";
   - convém confirmar as licenças dos materiais de terceiros (imagens da águia, fontes, bibliotecas);
   - o texto não afirma que a marca está registrada no INPI.
4. **"Não gera cobrança" (item 10):** é verdadeiro para o site. Convém confirmar que a conversa inicial e o orçamento nunca são cobrados.
5. **Contato:** por enquanto é só o e-mail. Quando o WhatsApp estiver configurado em `js/config.js`, o texto continua válido.

## Testes (Chrome via DevTools, servidor local)
| Teste | Resultado |
|---|---|
| `/termos-de-uso` e `/termos-de-uso/` (acesso direto e recarga) | 200, com o CSS carregado nas duas formas |
| Footer da home | Clique real em "Termos de Uso" leva a `/termos-de-uso`. Os dois itens legais têm a mesma cor, 14 px, sem sublinhado, altura de 33 px; não há item duplicado (2 itens) |
| Mesma linguagem visual | Mesma folha `legal.css`: gradiente, logo, sumário, tipografia |
| Desktop 1440 e celular 360 | Sem rolagem lateral; texto em 16 px; dados da empresa em 1 coluna no celular |
| Retorno | Tab → "Voltar para o site" com foco visível → Enter leva a `/` |
| Navegação entre páginas legais | Rodapé da Privacidade → Termos (clique real); Termos → `/privacidade` (status 200) |
| Links internos | `../` e `/privacidade` com status 200; 18/18 âncoras do sumário existem |
| Estrutura | 1 h1, h2 nas seções (sem saltos), 29 links focáveis, title e description próprios |
| Assets pesados | 0 scripts; 0 pedidos de voo, GSAP ou Hero; carrega só 4 CSS locais, Google Fonts, logo e 2 fontes |
| Console | Página sem mensagens |
| Landing | Sem diff em `js/` nem nos CSS da landing; `test-hero-voo` 11/11 |

Capturas (fora do git): `docs/qa/termos-desktop.png`, `docs/qa/termos-360.png`.

## Limitações
- Vercel: a rota sem barra no final deve funcionar como `/privacidade` (que foi conferida em produção), mas só se confirma após o deploy.
- Não testado: Safari/iPhone real, Firefox, leitor de tela real.
- Revisão por profissional jurídico recomendada antes da publicação.
