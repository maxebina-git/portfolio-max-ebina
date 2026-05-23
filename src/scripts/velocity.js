let lastScrollTime = performance.now();
let lastScrollY = window.scrollY;

export const createVelocityTracker = () => {
  const state = {
    velocity: 0,
  };

  const calculateVelocity = () => {
    const now = performance.now();
    const deltaY = Math.abs(window.scrollY - lastScrollY);
    const deltaTime = now - lastScrollTime;

    const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

    lastScrollY = window.scrollY;
    lastScrollTime = now;

    state.velocity = velocity;

    return velocity;
  };

  const getMotionIntensity = () => {
    if (state.velocity < 0.5) return 'low';
    if (state.velocity < 2) return 'medium';
    return 'high';
  };

  const applyMotion = () => {
    const intensity = getMotionIntensity();
    document.documentElement.setAttribute('data-motion', intensity);
  };

  return {
    state,
    calculateVelocity,
    getMotionIntensity,
    applyMotion,
  };
};