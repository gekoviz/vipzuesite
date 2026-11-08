// VIPZUE · Seção 03 · controlador da onda dos cards de vidro (08/11/2026).
// Só libera ou pausa a animação CSS da onda (classe vz-s3-glass--playing no <ol> dos cards): não cria ScrollTrigger,
// requestAnimationFrame, setInterval nem controla a rolagem. Toca quando os cards estão revelados (estado que
// js/scroll-narrative.js já controla), na tela, com a aba visível e sem movimento reduzido.
// Os scripts da página são clássicos (defer, sem módulos): em vez de "export", a função fica em window, com a mesma
// API (markRevealed, markUnrevealed, destroy). Uma instância por conjunto de cards (repetir a chamada devolve a mesma).
(() => {
  function createVzSection3LiquidGlass(cardsRoot) {
    if (!cardsRoot) {
      return { markRevealed() {}, markUnrevealed() {}, destroy() {} };
    }

    const existing = cardsRoot.__vzS3LiquidGlass;
    if (existing) return existing;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let revealed = false;
    let inView = false;
    let destroyed = false;

    function sync() {
      if (destroyed) return;
      const shouldAnimate = revealed && inView && !reduce.matches && document.visibilityState === "visible";
      cardsRoot.classList.toggle("vz-s3-glass--playing", shouldAnimate);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry && entry.isIntersecting);
        sync();
      },
      { threshold: 0.15 }
    );
    observer.observe(cardsRoot);

    function onVisibilityChange() {
      sync();
    }
    function onMotionChange() {
      sync();
    }
    function onPageHide() {
      inView = false;
      sync();
    }
    function onPageShow() {
      const rect = cardsRoot.getBoundingClientRect();
      inView = rect.bottom > 0 && rect.top < window.innerHeight;
      sync();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    reduce.addEventListener("change", onMotionChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);

    const controller = {
      markRevealed() {
        if (destroyed) return;
        revealed = true;
        sync();
      },
      markUnrevealed() {
        if (destroyed) return;
        revealed = false;
        sync();
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        reduce.removeEventListener("change", onMotionChange);
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("pageshow", onPageShow);
        cardsRoot.classList.remove("vz-s3-glass--playing");
        delete cardsRoot.__vzS3LiquidGlass;
      },
    };
    cardsRoot.__vzS3LiquidGlass = controller;
    return controller;
  }

  window.createVzSection3LiquidGlass = createVzSection3LiquidGlass;
})();
