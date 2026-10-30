// Logo em relevo (fim da Seção 04): 41 cópias do vetor empilhadas em Z dão a espessura; a da frente leva o degradê
// dourado. Com mouse, a peça inclina para o ponteiro; no toque, gira devagar conforme a seção passa pela tela.
// Movimento reduzido: pose fixa. O laço de animação só roda enquanto a logo está na tela e longe do alvo.
(() => {
  const root = document.querySelector("[data-brand-relief]");
  if (!root) return;
  const object = root.querySelector("[data-brand-relief-object]");
  const source = root.querySelector("[data-brand-relief-vector]").content.firstElementChild;
  const ns = "http://www.w3.org/2000/svg";
  const LAYERS = 40;

  let gradient;
  for (let i = 0; i <= LAYERS; i++) {
    const svg = source.cloneNode(true);
    svg.style.transform = "translateZ(" + (-16 + i * 0.4) + "px)";
    const group = svg.querySelector("g");
    if (i === LAYERS) {
      const defs = document.createElementNS(ns, "defs");
      gradient = document.createElementNS(ns, "linearGradient");
      gradient.id = "brand-relief-gold";
      gradient.setAttribute("x1", "0%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "85%");
      gradient.setAttribute("y2", "100%");
      [[0, "#9e773e"], [0.23, "#e0c38a"], [0.41, "#b58b4b"], [0.49, "#f5e3b6"], [0.56, "#c29c5d"], [0.8, "#dfc58f"], [1, "#846030"]].forEach(([offset, color]) => {
        const stop = document.createElementNS(ns, "stop");
        stop.setAttribute("offset", offset);
        stop.setAttribute("stop-color", color);
        gradient.appendChild(stop);
      });
      defs.appendChild(gradient);
      svg.prepend(defs);
      group.setAttribute("fill", "url(#brand-relief-gold)");
      group.setAttribute("stroke", "#f1d59b");
      group.setAttribute("stroke-width", "1.6");
    } else {
      const t = i / LAYERS;
      const band = Math.sin(t * 13) * 11;
      group.setAttribute("fill", "rgb(" + Math.round(76 + t * 60 + band) + "," + Math.round(49 + t * 38 + band * 0.7) + "," + Math.round(20 + t * 20) + ")");
    }
    object.appendChild(svg);
  }

  const REST = [12, -18];
  let x = REST[0], y = REST[1], tx = x, ty = y, raf = 0, visible = false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function apply() {
    object.style.transform = "translateY(-50%) rotateX(" + x.toFixed(2) + "deg) rotateY(" + y.toFixed(2) + "deg)";
    gradient.setAttribute("x1", (15 + y * 0.8).toFixed(1) + "%");
    gradient.setAttribute("x2", (85 + y * 0.8).toFixed(1) + "%");
  }

  function render() {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    apply();
    raf = visible && Math.abs(x - tx) + Math.abs(y - ty) > 0.03 ? requestAnimationFrame(render) : 0;
  }

  function aim(a, b) {
    tx = a;
    ty = b;
    if (!raf && visible) raf = requestAnimationFrame(render);
  }

  apply();
  if (reduced) return;

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(render);
  }).observe(root);

  if (finePointer) {
    // o ponteiro em qualquer ponto da janela orienta a peça; o giro lateral é o principal, o vertical é discreto
    addEventListener("pointermove", (e) => {
      if (!visible) return;
      const b = root.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width) * 2 - 1));
      const py = Math.max(-1, Math.min(1, ((e.clientY - (b.top + b.height / 2)) / innerHeight) * 2));
      aim(REST[0] - py * 10, px * 30);
    }, { passive: true });
  } else {
    // no toque: de -24° (entrando por baixo) a +24° (saindo por cima)
    const onScroll = () => {
      if (!visible) return;
      const b = root.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight - b.top) / (innerHeight + b.height)));
      aim(REST[0], -24 + p * 48);
    };
    addEventListener("scroll", onScroll, { passive: true });
  }
})();
