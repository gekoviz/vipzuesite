// Seções 02–08: destinos de contato, FAQ (accordion) e entradas simples.
(() => {
  const root = document.documentElement;
  const cfg = window.VIPZUE_CONFIG || {};

  // ---------- Destinos reais (js/config.js). Sem destino, nada simula um link funcional. ----------
  const wa = cfg.whatsapp || {};
  const waUrl = wa.number
    ? `https://wa.me/${wa.number}${wa.message ? `?text=${encodeURIComponent(wa.message)}` : ""}`
    : "";

  document.querySelectorAll('[data-cta="whatsapp"]').forEach((el) => {
    if (waUrl) {
      el.href = waUrl;
      el.target = "_blank";
      el.rel = "noopener";
      el.removeAttribute("aria-disabled");
    } else if (el.hasAttribute("data-cta-final")) {
      // CTA final sem número real: estado indisponível (UI.08), não clicável
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
    }
    // CTAs da Hero e do menu sem número continuam levando à seção de contato (#contato)
  });

  const links = { instagram: cfg.instagram, whatsapp: waUrl, privacy: cfg.privacy, terms: cfg.terms };
  document.querySelectorAll("[data-link]").forEach((el) => {
    const url = links[el.dataset.link];
    if (url) {
      el.href = url;
      if (/^https?:/.test(url)) {
        el.target = "_blank";
        el.rel = "noopener";
      }
    } else {
      el.classList.add("is-pending");
      // Ícone sem destino não deve parecer um controle: sem href não recebe foco nem clique
      if (el.classList.contains("social-link")) el.setAttribute("aria-hidden", "true");
    }
  });

  // ---------- FAQ (07) · V5.0 (08/11/2026) ----------
  // Accordion: o de antes (botão + região, aria-expanded, setas/Home/End, um item aberto por vez = type="single" collapsible).
  // Entrada: prompt V5.0, comportamento do 21st.dev "frequently-asked-questions-with-accordion" (ScrollX UI), com o GSAP que
  // a página já carrega. UMA timeline e UM ScrollTrigger no root (start "top 82%"): as duas palavras do título (opacidade,
  // 12px e desfoque de 6px; 0,40s, +0,08s, power2.inOut) e, a 0,36s, as cinco perguntas em cascata (opacidade e 10px;
  // 0,35s, +0,07s, power2.out). Roda uma vez e não é presa à rolagem: parou de rolar, ela termina sozinha.
  // Os estados escondidos só entram DEPOIS que o gatilho existe; sem GSAP, com movimento reduzido ou se algo falhar, tudo
  // fica visível. Usa opacidade (não visibility): as perguntas continuam alcançáveis pelo Tab, e o foco termina a entrada.
  // Ao terminar, os estilos inline saem (nenhuma opacidade, transform ou filtro residual) e o gatilho é desfeito.
  const faq = document.getElementById("faq");
  if (faq) {
    const list = faq.querySelector("[data-accordion]");
    const items = list ? [...list.querySelectorAll(".accordion__item")] : [];
    // 1) accordion: um item aberto por vez; sem JS todas as respostas ficam visíveis (o CSS só fecha com data-ready)
    try {
      const setItem = (item, open) => {
        item.dataset.state = open ? "open" : "closed";
        item.querySelector(".accordion__trigger").setAttribute("aria-expanded", String(open));
      };
      const triggers = items.map((item) => item.querySelector(".accordion__trigger"));
      items.forEach((item, i) => {
        setItem(item, false);
        const btn = triggers[i];
        btn.addEventListener("click", () => {
          const open = item.dataset.state === "open";
          items.forEach((other) => setItem(other, other === item ? !open : false));
        });
        btn.addEventListener("keydown", (e) => {
          const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: triggers.length - 1 }[e.key];
          if (go === undefined) return;
          e.preventDefault();
          triggers[(go + triggers.length) % triggers.length].focus();
        });
      });
      if (list) list.dataset.ready = "";
    } catch (err) {
      // nunca deixar respostas presas fechadas se algo falhar
      if (list) list.removeAttribute("data-ready");
    }

    // 2) entrada
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    const words = [...faq.querySelectorAll(".vz-faq__title-word")];
    const still = !window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const passed = faq.getBoundingClientRect().bottom <= 0; // recarga já abaixo da FAQ: nada a revelar
    if (gsap && ST && !still && !passed && words.length === 2 && items.length === 5) {
      const targets = [...words, ...items];
      let tl = null;
      let st = null;
      const finish = () => {
        if (tl && tl.progress() < 1) tl.progress(1);
      };
      try {
        tl = gsap.timeline({
          paused: true,
          defaults: { overwrite: "auto" },
          onComplete: () => {
            gsap.set(targets, { clearProps: "opacity,transform,filter" });
            faq.removeEventListener("focusin", finish);
            if (st) st.kill();
          },
        });
        tl.fromTo(words, { opacity: 0, y: 12, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, stagger: 0.08, ease: "power2.inOut", immediateRender: false }, 0);
        tl.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: "power2.out", immediateRender: false }, 0.36);
        st = ST.create({
          trigger: faq,
          start: "top 82%",
          refreshPriority: -1, // depois dos palcos que vêm antes na página
          onEnter: () => tl.play(),
          onLeave: finish, // passou direto (salto, âncora, recarga lá embaixo): termina na hora
          onEnterBack: finish,
        });
        // só agora o estado inicial (se o gatilho já disparou, a timeline já está no começo e isto é o mesmo estado)
        if (tl.progress() === 0) {
          gsap.set(words, { opacity: 0, y: 12, filter: "blur(6px)" });
          gsap.set(items, { opacity: 0, y: 10 });
        }
        faq.addEventListener("focusin", finish);
      } catch (err) {
        if (st) st.kill();
        if (tl) tl.kill();
        gsap.set(targets, { clearProps: "opacity,transform,filter" });
      }
    }
  }

  // ---------- Entradas simples (opacity + 16px), escalonadas por grupo ----------
  if (!root.classList.contains("js-reveal")) return;
  const items = [...document.querySelectorAll("[data-reveal]")];
  if (!("IntersectionObserver" in window)) {
    root.classList.remove("js-reveal");
    return;
  }

  // Irmãos revelados juntos entram em sequência curta (80ms), sem coreografia repetida
  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const index = groups.get(parent) || 0;
    groups.set(parent, index + 1);
    el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 80}ms`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
  window.__vzRevealReady = true;
})();
