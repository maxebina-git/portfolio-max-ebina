import renderEngine from './renderEngine.js';
import './contactValidation.js';

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
      renderEngine.init();
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
        renderEngine.init();
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

  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
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
// INIT GERAL
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  initStagger();
  initReveal();
  initCasesSlider();
});

// =====================================================
// SLIDER DE CASES
// =====================================================

function initCasesSlider() {

  const track = document.getElementById("cases-track");
  if (!track) return;

  const slides = track.querySelectorAll("article");

  const prev = document.getElementById("case-prev");
  const next = document.getElementById("case-next");

  let currentCase = 0;

  // =====================================================
  // LOADER (interno e escalável)
  // =====================================================
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
      }, 500);

    }, 1750);
  }

  // =====================================================
  // UPDATE UI
  // =====================================================
  function updateCases() {

    track.style.transform = `translateX(-${currentCase * 100}%)`;

    slides.forEach((s, i) => {
      s.classList.toggle("active", i === currentCase);
    });

    updateButtons();
  }

  // =====================================================
  // BOTÕES
  // =====================================================
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

  // =====================================================
  // NEXT
  // =====================================================
  next?.addEventListener("click", () => {

    if (currentCase < slides.length - 1) {
      currentCase++;
      updateCases();
      runLoader(currentCase);
    }

  });

  // =====================================================
  // PREV
  // =====================================================
  prev?.addEventListener("click", () => {

    if (currentCase > 0) {
      currentCase--;
      updateCases();
      runLoader(currentCase);
    }

  });

  // =====================================================
  // INIT
  // =====================================================
  updateCases();
}

// =====================================================
// CASE 2 LOADER
// =====================================================

document.getElementById("case-next")?.addEventListener("click", () => {

  const track = document.getElementById("cases-track");
  if (!track) return;

  const slides = track.querySelectorAll("article");

  let currentCase =
    Array.from(slides).findIndex(a => a.classList.contains("active"));

  if (currentCase === -1) currentCase = 0;

  const nextIndex = Math.min(currentCase + 1, slides.length - 1);

  const loader = slides[nextIndex].querySelector(".case-loader");
  if (!loader) return;

  loader.style.display = "flex";

  requestAnimationFrame(() => {
    loader.classList.add("is-visible");
  });

  setTimeout(() => {

    loader.classList.remove("is-visible");

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 1750);

});


document.getElementById("case-prev")?.addEventListener("click", () => {

  const track = document.getElementById("cases-track");
  if (!track) return;

  const slides = track.querySelectorAll("article");

  let currentCase =
    Array.from(slides).findIndex(a => a.classList.contains("active"));

  if (currentCase === -1) currentCase = 0;

  const prevIndex = Math.max(currentCase - 1, 0);

  const loader = slides[prevIndex].querySelector(".case-loader");
  if (!loader) return;

  loader.style.display = "flex";

  requestAnimationFrame(() => {
    loader.classList.add("is-visible");
  });

  setTimeout(() => {

    loader.classList.remove("is-visible");

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 1750);

});

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

    triggers.forEach((el) => {
      el.addEventListener("click", () => {

        const src = el.dataset.src;
        const caption = el.dataset.caption || "";

        if (!src) return;

        const galleryId =
          el.dataset.gallery;

        currentGallery = Array.from(
          document.querySelectorAll(
            `[data-gallery="${galleryId}"]`
          )
        );

        currentIndex =
          currentGallery.indexOf(el);

        openModal(src, caption);
        updateGalleryButtons();
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

    if (currentIndex > 0) {
      showGalleryItem(currentIndex - 1);
    }

  });

  // =====================================================
  // NEXT
  // =====================================================

  nextButton?.addEventListener("click", () => {

    if (currentIndex < currentGallery.length - 1) {
      showGalleryItem(currentIndex + 1);
    }

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

    const isFirst =
      currentIndex === 0;

    const isLast =
      currentIndex === currentGallery.length - 1;

    prevButton.disabled = isFirst;
    nextButton.disabled = isLast;

  }

  function showGalleryItem(index) {

    const item =
      currentGallery[index];

    if (!item) return;

    currentIndex = index;

    modalImage.src =
      item.dataset.src;

    modalCaption.textContent =
      item.dataset.caption || "";

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
    if (e.target.dataset.close === "modal") {
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

  if (!form) return;

  form.addEventListener('submit', (e) => {

    e.preventDefault();

    console.log(
      'SUBMIT INTERCEPTADO'
    );

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

