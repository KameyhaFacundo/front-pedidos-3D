import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrderMode } from '../context/OrderModeContext';
import { useCompany } from '../context/CompanyContext';
import { getMesas, createPedido, validarCupon } from '../api/client';

function formatear(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ENTREGAS = [
  { key: 'mesa', label: 'Lo consumo en el local', icon: 'ti-tools-kitchen-2' },
  { key: 'retiro', label: 'Lo retiro personalmente', icon: 'ti-shopping-bag' },
  { key: 'envio', label: 'Necesito que me lo envíen', icon: 'ti-truck-delivery' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { tipo: modoTipo, mesaId: modoMesaId } = useOrderMode();
  const { path } = useCompany();
  const [mesas, setMesas] = useState([]);
  const [entrega, setEntrega] = useState(modoTipo === 'retiro' ? 'retiro' : 'mesa');
  const [mesaId, setMesaId] = useState(modoMesaId || '');
  const [direccion, setDireccion] = useState('');
  const [medioPago, setMedioPago] = useState('efectivo');
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [cuponCodigo, setCuponCodigo] = useState('');
  const [cupon, setCupon] = useState(null);
  const [cuponError, setCuponError] = useState(null);
  const [validando, setValidando] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getMesas()
      .then((data) => setMesas(data))
      .catch(() => {});
  }, []);

  const mesaNumero = useMemo(
    () => mesas.find((m) => m.id === Number(mesaId))?.numero,
    [mesas, mesaId]
  );

  const subtotal = getTotal();

  const descuento = useMemo(() => {
    if (!cupon) return 0;
    if (cupon.tipo === 'porcentaje') return Math.round(subtotal * (cupon.descuento / 100) * 100) / 100;
    return Math.min(Number(cupon.descuento), subtotal);
  }, [cupon, subtotal]);

  const total = subtotal - descuento;

  const handleValidarCupon = async () => {
    if (!cuponCodigo.trim()) return;
    setValidando(true);
    setCuponError(null);
    try {
      const result = await validarCupon(cuponCodigo.trim());
      setCupon(result);
    } catch (err) {
      setCupon(null);
      setCuponError(err.message);
    } finally {
      setValidando(false);
    }
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setError('Ingresá tu nombre');
      return;
    }
    if (!celular.trim()) {
      setError('Ingresá tu teléfono');
      return;
    }

    setSubmitting(true);
    setError(null);

    const pedidoData = {
      tipo: entrega,
      mesa_id: entrega === 'mesa' ? (Number(mesaId) || null) : null,
      direccion: entrega === 'envio' ? direccion.trim() || null : null,
      nombre: nombre.trim(),
      celular: celular.trim(),
      medio_pago: medioPago,
      cupon_codigo: cupon ? cupon.codigo : undefined,
      items: items.map((item) => ({
        plato_id: item.plato.id,
        cantidad: item.cantidad,
        presentacion_nombre: item.presentacion || null,
        agregados: item.agregados || [],
        observacion: item.observacion || null,
      })),
    };

    try {
      const result = await createPedido(pedidoData);
      localStorage.setItem('pidevo_last_order', JSON.stringify({ id: result.id, token: result.token, tipo: entrega, mesaNumero: mesaNumero || null, fecha: new Date().toISOString() }));
      setSuccess(result);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const entregaLabel = ENTREGAS.find((e) => e.key === entrega)?.label || '';

  if (items.length === 0 && !success) {
    return (
      <div className="page-center cart-empty">
        <h2>No hay items en tu pedido</h2>
        <Link to={path('/menu')} className="btn btn-primary">Volver al menú</Link>
      </div>
    );
  }

  if (success) {
    const restoPhone = import.meta.env.VITE_RESTAURANT_PHONE || '5493815069332';
    const itemsTexto = items.map((item) => {
      let linea = `${item.cantidad}x ${item.plato.nombre.toUpperCase()}`;
      if (item.presentacion) linea += ` (${item.presentacion.toUpperCase()})`;
      if (item.agregados?.length) {
        linea += ' + ' + item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(' + ');
      }
      linea += `: ${formatear(item.precioUnitario * item.cantidad)}`;
      if (item.observacion) linea += `%0A  ↳ Obs: ${item.observacion}`;
      return linea;
    }).join('%0A');

    const msg = [
      '¡Hola! Te paso el resumen de mi pedido',
      '',
      `Pedido: #${success.id}`,
      `Nombre: ${nombre}`,
      `Teléfono: ${celular}`,
      '',
      `Forma de pago: ${medioPago}`,
      `Entrega: ${entregaLabel}${entrega === 'mesa' && mesaNumero ? ` (Mesa ${mesaNumero})` : ''}${entrega === 'envio' && direccion ? ` - ${direccion}` : ''}`,
      '',
      'Mi pedido es:',
      itemsTexto,
      '',
      `Subtotal: ${formatear(subtotal)}`,
      descuento > 0 ? `Descuento: -${formatear(descuento)}` : '',
      `TOTAL: ${formatear(total)}`,
      '',
      'Espero tu respuesta para confirmar mi pedido 🙌',
    ].filter((l) => l !== '').join('%0A');

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
          href={`https://wa.me/${restoPhone}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-block"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16,
            background: '#25D366', color: '#fff', border: 'none', textDecoration: 'none', width: '100%', maxWidth: 300,
          }}
        >
          <i className="ti ti-brand-whatsapp" style={{ fontSize: 20 }}></i>
          Pedir por WhatsApp
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300, marginTop: 12 }}>
          <button className="btn btn-outline" onClick={() => navigate(path(`/pedido/${success.id}?t=${success.token}`))}>
            <i className="ti ti-eye"></i> Ver seguimiento
          </button>
          <button className="btn btn-outline" onClick={() => navigate(path('/menu'))}>
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="page-header">
        <Link to={path('/carrito')} className="back-link">
          <i className="ti ti-arrow-left"></i>
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
        <h2>Nombre y apellido</h2>
        <input
          className="input-text"
          type="text"
          placeholder="Necesitamos saber cómo te llamás"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="checkout-section">
        <h2>Teléfono</h2>
        <input
          className="input-text"
          type="tel"
          placeholder="Necesitamos un medio de contacto"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
        />
      </div>

      <div className="checkout-section">
        <h2>Forma de entrega</h2>
        <div className="radio-group">
          {ENTREGAS.map(({ key, label, icon }) => (
            <label key={key} className={`radio-card ${entrega === key ? 'active' : ''}`}>
              <input
                type="radio"
                name="entrega"
                value={key}
                checked={entrega === key}
                onChange={(e) => setEntrega(e.target.value)}
              />
              <div className="radio-content">
                <i className={`ti ${icon}`}></i>
                <span>{label}</span>
              </div>
            </label>
          ))}
        </div>
        {entrega === 'mesa' && (
          <select
            className="select-input"
            value={mesaId}
            onChange={(e) => setMesaId(e.target.value)}
            style={{ marginTop: 10 }}
          >
            <option value="">Seleccioná tu mesa</option>
            {mesas.filter((m) => m.activa).map((mesa) => (
              <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero}</option>
            ))}
          </select>
        )}
        {entrega === 'envio' && (
          <input
            className="input-text"
            type="text"
            placeholder="Dirección de envío"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            style={{ marginTop: 10 }}
          />
        )}
      </div>

      <div className="checkout-section">
        <h2>Forma de pago</h2>
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
              <i className="ti ti-cash"></i>
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
              <i className="ti ti-transfer"></i>
              <span>Transferencia</span>
            </div>
          </label>
        </div>
      </div>

      <div className="checkout-section">
        <h2>Cupón de descuento</h2>
        <div className="cupon-row">
          <input
            className="input-text"
            type="text"
            placeholder="Ingresá el código y validalo"
            value={cuponCodigo}
            onChange={(e) => setCuponCodigo(e.target.value)}
          />
          <button
            className="btn btn-outline btn-sm"
            onClick={handleValidarCupon}
            disabled={validando || !cuponCodigo.trim()}
          >
            {validando ? '...' : 'Validar'}
          </button>
        </div>
        {cuponError && <p className="cupon-error">{cuponError}</p>}
        {cupon && (
          <p className="cupon-ok">
            <i className="ti ti-circle-check"></i> Cupón aplicado: {cupon.codigo}{' '}
            ({cupon.tipo === 'porcentaje' ? `${cupon.descuento}%` : formatear(cupon.descuento)})
          </p>
        )}
      </div>

      <div className="checkout-section">
        <h2>Resumen del pedido</h2>
        <div className="checkout-summary">
          {items.map((item) => (
            <div key={item.key} className="summary-item">
              <span>
                {item.cantidad} x {item.plato.nombre}
                {item.presentacion ? ` (${item.presentacion})` : ''}
                {item.agregados?.length > 0 && (
                  <span className="summary-extras"> + {item.agregados.map((a) => a.nombre).join(', ')}</span>
                )}
                {item.observacion && <span className="summary-obs"> · “{item.observacion}”</span>}
              </span>
              <span>{formatear(item.precioUnitario * item.cantidad)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatear(subtotal)}</span>
          </div>
          {descuento > 0 && (
            <div className="summary-row discount">
              <span>Descuento</span>
              <span>-{formatear(descuento)}</span>
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>{formatear(total)}</span>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block btn-lg"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Confirmando...' : `Pedir por WhatsApp · ${formatear(total)}`}
      </button>
    </div>
  );
}
