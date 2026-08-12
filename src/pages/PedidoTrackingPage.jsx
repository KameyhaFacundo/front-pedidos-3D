import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPedido, llamarMozo } from '../api/client';
import { useSSE } from '../api/useSSE';
import { useNotify } from '../context/NotificationContext';
import { useCompany } from '../context/CompanyContext';

const ESTADOS = ['nuevo', 'preparacion', 'listo', 'entregado'];

const ESTADO_INFO = {
  nuevo: { label: 'Recibido', icon: 'ti-clock', sub: 'Tu pedido fue recibido y está en cola' },
  preparacion: { label: 'En preparación', icon: 'ti-chef-hat', sub: 'La cocina está preparando tu pedido' },
  listo: { label: 'Listo para retirar', icon: 'ti-circle-check', sub: '¡Tu pedido está listo!' },
  entregado: { label: 'Entregado', icon: 'ti-truck-delivery', sub: 'Pedido completado' },
  cancelado: { label: 'Cancelado', icon: 'ti-circle-x', sub: 'Este pedido fue cancelado' },
};

const ESTADO_COLORS = {
  nuevo: 'var(--gold)',
  preparacion: 'var(--ember)',
  listo: 'var(--herb)',
  entregado: 'var(--cream)',
  cancelado: 'var(--ember-dim)',
};

function formatear(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PedidoTrackingPage() {
  const { id } = useParams();
  const { notify } = useNotify();
  const { path } = useCompany();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [llamando, setLlamando] = useState(false);
  const [llamadoOk, setLlamadoOk] = useState(false);

  const fetchPedido = useCallback(() => {
    getPedido(id)
      .then((data) => {
        setPedido(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchPedido();
  }, [fetchPedido]);

  const hasToken = !!localStorage.getItem('token');

  const handleSSE = useCallback(
    (updated) => {
      const match = updated.find((p) => p.id === Number(id));
      if (match) setPedido(match);
    },
    [id]
  );

  if (hasToken) {
    useSSE(handleSSE);
  } else {
    useEffect(() => {
      const interval = setInterval(fetchPedido, 5000);
      return () => clearInterval(interval);
    }, [fetchPedido]);
  }

  const handleLlamar = async () => {
    if (!pedido?.mesa?.id) return;
    setLlamando(true);
    try {
      await llamarMozo(pedido.mesa.id);
      setLlamadoOk(true);
      setTimeout(() => setLlamadoOk(false), 3000);
    } catch {
      notify('No se pudo llamar al mozo', 'error');
    } finally {
      setLlamando(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Cargando pedido...</p>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="page-center">
        <div className="error-message">
          <p>{error || 'Pedido no encontrado'}</p>
          <Link to={path('/menu')} className="btn btn-primary">Volver al menú</Link>
        </div>
      </div>
    );
  }

  const estado = pedido.estado;
  const info = ESTADO_INFO[estado] || ESTADO_INFO.nuevo;
  const estadoIdx = ESTADOS.indexOf(estado);
  const esCancelado = estado === 'cancelado';
  const color = ESTADO_COLORS[estado] || 'var(--cream)';
  const total = (pedido.items || []).reduce((s, i) => s + (i.plato?.precio || 0) * (i.cantidad || 0), 0);
  const descuento = Number(pedido.descuento || 0);

  return (
    <div className="tracking-page">
      <header className="tracking-header">
        <Link to={path('/menu')} className="back-link">
          <i className="ti ti-arrow-left"></i> Volver
        </Link>
        <span className="tracking-header-id">Pedido #{pedido.id}</span>
      </header>

      <div className="tracking-hero" style={{ borderColor: color }}>
        <div className="tracking-hero-icon" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
          <i className={`ti ${info.icon}`}></i>
        </div>
        <div className="tracking-hero-label" style={{ color }}>{info.label}</div>
        <div className="tracking-hero-sub">{info.sub}</div>
      </div>

      {!esCancelado && (
        <div className="tracking-timeline">
          {ESTADOS.map((e, idx) => {
            const isActive = idx <= estadoIdx;
            const isCurrent = idx === estadoIdx;
            return (
              <div key={e} className={`tl-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="tl-dot">
                  {isActive ? <i className="ti ti-check"></i> : <span>{idx + 1}</span>}
                </div>
                <div className="tl-line" />
                <div className="tl-label">{ESTADO_INFO[e].label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="tracking-details">
        <div className="tracking-details-head">
          <h3>Tu pedido</h3>
          <span className="tracking-details-count">{pedido.items?.length || 0} items</span>
        </div>

        <div className="tracking-items">
          {(pedido.items || []).map((item, i) => (
            <div key={i} className="tracking-item">
              <div className="tracking-item-main">
                <span className="tracking-qty">{item.cantidad}x</span>
                <div className="tracking-item-name">
                  {item.plato?.nombre || `Plato #${item.plato_id}`}
                  {item.presentacion_nombre && <span className="tracking-item-var"> · {item.presentacion_nombre}</span>}
                  {item.agregados?.length > 0 && (
                    <div className="tracking-item-extras">
                      + {item.agregados.map((a) => a.nombre).join(', ')}
                    </div>
                  )}
                  {item.observacion && <div className="tracking-item-obs">“{item.observacion}”</div>}
                </div>
              </div>
              <span className="tracking-price">
                {formatear((item.plato?.precio || 0) * item.cantidad)}
              </span>
            </div>
          ))}
        </div>

        <div className="tracking-total">
          {descuento > 0 && (
            <>
              <div className="tracking-total-row">
                <span>Subtotal</span>
                <span>{formatear(total + descuento)}</span>
              </div>
              <div className="tracking-total-row discount">
                <span>Descuento</span>
                <span>-{formatear(descuento)}</span>
              </div>
            </>
          )}
          <div className="tracking-total-row grand">
            <span>Total</span>
            <span>{formatear(total)}</span>
          </div>
        </div>
      </div>

      <div className="tracking-actions">
        {pedido.mesa && !esCancelado && (
          <button className="btn btn-primary btn-block" onClick={handleLlamar} disabled={llamando || llamadoOk}>
            {llamadoOk ? (
              <><i className="ti ti-check"></i> Mozo notificado</>
            ) : llamando ? (
              'Llamando...'
            ) : (
              <><i className="ti ti-bell-ringing"></i> Llamar al mozo</>
            )}
          </button>
        )}
        <Link to={path('/menu')} className="btn btn-outline btn-block">
          Seguir pidiendo
        </Link>
      </div>
    </div>
  );
}
