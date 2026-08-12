import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'pidevo_themes';

function getStoredThemes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('pedido3d_themes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.client && parsed.admin) return parsed;
    }
  } catch {}
  return { client: 'dark', admin: 'dark' };
}

function getScope(pathname) {
  if (/^\/([^\/]+\/)?(admin|cocina|llamados)/.test(pathname)) return 'admin';
  return 'client';
}

export function ThemeProvider({ children }) {
  const location = useLocation();
  const scope = getScope(location.pathname);
  const [themes, setThemes] = useState(getStoredThemes);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themes[scope]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  }, [themes, scope]);

  const toggleTheme = useCallback(() => {
    setThemes((prev) => {
      const next = { ...prev, [scope]: prev[scope] === 'dark' ? 'light' : 'dark' };
      return next;
    });
  }, [scope]);

  return (
    <ThemeContext.Provider value={{ theme: themes[scope], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
