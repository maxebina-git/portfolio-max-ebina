import renderEngine from './renderEngine.js';

let isClicking = false;

// THEME
const themeToggle = document.getElementById('theme-toggle');
const toggleIcon = document.getElementById('toggle-icon');

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
    const html = document.documentElement;

    html.classList.toggle('dark');

    localStorage.setItem(
      'theme',
      html.classList.contains('dark') ? 'dark' : 'light'
    );

    updateToggleIcon();
  });
}

// NAVIGATION
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const logoLink = document.getElementById('logo-link');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      isClicking = true;

      const target = document.querySelector(link.getAttribute('href'));

      if (target) {
        const pos =
          target.getBoundingClientRect().top +
          window.scrollY -
          80;

        window.scrollTo({
          top: pos,
          behavior: 'smooth'
        });

        history.replaceState(null, '', link.getAttribute('href'));
      }

      setTimeout(() => (isClicking = false), 800);
    });
  });

  logoLink?.addEventListener('click', e => {
    e.preventDefault();

    isClicking = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    history.replaceState(null, '', '#hero');

    setTimeout(() => (isClicking = false), 800);
  });
}

// LOADER
function initLoader() {
  window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('fake-loader');
    const fill = document.getElementById('loader-fill');
    const text = document.getElementById('load-percentage');

    let current = 0;

    const interval = setInterval(() => {
      if (current < 100) {
        current += Math.floor(Math.random() * 8) + 2;

        if (current > 100) current = 100;

        if (text) text.textContent = current;
        if (fill) fill.style.height = `${current}%`;

      } else {
        clearInterval(interval);

        setTimeout(() => {
          loader?.remove();
          document.body.classList.remove('overflow-hidden');

          renderEngine.init();

        }, 400);
      }
    }, 90);
  });
}

// BOOTSTRAP
function init() {
  initTheme();
  initNavigation();
  initLoader();
}

init();