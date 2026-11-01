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

  // ---------- FAQ (07): porte do 21st.dev "frequently-asked-questions-with-accordion" ----------
  // Substitui o bloco "FAQ: accordion acessível" que existia aqui. Mantém: botão + região, aria-expanded, setas/Home/End.
  // Muda: um item aberto por vez (type="single" collapsible do original), abertura animada (CSS) e entradas do original.
  const faq = document.getElementById("faq");
  if (faq) {
    const title = faq.querySelector("[data-faq-title]");
    const list = faq.querySelector("[data-accordion]");
    const items = list ? [...list.querySelectorAll(".accordion__item")] : [];
    const reveal = root.classList.contains("js-reveal") && "IntersectionObserver" in window;
    try {
      // 1) título em palavras, a partir do texto que já está no HTML (a copy continua numa fonte só); só se houver entrada animada
      if (title && reveal) {
        const words = title.textContent.trim().split(/\s+/);
        title.textContent = "";
        words.forEach((word, i) => {
          if (i) title.append(" "); // espaço real entre as palavras: leitores de tela leem a frase inteira
          const span = document.createElement("span");
          span.className = "faq__word";
          span.style.setProperty("--w", String(i));
          span.textContent = word;
          title.append(span);
        });
      }
      // 2) accordion: um item aberto por vez; sem JS todas as respostas ficam visíveis (o CSS só fecha com data-ready)
      const setItem = (item, open) => {
        item.dataset.state = open ? "open" : "closed";
        item.querySelector(".accordion__trigger").setAttribute("aria-expanded", String(open));
      };
      const triggers = items.map((item) => item.querySelector(".accordion__trigger"));
      items.forEach((item, i) => {
        item.style.setProperty("--i", String(i));
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
      // 3) entradas: uma vez, quando o título e a lista aparecem
      const once = (el, cls) => {
        if (!el) return;
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            faq.classList.add(cls);
            io.disconnect();
          },
          { threshold: 0.15 }
        );
        io.observe(el);
      };
      if (reveal) {
        once(title, "is-title-in");
        once(list, "is-list-in");
      }
    } catch (err) {
      // nunca deixar a FAQ escondida se algo falhar
      faq.classList.add("is-title-in", "is-list-in");
      if (list) list.removeAttribute("data-ready");
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
