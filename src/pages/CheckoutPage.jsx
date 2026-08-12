import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrderMode } from '../context/OrderModeContext';
import { getMesas, createPedido } from '../api/client';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { tipo, mesaId } = useOrderMode();
  const [mesas, setMesas] = useState([]);
  const [medioPago, setMedioPago] = useState('efectivo');
  const [notas, setNotas] = useState('');
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getMesas()
      .then((data) => setMesas(data))
      .catch(() => setError('No se pudieron cargar las mesas'));
  }, []);

  const mesaNumero = mesas.find((m) => m.id === mesaId)?.numero;

  const handleSubmit = async () => {
    if (!tipo) {
      setError('Seleccioná cómo querés pedir');
      return;
    }

    setSubmitting(true);
    setError(null);

    const pedidoData = {
      tipo,
      mesa_id: tipo === 'mesa' ? mesaId : null,
      nombre: nombre.trim() || null,
      celular: celular.trim() || null,
      medio_pago: medioPago,
      notas: notas.trim() || undefined,
      items: items.map(({ plato, cantidad }) => ({
        plato_id: plato.id,
        cantidad,
      })),
    };

    try {
      const result = await createPedido(pedidoData);
      localStorage.setItem('pedido3d_last_order', JSON.stringify({ id: result.id, tipo, mesaNumero: mesaNumero || null, fecha: new Date().toISOString() }));
      setSuccess(result);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="page-center cart-empty">
        <h2>No hay items en tu pedido</h2>
        <Link to="/menu" className="btn btn-primary">Volver al menú</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-center checkout-success">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CB43D" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <h2>¡Pedido confirmado!</h2>
        <p>Tu pedido #{success.id} ha sido registrado.</p>
        <p className="success-estado">Estado: {success.estado}</p>

        <a
          href={(() => {
            const restoPhone = '5493815069332';
            const itemsTexto = items.map(({ plato, cantidad }) =>
              `${cantidad}x ${plato.nombre.toUpperCase()}: $${(plato.precio * cantidad).toFixed(2)}`
            ).join('%0A');
            const total = getTotal().toFixed(2);
            const nombreCliente = nombre || 'Cliente';
            const msg = `¡Hola! Te paso el resumen de mi pedido%0A%0APedido: #${success.id}%0ANombre: ${nombreCliente}%0ATeléfono: ${celular || '---'}%0A%0AForma de pago: ${medioPago}%0ATotal: $${total}%0A%0A${tipo === 'mesa' ? `Estoy en la Mesa ${mesaNumero}` : 'Retiro en el local'}%0A%0AMi pedido es:%0A%0A${itemsTexto}%0A%0ATOTAL: $${total}%0A%0AEspero tu respuesta para confirmar mi pedido 🙌`;
            return `https://wa.me/${restoPhone}?text=${msg}`;
          })()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-block"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16,
            background: '#25D366', color: '#fff', border: 'none', textDecoration: 'none', width: '100%', maxWidth: 300,
          }}
        >
          <i className="ti ti-brand-whatsapp" style={{ fontSize: 20 }}></i>
          Enviar por WhatsApp
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300, marginTop: 12 }}>
          <button className="btn btn-outline" onClick={() => navigate(`/pedido/${success.id}`)}>
            <i className="ti ti-eye"></i> Ver seguimiento
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/menu')}>
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="page-header">
        <Link to="/carrito" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al carrito
        </Link>
        <h1>Confirmar pedido</h1>
      </header>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}

      <div className="checkout-section">
        <h2>Modalidad</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {tipo === 'mesa' ? (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A36" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span style={{ fontWeight: 600, color: 'var(--cream)', fontSize: 15 }}>
                Mesa {mesaNumero || '...'}
              </span>
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0B429" strokeWidth="2">
                <rect x="4" y="9" width="16" height="11" rx="2" />
                <path d="M8 9V6a4 4 0 0 1 8 0v3" />
              </svg>
              <span style={{ fontWeight: 600, color: 'var(--cream)', fontSize: 15 }}>
                Retiro en el local
              </span>
            </>
          )}
          <Link to="/" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
            Cambiar
          </Link>
        </div>
      </div>

      <div className="checkout-section">
        <h2>Tus datos</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Celular</label>
            <input
              type="tel"
              placeholder="381 5069332"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="checkout-section">
        <h2>Medio de pago</h2>
        <div className="radio-group">
          <label className={`radio-card ${medioPago === 'efectivo' ? 'active' : ''}`}>
            <input
              type="radio"
              name="medioPago"
              value="efectivo"
              checked={medioPago === 'efectivo'}
              onChange={(e) => setMedioPago(e.target.value)}
            />
            <div className="radio-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              <span>Efectivo</span>
            </div>
          </label>
          <label className={`radio-card ${medioPago === 'transferencia' ? 'active' : ''}`}>
            <input
              type="radio"
              name="medioPago"
              value="transferencia"
              checked={medioPago === 'transferencia'}
              onChange={(e) => setMedioPago(e.target.value)}
            />
            <div className="radio-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span>Transferencia</span>
            </div>
          </label>
        </div>
      </div>

      <div className="checkout-section">
        <h2>Notas especiales</h2>
        <textarea
          className="input-textarea"
          placeholder="Ej: sin cebolla, cocción medio, sin picante..."
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
        />
      </div>

      <div className="checkout-section">
        <h2>Resumen del pedido</h2>
        <div className="checkout-summary">
          {items.map(({ plato, cantidad }) => (
            <div key={plato.id} className="summary-item">
              <span>
                {cantidad} x {plato.nombre}
              </span>
              <span>${(plato.precio * cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block btn-lg"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Confirmando...' : 'Confirmar pedido'}
      </button>
    </div>
  );
}
