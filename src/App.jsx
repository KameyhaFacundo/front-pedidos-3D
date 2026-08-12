import { Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
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

function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
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

export default function App() {
  const location = useLocation();
  const adminAreaRegex = /^\/([^\/]+\/)?(admin|cocina|llamados)/;
  const isAdmin = adminAreaRegex.test(location.pathname);
  const isLanding = location.pathname === '/' || location.pathname === '/landing';
  const hideFooter = isLanding || /^\/(?:[^\/]+\/)?(?:admin|cocina|llamados|login)/.test(location.pathname);

  return (
    <ThemeProvider>
    <NotificationProvider>
    <AuthProvider>
      <OrderModeProvider>
      <CompanyProvider>
        <Navbar />
        <main key={location.pathname} className={`page-fade ${isAdmin || isLanding ? '' : 'main-content'}`}>
          <div className="app-content">
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
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
        <Toast />
      </CompanyProvider>
      </OrderModeProvider>
    </AuthProvider>
    </NotificationProvider>
    </ThemeProvider>
  );
}
