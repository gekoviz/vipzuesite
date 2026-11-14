// =========================================================
// VIPZUE — Atmosfera V2.0 (prompt mestre definitivo V2.0, 13/11/2026)
// Gerenciador do Paper MeshGradient (@paper-design/shaders 0.0.82, vendorizado em assets/vendor/) dentro de
// .vz-atmosphere__mesh em cada seção [data-vz-atmosphere]. A camada estática Jade Sky (css/vz-atmosphere.css) é o fundo
// garantido; este script só acrescenta o movimento por cima dela, com opacidade baixa.
//
// Política de instâncias:
// - um registro por seção (entries), com no máximo uma vaga por seção (nunca duplica);
// - teto de contextos WebGL NOVOS: 2 no desktop, 1 no celular (até 767,98px). As vagas vão para as seções mais visíveis
//   na tela e MIGRAM entre elas (o mesmo contexto muda de seção); vaga a mais (ex.: a tela encolheu para celular) é
//   descartada com dispose(), que perde o contexto de propósito;
// - vaga sem seção visível para (setSpeed(0)); o próprio ShaderMount também para fora da tela e com a aba oculta;
// - resolução: celular até DPR 1,25 e 700 mil pixels; desktop até DPR 1,5 e 1,4 milhão;
// - qualquer falha (sem WebGL2, erro de shader, contexto perdido 3 vezes) deixa só a camada estática;
// - movimento independente da rolagem: o tempo do shader corre sozinho. Nenhum laço de rAF além do do próprio
//   ShaderMount, nenhum uso do GSAP, nenhum ouvinte de scroll (só IntersectionObserver).
// =========================================================
import { ShaderMount, meshGradientFragmentShader, ShaderFitOptions } from "../assets/vendor/paper-shaders-mesh-0.0.82.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileQuery = window.matchMedia("(max-width: 767.98px)");
const budget = () => (mobileQuery.matches ? 1 : 2);

const PRESETS = {
  dark: { colors: ["#5B4632", "#9F3930", "#D7673F", "#5B4632"], speed: 0.12 },
  // claro: derivadas do token claro real da seção (--vz-atm-base), ver lightColors()
  light: { speed: 0.08 },
};
const SHAPE = { u_distortion: 0.8, u_swirl: 0.1, u_grainMixer: 0, u_grainOverlay: 0 };
const SIZING = {
  u_fit: ShaderFitOptions.contain,
  u_scale: 1,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
};
const MOCHA = [0x5b, 0x46, 0x32];
const PAPRIKA = [0xd7, 0x67, 0x3f];
const PAPRIKA_DEEP = [0x9f, 0x39, 0x30];

const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toUniform = (rgb) => [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1];
const mix = (base, tint, k) => base.map((v, i) => Math.round(v * (1 - k) + tint[i] * k));

function lightColors(meshEl) {
  // .vz-atmosphere__mesh tem color: var(--vz-atm-base): o navegador resolve o token para rgb()
  const m = getComputedStyle(meshEl).color.match(/[\d.]+/g);
  const base = m && m.length >= 3 ? m.slice(0, 3).map(Number) : hexRgb("#F3EDE3");
  return [mix(base, MOCHA, 0.04), mix(base, PAPRIKA, 0.07), mix(base, PAPRIKA_DEEP, 0.04), base];
}

const entries = [...document.querySelectorAll("[data-vz-atmosphere]")]
  .map((root, index) => ({
    root,
    index,
    tone: root.getAttribute("data-vz-atmosphere") === "light" ? "light" : "dark",
    mesh: root.querySelector(":scope > .vz-atmosphere .vz-atmosphere__mesh"),
    slot: null,
    share: 0, // fração da altura da tela ocupada pela seção
  }))
  .filter((e) => e.mesh);

let unavailable = false;
let losses = 0;
let created = 0;
let disposed = 0;
let timer = 0;
// Vagas: no máximo budget() ShaderMounts na página, cada um num div .vz-atmosphere__mesh próprio que MIGRA para o quadro
// da seção que ganhou a vaga (o mesmo contexto e o mesmo programa compilado; só mudam as cores, a velocidade e o lugar
// no DOM). Sem isso, cada troca de seção criava um contexto novo e recompilava o shader (medido: 15 a 17 por rolagem).
// O div estático de cada seção (markup) fica vazio e transparente: é o lugar da camada sem shader.
const slots = [];

function pixelCap(el) {
  const w = Math.max(1, el.clientWidth);
  const h = Math.max(1, el.clientHeight);
  const [dprCap, maxPixels] = mobileQuery.matches ? [1.25, 700000] : [1.5, 1400000];
  return Math.max(1, Math.floor(Math.min(maxPixels, w * h * dprCap * dprCap)));
}

function uniformsFor(e) {
  const colors = e.tone === "light" ? lightColors(e.mesh) : PRESETS.dark.colors.map(hexRgb);
  return { u_colors: colors.map(toUniform), u_colorsCount: colors.length, ...SHAPE, ...SIZING };
}

function release(slot) {
  const i = slots.indexOf(slot);
  if (i >= 0) slots.splice(i, 1);
  if (slot.entry) slot.entry.slot = null;
  try {
    slot.mount.dispose();
  } catch (_) {
    /* já descartado */
  }
  slot.el.remove();
  disposed++;
}

function newSlot(e) {
  const el = document.createElement("div");
  el.className = "vz-atmosphere__mesh vz-atmosphere__mesh--live";
  e.mesh.after(el); // precisa estar no quadro (com tamanho) antes de nascer
  let mount;
  try {
    mount = new ShaderMount(
      el,
      meshGradientFragmentShader,
      uniformsFor(e),
      { alpha: false, powerPreference: "low-power" },
      PRESETS[e.tone].speed,
      // quadro inicial diferente por vaga
      (slots.length + 1) * 9000,
      1, // sem superamostragem: o teto de DPR vem do maxPixelCount
      pixelCap(el)
    );
  } catch (err) {
    el.remove();
    unavailable = true; // sem WebGL2 ou shader com erro: só a camada estática nesta página
    console.warn("[vz-atmosphere] shader indisponível, fica a camada estática:", err && err.message);
    return null;
  }
  created++;
  const slot = { el, mount, entry: null };
  const canvas = mount.canvasElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.addEventListener(
    "webglcontextlost",
    () => {
      if (!slots.includes(slot)) return; // perda pedida por nós (dispose)
      release(slot);
      if (++losses >= 3) unavailable = true;
      schedule();
    },
    { once: true }
  );
  slots.push(slot);
  return slot;
}

function attach(slot, e) {
  if (slot.entry === e) return;
  if (slot.entry) slot.entry.slot = null;
  slot.entry = e;
  e.slot = slot;
  slot.el.classList.remove("is-live");
  if (slot.el.previousElementSibling !== e.mesh) {
    e.mesh.after(slot.el);
    slot.mount.setUniforms(uniformsFor(e));
    slot.mount.setMaxPixelCount(pixelCap(slot.el));
  }
  // entra em 1,2 s (transição no CSS) a partir do transparente
  requestAnimationFrame(() => requestAnimationFrame(() => slot.entry === e && slot.el.classList.add("is-live")));
}

function reconcile() {
  timer = 0;
  if (reduced.matches || unavailable) {
    slots.slice().forEach(release);
    return;
  }
  const n = budget();
  while (slots.length > n) release(slots.reduce((a, b) => ((a.entry ? a.entry.share : 0) <= (b.entry ? b.entry.share : 0) ? a : b)));
  const wanted = entries.filter((e) => e.share > 0).sort((a, b) => b.share - a.share).slice(0, n);
  // vagas de seções que saíram da lista: param (setSpeed(0)) e ficam livres para migrar
  const free = slots.filter((s) => !s.entry || !wanted.includes(s.entry));
  free.forEach((s) => s.mount.setSpeed(0));
  for (const e of wanted) {
    let slot = e.slot;
    if (!slot) slot = free.shift() || (slots.length < n ? newSlot(e) : null);
    if (!slot) continue;
    attach(slot, e);
    slot.mount.setSpeed(PRESETS[e.tone].speed);
  }
}

function schedule(delay = 140) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(reconcile, delay);
}

if (entries.length) {
  const io = new IntersectionObserver(
    (list) => {
      const vh = window.innerHeight || 1;
      for (const it of list) {
        const e = entries.find((x) => x.root === it.target);
        if (!e) continue;
        e.share = it.isIntersecting ? Math.min(1, it.intersectionRect.height / vh) : 0;
        // fora da tela: para já (a migração, se preciso, vem no reconcile)
        if (!e.share && e.slot) e.slot.mount.setSpeed(0);
      }
      schedule();
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
  );
  // a 1ª película só nasce com a página ociosa: não disputa o carregamento da Hero
  const start = () => entries.forEach((e) => io.observe(e.root));
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2500 });
  else setTimeout(start, 1200);

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      slots.forEach((sl) => sl.mount.setMaxPixelCount(pixelCap(sl.el)));
      schedule(); // o teto muda ao cruzar 768px
    }, 200);
  });
  const onReduced = () => schedule(0);
  reduced.addEventListener ? reduced.addEventListener("change", onReduced) : reduced.addListener(onReduced);
}

// Leitura para QA (sem efeito no site)
window.__vzAtmosphere = {
  get live() {
    return slots.filter((sl) => sl.entry && sl.el.classList.contains("is-live")).map((sl) => sl.entry.root.id || sl.entry.root.className.split(" ")[0]);
  },
  get stats() {
    return { created, disposed, losses, unavailable, budget: budget(), slots: slots.length };
  },
};
