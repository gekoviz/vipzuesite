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

  // ---------- FAQ (07) · V1.0 (15/11/2026) ----------
  // Accordion: o de antes (botão + região, aria-expanded, setas/Home/End, um item aberto por vez = type="single" collapsible,
  // comportamento intencional da FAQ aprovada, preservado).
  // Entrada: porte sem React do FaqTitle/FaqCard (Hirael/21st.dev, Motion "whileInView", once). Título: cada palavra de
  // opacidade 0 e +16 px a 1 e 0, 0,50 s easeOut, atraso 0,20 s + 0,08 s por palavra. Barras: opacidade 0 e +20 px, 0,45 s
  // easeOut, atraso índice × 0,10 s. Cada elemento é observado sozinho (IntersectionObserver) e revela quando ELE entra na
  // tela, uma vez; as transições são CSS (css/sections.css, "07 — FAQ final · V1.0"), só opacidade e transform.
  // O estado escondido (is-rv) só entra depois que o observador existe; sem IntersectionObserver, com movimento reduzido ou
  // se algo falhar, tudo fica visível. As barras continuam clicáveis e alcançáveis pelo Tab; o foco revela tudo na hora.
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
    const words = [...faq.querySelectorAll(".vz-faq__title-word")];
    const title = faq.querySelector(".vz-faq__title");
    const still = !window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const passed = faq.getBoundingClientRect().bottom <= 0; // recarga já abaixo da FAQ: nada a revelar
    if ("IntersectionObserver" in window && !still && !passed && title && words.length && items.length) {
      const targets = [...words, ...items];
      const clean = (el) => {
        el.classList.remove("is-rv", "is-in");
        el.style.removeProperty("--rv-d");
      };
      const reveal = (el, delay) => {
        if (!el.classList.contains("is-rv") || el.classList.contains("is-in")) return;
        el.style.setProperty("--rv-d", delay + "s");
        el.classList.add("is-in");
        // terminou a entrada: sai o estado (nenhuma opacidade ou transform residual)
        const done = (e) => {
          if (e.target !== el || e.propertyName !== "opacity") return;
          el.removeEventListener("transitionend", done);
          clean(el);
        };
        el.addEventListener("transitionend", done);
        setTimeout(() => clean(el), (delay + 0.6) * 1000 + 200); // garantia se o transitionend não vier
      };
      let io = null;
      const finishAll = () => {
        if (io) io.disconnect();
        targets.forEach(clean);
        faq.removeEventListener("focusin", finishAll);
      };
      try {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              io.unobserve(en.target);
              if (en.target === title) words.forEach((w, i) => reveal(w, 0.2 + i * 0.08));
              else reveal(en.target, items.indexOf(en.target) * 0.1);
            });
          },
          { rootMargin: "0px 0px -6% 0px", threshold: 0 }
        );
        targets.forEach((el) => el.classList.add("is-rv"));
        io.observe(title);
        items.forEach((item) => io.observe(item));
        faq.addEventListener("focusin", finishAll);
      } catch (err) {
        finishAll();
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
