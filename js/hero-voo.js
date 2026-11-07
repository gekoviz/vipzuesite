// Motor do prólogo desktop da Hero (voo da águia): rolagem → quadro, armazenamento com orçamento, desenho com recibo
// e coordenador de fases com trava de conclusão. Não toca no DOM da página nem no GSAP: js/hero.js liga tudo ao palco.
// Testes de lógica: node tools/test-hero-voo.mjs
(function (global) {
  "use strict";

  const MiB = 1024 * 1024;

  // Valores de partida da calibração (prompt V2 §16); as distâncias finais estão registradas em
  // docs/hero-video-relatorio.md. legacySvh é a Visão já existente (não muda aqui).
  const CONFIG = {
    flightSvh: 160,
    readyZoneSvh: 40,
    decodedBudgetMiB: 128,
    compressedBudgetMiB: 32,
    maxFetches: 4,
    maxDecodes: 2,
    criticalTimeoutMs: 5000,
    requestedFrameTimeoutMs: 1200,
    windowBack: 4,
    windowAhead: 12,
    substituteTolerance: 2,
  };

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smoothstep = (a, b, v) => {
    const t = clamp01((v - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  // ---------- Manifesto ----------
  // Aceita o formato estendido ({version, frames:[{url, sourceTime}], firstFrame, finalFrame, alpha, finalAnchor}).
  // Lança erro em qualquer inconsistência: o prólogo não arma com dados duvidosos.
  function validateManifest(m) {
    const fail = (why) => {
      throw new Error(`voo: manifesto inválido (${why})`);
    };
    if (!m || typeof m !== "object") fail("vazio");
    if (!m.version) fail("sem version");
    if (!Number.isInteger(m.width) || !Number.isInteger(m.height) || m.width <= 0 || m.height <= 0) fail("dimensões");
    if (!Array.isArray(m.frames) || m.frames.length < 2) fail("frames");
    const frames = m.frames.map((f, i) => {
      const url = typeof f === "string" ? f : f && f.url;
      if (typeof url !== "string" || !/^assets\/[A-Za-z0-9_./-]+\.webp$/.test(url) || url.includes("..")) fail(`url ${i}`);
      const sourceTime = typeof f === "object" && Number.isFinite(f.sourceTime) ? f.sourceTime : null;
      return { url, sourceTime };
    });
    const n = frames.length;
    const firstFrame = m.firstFrame ?? 0;
    const finalFrame = m.finalFrame ?? n - 1;
    if (!Number.isInteger(firstFrame) || !Number.isInteger(finalFrame) || firstFrame < 0 || finalFrame >= n || finalFrame <= firstFrame)
      fail("firstFrame/finalFrame");
    const a = m.finalAnchor;
    const pt = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y);
    if (!a || !pt(a.leftEye) || !pt(a.rightEye)) fail("finalAnchor");
    return { version: String(m.version), width: m.width, height: m.height, fps: m.fps, frames, firstFrame, finalFrame, alpha: m.alpha === true, finalAnchor: a };
  }

  // Progresso do voo (0–1) → índice do quadro. Linear, inteiro, sempre dentro do manifesto.
  function frameMap(p, m) {
    const span = m.finalFrame - m.firstFrame;
    return m.firstFrame + Math.round(clamp01(Number.isFinite(p) ? p : 0) * span);
  }

  // ---------- Armazenamento dos quadros ----------
  // Estados separados: baixar não é decodificar. Só um quadro DECODED é desenhável.
  const S = { NONE: 0, FETCHING: 1, DOWNLOADED: 2, DECODING: 3, DECODED: 4, FAILED: 5 };
  const STATE_NAME = ["queued", "fetching", "downloaded", "decoding", "decoded", "failed"];

  function defaultDecode(blob) {
    if (typeof global.createImageBitmap === "function") return global.createImageBitmap(blob);
    // Sem createImageBitmap: <img> + decode() (o bitmap só conta como pronto depois da decodificação)
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      const done = (ok, v) => {
        URL.revokeObjectURL(url);
        ok ? resolve(v) : reject(v);
      };
      img.onload = () => (img.decode ? img.decode() : Promise.resolve()).then(() => {
        img.close = () => {};
        done(true, img);
      }, (e) => done(false, e));
      img.onerror = () => done(false, new Error("voo: decode"));
      img.src = url;
    });
  }

  function createFrameStore(o) {
    const m = o.manifest;
    const c = o.config || CONFIG;
    const fetchImpl = o.fetchImpl || ((u, opt) => global.fetch(u, opt));
    const decodeImpl = o.decodeImpl || defaultDecode;
    const n = m.frames.length;
    const frameBytes = m.width * m.height * 4;
    const budgetDecoded = c.decodedBudgetMiB * MiB;
    const budgetCompressed = c.compressedBudgetMiB * MiB;
    const state = new Uint8Array(n);
    const tries = new Uint8Array(n);
    const blobs = new Map(); // i → { blob, used }
    const bmps = new Map(); // i → { bmp, used }
    const ctrls = new Map(); // i → AbortController
    const prot = new Set([m.firstFrame, m.finalFrame]);
    const onDecoded = [];
    const onFailed = [];
    const stats = { fetches: 0, decodes: 0, aborts: 0, evictDecoded: 0, evictCompressed: 0, peakDecodedBytes: 0, peakDecoding: 0, peakFetching: 0, failed: 0 };
    let blobBytes = 0;
    let fetching = 0;
    let decoding = 0;
    let tick = 0;
    let target = m.firstFrame;
    let dir = 1;
    let speculative = true;
    let alive = true;

    // janela na direção do movimento: alvo, 12 à frente, 4 atrás (invertida ao mudar o sentido)
    function windowList() {
      const out = [target];
      const max = Math.max(c.windowAhead, c.windowBack);
      for (let d = 1; d <= max; d++) {
        if (d <= c.windowAhead) out.push(target + dir * d);
        if (d <= c.windowBack) out.push(target - dir * d);
      }
      return out.filter((i) => i >= 0 && i < n);
    }
    // prioridade: o quadro pedido agora, depois os protegidos (primeiro e último), depois a janela
    function wanted() {
      if (!speculative) return [];
      const list = [target];
      for (const i of prot) if (i !== target) list.push(i);
      for (const i of windowList()) if (!list.includes(i)) list.push(i);
      return list;
    }

    function fetchFrame(i) {
      state[i] = S.FETCHING;
      fetching++;
      stats.fetches++;
      stats.peakFetching = Math.max(stats.peakFetching, fetching);
      const ac = typeof AbortController === "function" ? new AbortController() : null;
      ctrls.set(i, ac);
      Promise.resolve()
        .then(() => fetchImpl(m.frames[i].url, ac ? { signal: ac.signal } : undefined))
        .then((r) => {
          if (!r.ok) throw new Error(`voo: quadro ${i} HTTP ${r.status}`);
          return r.blob();
        })
        .then((blob) => {
          if (!alive) return;
          blobs.set(i, { blob, used: ++tick });
          blobBytes += blob.size || 0;
          state[i] = S.DOWNLOADED;
        })
        .catch((err) => {
          if (!alive) return;
          if (err && err.name === "AbortError") {
            state[i] = S.NONE;
            stats.aborts++;
            return;
          }
          markFailure(i, err);
        })
        .finally(() => {
          fetching--;
          ctrls.delete(i);
          if (alive) pump();
        });
    }

    function markFailure(i, err) {
      tries[i]++;
      if (tries[i] < 2) {
        state[i] = blobs.has(i) ? S.DOWNLOADED : S.NONE; // uma nova tentativa
        return;
      }
      state[i] = S.FAILED;
      stats.failed++;
      onFailed.forEach((f) => f(i, err));
    }

    function decodedBytes() {
      return (bmps.size + decoding) * frameBytes;
    }

    function decode(i) {
      if (decodedBytes() + frameBytes > budgetDecoded) {
        evictDecoded(new Set(wanted()), frameBytes);
        if (decodedBytes() + frameBytes > budgetDecoded) return false; // sem espaço agora: espera
      }
      const e = blobs.get(i);
      e.used = ++tick;
      state[i] = S.DECODING;
      decoding++;
      stats.peakDecoding = Math.max(stats.peakDecoding, decoding);
      Promise.resolve()
        .then(() => decodeImpl(e.blob))
        .then((bmp) => {
          if (!alive || (!speculative && !keep.has(i))) {
            bmp.close?.();
            if (alive) state[i] = blobs.has(i) ? S.DOWNLOADED : S.NONE;
            return;
          }
          bmps.set(i, { bmp, used: ++tick });
          state[i] = S.DECODED;
          stats.decodes++;
          stats.peakDecodedBytes = Math.max(stats.peakDecodedBytes, bmps.size * frameBytes);
          onDecoded.forEach((f) => f(i));
        })
        .catch((err) => {
          if (alive) markFailure(i, err);
        })
        .finally(() => {
          decoding--;
          if (alive) pump();
        });
      return true;
    }

    // LRU por bytes; nunca descarta o que está na lista de interesse nem os protegidos
    function evictDecoded(inList, extra = 0) {
      while (bmps.size && decodedBytes() + extra > budgetDecoded) {
        let victim = -1;
        let oldest = Infinity;
        for (const [i, e] of bmps) if (!inList.has(i) && !prot.has(i) && e.used < oldest) (oldest = e.used), (victim = i);
        if (victim < 0) return;
        dropBitmap(victim);
        stats.evictDecoded++;
      }
    }
    function evictCompressed(inList) {
      while (blobBytes > budgetCompressed) {
        let victim = -1;
        let oldest = Infinity;
        for (const [i, e] of blobs) if (!inList.has(i) && !prot.has(i) && state[i] !== S.DECODING && e.used < oldest) (oldest = e.used), (victim = i);
        if (victim < 0) return;
        blobBytes -= blobs.get(victim).blob.size || 0;
        blobs.delete(victim);
        if (state[victim] === S.DOWNLOADED) state[victim] = S.NONE;
        stats.evictCompressed++;
      }
    }
    function dropBitmap(i) {
      const e = bmps.get(i);
      if (!e) return;
      e.bmp.close?.();
      bmps.delete(i);
      state[i] = blobs.has(i) ? S.DOWNLOADED : S.NONE;
    }

    function pump() {
      if (!alive) return;
      const list = wanted();
      const inList = new Set(list);
      // pedidos longe demais do alvo (ou depois da conclusão) são cancelados; perto dele, seguem
      for (const [i, ac] of ctrls) {
        if (!ac || inList.has(i)) continue;
        if (!speculative || Math.abs(i - target) > c.windowAhead + 8) ac.abort();
      }
      for (const i of list) {
        if (decoding >= c.maxDecodes) break;
        if (state[i] === S.DOWNLOADED && !decode(i)) break;
      }
      for (const i of list) {
        if (fetching >= c.maxFetches) break;
        if (state[i] === S.NONE) fetchFrame(i);
      }
      evictDecoded(inList);
      evictCompressed(inList);
    }

    let keep = new Set();

    const api = {
      n,
      frameBytes,
      setTarget(i) {
        if (!alive) return;
        i = Math.max(0, Math.min(n - 1, i | 0));
        if (i !== target) {
          dir = i > target ? 1 : -1;
          target = i;
        }
        pump();
      },
      has: (i) => bmps.has(i),
      get(i) {
        const e = bmps.get(i);
        if (!e) return null;
        e.used = ++tick;
        return e.bmp;
      },
      isFailed: (i) => state[i] === S.FAILED,
      state: (i) => STATE_NAME[state[i]],
      // Primeiro e último quadros decodificados (ou falha / tempo esgotado). O relógio é só proteção.
      critical(timeoutMs) {
        return new Promise((resolve, reject) => {
          const ready = () => [...prot].every((i) => bmps.has(i));
          if (ready()) return resolve();
          const timer = setTimeout(() => finish(new Error("voo: tempo esgotado")), timeoutMs);
          const onDec = () => ready() && finish();
          const onFail = (i, err) => prot.has(i) && finish(err || new Error(`voo: quadro ${i}`));
          function finish(err) {
            clearTimeout(timer);
            onDecoded.splice(onDecoded.indexOf(onDec), 1);
            onFailed.splice(onFailed.indexOf(onFail), 1);
            err ? reject(err) : resolve();
          }
          onDecoded.push(onDec);
          onFailed.push(onFail);
          pump();
        });
      },
      onDecoded: (f) => onDecoded.push(f),
      onFailed: (f) => onFailed.push(f),
      // Depois da conclusão: nada novo é pedido; só `keepIdx` continua guardado (o quadro na tela)
      stopSpeculative(keepIdx = []) {
        speculative = false;
        keep = new Set(keepIdx);
        for (const ac of ctrls.values()) ac?.abort();
        for (const i of [...bmps.keys()]) if (!keep.has(i)) dropBitmap(i);
        blobs.clear();
        blobBytes = 0;
        for (let i = 0; i < n; i++) if (state[i] === S.DOWNLOADED) state[i] = S.NONE;
      },
      releaseAll() {
        keep = new Set();
        for (const i of [...bmps.keys()]) dropBitmap(i);
      },
      dispose() {
        if (!alive) return;
        alive = false;
        for (const ac of ctrls.values()) ac?.abort();
        for (const e of bmps.values()) e.bmp.close?.();
        bmps.clear();
        blobs.clear();
        blobBytes = 0;
        onDecoded.length = onFailed.length = 0;
      },
      get alive() {
        return alive;
      },
      snapshot() {
        const counts = {};
        for (let i = 0; i < n; i++) counts[STATE_NAME[state[i]]] = (counts[STATE_NAME[state[i]]] || 0) + 1;
        return { target, dir, speculative, fetching, decoding, decoded: bmps.size, decodedBytes: bmps.size * frameBytes, compressedBytes: blobBytes, counts, ...stats };
      },
    };
    return api;
  }

  // ---------- Desenho ----------
  // Recebe quadro decodificado e geometria; não busca arquivos nem decide fase. Devolve um recibo: só `exact`
  // (o índice pedido, na geometria atual) vale como apresentação do quadro pedido.
  function createRenderer({ ctx, frame }) {
    let rev = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let lastKey = "";
    let lastIdx = null;
    let lastRev = -1;
    const timings = [];

    const strip = (k, x0, y0, x1, y1, rx, ry, rw, rh) => {
      if (rw <= 0 || rh <= 0 || k <= 0) return;
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, `rgba(0,0,0,${k})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(rx, ry, rw, rh);
    };

    function draw(bmp, M) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      const dw = frame.w * M.s;
      const dh = frame.h * M.s;
      ctx.drawImage(bmp, M.x, M.y, dw, dh);
      // Máscara específica do pouso (só quando M.mask > 0): o quadro do vídeo corta a cabeça no topo, o ombro à
      // direita e o peito embaixo; essas três bordas ficam dentro da tela no enquadramento final.
      const k = M.mask || 0;
      if (k > 0) {
        ctx.globalCompositeOperation = "destination-out";
        const L = Math.max(0, M.x);
        const R = Math.min(w, M.x + dw);
        const T = Math.max(0, M.y);
        const B = Math.min(h, M.y + dh);
        const fr = dw * 0.1;
        const ft = dh * 0.04;
        const fb = dh * 0.22;
        strip(k, R, 0, R - fr, 0, R - fr, T, fr, B - T);
        strip(k, 0, T, 0, T + ft, L, T, R - L, ft);
        strip(k, 0, B, 0, B - fb, L, B - fb, R - L, fb);
        ctx.globalCompositeOperation = "source-over";
      }
    }

    function receipt(req, drawn, exact, didDraw) {
      return { requestedIndex: req, drawnIndex: drawn, exact, geometryRevision: rev, didDraw };
    }

    return {
      // Mudar o tamanho do canvas apaga os pixels: nova revisão, o próximo pedido redesenha mesmo no mesmo quadro
      resize(cw, ch, cdpr) {
        w = cw;
        h = ch;
        dpr = cdpr;
        rev++;
        lastKey = "";
      },
      get revision() {
        return rev;
      },
      invalidate() {
        lastKey = "";
      },
      tryDraw(req, store, M, tol = CONFIG.substituteTolerance) {
        let idx = store.has(req) ? req : null;
        if (idx === null) {
          // substituto só na vizinhança imediata (±tol), preferindo o lado do quadro que já está na tela
          const side = lastIdx !== null && lastIdx > req ? 1 : -1;
          for (let d = 1; d <= tol && idx === null; d++) {
            if (store.has(req + side * d)) idx = req + side * d;
            else if (store.has(req - side * d)) idx = req - side * d;
          }
        }
        const onScreen = lastRev === rev ? lastIdx : null;
        if (idx === null) return receipt(req, onScreen, false, false);
        const key = `${idx}|${rev}|${M.key}`;
        if (key === lastKey) return receipt(req, idx, idx === req, false);
        const t0 = typeof performance !== "undefined" ? performance.now() : 0;
        draw(store.get(idx), M);
        if (t0) timings.push(performance.now() - t0);
        if (timings.length > 600) timings.shift();
        lastKey = key;
        lastIdx = idx;
        lastRev = rev;
        return receipt(req, idx, idx === req, true);
      },
      clear() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w * dpr, h * dpr);
        lastKey = "";
        lastIdx = null;
      },
      timings,
    };
  }

  // ---------- Coordenador ----------
  // Fases: scrubbing → finalizing → revealing → ready (ou fallback). `visit` (completed/bypassed) vive fora da
  // instância: nem rolagem reversa, nem resize, nem troca de breakpoint o rearma.
  function createCoordinator(o) {
    const { config: c = CONFIG, manifest: m, store, renderer, visit, hooks, schedule } = o;
    const now = o.now || (() => Date.now());
    const legacyOffset = c.flightSvh + c.readyZoneSvh;
    let phase = "scrubbing";
    let alive = true;
    let raw = 0;
    let requested = m.firstFrame;
    let missSince = 0;
    let missTimer = null;
    const stats = { misses: 0, substitutes: 0, draws: 0 };
    let last = null;

    const setPhase = (p) => {
      phase = p;
      hooks.onPhase?.(p);
    };
    const clearMiss = () => {
      missSince = 0;
      if (missTimer) clearTimeout(missTimer);
      missTimer = null;
    };
    const done = () => !alive || visit.completed || visit.bypassed;

    function updateRaw(d) {
      if (!alive) return;
      raw = d;
      if (visit.completed || visit.bypassed) {
        // depois do pouso: nenhum quadro do voo é pedido. Na fronteira da Visão a entrada pendente termina já.
        if (d >= legacyOffset && phase === "revealing") finishReveal();
        return;
      }
      if (d >= legacyOffset) return bypassToReady("passed-intro");
      requested = frameMap(d / c.flightSvh, m);
      const atEnd = requested === m.finalFrame && d >= c.flightSvh;
      if (phase === "finalizing" && !atEnd) setPhase("scrubbing");
      else if (phase === "scrubbing" && atEnd) setPhase("finalizing");
      store.setTarget(requested);
      schedule();
    }

    function armMiss() {
      if (missTimer) return;
      missTimer = setTimeout(() => {
        missTimer = null;
        if (done() || !missSince) return;
        const waited = now() - missSince;
        if (waited >= c.criticalTimeoutMs) return fail("frame-stall");
        stats.misses++;
        armMiss();
        schedule();
      }, c.requestedFrameTimeoutMs);
    }

    function renderCurrentTarget() {
      if (done()) return null;
      const r = renderer.tryDraw(requested, store, hooks.matrixAt(raw), c.substituteTolerance);
      last = r;
      if (r.didDraw) stats.draws++;
      if (r.didDraw && !r.exact) stats.substitutes++;
      if (r.exact) clearMiss();
      else {
        if (!missSince) missSince = now();
        armMiss();
        // pedido impossível (falhou duas vezes e não há vizinho): resultado funcional, sem pular para outra pose
        if (r.drawnIndex === null || Math.abs(r.drawnIndex - requested) > c.substituteTolerance) {
          if (store.isFailed(requested)) fail("frame-failed");
        }
      }
      hooks.diag?.({ raw, requested, receipt: r });
      if (r.exact && requested === m.finalFrame && raw >= c.flightSvh) commit();
      return r;
    }

    function commit() {
      if (done()) return;
      visit.completed = true;
      clearMiss();
      setPhase("revealing");
      hooks.onCommit();
    }
    function finishReveal() {
      hooks.finishEntrance();
      setPhase("ready");
    }
    function bypassToReady(reason) {
      if (!alive) return;
      if (visit.completed || visit.bypassed) {
        if (phase === "revealing") finishReveal();
        return;
      }
      visit.bypassed = true;
      clearMiss();
      setPhase("ready");
      hooks.onBypass(reason);
    }
    function fail(reason) {
      if (done()) return;
      visit.bypassed = true; // não é sucesso: só impede repetir o voo nesta visita
      clearMiss();
      setPhase("fallback");
      hooks.onFallback(reason);
    }

    return {
      updateRaw,
      renderCurrentTarget,
      bypassToReady,
      fail,
      entranceComplete() {
        if (alive && phase === "revealing") setPhase("ready");
      },
      dispose() {
        alive = false;
        clearMiss();
        phase = "disposed";
      },
      get phase() {
        return phase;
      },
      get requested() {
        return requested;
      },
      get raw() {
        return raw;
      },
      get alive() {
        return alive;
      },
      snapshot: () => ({ phase, raw, requested, last, ...stats, legacyOffset }),
    };
  }

  global.VZVoo = { CONFIG, validateManifest, frameMap, createFrameStore, createRenderer, createCoordinator, smoothstep, clamp01 };
})(typeof window !== "undefined" ? window : globalThis);
