import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrderMode } from '../context/OrderModeContext';
import { useCompany } from '../context/CompanyContext';
import { getMesas } from '../api/client';
import { TIPOS_FIJO, mesaStyle, fixStyle } from '../components/planoUtils';
import QRInstructionsModal from '../components/QRInstructionsModal';
import { useLocation } from 'react-router-dom';

export default function ModeSelectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTipo, setMesaId } = useOrderMode();
  const { path, empresa, slug } = useCompany();
  const [step, setStep] = useState('mode');
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [ocupadaMsg, setOcupadaMsg] = useState(false);
  const [showQrInstructions, setShowQrInstructions] = useState(false);
  const location = useLocation();

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
    if (step !== 'mesa') return;
    const refresh = () => {
      getMesas()
        .then((data) => {
          setMesas(data);
          setMesaSeleccionada((prev) => {
            const m = data.find((x) => x.id === Number(prev));
            return m && m.ocupada ? '' : prev;
          });
        })
        .catch(() => {});
    };
    refresh();
    const t = setInterval(refresh, 4000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    const mesaParam = searchParams.get('mesa');
    const openPicker = searchParams.get('open_picker');
    if (mesaParam && mesas.length > 0) {
      const mesa = mesas.find((m) => m.id === Number(mesaParam));
      if (mesa && mesa.activa) {
        setTipo('mesa');
        setMesaId(mesa.id);
        navigate(path('/menu'), { replace: true });
      }
    }
    // if query requests opening picker, switch to mesa step
    if (openPicker === '1') {
      setStep('mesa');
    }
  }, [mesas, searchParams, setTipo, setMesaId, navigate, path]);

  const handlePickMode = (modo) => {
    setTipo(modo);
    if (modo === 'retiro') {
      setMesaId(null);
      navigate(path('/menu'));
    } else {
      // si tenemos slug en path, abrimos el picker; si no, mostramos instrucciones QR
      if (slug) {
        setStep('mesa');
        // si la query indica abrir picker, no cambiamos
      } else {
        setShowQrInstructions(true);
      }
    }
  };

  const handleConfirmMesa = () => {
    if (!mesaSeleccionada) return;
    const mesa = mesas.find((m) => m.id === Number(mesaSeleccionada));
    if (mesa?.ocupada) {
      setOcupadaMsg(true);
      return;
    }
    setMesaId(Number(mesaSeleccionada));
    navigate(path('/menu'));
  };

  if (step === 'mesa') {
    const activas = mesas.filter((m) => m.activa);
    const fixtures = Array.isArray(empresa?.layout) ? empresa.layout : [];
    const hasPlano = activas.some((m) => m.pos_x != null && m.pos_y != null) || fixtures.length > 0;
    const mesaPick = activas.find((m) => m.id === Number(mesaSeleccionada));

    return (
      <div className="mode-screen">
        <button type="button" className="back-link" onClick={() => setStep('mode')}>
          <i className="ti ti-arrow-left"></i>
          Volver
        </button>
        <div className="mode-sub">¿En qué mesa estás?</div>

        {hasPlano ? (
          <>
            <div className="plano-pick">
              {fixtures.map((fix, i) => {
                const cfg = TIPOS_FIJO[fix.tipo];
                if (!cfg) return null;
                return (
                  <div key={i} className={`plano-item plano-fix plano-fix-${fix.tipo}`} style={fixStyle(fix)}>
                    <i className={`ti ${cfg.icon}`}></i>
                    <span>{cfg.label}</span>
                  </div>
                );
              })}
              {activas.map((mesa) => (
                <div
                  key={mesa.id}
                  className={`plano-item plano-mesa ${mesa.forma === 'rectangular' ? 'rect' : ''} ${mesa.ocupada ? 'busy' : ''} ${Number(mesaSeleccionada) === mesa.id ? 'picked' : ''}`}
                  style={mesaStyle(mesa)}
                  onClick={() => {
                    if (mesa.ocupada) {
                      setMesaSeleccionada('');
                      setOcupadaMsg(true);
                      return;
                    }
                    setOcupadaMsg(false);
                    setMesaSeleccionada(String(mesa.id));
                  }}
                >
                  <span className="plano-mesa-num">{mesa.numero}</span>
                </div>
              ))}
            </div>
            <div className="plano-pick-tip">
              <i className="ti ti-corner-up-right"></i>
              {ocupadaMsg ? (
                <span className="plano-ocupada-msg">Esa mesa está ocupada — tocá otra</span>
              ) : (
                <span>Tocá tu mesa en el mapa · las <b style={{ color: 'var(--ember)' }}>rojas</b> están ocupadas</span>
              )}
            </div>
          </>
        ) : (
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
              {activas.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa {mesa.numero}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleConfirmMesa}
          disabled={!mesaSeleccionada || mesaPick?.ocupada}
        >
          {mesaPick?.ocupada ? 'Mesa ocupada' : mesaPick ? `Ver menú · Mesa ${mesaPick.numero}` : 'Ver menú'}
        </button>
      </div>
    );
  }

  return (
    <div className="mode-screen">
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
        <div className="track-my-order" onClick={() => navigate(path(`/pedido/${lastOrder.id}?t=${lastOrder.token}`))}>
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

      {showQrInstructions && <QRInstructionsModal onClose={() => setShowQrInstructions(false)} />}
    </div>
  );
}
