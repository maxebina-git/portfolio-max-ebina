// =====================================================
// BACK TO TOP BUTTON
// =====================================================

function initBackToTop() {
  const button = document.getElementById('back-to-top');

  if (!button) return;

  const trigger = window.innerHeight * 0.1;

  let isVisible = false;

  // =====================================================
  // SHOW / HIDE ON SCROLL (fade + scale)
  // =====================================================

  function handleScroll() {
    const shouldShow = window.scrollY > trigger;

    if (shouldShow && !isVisible) {
      isVisible = true;

      button.classList.remove(
        'opacity-0',
        'scale-90',
        'pointer-events-none'
      );

      button.classList.add(
        'opacity-100',
        'scale-100'
      );
    }

    if (!shouldShow && isVisible) {
      isVisible = false;

      button.classList.remove(
        'opacity-100',
        'scale-100'
      );

      button.classList.add(
        'opacity-0',
        'scale-90',
        'pointer-events-none'
      );
    }
  }

  window.addEventListener('scroll', handleScroll, {
    passive: true
  });

  // =====================================================
  // SMOOTH SCROLL (custom easing)
  // =====================================================

  button.addEventListener('click', () => {
    const start = window.scrollY;
    const startTime = performance.now();
    const duration = 800;

    function easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = easeInOutCubic(progress);

      window.scrollTo(
        0,
        start * (1 - eased)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  });

  // =====================================================
  // INIT STATE (important)
  // =====================================================

  handleScroll();
}

initBackToTop();