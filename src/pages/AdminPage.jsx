import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPedidos,
  getMetricas,
  getMesas,
  getPlatos,
  updatePedidoPago,
  updatePedidoEstado,
  cancelarPedido,
  getEmpresa,
  updateEmpresa,
  logout as apiLogout,
} from '../api/client';
import { useSSE } from '../api/useSSE';
import QRModal from '../components/QRModal';
import AdminSidebar from '../components/AdminSidebar';
import { AdminSkeleton } from '../components/Skeletons';
import AdminPedidosView from '../components/admin/AdminPedidosView';
import AdminMenuView from '../components/admin/AdminMenuView';
import AdminMesasView from '../components/admin/AdminMesasView';
import AdminMetricasView from '../components/admin/AdminMetricasView';
import AdminConfigView from '../components/admin/AdminConfigView';
import PlatoModal from '../components/admin/PlatoModal';
import { useNotify } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import { playNewOrderSound, soundEnabled } from '../components/adminUtils';

export default function AdminPage() {
  const { notify, confirm } = useNotify();
  const { logout } = useAuth();
  const { slug } = useCompany();
  const navigate = useNavigate();
  const [view, setView] = useState('pedidos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configForm, setConfigForm] = useState({ nombre: '', whatsapp: '' });
  const [savingConfig, setSavingConfig] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlato, setModalPlato] = useState(null);
  const [qrMesa, setQrMesa] = useState(null);
  const seenIdsRef = useRef(new Set());

  const fetchPedidosYMetricas = useCallback(() => {
    Promise.all([getPedidos(), getMetricas()])
      .then(([pedidosData, metricasData]) => {
        pedidosData.forEach((p) => seenIdsRef.current.add(p.id));
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
    Promise.all([getMesas(true), getPedidos()])
      .then(([mesasData, pedidosData]) => {
        pedidosData.forEach((p) => seenIdsRef.current.add(p.id));
        setMesas(mesasData);
        setPedidos(pedidosData);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPedidosYMetricas();
  }, [fetchPedidosYMetricas]);

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
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
  }, []);

  const handleSaveConfig = async () => {
    if (!configForm.nombre.trim()) {
      notify('Ingresá el nombre del local', 'error');
      return;
    }
    setSavingConfig(true);
    try {
      const empresa = await updateEmpresa({
        nombre: configForm.nombre.trim(),
        whatsapp: configForm.whatsapp.trim(),
      });
      setConfigForm({ nombre: empresa.nombre || '', whatsapp: empresa.whatsapp || '' });
      notify('Datos guardados', 'success');
    } catch (err) {
      notify(err.message || 'Error al guardar', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {}
    logout();
    navigate(slug ? `/${slug}/login` : '/');
  };

  useSSE(handleSSEUpdate);

  const baseTitle = 'Pidevo Admin';
  useEffect(() => {
    const nuevos = pedidos.filter((p) => p.estado === 'nuevo').length;
    document.title = nuevos > 0 ? `(${nuevos}) ${baseTitle}` : baseTitle;
  }, [pedidos]);

  useEffect(() => {
    if (view === 'menu' || view === 'metricas') fetchPlatos();
    if (view === 'mesas') fetchMesasData();
    if (view === 'configuracion') {
      getEmpresa().then((e) => {
        if (e) setConfigForm({ nombre: e.nombre || '', whatsapp: e.whatsapp || '' });
      }).catch(() => {});
    }
  }, [view, fetchPlatos, fetchMesasData]);

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

  const pedidosActivos = pedidos.filter((p) =>
    ['nuevo', 'preparacion', 'listo'].includes(p.estado)
  );
  const mesasActivasIds = new Set(
    pedidosActivos
      .filter((p) => p.tipo === 'mesa' && p.mesa)
      .map((p) => p.mesa.id)
  );
  const ocupadas = mesasActivasIds.size;

  const ordersPorMesa = (() => {
    const map = {};
    pedidos
      .filter((p) => p.tipo === 'mesa' && p.mesa_id && ['nuevo', 'preparacion', 'listo'].includes(p.estado))
      .forEach((p) => {
        (map[p.mesa_id] ||= []).push(p);
      });
    return map;
  })();

  if (loading) return <AdminSkeleton />;

  return (
    <div className="admin-layout">
      <AdminSidebar view={view} setView={setView} open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} onLogout={handleLogout} slug={slug} />
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

        <AdminPedidosView
          active={view === 'pedidos'}
          pedidos={pedidos}
          metricas={metricas}
          slug={slug}
          onAvanzar={handleAvanzar}
          onPagar={handlePagar}
          onCancelar={handleCancelar}
        />

        <AdminMenuView
          active={view === 'menu'}
          platos={platos}
          onNew={() => { setModalPlato(null); setModalOpen(true); }}
          onEdit={(plato) => { setModalPlato(plato); setModalOpen(true); }}
        />

        <AdminMesasView
          active={view === 'mesas'}
          mesas={mesas}
          ocupadas={ocupadas}
          mesasActivasIds={mesasActivasIds}
          ordersPorMesa={ordersPorMesa}
          onQrMesa={setQrMesa}
          onSaved={fetchMesasData}
          notify={notify}
        />

        <AdminMetricasView active={view === 'metricas'} pedidos={pedidos} />

        <AdminConfigView
          active={view === 'configuracion'}
          configForm={configForm}
          setConfigForm={setConfigForm}
          onSave={handleSaveConfig}
          saving={savingConfig}
        />
      </div>

      <PlatoModal
        open={modalOpen}
        plato={modalPlato}
        onClose={() => { setModalOpen(false); setModalPlato(null); }}
        onSaved={fetchPlatos}
      />

      <QRModal mesa={qrMesa} onClose={() => setQrMesa(null)} />
    </div>
  );
}