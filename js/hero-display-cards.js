// Display cards da Hero (adaptação nativa do display-cards de Codehagen/21st.dev, sem React nem ícones): desktop com
// mouse/touchpad e, desde a V5, celular em retrato (os mesmos cards empilhados à esquerda; ver css/hero.css).
// Este arquivo só define o controlador; quem informa o estado da Hero é js/hero.js:
//   setHeroReady(true)  — entrada de logo/menu, headline e CTA concluída (ou Hero estática/atalho que já a mostra pronta)
//   setHeroRange(bool)  — true na Hero pronta; false a partir do início da Visão (a headline começa a sair)
// Daqui saem: visibilidade do grupo (classes; a transição é do CSS), ciclo de destaque (uma timeline GSAP pausável, sem
// ScrollTrigger, RAF ou intervalo próprios) e as pausas: rolagem (retoma 0,7 s depois de parar), ponteiro sobre o grupo, aba oculta,
// palco fora da tela. A pausa do ponteiro vale só com mouse/touchpad (no toque, tocar no card não congela o ciclo).
// Movimento reduzido: dois planos parados, sem ciclo. Sem GSAP: os cards aparecem parados.
(() => {
  const NOOP = { setHeroReady() {}, setHeroRange() {}, dispose() {}, state: null };
  // Mesmo corte do CSS: desktop com mouse/touchpad (o da Hero desktop com voo) ou celular em retrato. Tablet
  // (768–1023 px) e celular deitado ficam de fora.
  const DESKTOP = "(min-width: 1024px) and (min-height: 560px) and (hover: hover) and (pointer: fine)";
  const MOBILE = "(max-width: 767.98px) and (orientation: portrait)";
  const ELIGIBLE = `${DESKTOP}, ${MOBILE}`;
  const FINE_POINTER = "(hover: hover) and (pointer: fine)";
  const IDLE_MS = 700;
  // V3: um novo destaque começa a cada CYCLE_BEAT segundos (1º card em 0 s, 2º em 3 s, ciclo de 6 s)
  const CYCLE_BEAT = 3.0;
  const CYCLE = CYCLE_BEAT * 2;
  const MOVE_IN = 0.55;
  const RETURN_AT = 2.4;
  const MOVE_OUT = CYCLE_BEAT - RETURN_AT; // 0,6 s: o retorno termina exatamente no início do próximo destaque

  function create({ root, stage, gsap }) {
    const stack = root?.querySelector(".vz-hero-cards__stack");
    const first = root?.querySelector(".vz-hero-cards__motion--first");
    const second = root?.querySelector(".vz-hero-cards__motion--second");
    if (!root || !stage || !stack || !first || !second) return NOOP;

    const eligible = window.matchMedia(ELIGIBLE);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia(FINE_POINTER);
    const state = { heroReady: false, heroRange: false, stageVisible: true, scrolling: false, hovered: false, shown: false, disposed: false };
    let idleTimer = 0;

    // Ciclo (6 s): 0 s o 1º plano sobe e fica à frente; 2,4 s volta; 3 s o 2º desce um passo e fica à frente; 5,4 s
    // volta; 6 s recomeça. Só x/y dos invólucros; a orientação 3D está na superfície (sem disputa de transform).
    // A duração sai da construção: o último retorno termina em CYCLE_BEAT + RETURN_AT + MOVE_OUT = CYCLE.
    let tl = null;
    if (gsap) {
      const setActive = (v) => () => (stack.dataset.active = v);
      tl = gsap.timeline({ paused: true, repeat: -1 });
      tl.call(setActive("first"), null, 0)
        .to(first, { x: -4, y: -36, duration: MOVE_IN, ease: "power2.out" }, 0)
        .to(first, { x: 0, y: 0, duration: MOVE_OUT, ease: "power2.inOut" }, RETURN_AT)
        .call(setActive("second"), null, CYCLE_BEAT)
        .to(second, { x: 8, y: 22, duration: MOVE_IN, ease: "power2.out" }, CYCLE_BEAT)
        .to(second, { x: 0, y: 0, duration: MOVE_OUT, ease: "power2.inOut" }, CYCLE_BEAT + RETURN_AT);
      if (Math.abs(tl.duration() - CYCLE) > 1e-6) console.warn("[hero-cards] ciclo com duração inesperada:", tl.duration());
    }

    const resetPose = () => {
      tl?.pause(0);
      if (gsap) gsap.set([first, second], { x: 0, y: 0 });
      stack.dataset.active = "first";
    };

    function evaluate() {
      if (state.disposed) return;
      const canExist = eligible.matches && state.heroReady;
      const show = canExist && state.heroRange;
      if (!canExist) {
        root.hidden = true;
        root.classList.remove("is-shown");
        state.shown = false;
        tl?.pause();
        return;
      }
      if (root.hidden) {
        root.hidden = false;
        void root.offsetWidth; // estado inicial (opacidade 0) aplicado antes da transição de entrada
      }
      if (show !== state.shown) {
        state.shown = show;
        root.classList.toggle("is-shown", show);
        // depois da 1ª vez, sair e voltar é só o esmaecer curto (sem o passo de entrada)
        if (!show) root.classList.add("was-shown");
      }
      if (reduced.matches) {
        resetPose();
        return;
      }
      const run = !!tl && show && state.stageVisible && !state.scrolling && !state.hovered && document.visibilityState === "visible";
      if (run) tl.resume();
      else tl?.pause();
    }

    // Rolagem: congela o ciclo onde está (sem esconder nada) e retoma depois de IDLE_MS parado
    const onScroll = () => {
      if (!state.scrolling) {
        state.scrolling = true;
        evaluate();
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        state.scrolling = false;
        evaluate();
      }, IDLE_MS);
    };
    const onEnter = () => {
      if (!finePointer.matches) return;
      state.hovered = true;
      evaluate();
    };
    const onLeave = () => {
      state.hovered = false;
      evaluate();
    };
    const onChange = () => evaluate();
    const onReduced = () => {
      if (reduced.matches) resetPose();
      evaluate();
    };
    const io = new IntersectionObserver(
      (entries) => {
        state.stageVisible = entries.some((e) => e.isIntersecting);
        evaluate();
      },
      { threshold: 0.25 }
    );
    io.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onChange);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    eligible.addEventListener("change", onChange);
    reduced.addEventListener("change", onReduced);
    root.hidden = true;

    return {
      setHeroReady(v) {
        if (state.heroReady === !!v) return;
        state.heroReady = !!v;
        evaluate();
      },
      setHeroRange(v) {
        if (state.heroRange === !!v) return;
        state.heroRange = !!v;
        evaluate();
      },
      dispose() {
        if (state.disposed) return;
        state.disposed = true;
        clearTimeout(idleTimer);
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onChange);
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
        eligible.removeEventListener("change", onChange);
        reduced.removeEventListener("change", onReduced);
        tl?.kill();
        tl = null;
        if (gsap) gsap.set([first, second], { clearProps: "transform" });
        stack.dataset.active = "first";
        root.classList.remove("is-shown", "was-shown");
        root.hidden = true;
      },
      // leitura para depuração/testes (não altera nada)
      get state() {
        return { ...state, cycle: tl ? (tl.paused() ? "paused" : "running") : "none", active: stack.dataset.active, time: tl ? +tl.time().toFixed(2) : 0 };
      },
    };
  }

  window.VZHeroCards = { create };
})();
