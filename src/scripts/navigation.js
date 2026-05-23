export const createNavigationSystem = () => {
    const state = {
      currentSection: null,
      lastSection: null,
    };
  
    const setActiveNav = (id) => {
      if (state.currentSection === id) return;
  
      state.lastSection = state.currentSection;
      state.currentSection = id;
  
      const navLinks = document.querySelectorAll('.nav-link');
  
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
  
        if (href === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };
  
    const getClosestSection = (sections) => {
      const viewportCenter = window.innerHeight / 2;
  
      let closest = null;
      let smallestDistance = Infinity;
  
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
  
        const distance = Math.abs(sectionCenter - viewportCenter);
  
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closest = section;
        }
      });
  
      return closest;
    };
  
    const updateByProximity = (sections) => {
      const closest = getClosestSection(sections);
  
      if (!closest?.id) return;
  
      setActiveNav(closest.id);
  
      return closest.id;
    };
  
    const createHeaderController = (header) => {
      const state = {
        direction: 'down',
        isAtTop: true,
        scrollY: window.scrollY,
      };
  
      const updateHeader = () => {
        if (!header) return;
  
        if (state.isAtTop) {
          header.classList.add('header-expanded');
          header.classList.remove('header-hidden');
          return;
        }
  
        if (state.direction === 'down') {
          header.classList.add('header-hidden');
          header.classList.remove('header-expanded');
        }
  
        if (state.direction === 'up') {
          header.classList.remove('header-hidden');
          header.classList.remove('header-expanded');
        }
      };
  
      const updateState = () => {
        const currentY = window.scrollY;
  
        state.direction = currentY > state.scrollY ? 'down' : 'up';
        state.scrollY = currentY;
        state.isAtTop = currentY < 10;
  
        updateHeader();
      };
  
      return {
        state,
        updateState,
      };
    };
  
    return {
      state,
      setActiveNav,
      updateByProximity,
      createHeaderController,
    };
  };