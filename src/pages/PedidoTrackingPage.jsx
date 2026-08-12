import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPedido, llamarMozo } from '../api/client';
import { useSSE } from '../api/useSSE';

const ESTADOS = ['nuevo', 'preparacion', 'listo', 'entregado', 'cancelado'];
const ESTADO_LABELS = {
  nuevo: 'Recibido',
  preparacion: 'En preparación',
  listo: 'Listo para retirar',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};
const ESTADO_ICONS = {
  nuevo: 'ti-clock',
  preparacion: 'ti-chef-hat',
  listo: 'ti-circle-check',
  entregado: 'ti-truck-delivery',
  cancelado: 'ti-circle-x',
};

export default function PedidoTrackingPage() {
  const { id } = useParams();
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

  const handleSSE = useCallback(
    (updated) => {
      const match = updated.find((p) => p.id === Number(id));
      if (match) {
        setPedido(match);
      }
    },
    [id]
  );

  useSSE(handleSSE);

  const handleLlamar = async () => {
    if (!pedido?.mesa?.id) return;
    setLlamando(true);
    try {
      await llamarMozo(pedido.mesa.id);
      setLlamadoOk(true);
      setTimeout(() => setLlamadoOk(false), 3000);
    } catch {
      alert('No se pudo llamar al mozo');
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
          <Link to="/menu" className="btn btn-primary">Volver al menú</Link>
        </div>
      </div>
    );
  }

  const estadoActual = pedido.estado;
  const estadoIdx = ESTADOS.indexOf(estadoActual);
  const esCancelado = estadoActual === 'cancelado';

  return (
    <div className="tracking-page">
      <header className="page-header">
        <Link to="/menu" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al menú
        </Link>
        <h1>Pedido #{pedido.id}</h1>
      </header>

      <div className="tracking-estado-badge" data-estado={estadoActual}>
        <i className={`ti ${ESTADO_ICONS[estadoActual] || 'ti-clock'}`}></i>
        <span>{ESTADO_LABELS[estadoActual] || estadoActual}</span>
      </div>

      {!esCancelado && (
        <div className="tracking-timeline">
          {ESTADOS.filter((e) => e !== 'cancelado').map((estado, idx) => {
            const isActive = idx <= estadoIdx;
            const isCurrent = idx === estadoIdx;
            return (
              <div key={estado} className={`tl-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="tl-dot">
                  {isActive ? <i className="ti ti-check"></i> : <span>{idx + 1}</span>}
                </div>
                <div className="tl-line" />
                <div className="tl-label">{ESTADO_LABELS[estado]}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="tracking-details">
        <h3>Detalle del pedido</h3>
        <div className="tracking-items">
          {(pedido.items || []).map((item, i) => (
            <div key={i} className="tracking-item">
              <span className="tracking-qty">{item.cantidad}x</span>
              <span className="tracking-name">{item.plato?.nombre || `Plato #${item.plato_id}`}</span>
              <span className="tracking-price">
                ${((item.plato?.precio || 0) * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="tracking-total">
          <span>Total</span>
          <span>
            $
            {(pedido.items || []).reduce(
              (s, i) => s + (i.plato?.precio || 0) * (i.cantidad || 0),
              0
            ).toFixed(2)}
          </span>
        </div>
      </div>

      {pedido.mesa && !esCancelado && (
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleLlamar}
          disabled={llamando || llamadoOk}
          style={{ marginTop: 16 }}
        >
          {llamadoOk ? (
            <>
              <i className="ti ti-check"></i> Mozo notificado
            </>
          ) : llamando ? (
            'Llamando...'
          ) : (
            <>
              <i className="ti ti-bell-ringing"></i> Llamar al mozo
            </>
          )}
        </button>
      )}

      <Link to="/menu" className="btn btn-outline btn-block" style={{ marginTop: 12, textAlign: 'center' }}>
        Seguir pidiendo
      </Link>
    </div>
  );
}
