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

  // Custom cursor — dot follows exactly, ring eases behind, grows on hover
  const finePointer = matchMedia("(pointer: fine)").matches && matchMedia("(hover: hover)").matches;
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (finePointer && dot && ring) {
    document.documentElement.classList.add("custom-cursor");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("pointermove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverSelector = 'a, button, [role="tab"], .tag, .chip, .feature-card, .cell, .shot, .hero-facts > div, .hero-recent li';
    document.addEventListener("mouseover", e => {
      if (e.target.closest(hoverSelector)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest(hoverSelector) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverSelector))) {
        ring.classList.remove("is-hover");
      }
    });

    window.addEventListener("mousedown", () => ring.classList.add("is-click"));
    window.addEventListener("mouseup", () => ring.classList.remove("is-click"));
    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0"; ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1"; ring.style.opacity = "1";
    });
  }
})();
