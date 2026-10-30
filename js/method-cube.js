// Cubo do Método ("cada peça no lugar"): começa embaralhado e, quando entra na tela, volta sozinho à ordem.
// Mouse: arrastar gira a câmera e clicar numa face gira essa face. Toque: arrastar na horizontal gira a câmera (a
// vertical continua rolando a página) e tocar numa face gira a face. Depois de um tempo parado fora de ordem, ele
// se resolve de novo. Cores da marca em vez das do cubo original. Movimento reduzido: cubo resolvido e parado.
// Canvas 2D, sem dependências; só desenha quando algo muda.
(() => {
  const root = document.querySelector("[data-method-cube]");
  if (!root) return;
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const identity = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const multiply = (a, b) => a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
  const vector = (m, v) => m.map((row) => row.reduce((s, n, i) => s + n * v[i], 0));
  const add = (a, b) => a.map((n, i) => n + b[i]);
  const rotation = (axis, angle) => {
    const c = Math.cos(angle), s = Math.sin(angle);
    return axis === 0 ? [[1, 0, 0], [0, c, -s], [0, s, c]] : axis === 1 ? [[c, 0, s], [0, 1, 0], [-s, 0, c]] : [[c, -s, 0], [s, c, 0], [0, 0, 1]];
  };

  // paleta da marca: dourado, champanhe, marfim, bronze, marrom e bege (tokens.css)
  const faces = [
    { key: "F", axis: 2, layer: 1, sign: 1, color: "#C3A881", normal: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
    { key: "R", axis: 0, layer: 1, sign: -1, color: "#8A6A4B", normal: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
    { key: "U", axis: 1, layer: -1, sign: 1, color: "#F3EDE3", normal: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
    { key: "B", axis: 2, layer: -1, sign: -1, color: "#E7D6B7", normal: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
    { key: "L", axis: 0, layer: -1, sign: 1, color: "#4A372B", normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
    { key: "D", axis: 1, layer: 1, sign: -1, color: "#B8AA96", normal: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  ];
  const lookup = Object.fromEntries(faces.map((f) => [f.key, f]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SCRAMBLE = 8;
  const IDLE_SOLVE = 4500;

  let pieces = [], history = [], queue = [], active = null, frame = 0, width = 0, height = 0, hits = [];
  let yaw = -0.62, pitch = -0.45, drag = null, idleTimer = 0, visible = false, solvedOnce = false;

  function init() {
    pieces = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      if (!x && !y && !z) continue;
      const p = [x, y, z];
      pieces.push({ p, o: identity(), stickers: faces.filter((f) => p[f.axis] === f.layer).map((f) => f.key) });
    }
  }

  function apply(move) {
    const f = lookup[move.key], r = rotation(f.axis, (f.sign * move.dir * Math.PI) / 2);
    pieces.forEach((p) => {
      if (p.p[f.axis] !== f.layer) return;
      p.p = vector(r, p.p).map(Math.round);
      p.o = multiply(r, p.o).map((row) => row.map(Math.round));
    });
  }

  function scrambleSilently() {
    let previous = -1;
    for (let i = 0; i < SCRAMBLE; i++) {
      let index;
      do index = Math.floor(Math.random() * 6); while (faces[index].axis === previous);
      previous = faces[index].axis;
      const move = { key: faces[index].key, dir: Math.random() < 0.5 ? 1 : -1 };
      apply(move);
      history.push(move);
    }
  }

  const busy = () => !!active || queue.length > 0;
  const request = () => { if (!frame) frame = requestAnimationFrame(draw); };

  function enqueue(moves) {
    if (busy()) return;
    queue = moves.slice();
    start();
    request();
  }

  function start() {
    if (!queue.length) { active = null; armIdle(); return; }
    const move = queue.shift();
    active = { ...move, start: performance.now(), duration: move.slow ? 520 : 300 };
  }

  function finish() {
    const move = active;
    apply(move);
    if (move.undo) history.pop(); else history.push({ key: move.key, dir: move.dir });
    active = null;
    start();
  }

  // volta à ordem desfazendo o histórico, devagar
  function solve(slow) {
    if (!history.length) return;
    enqueue(history.slice().reverse().map((m) => ({ key: m.key, dir: -m.dir, undo: true, slow })));
  }

  function armIdle() {
    clearTimeout(idleTimer);
    if (history.length && visible) idleTimer = setTimeout(() => solve(false), IDLE_SOLVE);
  }

  function project(point, camera) {
    const q = vector(camera, point);
    const scale = (Math.min(width, height) * 0.3) / (6.8 - q[2]);
    return [width / 2 + q[0] * scale * 4, height * 0.46 + q[1] * scale * 4, q[2]];
  }

  function polygon(points, radius) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const prev = points[(i + points.length - 1) % points.length], p = points[i], next = points[(i + 1) % points.length];
      const a = [p[0] + (prev[0] - p[0]) * radius, p[1] + (prev[1] - p[1]) * radius];
      const b = [p[0] + (next[0] - p[0]) * radius, p[1] + (next[1] - p[1]) * radius];
      if (!i) ctx.moveTo(...a); else ctx.lineTo(...a);
      ctx.quadraticCurveTo(p[0], p[1], b[0], b[1]);
    }
    ctx.closePath();
  }

  function tint(hex, factor) {
    const n = parseInt(hex.slice(1), 16);
    return "rgb(" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.min(255, Math.round(v * factor))).join(",") + ")";
  }

  function inside(point, poly) {
    let yes = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]) yes = !yes;
    }
    return yes;
  }

  function draw(now) {
    frame = 0;
    ctx.clearRect(0, 0, width, height);
    if (active && now - active.start >= active.duration) finish();
    const camera = multiply(rotation(0, pitch), rotation(1, yaw));
    const rendered = [];
    hits = [];

    // sombra no chão
    const cy = height * 0.88;
    const shadow = ctx.createRadialGradient(width / 2, cy, 0, width / 2, cy, width * 0.3);
    shadow.addColorStop(0, "rgba(34,32,29,0.35)");
    shadow.addColorStop(1, "rgba(34,32,29,0)");
    ctx.save();
    ctx.translate(width / 2, cy);
    ctx.scale(1, 0.18);
    ctx.translate(-width / 2, -cy);
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, width, height * 6);
    ctx.restore();

    let motion = null;
    if (active) {
      const f = lookup[active.key];
      const t = Math.min(1, (now - active.start) / active.duration);
      motion = rotation(f.axis, ((f.sign * active.dir * Math.PI) / 2) * t * t * (3 - 2 * t));
    }

    for (const p of pieces) {
      const moving = active && p.p[lookup[active.key].axis] === lookup[active.key].layer;
      const orientation = moving ? multiply(motion, p.o) : p.o;
      const center = moving ? vector(motion, p.p) : p.p;
      for (const f of faces) {
        const normal = vector(orientation, f.normal), u = vector(orientation, f.u), v = vector(orientation, f.v);
        const faceCenter = add(center, normal.map((n) => n * 0.5));
        const camN = vector(camera, normal), camC = vector(camera, faceCenter);
        if (camN[0] * -camC[0] + camN[1] * -camC[1] + camN[2] * (6.8 - camC[2]) <= 0) continue;
        const corners = (size) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => project(add(faceCenter, u.map((n, i) => (n * a + v[i] * b) * size)), camera));
        const sticker = p.stickers.includes(f.key);
        const light = Math.min(1.12, 0.7 + Math.max(0, -camN[0] * 0.35 - camN[1] * 0.6 + camN[2] * 0.65) * 0.4);
        rendered.push({ points: corners(0.498), sticker: sticker ? corners(0.438) : null, z: camC[2], color: sticker ? tint(f.color, light) : null, normal });
      }
    }

    rendered.sort((a, b) => a.z - b.z);
    for (const f of rendered) {
      polygon(f.points, 0.12);
      ctx.fillStyle = "#22201D";
      ctx.fill();
      ctx.strokeStyle = "#141210";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (f.sticker) {
        polygon(f.sticker, 0.13);
        ctx.fillStyle = f.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();
        hits.push(f);
      }
    }
    if (busy()) request();
  }

  function resize() {
    const b = canvas.getBoundingClientRect();
    width = b.width;
    height = b.height;
    const d = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(width * d);
    canvas.height = Math.round(height * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    request();
  }

  init();
  new ResizeObserver(resize).observe(canvas);
  resize();
  if (reduced) return;

  scrambleSilently();
  request();

  // primeira entrada na tela: as peças voltam ao lugar, devagar
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) { clearTimeout(idleTimer); return; }
    if (!solvedOnce) {
      solvedOnce = true;
      setTimeout(() => solve(true), 450);
    } else armIdle();
  }, { threshold: 0.6 }).observe(canvas);

  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false, touch: e.pointerType !== "mouse" };
    canvas.setPointerCapture(e.pointerId);
    clearTimeout(idleTimer);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) drag.moved = true;
    if (drag.moved) {
      yaw += (e.clientX - drag.lastX) * 0.009;
      if (!drag.touch) pitch = Math.max(-1.2, Math.min(1.2, pitch - (e.clientY - drag.lastY) * 0.009));
      request();
    }
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
  });

  canvas.addEventListener("pointerup", (e) => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved || busy()) { armIdle(); return; }
    const b = canvas.getBoundingClientRect();
    const point = [e.clientX - b.left, e.clientY - b.top];
    const hit = hits.slice().reverse().find((f) => inside(point, f.sticker));
    if (!hit) { armIdle(); return; }
    const normal = hit.normal.map(Math.round);
    const f = faces.find((face) => face.normal.every((n, i) => n === normal[i]));
    if (f) enqueue([{ key: f.key, dir: e.shiftKey ? -1 : 1 }]);
  });

  canvas.addEventListener("pointercancel", () => { drag = null; armIdle(); });
})();
