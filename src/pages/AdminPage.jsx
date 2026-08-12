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
import { useNotify } from '../context/NotificationContext';

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
  const { notify, confirm } = useNotify();
  const [view, setView] = useState('pedidos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    if (!modalForm.nombre.trim()) {
      notify('Ingresá el nombre del plato', 'error');
      return;
    }
    if (!modalForm.precio) {
      notify('Ingresá el precio del plato', 'error');
      return;
    }
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

      const presValidas = presentaciones.filter((p) => p.nombre.trim());
      const agreValidas = agregados.filter((a) => a.nombre.trim());

      presValidas.forEach((p, i) => {
        formData.append(`presentaciones[${i}][nombre]`, p.nombre);
        formData.append(`presentaciones[${i}][descripcion]`, p.descripcion || '');
        formData.append(`presentaciones[${i}][precio]`, Number(p.precio) || 0);
      });
      agreValidas.forEach((a, i) => {
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
      notify(editingPlato ? 'Plato actualizado' : 'Plato creado', 'success');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlato = (id) => {
    confirm('¿Eliminar este plato? Esta acción no se puede deshacer.', async () => {
      try {
        await deletePlato(id);
        closeModal();
        fetchPlatos();
        notify('Plato eliminado', 'success');
      } catch (e) {
        notify(e.message, 'error');
      }
    }, { confirmText: 'Eliminar', danger: true });
  };

  const handleToggleDisponible = async (id) => {
    try {
      await togglePlatoDisponible(id);
      fetchPlatos();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handlePagar = async (id) => {
    try {
      await updatePedidoPago(id);
      fetchPedidosYMetricas();
      notify('Pedido marcado como pagado', 'success');
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handleCancelar = (id) => {
    confirm('¿Cancelar este pedido?', async () => {
      try {
        await cancelarPedido(id);
        fetchPedidosYMetricas();
        notify('Pedido cancelado', 'success');
      } catch (e) {
        notify(e.message, 'error');
      }
    }, { confirmText: 'Cancelar pedido', danger: true });
  };

  const handleAvanzar = async (id, estado) => {
    try {
      await updatePedidoEstado(id, estado);
      fetchPedidosYMetricas();
    } catch (e) {
      notify(e.message, 'error');
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

  const ticketPromedio = totalPedidos > 0 ? totalRevenue / totalPedidos : 0;

  const diasData = (() => {
    const dias = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const label = d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '');
      dias.push({ key: d.toDateString(), label, ventas: 0, pedidos: 0 });
    }
    pedidos.forEach((p) => {
      if (p.estado === 'cancelado') return;
      const dia = dias.find((d) => d.key === new Date(p.created_at).toDateString());
      if (!dia) return;
      dia.pedidos += 1;
      dia.ventas += (p.items || []).reduce((s, i) => s + (i.plato?.precio || 0) * (i.cantidad || 1), 0);
    });
    return dias;
  })();
  const maxVentasDia = Math.max(1, ...diasData.map((d) => d.ventas));

  const cateEntries = Object.entries(cateCounts).sort((a, b) => b[1] - a[1]);
  const totalCateItems = cateEntries.reduce((s, [, c]) => s + c, 0) || 1;

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
      <AdminSidebar view={view} setView={setView} open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main">
        <div className="admin-topbar">
          {!sidebarOpen && (
            <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
              <i className="ti ti-menu-2"></i>
            </button>
          )}
          <span className="topbar-date">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <span className="topbar-live">
            <i className="ti ti-bolt"></i> En vivo
          </span>
        </div>

        {/* PEDIDOS */}
        <div className={`view ${view === 'pedidos' ? 'active' : ''}`}>
          <div className="admin-top">
            <div>
              <div className="admin-title">Pedidos de hoy</div>
              <div className="admin-subtitle">Actualizado en tiempo real</div>
            </div>
          </div>

          <div className="admin-metrics">
            <div className="admin-metric metric-ember">
              <div className="admin-metric-icon"><i className="ti ti-receipt-2"></i></div>
              <div>
                <div className="admin-metric-label">Pedidos hoy</div>
                <div className="admin-metric-value">{metricas?.pedidos_hoy || 0}</div>
              </div>
            </div>
            <div className="admin-metric metric-gold">
              <div className="admin-metric-icon"><i className="ti ti-currency-dollar"></i></div>
              <div>
                <div className="admin-metric-label">Ventas hoy</div>
                <div className="admin-metric-value">{formatearPrecio(metricas?.ventas_hoy || 0)}</div>
              </div>
            </div>
            <div className="admin-metric metric-herb">
              <div className="admin-metric-icon"><i className="ti ti-flame"></i></div>
              <div>
                <div className="admin-metric-label">Activos ahora</div>
                <div className="admin-metric-value">{metricas?.activos_ahora || 0}</div>
              </div>
            </div>
            <div className="admin-metric metric-muted">
              <div className="admin-metric-icon"><i className="ti ti-star"></i></div>
              <div>
                <div className="admin-metric-label">Más pedido</div>
                <div className="admin-metric-value admin-metric-value-sm">{metricas?.mas_pedido || '-'}</div>
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
                    <span className="admin-col-count">{colPedidos.length}</span>
                  </div>
                  {colPedidos.map((pedido) => (
                    <div key={pedido.id} className="admin-order">
                      <div className="admin-order-top">
                        <span className="admin-order-id">#{pedido.id}</span>
                        <span className={`admin-tag ${pedido.tipo}`}>
                          {pedido.tipo === 'mesa'
                            ? `Mesa ${pedido.mesa?.numero || '?'}`
                            : pedido.tipo === 'envio'
                              ? 'Envío'
                              : 'Retiro'}
                        </span>
                      </div>

                      {(pedido.nombre || pedido.celular) && (
                        <div className="admin-order-customer">
                          {pedido.nombre && (
                            <span className="customer-name">
                              <i className="ti ti-user"></i> {pedido.nombre}
                            </span>
                          )}
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

                      {pedido.tipo === 'envio' && pedido.direccion && (
                        <div className="admin-order-address">
                          <i className="ti ti-map-pin"></i> {pedido.direccion}
                        </div>
                      )}

                      <div className="admin-order-items">
                        {pedido.items?.map((item) => (
                          <div key={item.id} className="admin-order-item">
                            <div className="aoi-main">
                              <span className="aoi-qty">{item.cantidad}x</span>
                              <span className="aoi-name">{item.plato?.nombre || `Plato #${item.plato_id}`}</span>
                            </div>
                            {item.presentacion_nombre && (
                              <div className="aoi-line aoi-var">{item.presentacion_nombre}</div>
                            )}
                            {item.agregados?.length > 0 && (
                              <div className="aoi-line aoi-extras">
                                + {item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(' · ')}
                              </div>
                            )}
                            {item.observacion && (
                              <div className="aoi-line aoi-obs">“{item.observacion}”</div>
                            )}
                          </div>
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
                          className="kanban-advance advance-pay"
                          onClick={(e) => { e.stopPropagation(); handlePagar(pedido.id); }}
                        >
                          <i className="ti ti-cash"></i> Marcar como pagado
                        </button>
                      )}
                      {(pedido.estado === 'nuevo' || pedido.estado === 'preparacion') && (
                        <button
                          className="kanban-advance advance-cancel"
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

          <div className="kpi-grid">
            <div className="kpi-card kpi-ember">
              <div className="kpi-icon"><i className="ti ti-currency-dollar"></i></div>
              <div className="kpi-body">
                <div className="kpi-value">{formatearPrecio(totalRevenue)}</div>
                <div className="kpi-label">Facturación total</div>
              </div>
            </div>
            <div className="kpi-card kpi-gold">
              <div className="kpi-icon"><i className="ti ti-receipt-2"></i></div>
              <div className="kpi-body">
                <div className="kpi-value">{totalPedidos}</div>
                <div className="kpi-label">Pedidos</div>
              </div>
            </div>
            <div className="kpi-card kpi-herb">
              <div className="kpi-icon"><i className="ti ti-receipt"></i></div>
              <div className="kpi-body">
                <div className="kpi-value">{formatearPrecio(ticketPromedio)}</div>
                <div className="kpi-label">Ticket promedio</div>
              </div>
            </div>
            <div className="kpi-card kpi-muted">
              <div className="kpi-icon"><i className="ti ti-tools-kitchen-2"></i></div>
              <div className="kpi-body">
                <div className="kpi-value">{platosMasPedidos.length}</div>
                <div className="kpi-label">Platos vendidos</div>
              </div>
            </div>
          </div>

          <div className="metric-grid">
            <div className="metric-block">
              <div className="metric-block-head">
                <h3>Facturación por día</h3>
                <span className="metric-hint">últimos 7 días</span>
              </div>
              <div className="day-chart">
                {diasData.map((d) => (
                  <div key={d.key} className="day-bar-wrap">
                    <div className="day-bar-val">{d.ventas > 0 ? `$${Math.round(d.ventas).toLocaleString('es-AR')}` : ''}</div>
                    <div className="day-bar-track">
                      <div
                        className="day-bar-fill"
                        style={{ height: `${Math.max((d.ventas / maxVentasDia) * 100, d.ventas > 0 ? 4 : 1)}%` }}
                      />
                    </div>
                    <div className="day-bar-label">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="metric-block">
              <div className="metric-block-head">
                <h3>Pedidos por hora</h3>
                <span className="metric-hint">distribución diaria</span>
              </div>
              <div className="hour-chart">
                {hourlyData.map(({ hour, count, pct }) => (
                  <div key={hour} className="hour-bar-wrap" title={`${hour} — ${count} pedidos`}>
                    <div className="hour-bar-track">
                      <div className="hour-bar-fill" style={{ height: `${Math.max(pct, count > 0 ? 4 : 1)}%` }} />
                    </div>
                    <div className="hour-bar-label">{hour}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="metric-block">
              <div className="metric-block-head">
                <h3>Platos más pedidos</h3>
                <span className="metric-hint">ranking</span>
              </div>
              {platosMasPedidos.length === 0 && (
                <div className="metric-empty">Sin datos aún</div>
              )}
              <div className="top-list">
                {platosMasPedidos.map(([nombre, total], idx) => (
                  <div key={nombre} className="top-row">
                    <span className={`top-rank rank-${idx + 1}`}>{idx + 1}</span>
                    <div className="top-body">
                      <div className="top-name">{nombre}</div>
                      <div className="top-track">
                        <div
                          className="top-fill"
                          style={{ width: `${(total / maxPlatoCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="top-count">{total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="metric-block">
              <div className="metric-block-head">
                <h3>Por categoría</h3>
                <span className="metric-hint">volumen de venta</span>
              </div>
              {cateEntries.length === 0 && (
                <div className="metric-empty">Sin datos aún</div>
              )}
              <div className="cate-list">
                {cateEntries.map(([cat, count]) => {
                  const pct = Math.round((count / totalCateItems) * 100);
                  return (
                    <div key={cat} className="cate-row">
                      <div className="cate-head">
                        <span>{cateLabels[cat] || cat}</span>
                        <span className="cate-pct">{pct}%</span>
                      </div>
                      <div className="cate-track">
                        <div className="cate-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
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

function AdminSidebar({ view, setView, open, onToggle }) {
  const { theme, toggleTheme } = useTheme();
  const items = [
    { key: 'pedidos', label: 'Pedidos', icon: 'ti-receipt' },
    { key: 'menu', label: 'Menú', icon: 'ti-tools-kitchen-2' },
    { key: 'mesas', label: 'Mesas', icon: 'ti-layout-grid' },
    { key: 'metricas', label: 'Métricas', icon: 'ti-chart-bar' },
  ];

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-brand"><img src="/pidevo.png" alt="Pidevo" className="brand-logo" /></div>
        <button className="hamburger in-sidebar" onClick={onToggle} aria-label="Cerrar menú">
          <i className="ti ti-x"></i>
        </button>
      </div>
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
