import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrderMode } from '../context/OrderModeContext';
import { useCompany } from '../context/CompanyContext';
import { getMesas } from '../api/client';

export default function ModeSelectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTipo, setMesaId } = useOrderMode();
  const { path } = useCompany();
  const [step, setStep] = useState('mode');
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');

  const lastOrder = (() => {
    try {
      const raw = localStorage.getItem('pidevo_last_order') || localStorage.getItem('pedido3d_last_order');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  useEffect(() => {
    getMesas().then(setMesas).catch(() => {});
  }, []);

  useEffect(() => {
    const mesaParam = searchParams.get('mesa');
    if (mesaParam && mesas.length > 0) {
      const mesa = mesas.find((m) => m.id === Number(mesaParam));
      if (mesa && mesa.activa) {
        setTipo('mesa');
        setMesaId(mesa.id);
        navigate(path('/menu'), { replace: true });
      }
    }
  }, [mesas, searchParams, setTipo, setMesaId, navigate, path]);

  const handlePickMode = (modo) => {
    setTipo(modo);
    if (modo === 'retiro') {
      setMesaId(null);
      navigate(path('/menu'));
    } else {
      setStep('mesa');
    }
  };

  const handleConfirmMesa = () => {
    if (!mesaSeleccionada) return;
    setMesaId(Number(mesaSeleccionada));
    navigate(path('/menu'));
  };

  if (step === 'mesa') {
    return (
      <div className="mode-screen">
        <div className="mode-logo"><img src="/pidevo.png" alt="Pidevo" className="brand-logo" /></div>
        <div className="mode-sub">¿En qué mesa estás?</div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Número de mesa
          </label>
          <select
            className="select-input"
            value={mesaSeleccionada}
            onChange={(e) => setMesaSeleccionada(e.target.value)}
            style={{ fontSize: 16 }}
          >
            <option value="">Seleccioná tu mesa</option>
            {mesas.filter(m => m.activa).map((mesa) => (
              <option key={mesa.id} value={mesa.id}>
                Mesa {mesa.numero}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleConfirmMesa}
          disabled={!mesaSeleccionada}
        >
          Ver menú
        </button>
      </div>
    );
  }

  return (
    <div className="mode-screen">
      <div className="mode-eyebrow">Bienvenido</div>
      <div className="mode-logo"><img src="/pidevo.png" alt="Pidevo" className="brand-logo" /></div>
      <div className="mode-sub">Elegí cómo vas a disfrutar tu pedido hoy.</div>

      <div className="mode-opt dine" onClick={() => handlePickMode('mesa')}>
        <div className="mode-icon">
          <i className="ti ti-tools-kitchen-2"></i>
        </div>
        <div>
          <div className="mode-title">Estoy en el local</div>
          <div className="mode-desc">Escaneás el QR de tu mesa y pedís desde ahí. Lo traemos a la mesa.</div>
        </div>
        <i className="ti ti-chevron-right mode-arrow"></i>
      </div>

      <div className="mode-opt pickup" onClick={() => handlePickMode('retiro')}>
        <div className="mode-icon">
          <i className="ti ti-shopping-bag"></i>
        </div>
        <div>
          <div className="mode-title">Quiero retirar</div>
          <div className="mode-desc">Pedís desde donde estés y pasás a buscarlo por el local.</div>
        </div>
        <i className="ti ti-chevron-right mode-arrow"></i>
      </div>

      {lastOrder && (
        <div className="track-my-order" onClick={() => navigate(path(`/pedido/${lastOrder.id}`))}>
          <div className="track-icon">
            <i className="ti ti-eye"></i>
          </div>
          <div>
            <div className="track-label">Seguir mi pedido</div>
            <div className="track-desc">Pedido #{lastOrder.id} · {lastOrder.tipo === 'mesa' ? `Mesa ${lastOrder.mesaNumero}` : 'Retiro'} · {new Date(lastOrder.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <i className="ti ti-chevron-right mode-arrow"></i>
        </div>
      )}

      <div className="track-my-order manual" onClick={() => {
        const id = prompt('Ingresá el número de tu pedido:');
        if (id && /^\d+$/.test(id.trim())) navigate(path(`/pedido/${id.trim()}`));
      }}>
        <div className="track-icon">
          <i className="ti ti-search"></i>
        </div>
        <div>
          <div className="track-label">Buscar otro pedido</div>
          <div className="track-desc">Ingresá el número de pedido manualmente</div>
        </div>
        <i className="ti ti-chevron-right mode-arrow"></i>
      </div>
    </div>
  );
}
