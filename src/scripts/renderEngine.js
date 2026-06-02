// =====================================================
// RENDER ENGINE - FINAL CLEAN VERSION
// =====================================================

const renderEngine = (() => {

  // =========================================
  // STATE
  // =========================================

  const state = {
    scrollY: 0,
    targetScroll: 0,

    velocity: 0,
    direction: 'down',

    inertia: 0,
    friction: 0.92,

    lastScrollY: 0,
    time: performance.now(),

    isMobile: window.innerWidth <= 768,
    smoothFactor: 0.12
  };

  let initialized = false;

  // =========================================
  // DOM CACHE
  // =========================================

  const dom = {
    motionLayers: [],
    depthLayers: [],
    revealSections: [],
    navLinks: [],
    logoLink: null,
    header: null,
    footerConnect: null,
    html: document.documentElement,
    sections: []
  };

  // =========================================
  // BATCH SYSTEM
  // =========================================

  const transforms = {
    motion: new Map(),
    depth: new Map()
  };

  const previousTransforms = new WeakMap();

  let ticking = false;
  let needsLayoutUpdate = true;

  // =========================================
  // INIT DOM
  // =========================================

  function initDOM() {

    dom.motionLayers =
      document.querySelectorAll('[data-motion-layer]');

    dom.depthLayers =
      document.querySelectorAll('[data-depth]');

    dom.revealSections =
      document.querySelectorAll('.content-section');

    dom.navLinks =
      document.querySelectorAll('.nav-link');

    dom.logoLink =
      document.getElementById('logo-link');

    dom.header =
      document.getElementById('main-header');

    dom.footerConnect =
      document.querySelector('.footer-connect');

    dom.sections =
      Array.from(dom.revealSections).map(section => ({
        id: section.id,
        el: section
      }));

    // IntersectionObserver for reveal sections (replaces per-frame checks)
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = entry.target;
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.15;
        section.classList.toggle('bg-active', visible);
        
      });
    }, { root: null, threshold: [0, 0.15, 0.45] });

    dom.revealSections.forEach(s => revealObserver.observe(s));

  }

  // =========================================
  // LAYOUT
  // =========================================

  function updateSectionBounds() {

    for (let i = 0; i < dom.sections.length; i++) {

      const section = dom.sections[i];

      const rect =
        section.el.getBoundingClientRect();

      section.top =
        rect.top + state.targetScroll;

      section.bottom =
        section.top + rect.height;

    }

  }

  function maybeUpdateLayout() {

    if (!needsLayoutUpdate) return;

    updateSectionBounds();

    needsLayoutUpdate = false;

  }

  // =========================================
  // SCROLL + INERTIA
  // =========================================

  function updateScrollPhysics() {

    const currentScroll =
      window.scrollY;

    state.targetScroll =
      currentScroll;

    const delta =
      state.targetScroll - state.lastScrollY;

    state.velocity = delta;

    state.inertia += delta * 0.35;

    state.inertia *= state.friction;

    state.direction =
      delta > 0 ? 'down' : 'up';

    state.scrollY +=
      (state.targetScroll - state.scrollY)
      * state.smoothFactor;

    state.lastScrollY =
      currentScroll;

    dom.html.setAttribute(
      'data-scroll-direction',
      state.direction
    );

    dom.html.setAttribute(
      'data-motion',
      Math.abs(delta) > 120
        ? 'high'
        : Math.abs(delta) > 40
          ? 'medium'
          : 'low'
    );

  }

  // =========================================
  // MOTION
  // =========================================

  function renderMotion() {

    if (state.isMobile) return;

    const y = state.scrollY;

    const inertiaOffset =
      state.inertia * 0.02;

    // MOTION LAYERS
    for (let i = 0; i < dom.motionLayers.length; i++) {

      const layer =
        dom.motionLayers[i];

      const speed =
        parseFloat(
          layer.dataset.motionSpeed || 0.08
        );

      const direction =
        layer.dataset.motionDirection || 'vertical';

      const movement =
        y * speed + inertiaOffset;

      const value =
        direction === 'horizontal'
          ? `translate3d(${movement}px,0,0)`
          : `translate3d(0,${movement}px,0)`;

      transforms.motion.set(layer, value);

    }

    // DEPTH LAYERS
    for (let i = 0; i < dom.depthLayers.length; i++) {

      const layer =
        dom.depthLayers[i];

      const depth =
        parseFloat(
          layer.dataset.depth || 0.1
        );

      const offset =
        y * depth;

      transforms.depth.set(
        layer,
        `translate3d(0,${offset}px,0)`
      );

    }

  }

  // =========================================
  // UI
  // =========================================

  function renderUI() {

    if (dom.header) {

      dom.header.classList.toggle(
        'header-expanded',
        state.targetScroll > 100
      );

    }

  }

  // =========================================
  // ACTIVE SECTION
  // =========================================

  function updateActiveSection() {

    const scrollMiddle =
      state.targetScroll +
      window.innerHeight * 0.35;

    let activeSection = 'hero';

    // HERO PRIORITY
    if (state.targetScroll > 120) {

      for (let i = 0; i < dom.sections.length; i++) {

        const section =
          dom.sections[i];

        if (section.id === 'hero')
          continue;

        const elTop =
          section.el.offsetTop;

        const elBottom =
          elTop + section.el.offsetHeight;

        if (
          scrollMiddle >= elTop &&
          scrollMiddle < elBottom
        ) {

          activeSection =
            section.id;

          break;

        }

      }

    }

    // =====================================
    // NAV LINKS
    // =====================================

    for (let i = 0; i < dom.navLinks.length; i++) {

      const link =
        dom.navLinks[i];

      const href =
        link.getAttribute('href');

      const sectionId =
        href.replace('#', '');

      link.classList.toggle(
        'active',
        sectionId === activeSection
      );

    }

    // =====================================
    // HERO LOGO
    // =====================================

    if (dom.logoLink) {

      dom.logoLink.classList.toggle(
        'active',
        activeSection === 'hero'
      );

    }

    // =====================================
    // FOOTER CONNECT
    // =====================================

    if (
      dom.footerConnect &&
      dom.sections.length
    ) {

      const lastSection =
        dom.sections[
          dom.sections.length - 1
        ].id;

      dom.footerConnect.classList.toggle(
        'active',
        activeSection === lastSection
      );

    }

    // =====================================
    // URL UPDATE
    // =====================================

    const newPath =
      activeSection === 'hero'
        ? '/'
        : `/${activeSection}`;

    if (
      window.location.pathname !== newPath
    ) {

      window.history.replaceState(
        {},
        '',
        newPath
      );

    }

  }

  // =========================================
  // REVEAL
  // =========================================

  function renderReveal() {
    // Reveal handled by IntersectionObserver initialized in initDOM()
  }

  // =========================================
  // FLUSH DOM
  // =========================================

  function flushDOM() {

    transforms.motion.forEach((value, el) => {
      if (previousTransforms.get(el) !== value) {
        el.style.transform = value;
        previousTransforms.set(el, value);
      }
    });

    transforms.depth.forEach((value, el) => {
      if (previousTransforms.get(el) !== value) {
        el.style.transform = value;
        previousTransforms.set(el, value);
      }
    });

    transforms.motion.clear();
    transforms.depth.clear();

  }

  // =========================================
  // PIPELINE
  // =========================================

  function render() {

    maybeUpdateLayout();

    renderMotion();

    renderUI();

    renderReveal();

    updateActiveSection();

    flushDOM();

    ticking = false;

  }

  function loop() {

    updateScrollPhysics();

    render();

  }

  function onScroll() {

    state.targetScroll =
      window.scrollY;

    if (!ticking) {

      requestAnimationFrame(loop);

      ticking = true;

    }

  }

  // =========================================
  // INIT
  // =========================================

  function init() {

    if (initialized) return;
    initialized = true;

    initDOM();

    requestAnimationFrame(() => {

      updateSectionBounds();

      render();

    });

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      () => {
        needsLayoutUpdate = true;
        state.isMobile = window.innerWidth <= 768;
      }
    );

    loop();

  }

  return { init };

})();

export default renderEngine;
