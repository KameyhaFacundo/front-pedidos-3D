import { useState, useEffect, useCallback } from 'react';
import { getPedidos, updatePedidoEstado, cancelarPedido } from '../api/client';
import { useSSE } from '../api/useSSE';
import { useNotify } from '../context/NotificationContext';

const ESTADOS = [
  { key: '', label: 'Todos' },
  { key: 'nuevo', label: 'Nuevo' },
  { key: 'preparacion', label: 'Preparación' },
  { key: 'listo', label: 'Listo' },
];

const ESTADO_COLORS = {
  nuevo: '#F0B429',
  preparacion: '#FF5A36',
  listo: '#9CB43D',
  entregado: '#A89C87',
};

const ESTADO_LABELS = {
  nuevo: 'Nuevo',
  preparacion: 'En preparación',
  listo: 'Listo',
  entregado: 'Entregado',
};

export default function CocinaPage() {
  const { confirm } = useNotify();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchPedidos = useCallback(() => {
    getPedidos(filtro || undefined)
      .then((data) => {
        setPedidos(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filtro]);

  useEffect(() => {
    setLoading(true);
    fetchPedidos();
  }, [fetchPedidos]);

  const handleSSEUpdate = useCallback((updated) => {
    setPedidos((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      updated.forEach((p) => map.set(p.id, p));
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
  }, []);

  useSSE(handleSSEUpdate);

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    setUpdating(pedidoId);
    try {
      await updatePedidoEstado(pedidoId, nuevoEstado);
      await fetchPedidos();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleCancelar = async (pedidoId) => {
    confirm('¿Cancelar este pedido?', async () => {
      setUpdating(pedidoId);
      try {
        await cancelarPedido(pedidoId);
        await fetchPedidos();
      } catch (err) {
        setError(err.message);
      } finally {
        setUpdating(null);
      }
    }, { confirmText: 'Cancelar pedido', danger: true });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="cocina-page">
      <header className="cocina-header">
        <h1>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 011.05-1.54 5 5 0 017.08 0A5.11 5.11 0 0116.59 6 4 4 0 0118 13.87V21H6z" />
            <line x1="8" y1="15" x2="16" y2="15" />
            <line x1="8" y1="18" x2="12" y2="18" />
          </svg>
          Cocina
        </h1>
      </header>

      <div className="filter-tabs">
        {ESTADOS.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-tab ${filtro === key ? 'active' : ''}`}
            onClick={() => setFiltro(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}

      {loading && pedidos.length === 0 ? (
        <div className="page-center">
          <div className="spinner" />
          <p>Cargando pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="page-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8" />
          </svg>
          <p>No hay pedidos{filtro ? ` en estado "${ESTADO_LABELS[filtro]}"` : ''}</p>
        </div>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-card-header">
                <span className="pedido-id">#{pedido.id}</span>
                <span
                  className="pedido-estado"
                  style={{ background: ESTADO_COLORS[pedido.estado] }}
                >
                  {ESTADO_LABELS[pedido.estado] || pedido.estado}
                </span>
              </div>

              <div className="pedido-card-meta">
                <span className={`pedido-tipo-badge ${pedido.tipo}`}>
                  {pedido.tipo === 'mesa' ? `Mesa ${pedido.mesa?.numero ?? pedido.mesa_id ?? '?'}` : 'Retiro'}
                </span>
                <span className="pedido-hora">{formatTime(pedido.created_at)}</span>
              </div>

              <ul className="pedido-items">
                {pedido.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.cantidad} x {item.plato?.nombre || `Plato #${item.plato_id}`}
                      {item.presentacion_nombre && <em className="pedido-item-var"> ({item.presentacion_nombre})</em>}
                    </span>
                    {item.agregados?.length > 0 && (
                      <span className="pedido-item-extras">
                        + {item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(', ')}
                      </span>
                    )}
                    {item.observacion && (
                      <span className="pedido-item-obs">“{item.observacion}”</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="pedido-card-actions">
                {pedido.estado === 'nuevo' && (
                  <>
                    <button
                      className="btn btn-warning btn-block"
                      onClick={() => handleEstadoChange(pedido.id, 'preparacion')}
                      disabled={updating === pedido.id}
                    >
                      {updating === pedido.id ? '...' : 'Tomar pedido'}
                    </button>
                    <button
                      className="btn btn-block"
                      style={{
                        marginTop: 6,
                        background: 'transparent',
                        color: 'var(--ember)',
                        border: '1px solid var(--hair)',
                        borderRadius: 12,
                        padding: '8px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCancelar(pedido.id)}
                      disabled={updating === pedido.id}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {pedido.estado === 'preparacion' && (
                  <>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleEstadoChange(pedido.id, 'listo')}
                      disabled={updating === pedido.id}
                    >
                      {updating === pedido.id ? '...' : 'Marcar listo'}
                    </button>
                    <button
                      className="btn btn-block"
                      style={{
                        marginTop: 6,
                        background: 'transparent',
                        color: 'var(--ember)',
                        border: '1px solid var(--hair)',
                        borderRadius: 12,
                        padding: '8px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCancelar(pedido.id)}
                      disabled={updating === pedido.id}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {pedido.estado === 'listo' && (
                  <button
                    className="btn btn-success btn-block"
                    onClick={() => handleEstadoChange(pedido.id, 'entregado')}
                    disabled={updating === pedido.id}
                  >
                    {updating === pedido.id ? '...' : 'Entregado'}
                  </button>
                )}
                {pedido.estado === 'entregado' && (
                  <span className="pedido-entregado-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                    Entregado
                  </span>
                )}
                {pedido.estado === 'cancelado' && (
                  <span className="pedido-entregado-label" style={{ color: 'var(--ember)', borderColor: 'var(--ember)' }}>
                    Cancelado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
