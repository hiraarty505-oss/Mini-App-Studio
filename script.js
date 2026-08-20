/* =========================================================
   MINI APP STUDIO — SCRIPT
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Theme toggle (persists only in-memory per session)
  --------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  let theme = "dark";

  const applyTheme = (next) => {
    theme = next;
    if (next === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    themeToggle.setAttribute("aria-pressed", String(next === "light"));
  };

  // Respect system preference on first load, but keep it in-memory only.
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(systemPrefersLight ? "light" : "dark");

  themeToggle.addEventListener("click", () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  });

  /* ---------------------------------------------------------
     Navbar: scroll state + active link
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const navLinkEls = document.querySelectorAll(".nav-links a, .mobile-menu a[href^='#']");
  const sectionIds = ["top", "apps", "preview", "why", "templates", "about", "cta"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const setActiveLink = (id) => {
    navLinkEls.forEach((a) => {
      const match = a.getAttribute("href") === `#${id}`;
      a.style.color = match ? "var(--text-primary)" : "";
    });
  };

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------------------------------------------------------
     Mobile menu
  --------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMobileMenu = () => {
    hamburger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileMenu));

  /* ---------------------------------------------------------
     Smooth scroll for in-page anchors (respects reduced motion
     via the global CSS `scroll-behavior: auto` override)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        history.pushState(null, "", `#${targetId}`);
      }
    });
  });

  document.getElementById("startBuildingBtn").addEventListener("click", () => {
    showToast("Thanks for the interest — the app builder is warming up.");
  });

  /* ---------------------------------------------------------
     Toasts
  --------------------------------------------------------- */
  const toastStack = document.getElementById("toastStack");
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span></span>`;
    toast.querySelector("span").textContent = message;
    toastStack.appendChild(toast);
    const remove = () => {
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 220);
    };
    setTimeout(remove, 2600);
  }

  /* ---------------------------------------------------------
     Ambient hero floaters — small "app tile" shapes
  --------------------------------------------------------- */
  const floatersEl = document.getElementById("floaters");
  const floaterIcons = [
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 3"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  ];
  const floaterPositions = [
    { top: "12%", left: "8%", size: 56, dur: 9, rot: 8 },
    { top: "62%", left: "5%", size: 42, dur: 7.5, rot: -6 },
    { top: "20%", left: "88%", size: 48, dur: 8.5, rot: -10 },
    { top: "68%", left: "90%", size: 58, dur: 10, rot: 6 },
    { top: "8%", left: "48%", size: 34, dur: 6.5, rot: 12 },
  ];
  if (!prefersReduced && floatersEl) {
    floaterPositions.forEach((pos, i) => {
      const el = document.createElement("div");
      el.className = "floater";
      el.style.top = pos.top;
      el.style.left = pos.left;
      el.style.width = `${pos.size}px`;
      el.style.height = `${pos.size}px`;
      el.style.setProperty("--dur", `${pos.dur}s`);
      el.style.setProperty("--rot", `${pos.rot}deg`);
      el.style.color = i % 2 === 0 ? "var(--accent)" : "var(--accent-2)";
      el.style.animationDelay = `${i * 0.6}s`;
      el.innerHTML = floaterIcons[i % floaterIcons.length];
      floatersEl.appendChild(el);
    });
  }

  /* ---------------------------------------------------------
     Hero entrance choreography (GSAP if available, CSS fallback)
  --------------------------------------------------------- */
  if (!prefersReduced && hasGSAP) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from('[data-anim="eyebrow"]', { y: 16, opacity: 0, duration: 0.5 })
      .from('[data-anim="title"]', { y: 24, opacity: 0, duration: 0.7 }, "-=0.25")
      .from('[data-anim="sub"]', { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
      .from('[data-anim="actions"] .btn', { y: 14, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3")
      .from('[data-anim="stats"]', { y: 14, opacity: 0, duration: 0.5 }, "-=0.25")
      .from(".floater", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" }, "-=0.6");
  } else if (!prefersReduced) {
    // CSS-only fallback entrance
    document.querySelectorAll("[data-anim]").forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }));
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal (IntersectionObserver, staggered cards)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  function revealGridStagger(container, itemSelector) {
    if (!("IntersectionObserver" in window) || prefersReduced) {
      container.querySelectorAll(itemSelector).forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const items = Array.from(container.querySelectorAll(itemSelector));
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx % 8, 8) * 60}ms`;
            entry.target.classList.add("is-visible");
            o.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    items.forEach((el) => obs.observe(el));
  }

  /* ---------------------------------------------------------
     Mini app data
  --------------------------------------------------------- */
  const APP_ICONS = {
    calculator: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
    qr: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M14 20h3M20 14v3M20 20v-.01"/></svg>',
    converter: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4M7 4 3 8M7 4l4 4M17 8v12m0 0 4-4m-4 4-4-4"/></svg>',
    password: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    color: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 5 5 8 5 12a2 2 0 0 0 4 0c0-4 5-7 5-12a7 7 0 0 0-7-7Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    text: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2M9 5v14M6 19h6M15 12h5M15 16h5M15 8h5"/></svg>',
    timer: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
    markdown: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 15V9l3 3 3-3v6M15 9v6M21 12l-3 3-3-3" transform="translate(-1 0) scale(0.9)"/></svg>',
  };

  const APPS = [
    { id: "calculator", name: "Calculator", desc: "Fast arithmetic with a clean, focused keypad.", tag: "Utility", cat: "utility", icon: "calculator" },
    { id: "qr", name: "QR Maker", desc: "Turn any link or text into a scannable QR code.", tag: "Design", cat: "design", icon: "qr" },
    { id: "converter", name: "Unit Converter", desc: "Convert length, weight, and temperature instantly.", tag: "Utility", cat: "utility", icon: "converter" },
    { id: "password", name: "Password Generator", desc: "Generate strong, random passwords in one click.", tag: "Security", cat: "security", icon: "password" },
    { id: "color", name: "Color Picker", desc: "Pick, preview, and copy HEX, RGB, and HSL values.", tag: "Design", cat: "design", icon: "color" },
    { id: "text", name: "Text Tools", desc: "Case conversion, word count, and quick cleanup.", tag: "Text", cat: "text", icon: "text" },
    { id: "timer", name: "Focus Timer", desc: "A simple countdown for focused work sessions.", tag: "Utility", cat: "utility", icon: "timer" },
    { id: "markdown", name: "Markdown Preview", desc: "Write Markdown and preview the rendered output.", tag: "Text", cat: "text", icon: "markdown" },
  ];

  const FEATURED_IDS = ["calculator", "converter", "qr", "password"];

  /* ---------------------------------------------------------
     Render app grid
  --------------------------------------------------------- */
  const appGrid = document.getElementById("appGrid");
  const appEmpty = document.getElementById("appEmpty");
  const appEmptyQuery = document.getElementById("appEmptyQuery");
  const appSearch = document.getElementById("appSearch");
  const filterChips = document.getElementById("filterChips");

  let activeFilter = "all";
  let activeQuery = "";

  function appCardHTML(app) {
    return `
      <article class="app-card" data-cat="${app.cat}" data-name="${app.name.toLowerCase()}">
        <div class="app-card-top">
          <div class="app-icon">${APP_ICONS[app.icon]}</div>
          <span class="app-tag">${app.tag}</span>
        </div>
        <h3>${app.name}</h3>
        <p>${app.desc}</p>
        <button class="app-card-open" type="button" data-open="${app.id}">
          Open App
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </article>`;
  }

  function renderApps() {
    const filtered = APPS.filter((app) => {
      const matchesFilter = activeFilter === "all" || app.cat === activeFilter;
      const matchesQuery = app.name.toLowerCase().includes(activeQuery) || app.desc.toLowerCase().includes(activeQuery);
      return matchesFilter && matchesQuery;
    });

    appGrid.innerHTML = filtered.map(appCardHTML).join("");
    appEmpty.hidden = filtered.length !== 0;
    if (filtered.length === 0) appEmptyQuery.textContent = activeQuery;

    appGrid.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const app = APPS.find((a) => a.id === btn.dataset.open);
        if (app.id === "calculator" || app.id === "converter") {
          document.getElementById("preview").scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
          setTab(app.id === "calculator" ? "calc" : "convert");
        } else {
          showToast(`${app.name} launches in the full app catalog.`);
        }
      });
    });

    revealGridStagger(appGrid, ".app-card");
  }

  appSearch.addEventListener("input", (e) => {
    activeQuery = e.target.value.trim().toLowerCase();
    renderApps();
  });

  filterChips.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    filterChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    renderApps();
  });

  renderApps();

  /* ---------------------------------------------------------
     Render featured / playground grid
  --------------------------------------------------------- */
  const featuredGrid = document.getElementById("featuredGrid");
  function featuredCardHTML(app) {
    return `
      <article class="featured-card">
        <div class="featured-preview">${APP_ICONS[app.icon]}</div>
        <div class="featured-body">
          <h3>${app.name}</h3>
          <p>${app.desc}</p>
          <button class="featured-launch" type="button" data-open="${app.id}">
            Launch
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </article>`;
  }
  featuredGrid.innerHTML = FEATURED_IDS.map((id) => featuredCardHTML(APPS.find((a) => a.id === id))).join("");
  featuredGrid.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const app = APPS.find((a) => a.id === btn.dataset.open);
      if (app.id === "calculator" || app.id === "converter") {
        document.getElementById("preview").scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
        setTab(app.id === "calculator" ? "calc" : "convert");
      } else {
        showToast(`${app.name} launches in the full app catalog.`);
      }
    });
  });
  revealGridStagger(featuredGrid, ".featured-card");

  /* ---------------------------------------------------------
     Preview window tabs
  --------------------------------------------------------- */
  const windowTabs = document.querySelectorAll(".window-tab");
  const appPanels = document.querySelectorAll(".app-panel");

  function setTab(tabName) {
    windowTabs.forEach((tab) => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    appPanels.forEach((panel) => {
      const active = panel.dataset.panel === tabName;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  windowTabs.forEach((tab) => tab.addEventListener("click", () => setTab(tab.dataset.tab)));

  /* ---------------------------------------------------------
     Subtle tilt on the preview window (pointer-based, desktop only)
  --------------------------------------------------------- */
  const tiltEl = document.querySelector("[data-tilt]");
  if (tiltEl && matchMedia("(pointer: fine)").matches && !prefersReduced) {
    tiltEl.addEventListener("mousemove", (e) => {
      const rect = tiltEl.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltEl.style.transform = `perspective(900px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg)`;
    });
    tiltEl.addEventListener("mouseleave", () => {
      tiltEl.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    });
  }

  /* ---------------------------------------------------------
     Working Calculator
  --------------------------------------------------------- */
  const calcDisplay = document.getElementById("calcDisplay");
  let calcState = { current: "0", operator: null, previous: null, overwrite: false };

  function formatNumber(numStr) {
    if (numStr === "Error") return numStr;
    const num = parseFloat(numStr);
    if (Number.isNaN(num)) return "0";
    if (!isFinite(num)) return "Error";
    const str = num.toString();
    return str.length > 12 ? num.toPrecision(8).replace(/\.?0+$/, "") : str;
  }

  function updateCalcDisplay() {
    calcDisplay.textContent = formatNumber(calcState.current);
  }

  function calcCompute(a, b, op) {
    a = parseFloat(a); b = parseFloat(b);
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function handleCalcKey(key) {
    if (/^[0-9]$/.test(key)) {
      if (calcState.overwrite || calcState.current === "0") {
        calcState.current = key;
        calcState.overwrite = false;
      } else if (calcState.current.replace("-", "").length < 12) {
        calcState.current += key;
      }
    } else if (key === ".") {
      if (calcState.overwrite) { calcState.current = "0."; calcState.overwrite = false; }
      else if (!calcState.current.includes(".")) calcState.current += ".";
    } else if (key === "clear") {
      calcState = { current: "0", operator: null, previous: null, overwrite: false };
    } else if (key === "sign") {
      calcState.current = (parseFloat(calcState.current) * -1).toString();
    } else if (key === "percent") {
      calcState.current = (parseFloat(calcState.current) / 100).toString();
    } else if (["+", "-", "*", "/"].includes(key)) {
      if (calcState.operator && !calcState.overwrite) {
        calcState.current = calcCompute(calcState.previous, calcState.current, calcState.operator).toString();
      }
      calcState.previous = calcState.current;
      calcState.operator = key;
      calcState.overwrite = true;
    } else if (key === "=") {
      if (calcState.operator) {
        calcState.current = calcCompute(calcState.previous, calcState.current, calcState.operator).toString();
        calcState.operator = null;
        calcState.previous = null;
        calcState.overwrite = true;
      }
    }
    updateCalcDisplay();
  }

  document.querySelectorAll(".calc-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleCalcKey(btn.dataset.key));
  });

  document.addEventListener("keydown", (e) => {
    const panel = document.querySelector('.app-panel[data-panel="calc"]');
    if (!panel.classList.contains("is-active")) return;
    if (/^[0-9.]$/.test(e.key)) handleCalcKey(e.key);
    else if (["+", "-", "*", "/"].includes(e.key)) handleCalcKey(e.key);
    else if (e.key === "Enter" || e.key === "=") handleCalcKey("=");
    else if (e.key === "Escape") handleCalcKey("clear");
    else if (e.key === "%") handleCalcKey("percent");
  });

  /* ---------------------------------------------------------
     Working Unit Converter
  --------------------------------------------------------- */
  const UNITS = {
    length: {
      label: "Length",
      base: "m",
      units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
    },
    weight: {
      label: "Weight",
      base: "kg",
      units: { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592 },
    },
    temp: { label: "Temperature", base: "c", units: { c: "c", f: "f", k: "k" } },
  };

  const convFrom = document.getElementById("convFrom");
  const convTo = document.getElementById("convTo");
  const convFromUnit = document.getElementById("convFromUnit");
  const convToUnit = document.getElementById("convToUnit");
  const convertSwap = document.getElementById("convertSwap");
  const convertCategory = document.getElementById("convertCategory");

  let currentCat = "length";

  function populateUnitSelects() {
    const unitKeys = Object.keys(UNITS[currentCat].units);
    [convFromUnit, convToUnit].forEach((select, i) => {
      select.innerHTML = unitKeys.map((u) => `<option value="${u}">${u.toUpperCase()}</option>`).join("");
      select.selectedIndex = i === 0 ? 0 : Math.min(1, unitKeys.length - 1);
    });
    runConversion();
  }

  function tempToCelsius(value, unit) {
    if (unit === "c") return value;
    if (unit === "f") return (value - 32) * (5 / 9);
    if (unit === "k") return value - 273.15;
  }
  function celsiusTo(value, unit) {
    if (unit === "c") return value;
    if (unit === "f") return value * (9 / 5) + 32;
    if (unit === "k") return value + 273.15;
  }

  function runConversion() {
    const val = parseFloat(convFrom.value);
    if (Number.isNaN(val)) { convTo.value = ""; return; }
    const fromU = convFromUnit.value;
    const toU = convToUnit.value;

    let result;
    if (currentCat === "temp") {
      result = celsiusTo(tempToCelsius(val, fromU), toU);
    } else {
      const table = UNITS[currentCat].units;
      const baseVal = val * table[fromU];
      result = baseVal / table[toU];
    }
    convTo.value = Number.isFinite(result) ? (Math.round(result * 100000) / 100000).toString() : "";
  }

  convFrom.addEventListener("input", runConversion);
  convFromUnit.addEventListener("change", runConversion);
  convToUnit.addEventListener("change", runConversion);

  convertSwap.addEventListener("click", () => {
    const fromIdx = convFromUnit.selectedIndex;
    const toIdx = convToUnit.selectedIndex;
    convFromUnit.selectedIndex = toIdx;
    convToUnit.selectedIndex = fromIdx;
    runConversion();
  });

  convertCategory.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    convertCategory.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentCat = btn.dataset.cat;
    populateUnitSelects();
  });

  populateUnitSelects();

  /* ---------------------------------------------------------
     Copy-to-clipboard helper (used by future mini apps / demo)
  --------------------------------------------------------- */
  window.copyToClipboard = async (text, label = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(label);
    } catch {
      showToast("Copy failed — select and copy manually.");
    }
  };
})();
