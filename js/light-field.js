// VIPZUE — campo de luz procedural do palco Hero → close do olho (WebGL1 puro, um canvas, um shader).
//
// Fusão de duas fontes (21st.dev): Bloom Field ("Violet Aurora") define ONDE está a luz — blobs radiais com
// centro, raio, intensidade e fase estática, deslocados por (sin(ph·k + p) − sin(p))·amt (zero em t = 0);
// Silk define COMO a luz respira — o laço de shade() original, com amplitude e frequência reduzidas, vira um
// campo de modulação (leve deformação do domínio + ±12% de luminância), nunca uma segunda imagem.
// O campo escalar de luz é comprimido (1 − e^−x) e mapeado na paleta VIPZUE em OKLab
// (#141210 → #22201D → #2F251F → #4A372B → #8A6A4B → #C3A881); depois vinheta leve e o grão do shader
// (o grão SVG do Bloom não é usado). Um relógio (rAF): o tempo move a luz; a rolagem (palco da Hero) só
// desloca suavemente a composição da Hero para a do close, sem reiniciar.
// Substitui js/aurora.js e js/silk.js (ambos continuam no projeto, sem carregar).
//
// Dois estados no MESMO shader e no mesmo relógio (seção 03 "Por que isso importa?"):
//   escuro — Hero e close: o campo de luz mapeado na rampa escura (Background Principal, universo grafite)
//   claro  — seção 03: o MESMO campo (mesmos blooms, Silk, deriva, vinheta e grão), só que mapeado numa rampa
//            centrada no Background Secundário #B8AA96 (bege acinzentado: ruptura e respiro), com as luzes
//            subindo para champagne claro #E7D6B7 e marfim #F3EDE3. Só a cor muda (25/10).
// A passagem é uma frente que sobe de baixo para cima com a rolagem (a mesma da cópia de "O que fazemos" em
// js/hero.js), com borda difusa levemente ondulada pelo Silk. Sem storytelling, a frente é o topo real da
// seção 03. O canvas é fixo atrás da página: continua vivo atrás da seção 03 depois que o palco sai de cena.
(() => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  // ---------- Paleta (sRGB) → OKLab, calculada uma vez e embutida no shader ----------
  const PALETTE = ["#141210", "#22201D", "#2F251F", "#4A372B", "#8A6A4B", "#C3A881"];
  // Contexto claro (seção 03): bronze (só para aprofundar o fundo da rampa), bege acinzentado, champagne claro, marfim
  const LIGHT = { BRONZE: "#8A6A4B", BASE: "#B8AA96", CHAMP_L: "#E7D6B7", IVORY: "#F3EDE3" };
  const STOPS = [0, 0.18, 0.36, 0.56, 0.78, 1];
  // Rampa clara: x do campo em que a sombra (bege + fração de bronze) chega ao bege, e o bege chega ao champagne claro
  const BEIGE = { deep: 0.22, base: 0.2, champ: 0.6 };
  const toOklab = (hex) => {
    const lin = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const [r, g, b] = lin;
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717660 * m - 0.808675766 * s,
    ];
  };
  const v3 = (a) => `vec3(${a.map((n) => n.toFixed(6)).join(", ")})`;
  const LAB = PALETTE.map(toOklab);

  // Fase estática por bloom (hash da semente 184, como no Bloom Field) — nunca animada
  const SEED = 184;
  const hash = (n) => {
    const v = Math.sin(n) * 43758.5453;
    return v - Math.floor(v);
  };
  const phases = [0, 1, 2, 3, 4].map((i) => [
    hash(SEED * 12.9898 + i * 78.233) * Math.PI * 2,
    hash(SEED * 39.3468 + i * 11.135) * Math.PI * 2,
  ]);
  const f = (n) => n.toFixed(4);

  // ---------- Composição da luz: (centro x, centro y em 0–1 do canvas, topo = 0), raio (em lados curtos), intensidade.
  // Hero desktop (HD), Hero retrato (HM), close desktop (CD), close retrato (CM). Interpolados por layout e rolagem.
  // 1 bronze principal (atrás/lateral da cabeça) · 2 champagne (pico, menor) · 3 café/marrom lateral amplo
  // 4 campo escuro (região da headline / do texto do close; reduz a luz) · 5 volume inferior grafite/café
  const B = {
    HD: [[0.7, 0.3, 0.62, 0.85], [0.82, 0.14, 0.26, 0.55], [0.98, 0.7, 0.75, 0.3], [0.2, 0.5, 0.62, 0.62], [0.55, 1.08, 0.7, 0.28]],
    HM: [[0.62, 0.38, 0.95, 0.85], [0.88, 0.27, 0.38, 0.5], [0.02, 0.62, 0.9, 0.28], [0.3, 0.13, 0.62, 0.66], [0.5, 1.05, 1.0, 0.26]],
    CD: [[0.72, 0.36, 0.7, 0.6], [0.86, 0.18, 0.24, 0.3], [0.04, 0.78, 0.8, 0.26], [0.22, 0.22, 0.55, 0.55], [0.5, 1.08, 0.75, 0.22]],
    CM: [[0.6, 0.42, 1.0, 0.6], [0.9, 0.3, 0.36, 0.28], [0.04, 0.8, 0.95, 0.24], [0.4, 0.17, 0.6, 0.62], [0.5, 1.06, 1.0, 0.22]],
  };
  const consts = Object.entries(B)
    .flatMap(([k, list]) => list.map((b, i) => `const vec4 ${k}${i} = vec4(${b.map(f).join(", ")});`))
    .join("\n");

  const VERT = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform vec4 u_time;  // x: ph (fase do Bloom, t·0.20)  y: tempo do Silk  z: quantidade de Silk  w: progresso Hero → close
uniform vec4 u_look;  // x: layout (0 paisagem → 1 retrato)  y: vinheta  z: grão  w: escala de pixel (grão)
uniform vec4 u_state; // x: frente escuro → claro (fração da altura a partir de baixo)  y: borda difusa
                      // z: livre  w: ondulação da frente

${consts}
const vec3 L0 = ${v3(LAB[0])};
const vec3 L1 = ${v3(LAB[1])};
const vec3 L2 = ${v3(LAB[2])};
const vec3 L3 = ${v3(LAB[3])};
const vec3 L4 = ${v3(LAB[4])};
const vec3 L5 = ${v3(LAB[5])};
const vec3 K_BRONZE = ${v3(toOklab(LIGHT.BRONZE))};
const vec3 K_BASE = ${v3(toOklab(LIGHT.BASE))};
const vec3 K_CHAMP_L = ${v3(toOklab(LIGHT.CHAMP_L))};
const vec3 K_IVORY = ${v3(toOklab(LIGHT.IVORY))};

vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
             -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
             -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 linearToSrgb(vec3 c) {
  c = max(c, vec3(0.0));
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
float seg(float x, float a, float b) { return smoothstep(0.0, 1.0, clamp((x - a) / (b - a), 0.0, 1.0)); }
// Rampa da paleta em OKLab (transições perceptualmente suaves café → bronze → champagne)
vec3 paletteLab(float x) {
  vec3 c = L0;
  c = mix(c, L1, seg(x, ${f(STOPS[0])}, ${f(STOPS[1])}));
  c = mix(c, L2, seg(x, ${f(STOPS[1])}, ${f(STOPS[2])}));
  c = mix(c, L3, seg(x, ${f(STOPS[2])}, ${f(STOPS[3])}));
  c = mix(c, L4, seg(x, ${f(STOPS[3])}, ${f(STOPS[4])}));
  c = mix(c, L5, seg(x, ${f(STOPS[4])}, ${f(STOPS[5])}));
  return c;
}
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
// Silk como campo de modulação: o laço de shade() com amplitude e frequência baixas (não desenha seda)
float silkField(vec2 p, float t) {
  vec2 q = p * 1.05;
  float amp = 0.34;
  for (float i = 1.0; i < 4.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + 7.0);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return 0.5 + 0.5 * sin(q.x + q.y);
}
vec4 pick(vec4 hd, vec4 hm, vec4 cd, vec4 cm) {
  return mix(mix(hd, hm, u_look.x), mix(cd, cm, u_look.x), u_time.w);
}
// Luz de um bloom (gaussiana suave; sem bordas), com deriva lenta a partir de fase estática
float bloom(vec2 P, vec2 aspect, vec4 b, vec2 ph, float amt) {
  vec2 off = vec2(sin(u_time.x * 0.55 + ph.x) - sin(ph.x), sin(u_time.x * 0.43 + ph.y) - sin(ph.y)) * 0.14 * amt;
  vec2 c = (b.xy + off) * aspect;
  float d = length(P - c) / b.z;
  return exp(-d * d * 2.6) * b.w;
}
// Campo de luz da Hero / close (escalar 0–1): o mesmo para os dois estados, só a rampa de cor muda
float field(vec2 Pw, vec2 aspect, float s, float silk) {
  const float amt = 0.25;
  float light = 0.1; // grafite de base
  light += bloom(Pw, aspect, pick(HD0, HM0, CD0, CM0), vec2(${f(phases[0][0])}, ${f(phases[0][1])}), amt);
  light += bloom(Pw, aspect, pick(HD1, HM1, CD1, CM1), vec2(${f(phases[1][0])}, ${f(phases[1][1])}), amt);
  light += bloom(Pw, aspect, pick(HD2, HM2, CD2, CM2), vec2(${f(phases[2][0])}, ${f(phases[2][1])}), amt);
  light += bloom(Pw, aspect, pick(HD4, HM4, CD4, CM4), vec2(${f(phases[4][0])}, ${f(phases[4][1])}), amt);
  // compressão suave: os blooms se combinam sem clipar nem virar bege generalizado
  light = 1.0 - exp(-1.5 * light);
  // campo escuro (headline / texto do close)
  light *= 1.0 - bloom(Pw, aspect, pick(HD3, HM3, CD3, CM3), vec2(${f(phases[3][0])}, ${f(phases[3][1])}), amt);
  light *= mix(1.0, 0.88 + 0.24 * s, silk);
  return light;
}
// Rampa clara (seção 03): o fundo do campo assenta no bege acinzentado #B8AA96 (levemente aprofundado por bronze
// nas sombras) e as luzes sobem para champagne claro e marfim — a mesma leitura de luz da Hero, em outra cor
vec3 beigeLab(float x) {
  vec3 c = mix(K_BASE, K_BRONZE, ${f(BEIGE.deep)});
  c = mix(c, K_BASE, seg(x, 0.0, ${f(BEIGE.base)}));
  c = mix(c, K_CHAMP_L, seg(x, ${f(BEIGE.base)}, ${f(BEIGE.champ)}));
  c = mix(c, K_IVORY, seg(x, ${f(BEIGE.champ)}, 1.0));
  return c;
}

void main() {
  vec2 uv = vec2(gl_FragCoord.x / u_res.x, 1.0 - gl_FragCoord.y / u_res.y);
  float shortSide = min(u_res.x, u_res.y);
  vec2 aspect = u_res / shortSide;      // círculos continuam círculos em qualquer proporção
  vec2 P = uv * aspect;

  // Silk: respiração da luz (deformação mínima do domínio + modulação de luminância)
  float s = silkField(P * 0.9, u_time.y);
  float silk = u_time.z;
  vec2 Pw = P + (vec2(s, 1.0 - s) - 0.5) * 0.05 * silk;

  // frente escuro → claro: sobe de baixo para cima, borda difusa ondulada pelo mesmo Silk
  float front = u_state.x + (s - 0.5) * 2.0 * u_state.w;
  float m = smoothstep(0.0, 1.0, (front - (1.0 - uv.y)) / max(u_state.y, 0.0001));
  // volta ao escuro da Hero abaixo do topo da seção 04 (borda nítida, como a divisa de qualquer seção)
  m *= 1.0 - smoothstep(0.0, 1.0, (u_state.z - (1.0 - uv.y)) / 0.004);
  // um só campo; cada rampa só é calculada onde aparece (toda escura na Hero/close, toda clara na seção 03)
  float light = field(Pw, aspect, s, silk);
  vec3 lab = m < 1.0 ? paletteLab(light) : beigeLab(light);
  if (m > 0.0 && m < 1.0) lab = mix(lab, beigeLab(light), m);
  vec3 col = clamp(linearToSrgb(oklabToLin(lab)), 0.0, 1.0);

  // vinheta leve e grão: os mesmos nos dois estados
  float vd = length(uv - 0.5) * 1.41421356;
  col *= 1.0 - u_look.y * smoothstep(0.35, 1.0, vd);
  // grão único (o do shader), estável por pixel de tela
  col += (grainHash(floor(gl_FragCoord.xy * u_look.w) + vec2(${SEED * 17}.0, ${SEED * 31}.0)) - 0.5) * u_look.z;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

  // ---------- WebGL ----------
  const canvas = document.createElement("canvas");
  canvas.className = "page-light-field";
  canvas.setAttribute("aria-hidden", "true");
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) return; // sem WebGL: fica o fundo CSS de estúdio (fallback)

  let program = null;
  let loc = null;
  const build = () => {
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(p, 0, "a_pos");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
    gl.useProgram(p);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // triângulo de tela cheia
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    program = p;
    loc = {
      res: gl.getUniformLocation(p, "u_res"),
      time: gl.getUniformLocation(p, "u_time"),
      look: gl.getUniformLocation(p, "u_look"),
      state: gl.getUniformLocation(p, "u_state"),
    };
  };
  try {
    build();
  } catch (e) {
    return; // shader falhou: fallback CSS
  }

  // Fixo atrás da página (z-index −1 no CSS), e não dentro do palco: o mesmo canvas segue atrás da seção 03
  // depois que o palco da Hero sai de cena. A classe na raiz libera os fundos transparentes (CSS).
  const root = document.documentElement;
  document.body.prepend(canvas);
  root.classList.add("has-light-field");

  // ---------- Qualidade e tamanho ----------
  // Fundo difuso: buffer interno menor que a tela (DPR limitado e escala 0,6); a águia e o texto não são afetados.
  const coarse = matchMedia("(pointer: coarse)");
  let pixelScale = 1;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const mobile = coarse.matches || w < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    pixelScale = 0.6;
    // teto de ~1,3 megapixel no buffer (telas grandes e densas): o fundo é difuso, não precisa de mais
    const area = w * h * (dpr * pixelScale) ** 2;
    if (area > 1.3e6) pixelScale *= Math.sqrt(1.3e6 / area);
    const bw = Math.max(1, Math.round(w * dpr * pixelScale));
    const bh = Math.max(1, Math.round(h * dpr * pixelScale));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      gl.viewport(0, 0, bw, bh);
    }
  };

  // ---------- Relógio único e estado ----------
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let t = 0; // segundos acumulados (pausas não fazem a luz saltar)
  let last = null;
  let raf = 0;
  let inView = true;
  let section = 0; // 0 Hero → 1 close, suavizado
  const next = document.querySelector("[data-next]"); // seção 03, "O que fazemos"
  const WARP = 0.04; // ondulação da frente escuro → claro (fração da altura)

  // Frente escuro → claro, em fração da altura a partir de baixo. Com storytelling, segue a passagem já
  // suavizada da timeline (publicada por hero.js), ampliada para começar toda escura e terminar toda clara
  // apesar da ondulação. Sem storytelling, é o topo real da seção 03 (borda nítida, como a de qualquer seção).
  const frontState = () => {
    if (root.classList.contains("js-story")) {
      const story = window.__vzStory || {};
      const soft = story.wipeSoft || 0.24;
      return [(story.wipe || 0) * (1 + soft + 2 * WARP) - WARP, soft, WARP];
    }
    if (!next) return [0, 0.004, 0];
    return [1 - next.getBoundingClientRect().top / Math.max(1, canvas.clientHeight), 0.004, 0];
  };

  // Seção 04 ("Por que isso importa?"): o fundo volta ao campo escuro da Hero a partir do topo dela, em fração da
  // altura a partir de baixo (negativa enquanto ela está abaixo da tela)
  const why = document.querySelector("#por-que-importa");
  const returnFront = () => (why ? 1 - why.getBoundingClientRect().top / Math.max(1, canvas.clientHeight) : -1);

  const sectionTarget = () => {
    if (!document.documentElement.classList.contains("js-story")) return 0;
    // seção 04 ocupando a maior parte da tela: composição de luz da abertura da Hero (não a do close)
    if (returnFront() > 0.5) return 0;
    const r = hero.getBoundingClientRect();
    const span = Math.max(1, hero.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, -r.top / span));
    // composição de luz do close na mesma janela da atmosfera da seção 02 (marcos publicados por hero.js),
    // estável durante as três frases
    const story = window.__vzStory || { total: 258, atmosphere: { start: 14, end: 54 } };
    const svh = p * story.total;
    const x = Math.min(1, Math.max(0, (svh - story.atmosphere.start) / (story.atmosphere.end - story.atmosphere.start)));
    return x * x * (3 - 2 * x);
  };

  const draw = () => {
    const w = canvas.width;
    const h = canvas.height;
    const layout = Math.min(1, Math.max(0, (1.1 - canvas.clientWidth / Math.max(1, canvas.clientHeight)) / 0.4));
    const [front, soft, warp] = frontState();
    const silk = 0.9 - 0.6 * section; // o close já tem a textura das penas: o Silk recua
    gl.uniform2f(loc.res, w, h);
    gl.uniform4f(loc.time, t * 0.2, t * 0.12, silk, section);
    gl.uniform4f(loc.look, layout, 0.16 - 0.04 * section, 0.024, 1 / Math.max(pixelScale, 0.01));
    gl.uniform4f(loc.state, front, soft, returnFront(), warp);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now) => {
    const dt = last === null ? 0 : Math.min(0.1, (now - last) / 1000);
    last = now;
    t += dt;
    const target = sectionTarget();
    section += (target - section) * (1 - Math.exp(-dt * 6));
    if (dt === 0) section = target;
    draw();
    raf = requestAnimationFrame(frame);
  };

  const running = () => !reduce.matches && !document.hidden && inView && !gl.isContextLost();
  const update = () => {
    if (running()) {
      if (!raf) raf = requestAnimationFrame(frame);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = null;
    }
    // movimento reduzido: quadro estático (sem relógio), atualizado quando a composição muda
    if (reduce.matches && !gl.isContextLost()) {
      section = sectionTarget();
      draw();
    }
  };

  resize();
  draw();

  const ro = new ResizeObserver(() => {
    resize();
    if (!raf && !gl.isContextLost()) draw();
  });
  ro.observe(canvas);
  // Roda só enquanto a Hero (palco) ou a seção 03 estiver na tela; as seções seguintes cobrem o canvas
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    inView = visible.size > 0;
    update();
  });
  io.observe(hero);
  if (next) io.observe(next);
  // seção 04: o mesmo campo escuro da Hero continua animado enquanto ela está na tela
  if (why) io.observe(why);
  const onScrollReduced = () => reduce.matches && update();
  document.addEventListener("visibilitychange", update);
  reduce.addEventListener("change", update);
  window.addEventListener("scroll", onScrollReduced, { passive: true });

  // Perda de contexto: pausa e cai no fundo CSS; ao restaurar, recompila e continua do mesmo instante
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = null;
    root.classList.remove("has-light-field");
  });
  canvas.addEventListener("webglcontextrestored", () => {
    try {
      build();
      root.classList.add("has-light-field");
      resize();
      draw();
      update();
    } catch (e) {
      canvas.remove();
    }
  });

  // Saída da página: para o laço; voltando pelo histórico (bfcache), retoma do mesmo instante
  window.addEventListener("pagehide", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = null;
  });
  window.addEventListener("pageshow", update);

  update();
  window.__vzLightField = { get running() { return !!raf; }, get section() { return section; }, size: () => [canvas.width, canvas.height] };
})();
