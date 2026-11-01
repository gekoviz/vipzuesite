// Jornada do Método (Seção 04). Desktop: os cards ganham luz, tilt e spotlight dos cards da 03 (fim do arquivo).
// Celular: cada ponto acende com a rolagem. Porte sem React do "tubelight-navbar" (21st.dev):
// a lâmpada acesa vira o ponto preenchido com halo (css/sections.css, .journey--lamp), e a mola do framer-motion vira a
// própria rolagem, suavizada. Mesma convenção da narrativa da 03 (js/scroll-narrative.js): o estado é função pura da
// posição de rolagem (acende descendo, apaga subindo), a geometria é medida só no refresh (resize, rotação, fontes) e
// nada é medido por quadro; o estilo só é reescrito quando o valor muda.
(() => {
  const list = document.querySelector("#metodo .journey");
  if (!list || !window.gsap || !window.ScrollTrigger) return; // sem GSAP ficam os pontos estáticos de sempre

  const stages = [...list.querySelectorAll(".journey__stage")];
  if (!stages.length) return;

  const FROM = 0.82; // o ponto começa a acender quando chega a 82% da altura da tela…
  const TO = 0.58; // …e está aceso (--a = 1) quando chega a 58%
  const DOT = 13; // do topo da etapa ao centro do ponto: top 0,35em (≈ 5,6px) + metade dos 15px

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const layoutTop = (el) => {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop; // independe de transform (a entrada do data-reveal)
    return y;
  };

  let vh = window.innerHeight;
  let tops = [];
  const last = stages.map(() => -1);

  const measure = () => {
    vh = window.innerHeight;
    tops = stages.map((el) => layoutTop(el) + DOT);
  };

  const render = (y) => {
    stages.forEach((el, i) => {
      const a = Math.round(smooth(clamp01((vh * FROM - (tops[i] - y)) / (vh * (FROM - TO)))) * 1000) / 1000;
      if (a === last[i]) return;
      last[i] = a;
      el.style.setProperty("--a", a);
    });
  };

  // celular com movimento permitido (mesmo corte de 767px do CSS e do head); fora disso, ou sem JS, ficam os pontos estáticos
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference) and (max-width: 767.98px)", () => {
    let alive = true;
    list.classList.add("journey--lamp");
    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => render(self.scroll()),
      onRefresh: (self) => render(self.scroll()),
    });

    // fontes web mudam a altura dos textos: mede de novo quando chegam (sem refresh global)
    document.fonts?.ready.then(() => {
      if (!alive) return;
      measure();
      render(window.scrollY);
    });

    return () => {
      alive = false;
      ScrollTrigger.removeEventListener("refreshInit", measure);
      trigger.kill();
      list.classList.remove("journey--lamp");
      stages.forEach((el, i) => {
        el.style.removeProperty("--a");
        last[i] = -1;
      });
    };
  });

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
