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
  // Prólogo do desktop (≥1024px, com movimento): antes de tudo acima, o voo da águia (assets/hero/voo, 241 quadros
  // com alfa) é percorrido pela própria rolagem — atravessa da esquerda para a direita, sai, volta e para de frente.
  // Ocupa OFF svh no início da MESMA timeline (nenhum pin novo): todas as marcas acima só são deslocadas por OFF.
  //     0–200   voo (quadro = rolagem; nos últimos 30 a imagem assenta no enquadramento da águia estática)
  //   200–224   último quadro; o voo cede à águia estática (mesma pose e posição)
  //   224       headline + CTA entram com o efeito de sempre (palavra por palavra, mola)
  //   224–260   leitura; a partir de 260 (= 0 acima) segue a Visão como era
  // Mobile, tablet, movimento reduzido ou falha ao carregar os quadros: OFF = 0, a Hero de sempre.
  const PROLOGUE = { clip: 200, settle: 30, hold: 24, read: 36, rearm: 12 };
  const PROLOGUE_SRC = "assets/hero/voo/manifest.json";
  const FRAME = { w: 1600, h: 890 }; // tamanho de cada quadro
  let voo = null; // carregador dos quadros (loadVoo, abaixo)
  // Último quadro do voo (1600×890): ponto médio dos olhos e distância entre eles, em px do quadro (medidos no
  // master e afinados pela comparação de pixels com a águia estática: desvio ≤ 1px CSS de 1024 a 1920)
  const VOO_EYES = { x: 992.2, y: 323.2, d: 321.3 };
  // Olho esquerdo (do observador) da águia estática, em frações do arquivo (o direito é EYE, abaixo)
  const EYE_L = { x: 0.257, y: 0.237 };
  let OFF = 0;
  let prologueFailed = false;
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
  if (!gsap || !ScrollTrigger) {
    root.classList.remove("js-story", "is-loading");
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
  // Entrada da headline: criada uma vez (na 1ª entrada) e tocada uma vez por carregamento, como sempre foi.
  // No prólogo ela espera o fim do voo (titleGate).
  let heroWords = [];
  let playTitle = null;
  let titlePlayed = false; // a entrada já tocou
  let titleReady = false; // fonte pronta (ou 1,5s)
  let titleGate = null; // no prólogo: decide, pela rolagem, quando a entrada toca
  let titleBound = false; // depois da entrada, numa volta ao voo: visibilidade presa à rolagem
  const setTitleAlpha = (a) => {
    gsap.killTweensOf([...heroWords, cta]);
    gsap.set([...heroWords, cta], { autoAlpha: a, y: 0 });
  };

  const QUERIES = { story: STORY_QUERY, stacked: STACKED_QUERY, flow: FLOW_QUERY };
  let mm = gsap.matchMedia();
  mm.add(QUERIES, setup);

  function setup(ctx) {
    const { story, stacked, flow } = ctx.conditions;
    root.classList.toggle("js-story", story);
    WIPE_LEN = stacked ? WIPE_LEN_STACKED : flow ? WIPE_LEN_FLOW : WIPE_LEN_WIDE;
    WIPE_SOFT = flow ? WIPE_SOFT_FLOW : WIPE_SOFT_WIDE;
    // Prólogo só no desktop com movimento (e se os quadros carregaram)
    const withPrologue = story && !flow && !prologueFailed;
    OFF = withPrologue ? PROLOGUE.clip + PROLOGUE.hold + PROLOGUE.read : 0;
    TOTAL = OFF + WIPE_AT + WIPE_LEN + 2;
    window.__vzStory.total = TOTAL;
    window.__vzStory.atmosphere = { start: ATMOSPHERE.start + OFF, end: ATMOSPHERE.end + OFF };
    // Altura do contêiner = rolagem da timeline + 100svh (o CSS só conhece as versões sem prólogo)
    if (withPrologue) hero.style.setProperty("--story-h", `${TOTAL + 100}svh`);
    else hero.style.removeProperty("--story-h");

    if (!story) {
      // Reduced motion ou tela baixa: Hero estática; a seção 02 mostra o emblema já alinhado.
      root.classList.remove("is-loading");
      return;
    }

    // ---------- Entrada (uma vez por carregamento): só águia, luz e header ----------
    if (!introPlayed) {
      introPlayed = true;
      const intro = gsap.timeline({ defaults: { ease: easeEmph } });
      intro
        .from(light, { opacity: 0, duration: 1.4, ease: "power1.out" }, 0)
        // Na imagem, não no invólucro: a opacidade do invólucro pertence à timeline de rolagem
        // (ao recarregar no meio da Visão, a entrada não pode devolver a águia sobre o diagrama)
        .from(eagleImg, { autoAlpha: 0, yPercent: 4, duration: 1.2 }, 0.1)
        .from(headerInner, { autoAlpha: 0, y: -8, duration: 0.4 }, 0.6);

      // Headline palavra por palavra: equivalente ao SplittingText do projeto de referência
      // (splitBy "words", preset "slide-up": y 20 → 0, opacidade 0 → 1, mola damping 20 / stiffness 200),
      // com o stagger de 0.07s aprovado. Só as palavras animam na entrada; a saída por rolagem é do
      // invólucro (.hero__content), então as duas nunca disputam as mesmas propriedades.
      // A entrada espera a Gloock (sem troca de fonte no meio); no máximo 1,5s.
      heroWords = splitWords(title);
      gsap.set(heroWords, { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, y: 12 });
      // Sempre a partir do estado oculto (fromTo com os mesmos valores do set acima): no prólogo a entrada pode
      // tocar de novo depois que a rolagem volta para o voo.
      playTitle = () => {
        titlePlayed = true;
        gsap.killTweensOf([...heroWords, cta]);
        const delay = Math.max(0, 0.45 - intro.time());
        gsap.fromTo(heroWords, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: SPRING_S, ease: spring, stagger: 0.07, delay });
        // CTA logo depois da última palavra, sem disputar a leitura
        gsap.fromTo(cta, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: easeEmph, delay: delay + heroWords.length * 0.07 + 0.2 });
      };
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
        titleReady = true;
        if (titleGate) titleGate();
        else if (!titlePlayed) playTitle();
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
    const prologue = withPrologue ? createPrologue() : null;
    const onRefreshInit = () => {
      measure(cfg);
      prologue?.measure();
    };
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
    // Headline no prólogo: a entrada original toca (uma vez) quando o voo termina e a águia estática assumiu.
    // Se depois a rolagem volta para o voo, headline e CTA não repetem a entrada: ficam inteiros até a borda do
    // prólogo e somem/voltam presos à rolagem nos PROLOGUE.rearm svh antes dela (estado determinístico, sem foco
    // em CTA invisível — autoAlpha).
    if (prologue) {
      titleGate = () => {
        if (!tl || !playTitle) return;
        const t = tl.time() * TOTAL;
        const gate = PROLOGUE.clip + PROLOGUE.hold;
        if (!titlePlayed) {
          if (titleReady && t >= gate) playTitle();
          return;
        }
        if (t >= gate) {
          if (titleBound) setTitleAlpha(1);
          titleBound = false;
          return;
        }
        titleBound = true;
        setTitleAlpha(smoothstep(gate - PROLOGUE.rearm, gate, t));
      };
    }

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
      if (!prologue || !tl) return;
      prologue.render(tl.time() * TOTAL);
      titleGate?.();
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
        // Ao terminar, a seção real (idêntica à cópia revelada) assume e fica interativa.
        onLeave: (self) => {
          self.getTween()?.progress(1);
          handOff(true);
        },
        onEnterBack: () => handOff(false),
        onRefresh: (self) => {
          handOff(self.progress >= 1);
          render();
        },
      },
    });

    tl.to({}, { duration: 1 }, 0); // duração total 1 = progresso da rolagem

    // ---------- Abertura sai: header e atmosfera de base ----------
    tl.to(header, { autoAlpha: 0, y: -16, duration: len(20) }, at(8)).to(atmosphere, { opacity: 0, duration: len(56) }, at(22));
    // Headline + CTA: inteiros nos primeiros 6svh; depois sobem levemente e esmaecem antes de a aproximação
    // levar a cabeça da águia até a coluna do texto (~30svh). Ao subir, reverte (sem repetir a entrada).
    // autoAlpha: invisível também deixa de ser clicável.
    tl.fromTo(
      content,
      { autoAlpha: 1, y: 0 },
      { autoAlpha: 0, y: () => -0.05 * stage.clientHeight, duration: len(32), ease: "power1.inOut", immediateRender: false },
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
      if (prologue) {
        prologue.destroy();
        titleGate = null;
        // fora do prólogo a headline não espera a rolagem: entra como sempre (se a fonte já está pronta;
        // senão, a própria espera da fonte a mostra)
        if (!titlePlayed && titleReady) {
          requestAnimationFrame(() => {
            if (!titlePlayed && !titleGate) playTitle();
          });
        } else if (titleBound) {
          setTitleAlpha(1);
          titleBound = false;
        }
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

  // ---------- Prólogo do desktop: quadros do voo ----------
  // Carregados uma vez, só quando o prólogo é montado (no mobile e no tablet nada é pedido). Primeiro e último quadros
  // são obrigatórios (até 8s); os demais vêm depois do load da página, 6 de cada vez, a partir do ponto da rolagem.
  // Sem o primeiro e o último a tempo, a Hero volta a ser a de sempre (fallbackToStatic).
  function loadVoo() {
    if (voo) return voo;
    const v = (voo = { n: 0, frames: [], imgs: [], state: [], want: 0, inflight: 0, active: true, onLoad: null });
    const get = (i) =>
      new Promise((resolve, reject) => {
        v.state[i] = 1;
        v.inflight++;
        const img = new Image();
        img.decoding = "async";
        // pronto no load (decode() pode ficar pendente com a aba em segundo plano; ele só é pedido perto do quadro atual)
        img.onload = () => {
          v.imgs[i] = img;
          v.state[i] = 2;
          v.inflight--;
          resolve();
          v.onLoad?.(i);
        };
        img.onerror = () => {
          v.state[i] = 3;
          v.inflight--;
          reject(new Error(`voo: quadro ${i}`));
        };
        img.src = v.frames[i];
      });
    // próximo quadro: o mais perto do que a rolagem pede
    v.pump = () => {
      while (v.active && v.inflight < 6) {
        let pick = -1;
        for (let d = 0; d < v.n && pick < 0; d++) {
          if (v.want + d < v.n && !v.state[v.want + d]) pick = v.want + d;
          else if (v.want - d >= 0 && !v.state[v.want - d]) pick = v.want - d;
        }
        if (pick < 0) return;
        get(pick).catch(() => {}).then(v.pump);
      }
    };
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("voo: tempo esgotado")), 8000));
    v.ready = Promise.race([
      fetch(PROLOGUE_SRC)
        .then((r) => {
          if (!r.ok) throw new Error(`voo: manifest ${r.status}`);
          return r.json();
        })
        .then((m) => {
          v.frames = m.frames;
          v.n = m.frames.length;
          return Promise.all([get(0), get(v.n - 1)]);
        }),
      timeout,
    ]).then(() => {
      if (document.readyState === "complete") v.pump();
      else window.addEventListener("load", v.pump, { once: true });
    });
    return v;
  }

  // Camada do voo (canvas) no palco, acima da águia estática. A rolagem (tempo aplicado da timeline, já suavizado
  // pelo scrub) escolhe o quadro; nos últimos PROLOGUE.settle svh a imagem sai do enquadramento de tela cheia para o
  // da águia estática (olhos sobre os olhos) e, no HOLD, as duas trocam por opacidade.
  function createPrologue() {
    const v = loadVoo();
    v.active = true;
    const canvas = document.createElement("canvas");
    canvas.className = "hero__prologue";
    canvas.setAttribute("aria-hidden", "true");
    figure.after(canvas);
    const c = canvas.getContext("2d");
    const geo = { idx: -1 };
    let drawn = "";
    let lastT = 0;

    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5, 2560 / Math.max(1, w));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // voo em tela cheia (cobre o palco)
      const sc = Math.max(w / FRAME.w, h / FRAME.h);
      // pose final sobre a águia estática: olhos do último quadro sobre os olhos da imagem (layout, sem transforms)
      const fw = figure.offsetWidth;
      const fh = figure.offsetHeight;
      const sf = ((EYE.x - EYE_L.x) * fw) / VOO_EYES.d;
      const mx = figure.offsetLeft + ((EYE.x + EYE_L.x) / 2) * fw;
      const my = figure.offsetTop + ((EYE.y + EYE_L.y) / 2) * fh;
      Object.assign(geo, {
        w,
        h,
        dpr,
        cover: { x: (w - FRAME.w * sc) / 2, y: (h - FRAME.h * sc) / 2, s: sc },
        final: { x: mx - VOO_EYES.x * sf, y: my - VOO_EYES.y * sf, s: sf },
      });
      drawn = "";
      render(lastT);
    };

    const strip = (x0, y0, x1, y1, rx, ry, rw, rh) => {
      if (rw <= 0 || rh <= 0) return;
      const gr = c.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, "#000");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = gr;
      c.fillRect(rx, ry, rw, rh);
    };

    const render = (t) => {
      lastT = t;
      const P = PROLOGUE;
      const fade = 1 - smoothstep(P.clip, P.clip + P.hold * 0.75, t);
      const op = fade.toFixed(3);
      if (canvas.style.opacity !== op) {
        canvas.style.opacity = op;
        figure.style.opacity = (1 - fade).toFixed(3);
      }
      if (fade <= 0 || !v.n || !geo.cover) return;
      const want = Math.round(clamp01(t / P.clip) * (v.n - 1));
      v.want = want;
      let idx = -1;
      for (let d = 0; d < v.n && idx < 0; d++) {
        if (v.state[want - d] === 2) idx = want - d;
        else if (v.state[want + d] === 2) idx = want + d;
      }
      if (idx < 0) return;
      // decodificação adiantada só numa janela curta à frente e atrás (sem manter 241 quadros em RGBA)
      for (let d = -3; d <= 3; d++) {
        const im = v.imgs[want + d];
        if (im && !im.__vzDecoded) {
          im.__vzDecoded = true;
          im.decode?.().catch(() => {});
        }
      }
      const k = smoothstep(P.clip - P.settle, P.clip, t);
      const { cover: a, final: b } = geo;
      const s = a.s + (b.s - a.s) * k;
      const x = a.x + (b.x - a.x) * k;
      const y = a.y + (b.y - a.y) * k;
      const key = `${idx}|${x.toFixed(1)}|${y.toFixed(1)}|${s.toFixed(4)}`;
      if (key === drawn) return;
      drawn = key;
      geo.idx = idx;
      const { w, h, dpr } = geo;
      const dw = FRAME.w * s;
      const dh = FRAME.h * s;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.globalCompositeOperation = "source-over";
      c.clearRect(0, 0, w, h);
      c.drawImage(v.imgs[idx], x, y, dw, dh);
      // As bordas do quadro se dissolvem: asa ou peito cortados pelo enquadramento do vídeo nunca viram linha dura
      c.globalCompositeOperation = "destination-out";
      const L = Math.max(0, x);
      const R = Math.min(w, x + dw);
      const T = Math.max(0, y);
      const B = Math.min(h, y + dh);
      const fl = dw * 0.06;
      const fr = dw * 0.1;
      const ft = dh * 0.04;
      const fb = dh * 0.22;
      strip(L, 0, L + fl, 0, L, T, fl, B - T);
      strip(R, 0, R - fr, 0, R - fr, T, fr, B - T);
      strip(0, T, 0, T + ft, L, T, R - L, ft);
      strip(0, B, 0, B - fb, L, B - fb, R - L, fb);
      c.globalCompositeOperation = "source-over";
      if (window.__vzDebug) window.__vzDebug.prologue = { t, want, idx, settle: k, fade };
    };

    v.onLoad = (i) => {
      // redesenha se o quadro que chegou está mais perto do pedido do que o que está na tela
      if (geo.idx < 0 || Math.abs(i - v.want) < Math.abs(geo.idx - v.want)) {
        drawn = "";
        render(lastT);
      }
    };
    v.ready.catch(fallbackToStatic);
    v.pump();
    measure();

    return {
      measure,
      render,
      destroy() {
        v.active = false;
        v.onLoad = null;
        canvas.remove();
        figure.style.opacity = "";
      },
    };
  }

  // Quadros indisponíveis (404, rede lenta): desmonta tudo e monta de novo sem o prólogo — a Hero de sempre.
  // A rolagem que já estava dentro do prólogo volta ao início da Hero; depois dele, desconta a parte removida.
  function fallbackToStatic(err) {
    if (prologueFailed) return;
    prologueFailed = true;
    if (/^(localhost|127.0.0.1)$/.test(location.hostname)) console.warn("[hero] prólogo desativado:", err?.message || err);
    if (!OFF) return; // o prólogo não está montado agora (ex.: janela estreita): só não volta a montar
    const top = hero.offsetTop;
    const y = window.scrollY;
    const offPx = (OFF / 100) * (svhMeter.offsetHeight || window.innerHeight);
    mm.revert();
    mm = gsap.matchMedia();
    mm.add(QUERIES, setup);
    if (y > top) window.scrollTo(0, Math.max(top, y - offPx));
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
