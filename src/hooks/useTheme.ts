// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

const KEY = 'ct-admin-theme';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(KEY) === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => setIsDark((p) => !p);

  return { isDark, toggleDark };
}
