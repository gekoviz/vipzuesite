// Display cards da Hero desktop (adaptação nativa do display-cards de Codehagen/21st.dev, sem React nem ícones).
// Este arquivo só define o controlador; quem informa o estado da Hero é js/hero.js:
//   setHeroReady(true)  — entrada de logo/menu, headline e CTA concluída (ou Hero estática/atalho que já a mostra pronta)
//   setHeroRange(bool)  — true na Hero pronta; false a partir do início da Visão (a headline começa a sair)
// Daqui saem: visibilidade do grupo (classes; a transição é do CSS), ciclo de destaque (uma timeline GSAP pausável, sem
// ScrollTrigger, RAF ou intervalo próprios) e as pausas: rolagem (até 1 s parada), ponteiro sobre o grupo, aba oculta,
// palco fora da tela. Movimento reduzido: dois planos parados, sem ciclo. Sem GSAP: os cards aparecem parados.
(() => {
  const NOOP = { setHeroReady() {}, setHeroRange() {}, dispose() {}, state: null };
  const ELIGIBLE = "(min-width: 1200px) and (min-height: 650px)"; // mesmo corte do CSS
  const IDLE_MS = 1000;

  function create({ root, stage, gsap }) {
    const stack = root?.querySelector(".vz-hero-cards__stack");
    const first = root?.querySelector(".vz-hero-cards__motion--first");
    const second = root?.querySelector(".vz-hero-cards__motion--second");
    if (!root || !stage || !stack || !first || !second) return NOOP;

    const eligible = window.matchMedia(ELIGIBLE);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { heroReady: false, heroRange: false, stageVisible: true, scrolling: false, hovered: false, shown: false, disposed: false };
    let idleTimer = 0;

    // Ciclo: 1º plano sobe e fica à frente, repousa, volta; 2º plano desce um passo e fica à frente, repousa, volta.
    // Só x/y dos invólucros; a inclinação está na superfície interna (sem disputa de transform).
    let tl = null;
    if (gsap) {
      const setActive = (v) => () => (stack.dataset.active = v);
      tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: "power2.inOut" } });
      tl.call(setActive("first"))
        .to(first, { x: -4, y: -36, duration: 0.75, ease: "power2.out" })
        .to({}, { duration: 3.9 })
        .to(first, { x: 0, y: 0, duration: 0.72 })
        .call(setActive("none"))
        .to({}, { duration: 0.35 })
        .call(setActive("second"))
        .to(second, { x: 10, y: 22, duration: 0.75, ease: "power2.out" })
        .to({}, { duration: 3.9 })
        .to(second, { x: 0, y: 0, duration: 0.72 })
        .call(setActive("none"))
        .to({}, { duration: 0.35 });
    }

    const resetPose = () => {
      tl?.pause(0);
      if (gsap) gsap.set([first, second], { x: 0, y: 0 });
      stack.dataset.active = "none";
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
        stack.dataset.active = "none";
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
