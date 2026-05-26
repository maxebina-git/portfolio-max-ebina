import renderEngine from './renderEngine.js';

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
    console.log('THEME BUTTON NOT FOUND');
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

  if (!loader) {

    renderEngine.init();

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

      requestAnimationFrame(() => {

        loader.style.transition =
          'opacity 1400ms ease';

        loader.style.opacity = '0';

        setTimeout(() => {

          loader.remove();

          document.body.classList.remove(
            'overflow-hidden'
          );

          // ENGINE SÓ COMEÇA AQUI
          renderEngine.init();

        }, 1400);

      });

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

});