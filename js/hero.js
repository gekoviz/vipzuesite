// Hero VIPZUE — entrada + "Visão" (scroll storytelling com GSAP ScrollTrigger, scrub).
// A timeline é escrita em "svh de rolagem" (distância), convertida para progresso por TOTAL.
// Desktop: palco fixo por TOTAL = 244svh (altura do contêiner 344svh). Etapas:
//     6–38    headline + CTA: inteiros até 6, depois sobem ~5% da tela e esmaecem
//     6–146   aproximação: a câmera avança da águia monumental até o close do olho direito
//             (no desktop segue lenta até o fim da passagem, sem congelar)
//    14–54    atmosfera da seção 02 (águia a 36% sobre o fundo, vinheta 0,55, composição de luz do close):
//             estabelecida ANTES de a 1ª frase ficar legível e estável nas três etapas
//    44–228   narrativa em três etapas (contador 01–03 / 03, linha de progresso, uma frase por vez),
//             derivada do mesmo progresso aplicado da timeline
//   222–242   passagem curta logo após a 3ª frase: o campo de luz (js/light-field.js) passa do estado escuro ao
//             claro da seção 03 (Marfim #F3EDE3) numa frente que sobe de baixo; águia, vinheta e faixa do topo saem à
//             frente dela e o texto de "O que fazemos" surge sobre o claro já estabelecido
//   242–244   ao sair, a seção real (idêntica) assume
// Revisão 24/10: rótulos (Negócio / Cliente ideal / Objetivo comercial), anéis, pupila artificial e linha
// de visão saíram da cena. O fundo do close volta ao da versão aprovada: águia a 30% sobre o Silk,
// vinheta 0,55 e enquadramento original (olho ao centro no mobile, à direita no desktop).
// O movimento acompanha a rolagem, para quando ela para e reverte ao subir.
(() => {
  const root = document.documentElement;
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  // Mesma condição do script inline do <head>.
  const STORY_QUERY =
    "(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 560px), " +
    "(prefers-reduced-motion: no-preference) and (max-width: 767px) and (min-height: 700px)";
  // Composição empilhada (mobile e tablet em retrato).
  const STACKED_QUERY = "(max-width: 767px), (max-width: 1023px) and (orientation: portrait)";
  // Abaixo de 1024px a seção 03 é o fluxo de cards (js/scroll-narrative.js): a passagem acompanha a seção (abaixo).
  const FLOW_QUERY = "(max-width: 1023.98px)";

  // Distância total do palco fixo, em svh de rolagem (ver --story-h no CSS: TOTAL + 100svh). No palco empilhado
  // (celular e tablet em retrato) a passagem final é mais longa (WIPE_LEN_STACKED) e TOTAL cresce junto.
  let TOTAL = 244;
  // Prólogo do desktop (≥1024px, com movimento): antes de tudo acima, o voo da águia (assets/hero/voo, quadros com
  // alfa) é percorrido pela própria rolagem. Motor (quadros, cache, desenho, fases): js/hero-voo.js.
  //     0–160   voo: o quadro segue a rolagem BRUTA (sem o scrub de 0,6s da Visão); pousa no último quadro
  //     160     pouso confirmado (quadro final desenhado) → trava de conclusão; logo/menu, headline e CTA entram
  //             sozinhos com o efeito de sempre, sem pedir mais rolagem
  //   160–200   Hero pronta (zona de leitura; não dispara nada); a partir de 200 (= 0 acima) segue a Visão como era
  // Depois do pouso o voo não volta: subir mostra a Hero pronta. O percurso não encolhe depois da conclusão.
  // Mobile, tablet, movimento reduzido, âncora na URL ou falha na preparação: OFF = 0, a Hero de sempre.
  const VOO = window.VZVoo;
  const PCFG = VOO?.CONFIG;
  const PROLOGUE_SRC = "assets/hero/voo/manifest.json";
  // Pouso: nos últimos SETTLE_FRAMES quadros (a ave já estabilizando) o enquadramento passa da tela cheia para o da
  // águia estática. Necessário porque, no enquadramento dos olhos, o quadro do vídeo fica menor que a tela e a ave
  // seria cortada em linha reta nas bordas durante a travessia (medido: 1182×657 dentro de 1440×900).
  const SETTLE_FRAMES = 40;
  // Rolagem tolerada antes da ativação (preparação): além disso, a visita segue sem o voo
  const ENTRY_GUARD_SVH = 4;
  // Estado da visita (fora do matchMedia): uma vez concluído ou pulado, o voo não volta nesta vida do documento
  const visit = { completed: false, bypassed: false };
  let prep = "idle"; // idle | preparing | active | skipped | failed
  let prologueOn = false; // percurso do voo instalado (não é removido nesta visita)
  let remounting = false;
  let lastRaw = 0; // rolagem bruta da Hero, em svh (último onUpdate)
  let manifest = null;
  let store = null;
  let live = null; // instância montada do prólogo (coordenador, desenho, canvas)
  // Olho esquerdo (do observador) da águia estática, em frações do arquivo (o direito é EYE, abaixo)
  const EYE_L = { x: 0.257, y: 0.237 };
  let OFF = 0;
  const at = (svh) => (svh + OFF) / TOTAL;
  const len = (svh) => svh / TOTAL;

  // Olho direito da águia no arquivo recortado (1043×1377): centro da íris e diâmetro, em frações.
  const EYE = { x: 0.562, y: 0.234, d: 0.081 };
  // Fases (em svh da timeline)
  const ZOOM = { start: 6, end: 146 };
  const WIPE_AT = 222;
  // desktop: saída curta depois da 3ª frase (era 34; com 20 sobra menos tela clara vazia antes da headline da S03)
  const WIPE_LEN_WIDE = 20;
  let WIPE_LEN = WIPE_LEN_WIDE;
  // Empilhado: a passagem não é uma fase da timeline, e sim a própria seção 03 subindo (ScrollTrigger "passage", abaixo):
  // a linha clara plena acompanha o topo da seção, 1:1 com a rolagem. Ela começa 12% de tela antes de a seção entrar
  // (a borda difusa, mais curta abaixo de 1024px: WIPE_SOFT_FLOW) e termina quando a seção chega ao topo — 112% de
  // tela, ≈ 131 × 0,86svh. A cauda da timeline (WIPE_LEN) só reserva esse trecho depois da 3ª frase; --story-h no CSS
  // acompanha (TOTAL 353). Tablet deitado (1svh por unidade, lado a lado): 112 unidades (TOTAL 334).
  const WIPE_LEN_STACKED = 129;
  const WIPE_LEN_FLOW = 110;
  // Atmosfera da seção 02: começa com a saída da headline e está pronta antes da 1ª frase ficar legível (~54)
  const ATMOSPHERE = { start: 14, end: 54 };
  // Narrativa: começa com a headline já fora (sai até 38) e o zoom em curso; termina antes da passagem
  const NARRATIVE = { start: 44, end: 228 };
  // Marcos publicados para o fundo procedural (js/light-field.js), que lê em vez de repetir números
  window.__vzStory = { total: TOTAL, atmosphere: ATMOSPHERE };

  // Estado visual da narrativa a partir do progresso (0–1): função pura, sem temporizador.
  // Cada terço é uma etapa: 16% de entrada, leitura estável, 16% de saída.
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smoothstep = (a, b, v) => {
    const t = clamp01((v - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  function getNarrativeState(raw) {
    const progress = clamp01(raw);
    const scaled = progress * 3;
    const activeIndex = Math.min(2, Math.floor(scaled));
    const local = clamp01(scaled - activeIndex);
    const entrance = smoothstep(0, 0.16, local);
    const exit = smoothstep(0.84, 1, local);
    return {
      progress,
      activeIndex,
      phraseOpacity: entrance * (1 - exit),
      phraseY: 8 * (1 - entrance) - 4 * exit,
      trackOpacity: smoothstep(0, 0.04, progress) * (1 - smoothstep(0.96, 1, progress)),
    };
  }
  // Mola do SplittingText (damping 20, stiffness 200, massa 1): ζ ≈ 0.707, ω ≈ 14.1 rad/s.
  // x(t) = 1 − e^(−10t)·(cos 10t + sin 10t); assenta em ~0,62s (leve ultrapassagem de ~4%).
  const SPRING_S = 0.62;
  const springAt = (t) => 1 - Math.exp(-10 * t) * (Math.cos(10 * t) + Math.sin(10 * t));
  const spring = (p) => springAt(p * SPRING_S) / springAt(SPRING_S);

  // Divide um elemento em palavras como o SplittingText (splitBy "words"): segmentos por /(\s+)/,
  // palavras em inline-block com aria-hidden; espaços e <br> ficam como estão; o texto integral vai
  // para um elemento só de leitores de tela. Elementos internos (o destaque) são preservados.
  function splitWords(el) {
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).filter(Boolean).forEach((seg) => {
            if (/^\s+$/.test(seg)) return frag.append(seg);
            const word = document.createElement("span");
            word.className = "hero__word";
            word.setAttribute("aria-hidden", "true");
            word.textContent = seg;
            words.push(word);
            frag.append(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    const label = document.createElement("span");
    label.className = "visually-hidden";
    label.textContent = el.textContent.replace(/\s+/g, " ").trim();
    walk(el);
    el.prepend(label);
    return words;
  }

  // Borda difusa da frente que revela a seção 03, em % da altura (a mesma do campo de luz)
  // Abaixo de 1024px a borda é mais curta: a headline da seção 03 aparece logo depois da 3ª frase, sem ~1/4 de tela
  // de degradê sem conteúdo antes dela (medido: ~200px em 390×844 com 24%).
  const WIPE_SOFT_WIDE = 24;
  const WIPE_SOFT_FLOW = 12;
  let WIPE_SOFT = WIPE_SOFT_WIDE;
  // Águia, vinheta do close e faixa do topo saem um pouco à frente do claro (nunca escuro sobre o claro)
  const WIPE_LEAD = 8;
  // Texto da seção 02 na cópia: surge em ~60px de avanço depois que o marfim pleno passa do seu topo
  const TEXT_RAMP = 60;

  const $ = (sel, el = hero) => el.querySelector(sel);
  const $$ = (sel, el = hero) => [...el.querySelectorAll(sel)];
  const stage = $(".hero__stage");
  // Altura de layout da cena (100svh). O palco pinta 100lvh (cobre a tela com as barras do Safari recolhidas), mas
  // o enquadramento do close continua referido à altura estável: o olho não desce quando as barras aparecem.
  const svhMeter = document.createElement("div");
  svhMeter.setAttribute("aria-hidden", "true");
  svhMeter.style.cssText = "position:absolute;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
  stage.append(svhMeter);

  const { gsap, ScrollTrigger, CustomEase } = window;
  // Display cards da Hero desktop (js/hero-display-cards.js): este arquivo só informa o estado. "Pronta" = entrada de
  // logo/menu, headline e CTA concluída; "faixa" = Hero pronta, antes de a Visão começar (a headline sai em ZOOM.start).
  const cards = window.VZHeroCards?.create({ root: $("[data-hero-cards]"), stage, gsap }) ?? null;
  if (window.__vzDebug) window.__vzDebug.cards = cards;
  if (!gsap || !ScrollTrigger) {
    root.classList.remove("js-story", "is-loading");
    // Hero estática, já pronta: os cards aparecem parados
    cards?.setHeroReady(true);
    cards?.setHeroRange(true);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Curvas dos tokens (CONTEXTO §14).
  let easeEmph = "expo.out";
  if (CustomEase) {
    gsap.registerPlugin(CustomEase);
    easeEmph = CustomEase.create("vz-emphasized", "0.22,1,0.36,1");
  }

  const header = document.querySelector("[data-header]");
  const headerInner = header?.firstElementChild;
  const figure = $("[data-hero-figure]");
  const light = $("[data-hero-light]");
  const eagle = $("[data-hero-eagle]");
  const eagleImg = eagle.querySelector("img") ?? eagle;
  const atmosphere = $(".hero__atmosphere");
  const content = $(".hero__content");
  const title = $("[data-hero-title]");
  const cta = $("[data-hero-cta]");

  const shade = $("[data-visao-shade]");
  const ghost = $("[data-visao-reveal]");
  const next = document.querySelector("[data-next]");
  // Fim da Visão: o palco sai de cena e a seção real (idêntica à cópia) aparece e assume
  const handOff = (on) => {
    stage.classList.toggle("is-handed-off", on);
    next?.classList.toggle("is-revealed", on);
  };
  // Narrativa: as três frases vêm do HTML (fonte única da copy)
  const narrative = $("[data-visao-narrative]");
  const phrases = $$("[data-narrative-phrase]", narrative);
  const counter = $("[data-narrative-count]", narrative);
  const counterNum = $("[data-narrative-num]", narrative);
  const track = $("[data-narrative-track]", narrative);
  const progressBar = $("[data-narrative-progress]", narrative);
  const phrasesBox = $("[data-narrative-phrases]", narrative);
  // Leitura assistiva no modo animado: um texto contínuo gerado das mesmas frases (lido uma vez);
  // a apresentação visual fica decorativa. Sem animação, as próprias frases ficam em fluxo.
  const narrativeSr = document.createElement("p");
  narrativeSr.className = "visually-hidden";
  narrativeSr.textContent = phrases.map((el) => el.textContent.trim()).join(" ");

  buildGhost();

  // Geometria medida (recalculada a cada refresh do ScrollTrigger)
  const g = {};

  // Luz que revela a seção 02: máscara vertical com borda difusa (0 = oculta, 1 = inteira)
  const wipe = { p: 0 };
  const applyWipe = () => {
    const edge = wipe.p * (100 + WIPE_SOFT);
    const mask = `linear-gradient(to top, #000 ${edge - WIPE_SOFT}%, transparent ${edge}%)`;
    ghost.style.webkitMaskImage = mask;
    ghost.style.maskImage = mask;
    // estado da passagem para o campo de luz (frente escuro → claro, mesma borda)
    window.__vzStory.wipe = wipe.p;
    window.__vzStory.wipeSoft = WIPE_SOFT / 100;
    hideBehindFront(edge + WIPE_LEAD);
    // Sem texto escuro sobre a faixa intermediária: cada bloco espera o marfim pleno passar do seu topo
    if (!g.ghostText) return;
    const opaqueTop = g.sh * (1 - (edge - WIPE_SOFT) / 100);
    g.ghostText.forEach(({ el, top }) => {
      el.style.opacity = gsap.utils.clamp(0, 1, (top - opaqueTop) / TEXT_RAMP);
    });
  };

  // Camadas escuras do close se apagam acima da frente: vinheta e faixa do topo por variável CSS (coordenadas
  // da tela); a águia ampliada recebe a mesma linha convertida para as coordenadas dela (escala uniforme).
  const hideBehindFront = (at) => {
    if (wipe.p <= 0) {
      stage.style.removeProperty("--wipe-hide");
      figure.style.webkitMaskImage = figure.style.maskImage = "";
      return;
    }
    stage.style.setProperty("--wipe-hide", `linear-gradient(to top, transparent ${at - WIPE_SOFT}%, #000 ${at}%)`);
    const sh = stage.clientHeight;
    const r = figure.getBoundingClientRect();
    const top = r.top - stage.getBoundingClientRect().top;
    const h = figure.offsetHeight;
    const k = r.height / Math.max(1, h);
    const local = (pct) => (h - (sh * (1 - pct / 100) - top) / k).toFixed(1);
    figure.style.webkitMaskImage = figure.style.maskImage = `linear-gradient(to top, transparent ${local(at - WIPE_SOFT)}px, #000 ${local(at)}px)`;
  };

  let introPlayed = false;
  // Headline palavra por palavra (equivalente ao SplittingText do projeto de referência: splitBy "words", preset
  // "slide-up", y 20 → 0, opacidade 0 → 1, mola damping 20 / stiffness 200, stagger 0.07). Só as palavras animam na
  // entrada; a saída por rolagem é do invólucro (.hero__content), então as duas nunca disputam as mesmas propriedades.
  let heroWords = [];
  const ensureWords = () => {
    if (!heroWords.length) heroWords = splitWords(title);
    return heroWords;
  };
  let titleReady = false; // fonte pronta (ou 1,5s)
  // Quem dispara a entrada: "legacy" (mobile, tablet e desktop sem voo: como sempre) ou "prologue" (desktop com voo:
  // só o coordenador, no pouso)
  let titleOwner = "legacy";
  let titlePlayed = false;
  let playTitle = null; // entrada de sempre (legacy)

  // Entrada da Hero no desktop com voo: os mesmos tweens de sempre agrupados numa timeline própria, tocada uma vez a
  // partir do pouso (sem o atraso antigo de intro.time()). Logo/menu entram 0,15s depois da 1ª palavra, a mesma
  // distância de antes (0,6 − 0,45).
  const entrance = {
    tl: null,
    state: "idle", // idle | hidden | playing | done
    targets() {
      return [...ensureWords(), cta, headerInner].filter(Boolean);
    },
    prepareHidden() {
      this.tl?.kill();
      this.tl = null;
      gsap.set(ensureWords(), { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, y: 12 });
      if (headerInner) gsap.set(headerInner, { autoAlpha: 0, y: -8 });
      this.state = "hidden";
    },
    playOnce(onDone) {
      if (this.state === "playing" || this.state === "done") return;
      const words = ensureWords();
      const t = gsap.timeline({
        onComplete: () => {
          this.state = "done";
          cards?.setHeroReady(true);
          onDone?.();
        },
      });
      t.fromTo(words, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: SPRING_S, ease: spring, stagger: 0.07 }, 0);
      // CTA logo depois da última palavra, sem disputar a leitura
      t.fromTo(cta, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: easeEmph }, words.length * 0.07 + 0.2);
      if (headerInner) t.fromTo(headerInner, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: easeEmph }, 0.15);
      this.tl = t;
      this.state = "playing";
      titlePlayed = true;
    },
    // Estado final de TODOS os alvos, já (cancela atrasos pendentes); não depende de callbacks da timeline
    finishImmediately() {
      if (this.tl) {
        this.tl.progress(1);
        this.tl.kill();
        this.tl = null;
      }
      this.restoreReady();
      this.state = "done";
      titlePlayed = true;
      cards?.setHeroReady(true);
    },
    restoreReady() {
      gsap.set(this.targets(), { autoAlpha: 1, y: 0 });
    },
    isComplete() {
      return this.state === "done";
    },
    dispose() {
      this.tl?.kill();
      this.tl = null;
    },
  };

  const QUERIES = { story: STORY_QUERY, stacked: STACKED_QUERY, flow: FLOW_QUERY };
  let mm = gsap.matchMedia();
  mm.add(QUERIES, setup);
  // Com movimento reduzido no desktop nenhuma das três condições casa e setup() nem roda: a Hero fica estática pelo
  // CSS, já pronta. Os display cards precisam saber disso por aqui (ficam parados; ver js/hero-display-cards.js).
  const storyMq = window.matchMedia(STORY_QUERY);
  const staticHero = () => {
    if (storyMq.matches) return;
    cards?.setHeroReady(true);
    cards?.setHeroRange(true);
  };
  staticHero();
  storyMq.addEventListener("change", staticHero);

  // Remonta a Hero (ativação do voo): o percurso muda, então a timeline é refeita. A posição de rolagem não é tocada.
  function remount() {
    remounting = true;
    mm.revert();
    remounting = false;
    mm = gsap.matchMedia();
    mm.add(QUERIES, setup);
    ScrollTrigger.refresh();
  }

  function setup(ctx) {
    const { story, stacked, flow } = ctx.conditions;
    root.classList.toggle("js-story", story);
    WIPE_LEN = stacked ? WIPE_LEN_STACKED : flow ? WIPE_LEN_FLOW : WIPE_LEN_WIDE;
    WIPE_SOFT = flow ? WIPE_SOFT_FLOW : WIPE_SOFT_WIDE;
    // Voo só no desktop com movimento. A condição é conferida ANTES de pedir o manifesto (no mobile nada é baixado).
    const desk = story && !flow && !!VOO;
    if (desk && prep === "idle") ctx.ignore(beginPreparing);
    const withPrologue = desk && prologueOn;
    const preparing = desk && prep === "preparing";
    OFF = withPrologue ? PCFG.flightSvh + PCFG.readyZoneSvh : 0;
    TOTAL = OFF + WIPE_AT + WIPE_LEN + 2;
    if (window.__vzDebug) (window.__vzDebug.heroSetups ||= []).push({ story, stacked, flow, prep, prologueOn, visit: { ...visit }, OFF });
    window.__vzStory.total = TOTAL;
    window.__vzStory.atmosphere = { start: ATMOSPHERE.start + OFF, end: ATMOSPHERE.end + OFF };
    // Altura do contêiner = rolagem da timeline + 100svh (o CSS só conhece as versões sem voo)
    if (withPrologue) hero.style.setProperty("--story-h", `${TOTAL + 100}svh`);
    else hero.style.removeProperty("--story-h");
    hero.classList.toggle("has-prologue", withPrologue || preparing);

    if (!story) {
      // Reduced motion ou tela baixa: Hero estática; a seção 02 mostra o emblema já alinhado.
      if (titleOwner === "prologue" && !entrance.isComplete()) entrance.finishImmediately();
      root.classList.remove("is-loading");
      // Hero estática (sem timeline): pronta e na faixa; a visibilidade na tela fica com o observador dos cards
      cards?.setHeroReady(true);
      cards?.setHeroRange(true);
      return;
    }

    // ---------- Entrada (uma vez por carregamento): águia, luz e header ----------
    if (!introPlayed) {
      introPlayed = true;
      // Fora do contexto do matchMedia: a remontagem da ativação não pode desfazer a entrada
      ctx.ignore(() => {
        titleOwner = preparing || withPrologue ? "prologue" : "legacy";
        const intro = gsap.timeline({ defaults: { ease: easeEmph } });
        intro.from(light, { opacity: 0, duration: 1.4, ease: "power1.out" }, 0);
        if (titleOwner === "legacy") {
          intro
            // Na imagem, não no invólucro: a opacidade do invólucro pertence à timeline de rolagem
            // (ao recarregar no meio da Visão, a entrada não pode devolver a águia sobre o diagrama)
            .from(eagleImg, { autoAlpha: 0, yPercent: 4, duration: 1.2 }, 0.1)
            .from(headerInner, { autoAlpha: 0, y: -8, duration: 0.4 }, 0.6);
          ensureWords();
          gsap.set(heroWords, { autoAlpha: 0, y: 20 });
          gsap.set(cta, { autoAlpha: 0, y: 12 });
          // A entrada espera a Gloock (sem troca de fonte no meio); no máximo 1,5s.
          playTitle = () => {
            titlePlayed = true;
            const delay = Math.max(0, 0.45 - intro.time());
            gsap.fromTo(heroWords, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: SPRING_S, ease: spring, stagger: 0.07, delay });
            gsap.fromTo(cta, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: easeEmph, delay: delay + heroWords.length * 0.07 + 0.2, onComplete: () => cards?.setHeroReady(true) });
          };
        } else {
          // Desktop com voo: palavras, CTA e logo/menu ocultos até o pouso; a águia estática fica oculta pelo CSS
          entrance.prepareHidden();
        }
        // A fonte pronta só libera o recurso; no desktop com voo quem inicia a entrada é o coordenador
        Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
          titleReady = true;
          if (titleOwner === "legacy" && !titlePlayed) playTitle();
        });
      });
      root.classList.remove("is-loading");
    }

    // Enquadramento final do close: mobile/retrato com o olho no terço superior (mensagem embaixo, nas
    // penas escuras); desktop com o olho à esquerda (mensagem no espaço à direita).
    // Enquadramento original do close (versão aprovada). No mobile, a escala final é dada pelo tamanho do
    // olho na tela (25,7% da largura, como na versão aprovada), para que a águia maior da abertura não
    // aumente a ampliação do close.
    const cfg = stacked
      ? { fx: 0.5, fy: 0.355, s25: 1.5, s50: 3.0, eyeFrac: 0.257, rMin: 0.36, rMaxW: 0.42 }
      : { fx: 0.64, fy: 0.5, s25: 1.6, s50: 2.9, rMin: 0.34, rMaxW: 0.24 };

    measure(cfg);
    applyWipe();
    // Voo montado só enquanto ainda não houve pouso nem desvio; depois disso a Hero aparece pronta
    const flying = withPrologue && !visit.completed && !visit.bypassed;
    const prologue = flying ? mountPrologue() : null;
    hero.classList.toggle("is-prologue", flying || preparing);
    if (header) header.inert = flying || preparing;
    if (withPrologue && !flying && titleOwner === "prologue" && !entrance.isComplete()) entrance.finishImmediately();
    const onRefreshInit = () => {
      measure(cfg);
      prologue?.measure();
    };
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

    // Narrativa: estado derivado do tempo APLICADO da timeline (já suavizado pelo scrub), a cada render.
    // Parar mantém a etapa; voltar retorna; saltos e recarregamento caem no estado certo.
    let tl = null; // atribuída abaixo; o onRefresh do ScrollTrigger pode chamar antes
    let lastIndex = -1;
    narrative.prepend(narrativeSr);
    phrasesBox.setAttribute("aria-hidden", "true");
    const renderNarrative = () => {
      if (!tl) return;
      const t = tl.time() * TOTAL - OFF;
      const st = getNarrativeState((t - NARRATIVE.start) / (NARRATIVE.end - NARRATIVE.start));
      phrases.forEach((el, i) => {
        const on = i === st.activeIndex && st.phraseOpacity > 0.001;
        el.style.opacity = on ? st.phraseOpacity.toFixed(3) : "0";
        el.style.visibility = on ? "visible" : "hidden";
        el.style.transform = on ? `translate3d(0, ${st.phraseY.toFixed(2)}px, 0)` : "";
      });
      if (st.activeIndex !== lastIndex) {
        lastIndex = st.activeIndex;
        counterNum.textContent = String(st.activeIndex + 1).padStart(2, "0");
      }
      counter.style.opacity = track.style.opacity = st.trackOpacity.toFixed(3);
      progressBar.style.transform = `scaleX(${st.progress.toFixed(4)})`;
      if (window.__vzDebug) window.__vzDebug.narrative = { t, ...st };
    };
    const render = () => {
      renderNarrative();
      // Cards: na faixa só antes de a headline começar a sair (tempo aplicado, o mesmo que a tela mostra)
      if (tl) cards?.setHeroRange(tl.time() * TOTAL < OFF + ZOOM.start);
      if (!withPrologue || !tl) return;
      const t = tl.time() * TOTAL;
      // Fronteira obrigatória: nada da Visão antes da Hero pronta (a rolagem bruta normalmente já resolveu antes)
      if (t > OFF) live?.coord.bypassToReady("legacy-boundary");
      // Header junto do palco enquanto ele é visível (até o fim da sua saída original, 8–28 da Visão); depois volta
      // ao lugar de sempre, oculto, e não acompanha o resto da página
      header?.classList.toggle("is-prologue-fixed", t < OFF + 30);
    };
    // Rolagem bruta (sem suavização): é ela que escolhe o quadro do voo
    const onRaw = (self) => {
      lastRaw = self.progress * TOTAL;
      if (preparing && prep === "preparing" && lastRaw > ENTRY_GUARD_SVH) skipPrologue("scrolled");
      live?.coord.updateRaw(lastRaw);
    };

    tl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: render,
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: onRaw,
        // Ao terminar, a seção real (idêntica à cópia revelada) assume e fica interativa.
        onLeave: (self) => {
          live?.coord.bypassToReady("leave");
          self.getTween()?.progress(1);
          handOff(true);
        },
        onEnterBack: () => handOff(false),
        onRefresh: (self) => {
          handOff(self.progress >= 1);
          onRaw(self);
          render();
        },
      },
    });

    tl.to({}, { duration: 1 }, 0); // duração total 1 = progresso da rolagem

    // ---------- Abertura sai: header e atmosfera de base ----------
    // Correção (09/11/2026): opacity com início explícito + visibility pelo progresso do próprio tween, no lugar de
    // autoAlpha. Com invalidateOnRefresh, recarregar a página abaixo da Hero gravava o fim (autoAlpha 0) como início: ao
    // subir, o y voltava e a headline, o CTA e o cabeçalho continuavam invisíveis (opacity 0, visibility hidden). Mesma
    // animação, mesmos tempos; invisível continua sem clique.
    const hideAtEnd = (el) => function () {
      el.style.visibility = this.progress() > 0.999 ? "hidden" : "";
    };
    tl.fromTo(
      header,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -16, duration: len(20), immediateRender: false, onUpdate: hideAtEnd(header) },
      at(8)
    ).to(atmosphere, { opacity: 0, duration: len(56) }, at(22));
    // Headline + CTA: inteiros nos primeiros 6svh; depois sobem levemente e esmaecem antes de a aproximação
    // levar a cabeça da águia até a coluna do texto (~30svh). Ao subir, reverte (sem repetir a entrada).
    tl.fromTo(
      content,
      { opacity: 1, y: 0 },
      { opacity: 0, y: () => -0.05 * stage.clientHeight, duration: len(32), ease: "power1.inOut", immediateRender: false, onUpdate: hideAtEnd(content) },
      at(6)
    );

    // ---------- Aproximação: câmera até o close do olho (a águia permanece visível) ----------
    tl.fromTo(
      figure,
      { x: 0, y: 0, scale: 1 },
      { x: () => g.dx * 0.85, y: () => g.dy * 0.85, scale: () => g.s25, duration: len(70), ease: "power1.inOut", immediateRender: false },
      at(ZOOM.start)
    )
      .to(figure, { x: () => g.dx, y: () => g.dy, scale: () => g.s50, duration: len(70), ease: "power1.in" }, at(76))
      // desktop: a aproximação não para no close — segue lenta (+14%, ancorada no olho) até o fim da passagem,
      // para a águia não "congelar" como foto durante as três frases (revisão 24/10; o mobile fica como está)
      .to(figure, { scale: () => (stacked ? g.s50 : g.s50 * 1.14), duration: len(WIPE_AT + WIPE_LEN - ZOOM.end), ease: "none" }, at(ZOOM.end))
      .to(light, { x: () => g.lightDx, y: () => g.lightDy, scale: 1.08, duration: len(110), ease: "power1.inOut" }, at(60))
      // fundo da versão aprovada: vinheta 0,55 em volta do olho e águia a 30% sobre os reflexos do Silk
      // atmosfera (janela própria, separada do zoom e da narrativa): águia integrada ao fundo desde a 1ª frase
      .to(shade, { opacity: 0.55, duration: len(ATMOSPHERE.end - ATMOSPHERE.start), ease: "sine.inOut" }, at(ATMOSPHERE.start))
      .to(eagle, { opacity: 0.36, duration: len(ATMOSPHERE.end - ATMOSPHERE.start), ease: "sine.inOut" }, at(ATMOSPHERE.start));

    // ---------- Passagem: a superfície marfim sobe como luz, com borda difusa, sem flash ----------
    // Desktop: fase da timeline. Abaixo de 1024px: presa à geometria da seção 03 — a frente plena
    // (edge − WIPE_SOFT) fica exatamente no topo da seção, então não existe faixa clara sem conteúdo entre a luz e a
    // headline, em qualquer velocidade de rolagem (sem scrub: a luz não se atrasa em relação ao conteúdo).
    let passage = null;
    if (flow && next) {
      const span = 1 + WIPE_SOFT / 100;
      passage = ScrollTrigger.create({
        trigger: next,
        // em pixels do PALCO (100lvh), não da janela: a frente é desenhada em % do palco e do campo de luz, e no
        // Safari a janela muda com as barras — assim a linha plena continua exatamente no topo da seção
        start: () => `top ${Math.round(stage.offsetHeight * span)}px`,
        end: "top top",
        onUpdate: (self) => {
          wipe.p = self.progress;
          applyWipe();
        },
        onRefresh: (self) => {
          wipe.p = self.progress;
          applyWipe();
        },
      });
    } else {
      tl.fromTo(wipe, { p: 0 }, { p: 1, duration: len(WIPE_LEN), ease: "power1.inOut", immediateRender: false, onUpdate: applyWipe }, at(WIPE_AT));
    }

    render();

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      hero.style.removeProperty("--story-h");
      prologue?.destroy();
      if (!remounting) {
        // Saída do desktop (ou desmontagem geral): nada do voo fica para trás. Um voo interrompido não recomeça.
        if (prep === "preparing") skipPrologue("breakpoint", true);
        if (prologueOn && !visit.completed) visit.bypassed = true;
        hero.classList.remove("is-prologue", "has-prologue");
        header?.classList.remove("is-prologue-fixed");
        if (header) header.inert = false;
        if (titleOwner === "prologue" && !entrance.isComplete()) entrance.finishImmediately();
      }
      passage?.kill();
      handOff(false);
      phrases.forEach((el) => el.removeAttribute("style"));
      narrativeSr.remove();
      phrasesBox.removeAttribute("aria-hidden");
      [counter, track, progressBar].forEach((el) => el.removeAttribute("style"));
      root.classList.remove("js-story");
      wipe.p = 0;
      applyWipe();
    };
  }

  // Fontes alteram medidas da cópia de "O que fazemos".
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  // ---------- Prólogo do desktop: preparação e ativação ----------
  // A preparação não instala percurso: a Hero fica no estado de abertura (sem texto, sem águia estática) enquanto o
  // manifesto e os quadros críticos (primeiro e último, decodificados) chegam. Pronto a tempo e com o visitante ainda
  // no topo → ativa (percurso do voo instalado). Falha, tempo esgotado ou rolagem/âncora → a Hero de sempre, sem voo.
  const devWarn = (...a) => /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && console.warn("[hero]", ...a);

  function beginPreparing() {
    if (location.hash) return skipPrologue("hash", true);
    prep = "preparing";
    const watchdog = PCFG.criticalTimeoutMs;
    const started = performance.now();
    const t0 = setTimeout(() => prep === "preparing" && skipPrologue("timeout"), watchdog);
    fetch(PROLOGUE_SRC)
      .then((r) => {
        if (!r.ok) throw new Error(`voo: manifest ${r.status}`);
        return r.json();
      })
      .then((m) => {
        if (prep !== "preparing") return;
        manifest = VOO.validateManifest(m);
        store = VOO.createFrameStore({ manifest, config: PCFG });
        // quadro decodificado → desenhar o ALVO ATUAL (nunca o índice capturado aqui)
        store.onDecoded(() => live?.schedule());
        store.onFailed(() => live?.schedule());
        return store.critical(Math.max(0, watchdog - (performance.now() - started)));
      })
      .then(() => {
        clearTimeout(t0);
        if (prep !== "preparing") return;
        if (location.hash || lastRaw > ENTRY_GUARD_SVH) return skipPrologue("scrolled");
        prep = "active";
        prologueOn = true;
        remount();
      })
      .catch((err) => {
        clearTimeout(t0);
        if (prep === "preparing") skipPrologue("failed", false, err);
      });
  }

  // Sem voo nesta visita (antes da ativação): a Hero de sempre, sem percurso extra
  function skipPrologue(reason, silent, err) {
    if (prep !== "preparing" && prep !== "idle") return;
    prep = reason === "failed" || reason === "timeout" ? "failed" : "skipped";
    visit.bypassed = true;
    devWarn(`voo desativado (${reason})`, err?.message || "");
    store?.dispose();
    store = null;
    if (silent && titleOwner !== "prologue") return; // nada foi ocultado ainda
    hero.classList.remove("is-prologue", "has-prologue");
    if (header) header.inert = false;
    if (titleOwner !== "prologue" || entrance.isComplete()) return;
    // a águia estática entra como sempre; o texto também, ou já pronto se a Visão começou a escondê-lo
    if (!silent) gsap.from(eagleImg, { autoAlpha: 0, yPercent: 4, duration: 1.2, ease: easeEmph });
    const go = () => (lastRaw > 6 ? entrance.finishImmediately() : entrance.playOnce());
    titleReady ? go() : Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(go);
  }

  // Âncora, link de pular ou volta do histórico: o destino é respeitado e a Hero fica pronta (nunca volta ao topo)
  const bypassAll = (reason) => {
    if (prep === "preparing") skipPrologue(reason);
    live?.coord.bypassToReady(reason);
  };
  document.querySelector(".skip-link")?.addEventListener("click", () => bypassAll("skip-link"));
  window.addEventListener("hashchange", () => bypassAll("hash"));
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) live?.coord.updateRaw(lastRaw);
  });

  // ---------- Prólogo montado: canvas, desenho e coordenador ----------
  // Uma instância por montagem; callbacks de uma instância desmontada não fazem nada (coord.alive).
  function mountPrologue() {
    const canvas = document.createElement("canvas");
    canvas.className = "hero__prologue";
    canvas.setAttribute("aria-hidden", "true");
    figure.after(canvas);
    const ctx2d = canvas.getContext("2d");
    const renderer = VOO.createRenderer({ ctx: ctx2d, frame: { w: manifest.width, h: manifest.height } });
    const geo = {};
    const span = manifest.finalFrame - manifest.firstFrame;
    const settleFrom = PCFG.flightSvh * Math.max(0, (span - SETTLE_FRAMES) / span);
    const a = manifest.finalAnchor;
    const eyes = { x: (a.leftEye.x + a.rightEye.x) / 2, y: (a.leftEye.y + a.rightEye.y) / 2, d: Math.hypot(a.rightEye.x - a.leftEye.x, a.rightEye.y - a.leftEye.y) };
    let raf = 0;
    let fadeTimer = 0;

    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5, 2560 / Math.max(1, w));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      renderer.resize(w, h, dpr); // nova revisão: o mesmo quadro é redesenhado
      // voo em tela cheia (uma só matriz para todos os quadros até o pouso)
      const sc = Math.max(w / manifest.width, h / manifest.height);
      geo.cover = { x: (w - manifest.width * sc) / 2, y: (h - manifest.height * sc) / 2, s: sc };
      // pouso sobre a águia estática: olhos do último quadro sobre os olhos da imagem (layout, sem transforms)
      const fw = figure.offsetWidth;
      const fh = figure.offsetHeight;
      const sf = ((EYE.x - EYE_L.x) * fw) / eyes.d;
      const mx = figure.offsetLeft + ((EYE.x + EYE_L.x) / 2) * fw;
      const my = figure.offsetTop + ((EYE.y + EYE_L.y) / 2) * fh;
      geo.final = { x: mx - eyes.x * sf, y: my - eyes.y * sf, s: sf };
      schedule();
    };
    // Matriz do quadro: fixa (tela cheia) até o pouso; nos últimos SETTLE_FRAMES vai ao enquadramento da estática
    const matrixAt = (raw) => {
      const k = smoothstep(settleFrom, PCFG.flightSvh, raw);
      const { cover: c0, final: c1 } = geo;
      const s = c0.s + (c1.s - c0.s) * k;
      const x = c0.x + (c1.x - c0.x) * k;
      const y = c0.y + (c1.y - c0.y) * k;
      return { x, y, s, mask: k, key: `${x.toFixed(1)}|${y.toFixed(1)}|${s.toFixed(4)}` };
    };
    // Um desenho por quadro de tela, no máximo; o pedido mais recente vence
    const schedule = () => {
      if (raf || !coord.alive) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        coord.renderCurrentTarget();
      });
    };
    // Troca do voo pela Hero pronta. A águia estática já está exatamente sob o último quadro.
    const handoff = (fade) => {
      hero.classList.remove("is-prologue");
      if (header) header.inert = false;
      const finish = () => {
        canvas.style.visibility = "hidden";
        renderer.clear();
        store?.releaseAll();
      };
      if (fade) {
        canvas.style.opacity = "0";
        fadeTimer = setTimeout(finish, 400);
      } else finish();
    };
    // Diagnóstico de desenvolvimento (só quando window.__vzDebug existe): fase, trava, quadro pedido/desenhado, cache
    const diag = () => {
      if (window.__vzDebug && live?.coord) window.__vzDebug.prologue = { prep, visit: { ...visit }, ...live.coord.snapshot(), store: store?.snapshot(), draw: renderer.timings.slice(-1)[0] };
    };
    const coord = VOO.createCoordinator({
      config: PCFG,
      manifest,
      store,
      renderer,
      visit,
      schedule,
      hooks: {
        matrixAt,
        onCommit() {
          store.stopSpeculative([manifest.finalFrame]);
          handoff(true);
          entrance.playOnce(() => coord.entranceComplete());
        },
        onBypass(reason) {
          store.stopSpeculative();
          handoff(false);
          entrance.finishImmediately();
          devWarn(`voo pulado (${reason})`);
        },
        onFallback(reason) {
          store.stopSpeculative();
          handoff(false);
          lastRaw > OFF + 6 ? entrance.finishImmediately() : entrance.playOnce();
          devWarn(`voo: estado final por falha (${reason})`);
        },
        finishEntrance: () => entrance.finishImmediately(),
        onPhase(p) {
          hero.dataset.prologue = p;
          diag();
        },
        diag,
      },
    });
    hero.dataset.prologue = coord.phase;
    live = { coord, schedule, measure };
    measure();
    coord.updateRaw(lastRaw);

    return {
      measure,
      destroy() {
        coord.dispose();
        if (live?.coord === coord) live = null;
        cancelAnimationFrame(raf);
        clearTimeout(fadeTimer);
        canvas.remove();
        delete hero.dataset.prologue;
      },
    };
  }

  // ---------- Geometria ----------
  function measure(cfg) {
    const sw = stage.clientWidth;
    const sh = svhMeter.offsetHeight || stage.clientHeight;
    const fx = sw * cfg.fx;
    const fy = sh * cfg.fy;

    // Olho no layout (sem transforms) e origem da câmera no próprio olho
    const fw = figure.offsetWidth;
    const fh = figure.offsetHeight;
    const px = figure.offsetLeft + EYE.x * fw;
    const py = figure.offsetTop + EYE.y * fh;
    figure.style.transformOrigin = `${EYE.x * 100}% ${EYE.y * 100}%`;

    // Escala final do close; no mobile, pelo tamanho do olho na tela (ver cfg)
    const s50 = cfg.eyeFrac ? (cfg.eyeFrac * sw) / (EYE.d * fw) : cfg.s50;
    const s25 = cfg.s25 * (s50 / cfg.s50);
    // Raio da vinheta (mesma regra da versão aprovada)
    const eyeR = (EYE.d * fw * s50) / 2;
    const focusR = Math.min(Math.max(eyeR * 2.2, Math.min(sw, sh) * cfg.rMin), sw * cfg.rMaxW);
    stage.style.setProperty("--focus-x", `${fx}px`);
    stage.style.setProperty("--focus-y", `${fy}px`);
    stage.style.setProperty("--iris-r", `${focusR}px`);

    // Centro da luz da parede no layout (CSS: translate -60% -48% sobre o próprio tamanho)
    const lw = light.offsetWidth;
    const lh = light.offsetHeight;
    const lcx = light.offsetLeft - 0.1 * lw;
    const lcy = light.offsetTop + 0.02 * lh;

    Object.assign(g, {
      dx: fx - px,
      dy: fy - py,
      s25,
      s50,
      lightDx: fx - lcx - focusR * 0.25,
      lightDy: fy - lcy - focusR * 0.2,
    });

    // Cópia de "O que fazemos": posição de cada bloco de texto para a passagem
    const stageRect = stage.getBoundingClientRect();
    g.sh = sh;
    g.ghostText = $$(".oqf-mark, .next-section__title, .next-section__body > *, .oqf-premise", ghost).map((el) => {
      const r = el.getBoundingClientRect();
      return { el, top: r.top - stageRect.top };
    });
  }

  // Cópia visual do topo da seção 02 dentro do palco (sem ids, inerte, oculta de leitores de tela).
  function buildGhost() {
    const source = document.querySelector("[data-next] .next-section__inner");
    if (!ghost || !source) return;
    const copy = source.cloneNode(true);
    copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    ghost.replaceChildren(copy);
  }
})();
