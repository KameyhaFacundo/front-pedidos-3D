import { useState, useEffect, useMemo } from 'react';
import { getMenu, getMesas } from '../api/client';
import { useCart } from '../context/CartContext';
import { useOrderMode } from '../context/OrderModeContext';
import ARViewer from '../components/ARViewer';
import PlatoDetailModal from '../components/PlatoDetailModal';
import { MenuSkeleton } from '../components/Skeletons';

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
  const [detailPlato, setDetailPlato] = useState(null);
  const [categoria, setCategoria] = useState('');
  const { addToCart, updateQuantity, items: cartItems } = useCart();
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

  const handleARAddToCart = (plato) => {
    setArPlato(null);
    if (plato.presentaciones?.length > 0 || plato.agregados?.length > 0) {
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
      <header className="menu-header">
        <div className="menu-eyebrow">
          {tipo === 'mesa' ? `Mesa ${mesaNumero || '...'}` : 'Para retirar'}
        </div>
        <h1 className="menu-brand">
          pedido<span>3D</span>
        </h1>
      </header>

      <div className="chips">
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
        <div className="chips-row">
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
                    {qty > 0 ? (
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
                          onClick={() => handleMenuItemClick(plato)}
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    ) : plato.modelo_glb ? (
                      <button
                        className="ar-pill"
                        onClick={(e) => { e.stopPropagation(); setArPlato(plato); }}
                      >
                        <i className="ti ti-camera"></i>VER EN AR
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {arPlato && (
        <ARViewer
          plato={arPlato}
          onClose={() => setArPlato(null)}
          onAddToCart={handleARAddToCart}
        />
      )}

      {detailPlato && (
        <PlatoDetailModal plato={detailPlato} onClose={() => setDetailPlato(null)} />
      )}
    </div>
  );
}
