import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PlatoDetailModal from '../components/PlatoDetailModal';
import ARViewer from '../components/ARViewer';

const SAMPLE_PLATOS = [
  { id: 1, nombre: 'Hamburguesa demo', descripcion: 'Medallón, queso, lechuga', precio: 13500 },
  { id: 2, nombre: 'Papas demo', descripcion: '+ cheddar', precio: 9500 },
  { id: 3, nombre: 'Napolitana demo', descripcion: 'Muzzarella, jamón, tomate', precio: 11000 },
  { id: 4, nombre: 'Ensalada demo', descripcion: 'Fresca de estación', precio: 6800 },
];

const DEMO_MESAS = [
  { id: 11, numero: 1, activa: true, ocupada: false, pos_x: 30, pos_y: 40, forma: 'circular' },
  { id: 12, numero: 2, activa: true, ocupada: true, pos_x: 60, pos_y: 40, forma: 'rectangular' },
  { id: 13, numero: 3, activa: true, ocupada: false, pos_x: 50, pos_y: 70, forma: 'circular' },
];

export default function DemoPage() {
  const [step, setStep] = useState('mode'); // mode | mesa | menu
  const [tipo, setTipo] = useState(null); // 'mesa' or 'retiro'
  const [mesaId, setMesaId] = useState(null);
  const [mesas] = useState(DEMO_MESAS);
  const { items: cartItems, addToCart, updateQuantity, getSubtotal } = useCart();

  const mesaSeleccionada = useMemo(() => mesas.find((m) => m.id === mesaId), [mesaId, mesas]);

  const [detailPlato, setDetailPlato] = useState(null);
  const [arPlato, setArPlato] = useState(null);

  const total = getSubtotal();

  const handlePickMode = (m) => {
    setTipo(m);
    if (m === 'retiro') {
      setMesaId(null);
      setStep('menu');
    } else {
      setStep('mesa');
    }
  };

  const handleConfirmMesa = () => {
    if (!mesaSeleccionada) return;
    if (mesaSeleccionada.ocupada) return;
    setStep('menu');
  };

  return (
    <div className="demo-page">
      <div className="demo-inner" style={{ maxWidth: 1100, margin: '24px auto', padding: 20 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Demo interactiva</h1>
            <div style={{ color: 'var(--muted)' }}>Experiencia demo: no se usan datos reales.</div>
          </div>
          <Link to="/" className="btn btn-secondary">Volver</Link>
        </header>

        {step === 'mode' && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="mode-opt dine" onClick={() => handlePickMode('mesa')} style={{ cursor: 'pointer' }}>
                <div className="mode-icon"><i className="ti ti-tools-kitchen-2"></i></div>
                <div>
                  <div className="mode-title">Estoy en el local</div>
                  <div className="mode-desc">Escaneá (simulado) y elegí tu mesa en el plano.</div>
                </div>
                <i className="ti ti-chevron-right mode-arrow"></i>
              </div>
              <div className="mode-opt pickup" onClick={() => handlePickMode('retiro')} style={{ cursor: 'pointer' }}>
                <div className="mode-icon"><i className="ti ti-shopping-bag"></i></div>
                <div>
                  <div className="mode-title">Quiero retirar</div>
                  <div className="mode-desc">Elegí para retirar y pasar a buscar.</div>
                </div>
                <i className="ti ti-chevron-right mode-arrow"></i>
              </div>
            </div>
          </div>
        )}

        {step === 'mesa' && (
          <div style={{ marginTop: 18 }}>
            <h3>Seleccioná tu mesa (demo)</h3>
            <div className="plano-pick" style={{ position: 'relative', height: 360, border: '1px dashed var(--hair)', borderRadius: 12, marginTop: 12 }}>
              {mesas.map((m) => (
                <div
                  key={m.id}
                  className={`plano-item plano-mesa ${m.forma === 'rectangular' ? 'rect' : ''} ${m.ocupada ? 'busy' : ''} ${mesaId === m.id ? 'picked' : ''}`}
                  style={{ left: `${m.pos_x}%`, top: `${m.pos_y}%`, transform: 'translate(-50%,-50%)' }}
                  onClick={() => { if (!m.ocupada) setMesaId(m.id); }}
                >
                  <span className="plano-mesa-num">{m.numero}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={handleConfirmMesa} disabled={!mesaId || mesaSeleccionada?.ocupada}>Ver menú · {mesaSeleccionada ? `Mesa ${mesaSeleccionada.numero}` : 'Seleccioná mesa'}</button>
              <button className="btn" onClick={() => setStep('mode')}>Volver</button>
            </div>
          </div>
        )}

        {step === 'menu' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginTop: 18 }}>
            <div>
              <div className="menu-list">
                {SAMPLE_PLATOS.map((p) => (
                  <div key={p.id} className="menu-item" style={{ cursor: 'pointer' }} onClick={() => {
                    if ((p.presentaciones && p.presentaciones.length > 0) || (p.agregados && p.agregados.length > 0)) {
                      setDetailPlato(p);
                    } else if (p.modelo_glb) {
                      setArPlato(p);
                    } else {
                      addToCart(p);
                    }
                  }}>
                    <div className="menu-item-info">
                      <div className="menu-item-name">{p.nombre}</div>
                      <div className="menu-item-desc">{p.descripcion}</div>
                      <div className="menu-item-bottom" style={{ marginTop: 8 }}>
                        <div className="menu-item-price">${p.precio}</div>
                        <div style={{ marginLeft: 'auto' }}>
                          <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Agregar</button>
                          {p.modelo_glb && (
                            <button className="btn btn-sm" style={{ marginLeft: 6 }} onClick={(e) => { e.stopPropagation(); setArPlato(p); }}>
                              VER EN AR
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside style={{ border: '1px solid var(--hair)', borderRadius: 12, padding: 12 }}>
              <h4>Carrito</h4>
              {cartItems.length === 0 ? (
                <div style={{ color: 'var(--muted)' }}>El carrito está vacío.</div>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {cartItems.map((i) => (
                    <div key={i.key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{i.plato.nombre}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>${i.precioUnitario || i.plato.precio}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button className="btn btn-sm" onClick={() => updateQuantity(i.key, i.cantidad - 1)}>-</button>
                        <div>{i.cantidad}</div>
                        <button className="btn btn-sm" onClick={() => updateQuantity(i.key, i.cantidad + 1)}>+</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--hair)', paddingTop: 8, marginTop: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>Total <span>${total}</span></div>
                    <div style={{ marginTop: 8 }}>
                      <button className="btn btn-primary btn-block" onClick={() => alert('Demo: simular checkout')}>Finalizar pedido (demo)</button>
                    </div>
                  </div>
                </div>
              )}
              {detailPlato && (
                <PlatoDetailModal plato={detailPlato} onClose={() => setDetailPlato(null)} />
              )}
              {arPlato && (
                <ARViewer plato={arPlato} onClose={() => setArPlato(null)} onAddToCart={(p) => { addToCart(p); setArPlato(null); }} />
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
