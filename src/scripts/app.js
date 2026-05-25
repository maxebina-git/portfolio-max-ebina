import renderEngine from './renderEngine.js';

let isClicking = false;

// =====================================================
// THEME
// =====================================================

const themeToggle =
  document.getElementById('theme-toggle');

const toggleIcon =
  document.getElementById('toggle-icon');

function updateToggleIcon() {

  if (!toggleIcon) return;

  toggleIcon.textContent =
    document.documentElement.classList.contains('dark')
      ? '🌕'
      : '🌑';

}

function initTheme() {

  updateToggleIcon();

  themeToggle?.addEventListener('click', () => {

    const html =
      document.documentElement;

    html.classList.toggle('dark');

    localStorage.setItem(
      'theme',
      html.classList.contains('dark')
        ? 'dark'
        : 'light'
    );

    updateToggleIcon();

  });

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

      const target =
        document.getElementById(sectionId);

      if (!target) return;

      const start =
        window.scrollY;

      const end =
        target.getBoundingClientRect().top +
        window.scrollY -
        80;

      const distance =
        end - start;

      const duration = 1200;

      let startTime = null;

      function ease(t) {

        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

      }

      function animation(currentTime) {

        if (!startTime)
          startTime = currentTime;

        const timeElapsed =
          currentTime - startTime;

        const progress =
          Math.min(timeElapsed / duration, 1);

        const run =
          start + distance * ease(progress);

        window.scrollTo(0, run);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }

      }
      const newPath =
        sectionId === 'hero'
          ? '/'
          : `/${sectionId}`;

      window.history.replaceState(
        {},
        '',
        newPath
      );

      requestAnimationFrame(animation);

    }


  navLinks.forEach(link => {

    link.addEventListener('click', e => {

      e.preventDefault();

      const href =
        link.getAttribute('href');

      const sectionId =
        href.replace('#', '');

      navigateToSection(sectionId);

    });

  });

  logoLink?.addEventListener('click', e => {

    e.preventDefault();

    navigateToSection('hero');

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

      setTimeout(() => {

        loader?.remove();

        document.body.classList.remove(
          'overflow-hidden'
        );

      }, 500);

    }

  }, 90);

}

// =====================================================
// INIT
// =====================================================

function init() {

  renderEngine.init();

  initTheme();

  initNavigation();

  initLoader();

}

init();