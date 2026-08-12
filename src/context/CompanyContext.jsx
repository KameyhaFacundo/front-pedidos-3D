import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getEmpresa } from '../api/client';

const CompanyContext = createContext(null);

const RESERVED = ['admin', 'cocina', 'llamados', 'login', 'landing'];

export function CompanyProvider({ children }) {
  const location = useLocation();
  const [empresa, setEmpresa] = useState(null);

  const segments = location.pathname.split('/').filter(Boolean);
  const first = segments[0];
  const slug = first && !RESERVED.includes(first) ? first : null;

  useEffect(() => {
    if (slug) {
      localStorage.setItem('pidevo_slug', slug);
      getEmpresa()
        .then((e) => {
          setEmpresa(e);
          localStorage.setItem('pidevo_empresa', JSON.stringify(e));
        })
        .catch(() => setEmpresa(null));
    } else {
      setEmpresa(null);
    }
  }, [slug]);

  const path = (p) => (slug ? `/${slug}${p}` : p);

  return (
    <CompanyContext.Provider value={{ slug, empresa, path }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context) return context;

  let empresa = null;
  try {
    empresa = JSON.parse(localStorage.getItem('pidevo_empresa') || 'null');
  } catch {}

  return {
    slug: localStorage.getItem('pidevo_slug'),
    empresa,
    path: (p) => {
      const s = localStorage.getItem('pidevo_slug');
      return s ? `/${s}${p}` : p;
    },
  };
}
