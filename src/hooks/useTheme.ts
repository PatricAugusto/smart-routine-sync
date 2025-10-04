import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'neutral' | 'dynamic';

const getTimeBasedTheme = (): 'light' | 'dark' => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
};

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'neutral' || stored === 'dynamic') {
      return stored;
    }
    return 'dynamic';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark' | 'neutral'>(() => {
    if (mode === 'dynamic') return getTimeBasedTheme();
    if (mode === 'neutral') return 'neutral';
    return mode;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      let themeToApply: 'light' | 'dark' | 'neutral';
      
      if (mode === 'dynamic') {
        themeToApply = getTimeBasedTheme();
      } else if (mode === 'neutral') {
        themeToApply = 'neutral';
      } else {
        themeToApply = mode;
      }

      root.classList.remove('light', 'dark', 'neutral');
      root.classList.add(themeToApply);
      setActualTheme(themeToApply);
    };

    applyTheme();
    localStorage.setItem('theme-mode', mode);

    // Atualiza tema dinâmico a cada minuto
    if (mode === 'dynamic') {
      const interval = setInterval(applyTheme, 60000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'neutral', 'dynamic'];
    const currentIndex = themes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % themes.length;
    setMode(themes[nextIndex]);
  };

  const getThemeLabel = () => {
    switch (mode) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'neutral': return 'Neutro';
      case 'dynamic': return 'Dinâmico';
    }
  };

  return { mode, actualTheme, cycleTheme, getThemeLabel };
};
