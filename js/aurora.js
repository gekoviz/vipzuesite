// Fundo mesh animado no palco da Hero e do close do olho: estrutura do "Violet Aurora" (21st.dev, estilo
// Bloom Field / mesh) com a paleta quente do Silk aprovado (24/10/2026, pedido do usuário): base café-preto
// #0B0907, reflexos champagne #C3A881 / #E7D6B7 e bronze #8A6A4B, no lugar dos violetas.
// Um blob radial por cor, cada um no seu ponto, sobre #0B0907, com grão em overlay. Animado por
// requestAnimationFrame com relógio em segundos: ph = t * 0.20, amt = 0.25; cada blob tem fase estática
// (hash da semente 184) e deslocamento (sin(ph·k + p) − sin(p))·14·amt, exatamente 0 em ph = 0.
// Pilha na ordem do gerador (1ª cor embaixo, última em cima), com a intensidade de cada cor; o CSS
// exportado pela referência empilhava ao contrário e ficava quase liso (ver tools/violet-aurora.html).
// Pausa com a aba oculta, com o palco fora da tela e depois da passagem para "O que fazemos".
// Movimento reduzido: um quadro estático. Substitui o Silk (js/silk.js continua no projeto, sem uso).
(() => {
  const stage = document.querySelector(".hero__stage");
  const host = stage?.querySelector(".hero__bg");
  if (!stage || !host) return;

  const GRAIN_SVG =
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.030'/></svg>";
  const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

  // Centro (%), raio final (%), cor e intensidade ("@ N%" da paleta), na ordem da paleta.
  // Mesma posição, raio e intensidade de cada blob do Violet Aurora; só as cores mudaram:
  // night violet → #0B0907, violet → champagne #C3A881, deep violet → bronze #8A6A4B, lavender → #E7D6B7.
  // Intensidade dos reflexos aumentada a pedido do usuário (mais perto do Silk antigo):
  // champagne 0,30 → 0,58 e 0,25 → 0,45; bronze 0,35 → 0,50; champagne claro 0,15 → 0,32.
  const BLOBS = [
    { x: 56.18, y: 53.14, r: 76.1, rgb: "11, 9, 7", k: 1 },
    { x: 40.93, y: 70.24, r: 70.85, rgb: "11, 9, 7", k: 0.85 },
    { x: 58, y: 14.42, r: 51.6, rgb: "195, 168, 129", k: 0.58 },
    { x: 65, y: 81.01, r: 53.35, rgb: "138, 106, 75", k: 0.5 },
    { x: 16.23, y: 47.68, r: 49.85, rgb: "195, 168, 129", k: 0.45 },
    { x: 94, y: 31.96, r: 46.35, rgb: "231, 214, 183", k: 0.32 },
  ];
  const STOPS = [
    [1, 0],
    [0.844, 0.25],
    [0.5, 0.5],
    [0.156, 0.75],
    [0, 1],
  ];
  const SEED = 184;
  const SPEED = 0.2;
  const AMT = 0.25;
  const hash = (n) => {
    const v = Math.sin(n) * 43758.5453;
    return v - Math.floor(v);
  };
  BLOBS.forEach((b, i) => {
    b.p = hash(SEED * 12.9898 + i * 78.233) * Math.PI * 2;
    b.p2 = hash(SEED * 39.3468 + i * 11.135) * Math.PI * 2;
  });

  const layer = (b, ph) => {
    const x = b.x + (Math.sin(ph * 0.55 + b.p) - Math.sin(b.p)) * 14 * AMT;
    const y = b.y + (Math.sin(ph * 0.43 + b.p2) - Math.sin(b.p2)) * 14 * AMT;
    const stops = STOPS.map(([a, f]) => `rgba(${b.rgb}, ${a * b.k}) ${b.r * f}%`).join(", ");
    return `radial-gradient(circle at ${x}% ${y}%, ${stops})`;
  };

  const el = document.createElement("div");
  el.className = "hero__aurora";
  el.setAttribute("aria-hidden", "true");
  host.prepend(el);
  stage.classList.add("has-aurora");

  const render = (ph) => {
    el.style.backgroundImage = [GRAIN, ...BLOBS.map((b) => layer(b, ph)).reverse()].join(", ");
  };

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let t = 0; // segundos acumulados: pausas não fazem a fase saltar
  let last = null;
  let raf = 0;
  let inView = true;

  const frame = (now) => {
    if (last !== null) t += (now - last) / 1000;
    last = now;
    render(t * SPEED);
    raf = requestAnimationFrame(frame);
  };
  const shouldRun = () => !reduce.matches && !document.hidden && inView && !stage.classList.contains("is-handed-off");
  const update = () => {
    if (shouldRun()) {
      if (!raf) raf = requestAnimationFrame(frame);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = null;
    }
  };

  render(0);
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    update();
  }).observe(stage);
  new MutationObserver(update).observe(stage, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", update);
  reduce.addEventListener("change", update);
  update();
})();
