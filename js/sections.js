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

  // ---------- FAQ: accordion acessível (botão + região, aria-expanded) ----------
  document.querySelectorAll("[data-accordion]").forEach((acc) => {
    const triggers = [...acc.querySelectorAll(".accordion__trigger")];
    triggers.forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      panel.hidden = btn.getAttribute("aria-expanded") !== "true"; // sem JS, todas as respostas ficam visíveis
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
      // Setas, Home e End entre as perguntas
      btn.addEventListener("keydown", (e) => {
        const i = triggers.indexOf(btn);
        const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: triggers.length - 1 }[e.key];
        if (go === undefined) return;
        e.preventDefault();
        triggers[(go + triggers.length) % triggers.length].focus();
      });
    });
  });

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
