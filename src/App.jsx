import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { OrderModeProvider } from './context/OrderModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import ModeSelectPage from './pages/ModeSelectPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CocinaPage from './pages/CocinaPage';
import LlamadosPage from './pages/LlamadosPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PedidoTrackingPage from './pages/PedidoTrackingPage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { slug } = useCompany();
  if (!isAuthenticated) return <Navigate to={slug ? `/${slug}/login` : '/login'} replace />;
  return children;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
      <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`}></i>
    </button>
  );
}

function CompanyLayout() {
  return <Outlet />;
}

function RedirectHumber() {
  const loc = useLocation();
  const to = loc.pathname.replace(/^\/humber/, '/demo') + loc.search;
  return <Navigate to={to} replace />;
}

function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { path, empresa } = useCompany();

  const isLanding = location.pathname === '/' || location.pathname === '/landing';
  const isAdminArea = /^\/([^\/]+\/)?(?:admin|cocina|llamados)/.test(location.pathname);
  const isLogin = location.pathname === '/login' || /^\/[^\/]+\/login$/.test(location.pathname);

  if (isLanding || isLogin || isAdminArea) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={path('/')} className="navbar-brand">
          {empresa?.nombre ? (
            <span className="navbar-empresa">{empresa.nombre}</span>
          ) : (
            <img src="/pidevo.png" alt="Pidevo" className="brand-logo" />
          )}
        </Link>

        <div className="navbar-links">
          <ThemeToggle />
          <Link to={path('/carrito')} className="nav-cart-link">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Overlay used for /demo/* (launched from the landing with a
// backgroundLocation so the landing stays mounted behind it) -- a visible
// close button + backdrop makes it read as "a contained preview" without
// needing to label it with the word "demo" anywhere.
function DemoModal() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const close = () => navigate('/');

  // La demo escribe pidevo_slug (slug de la empresa demo). Al cerrarla,
  // restauramos el slug previo para no dejar contaminado el localStorage.
  useEffect(() => {
    let prev = null;
    try {
      prev = localStorage.getItem('pidevo_slug');
    } catch {}
    return () => {
      try {
        if (prev) localStorage.setItem('pidevo_slug', prev);
        else localStorage.removeItem('pidevo_slug');
      } catch {}
    };
  }, []);

  return (
    <div className="overlay active" onClick={close}>
      <div className="demo-modal-wrap" onClick={(e) => e.stopPropagation()}>
        <button className="demo-modal-close" onClick={close} aria-label="Cerrar">
          <i className="ti ti-x"></i>
        </button>
        <div className="demo-modal">
          <div className="demo-modal-notch"></div>
          <div className="demo-modal-bar">
            <Link to="/demo" className="demo-modal-brand">
              <img src="/pidevo.png" alt="Pidevo" />
            </Link>
            <div className="demo-modal-actions">
              <ThemeToggle />
              <Link to="/demo/carrito" className="nav-cart-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
              </Link>
            </div>
          </div>
          <div className="demo-modal-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isDemoPath = location.pathname.startsWith('/demo');

  // Wherever the app was last *not* on /demo/* -- kept passively in sync on
  // every render, not threaded through each navigate()/Link call inside the
  // demo flow (mode -> mesa -> menu -> cart -> checkout all use their own
  // internal navigation with no idea a modal is open, so relying on
  // react-router location.state to survive every hop is fragile; this
  // ref-free "last background" tracker isn't).
  const [backgroundLocation, setBackgroundLocation] = useState(null);
  useEffect(() => {
    if (!isDemoPath) setBackgroundLocation(location);
  }, [location, isDemoPath]);

  // Only render /demo/* as a modal-over-background when we actually have a
  // background to show behind it. A direct load/refresh on /demo/menu has
  // no prior page to fall back to -- render it as a normal full page then.
  const isDemoOpen = isDemoPath && backgroundLocation !== null;
  const bgPathname = (isDemoOpen ? backgroundLocation : location).pathname;

  const adminAreaRegex = /^\/([^\/]+\/)?(admin|cocina|llamados)/;
  const isAdmin = adminAreaRegex.test(bgPathname);
  const isLanding = bgPathname === '/' || bgPathname === '/landing';
  const hideFooter = isLanding || /^\/(?:[^\/]+\/)?(?:admin|cocina|llamados|login)/.test(bgPathname);

  return (
    <ThemeProvider>
    <NotificationProvider>
    <AuthProvider>
      <OrderModeProvider>
      <CompanyProvider>
        {!isDemoOpen && <Navbar />}
        <main key={bgPathname} className={`page-fade ${isAdmin || isLanding ? '' : 'main-content'}`}>
          <div className="app-content">
            <Routes location={isDemoOpen ? backgroundLocation : location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
                  <Route path="/pidevo" element={<Navigate to="/demo/menu?demo=1" replace />} />
                  <Route path="/pidevo/demo" element={<Navigate to="/demo/menu?demo=1" replace />} />
                  <Route path="/humber/*" element={<RedirectHumber />} />
              <Route path="/:slug/*" element={<CompanyLayout />}>
                <Route index element={<ModeSelectPage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="carrito" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="pedido/:id" element={<PedidoTrackingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cocina"
                  element={
                    <ProtectedRoute>
                      <CocinaPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="llamados"
                  element={
                    <ProtectedRoute>
                      <LlamadosPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          {!hideFooter && <Footer />}
        </main>
        {isDemoOpen && (
          <Routes>
            <Route path="/demo/*" element={<DemoModal />}>
              <Route index element={<ModeSelectPage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="carrito" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="pedido/:id" element={<PedidoTrackingPage />} />
            </Route>
          </Routes>
        )}
        <Toast />
      </CompanyProvider>
      </OrderModeProvider>
    </AuthProvider>
    </NotificationProvider>
    </ThemeProvider>
  );
}
