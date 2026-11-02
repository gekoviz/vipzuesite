/* Entrada da 05 sobre a 04 — o efeito do 21st.dev "hero-scroll-animation" (@uilayout.contact: a seção de baixo
   encolhe e gira para fora enquanto a próxima sobe e se endireita), sem React nem motion, com o progresso lido da
   própria rolagem e adaptado a seções mais altas que a tela. Sem GSAP: não depende da ordem de carregamento nem do
   refresh do ScrollTrigger. Ligado só com movimento permitido; no resto da página nada muda. */
(() => {
  const root = document.querySelector("[data-handoff]");
  const out = root && root.querySelector("[data-handoff-out]"); // #metodo
  const inn = root && root.querySelector("[data-handoff-in]"); // #para-quem-e
  if (!out || !inn) return;

  // Amplitude do efeito. Desktop = o da referência (0,8 e 5°) um pouco mais contido; celular e tablet, mais leve.
  // Para desligar no celular, ponha mob: null.
  const FX = { desk: { scale: 0.82, rot: 4 }, mob: { scale: 0.93, rot: 1.5 } };

  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  const wide = matchMedia("(min-width: 1024px)");
  let active = false;
  let ticking = false;
  let ro = null;

  const measure = () => root.style.setProperty("--handoff-h", `${out.offsetHeight}px`);

  const update = () => {
    ticking = false;
    if (!active) return;
    const k = wide.matches ? FX.desk : FX.mob;
    if (!k) {
      out.style.transform = "";
      inn.style.transform = "";
      return;
    }
    const vh = window.innerHeight;
    // topo da 05 SEM transformação = topo do invólucro + altura da 04 (o topo medido na própria 05 já viria girado e
    // encolhido)
    const top = root.getBoundingClientRect().top + out.offsetHeight;
    const p = Math.min(1, Math.max(0, 1 - top / vh)); // 0: a 05 entra pelo pé da tela · 1: ela chegou ao topo
    out.style.transform = p > 0 ? `scale(${(1 - (1 - k.scale) * p).toFixed(4)}) rotate(${(-k.rot * p).toFixed(3)}deg)` : "";
    inn.style.transform = p < 1 ? `scale(${(k.scale + (1 - k.scale) * p).toFixed(4)}) rotate(${(k.rot * (1 - p)).toFixed(3)}deg)` : "";
    root.classList.toggle("is-moving", p > 0 && p < 1);
    out.toggleAttribute("data-covered", p >= 1); // o campo de luz da 04 para de desenhar enquanto ela está toda coberta
  };

  const schedule = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const onResize = () => {
    measure();
    schedule();
  };

  const on = () => {
    if (active) return;
    active = true;
    root.classList.add("is-handoff");
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    ro = new ResizeObserver(onResize); // a 04 muda de altura quando as fontes carregam ou o texto quebra diferente
    ro.observe(out);
    schedule();
  };

  const off = () => {
    if (!active) return;
    active = false;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", onResize);
    if (ro) ro.disconnect();
    root.classList.remove("is-handoff", "is-moving");
    root.style.removeProperty("--handoff-h");
    out.style.transform = "";
    inn.style.transform = "";
    out.removeAttribute("data-covered");
  };

  const sync = () => (motion.matches ? on() : off());
  motion.addEventListener("change", sync);
  wide.addEventListener("change", schedule);
  sync();
})();
