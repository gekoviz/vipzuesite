// Rodapé "beam wordmark" (21st.dev, kedhareswer, "Beam Wordmark Footer"), portado sem React. O CSS está em
// css/sections.css (08 — Footer); aqui só a geometria e o movimento, gravados como variáveis CSS no <footer>:
// - a wordmark é ajustada à largura do container (medida a 100px, com teto de 42% da largura para não virar torre) e
//   cortada logo abaixo da linha de base, lida da métrica real da fonte num canvas;
// - cada letra recebe a própria posição dentro do rodapé (--bf-x/--bf-y), para que o feixe e o brilho pintados nela
//   coincidam com os do fundo;
// - o feixe oscila sozinho (dois senos lentos) e se inclina para o ponteiro; o ponteiro leva um brilho suave;
// - a letra sobe no hover e pula no clique; colunas, fios e letras entram uma vez, quando o rodapé aparece.
// O laço de quadros só roda com o rodapé na tela e com movimento permitido. Sem JS, tudo fica parado e legível.
(() => {
  const root = document.querySelector("[data-beam-footer]");
  if (!root) return;
  const word = root.querySelector("[data-beam-word]");
  const inner = root.querySelector("[data-beam-letters]");
  if (!word || !inner) return;
  const box = inner.parentElement;
  const letters = [...inner.querySelectorAll(".site-footer__l")];
  const CUT = 0.14; // onde a base corta a wordmark, em em abaixo da linha de base

  // ---------- matemática (a mesma do componente) ----------
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const fitSize = (measuredAt100, target, cap) => {
    if (!(measuredAt100 > 0) || !(target > 0)) return 0;
    const size = (100 * target) / measuredAt100;
    return cap > 0 ? Math.min(size, cap) : size;
  };
  const beamTarget = (u, lo = 30, hi = 82) => lo + (hi - lo) * clamp(Number.isFinite(u) ? u : 0.5, 0, 1);
  const drift = (t, centre = 58, amp = 9) => centre + amp * (0.7 * Math.sin(t * 0.21) + 0.3 * Math.sin(t * 0.077 + 1.3));
  const approach = (from, to, k, dt) => to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);
  const baselineAt = (ascent, descent) => {
    if (!(ascent > 0) || !(descent >= 0)) return 0.8;
    return clamp(((100 - ascent - descent) / 2 + ascent) / 100, 0.5, 1.2);
  };
  const measureBaseline = () => {
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return 0.8;
      const cs = getComputedStyle(inner);
      ctx.font = cs.fontWeight + " 100px " + cs.fontFamily;
      const m = ctx.measureText(inner.textContent);
      return baselineAt(m.fontBoundingBoxAscent, m.fontBoundingBoxDescent);
    } catch {
      return 0.8;
    }
  };

  // ---------- ajuste da wordmark e posição de cada letra ----------
  const place = () => {
    const r = root.getBoundingClientRect();
    root.style.setProperty("--bf-rw", r.width + "px");
    root.style.setProperty("--bf-rh", r.height + "px");
    let top = 0;
    letters.forEach((s, i) => {
      // offsetLeft/Top ignoram o translate da entrada: o feixe já está alinhado enquanto as letras sobem
      let x = 0;
      let y = 0;
      for (let el = s; el && el !== root; el = el.offsetParent) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
      s.style.setProperty("--bf-x", x + "px");
      s.style.setProperty("--bf-y", y + "px");
      if (i === 0) top = y;
    });
    root.style.setProperty("--bf-top", top + "px");
    root.style.setProperty("--bf-bot", top + (parseFloat(inner.style.fontSize) || 0) * 0.92 + "px");
  };

  const fit = () => {
    const cs = getComputedStyle(box);
    const target = box.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    inner.style.fontSize = "100px";
    let size = fitSize(inner.offsetWidth, target, target * 0.42);
    if (!size) return;
    // Cortina (§9.5): o rodapé só vira cortina se couber na tela (altura ≤ 100svh). Em janela baixa a marca encolhe até o
    // rodapé caber, no máximo − 28%; abaixo disso a cortina simplesmente não liga e o rodapé fica em fluxo normal.
    // Medido: sem este teto, em 1366 × 650 o rodapé tem 682 px e a cortina não liga; com ele fica com 624 px e liga.
    const rest = root.offsetHeight - word.offsetHeight; // altura do rodapé sem a marca
    const k = measureBaseline() + CUT;
    const capH = (window.innerHeight * 0.96 - rest) / k;
    // celular (≤ 767 px): o rodapé tem altura de tela (min-height: 100svh), então `rest` inclui o espaço vazio e este teto
    // encolheria a wordmark; ela segue a largura
    if (window.innerHeight >= 560 && capH > 0 && !matchMedia("(max-width: 767px)").matches) size = Math.max(Math.min(size, capH), size * 0.72);
    inner.style.fontSize = size + "px";
    word.style.height = Math.max(0, size * k) + "px";
    place();
  };

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fit);
  };
  fit();
  new ResizeObserver(schedule).observe(root);
  document.fonts?.ready.then(schedule);

  // ---------- movimento ----------
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const ptr = { u: 0.5, x: 0, y: 0, inside: false };
  let visible = false;
  let raf = 0;

  const set = (b, px, py, g) => {
    root.style.setProperty("--bf-b", b.toFixed(2) + "%");
    root.style.setProperty("--bf-px", px.toFixed(1) + "px");
    root.style.setProperty("--bf-py", py.toFixed(1) + "px");
    root.style.setProperty("--bf-g", g.toFixed(3));
  };

  // feixe parado (movimento reduzido ou fora da tela); o brilho ainda responde ao ponteiro, porque só se move com ele
  const hold = () => set(58, ptr.x, ptr.y, ptr.inside ? 1 : 0);

  let b = 58;
  let px = 0;
  let py = 0;
  let g = 0;
  let last = 0;
  let t = performance.now() / 1000;
  const tick = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    t += dt;
    const idle = drift(t);
    const target = ptr.inside ? beamTarget(ptr.u) * 0.75 + idle * 0.25 : idle;
    b = approach(b, target, 0.035, dt);
    px = approach(px, ptr.x, 0.16, dt);
    py = approach(py, ptr.y, 0.16, dt);
    g = approach(g, ptr.inside ? 1 : 0, 0.06, dt);
    set(b, px, py, g);
    raf = requestAnimationFrame(tick);
  };

  const run = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (reduced.matches || !visible) {
      hold();
      return;
    }
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const onPointer = (e) => {
    const r = root.getBoundingClientRect();
    ptr.x = e.clientX - r.left;
    ptr.y = e.clientY - r.top;
    ptr.u = r.width ? ptr.x / r.width : 0.5;
    ptr.inside = e.type !== "pointerleave";
    if (!raf) hold();
  };
  ["pointerenter", "pointermove", "pointerleave"].forEach((type) => root.addEventListener(type, onPointer));

  // entrada uma vez, na primeira vez que o rodapé aparece; o laço do feixe só roda enquanto ele está na tela
  if (!reduced.matches) {
    let d = 0;
    root.querySelectorAll(".site-footer__label, .site-footer__fade").forEach((el) => el.style.setProperty("--bf-d", (d += 70) + "ms"));
    letters.forEach((s, i) => s.parentElement.style.setProperty("--bf-d", 260 + i * 75 + "ms"));
    root.dataset.in = "false";
  }
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) root.dataset.in = "true";
      run();
    },
    { threshold: 0.12 },
  ).observe(root.closest("[data-footer-curtain]") || root);
  reduced.addEventListener?.("change", () => {
    if (reduced.matches) root.dataset.in = "true";
    run();
  });

  // a letra pula no clique
  letters.forEach((s) => {
    s.addEventListener("click", () => {
      if (reduced.matches) return;
      s.classList.remove("is-hop");
      void s.offsetWidth;
      s.classList.add("is-hop");
    });
    s.addEventListener("animationend", () => s.classList.remove("is-hop"));
  });
})();
