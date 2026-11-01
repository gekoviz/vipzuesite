// Jornada do Método (Seção 04), celular: cada ponto acende com a rolagem. Porte sem React do "tubelight-navbar" (21st.dev):
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
})();
