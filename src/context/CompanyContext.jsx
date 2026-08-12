import { createContext, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmpresa } from '../api/client';

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const params = useParams();
  const slug = params.slug || null;

  useEffect(() => {
    if (slug) {
      localStorage.setItem('pidevo_slug', slug);
      getEmpresa()
        .then((empresa) => {
          localStorage.setItem('pidevo_empresa', JSON.stringify(empresa));
        })
        .catch(() => {});
    }
  }, [slug]);

  const path = (p) => (slug ? `/${slug}${p}` : p);

  return (
    <CompanyContext.Provider value={{ slug, path }}>
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
