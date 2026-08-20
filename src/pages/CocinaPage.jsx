import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPedidos, updatePedidoEstado, cancelarPedido, logout as apiLogout } from '../api/client';
import { useSSE } from '../api/useSSE';
import { useNotify } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import AdminSidebar from '../components/AdminSidebar';
import { playNewOrderSound, soundEnabled } from '../components/adminUtils';

const ESTADOS = [
  { key: '', label: 'Todos' },
  { key: 'nuevo', label: 'Nuevo' },
  { key: 'preparacion', label: 'Preparación' },
  { key: 'listo', label: 'Listo' },
];

const ESTADO_COLORS = {
  nuevo: '#F0B429',
  preparacion: '#D2653A',
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
  const { logout } = useAuth();
  const { slug } = useCompany();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [agrupar, setAgrupar] = useState(true);
  const [updating, setUpdating] = useState(null);
  const seenIdsRef = useRef(new Set());
  const primeraCargaRef = useRef(true);

  const fetchPedidos = useCallback(() => {
    getPedidos(filtro || undefined)
      .then((data) => {
        const nuevas = data.filter((p) => !seenIdsRef.current.has(p.id) && p.estado === 'nuevo');
        if (primeraCargaRef.current) {
          primeraCargaRef.current = false;
        } else if (nuevas.length > 0 && soundEnabled()) {
          playNewOrderSound();
        }
        data.forEach((p) => seenIdsRef.current.add(p.id));
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
    const nuevas = [];
    updated.forEach((p) => {
      if (!seenIdsRef.current.has(p.id)) {
        seenIdsRef.current.add(p.id);
        if (p.estado === 'nuevo') nuevas.push(p);
      }
    });
    if (nuevas.length > 0 && soundEnabled()) playNewOrderSound();
    setPedidos((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      updated.forEach((p) => map.set(p.id, p));
      let list = Array.from(map.values());
      if (filtro) list = list.filter((p) => p.estado === filtro);
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
  }, [filtro]);

  useSSE(handleSSEUpdate, null, fetchPedidos);

  useEffect(() => {
    const id = setInterval(fetchPedidos, 30000);
    return () => clearInterval(id);
  }, [fetchPedidos]);

  useEffect(() => {
    const onFocus = () => fetchPedidos();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchPedidos]);

  const baseTitle = 'Pidevo Cocina';
  useEffect(() => {
    const nuevos = pedidos.filter((p) => p.estado === 'nuevo').length;
    document.title = nuevos > 0 ? `(${nuevos}) ${baseTitle}` : baseTitle;
  }, [pedidos]);

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

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {}
    logout();
    navigate(slug ? `/${slug}/login` : '/');
  };

  const imprimirComanda = (pedidos) => {
    const win = window.open('', '_blank', 'width=420,height=640');
    if (!win) return;
    const ahora = new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
    const rows = pedidos.flatMap((pedido) =>
      pedido.items.map((item) => {
        const partes = [];
        partes.push(`${item.cantidad}x ${item.plato?.nombre || `Plato #${item.plato_id}`}`.toUpperCase());
        if (item.presentacion_nombre) partes.push(` (${item.presentacion_nombre.toUpperCase()})`);
        if (item.agregados?.length) partes.push(` + ${item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(', ')}`);
        if (item.observacion) partes.push(` — Obs: ${item.observacion}`);
        return { id: pedido.id, hora: formatTime(pedido.created_at), texto: partes.join('') };
      })
    );
    const contexto = pedidos[0]?.tipo === 'mesa'
      ? `Mesa ${pedidos[0].mesa?.numero ?? pedidos[0].mesa_id ?? '?'}`
      : 'Retiro';
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Comanda</title>
<style>
  body { font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 12px; color: #000; font-size: 12px; }
  h1 { font-size: 15px; margin: 0 0 2px; text-align: center; }
  .sub { text-align: center; margin-bottom: 8px; font-size: 11px; }
  hr { border: 0; border-top: 1px dashed #000; margin: 6px 0; }
  .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .item { margin-bottom: 8px; }
  .muted { color: #444; }
  @media print { body { width: auto; } }
</style></head><body>
<h1>COMANDA</h1>
<div class="sub">${ahora} &mdash; ${contexto}</div>
<hr>
${rows.map((r) => `<div class="item">${r.texto}<div class="muted">#${r.id} · ${r.hora}</div></div>`).join('')}
<hr>
<div class="row"><strong>Total items:</strong><strong>${rows.length}</strong></div>
<script>window.onload = () => { window.print(); };</script>
</body></html>`);
    win.document.close();
    win.focus();
  };

  const grupos = useMemo(() => {
    if (!agrupar) return { groups: [], sueltos: pedidos };
    const map = new Map();
    pedidos.forEach((p) => {
      if (p.tipo !== 'mesa') return;
      const key = p.mesa?.id ?? p.mesa_id ?? 'desconocida';
      const label = p.mesa?.numero ?? p.mesa_id ?? '?';
      if (!map.has(key)) map.set(key, { key, label, pedidos: [] });
      map.get(key).pedidos.push(p);
    });
    const groups = [...map.values()].map((g) => ({
      ...g,
      pedidos: g.pedidos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    }));
    const sueltos = pedidos.filter((p) => p.tipo !== 'mesa');
    return { groups, sueltos };
  }, [pedidos, agrupar]);

  const renderPedidoCard = (pedido) => (
    <div key={pedido.id} className="pedido-card">
      <div className="pedido-card-header">
        <span className="pedido-id">#{pedido.id}</span>
        <div className="pedido-card-actions-row">
          <button
            className="comanda-print"
            title="Imprimir comanda"
            onClick={() => imprimirComanda([pedido])}
          >
            <i className="ti ti-printer"></i>
          </button>
          <span
            className="pedido-estado"
            style={{ background: ESTADO_COLORS[pedido.estado] }}
          >
            {ESTADO_LABELS[pedido.estado] || pedido.estado}
          </span>
        </div>
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
  );

  return (
    <div className="admin-layout">
      <AdminSidebar
        view="cocina"
        setView={() => {}}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onLogout={handleLogout}
        slug={slug}
      />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main">
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
        <button
          className={`filter-tab agrupar-tab ${agrupar ? 'active' : ''}`}
          onClick={() => setAgrupar((v) => !v)}
        >
          <i className="ti ti-layout-columns"></i> Agrupar por mesa
        </button>
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
      ) : agrupar ? (
        <div className="mesa-groups">
          {grupos.groups.map((group) => (
            <div key={group.key} className="mesa-group">
              <div className="mesa-group-head">
                <span className="mesa-group-title">
                  <i className="ti ti-armchair"></i> Mesa {group.label}
                  <span className="mesa-group-count">{group.pedidos.length}</span>
                </span>
                <button className="comanda-print" onClick={() => imprimirComanda(group.pedidos)}>
                  <i className="ti ti-printer"></i> Imprimir comanda
                </button>
              </div>
              <div className="pedidos-grid">
                {group.pedidos.map(renderPedidoCard)}
              </div>
            </div>
          ))}
          {grupos.sueltos.length > 0 && (
            <div className="mesa-group">
              <div className="mesa-group-head">
                <span className="mesa-group-title">
                  <i className="ti ti-shopping-bag"></i> Para retirar
                  <span className="mesa-group-count">{grupos.sueltos.length}</span>
                </span>
                <button className="comanda-print" onClick={() => imprimirComanda(grupos.sueltos)}>
                  <i className="ti ti-printer"></i> Imprimir comanda
                </button>
              </div>
              <div className="pedidos-grid">
                {grupos.sueltos.map(renderPedidoCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map(renderPedidoCard)}
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
