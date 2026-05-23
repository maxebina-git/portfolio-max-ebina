export const createObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
  
          // reveal system
          if (el.classList.contains('reveal-item')) {
            if (entry.isIntersecting) {
              el.classList.add('is-visible');
              el.classList.remove('exit-right');
            } else {
              el.classList.remove('is-visible');
              el.classList.add('exit-right');
            }
          }
  
          // section highlight system
          if (el.id === 'cases') {
            el.classList.toggle('bg-active', entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.4,
      }
    );
  
    const observeElements = (sections, revealItems, extra = []) => {
      sections.forEach((s) => observer.observe(s));
      revealItems.forEach((r) => observer.observe(r));
      extra.forEach((e) => observer.observe(e));
    };
  
    return {
      observer,
      observeElements,
    };
  };