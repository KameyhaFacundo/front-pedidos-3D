import { useState, useEffect, useMemo } from 'react';
import { getMenu, getMesas } from '../api/client';
import { useCart } from '../context/CartContext';
import { useOrderMode } from '../context/OrderModeContext';
import ARViewer from '../components/ARViewer';

const CATEGORIAS = [
  { key: '', label: 'Todos' },
  { key: 'principales', label: 'Principales' },
  { key: 'entradas', label: 'Entradas' },
  { key: 'postres', label: 'Postres' },
  { key: 'bebidas', label: 'Bebidas' },
];

export default function MenuPage() {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arPlato, setArPlato] = useState(null);
  const [categoria, setCategoria] = useState('');
  const { addToCart } = useCart();
  const { tipo, mesaId } = useOrderMode();
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    getMesas().then(setMesas).catch(() => {});
  }, []);

  const mesaNumero = useMemo(() => {
    const mesa = mesas.find((m) => m.id === mesaId);
    return mesa ? mesa.numero : null;
  }, [mesas, mesaId]);

  useEffect(() => {
    getMenu()
      .then((data) => {
        setPlatos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Warm the browser cache for each dish's GLB as soon as its thumbnail
    // appears in the menu, so it's already downloaded by the time the
    // customer opens AR -- only the on-device tracking wait is left.
    const urls = [...new Set(platos.map((p) => p.modelo_glb).filter(Boolean))];
    const links = urls.map((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      link.href = url;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((link) => link.remove());
  }, [platos]);

  const filteredPlatos = categoria
    ? platos.filter((p) => (p.categoria || 'principales') === categoria)
    : platos;

  const handleMenuItemClick = (plato) => {
    if (plato.disponible) {
      addToCart(plato, 1);
    }
  };

  const handleARAddToCart = (plato) => {
    addToCart(plato, 1);
    setArPlato(null);
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Cargando menú...</p>
      </div>
    );
  }

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
      <header className="menu-header">
        <div className="menu-eyebrow">
          {tipo === 'mesa' ? `Mesa ${mesaNumero || '...'}` : 'Para retirar'}
        </div>
        <h1 className="menu-brand">
          pedido<span>3D</span>
        </h1>
      </header>

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

      {filteredPlatos.length === 0 ? (
        <div className="page-center">
          <p>No hay platos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="menu-list">
          {filteredPlatos.map((plato) => (
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
                  <div className="menu-item-price">${Number(plato.precio).toFixed(2)}</div>
                  {plato.modelo_glb && (
                    <button
                      className="ar-pill"
                      onClick={(e) => { e.stopPropagation(); setArPlato(plato); }}
                    >
                      <i className="ti ti-camera"></i>VER EN AR
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {arPlato && (
        <ARViewer
          plato={arPlato}
          onClose={() => setArPlato(null)}
          onAddToCart={handleARAddToCart}
        />
      )}
    </div>
  );
}
