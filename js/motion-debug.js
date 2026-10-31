// Diagnóstico dos efeitos de movimento, só com ?motiondebug na URL (sem o parâmetro, não faz nada).
// Mostra no console e num painel no canto da tela: tamanho da janela, zoom, as condições que ligam cada efeito,
// as classes do <html>, os ScrollTriggers, se o GSAP carregou e quais arquivos falharam.
(() => {
  if (!/[?&]motiondebug\b/.test(location.search)) return;

  const Q = {
    "movimento permitido": "(prefers-reduced-motion: no-preference)",
    "altura ≥ 560": "(min-height: 560px)",
    "largura ≥ 1024": "(min-width: 1024px)",
    "Hero/Visão (STORY_QUERY)":
      "(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 560px), " +
      "(prefers-reduced-motion: no-preference) and (max-width: 767px) and (min-height: 700px)",
    "Seção 03 desktop": "(prefers-reduced-motion: no-preference) and (min-height: 560px) and (min-width: 1024px)",
  };

  const panel = document.createElement("pre");
  panel.setAttribute("aria-hidden", "true");
  panel.style.cssText =
    "position:fixed;right:8px;bottom:8px;z-index:99999;max-width:min(440px,calc(100vw - 16px));max-height:70vh;overflow:auto;" +
    "margin:0;padding:10px 12px;font:12px/1.45 ui-monospace,Consolas,monospace;white-space:pre-wrap;" +
    "color:#F3EDE3;background:rgba(20,18,16,.92);border:1px solid #C3A881;border-radius:8px;pointer-events:auto";

  function report(when) {
    const yes = (b) => (b ? "SIM" : "NÃO");
    const failed = (window.__vzResErrors || []).slice();
    for (const r of performance.getEntriesByType("resource")) {
      if (r.responseStatus >= 400 && !failed.includes(r.name)) failed.push(r.name + " (" + r.responseStatus + ")");
    }
    const ST = window.ScrollTrigger;
    const triggers = ST ? ST.getAll() : [];
    const vv = window.visualViewport;
    const data = {
      quando: when,
      janela: innerWidth + " × " + innerHeight,
      devicePixelRatio: devicePixelRatio,
      "zoom (visualViewport.scale)": vv ? vv.scale : "—",
      condições: Object.fromEntries(Object.entries(Q).map(([k, q]) => [k, yes(matchMedia(q).matches)])),
      "classes do <html>": document.documentElement.className || "(nenhuma)",
      gsap: typeof window.gsap,
      ScrollTrigger: typeof ST,
      CustomEase: typeof window.CustomEase,
      __vzS03Ready: !!window.__vzS03Ready,
      __vzRevealReady: !!window.__vzRevealReady,
      ScrollTriggers: triggers.length,
      gatilhos: triggers.map((t) => {
        const el = t.trigger;
        const name = el ? el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : "") : "?";
        return name + "  " + Math.round(t.start) + " → " + Math.round(t.end);
      }),
      "arquivos que falharam": failed.length ? failed : "nenhum",
    };
    console.log("[motiondebug]", data);
    panel.textContent = "motiondebug\n" + JSON.stringify(data, null, 2);
  }

  addEventListener("load", () => {
    document.body.appendChild(panel);
    // espera os scripts criarem os gatilhos
    setTimeout(() => report("load"), 600);
  });
  let timer = 0;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => report("resize"), 400);
  });
})();
