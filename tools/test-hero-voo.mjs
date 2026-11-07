// Testes de lógica do motor do voo (js/hero-voo.js), sem navegador: node tools/test-hero-voo.mjs
// Cobrem os contratos do prompt V2 §55. Não substituem a inspeção do voo real, do alfa e do pouso.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import assert from "node:assert/strict";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { setTimeout, clearTimeout, AbortController, console, Promise };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(root, "js/hero-voo.js"), "utf8"), sandbox);
const V = sandbox.VZVoo;

const realManifest = JSON.parse(readFileSync(join(root, "assets/hero/voo/manifest.json"), "utf8"));
const M = V.validateManifest(realManifest);
const flush = async (n = 30) => {
  for (let i = 0; i < n; i++) await new Promise((r) => setImmediate(r));
};

// Rede e decodificação simuladas: cada pedido fica pendente até ser resolvido pelo teste (ou resolve sozinho)
function fakeIO({ auto = true, fail = new Set() } = {}) {
  const pending = [];
  const closed = [];
  const io = {
    fetches: 0,
    closed,
    fetchImpl(url, opt) {
      io.fetches++;
      const i = +url.match(/voo-(\d+)/)[1];
      return new Promise((resolve, reject) => {
        const go = () =>
          fail.has(i) ? resolve({ ok: false, status: 404 }) : resolve({ ok: true, blob: async () => ({ size: 54_000, i }) });
        opt?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("abort"), { name: "AbortError" })));
        auto ? go() : pending.push(go);
      });
    },
    decodeImpl(blob) {
      return Promise.resolve({ i: blob.i, close: () => closed.push(blob.i) });
    },
    release: () => pending.splice(0).forEach((f) => f()),
  };
  return io;
}
function fakeCtx() {
  const calls = [];
  return {
    calls,
    setTransform() {},
    clearRect() {},
    drawImage: (bmp) => calls.push(bmp.i),
    createLinearGradient: () => ({ addColorStop() {} }),
    fillRect() {},
    set globalCompositeOperation(v) {},
    set globalAlpha(v) {},
    set fillStyle(v) {},
  };
}
function rig(opts = {}) {
  const io = fakeIO(opts);
  const store = V.createFrameStore({ manifest: M, config: V.CONFIG, fetchImpl: io.fetchImpl, decodeImpl: io.decodeImpl });
  const ctx = fakeCtx();
  const renderer = V.createRenderer({ ctx, frame: { w: M.width, h: M.height } });
  renderer.resize(1440, 900, 1);
  const visit = { completed: false, bypassed: false };
  const log = [];
  let queued = false;
  const coord = V.createCoordinator({
    config: V.CONFIG,
    manifest: M,
    store,
    renderer,
    visit,
    schedule: () => (queued = true),
    hooks: {
      matrixAt: () => ({ x: 0, y: 0, s: 1, mask: 0, key: "m" }),
      onCommit: () => log.push("commit"),
      onBypass: (r) => log.push("bypass:" + r),
      onFallback: (r) => log.push("fallback:" + r),
      finishEntrance: () => log.push("finishEntrance"),
    },
  });
  store.onDecoded(() => (queued = true));
  const frame = () => {
    queued = false;
    return coord.renderCurrentTarget();
  };
  return { io, store, ctx, renderer, visit, log, coord, frame, isQueued: () => queued };
}

const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const F = V.CONFIG.flightSvh;
const svhFor = (i) => (i / M.finalFrame) * F;

test("1. mapeamento: 0 → primeiro, fim → último, sempre dentro do manifesto", () => {
  assert.equal(V.frameMap(0, M), M.firstFrame);
  assert.equal(V.frameMap(1, M), M.finalFrame);
  assert.equal(V.frameMap(-3, M), M.firstFrame);
  assert.equal(V.frameMap(7, M), M.finalFrame);
  assert.equal(V.frameMap(NaN, M), M.firstFrame);
  for (let p = 0; p <= 1; p += 0.013) {
    const i = V.frameMap(p, M);
    assert.ok(Number.isInteger(i) && i >= 0 && i < M.frames.length);
  }
  assert.equal(M.frames.length, 241);
  assert.throws(() => V.validateManifest({ ...realManifest, frames: [{ url: "../x.webp" }, { url: "assets/a.webp" }] }));
  assert.throws(() => V.validateManifest({ ...realManifest, finalFrame: 999 }));
});

test("2. rolagem reversa antes do pouso volta os quadros", async () => {
  const r = rig();
  r.coord.updateRaw(svhFor(120));
  await flush();
  assert.equal(r.frame().drawnIndex, 120);
  r.coord.updateRaw(svhFor(60));
  await flush();
  const rc = r.frame();
  assert.equal(rc.exact, true);
  assert.equal(rc.drawnIndex, 60);
  assert.equal(r.coord.phase, "scrubbing");
});

test("3. depois do pouso, rolar para trás nunca pede quadros do voo", async () => {
  const r = rig();
  r.coord.updateRaw(F + 1);
  await flush();
  r.frame();
  assert.deepEqual(r.log, ["commit"]);
  assert.equal(r.visit.completed, true);
  r.store.stopSpeculative([M.finalFrame]);
  const before = r.io.fetches;
  const draws = r.ctx.calls.length;
  for (const d of [100, 40, 0, 150]) r.coord.updateRaw(d);
  await flush();
  r.frame();
  assert.equal(r.io.fetches, before);
  assert.equal(r.ctx.calls.length, draws);
  assert.equal(r.coord.requested, M.finalFrame);
});

test("4. decodificação fora de ordem não troca o alvo atual por imagem antiga", async () => {
  const r = rig({ auto: false });
  r.coord.updateRaw(svhFor(50));
  r.coord.updateRaw(svhFor(120)); // alvo muda antes de qualquer resposta
  r.io.release();
  await flush();
  r.io.release();
  await flush();
  const rc = r.frame();
  assert.equal(rc.requestedIndex, 120);
  assert.ok(rc.drawnIndex === null || Math.abs(rc.drawnIndex - 120) <= V.CONFIG.substituteTolerance, `desenhou ${rc.drawnIndex}`);
  assert.ok(!r.ctx.calls.some((i) => Math.abs(i - 120) > V.CONFIG.substituteTolerance), `desenhos: ${r.ctx.calls}`);
});

test("5. quadro aproximado não confirma o pouso", async () => {
  const r = rig();
  r.coord.updateRaw(svhFor(239));
  await flush();
  r.frame();
  // o último quadro some do armazenamento (simula atraso): o pedido final só tem vizinho
  r.store.stopSpeculative([239]);
  r.coord.updateRaw(F + 2);
  const rc = r.frame();
  assert.equal(rc.exact, false);
  assert.equal(rc.drawnIndex, 239);
  assert.equal(r.visit.completed, false);
  assert.ok(!r.log.includes("commit"));
});

test("6. resize no mesmo quadro exige redesenho", async () => {
  const r = rig();
  r.coord.updateRaw(svhFor(80));
  await flush();
  assert.equal(r.frame().didDraw, true);
  assert.equal(r.frame().didDraw, false); // mesmo quadro, mesma geometria
  r.renderer.resize(1280, 720, 1);
  const rc = r.frame();
  assert.equal(rc.didDraw, true);
  assert.equal(rc.geometryRevision, r.renderer.revision);
});

test("7. instância desmontada (troca de breakpoint) ignora callbacks antigos", async () => {
  const r = rig();
  r.coord.updateRaw(svhFor(30));
  r.coord.dispose();
  await flush();
  const draws = r.ctx.calls.length;
  assert.equal(r.frame(), null);
  r.coord.updateRaw(F + 5);
  r.coord.bypassToReady("x");
  assert.equal(r.ctx.calls.length, draws);
  assert.deepEqual(r.log, []);
  assert.equal(r.visit.completed || r.visit.bypassed, false);
  assert.equal(r.coord.phase, "disposed");
});

test("8. falha de quadro termina em estado funcional (fallback), não em sucesso", async () => {
  const r = rig({ fail: new Set([100, 101, 102, 98, 99]) });
  r.coord.updateRaw(svhFor(100));
  await flush(80);
  r.frame();
  assert.deepEqual(r.log, ["fallback:frame-failed"]);
  assert.equal(r.visit.completed, false);
  assert.equal(r.visit.bypassed, true);
  assert.equal(r.coord.phase, "fallback");
  // e o primeiro/último ausentes reprovam a ativação
  const r2 = rig({ fail: new Set([M.finalFrame]) });
  await assert.rejects(r2.store.critical(1000));
});

test("8b. tempo esgotado na preparação rejeita", async () => {
  const r = rig({ auto: false });
  await assert.rejects(r.store.critical(30), /tempo esgotado/);
});

test("9. avanço rápido conclui a entrada antes da saída do pai (Visão)", async () => {
  const r = rig();
  r.coord.updateRaw(F + 1);
  await flush();
  r.frame();
  assert.equal(r.coord.phase, "revealing");
  r.coord.updateRaw(F + V.CONFIG.readyZoneSvh + 0.5); // início da Visão pela rolagem bruta
  assert.deepEqual(r.log, ["commit", "finishEntrance"]);
  assert.equal(r.coord.phase, "ready");
  // e sem pouso: passar direto pela fronteira desvia para a Hero pronta
  const r2 = rig();
  r2.coord.updateRaw(svhFor(10));
  r2.coord.updateRaw(F + V.CONFIG.readyZoneSvh + 20);
  assert.deepEqual(r2.log, ["bypass:passed-intro"]);
  assert.equal(r2.visit.bypassed, true);
});

test("10. cache decodificado não excede o orçamento (pico contado com decodes em andamento)", async () => {
  const r = rig();
  const budget = V.CONFIG.decodedBudgetMiB * 1024 * 1024;
  for (let i = 0; i <= M.finalFrame; i += 3) {
    r.coord.updateRaw(svhFor(i));
    await flush(4);
    r.frame();
  }
  for (let i = M.finalFrame; i >= 0; i -= 7) {
    r.coord.updateRaw(svhFor(i));
    await flush(4);
  }
  await flush();
  const s = r.store.snapshot();
  assert.ok(s.peakDecodedBytes <= budget, `pico ${s.peakDecodedBytes} > ${budget}`);
  assert.ok(s.decodedBytes <= budget);
  assert.ok(s.peakDecoding <= V.CONFIG.maxDecodes);
  assert.ok(s.peakFetching <= V.CONFIG.maxFetches);
  assert.ok(s.evictDecoded > 0 && r.io.closed.length >= s.evictDecoded, "bitmaps descartados com close()");
});

let failed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    console.log("PASS", name);
  } catch (e) {
    failed++;
    console.log("FAIL", name, "\n   ", e.message);
  }
}
console.log(`\n${tests.length - failed}/${tests.length} passaram`);
process.exit(failed ? 1 : 0);
