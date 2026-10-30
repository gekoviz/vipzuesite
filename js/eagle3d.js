// VIPZUE — águia 3D na divisa da seção 03 com a seguinte (abaixo dos cards; abaixo de 1024px).
//
// Modelo: assets/secao03/aguia-3d.glb (malha única, sem esqueleto: o movimento é do corpo inteiro, as asas não
// batem). Original de 14,5 MB otimizado para ~0,8 MB (gltf-transform optimize: simplificação, meshopt, WebP 1024).
// Three.js via jsDelivr, carregado só quando a divisa se aproxima da tela; até o primeiro quadro, e sempre que algo
// falhar, fica a imagem 2D (aguia-voo).
//
// Movimento limpo, sem giros: a águia vira para os LADOS seguindo o mouse (até ±22°), com uma inclinação mínima
// para cima/baixo (±4°) e uma leve inclinação das asas na curva. Tudo amortecido (~0,4s), sem molas nem voltas.
// Sem mouse (toque): a mesma virada lateral acompanha a passagem da águia pela tela. Sempre: flutuação lenta.
// Movimento reduzido: quadro parado, sem flutuação nem seguimento.
const seam = document.querySelector("[data-s03-seam]");
const box = seam?.querySelector("[data-s03-eagle3d]");
const canvas = box?.querySelector("canvas");

const MODEL = "assets/secao03/aguia-3d.glb";
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const BASE_YAW = (-30 * Math.PI) / 180; // enquadramento: 3/4 de frente, cabeça e garras à mostra
const MAX_YAW = (22 * Math.PI) / 180;
const MAX_PITCH = (4 * Math.PI) / 180;
const MAX_BANK = (5 * Math.PI) / 180;
const EASE = 3.2; // amortecimento (1/s): ~0,4s para chegar perto do alvo

const start = async () => {
  if (!canvas || !window.WebGLRenderingContext) return;
  const THREE = await import(THREE_URL);
  const { GLTFLoader } = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js");
  const { RoomEnvironment } = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js");
  const { MeshoptDecoder } = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/meshopt_decoder.module.js");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  // luz quente do alto à esquerda (como o champagne dos fundos) e um contraluz frio e fraco
  const key = new THREE.DirectionalLight(0xffe2bd, 2.2);
  key.position.set(-1.5, 2.2, 1.2);
  const rim = new THREE.DirectionalLight(0xdfe6ff, 0.6);
  rim.position.set(1.5, 0.6, -1.5);
  scene.add(key, rim);

  // modelo otimizado com gltf-transform: malha comprimida (meshopt, ~85 mil triângulos) e texturas WebP 1024px
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(MODEL);
  const model = gltf.scene;
  const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
  model.position.sub(center);
  const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
  const radius = size.length() / 2;
  // largura e altura vistas no enquadramento base (envergadura no eixo z, profundidade no x, altura no y)
  const viewW = size.z * Math.cos(BASE_YAW) + size.x * Math.abs(Math.sin(BASE_YAW));
  const viewH = size.y + size.x * 0.3;
  // pivô: a rotação acontece em torno do centro do corpo
  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.01, 20);
  const fit = () => {
    const w = box.clientWidth;
    const h = box.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    // distância para as asas ocuparem ~90% da largura (e o corpo caber na altura), com folga para a virada
    const tanV = Math.tan((camera.fov * Math.PI) / 360);
    const tanH = tanV * camera.aspect;
    const d = Math.max(viewW / 2 / (tanH * 0.9), viewH / 2 / (tanV * 0.8)) + size.x / 2;
    camera.position.set(-d * 0.97, d * 0.24, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  fit();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const target = { yaw: 0, pitch: 0 };
  const now = { yaw: 0, pitch: 0, bank: 0 };
  let mouse = false;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      mouse = true;
      target.yaw = (e.clientX / window.innerWidth - 0.5) * 2 * MAX_YAW;
      target.pitch = (e.clientY / window.innerHeight - 0.5) * 2 * MAX_PITCH;
    },
    { passive: true }
  );

  let t = 0;
  let last = null;
  let raf = 0;
  let visible = false;
  const pose = () => {
    if (!mouse) {
      // sem mouse: a virada lateral acompanha a passagem da águia pela tela (de +12° a −12°)
      const r = box.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (r.top + r.height / 2) / window.innerHeight));
      target.yaw = (p - 0.5) * 2 * (12 * Math.PI) / 180;
      target.pitch = 0;
    }
    const bob = reduce.matches ? 0 : Math.sin(t * 1.1) * 0.012 * radius;
    const sway = reduce.matches ? 0 : Math.sin(t * 0.55) * (2.5 * Math.PI) / 180;
    pivot.rotation.set(0, 0, 0);
    pivot.position.y = bob;
    pivot.rotateY(BASE_YAW + now.yaw + sway);
    pivot.rotateZ(now.pitch); // nariz para cima/baixo (o modelo olha para −x)
    pivot.rotateX(now.bank); // asas inclinam levemente na curva
  };
  const frame = (ts) => {
    const dt = last === null ? 0 : Math.min(0.1, (ts - last) / 1000);
    last = ts;
    t += dt;
    const k = 1 - Math.exp(-dt * EASE);
    const dyaw = (target.yaw - now.yaw) * k;
    now.yaw += dyaw;
    now.pitch += (target.pitch - now.pitch) * k;
    // inclinação proporcional à velocidade da virada, também amortecida
    const bankTarget = Math.max(-MAX_BANK, Math.min(MAX_BANK, (dyaw / Math.max(dt, 0.001)) * 0.35));
    now.bank += (bankTarget - now.bank) * k;
    pose();
    renderer.render(scene, camera);
    raf = visible && !reduce.matches && !document.hidden ? requestAnimationFrame(frame) : 0;
    if (!raf) last = null;
  };
  const kick = () => {
    if (!raf && visible && !reduce.matches && !document.hidden) raf = requestAnimationFrame(frame);
    if (reduce.matches) {
      pose();
      renderer.render(scene, camera);
    }
  };

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    kick();
  }).observe(box);
  new ResizeObserver(() => {
    fit();
    if (!raf) {
      pose();
      renderer.render(scene, camera);
    }
  }).observe(box);
  document.addEventListener("visibilitychange", kick);
  reduce.addEventListener("change", kick);

  pose();
  renderer.render(scene, camera);
  seam.classList.add("is-3d"); // a imagem 2D sai só depois do primeiro quadro
  kick();
};

// carrega só quando a divisa estiver a ~1 tela de distância (o modelo é pesado)
if (box && getComputedStyle(seam).display !== "none") {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      start().catch(() => seam.classList.remove("is-3d"));
    },
    { rootMargin: "100% 0px" }
  );
  io.observe(seam);
}
