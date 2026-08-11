import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { OrderModeProvider } from './context/OrderModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ModeSelectPage from './pages/ModeSelectPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CocinaPage from './pages/CocinaPage';
import LlamadosPage from './pages/LlamadosPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();

  if (location.pathname.startsWith('/admin')) return null;
  if (location.pathname === '/login') return null;

  const isClientRoute = ['/', '/menu', '/carrito', '/checkout'].includes(location.pathname);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.5 8 7 10 7 14a5 5 0 0010 0c0-4-2.5-6-5-12z" fill="#FF5A36"/>
            <path d="M12 16a2 2 0 100-4 2 2 0 000 4z" fill="#2A0D04"/>
          </svg>
          pedido<span>3D</span>
        </Link>

        <div className="navbar-links">
          {isClientRoute ? (
            <Link to="/carrito" className="nav-cart-link">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
            </Link>
          ) : (
            <>
              <Link to="/admin" className="nav-link">
                Panel
              </Link>
              <Link
                to="/cocina"
                className={`nav-link ${location.pathname === '/cocina' ? 'active' : ''}`}
              >
                Cocina
              </Link>
              <Link
                to="/llamados"
                className={`nav-link ${location.pathname === '/llamados' ? 'active' : ''}`}
              >
                Llamados
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => { logout(); }}
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                >
                  Salir
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <OrderModeProvider>
        <Navbar />
        <main className={isAdmin ? '' : 'main-content'}>
          <Routes>
            <Route path="/" element={<ModeSelectPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cocina" element={<ProtectedRoute><CocinaPage /></ProtectedRoute>} />
            <Route path="/llamados" element={<ProtectedRoute><LlamadosPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </OrderModeProvider>
    </AuthProvider>
  );
}
