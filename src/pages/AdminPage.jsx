import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPedidos,
  getMetricas,
  getMesas,
  getPlatos,
  createPlato,
  updatePlato,
  deletePlato,
  togglePlatoDisponible,
  updatePedidoPago,
  updatePedidoEstado,
  cancelarPedido,
} from '../api/client';
import { useSSE } from '../api/useSSE';
import QRModal from '../components/QRModal';
import { AdminSkeleton } from '../components/Skeletons';
import { useTheme } from '../context/ThemeContext';

function formatearPrecio(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function tiempoRelativo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'Ahora';
  if (diff === 1) return 'Hace 1 min';
  return `Hace ${diff} min`;
}

function categoriaIcon(categoria) {
  switch (categoria) {
    case 'principales': return 'ti-meat';
    case 'entradas': return 'ti-salad';
    case 'postres': return 'ti-cake';
    case 'bebidas': return 'ti-glass';
    default: return 'ti-tools-kitchen-2';
  }
}

const CATEGORIAS = [
  { value: 'principales', label: 'Principales' },
  { value: 'entradas', label: 'Entradas' },
  { value: 'postres', label: 'Postres' },
  { value: 'bebidas', label: 'Bebidas' },
];

const COLUMNAS = [
  { key: 'nuevo', label: 'Nuevo', dotClass: 'new' },
  { key: 'preparacion', label: 'Preparación', dotClass: 'prep' },
  { key: 'listo', label: 'Listo', dotClass: 'ready' },
  { key: 'entregado', label: 'Entregado', dotClass: 'done' },
  { key: 'cancelado', label: 'Cancelado', dotClass: 'done' },
];

const EMPTY_PLATO = {
  nombre: '',
  precio: '',
  categoria: 'principales',
  descripcion: '',
  disponible: true,
};

export default function AdminPage() {
  const [view, setView] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [menuSearch, setMenuSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingPlato, setEditingPlato] = useState(null);
  const [modalForm, setModalForm] = useState({ ...EMPTY_PLATO });
  const [saving, setSaving] = useState(false);
  const fotoInputRef = useRef(null);
  const glbInputRef = useRef(null);
  const usdzInputRef = useRef(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  const [usdzFile, setUsdzFile] = useState(null);
  const [presentaciones, setPresentaciones] = useState([]);
  const [agregados, setAgregados] = useState([]);
  const [qrMesa, setQrMesa] = useState(null);

  const fotoPreview = fotoFile ? URL.createObjectURL(fotoFile) : (editingPlato?.foto || null);

  const fetchPedidosYMetricas = useCallback(() => {
    Promise.all([getPedidos(), getMetricas()])
      .then(([pedidosData, metricasData]) => {
        setPedidos(pedidosData);
        setMetricas(metricasData);
        if (loading) setLoading(false);
      })
      .catch(() => {
        if (loading) setLoading(false);
      });
  }, [loading]);

  const fetchPlatos = useCallback(() => {
    getPlatos().then(setPlatos).catch(() => {});
  }, []);

  const fetchMesasData = useCallback(() => {
    Promise.all([getMesas(), getPedidos()])
      .then(([mesasData, pedidosData]) => {
        setMesas(mesasData);
        setPedidos(pedidosData);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPedidosYMetricas();
  }, [fetchPedidosYMetricas]);

  const handleSSEUpdate = useCallback((updated) => {
    setPedidos((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      updated.forEach((p) => map.set(p.id, p));
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
  }, []);

  useSSE(handleSSEUpdate);

  useEffect(() => {
    if (view === 'menu' || view === 'metricas') fetchPlatos();
    if (view === 'mesas') fetchMesasData();
  }, [view, fetchPlatos, fetchMesasData]);

  const openCreateModal = () => {
    setEditingPlato(null);
    setModalForm({ ...EMPTY_PLATO });
    setFotoFile(null);
    setGlbFile(null);
    setUsdzFile(null);
    setPresentaciones([]);
    setAgregados([]);
    setShowModal(true);
  };

  const openEditModal = (plato) => {
    setEditingPlato(plato);
    setModalForm({
      nombre: plato.nombre || '',
      precio: plato.precio ?? '',
      categoria: plato.categoria || 'principales',
      descripcion: plato.descripcion || '',
      disponible: plato.disponible !== false,
    });
    setFotoFile(null);
    setGlbFile(null);
    setUsdzFile(null);
    setPresentaciones((plato.presentaciones || []).map((p) => ({ id: p.id, nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio })));
    setAgregados((plato.agregados || []).map((a) => ({ id: a.id, nombre: a.nombre, descripcion: a.descripcion || '', precio: a.precio })));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlato(null);
  };

  const handleModalChange = (field, value) => {
    setModalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePlato = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nombre', modalForm.nombre);
      formData.append('precio', Number(modalForm.precio));
      formData.append('categoria', modalForm.categoria);
      formData.append('descripcion', modalForm.descripcion || '');
      formData.append('disponible', modalForm.disponible ? '1' : '0');

      if (fotoFile) formData.append('foto', fotoFile);
      if (glbFile) formData.append('modelo_glb', glbFile);
      if (usdzFile) formData.append('modelo_usdz', usdzFile);

      presentaciones.forEach((p, i) => {
        formData.append(`presentaciones[${i}][nombre]`, p.nombre);
        formData.append(`presentaciones[${i}][descripcion]`, p.descripcion || '');
        formData.append(`presentaciones[${i}][precio]`, Number(p.precio) || 0);
      });
      agregados.forEach((a, i) => {
        formData.append(`agregados[${i}][nombre]`, a.nombre);
        formData.append(`agregados[${i}][descripcion]`, a.descripcion || '');
        formData.append(`agregados[${i}][precio]`, Number(a.precio) || 0);
      });

      if (editingPlato) {
        await updatePlato(editingPlato.id, formData);
      } else {
        await createPlato(formData);
      }
      closeModal();
      fetchPlatos();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlato = async (id) => {
    if (!window.confirm('¿Eliminar este plato?')) return;
    try {
      await deletePlato(id);
      closeModal();
      fetchPlatos();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleDisponible = async (id) => {
    try {
      await togglePlatoDisponible(id);
      fetchPlatos();
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePagar = async (id) => {
    try {
      await updatePedidoPago(id);
      fetchPedidosYMetricas();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Cancelar este pedido?')) return;
    try {
      await cancelarPedido(id);
      fetchPedidosYMetricas();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAvanzar = async (id, estado) => {
    try {
      await updatePedidoEstado(id, estado);
      fetchPedidosYMetricas();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredPedidos = filtro
    ? pedidos.filter((p) => p.tipo === filtro)
    : pedidos;

  const porColumna = (estado) => filteredPedidos.filter((p) => p.estado === estado);

  const pedidosActivos = pedidos.filter((p) =>
    ['nuevo', 'preparacion', 'listo'].includes(p.estado)
  );
  const mesasActivasIds = new Set(
    pedidosActivos
      .filter((p) => p.tipo === 'mesa' && p.mesa)
      .map((p) => p.mesa.id)
  );
  const ocupadas = mesasActivasIds.size;

  const platoCounts = {};
  pedidos.forEach((p) => {
    (p.items || []).forEach((item) => {
      const name = item.plato?.nombre || `Plato #${item.plato_id}`;
      platoCounts[name] = (platoCounts[name] || 0) + (item.cantidad || 1);
    });
  });
  const platosMasPedidos = Object.entries(platoCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxPlatoCount = platosMasPedidos.length > 0 ? platosMasPedidos[0][1] : 1;

  const totalRevenue = pedidos.reduce((sum, p) => {
    if (p.estado === 'cancelado') return sum;
    return sum + (p.items || []).reduce((s, i) => s + (i.plato?.precio || 0) * (i.cantidad || 1), 0);
  }, 0);
  const totalPedidos = pedidos.filter((p) => p.estado !== 'cancelado').length;

  const cateCounts = {};
  pedidos.forEach((p) => {
    if (p.estado === 'cancelado') return;
    (p.items || []).forEach((item) => {
      const cat = item.plato?.categoria || 'sin categoria';
      cateCounts[cat] = (cateCounts[cat] || 0) + (item.cantidad || 1);
    });
  });
  const maxCate = Math.max(1, ...Object.values(cateCounts));
  const cateLabels = { principales: 'Principales', entradas: 'Entradas', postres: 'Postres', bebidas: 'Bebidas' };

  const hourlyData = (() => {
    const hours = new Array(24).fill(0);
    pedidos.forEach((p) => {
      if (p.estado === 'cancelado') return;
      const h = new Date(p.created_at).getHours();
      hours[h] += 1;
    });
    const max = Math.max(1, ...hours);
    return hours.map((count, hour) => ({ hour: `${String(hour).padStart(2, '0')}:00`, count, pct: (count / max) * 100 }));
  })();

  const arVistasData = (() => {
    if (!metricas?.ar_vistas) return [];
    const arVistas = metricas.ar_vistas;
    return platosMasPedidos.map(([nombre, pedidosCount]) => {
      const plato = platos.find((p) => p.nombre === nombre);
      const vistas = plato ? (arVistas[plato.id] || 0) : 0;
      const conversion = pedidosCount > 0 ? Math.round((pedidosCount / Math.max(vistas, 1)) * 100) : 0;
      return { nombre, vistas, pedidos: pedidosCount, conversion };
    });
  })();

  if (loading) return <AdminSkeleton />;

  return (
    <div className="admin-layout">
      <AdminSidebar view={view} setView={setView} />

      <div className="admin-main">
        {/* PEDIDOS */}
        <div className={`view ${view === 'pedidos' ? 'active' : ''}`}>
          <div className="admin-top">
            <div>
              <div className="admin-title">Pedidos de hoy</div>
              <div className="admin-subtitle">Actualizado en tiempo real</div>
            </div>
          </div>

          <div className="admin-metrics">
            <div className="admin-metric">
              <div className="label"><i className="ti ti-receipt-2"></i> Pedidos hoy</div>
              <div className="value">{metricas?.pedidos_hoy || 0}</div>
            </div>
            <div className="admin-metric">
              <div className="label"><i className="ti ti-currency-dollar"></i> Ventas hoy</div>
              <div className="value">{formatearPrecio(metricas?.ventas_hoy || 0)}</div>
            </div>
            <div className="admin-metric accent">
              <div className="label"><i className="ti ti-flame"></i> Activos ahora</div>
              <div className="value">{metricas?.activos_ahora || 0}</div>
            </div>
            <div className="admin-metric">
              <div className="label"><i className="ti ti-star"></i> Más pedido</div>
              <div className="value" style={{ fontSize: 15 }}>
                {metricas?.mas_pedido || '-'}
              </div>
            </div>
          </div>

          <div className="admin-board">
            {COLUMNAS.map(({ key, label, dotClass }) => {
              const colPedidos = porColumna(key);
              return (
                <div key={key} className="admin-col">
                  <div className="admin-col-head">
                    <span className={`col-dot ${dotClass}`} />
                    {label}
                  </div>
                  {colPedidos.map((pedido) => (
                    <div key={pedido.id} className="admin-order">
                      <div className="admin-order-top">
                        <span className="admin-order-id">#{pedido.id}</span>
                        <span className={`admin-tag ${pedido.tipo}`}>
                          {pedido.tipo === 'mesa'
                            ? `Mesa ${pedido.mesa?.numero || '?'}`
                            : 'Retiro'}
                        </span>
                      </div>
                      {(pedido.nombre || pedido.celular) && (
                        <div className="admin-order-customer">
                          {pedido.nombre && <span>{pedido.nombre}</span>}
                          {pedido.celular && (
                            <a
                              href={`https://wa.me/549${pedido.celular.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="admin-customer-whatsapp"
                            >
                              <i className="ti ti-brand-whatsapp"></i> {pedido.celular}
                            </a>
                          )}
                        </div>
                      )}
                      <div className="admin-order-items">
                        {pedido.items?.map((item) => (
                          <span key={item.id}>
                            {item.cantidad} {item.plato?.nombre || `Plato #${item.plato_id}`}
                            {item.presentacion_nombre && (
                              <em className="admin-item-var"> ({item.presentacion_nombre})</em>
                            )}
                            {item.agregados?.length > 0 && (
                              <em className="admin-item-extras"> + {item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(', ')}</em>
                            )}
                            {item.observacion && (
                              <em className="admin-item-obs"> · “{item.observacion}”</em>
                            )}
                            <br />
                          </span>
                        ))}
                      </div>
                      <div className="admin-order-bottom">
                        <span className="admin-order-time">{tiempoRelativo(pedido.created_at)}</span>
                        <span className={`admin-pay ${pedido.estado_pago === 'pagado' ? 'ok' : 'pending'}`}>
                          <i className={`ti ${pedido.estado_pago === 'pagado' ? 'ti-check' : 'ti-clock'}`}></i>{' '}
                          {pedido.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>

                      {key === 'nuevo' && (
                        <button className="btn btn-sm btn-block kanban-advance advance-prep"
                          onClick={(e) => { e.stopPropagation(); handleAvanzar(pedido.id, 'preparacion'); }}>
                          <i className="ti ti-chef-hat"></i> A preparación
                        </button>
                      )}
                      {key === 'preparacion' && (
                        <button className="btn btn-sm btn-block kanban-advance advance-ready"
                          onClick={(e) => { e.stopPropagation(); handleAvanzar(pedido.id, 'listo'); }}>
                          <i className="ti ti-circle-check"></i> Marcar listo
                        </button>
                      )}
                      {key === 'listo' && (
                        <button className="btn btn-sm btn-block kanban-advance advance-done"
                          onClick={(e) => { e.stopPropagation(); handleAvanzar(pedido.id, 'entregado'); }}>
                          <i className="ti ti-truck-delivery"></i> Entregar
                        </button>
                      )}

                      {pedido.estado_pago === 'pendiente' && pedido.estado === 'entregado' && (
                        <button
                          className="btn btn-sm btn-block"
                          style={{
                            marginTop: 8,
                            background: 'var(--green)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={(e) => { e.stopPropagation(); handlePagar(pedido.id); }}
                        >
                          Marcar como pagado
                        </button>
                      )}
                      {(pedido.estado === 'nuevo' || pedido.estado === 'preparacion') && (
                        <button
                          className="btn btn-sm btn-block"
                          style={{
                            marginTop: 8,
                            background: 'transparent',
                            color: 'var(--ember)',
                            border: '1px solid var(--hair)',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={(e) => { e.stopPropagation(); handleCancelar(pedido.id); }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  ))}
                  {colPedidos.length === 0 && (
                    <div className="admin-order admin-order-empty">Sin pedidos</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MENU */}
        <div className={`view ${view === 'menu' ? 'active' : ''}`}>
          <div className="admin-top">
            <div>
              <div className="admin-title">Menú</div>
              <div className="admin-subtitle">
                {platos.length} platos · {platos.filter((p) => p.disponible === false).length} pausados
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
              <i className="ti ti-plus"></i> Nuevo plato
            </button>
          </div>

          <div className="menu-search" style={{ marginBottom: 16 }}>
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Buscar plato..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
            />
            {menuSearch && (
              <button className="search-clear" onClick={() => setMenuSearch('')}>
                <i className="ti ti-x"></i>
              </button>
            )}
          </div>

          <div className="dish-grid">
            {platos
              .filter((p) => {
                if (!menuSearch.trim()) return true;
                const q = menuSearch.toLowerCase();
                return p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q);
              })
              .map((plato) => {
              const icon = categoriaIcon(plato.categoria);
              return (
                <div
                  key={plato.id}
                  className="dish-card"
                  onClick={() => openEditModal(plato)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dish-thumb" style={{ background: 'var(--surface)' }}>
                    {plato.foto ? (
                      <img
                        src={plato.foto}
                        alt={plato.nombre}
                        className="dish-thumb-img"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <i className={`ti ${icon}`}></i>
                    )}
                  </div>
                  <div className="dish-cat">{plato.categoria}</div>
                  <div className="dish-name">{plato.nombre}</div>
                  <div className="dish-bottom">
                    <div className="dish-price">{formatearPrecio(plato.precio)}</div>
                    <div className={`avail ${plato.disponible !== false ? 'on' : 'off'}`}>
                      <i className={`ti ${plato.disponible !== false ? 'ti-circle-check' : 'ti-circle-off'}`}></i>
                      {plato.disponible !== false ? 'Activo' : 'Pausado'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MESAS */}
        <div className={`view ${view === 'mesas' ? 'active' : ''}`}>
          <div className="admin-top">
            <div>
              <div className="admin-title">Mesas</div>
              <div className="admin-subtitle">
                {ocupadas} ocupadas de {mesas.length}
              </div>
            </div>
          </div>

          <div className="table-grid">
            {mesas.map((mesa) => {
              const isBusy = mesasActivasIds.has(mesa.id);
              return (
                <div key={mesa.id} className="table-card">
                  <div className="table-num">{mesa.numero}</div>
                  <div className={`table-status ${isBusy ? 'busy' : 'free'}`}>
                    <i className="ti ti-circle-filled"></i>
                    {isBusy ? 'Ocupada' : 'Libre'}
                  </div>
                  <div
                    className="qr-btn"
                    onClick={(e) => { e.stopPropagation(); setQrMesa(mesa); }}
                  >
                    <i className="ti ti-qrcode"></i>
                    Ver QR
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* METRICAS */}
        <div className={`view ${view === 'metricas' ? 'active' : ''}`}>
          <div className="admin-top">
            <div>
              <div className="admin-title">Métricas</div>
              <div className="admin-subtitle">Últimos 7 días</div>
            </div>
          </div>

          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-icon"><i className="ti ti-cash"></i></div>
              <div>
                <div className="kpi-value">{formatearPrecio(totalRevenue)}</div>
                <div className="kpi-label">Facturación total</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon"><i className="ti ti-receipt"></i></div>
              <div>
                <div className="kpi-value">{totalPedidos}</div>
                <div className="kpi-label">Pedidos</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon"><i className="ti ti-chart-bar"></i></div>
              <div>
                <div className="kpi-value">{platosMasPedidos.length}</div>
                <div className="kpi-label">Platos con pedidos</div>
              </div>
            </div>
          </div>

          <div className="dual">
            <div>
              <div className="metric-block">
                <h3>Platos más pedidos</h3>
                {platosMasPedidos.length === 0 && (
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>Sin datos aún</div>
                )}
                {platosMasPedidos.map(([nombre, total]) => (
                  <div key={nombre} className="bar-row">
                    <div className="bar-label">
                      <span>{nombre}</span>
                      <span>{total}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(total / maxPlatoCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="metric-block">
                <h3>Por categoría</h3>
                {Object.keys(cateCounts).length === 0 && (
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>Sin datos aún</div>
                )}
                {Object.entries(cateCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="bar-row">
                      <div className="bar-label">
                        <span>{cateLabels[cat] || cat}</span>
                        <span>{count}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(count / maxCate) * 100}%`, background: 'var(--herb)' }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div className="metric-block" style={{ marginTop: 20 }}>
                <h3>Pedidos por hora</h3>
                <div className="hourly-grid">
                  {hourlyData.filter((h) => h.count > 0).map(({ hour, count, pct }) => (
                    <div key={hour} className="hourly-bar-wrapper">
                      <div className="hourly-count">{count}</div>
                      <div className="hourly-track">
                        <div className="hourly-fill" style={{ height: `${Math.max(pct, 4)}%` }} />
                      </div>
                      <div className="hourly-label">{hour}</div>
                    </div>
                  ))}
                  {hourlyData.every((h) => h.count === 0) && (
                    <div style={{ color: 'var(--muted)', fontSize: 13, padding: 12 }}>Sin datos aún</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <div className={`overlay ${showModal ? 'active' : ''}`} onClick={closeModal}>
        <div className="modal plato-modal-admin" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <div className="modal-title">
                {editingPlato ? 'Editar plato' : 'Nuevo plato'}
              </div>
              <div className="modal-subtitle">
                {editingPlato ? 'Modificá los datos del plato' : 'Cargá un nuevo plato al menú'}
              </div>
            </div>
            <button className="modal-close" onClick={closeModal}>
              <i className="ti ti-x"></i>
            </button>
          </div>

          <div className="modal-body">
            <div className="photo-drop" onClick={() => fotoInputRef.current?.click()}>
            {fotoPreview ? (
              <>
                <img src={fotoPreview} alt="Foto del plato" className="photo-drop-img" />
                <div className="photo-drop-overlay">
                  <i className="ti ti-pencil"></i> Cambiar foto
                </div>
              </>
            ) : (
              <div className="photo-drop-empty">
                <i className="ti ti-photo-up"></i>
                <span>Subir foto</span>
                <small>PNG, JPG o WebP</small>
              </div>
            )}
          </div>
          <input
            ref={fotoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => setFotoFile(e.target.files[0] || null)}
          />

          <div className="field">
            <label>Nombre del plato</label>
            <input
              type="text"
              value={modalForm.nombre}
              onChange={(e) => handleModalChange('nombre', e.target.value)}
              placeholder="Ej: Bunker Cranch Doble"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Precio base</label>
              <input
                type="number"
                value={modalForm.precio}
                onChange={(e) => handleModalChange('precio', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="field">
              <label>Categoría</label>
              <select
                value={modalForm.categoria}
                onChange={(e) => handleModalChange('categoria', e.target.value)}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              className="input-textarea"
              rows={2}
              value={modalForm.descripcion}
              onChange={(e) => handleModalChange('descripcion', e.target.value)}
              placeholder="Doble medallón de 110gr, queso tybo, panceta..."
            />
          </div>

          <div className="custom-section">
            <div className="custom-section-head">
              <div>
                <div className="custom-section-title">Presentaciones</div>
                <div className="custom-section-sub">Variantes con distinto precio</div>
              </div>
              <button className="custom-add" onClick={() => setPresentaciones((p) => [...p, { nombre: '', descripcion: '', precio: '' }])}>
                <i className="ti ti-plus"></i> Agregar
              </button>
            </div>
            {presentaciones.length === 0 && (
              <div className="custom-empty">Sin presentaciones. Ej: Doble, Triple, Cuádruple.</div>
            )}
            {presentaciones.map((p, i) => (
              <div key={i} className="custom-card">
                <div className="custom-card-row">
                  <input
                    type="text"
                    placeholder="Nombre (ej: DOBLE)"
                    value={p.nombre}
                    onChange={(e) => setPresentaciones((prev) => prev.map((x, j) => j === i ? { ...x, nombre: e.target.value } : x))}
                  />
                  <div className="custom-price">
                    <span>$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={p.precio}
                      onChange={(e) => setPresentaciones((prev) => prev.map((x, j) => j === i ? { ...x, precio: e.target.value } : x))}
                    />
                  </div>
                  <button className="custom-del" onClick={() => setPresentaciones((prev) => prev.filter((_, j) => j !== i))}>
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
                <input
                  className="custom-card-desc"
                  type="text"
                  placeholder="Descripción (opcional)"
                  value={p.descripcion}
                  onChange={(e) => setPresentaciones((prev) => prev.map((x, j) => j === i ? { ...x, descripcion: e.target.value } : x))}
                />
              </div>
            ))}
          </div>

          <div className="custom-section">
            <div className="custom-section-head">
              <div>
                <div className="custom-section-title">Agregados</div>
                <div className="custom-section-sub">Extras que el cliente puede sumar</div>
              </div>
              <button className="custom-add" onClick={() => setAgregados((a) => [...a, { nombre: '', descripcion: '', precio: '' }])}>
                <i className="ti ti-plus"></i> Agregar
              </button>
            </div>
            {agregados.length === 0 && (
              <div className="custom-empty">Sin agregados. Ej: Extra cheddar, cebolla caramelizada.</div>
            )}
            {agregados.map((a, i) => (
              <div key={i} className="custom-card">
                <div className="custom-card-row">
                  <input
                    type="text"
                    placeholder="Nombre (ej: EXTRA CHEDAR)"
                    value={a.nombre}
                    onChange={(e) => setAgregados((prev) => prev.map((x, j) => j === i ? { ...x, nombre: e.target.value } : x))}
                  />
                  <div className="custom-price">
                    <span>$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={a.precio}
                      onChange={(e) => setAgregados((prev) => prev.map((x, j) => j === i ? { ...x, precio: e.target.value } : x))}
                    />
                  </div>
                  <button className="custom-del" onClick={() => setAgregados((prev) => prev.filter((_, j) => j !== i))}>
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
                <input
                  className="custom-card-desc"
                  type="text"
                  placeholder="Descripción (opcional)"
                  value={a.descripcion}
                  onChange={(e) => setAgregados((prev) => prev.map((x, j) => j === i ? { ...x, descripcion: e.target.value } : x))}
                />
              </div>
            ))}
          </div>

          <div className="field-row">
            <div className="field">
              <label>Modelo 3D (GLB)</label>
              <div className="upload compact" onClick={() => glbInputRef.current?.click()}>
                <i className="ti ti-box"></i>
                <div>
                  <div className="u-title">{glbFile ? glbFile.name : 'Subir .glb'}</div>
                </div>
                {glbFile && <i className="ti ti-check" style={{ color: 'var(--herb)', marginLeft: 'auto' }}></i>}
              </div>
              <input ref={glbInputRef} type="file" accept=".glb" style={{ display: 'none' }} onChange={(e) => setGlbFile(e.target.files[0] || null)} />
            </div>
            <div className="field">
              <label>Modelo iOS (USDZ)</label>
              <div className="upload compact" onClick={() => usdzInputRef.current?.click()}>
                <i className="ti ti-box"></i>
                <div>
                  <div className="u-title">{usdzFile ? usdzFile.name : 'Subir .usdz'}</div>
                </div>
                {usdzFile && <i className="ti ti-check" style={{ color: 'var(--herb)', marginLeft: 'auto' }}></i>}
              </div>
              <input ref={usdzInputRef} type="file" accept=".usdz" style={{ display: 'none' }} onChange={(e) => setUsdzFile(e.target.files[0] || null)} />
            </div>
          </div>

          <div className="toggle-row">
            <div>
              <div className="t-label">Disponible</div>
              <div className="t-sub">Visible para los clientes</div>
            </div>
            <div
              className={`switch ${modalForm.disponible ? 'on' : ''}`}
              onClick={() => handleModalChange('disponible', !modalForm.disponible)}
            />
          </div>
          </div>

          <div className="modal-footer">
            {editingPlato && (
              <button
                className="btn-delete"
                onClick={() => handleDeletePlato(editingPlato.id)}
              >
                <i className="ti ti-trash"></i> Eliminar
              </button>
            )}
            <button
              className="modal-save"
              disabled={saving || !modalForm.nombre.trim() || !modalForm.precio}
              onClick={handleSavePlato}
            >
              {saving ? 'Guardando...' : editingPlato ? 'Guardar cambios' : 'Crear plato'}
            </button>
          </div>
        </div>
      </div>

      <QRModal mesa={qrMesa} onClose={() => setQrMesa(null)} />
    </div>
  );
}

function AdminSidebar({ view, setView }) {
  const { theme, toggleTheme } = useTheme();
  const items = [
    { key: 'pedidos', label: 'Pedidos', icon: 'ti-receipt' },
    { key: 'menu', label: 'Menú', icon: 'ti-tools-kitchen-2' },
    { key: 'mesas', label: 'Mesas', icon: 'ti-layout-grid' },
    { key: 'metricas', label: 'Métricas', icon: 'ti-chart-bar' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">pedido<span>3D</span></div>
      <nav className="admin-nav">
        {items.map(({ key, label, icon }) => (
          <div
            key={key}
            className={`admin-nav-item ${view === key ? 'active' : ''}`}
            onClick={() => setView(key)}
          >
            <i className={`ti ${icon}`}></i>
            {label}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-bottom">
        <button className="theme-toggle admin-theme-toggle" onClick={toggleTheme}>
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`}></i>
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </div>
    </aside>
  );
}
