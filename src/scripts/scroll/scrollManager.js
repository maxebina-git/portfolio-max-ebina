import { createVelocityTracker } from '../velocity';
import { createObserver } from '../observer';
import { createNavigationSystem } from '../navigation';
import { createMoodSystem } from '../../utils/scroll/mood';

const ScrollManager = () => {
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal-item');
  const casesSection = document.querySelector('#cases');
  const header = document.querySelector('#main-header');

  // =========================
  // MODULES
  // =========================
  const velocity = createVelocityTracker();
  const observerSystem = createObserver();
  const navigation = createNavigationSystem();
  const headerController = navigation.createHeaderController(header);

  // 🎭 MOOD SYSTEM (NOVO)
  const moodSystem = createMoodSystem();

  // =========================
  // SCROLL ENGINE
  // =========================
  const onScroll = () => {
    // ⚡ velocity system
    velocity.calculateVelocity();
    velocity.applyMotion();

    // 🧭 navigation system
    const activeSection = navigation.updateByProximity(sections);

    // 🎭 mood system
    if (activeSection) {
      moodSystem.setMood(activeSection.id);
    }

    // 🧠 header system
    headerController.updateState();

    // 🧭 direction GLOBAL STATE (NOVO)
    document.documentElement.setAttribute(
      'data-scroll-direction',
      headerController.state.direction
    );
  };

  // =========================
  // INIT OBSERVERS
  // =========================
  observerSystem.observeElements(
    sections,
    revealElements,
    casesSection ? [casesSection] : []
  );

  // =========================
  // LISTENER
  // =========================
  window.addEventListener('scroll', onScroll);

  // INIT FIRST FRAME
  onScroll();
};

export default ScrollManager;