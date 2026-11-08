// Jornada do Método (Seção 04). Desktop: os cards ganham luz, tilt e spotlight dos cards da 03 (fim do arquivo).
// Celular (08/11/2026, "linha viva"): uma linha SVG orgânica liga os quatro pontos e acende com a rolagem (bloco
// "Celular", abaixo; pintura em css/sections.css, "S04 MOBILE · linha viva"). Substitui o "tubelight-navbar" de antes
// (cada ponto acendia sozinho). Mesma convenção da narrativa da 03 (js/scroll-narrative.js): o estado é função pura da
// posição de rolagem (acende descendo, apaga subindo), a geometria é medida só no refresh (resize, rotação, fontes) e
// nada é medido por quadro; o estilo só é reescrito quando o valor muda.
(() => {
  const list = document.querySelector("#metodo .journey");
  if (!list || !window.gsap || !window.ScrollTrigger) return; // sem GSAP ficam os pontos estáticos de sempre

  const stages = [...list.querySelectorAll(".journey__stage")];
  if (!stages.length) return;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const layoutTop = (el) => {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop; // independe de transform (a entrada do data-reveal)
    return y;
  };

  let vh = window.innerHeight;
  const last = stages.map(() => -1);

  // ---------- Celular (≤ 767px): linha viva (08/11/2026) ----------
  // Uma única linha SVG orgânica liga os centros REAIS dos quatro pontos (o ::before de cada etapa) no corredor à
  // esquerda do texto. A frente de luz fica a 54% da altura da tela: cada trecho se preenche (strokeDashoffset) conforme
  // ela avança entre dois pontos, o ponto alcançado acende (is-vz-active), os anteriores ficam concluídos e os seguintes
  // atenuados; nos últimos 18% de cada trecho o próximo ponto e o texto dele começam a clarear (--vz-s4m-k). Tudo é função
  // da rolagem (desce acende, sobe regride), no mesmo ScrollTrigger sem pin de sempre. A geometria é medida só no
  // refresh, no ResizeObserver do invólucro (quebras reais de texto, fontes) e no pageshow; nunca por quadro.
  // Movimento reduzido: a mesma linha, inteira e estática; textos em opacidade 1.
  const FRONT = 0.54; // frente da linha: 54% da altura visível
  const APPROACH = 0.18; // o próximo ponto e o texto começam a clarear nos últimos 18% do trecho
  const EDGE = 10; // a curva nunca chega a menos de 10px da borda da tela
  const SVGNS = "http://www.w3.org/2000/svg";
  const STATES = ["is-vz-future", "is-vz-active", "is-vz-complete"];

  const layoutLeft = (el) => {
    let x = 0;
    for (let n = el; n; n = n.offsetParent) x += n.offsetLeft;
    return x;
  };

  // curva em S do prompt: sai do ponto na vertical, avança para a esquerda (para o vão da margem, longe do texto) e
  // volta ao ponto seguinte. bend: a amplitude do prompt (até 35px), limitada pela borda da tela
  const sPath = (a, b, width, minX) => {
    const dy = b.y - a.y;
    const bend = Math.max(minX, Math.min(a.x, b.x) - Math.min(35, width * 0.085));
    const q1 = a.y + dy * 0.27;
    const mid = a.y + dy * 0.52;
    const q3 = a.y + dy * 0.76;
    const f = (v) => v.toFixed(2);
    return `M ${f(a.x)} ${f(a.y)} C ${f(a.x)} ${f(q1)}, ${f(bend)} ${f(q1)}, ${f(bend)} ${f(mid)} C ${f(bend)} ${f(q3)}, ${f(b.x)} ${f(q3)}, ${f(b.x)} ${f(b.y)}`;
  };

  const mountLine = (live) => {
    let alive = true;
    list.classList.add("vz-s4m-on");
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "vz-s4m-track");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    // camadas na ordem de pintura: todas as bases, depois os halos, depois os núcleos
    const segs = stages.slice(1).map(() => ({ length: 0, off: "" }));
    ["base", "glow", "core"].forEach((k) => {
      segs.forEach((g) => {
        const p = document.createElementNS(SVGNS, "path");
        p.setAttribute("class", `vz-s4m-segment-${k}`);
        svg.append(p);
        g[k] = p;
      });
    });
    list.prepend(svg); // antes das etapas: o :last-child da última etapa continua valendo

    let docs = [];
    const states = stages.map(() => "");
    const ks = stages.map(() => -1);

    const measure = () => {
      vh = window.innerHeight;
      const width = list.clientWidth;
      const height = list.clientHeight;
      const top = layoutTop(list);
      // centro de cada ponto no invólucro: posição da etapa (offset: independe do transform da entrada) + o ::before
      const dots = stages.map((el) => {
        const b = getComputedStyle(el, "::before");
        return {
          x: el.offsetLeft + parseFloat(b.left) + parseFloat(b.width) / 2,
          y: el.offsetTop + parseFloat(b.top) + parseFloat(b.height) / 2,
        };
      });
      docs = dots.map((d) => top + d.y);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
      const minX = EDGE - layoutLeft(list);
      segs.forEach((g, i) => {
        const d = sPath(dots[i], dots[i + 1], width, minX);
        g.base.setAttribute("d", d);
        g.glow.setAttribute("d", d);
        g.core.setAttribute("d", d);
        g.length = g.core.getTotalLength();
        const dash = `${g.length.toFixed(2)} ${g.length.toFixed(2)}`;
        g.glow.style.strokeDasharray = dash;
        g.core.style.strokeDasharray = dash;
        g.off = "";
      });
    };

    const setState = (i, st) => {
      if (states[i] === st) return;
      states[i] = st;
      stages[i].classList.remove(...STATES);
      stages[i].classList.add(st);
    };

    const render = (y) => {
      if (!docs.length) return;
      if (!live) {
        // movimento reduzido: linha inteira, etapas concluídas (os textos ficam em 1 pelo CSS)
        stages.forEach((_, i) => setState(i, "is-vz-complete"));
        segs.forEach((g) => {
          g.glow.style.strokeDashoffset = "0";
          g.core.style.strokeDashoffset = "0";
        });
        return;
      }
      const front = y + vh * FRONT;
      let active = 0; // na entrada da seção o Diagnóstico já é a etapa atual
      docs.forEach((d, i) => {
        if (front >= d) active = i;
      });
      stages.forEach((el, i) => {
        setState(i, i < active ? "is-vz-complete" : i === active ? "is-vz-active" : "is-vz-future");
        let k = 0;
        if (i === active + 1) {
          const span = docs[i] - docs[i - 1];
          k = smooth(clamp01((front - (docs[i] - span * APPROACH)) / Math.max(1, span * APPROACH)));
        }
        k = Math.round(k * 1000) / 1000;
        if (k === ks[i]) return;
        ks[i] = k;
        el.style.setProperty("--vz-s4m-k", k);
      });
      segs.forEach((g, i) => {
        const t = clamp01((front - docs[i]) / Math.max(1, docs[i + 1] - docs[i]));
        const off = (g.length * (1 - t)).toFixed(2);
        if (off === g.off) return;
        g.off = off;
        g.glow.style.strokeDashoffset = off;
        g.core.style.strokeDashoffset = off;
      });
    };

    const remeasure = () => {
      if (!alive) return;
      measure();
      render(window.scrollY);
    };
    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);
    const trigger = live
      ? ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => render(self.scroll()),
          onRefresh: (self) => render(self.scroll()),
        })
      : null;
    render(window.scrollY);

    // quebras reais de texto (fontes, zoom de texto, rotação): mede de novo, uma vez por quadro no máximo
    let queued = 0;
    const ro = new ResizeObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        remeasure();
      });
    });
    ro.observe(list);
    window.addEventListener("pageshow", remeasure);
    document.fonts?.ready.then(remeasure);

    return () => {
      alive = false;
      ScrollTrigger.removeEventListener("refreshInit", measure);
      trigger?.kill();
      ro.disconnect();
      cancelAnimationFrame(queued);
      window.removeEventListener("pageshow", remeasure);
      svg.remove();
      list.classList.remove("vz-s4m-on");
      stages.forEach((el) => {
        el.classList.remove(...STATES);
        el.style.removeProperty("--vz-s4m-k");
      });
    };
  };

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference) and (max-width: 767.98px)", () => mountLine(true));
  gsap.matchMedia().add("(prefers-reduced-motion: reduce) and (max-width: 767.98px)", () => mountLine(false));

  // ---------- Desktop (≥ 1024px): os cards ganham os efeitos dos cards da 03 ----------
  // Luz e contorno acendem quando o card entra na tela (o topo de 88% a 62% da altura; a 03 acende no começo do
  // percurso do card) e apagam ao subir. Tilt "gravitate" + spotlight, os mesmos valores do bindTilt de
  // js/scroll-narrative.js: 18°, escala 1,05, perspectiva 1200px; no toque, inclina ao encostar e volta ao soltar.
  const CARD_FROM = 0.88;
  const CARD_TO = 0.62;
  const TILT = { limit: 18, scale: 1.05, perspective: 1200 };
  const TILT_REST = `perspective(${TILT.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

  const bindTilt = (card) => {
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const xRot = (py - 0.5) * (TILT.limit * 2);
      const yRot = (px - 0.5) * -(TILT.limit * 2);
      card.style.transform = `perspective(${TILT.perspective}px) rotateX(${xRot.toFixed(2)}deg) rotateY(${yRot.toFixed(2)}deg) scale3d(${TILT.scale}, ${TILT.scale}, ${TILT.scale})`;
      card.style.setProperty("--sx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--sy", `${(py * 100).toFixed(1)}%`);
    };
    const enter = () => card.classList.add("is-tilting");
    const leave = () => {
      card.style.transform = TILT_REST;
      card.classList.remove("is-tilting");
    };
    const press = (e) => {
      enter();
      move(e);
    };
    const release = (e) => e.pointerType !== "mouse" && leave();
    const events = [
      ["pointerenter", enter],
      ["pointerdown", press],
      ["pointermove", move],
      ["pointerup", release],
      ["pointerleave", leave],
      ["pointercancel", leave],
    ];
    events.forEach(([type, fn]) => card.addEventListener(type, fn));
    return () => {
      events.forEach(([type, fn]) => card.removeEventListener(type, fn));
      card.classList.remove("is-tilting");
      ["transform", "--sx", "--sy"].forEach((prop) => card.style.removeProperty(prop));
    };
  };

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
    let alive = true;
    let cardTops = [];
    const measureCards = () => {
      vh = window.innerHeight;
      cardTops = stages.map((el) => layoutTop(el));
    };
    const renderCards = (y) => {
      stages.forEach((el, i) => {
        const a = Math.round(smooth(clamp01((vh * CARD_FROM - (cardTops[i] - y)) / (vh * (CARD_FROM - CARD_TO)))) * 1000) / 1000;
        if (a === last[i]) return;
        last[i] = a;
        el.style.setProperty("--a", a);
      });
    };

    list.classList.add("journey--fx");
    measureCards();
    ScrollTrigger.addEventListener("refreshInit", measureCards);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => renderCards(self.scroll()),
      onRefresh: (self) => renderCards(self.scroll()),
    });
    const untilt = stages.map(bindTilt);

    document.fonts?.ready.then(() => {
      if (!alive) return;
      measureCards();
      renderCards(window.scrollY);
    });

    return () => {
      alive = false;
      ScrollTrigger.removeEventListener("refreshInit", measureCards);
      trigger.kill();
      untilt.forEach((fn) => fn());
      list.classList.remove("journey--fx");
      stages.forEach((el, i) => {
        el.style.removeProperty("--a");
        last[i] = -1;
      });
    };
  });
})();
