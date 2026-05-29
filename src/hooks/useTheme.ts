// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

const ADMIN_THEME_KEY = 'ct-admin-theme';
const CUSTOMER_THEME_KEY = 'app-theme';

const applyDocumentTheme = (isDark: boolean) => {
  if (typeof document === 'undefined') return;

  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    return;
  }

  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
};

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return false;
    return (
      localStorage.getItem(ADMIN_THEME_KEY) ||
      localStorage.getItem(CUSTOMER_THEME_KEY)
    ) === 'dark';
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    applyDocumentTheme(isDark);
    localStorage.setItem(ADMIN_THEME_KEY, theme);
    localStorage.setItem(CUSTOMER_THEME_KEY, theme);
    window.dispatchEvent(new CustomEvent('canteen-theme-change', { detail: theme }));
  }, [isDark]);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const theme = (event as CustomEvent<'dark' | 'light'>).detail;
      setIsDark(theme === 'dark');
    };

    window.addEventListener('canteen-theme-change', handleThemeChange);

    return () => window.removeEventListener('canteen-theme-change', handleThemeChange);
  }, []);

  const toggleDark = () => setIsDark((p) => !p);

  return { isDark, toggleDark };
}
