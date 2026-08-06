import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'service-hub-customer:theme';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function applyThemeClass(theme: Theme) {
  // Suppress transitions for one frame so the switch doesn't animate every
  // color/border on the page — mirrors service-hub-admin's ThemeProvider.
  document.documentElement.classList.add('theme-switching');
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
  window.requestAnimationFrame(() => {
    document.documentElement.classList.remove('theme-switching');
  });
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// index.html already ran a blocking inline script that set the `dark` class before
// React hydrates (prevents flash-of-wrong-theme) — this store just needs to agree
// with whatever it picked, not reapply it, hence no applyThemeClass() call here.
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyThemeClass(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));
