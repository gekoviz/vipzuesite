// VIPZUE — Seção 03 "Por que isso importa?" (25–26/10/2026).
//
// Duas apresentações da mesma copy (fonte única no HTML):
//   ≥ 1024px — palco fixo com a narrativa abaixo (uma cena, quatro estados);
//   < 1024px — headline + três cards numerados num palco sticky local que dá percurso de leitura a cada card, e a
//              águia em voo na divisa com a seção seguinte (buildPanels, mais abaixo).
//
// Desktop: a headline é a tese e permanece; o raciocínio se revela abaixo dela, num único espaço narrativo:
//   headline se forma (centro do palco) → assenta no alto e fica → P1 → P2 → P3 (conclusão) → saída suave.
//
// Uma única fonte de progresso: um ScrollTrigger (GSAP, já carregado na página) sobre a rolagem nativa, do topo ao
// fim do trilho da seção. Todos os estados são funções puras desse progresso, por isso a narrativa é reversível,
// sobrevive a recarga no meio e a scroll rápido. Sem Lenis, sem scroll container, sem timers, sem bloquear rolagem.
//
// Referências (21st.dev), adaptadas:
//   Text Scroll Animation (Skiper31, CharacterV1) → MACRO: as peças saem espalhadas em torno do centro
//     (x = distância ao centro × k) com rotateX proporcional e convergem JUNTAS para a posição neutra na primeira
//     parte do intervalo, sob perspectiva. Aqui por palavra (preserva o kerning da Gloock) e com valores editoriais.
//   Motion Scroll Word Reveal → MICRO: getWordRange / getWordOpacity (REVEAL_SPAN, WORD_WINDOW, opacidade de
//     repouso) recebem o progresso LOCAL de cada parágrafo, derivado da linha do tempo; não há useScroll próprio.
(() => {
  const root = document.documentElement;
  const section = document.querySelector("[data-s03]");
  if (!section || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const $ = (name) => section.querySelector(`[data-s03-scene="${name}"]`);
  const stage = section.querySelector("[data-s03-stage]");
  const title = $("title");
  const paras = [$("p1"), $("p2"), $("p3")];
  const figure = section.querySelector("[data-s03-figure]"); // águia da seção (opcional)
  const eagle = figure?.querySelector("img");
  if (!stage || !title || paras.some((el) => !el)) return;

  // ---------- Linha do tempo (frações do trilho da seção) ----------
  const T = {
    form: [-0.03, 0.14], // headline se forma no centro do palco (já começando quando a seção assume)
    settle: [0.14, 0.2], // assenta na posição superior, 8% menor, e permanece
    p: [
      { in: [0.2, 0.27], reveal: [0.25, 0.42], out: [0.47, 0.52] }, // leitura plena 0.42–0.47
      { in: [0.505, 0.555], reveal: [0.52, 0.69], out: [0.74, 0.79] }, // leitura plena 0.69–0.74
      { in: [0.775, 0.815], reveal: [0.79, 0.93], out: null }, // conclusão; leitura plena 0.93–0.97
    ],
    exit: [0.97, 1], // headline + conclusão sobem um pouco e esmaecem; o palco libera a rolagem
  };
  const FORM_SCALE = 1.08; // escala de formação; a assentada é a tipográfica (≈ 8% menor)

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smooth = (v) => {
    const t = clamp01(v);
    return t * t * (3 - 2 * t);
  };
  const range = (p, [a, b]) => clamp01((p - a) / (b - a));

  // ---------- Motion Scroll Word Reveal (lógica original, progresso recebido de fora) ----------
  const getWordRange = (index, count, span, win) => {
    const start = count <= 1 ? 0 : (index / (count - 1)) * span;
    return { start, end: Math.min(1, start + win) };
  };
  const getWordOpacity = (progress, { start, end }, rest) => {
    if (progress <= start) return rest;
    if (progress >= end) return 1;
    return rest + (1 - rest) * ((progress - start) / (end - start));
  };
  const createWordReveal = (words, { rest, span = 0.8, win = 0.2 }) => {
    const ranges = words.map((_, i) => getWordRange(i, words.length, span, win));
    const last = new Array(words.length).fill(-1);
    return (progress) => {
      for (let i = 0; i < words.length; i++) {
        const o = Math.round(getWordOpacity(progress, ranges[i], rest) * 1000) / 1000;
        if (o !== last[i]) {
          last[i] = o;
          words[i].style.opacity = o;
        }
      }
    };
  };

  // ---------- Palavras: texto completo lido uma vez (visually-hidden) + palavras visuais aria-hidden ----------
  const originals = new Map();
  const splitWords = (el, className) => {
    originals.set(el, el.innerHTML);
    const text = el.textContent.replace(/\s+/g, " ").trim();
    const sr = document.createElement("span");
    sr.className = "visually-hidden";
    sr.textContent = text;
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    const words = [];
    text.split(" ").forEach((word, i, all) => {
      const span = document.createElement("span");
      span.className = className;
      span.textContent = word;
      visual.append(span);
      words.push(span);
      if (i < all.length - 1) visual.append(" ");
    });
    el.replaceChildren(sr, visual);
    return words;
  };

  let state = null;

  const build = () => {
    const titleWords = splitWords(title, "s03__w");
    const paraWords = paras.map((el) => splitWords(el, "s03__rw"));
    const reveals = [
      createWordReveal(paraWords[0], { rest: 0.3 }),
      createWordReveal(paraWords[1], { rest: 0.3 }),
      createWordReveal(paraWords[2], { rest: 0.3, span: 0.76, win: 0.24 }),
    ];
    const n = titleWords.length;
    const center = (n - 1) / 2;
    const geo = { dy: 0, narrow: false };

    // Distância vertical do assentamento: do centro do palco até a posição tipográfica final da headline
    // (offsetTop ignora transforms; recalculado a cada refresh/resize)
    const measure = () => {
      geo.narrow = window.innerWidth < 768;
      geo.dy = stage.clientHeight / 2 - (title.offsetTop + title.offsetHeight / 2);
    };

    const render = (p) => {
      const narrow = geo.narrow;
      const K = narrow ? 9 : 22; // px por palavra de distância ao centro (o demo usa 50 por caractere)
      const R = narrow ? 1.6 : 3.2; // graus de rotateX por palavra de distância (máx. ≈ 5° / 10°)
      const shift = narrow ? 12 : 16; // entrada/saída das cenas do espaço narrativo (px)

      // MACRO 1 — formação (CharacterV1): todas as palavras convergem juntas na primeira parte do intervalo
      const form = range(p, T.form);
      const conv = smooth(form / 0.75);
      const k = 1 - conv;
      titleWords.forEach((w, j) => {
        const d = j - center;
        w.style.transform = k
          ? `translate3d(${(d * K * k).toFixed(2)}px, ${(Math.abs(d) * 2 * k).toFixed(2)}px, 0) rotateX(${(d * R * k).toFixed(2)}deg)`
          : "none";
      });
      // MACRO 2 — assentamento: do centro do palco para o alto, 8% menor; depois permanece até a saída
      const settle = smooth(range(p, T.settle));
      const exit = smooth(range(p, T.exit));
      const scale = FORM_SCALE + (1 - FORM_SCALE) * settle;
      const ty = geo.dy * (1 - settle) - 18 * exit;
      title.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      title.style.opacity = (smooth(form / 0.45) * (1 - 0.6 * exit)).toFixed(3);
      // MACRO 1b — águia, no mesmo vocabulário da headline: converge como as palavras (deslocada à direita e
      // levemente girada em Y, sob perspectiva) quando a headline termina de assentar, chegando junto com o 1º texto;
      // depois aproxima devagar enquanto o raciocínio avança (zoom ancorado no olho, como uma câmera) e sai com a
      // headline. Na formação e na subida ela ainda não está no palco: a headline cruza a tela sem passar sobre ela.
      // Tudo função do mesmo progresso: reversível.
      if (figure) {
        const arrive = smooth(range(p, [T.settle[1] - 0.02, T.p[0].in[1]]));
        const ke = 1 - arrive;
        const push = smooth(range(p, [T.settle[1], T.exit[0]]));
        figure.style.opacity = (arrive * (1 - 0.6 * exit)).toFixed(3);
        if (eagle) {
          const ey = (-1.2 * push).toFixed(3);
          eagle.style.transform = `translate3d(${(8 * ke).toFixed(2)}%, calc(${ey}% - ${(18 * exit).toFixed(2)}px), 0) rotateY(${(-9 * ke).toFixed(2)}deg) scale(${(1 + 0.04 * ke + 0.035 * push).toFixed(4)})`;
        }
      }

      // MACRO 3 — espaço narrativo: um parágrafo por vez no mesmo lugar (entra, revela, fica legível, cede)
      T.p.forEach((seg, i) => {
        const el = paras[i];
        const enter = smooth(range(p, seg.in));
        const leave = seg.out ? smooth(range(p, seg.out)) : 0;
        const last = i === paras.length - 1;
        const y = shift * (1 - enter) - shift * leave - (last ? 18 * exit : 0);
        const o = enter * (1 - leave) * (last ? 1 - 0.6 * exit : 1);
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${(0.99 + 0.01 * enter).toFixed(4)})`;
        el.style.opacity = o.toFixed(3);
        // MICRO — revelação por palavra com o progresso local do parágrafo
        reveals[i](range(p, seg.reveal));
      });
      if (window.__vzDebug) window.__vzDebug.s03 = p;
    };

    const proxy = { p: 0 };
    const tween = gsap.to(proxy, {
      p: 1,
      ease: "none",
      onUpdate: () => render(proxy.p),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        // recarga no meio / resize / orientação: remede e desenha o estado do progresso real
        onRefresh: () => {
          measure();
          render(proxy.p);
        },
      },
    });
    // Saída do palco: a seção seguinte tem o mesmo fundo bege, então o recorte da águia na base do palco viraria uma
    // linha reta sobre o bege. Enquanto o palco está fixo nada muda; quando ele começa a subir, a base da águia ganha
    // um degradê que cresce 1:1 com a rolagem (até 30% da tela).
    let lastCut = -1;
    const setCut = (self) => {
      if (!figure) return;
      const cut = Math.round(Math.min(self.progress * window.innerHeight, window.innerHeight * 0.3));
      if (cut === lastCut) return;
      lastCut = cut;
      const mask = cut > 0 ? `linear-gradient(to top, transparent 0, #000 ${cut}px)` : "";
      figure.style.webkitMaskImage = figure.style.maskImage = mask;
    };
    const exitCut = ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      end: "bottom top",
      onUpdate: setCut,
      onRefresh: setCut,
    });
    measure();
    render(proxy.p);
    state = { tween, exitCut };
    // as caixas das palavras dependem das fontes reais: remede quando elas terminam de carregar
    document.fonts?.ready.then(() => {
      if (state?.tween !== tween) return;
      measure();
      render(proxy.p);
    });
  };

  const teardown = () => {
    if (!state) return;
    state.tween.scrollTrigger?.kill();
    state.tween.kill();
    state.exitCut.kill();
    if (figure) figure.style.webkitMaskImage = figure.style.maskImage = "";
    originals.forEach((html, el) => {
      el.innerHTML = html;
      el.removeAttribute("style");
    });
    originals.clear();
    figure?.style.removeProperty("opacity");
    eagle?.style.removeProperty("transform");
    state = null;
  };

  // ---------- Abaixo de 1024px: cena de leitura (palco sticky local) + águia na divisa ----------
  // Uma só fonte de progresso (a rolagem nativa) dirige a cena: formação da headline → deslocamento da composição →
  // progresso local de cada card → entrada/luz/número → palavras. Tudo é função pura da posição, calculada a partir de
  // geometria medida só no refresh (resize, rotação, fontes, mudança real de altura). Nada é medido por quadro.
  //   Palco: o .s03__grid (headline + lista) fica sticky dentro do .s03__stage, que vira o trilho. C = altura natural
  //   do conteúdo; H = min(C, altura visível − 16); T = C − H (o quanto a composição precisa subir). A composição
  //   nunca para: percorre T num trecho um pouco mais longo (T + extra, extra ≤ 25% de T e do palco), com velocidade
  //   que cai suavemente até ~60% da rolagem no meio e volta a 100% nas pontas (sampleContinuous). Trilho = H + T +
  //   extra, então o fim coincide com a base do conteúdo. Sem deslocamento interno (T ≤ 1): fluxo natural, sem sticky.
  //   Progresso de cada card pela posição dele na tela (distância virtual = quanto o conteúdo já subiu): começa com o
  //   topo a 88% do palco e termina com a base a 55%. 0–14% entrada (sobe 16px, escala 0,985 → 1, rotateX 3° → 0)
  //   com luz, contorno e número (--a); 14–86% palavras de 75% a 100% (distribuição do Word Reveal); 86–100% completo.
  //   headline: forma-se pela rolagem enquanto o topo dela vai de 98% a 45% da altura visível.
  //   Palco < 360px ou card maior que o palco (texto muito ampliado, tela baixa): fluxo natural, tudo aceso.
  const panels = [...section.querySelectorAll("[data-s03-panel]")];
  const list = section.querySelector("[data-s03-slot]");
  const grid = title.parentElement;
  const seam = document.querySelector("[data-s03-seam]");
  const seamMove = seam?.querySelector("[data-s03-seam-move]");
  const EXTRA = 0.25; // acréscimo total do percurso (desaceleração no meio); 0.15 se ainda parecer pesado no telefone
  const CARD_RANGE = [0.88, 0.55]; // card: do topo a 88% do palco até a base a 55%
  const SAFE = 16; // folga inferior do palco e proteção de pintura das sombras
  const ENTRANCE = 0.14; // entrada do card, luz e número
  const WORDS_END = 0.86; // fim da revelação das palavras
  const FORM = [0.98, 0.45]; // formação da headline: topo dela de 98% a 45% da altura visível
  let flow = null;

  // ---------- Tilt dos painéis (21st.dev, tom_ui "tilt-card", efeito "gravitate"), portado sem React ----------
  // Mesma lógica do componente: eventos de ponteiro (mouse, caneta e dedo), inclinação proporcional à posição do
  // ponteiro no card, escala 1,05, perspectiva 1200px, transição de 0,2s e spotlight radial que acompanha o ponteiro.
  // Valores do demo (gravitate, 18°). Adaptações: spotlight a 50% (o branco a 15% some no marfim); no toque, o dedo
  // que encosta já inclina o card ("pointerdown" — sem arrastar não há "pointermove") e o card volta ao repouso ao
  // soltar ou quando a rolagem começa ("pointerup" / "pointercancel").
  const TILT = { limit: 18, scale: 1.05, perspective: 1200, dir: 1 };
  const TILT_REST = `perspective(${TILT.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  const bindTilt = (card) => {
    const spot = document.createElement("span");
    spot.className = "s03__spot";
    spot.setAttribute("aria-hidden", "true");
    card.prepend(spot);
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const xRot = (py - 0.5) * (TILT.limit * 2) * TILT.dir;
      const yRot = (px - 0.5) * -(TILT.limit * 2) * TILT.dir;
      card.style.transform = `perspective(${TILT.perspective}px) rotateX(${xRot.toFixed(2)}deg) rotateY(${yRot.toFixed(2)}deg) scale3d(${TILT.scale}, ${TILT.scale}, ${TILT.scale})`;
      card.style.setProperty("--sx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--sy", `${(py * 100).toFixed(1)}%`);
    };
    const enter = () => card.classList.add("is-tilting");
    const leave = () => {
      card.style.transform = TILT_REST;
      card.classList.remove("is-tilting");
    };
    const press = (e) => {
      enter();
      move(e);
    };
    const release = (e) => e.pointerType !== "mouse" && leave();
    const events = [
      ["pointerenter", enter],
      ["pointerdown", press],
      ["pointermove", move],
      ["pointerup", release],
      ["pointerleave", leave],
      ["pointercancel", leave],
    ];
    events.forEach(([type, fn]) => card.addEventListener(type, fn));
    return () => {
      events.forEach(([type, fn]) => card.removeEventListener(type, fn));
      spot.remove();
      card.classList.remove("is-tilting");
      ["transform", "--sx", "--sy"].forEach((prop) => card.style.removeProperty(prop));
    };
  };

  // Percurso contínuo da composição: distance = rolagem desde o início do sticky. Devolve o deslocamento (y), a
  // duração do trecho fixo e a distância virtual (quanto o conteúdo já subiu), que sincroniza as palavras com a posição
  // visual. Velocidade interna = T(1 + a·cos 2πu)/(T + extra): 100% nas pontas, ~60% no meio — nunca zero.
  const sampleContinuous = (distance, contentHeight, frameHeight) => {
    const travel = Math.max(0, contentHeight - frameHeight);
    if (travel <= 1) return { y: 0, duration: 0, virtual: distance, pinned: false };
    const extra = Math.min(travel * EXTRA, frameHeight * EXTRA);
    const duration = travel + extra;
    const amplitude = extra / travel;
    const u = clamp01(distance / duration);
    const moved = travel * (u + (amplitude * Math.sin(2 * Math.PI * u)) / (2 * Math.PI));
    const virtual = distance < 0 ? distance : distance > duration ? distance - extra : moved;
    return { y: -moved, duration, virtual, pinned: true };
  };

  const buildPanels = () => {
    const titleWords = splitWords(title, "s03__w");
    const reveals = paras.map((el) => createWordReveal(splitWords(el, "s03__rw"), { rest: 0.75 }));
    const center = (titleWords.length - 1) / 2;
    const titleLayer = title.querySelector(":scope > [aria-hidden]");
    const g = { vh: 1, form: [0, 1], start: 0, C: 0, H: 0, ranges: [], pinned: false, still: true, seamTop: 0, narrow: true };
    // altura visível estável (100svh): a barra do Safari não reconstrói a cena a cada gesto
    const meter = document.createElement("div");
    meter.setAttribute("aria-hidden", "true");
    meter.style.cssText = "position:absolute;top:0;left:0;width:1px;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
    section.append(meter);

    // Headline: o mesmo CharacterV1 do desktop (palavras espalhadas em torno do centro, rotateX proporcional,
    // convergindo juntas), pela rolagem, durante a chegada da seção. Palavras inteiras (sem quebrar a Gloock no meio) e
    // deslocamentos curtos: sem scroll horizontal. A camada visual nunca fica abaixo de 75%.
    let lastF = -1;
    const applyForm = (f) => {
      if (f === lastF) return;
      lastF = f;
      const k = 1 - smooth(f / 0.82);
      const K = g.narrow ? 9 : 14;
      const R = g.narrow ? 1.6 : 2.4;
      titleWords.forEach((w, j) => {
        const d = j - center;
        w.style.transform = k
          ? `translate3d(${(d * K * k).toFixed(2)}px, ${(Math.abs(d) * 2 * k).toFixed(2)}px, 0) rotateX(${(d * R * k).toFixed(2)}deg)`
          : "none";
      });
      if (titleLayer) titleLayer.style.opacity = (0.75 + 0.25 * smooth(f / 0.82)).toFixed(3);
    };

    // posição de layout (offset* ignora transforms: deslocamento da cena, entrada e tilt não contaminam a medida)
    const layoutTop = (el, stop = null) => {
      let y = 0;
      for (let e = el; e && e !== stop; e = e.offsetParent) y += e.offsetTop;
      return y;
    };
    const resetScene = () => {
      stage.style.removeProperty("height");
      ["position", "top", "height"].forEach((p) => grid.style.removeProperty(p));
      title.style.removeProperty("transform");
      list.style.removeProperty("transform");
    };

    // Antes de o ScrollTrigger recalcular: mede o conteúdo natural e dimensiona trilho e palco
    const measure = () => {
      resetScene();
      const vh = meter.offsetHeight || window.innerHeight;
      g.vh = vh;
      g.narrow = window.innerWidth < 768;
      grid.style.position = "relative"; // o palco vira o offsetParent dos itens: medidas locais
      const contentHeight = layoutTop(list, grid) + list.offsetHeight + SAFE;
      const cards = panels.map((el) => ({ top: layoutTop(el, grid), height: el.offsetHeight }));
      const available = vh - SAFE;
      const titleTop = layoutTop(title);
      const padTop = parseFloat(getComputedStyle(stage).paddingTop) || 0;
      g.form = [titleTop - vh * FORM[0], titleTop - vh * FORM[1]];
      // card que não cabe inteiro no palco: fluxo natural, tudo aceso (sem reduzir a fonte)
      g.still = available < 360 || cards.some((c) => c.height > available - SAFE * 2);
      g.C = contentHeight;
      g.H = Math.min(contentHeight, available);
      g.start = layoutTop(stage) + padTop; // rolagem em que o topo do conteúdo chega ao alto da tela
      g.ranges = cards.map((c) => [c.top - available * CARD_RANGE[0], c.top + c.height - available * CARD_RANGE[1]]);
      const scene = sampleContinuous(0, g.C, g.H);
      g.pinned = !g.still && scene.pinned;
      if (g.pinned) {
        stage.style.height = `${padTop + g.H + scene.duration}px`;
        grid.style.position = "sticky";
        grid.style.top = "0px";
        grid.style.height = `${g.H}px`;
      } else {
        grid.style.removeProperty("position");
      }
      g.seamTop = seam ? layoutTop(seam) : 0;
      lastF = -1;
      if (window.__vzDebug) {
        window.__vzDebug.s03plan = { C: g.C, H: g.H, start: g.start, pinned: g.pinned, still: g.still, ranges: g.ranges, duration: scene.duration, form: g.form };
      }
    };

    const lastA = panels.map(() => -1);
    const lastE = panels.map(() => -1);
    const render = (y) => {
      applyForm(Math.round(clamp01((y - g.form[0]) / Math.max(1, g.form[1] - g.form[0])) * 1000) / 1000);

      const scene = g.pinned ? sampleContinuous(y - g.start, g.C, g.H) : { y: 0, virtual: y - g.start };
      const shift = scene.y ? `translate3d(0, ${scene.y.toFixed(2)}px, 0)` : "";
      title.style.transform = list.style.transform = shift;
      const progress = g.still
        ? panels.map(() => 1)
        : g.ranges.map(([a, b]) => clamp01((scene.virtual - a) / Math.max(1, b - a)));

      progress.forEach((p, i) => {
        const e = Math.round(smooth(p / ENTRANCE) * 1000) / 1000;
        if (e !== lastA[i]) {
          lastA[i] = e;
          panels[i].style.setProperty("--a", e);
        }
        // entrada do card inteiro (o <li>; o tilt é do .s03__card): depois dela, só o percurso da composição o move
        if (e !== lastE[i]) {
          lastE[i] = e;
          const k = 1 - e;
          panels[i].style.transform = k
            ? `perspective(1100px) translate3d(0, ${(16 * k).toFixed(2)}px, 0) rotateX(${(3 * k).toFixed(3)}deg) scale(${(1 - 0.015 * k).toFixed(4)})`
            : "";
        }
        reveals[i](clamp01((p - ENTRANCE) / (WORDS_END - ENTRANCE)));
      });

      // águia: acomodação de −16px a 0 enquanto a divisa vai de 95% a 65% da altura visível
      if (seamMove) {
        const q = smooth((g.vh * 0.95 - (g.seamTop - y)) / (g.vh * 0.3));
        seamMove.style.transform = q < 1 ? `translate3d(0, ${(-16 * (1 - q)).toFixed(2)}px, 0)` : "none";
      }
      if (window.__vzDebug) {
        window.__vzDebug.s03panels = progress.map((p) => +p.toFixed(3));
        window.__vzDebug.s03y = +scene.y.toFixed(2);
      }
    };

    ScrollTrigger.addEventListener("refreshInit", measure);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => render(self.scroll()),
      onRefresh: (self) => render(self.scroll()),
    });
    // mudanças reais de altura (quebras de linha, fontes, zoom de texto) remedem pelo refresh do ScrollTrigger
    let queued = 0;
    const ro = new ResizeObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        ScrollTrigger.refresh();
      });
    });
    panels.forEach((el) => ro.observe(el));
    ro.observe(title);
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => flow?.trigger === trigger && ScrollTrigger.refresh());
    const untilt = panels.map((el) => bindTilt(el.querySelector(".s03__card") ?? el));
    flow = {
      trigger,
      ro,
      stop: () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        untilt.forEach((fn) => fn());
        resetScene();
        meter.remove();
      },
    };
  };

  const teardownPanels = () => {
    if (!flow) return;
    flow.trigger.kill();
    flow.ro.disconnect();
    flow.stop();
    originals.forEach((html, el) => {
      el.innerHTML = html;
      el.removeAttribute("style");
    });
    originals.clear();
    panels.forEach((el) => {
      el.style.removeProperty("--a");
      el.style.removeProperty("transform");
    });
    seamMove?.style.removeProperty("transform");
    flow = null;
  };

  const mm = gsap.matchMedia();
  // abaixo de 1024px com movimento permitido: painéis que acendem (sem JS ou com movimento reduzido: estado final)
  mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023.98px)", () => {
    window.__vzS03Ready = true;
    buildPanels();
    return teardownPanels;
  });
  // mesma condição do <head>: desktop, movimento permitido e altura que comporta headline + parágrafo juntos
  mm.add("(prefers-reduced-motion: no-preference) and (min-height: 560px) and (min-width: 1024px)", () => {
    window.__vzS03Ready = true;
    const added = !root.classList.contains("s03-motion");
    root.classList.add("s03-motion"); // o trilho já vem do <head>; se a rede atrasou o script, volta aqui
    build();
    if (added) ScrollTrigger.refresh();
    return () => {
      teardown();
      root.classList.remove("s03-motion");
      ScrollTrigger.refresh();
    };
  });
})();
