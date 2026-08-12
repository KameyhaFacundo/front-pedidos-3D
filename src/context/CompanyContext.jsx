import { createContext, useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const params = useParams();
  const location = useLocation();

  const slug = params.slug || null;

  useEffect(() => {
    if (slug) {
      localStorage.setItem('pidevo_slug', slug);
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
  return context || { slug: localStorage.getItem('pidevo_slug'), path: (p) => p };
}
