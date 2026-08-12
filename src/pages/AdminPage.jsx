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
  cancelarPedido,
} from '../api/client';
import { useSSE } from '../api/useSSE';
import QRModal from '../components/QRModal';
import { AdminSkeleton } from '../components/Skeletons';

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
  const [qrMesa, setQrMesa] = useState(null);

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
                      <div className="admin-order-items">
                        {pedido.items?.map((item) => (
                          <span key={item.id}>
                            {item.cantidad} {item.plato?.nombre || `Plato #${item.plato_id}`}
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
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top">
            <div className="modal-title">
              {editingPlato ? 'Editar plato' : 'Nuevo plato'}
            </div>
            <button className="modal-close" onClick={closeModal}>
              <i className="ti ti-x"></i>
            </button>
          </div>

          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              value={modalForm.nombre}
              onChange={(e) => handleModalChange('nombre', e.target.value)}
              placeholder="Nombre del plato"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Precio</label>
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
            <input
              type="text"
              value={modalForm.descripcion}
              onChange={(e) => handleModalChange('descripcion', e.target.value)}
              placeholder="Descripción breve"
            />
          </div>

          <div className="field">
            <label>Foto</label>
            <div className="upload" onClick={() => fotoInputRef.current?.click()}>
              <i className="ti ti-photo"></i>
              <div>
                <div className="u-title">{fotoFile ? fotoFile.name : 'Subir imagen'}</div>
                <div className="u-sub">PNG, JPG o WebP</div>
              </div>
              {fotoFile && (
                <i className="ti ti-check" style={{ color: 'var(--herb)', marginLeft: 'auto' }}></i>
              )}
            </div>
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => setFotoFile(e.target.files[0] || null)}
            />
          </div>

          <div className="field">
            <label>Modelo 3D (GLB)</label>
            <div className="upload" onClick={() => glbInputRef.current?.click()}>
              <i className="ti ti-box"></i>
              <div>
                <div className="u-title">{glbFile ? glbFile.name : 'Subir modelo GLB'}</div>
                <div className="u-sub">Archivo .glb</div>
              </div>
              {glbFile && (
                <i className="ti ti-check" style={{ color: 'var(--herb)', marginLeft: 'auto' }}></i>
              )}
            </div>
            <input
              ref={glbInputRef}
              type="file"
              accept=".glb"
              style={{ display: 'none' }}
              onChange={(e) => setGlbFile(e.target.files[0] || null)}
            />
          </div>

          <div className="field">
            <label>Modelo iOS (USDZ)</label>
            <div className="upload" onClick={() => usdzInputRef.current?.click()}>
              <i className="ti ti-box"></i>
              <div>
                <div className="u-title">{usdzFile ? usdzFile.name : 'Subir modelo USDZ'}</div>
                <div className="u-sub">Archivo .usdz</div>
              </div>
              {usdzFile && (
                <i className="ti ti-check" style={{ color: 'var(--herb)', marginLeft: 'auto' }}></i>
              )}
            </div>
            <input
              ref={usdzInputRef}
              type="file"
              accept=".usdz"
              style={{ display: 'none' }}
              onChange={(e) => setUsdzFile(e.target.files[0] || null)}
            />
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

          {editingPlato && (
            <button
              className="btn btn-block"
              style={{
                background: 'transparent',
                color: 'var(--ember)',
                border: '1px solid var(--hair)',
                borderRadius: 12,
                padding: '11px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 12,
              }}
              onClick={() => handleDeletePlato(editingPlato.id)}
            >
              <i className="ti ti-trash"></i> Eliminar plato
            </button>
          )}

          <button
            className="modal-save"
            disabled={saving || !modalForm.nombre.trim() || !modalForm.precio}
            onClick={handleSavePlato}
          >
            {saving ? 'Guardando...' : 'Guardar plato'}
          </button>
        </div>
      </div>

      <QRModal mesa={qrMesa} onClose={() => setQrMesa(null)} />
    </div>
  );
}

function AdminSidebar({ view, setView }) {
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
    </aside>
  );
}
