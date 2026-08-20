import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrderMode } from '../context/OrderModeContext';
import { useCompany } from '../context/CompanyContext';
import { getMesas, createPedido, validarCupon, crearPreferencia } from '../api/client';

function formatear(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function itemsToTexto(items) {
  return items
    .map((item) => {
      let linea = `${item.cantidad}x ${item.plato.nombre.toUpperCase()}`;
      if (item.presentacion) linea += ` (${item.presentacion.toUpperCase()})`;
      if (item.agregados?.length) {
        linea += ' + ' + item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(' + ');
      }
      linea += `: ${formatear(item.precioUnitario * item.cantidad)}`;
      if (item.observacion) linea += `%0A  ↳ Obs: ${item.observacion}`;
      return linea;
    })
    .join('%0A');
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
  const { path, slug, empresa } = useCompany();
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
  const [resumen, setResumen] = useState(null);
  const [propinaTipo, setPropinaTipo] = useState('pct');
  const [propinaPct, setPropinaPct] = useState(0);
  const [propinaFija, setPropinaFija] = useState('');
  const cerrado = empresa?.abierto === false;
  const mpEnabled = empresa?.mp_enabled === true;

  useEffect(() => {
    getMesas()
      .then((data) => setMesas(data))
      .catch(() => {});
  }, []);

  const mesaNumero = useMemo(
    () => mesas.find((m) => m.id === Number(mesaId))?.numero,
    [mesas, mesaId]
  );

  const mesasDisponibles = useMemo(
    () => mesas.filter((m) => m.activa && !m.ocupada),
    [mesas]
  );

  const subtotal = getTotal();

  const descuento = useMemo(() => {
    if (!cupon) return 0;
    if (cupon.tipo === 'porcentaje') return Math.round(subtotal * (cupon.descuento / 100) * 100) / 100;
    return Math.min(Number(cupon.descuento), subtotal);
  }, [cupon, subtotal]);

  const baseTotal = subtotal - descuento;
  const propina = propinaTipo === 'fijo'
    ? (Number(propinaFija) || 0)
    : Math.round(baseTotal * (propinaPct / 100) * 100) / 100;
  const total = baseTotal + propina;

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
    if (cerrado) {
      setError('El local está cerrado por ahora');
      return;
    }
    if (entrega !== 'mesa') {
      if (!nombre.trim()) {
        setError('Ingresá tu nombre');
        return;
      }
      if (!celular.trim()) {
        setError('Ingresá tu teléfono');
        return;
      }
    }
    if (entrega === 'mesa' && !mesasDisponibles.some((m) => m.id === Number(mesaId))) {
      setError('Seleccioná tu mesa');
      return;
    }
    if (entrega === 'envio' && !direccion.trim()) {
      setError('Ingresá tu dirección de envío');
      return;
    }

    setSubmitting(true);
    setError(null);

    const pedidoData = {
      tipo: entrega,
      mesa_id: entrega === 'mesa' ? (Number(mesaId) || null) : null,
      direccion: entrega === 'envio' ? direccion.trim() || null : null,
      nombre: entrega === 'mesa' ? null : nombre.trim() || null,
      celular: entrega === 'mesa' ? null : celular.trim() || null,
      medio_pago: entrega === 'mesa' ? 'efectivo' : medioPago,
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
      setResumen({
        itemsTexto: itemsToTexto(items),
        subtotal,
        descuento,
        propina,
        total,
      });
      localStorage.setItem(`pidevo_last_order:${slug}`, JSON.stringify({ id: result.id, token: result.token, tipo: entrega, mesaNumero: mesaNumero || null, fecha: new Date().toISOString() }));
      localStorage.removeItem('pidevo_last_order');
      localStorage.removeItem('pedido3d_last_order');
      setSuccess(result);
      clearCart();

      if (medioPago === 'mercadopago') {
        const returnUrl = `${window.location.origin}${path(`/pedido/${result.id}?t=${result.token}`)}`;
        const pref = await crearPreferencia({
          pedido_id: result.id,
          token: result.token,
          monto: total,
          return_url: returnUrl,
        });
        if (pref?.init_point) {
          window.location.href = pref.init_point;
        } else {
          setError('No se pudo iniciar el pago. Tu pedido fue registrado igualmente.');
        }
        setSubmitting(false);
        return;
      }
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

  if (success && resumen) {
    const restoPhone = import.meta.env.VITE_RESTAURANT_PHONE || '5493815069332';
    const esMesa = entrega === 'mesa';

    const msg = [
      '¡Hola! Te paso el resumen de mi pedido',
      '',
      `Pedido: #${success.id}`,
      ...(nombre ? [`Nombre: ${nombre}`] : []),
      ...(celular ? [`Teléfono: ${celular}`] : []),
      '',
      `Forma de pago: ${medioPago}`,
      `Entrega: ${entregaLabel}${esMesa && mesaNumero ? ` (Mesa ${mesaNumero})` : ''}${entrega === 'envio' && direccion ? ` - ${direccion}` : ''}`,
      '',
      'Mi pedido es:',
      resumen.itemsTexto,
      '',
      `Subtotal: ${formatear(resumen.subtotal)}`,
      resumen.descuento > 0 ? `Descuento: -${formatear(resumen.descuento)}` : '',
      resumen.propina > 0 ? `Propina: ${formatear(resumen.propina)}` : '',
      `TOTAL: ${formatear(resumen.total)}`,
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
        <h2>{esMesa ? '¡Pedido enviado a la cocina!' : '¡Pedido confirmado!'}</h2>
        <p>
          {esMesa
            ? `Tu pedido #${success.id} fue enviado directo a la cocina${mesaNumero ? ` · Mesa ${mesaNumero}` : ''}.`
            : `Tu pedido #${success.id} ha sido registrado.`}
        </p>
        <p className="success-estado">Estado: {success.estado}</p>

        <div className="success-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate(path(`/pedido/${success.id}?t=${success.token}`))}
          >
            <i className="ti ti-eye"></i> Ver estado del pedido
          </button>

          {!esMesa && (
            <a
              href={`https://wa.me/${restoPhone}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-block"
            >
              <i className="ti ti-brand-whatsapp"></i> También avisar por WhatsApp
            </a>
          )}

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

      {cerrado && (
        <div className="alert alert-warning">
          <p><i className="ti ti-clock-off"></i> El local está cerrado por ahora. No se pueden confirmar pedidos.</p>
        </div>
      )}

      {entrega === 'mesa' ? (
        <div className="checkout-section checkout-mesa-nota">
          <i className="ti ti-users"></i>
          <span>Pedís desde tu mesa, no necesitás dejar tus datos.</span>
        </div>
      ) : (
        <>
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
        </>
      )}

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
            {mesasDisponibles.map((mesa) => (
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

      {entrega === 'mesa' ? (
        <div className="checkout-section checkout-mesa-pago">
          <h2>Forma de pago</h2>
          <p><i className="ti ti-info-circle"></i> Pagás en el local cuando te traigan el pedido.</p>
        </div>
      ) : (
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
            {mpEnabled && (
              <label className={`radio-card ${medioPago === 'mercadopago' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="medioPago"
                  value="mercadopago"
                  checked={medioPago === 'mercadopago'}
                  onChange={(e) => setMedioPago(e.target.value)}
                />
                <div className="radio-content">
                  <i className="ti ti-credit-card"></i>
                  <span>Mercado Pago</span>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

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
        <h2>Propina</h2>
        <div className="propina-chips">
          {[0, 10, 15, 20].map((pct) => (
            <button
              key={pct}
              className={`chip ${propinaTipo === 'pct' && propinaPct === pct ? 'active' : ''}`}
              onClick={() => { setPropinaTipo('pct'); setPropinaPct(pct); }}
            >
              {pct === 0 ? 'Sin propina' : `${pct}%`}
            </button>
          ))}
          <button
            className={`chip ${propinaTipo === 'fijo' ? 'active' : ''}`}
            onClick={() => { setPropinaTipo('fijo'); setPropinaFija(''); }}
          >
            En plata
          </button>
        </div>
        {propinaTipo === 'fijo' && (
          <div className="propina-fija">
            <input
              className="input-text"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 500"
              value={propinaFija}
              onChange={(e) => setPropinaFija(e.target.value)}
            />
            <span>La dejás en efectivo, en la mesa</span>
          </div>
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
          {propina > 0 && (
            <div className="summary-row">
              <span>Propina{propinaTipo === 'pct' ? ` (${propinaPct}%)` : ''}</span>
              <span>{formatear(propina)}</span>
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
        disabled={submitting || cerrado}
      >
        {cerrado ? 'Local cerrado' : submitting ? 'Confirmando...' : `Confirmar pedido · ${formatear(total)}`}
      </button>
    </div>
  );
}
