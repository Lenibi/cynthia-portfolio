// Cynthia Wang portfolio — tab switching + scroll-to-top FAB.

(() => {
  const STORAGE_KEY = "cw-active-tab-v2";
  const tabs = document.querySelectorAll(".tabs button[data-tab]");
  const panels = document.querySelectorAll(".tab-panel[data-tab]");

  const setTab = (id, { scroll = false } = {}) => {
    let matched = false;
    tabs.forEach(b => {
      const is = b.dataset.tab === id;
      b.setAttribute("aria-selected", String(is));
      if (is) matched = true;
    });
    if (!matched) return;
    panels.forEach(p => {
      p.setAttribute("aria-hidden", String(p.dataset.tab !== id));
    });
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* private mode */ }
    if (scroll) {
      const work = document.getElementById("work");
      if (work) {
        const top = work.getBoundingClientRect().top + window.scrollY - 56;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  tabs.forEach(b => {
    b.addEventListener("click", () => setTab(b.dataset.tab, { scroll: true }));
    b.addEventListener("keydown", e => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const list = Array.from(tabs);
      const i = list.indexOf(b);
      const next = e.key === "ArrowRight" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
      list[next].focus();
      setTab(list[next].dataset.tab);
    });
  });

  // Restore tab on load
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved && Array.from(tabs).some(b => b.dataset.tab === saved)) {
    setTab(saved);
  }

  // FAB
  const fab = document.querySelector(".fab");
  if (fab) {
    const onScroll = () => {
      fab.classList.toggle("visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    fab.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Smooth scroll for in-page anchor links (offset for sticky nav)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
