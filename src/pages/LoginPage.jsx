import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login as apiLogin, getEmpresa } from '../api/client';
import { useAuth } from '../context/AuthContext';

function defaultRouteForRole(rol) {
  if (rol === 'cocina') return 'cocina';
  if (rol === 'mozo') return 'llamados';
  return 'admin';
}

function getSlugFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const [first, second] = segments;
  return first && second === 'login' ? first : null;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathSlug = getSlugFromPath(location.pathname);
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    if (!pathSlug) return;
    getEmpresa(pathSlug)
      .then(setEmpresa)
      .catch(() => setEmpresa(null));
  }, [pathSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completá tu email y contraseña');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      login(data.token, data.user);
      const userSlug = data.user?.slug;
      const slug = userSlug || pathSlug;
      if (slug) {
        localStorage.setItem('pidevo_slug', slug);
      }
      navigate(slug ? `/${slug}/${defaultRouteForRole(data.user?.rol)}` : '/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-blob login-blob-1"></div>
      <div className="login-bg-blob login-blob-2"></div>

      <div className="login-card">
        <Link to="/" className="login-brand" aria-label="Volver a Pidevo">
          {empresa?.logo ? (
            <img src={empresa.logo} alt={empresa.nombre || 'Logo'} className="brand-logo" />
          ) : (
            <img src="/pidevo.png" alt="Pidevo" className="brand-logo" />
          )}
        </Link>
        <h1 className="login-title">Bienvenido de nuevo</h1>
        <p className="login-sub">Ingresá a tu panel de pedidos</p>

        {error && (
          <div className="alert alert-error login-error">
            <i className="ti ti-alert-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" data-allow-autocomplete>
          <div className="field">
            <label>Email</label>
            <div className="login-input-wrap">
              <i className="ti ti-mail"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pidevo.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label>Contraseña</label>
            <div className="login-input-wrap">
              <i className="ti ti-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="login-row">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordarme</span>
            </label>
            <button type="button" className="login-forgot">¿Olvidaste tu contraseña?</button>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg login-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner"></span> Ingresando...
              </>
            ) : (
              <>Ingresar <i className="ti ti-arrow-right"></i></>
            )}
          </button>
        </form>

        <div className="login-footer">
          <span>¿No tenés cuenta?</span>
          <Link to="/" className="login-footer-link">Crear mi local</Link>
        </div>
      </div>
    </div>
  );
}