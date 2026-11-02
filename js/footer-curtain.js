// Rodapé em cortina: liga html.has-curtain só quando (1) o movimento é permitido e (2) o rodapé cabe na tela.
// A altura natural do rodapé é medida em fluxo (sem a classe), depois gravada em --curtain-h no invólucro.
// "Cabe" usa 100svh (a tela com as barras do navegador abertas, a menor), para que o rodapé fixo nunca fique cortado
// no iPhone. Enquanto o rodapé está coberto (invólucro fora da tela), ele fica inert: nada dentro dele recebe foco.
(() => {
  const wrap = document.querySelector("[data-footer-curtain]");
  const footer = wrap && wrap.querySelector(".site-footer");
  if (!wrap || !footer) return;
  const root = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  let probe = null;
  const smallViewport = () => {
    if (!probe) {
      probe = document.createElement("div");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
      document.body.append(probe);
    }
    return probe.offsetHeight || window.innerHeight;
  };
  let seen = false;
  const syncInert = () => {
    footer.inert = root.classList.contains("has-curtain") && !seen;
  };
  const apply = () => {
    root.classList.remove("has-curtain");
    wrap.style.removeProperty("--curtain-h");
    const h = Math.ceil(footer.getBoundingClientRect().height);
    // +1: o ceil() da altura do rodapé pode passar 1 px de 100svh por arredondamento; sem a folga a cortina desligaria sozinha
    if (motion.matches && h > 0 && h <= smallViewport() + 1) {
      wrap.style.setProperty("--curtain-h", h + "px");
      root.classList.add("has-curtain");
    }
    syncInert();
  };
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(apply);
  };
  new IntersectionObserver(
    ([e]) => {
      seen = e.isIntersecting;
      syncInert();
    },
    { threshold: 0 }
  ).observe(wrap);
  let lastW = 0;
  new ResizeObserver(() => {
    const w = wrap.clientWidth;
    if (w !== lastW) {
      lastW = w;
      schedule();
    }
  }).observe(wrap);
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule);
  document.fonts?.ready.then(schedule);
  motion.addEventListener?.("change", schedule);
  apply();
})();
