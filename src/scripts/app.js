import renderEngine from './renderEngine.js';
import './contactValidation.js';
import './backToTop.js';

history.scrollRestoration = "manual";

let engineStarted = false;

function startEngineOnce() {
  if (engineStarted) return;
  engineStarted = true;

  if (typeof renderEngine !== 'undefined' && renderEngine.init) {
    renderEngine.init();
  }
}

let isClicking = false;

// =====================================================
// THEME
// =====================================================

function initTheme() {

  const toggleIcon =
    document.getElementById('toggle-icon');

  const button =
    document.getElementById('theme-toggle');

  const html =
    document.documentElement;

  if (!button) {
    return;
  }

  // restaura tema salvo
  const savedTheme =
    localStorage.getItem('theme');

  if (savedTheme === 'dark') {

    html.classList.add('dark');

  }

  updateToggleIcon();

  button.onclick = () => {


    html.classList.toggle('dark');

    const isDark =
      html.classList.contains('dark');

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );

    updateToggleIcon();

  };

  function updateToggleIcon() {

    if (!toggleIcon) return;

    toggleIcon.textContent =
      html.classList.contains('dark')
        ? '🌕'
        : '🌑';

  }

}

// =====================================================
// NAVIGATION
// =====================================================

function initNavigation() {

  const navLinks =
    document.querySelectorAll('.nav-link');

  const logoLink =
    document.getElementById('logo-link');

    function navigateToSection(sectionId) {
      const targetSection = document.getElementById(sectionId);
      
      if (!targetSection) {
        console.error("❌ [Debug Scroll] ERRO CRÍTICO: Não existe NENHUM elemento na página com o id='" + sectionId + "'!");
        return;
      }

      // Descobre dinamicamente quem é o elemento pai que está segurando o scroll
      let scrollContainer = targetSection.parentElement;
      while (scrollContainer && scrollContainer !== document.body) {
        const overflowY = window.getComputedStyle(scrollContainer).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') break;
        scrollContainer = scrollContainer.parentElement;
      }

      // Se não achar um container interno, tenta usar document.scrollingElement (mais robusto que window)
      let container = (scrollContainer && scrollContainer !== document.body) ? scrollContainer : (document.scrollingElement || document.documentElement || document.body);

      const headerOffset = 80;

      // Cálculo baseado em retângulos para suportar containers internos e scrollingElement
      const targetRect = targetSection.getBoundingClientRect();

      if (container === window || container === document.documentElement || container === document.body || container === document.scrollingElement) {
        const scrollingEl = document.scrollingElement || document.documentElement || document.body;
        const offset = targetRect.top + scrollingEl.scrollTop - headerOffset;
        scrollingEl.scrollTo({ top: offset, behavior: 'smooth' });
      } else {
        const containerRect = container.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop - headerOffset;
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }

      const newPath = sectionId === 'hero' ? '/' : `/${sectionId}`;
      window.history.replaceState({}, '', newPath);

    }


  // Robust navigation: uses a deterministic scroll routine and falls back to manual animation when native smooth fails
  function navigateToSectionRobust(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    // Find scrollable ancestor
    let scrollContainer = targetSection.parentElement;
    while (scrollContainer && scrollContainer !== document.body) {
      const overflowY = window.getComputedStyle(scrollContainer).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') break;
      scrollContainer = scrollContainer.parentElement;
    }

    let container = (scrollContainer && scrollContainer !== document.body) ? scrollContainer : (document.scrollingElement || document.documentElement || document.body);
    const headerOffset = 80;
    const targetRect = targetSection.getBoundingClientRect();

    let desiredScrollTop;
    if (container === document.scrollingElement || container === document.documentElement || container === document.body) {
      const scrollingEl = document.scrollingElement || document.documentElement || document.body;
      desiredScrollTop = targetRect.top + scrollingEl.scrollTop - headerOffset;
    } else {
      const containerRect = container.getBoundingClientRect();
      desiredScrollTop = targetRect.top - containerRect.top + container.scrollTop - headerOffset;
    }


    // Force manual animation to ensure consistent smoothness across browsers/containers
    const currentTop = (container === document.scrollingElement || container === document.documentElement || container === document.body) ? (document.scrollingElement || document.documentElement).scrollTop : container.scrollTop;
    const duration = 520;
    const start = currentTop;
    const change = desiredScrollTop - start;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const val = start + change * eased;
      if (container === document.scrollingElement || container === document.documentElement || container === document.body) {
        const scrollingEl = document.scrollingElement || document.documentElement || document.body;
        scrollingEl.scrollTop = val;
      } else {
        container.scrollTop = val;
      }
      if (t < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // After the manual animation, as an extra fallback, try scrolling main if target not aligned
    setTimeout(() => {
      const postRect = targetSection.getBoundingClientRect();
      if (Math.abs(postRect.top - headerOffset) > 6) {
        const mainEl = document.querySelector('main');
        if (mainEl && mainEl !== container) {
          const mainRect = mainEl.getBoundingClientRect();
          const mainDesired = postRect.top + (container === document.scrollingElement || container === document.documentElement || container === document.body ? (document.scrollingElement || document.documentElement).scrollTop : container.scrollTop) - mainRect.top - headerOffset;

          const startMain = mainEl.scrollTop;
          const changeMain = mainDesired - startMain;
          const durationMain = 520;
          const startTimeMain = performance.now();
          function animateMain(now) {
            const elapsed = now - startTimeMain;
            const t = Math.min(1, elapsed / durationMain);
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            mainEl.scrollTop = startMain + changeMain * eased;
            if (t < 1) requestAnimationFrame(animateMain);
          }
          requestAnimationFrame(animateMain);
        }
      }
    }, duration + 50);

    const newPath = sectionId === 'hero' ? '/' : `/${sectionId}`;
    window.history.replaceState({}, '', newPath);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const sectionId = href.replace('#', '');
      navigateToSectionRobust(sectionId);
    });
  });

  logoLink?.addEventListener('click', e => {
    e.preventDefault();
    navigateToSectionRobust('hero');
  });

}

// =====================================================
// LOADER
// =====================================================

function initLoader() {

  const loader =
    document.getElementById('fake-loader');

  const fill =
    document.getElementById('loader-fill');

  const text =
    document.getElementById('load-percentage');

  if (!loader) {
    console.warn('[FakeLoader] initLoader: #fake-loader not found, starting renderEngine immediately');
    if (typeof renderEngine !== 'undefined' && renderEngine.init) {
      startEngineOnce();
    } else {
      console.warn('[FakeLoader] initLoader: renderEngine not available');
    }
    return;
  }

  document.body.classList.add(
    'overflow-hidden'
  );

  let current = 0;

  const interval = setInterval(() => {

    if (current < 100) {

      current +=
        Math.floor(Math.random() * 8) + 2;

      if (current > 100)
        current = 100;

      if (text)
        text.textContent = current;

      if (fill)
        fill.style.height = `${current}%`;

    } else {

      clearInterval(interval);

      // 1. Inicia a engine IMEDIATAMENTE (o site renderiza por baixo enquanto o loader esmaece)
      if (typeof renderEngine !== 'undefined' && renderEngine.init) {
        startEngineOnce();
      } else {
        console.warn('[FakeLoader] initLoader: renderEngine not available');
      }

      // 2. Apenas aplicar fade no container principal; os elementos internos são gerenciados por CSS
      const container = loader;
      const fadeDuration = 1000;

      function addFade(elems, ms, cls = 'fade-out') {
  try {
    const arr = Array.from(elems || []);
    arr.forEach((el) => {
      if (!el) return;
      try {
        el.style.transitionDuration = `${ms}ms`;
      } catch (err) {
        // ignore
      }
      el.classList.add(cls);
    });
  } catch (err) {
    // ignore
  }
}


      // Aplicar a classe de fade no próximo frame, desabilitar pointer events imediatamente e garantir reflow
      requestAnimationFrame(() => {
        addFade([container], fadeDuration);
        try { container.style.pointerEvents = 'none'; } catch (err) {}
        void container.offsetHeight;
      });

      // Esconder o container APENAS após o fade completar (fadeDuration + buffer)
      setTimeout(() => {
        try {
          container.style.display = 'none';
          container.style.pointerEvents = 'none';
        } catch (err) {
        }
        document.body.classList.remove('overflow-hidden');
      }, fadeDuration + 50);

    }

  }, 90);

}

// =====================================================
// INIT
// =====================================================

window.addEventListener('DOMContentLoaded', () => {

  initTheme();
  initNavigation();
  initLoader();
  initCaseModal();
  initStagger();
  initReveal();
  initCasesSlider();
  initContactFormLoading();
  initContactFormSuccess();
  initNavActiveState();
  initCopyButtons();

  // =====================================
  // INITIAL SCROLL RESTORE (ROBUSTO)
  // =====================================

  const path = window.location.pathname;

  // normaliza rota:
  // "/" -> hero
  // "/sobre" -> sobre
  // "/cases" -> cases
  // "/conectar" -> conectar
  let sectionId = 'hero';

  if (path && path !== '/') {
    sectionId = path.replace(/\//g, '');
  }

  const target = document.getElementById(sectionId);

  if (target) {

    // espera render + layout + renderEngine estabilizar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        target.scrollIntoView({
          behavior: 'auto',
          block: 'start'
        });

      });
    });

  } else {
    console.warn('[scroll-restore] seção não encontrada:', sectionId);
  }

});

// =====================================================
// OBSERVER (reveal) 
// =====================================================

function initReveal() {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);

      if (entry.isIntersecting) {

        setTimeout(() => {
          el.classList.add("is-visible");
        }, delay);

      } else {

        setTimeout(() => {
          el.classList.remove("is-visible");
        }, delay);

      }

    });
  }, {
    threshold: 0.15,
  });

  const observeElements = () => {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });
  };

  // roda depois que o layout estabiliza
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      observeElements();
    });
  });

}

// =====================================================
// STAGGER
// =====================================================

function initStagger() {

  const BASE_DELAY = 480; // <- aqui você controla o início
  const STEP = 120;       // <- intervalo entre elementos

  document.querySelectorAll("[data-stagger]").forEach((container) => {
    const items = container.querySelectorAll("[data-animate]");

    items.forEach((el, index) => {
      el.dataset.delay = BASE_DELAY + (index * STEP);
    });
  });

}

// =====================================================
// SLIDER DE CASES
// =====================================================

function initCasesSlider() {

  const track = document.getElementById("cases-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll("article"));

  const prev = document.getElementById("case-prev");
  const next = document.getElementById("case-next");

  let currentCase = 0;

  function runLoader(index) {
    const slide = slides[index];
    if (!slide) return;

    const loader = slide.querySelector(".case-loader");
    if (!loader) return;

    loader.style.display = "flex";

    requestAnimationFrame(() => {
      loader.classList.add("is-visible");
    });

    setTimeout(() => {
      loader.classList.remove("is-visible");

      setTimeout(() => {
        loader.style.display = "none";
      }, 400);
    }, 1200);
  }

  function updateCases() {
    track.style.transform = `translateX(-${currentCase * 100}%)`;

    slides.forEach((s, i) => {
      s.classList.toggle("active", i === currentCase);
    });

    updateButtons();
  }

  function updateButtons() {
    if (prev) {
      const isFirst = currentCase === 0;
      prev.disabled = isFirst;
      prev.style.opacity = isFirst ? "0.3" : "1";
      prev.style.pointerEvents = isFirst ? "none" : "auto";
    }

    if (next) {
      const isLast = currentCase === slides.length - 1;
      next.disabled = isLast;
      next.style.opacity = isLast ? "0.3" : "1";
      next.style.pointerEvents = isLast ? "none" : "auto";
    }
  }

  function goNext() {
    if (currentCase >= slides.length - 1) return;
    currentCase++;
    updateCases();
    runLoader(currentCase);
  }

  function goPrev() {
    if (currentCase <= 0) return;
    currentCase--;
    updateCases();
    runLoader(currentCase);
  }

  next?.addEventListener("click", goNext);
  prev?.addEventListener("click", goPrev);

  updateCases();
}

// =====================================================
// MODAL
// =====================================================

function initCaseModal() {

  const modal = document.getElementById("case-modal");
  const modalImage = document.getElementById("case-modal-image");
  const modalCaption = document.getElementById("case-modal-caption");

  const prevButton =
    document.getElementById("case-modal-prev");

  const nextButton =
    document.getElementById("case-modal-next");

  let currentGallery = [];
  let currentIndex = 0;

  if (!modal || !modalImage || !modalCaption) return;

  function bindTriggers() {

    const triggers = document.querySelectorAll(".case-modal-trigger");

    const iframe = document.getElementById("case-modal-figma");
    const image = document.getElementById("case-modal-image");
    const modal = document.getElementById("case-modal");

    triggers.forEach((el) => {

      el.addEventListener("click", () => {

        console.log("CLICK TRIGGER:", el, el.dataset);

        // reset visual state
        iframe.classList.add("hidden");
        iframe.src = "";
        image.classList.remove("hidden");

        const src = el.dataset.src;
        const caption = el.dataset.caption || "";

        if (!src) return;

        const galleryId = el.dataset.gallery;

        if (!galleryId) return;

        // pega TODOS os itens da mesma gallery (sem depender de article)
        currentGallery = Array.from(
          document.querySelectorAll(`[data-gallery="${galleryId}"]`)
        ).filter(item => item.dataset.src);

        // =====================================================
        // 🔥 INDEX ROBUSTO (NUNCA MAIS QUEBRA)
        // =====================================================
        currentIndex = currentGallery.findIndex(
          item => item.dataset.src === src
        );

        if (currentIndex < 0) currentIndex = 0;

        // =====================================================
        // OPEN MODAL
        // =====================================================
        openModal(src, caption);
        updateGalleryButtons();

        // =====================================================
        // FIGMA CASE
        // =====================================================
        if (el.dataset.figma === "true") {

          image.classList.add("hidden");
          iframe.classList.remove("hidden");

          iframe.src =
            "https://www.figma.com/embed?embed_host=share&url=" +
            encodeURIComponent(
              "https://www.figma.com/proto/vkDYLX7YMyiBkfGKFMAlbs/Components?page-id=200%3A2550&node-id=9264-44088&p=f&viewport=376%2C-1594%2C1&t=lypt5jEpf1LLIp2v-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=9264%3A44088&show-proto-sidebar=1&hotspot-hints=0&disable-default-keyboard-nav=1&hide-ui=1"
            );

        } else {

          iframe.classList.add("hidden");
          iframe.src = "";
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");

        requestAnimationFrame(() => {
          modal.classList.remove("opacity-0");
          modal.classList.add("opacity-100");
        });

      });

    });
  }

// =====================================================
// SWIPE MOBILE
// =====================================================

  let touchStartX = 0;
  let touchEndX = 0;

  modalImage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });

  modalImage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;

    handleSwipe();
  });

  function handleSwipe() {

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 50) return;

    // esquerda -> próxima imagem
    if (
      distance < 0 &&
      currentIndex < currentGallery.length - 1
    ) {
      showGalleryItem(currentIndex + 1);
    }

    // direita -> imagem anterior
    if (
      distance > 0 &&
      currentIndex > 0
    ) {
      showGalleryItem(currentIndex - 1);
    }

  }


// =====================================================
// PREV
// =====================================================

prevButton?.addEventListener("click", () => {
  showGalleryItem(currentIndex - 1);
});

  // =====================================================
  // NEXT
  // =====================================================

nextButton?.addEventListener("click", () => {
  showGalleryItem(currentIndex + 1);
});

  // =====================================================
  // OPEN MODAL
  // =====================================================
  function openModal(src, caption = "") {

    modalImage.src = src;
    modalCaption.textContent = caption;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    requestAnimationFrame(() => {
      modal.classList.remove("opacity-0");
      modal.classList.add("opacity-100");
    });
    document.body.style.overflow = "hidden";
  }

function updateGalleryButtons() {

  if (!prevButton || !nextButton) return;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === currentGallery.length - 1;

  prevButton.disabled = isFirst;
  nextButton.disabled = isLast;

  prevButton.style.opacity = isFirst ? "0.3" : "1";
  nextButton.style.opacity = isLast ? "0.3" : "1";

  prevButton.style.pointerEvents = isFirst ? "none" : "auto";
  nextButton.style.pointerEvents = isLast ? "none" : "auto";
}

 function showGalleryItem(index) {

  if (!currentGallery.length) return;

  // 🔒 clamp seguro (evita overflow bug)
  if (index < 0) index = 0;
  if (index >= currentGallery.length) index = currentGallery.length - 1;

  currentIndex = index;

  const item = currentGallery[currentIndex];
  if (!item) return;

  const iframe = document.getElementById("case-modal-figma");

  const isFigma = item.dataset.figma === "true";

  if (isFigma) {

    modalImage.classList.add("hidden");
    iframe.classList.remove("hidden");

    iframe.src =
      "https://www.figma.com/embed?embed_host=share&url=" +
      encodeURIComponent(
        "https://www.figma.com/proto/vkDYLX7YMyiBkfGKFMAlbs/Components?page-id=200%3A2550&node-id=9264-44088&p=f&viewport=376%2C-1594%2C1&t=lypt5jEpf1LLIp2v-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=9264%3A44088&show-proto-sidebar=1&hotspot-hints=0&disable-default-keyboard-nav=1&hide-ui=1"
      );

  } else {

    iframe.classList.add("hidden");
    iframe.src = "";

    modalImage.classList.remove("hidden");
    modalImage.src = item.dataset.src;
  }

  modalCaption.textContent = item.dataset.caption || "";

  updateGalleryButtons();
}

  // =====================================================
  // CLOSE MODAL
  // =====================================================
  function closeModal() {
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");

    setTimeout(() => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    }, 300);
    document.body.style.overflow = "";
  }

  // =====================================================
  // CLICK ON IMAGES (delegation - escalável)
  // const caseImages = document.querySelectorAll("#cases-track img");

  // caseImages.forEach((img) => {

  //   img.style.cursor = "pointer";

  //   img.addEventListener("click", () => {

  //     const caption =
  //       img.getAttribute("alt") || "";

  //     openModal(img.src, caption);
  //   });

  // });

  // =====================================================
  // CLOSE EVENTS
  // =====================================================

  // click overlay or button
  modal.addEventListener("click", (e) => {
    if (e.target.closest('[data-close="modal"]')) {
      closeModal();
    }
  });

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  bindTriggers();

}

// =====================================================
// FORM SUBMIT LOADING
// =====================================================

function initContactFormLoading() {

  const form =
    document.getElementById('contact-form');

  const button =
    document.getElementById('submit-button');

  const label =
    document.getElementById('submit-label');

  if (!form || !button || !label) return;

  // =====================================================
  // HELPER (evita repetição e bugs de estado)
  // =====================================================
  function resetButton() {

    button.disabled = false;

    button.classList.remove(
      'opacity-70',
      'cursor-not-allowed'
    );

    label.textContent = 'Enviar mensagem';
  }

  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    button.disabled = true;

    button.classList.add(
      'opacity-70',
      'cursor-not-allowed'
    );

    let dots = 0;
    const loadingText = 'Enviando';

    const dotsInterval = setInterval(() => {

      dots = (dots + 1) % 4;

      if (!button.disabled) return;

      label.textContent =
        loadingText + '.'.repeat(dots);

    }, 300);

    console.log('SUBMIT INTERCEPTADO');

    try {

      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      const result = await response.text();

      console.log('RESPOSTA PHP:', result);

      window.clearInterval(dotsInterval);
      dots = 0;

      if (result === 'OK') {

        label.textContent = 'Mensagem enviada ✓';

        const successMessage =
          document.getElementById('form-success');

        successMessage?.classList.remove('hidden');

        requestAnimationFrame(() => {
          successMessage?.classList.remove('opacity-0');
        });

        setTimeout(() => {

          successMessage?.classList.add('opacity-0');

          setTimeout(() => {

            successMessage?.classList.add('hidden');

            resetButton();

          }, 500);

        }, 5000);

        form.reset();

      } else {

        resetButton();
        label.textContent = 'Erro ao enviar';

      }

    } catch (err) {

      console.error(err);

      window.clearInterval(dotsInterval);
      dots = 0;

      resetButton();
      label.textContent = 'Erro ao enviar';

    }

  });

}

// =====================================================
// FORM SUCCESS MESSAGE
// =====================================================

function initContactFormSuccess() {

  console.log(
    'contactSuccess:',
    sessionStorage.getItem('contactSuccess')
  );

  const successMessage =
    document.getElementById('form-success');

  if (!successMessage) return;

  if (
    sessionStorage.getItem('contactSuccess')
    === 'true'
  ) {

    successMessage.classList.remove('hidden');

    sessionStorage.removeItem(
      'contactSuccess'
    );

  }

}

// =====================================================
// INIT
// =====================================================

initContactFormLoading();
initContactFormSuccess();


console.log('APP JS CARREGADO');

// =====================================================
// NAV ACTIVE STATE (FINAL LIMPO - SINGLE SOURCE OF TRUTH)
// =====================================================

function initNavActiveState() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const logoLink = document.getElementById("logo-link");

  const footerLink =
    document.querySelector('[data-section="conectar"]') ||
    document.querySelector('.nav-link[href="#conectar"]');

  let activeId = "hero";

  function clearHeaderOnly() {
    navLinks.forEach(l => l.classList.remove("active"));
    logoLink?.classList.remove("active");
  }

  function apply(id) {
    if (!id) return;

    activeId = id;

    // 🔥 só limpa HEADER
    clearHeaderOnly();

    // HERO → logo
    if (id === "hero") {
      logoLink?.classList.add("active");
    } else {
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      link?.classList.add("active");
    }

    // footer NÃO depende do apply mais
  }

  // =====================================================
  // FOOTER STATE INDEPENDENTE (ESTÁVEL)
  // =====================================================
  function updateFooter() {
    const footer = document.getElementById("main-footer");
    if (!footer || !footerLink) return;

    const rect = footer.getBoundingClientRect();

    const isVisible =
      rect.top <= window.innerHeight &&
      rect.bottom >= window.innerHeight * 0.6;

    if (isVisible) {
      footerLink.classList.add("active");
    } else {
      footerLink.classList.remove("active");
    }
  }

  // =====================================================
  // OBSERVER (SÓ HEADER)
  // =====================================================
  const observer = new IntersectionObserver((entries) => {
    let best = null;

    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      if (!best || entry.intersectionRatio > best.intersectionRatio) {
        best = entry;
      }
    }

    if (!best) return;

    apply(best.target.id);

    const newPath =
      best.target.id === "hero"
        ? "/"
        : `/${best.target.id}`;

    window.history.replaceState({}, "", newPath);
  }, {
    threshold: [0.35, 0.55, 0.75]
  });

  sections.forEach(s => observer.observe(s));

  // =====================================================
  // CLICK MENU
  // =====================================================
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.replace("#", "");
      apply(id);
    });
  });

  // =====================================================
  // SCROLL (FOOTER INDEPENDENTE)
  // =====================================================
  window.addEventListener("scroll", () => {
    updateFooter();
  }, { passive: true });

  // =====================================================
  // INIT (F5 SAFE)
  // =====================================================
  requestAnimationFrame(() => {
    const path = window.location.pathname.replace("/", "") || "hero";
    apply(path);
    updateFooter();
  });
}

// =====================================================
// COPY TO CLIPBOARD
// =====================================================

function initCopyButtons() {

  const buttons = document.querySelectorAll(".copy-btn");

  buttons.forEach((button) => {

    button.addEventListener("click", async (e) => {

      e.preventDefault();
      e.stopPropagation();

      const value = button.dataset.copy;

      if (!value) return;

      try {

        await navigator.clipboard.writeText(value);

        const icon = button.querySelector("i");

        if (!icon) return;

        icon.className = "ph ph-check text-base";

        setTimeout(() => {
          icon.className = "ph ph-copy text-base";
        }, 1200);

      } catch (error) {

        console.error(
          "[copy-btn]",
          error
        );

      }

    });

  });

}