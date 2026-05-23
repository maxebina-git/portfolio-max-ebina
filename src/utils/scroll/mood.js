const MOODS = {
    hero: 'cinematic',
    cases: 'neutral',
    ecossistema: 'tech',
    sobre: 'personal',
    conectar: 'cta',
  };
  
  export const createMoodSystem = () => {
    let currentMood = null;
  
    const setMood = (sectionId) => {
      const mood = MOODS[sectionId];
  
      // se não existir mood ou não mudou, não faz nada
      if (!mood || mood === currentMood) return;
  
      currentMood = mood;
  
      document.documentElement.setAttribute('data-mood', mood);
    };
  
    const getCurrentMood = () => currentMood;
  
    const forceMood = (mood) => {
      if (!mood) return;
  
      currentMood = mood;
      document.documentElement.setAttribute('data-mood', mood);
    };
  
    const resetMood = () => {
      currentMood = null;
      document.documentElement.setAttribute('data-mood', 'cinematic');
    };
  
    return {
      setMood,
      getCurrentMood,
      forceMood,
      resetMood,
    };
  };