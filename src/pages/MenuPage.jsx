import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMenu, getMesas } from '../api/client';
import { useCart } from '../context/CartContext';
import { useOrderMode } from '../context/OrderModeContext';
import { useCompany } from '../context/CompanyContext';
import PlatoDetailModal from '../components/PlatoDetailModal';
import { MenuSkeleton } from '../components/Skeletons';

const ARViewer = lazy(() => import('../components/ARViewer'));

const CATEGORIAS = [
  { key: '', label: 'Todos' },
  { key: 'principales', label: 'Principales' },
  { key: 'entradas', label: 'Entradas' },
  { key: 'postres', label: 'Postres' },
  { key: 'bebidas', label: 'Bebidas' },
];

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === '1';

  // Demo defaults — will set slug and show 'Pidevo' while API loads
  const DEMO_COMPANY_SLUG = 'demo';

  const [platos, setPlatos] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arPlato, setArPlato] = useState(null);
  const [detailPlato, setDetailPlato] = useState(null);
  const [categoria, setCategoria] = useState('');
  const { addToCart, updateQuantity, items: cartItems } = useCart();
  const { tipo, mesaId } = useOrderMode();
  const { path } = useCompany();
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    if (isDemo) {
      let prev = null;
      try {
        prev = localStorage.getItem('pidevo_slug');
        localStorage.setItem('pidevo_slug', DEMO_COMPANY_SLUG);
      } catch {}
      setEmpresa({ nombre: 'Pidevo', slug: DEMO_COMPANY_SLUG });
      getMesas().then(setMesas).catch(() => {});
      return () => {
        try {
          if (prev) localStorage.setItem('pidevo_slug', prev);
          else localStorage.removeItem('pidevo_slug');
        } catch {}
      };
    }
    getMesas().then(setMesas).catch(() => {});
  }, [isDemo]);

  const mesaNumero = useMemo(() => {
    const mesa = mesas.find((m) => m.id === mesaId);
    return mesa ? mesa.numero : null;
  }, [mesas, mesaId]);

  const cerrado = empresa?.abierto === false;
  const estimado = empresa?.tiempo_estimado;

  useEffect(() => {
    // If demo mode, we already set localStorage slug and empresa above; proceed to call API
    getMenu()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.platos || []);
        setPlatos(list);
        if (!Array.isArray(data) && data?.empresa) setEmpresa(data.empresa);
        setLoading(false);
      })
      .catch((err) => {
        const msg = (err && err.message) || '';
        if (msg.toLowerCase().includes('empresa')) {
          // Empresa no encontrada: redirigimos al landing
          window.location.href = '/';
          return;
        }
        setError(msg || 'Error al cargar el menú');
        setLoading(false);
      });
  }, [isDemo]);

  // auto-open picker support: if query ?open_picker=1, navigate back to mode select with picker
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('open_picker') === '1') {
        // redirect to mode select where the picker will open
        window.location.href = `${path('/')}?${params.toString()}`;
      }
    } catch {}
  }, [path]);

  const [search, setSearch] = useState('');

  const filteredPlatos = (() => {
    let result = categoria
      ? platos.filter((p) => (p.categoria || 'principales') === categoria && p.disponible !== false)
      : platos.filter((p) => p.disponible !== false);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q));
    }
    return result;
  })();

  const handleMenuItemClick = (plato) => {
    setDetailPlato(plato);
  };

  const tieneVariantes = (plato) =>
    (plato.presentaciones?.length || 0) > 0 || (plato.agregados?.length || 0) > 0;

  const handleARAddToCart = (plato) => {
    setArPlato(null);
    if (tieneVariantes(plato)) {
      setDetailPlato(plato);
    } else {
      addToCart(plato);
    }
  };

  if (loading) return <MenuSkeleton />;

  if (error) {
    return (
      <div className="page-center">
        <div className="error-message">
          <p>Error al cargar el menú: {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {isDemo && (
        <div className="demo-banner">
          MODO DEMO — datos ficticios. No se están usando datos reales.
        </div>
      )}
      {cerrado && (
        <div className="cerrado-banner">
          <i className="ti ti-clock-off"></i>
          El local está cerrado por ahora. Podés ver el menú, pero no se pueden hacer pedidos.
        </div>
      )}
      <header className="menu-header">
        <Link to={path('/')} className="back-link">
          <i className="ti ti-arrow-left"></i>
          Volver
        </Link>
        <div className="menu-eyebrow">
          {empresa?.logo && <img src={empresa.logo} alt="" className="menu-brand-logo" />}
          {empresa?.nombre || 'Menú'} · {tipo === 'mesa' ? `Mesa ${mesaNumero || '...'}` : 'Para retirar'}
          {estimado ? ` · Entrega estimada: ${estimado} min` : ''}
        </div>
      </header>

      <div className="menu-toolbar">
        <div className="menu-search">
          <i className="ti ti-search"></i>
          <input
            type="text"
            placeholder="Buscar plato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <i className="ti ti-x"></i>
            </button>
          )}
        </div>
        <div className="chips">
          {CATEGORIAS.map(({ key, label }) => (
            <button
              key={key}
              className={`chip ${categoria === key ? 'active' : ''}`}
              onClick={() => setCategoria(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredPlatos.length === 0 ? (
        <div className="page-center">
          <p>No hay platos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="menu-list">
          {filteredPlatos.map((plato) => {
            const platoCartItems = cartItems.filter((i) => i.plato.id === plato.id);
            const qty = platoCartItems.reduce((sum, i) => sum + i.cantidad, 0);
            return (
              <div
                key={plato.id}
                className="menu-item"
                onClick={() => handleMenuItemClick(plato)}
              >
                <div className="menu-item-thumb">
                  {plato.foto ? (
                    <img
                      src={plato.foto}
                      alt={plato.nombre}
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="thumb-icon-placeholder">
                      <i className="ti ti-meat"></i>
                    </div>
                  )}
                  <div className="thumb-sweep"></div>
                </div>

                <div className="menu-item-info">
                  <div className="menu-item-name">{plato.nombre}</div>
                  <div className="menu-item-desc">
                    {plato.descripcion || 'Plato elaborado con ingredientes frescos de estación.'}
                  </div>
                  <div className="menu-item-bottom">
                    <div className="menu-item-price">
                      {plato.presentaciones?.length > 0
                        ? `Desde $${Math.min(...plato.presentaciones.map((p) => Number(p.precio))).toFixed(2)}`
                        : `$${Number(plato.precio).toFixed(2)}`}
                    </div>
                    {cerrado ? (
                      <span className="cerrado-pill">Local cerrado</span>
                    ) : qty > 0 ? (
                      <div className="stepper" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="stepper-btn"
                          onClick={() => updateQuantity(platoCartItems[platoCartItems.length - 1].key, qty - 1)}
                        >
                          <i className="ti ti-minus"></i>
                        </button>
                        <span className="stepper-val">{qty}</span>
                        <button
                          className="stepper-btn"
                          onClick={() => (tieneVariantes(plato) ? handleMenuItemClick(plato) : addToCart(plato))}
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="menu-item-actions">
                        {plato.modelo_glb && (
                          <button
                            className="ar-pill"
                            onClick={(e) => { e.stopPropagation(); setArPlato(plato); }}
                          >
                            <i className="ti ti-camera"></i>VER EN AR
                          </button>
                        )}
                        <button
                          className="quick-add"
                          onClick={(e) => { e.stopPropagation(); tieneVariantes(plato) ? handleMenuItemClick(plato) : addToCart(plato); }}
                          aria-label={`Agregar ${plato.nombre}`}
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {arPlato && (
        <Suspense fallback={null}>
          <ARViewer
            plato={arPlato}
            onClose={() => setArPlato(null)}
            onAddToCart={handleARAddToCart}
          />
        </Suspense>
      )}

      {detailPlato && (
        <PlatoDetailModal plato={detailPlato} onClose={() => setDetailPlato(null)} />
      )}
    </div>
  );
}
