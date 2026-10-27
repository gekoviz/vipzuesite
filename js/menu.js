// Menu mobile em overlay: trava a rolagem, fecha com Esc/link/botão e mantém o foco dentro (CONTEXTO §12).
(() => {
  const overlay = document.querySelector("[data-menu]");
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = document.querySelector("[data-menu-close]");
  if (!overlay || !openBtn || !closeBtn) return;

  const focusables = () =>
    [...overlay.querySelectorAll("a[href], button:not([disabled])")].filter((el) => el.offsetParent !== null);

  function open() {
    overlay.hidden = false;
    document.documentElement.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    closeBtn.focus();
    document.addEventListener("keydown", onKey);
  }

  function close({ restoreFocus = true } = {}) {
    overlay.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => {
      if (!overlay.classList.contains("is-open")) overlay.hidden = true;
    }, 280);
    if (restoreFocus) openBtn.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", () => close());
  overlay.querySelectorAll("a[href]").forEach((a) => a.addEventListener("click", () => close({ restoreFocus: false })));

  // Se a tela crescer para o layout desktop com o menu aberto, fecha sem deixar a rolagem travada.
  matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
    if (e.matches && !overlay.hidden) close({ restoreFocus: false });
  });
})();
