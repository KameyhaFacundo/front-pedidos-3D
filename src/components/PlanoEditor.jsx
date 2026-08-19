import { useState, useEffect, useRef } from 'react';
import { getEmpresa, createMesa, updateMesa, deleteMesa, toggleMesaActiva, saveLayout } from '../api/client';
import { TIPOS_FIJO, mesaStyle, fixStyle, clamp, nextNumero } from './planoUtils';

const ESTADO_LABELS = { nuevo: 'Nuevo', preparacion: 'En preparación', listo: 'Listo' };
const ESTADO_DOT = { nuevo: 'new', preparacion: 'prep', listo: 'ready' };

function formatPrecio(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pctFromEvent(e, canvas) {
  const r = canvas.getBoundingClientRect();
  return {
    x: clamp(((e.clientX - r.left) / r.width) * 100, 2, 98),
    y: clamp(((e.clientY - r.top) / r.height) * 100, 2, 98),
  };
}

export default function PlanoEditor({ mesas, busyIds, ordersPorMesa = {}, onQrMesa, onSaved, notify }) {
  const [localMesas, setLocalMesas] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selected, setSelected] = useState(null);
  const [verPedidoMesa, setVerPedidoMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const endDragRef = useRef(null);

  useEffect(() => {
    setLocalMesas(mesas);
  }, [mesas]);

  useEffect(() => {
    getEmpresa()
      .then((e) => setFixtures(Array.isArray(e?.layout) ? e.layout : []))
      .finally(() => setLoading(false));
  }, []);

  const beginDrag = (kind, id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const p = pctFromEvent(e, canvasRef.current);
    const target =
      kind === 'mesa'
        ? localMesas.find((m) => m.id === id)
        : fixtures.find((f) => f.key === id);
    if (!target) return;
    dragRef.current = {
      kind,
      id,
      moved: false,
      ox: target.x !== undefined ? target.x - p.x : (target.pos_x ?? 50) - p.x,
      oy: target.y !== undefined ? target.y - p.y : (target.pos_y ?? 50) - p.y,
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', endDrag);
  };

  const handleMove = (e) => {
    if (!dragRef.current) return;
    dragRef.current.moved = true;
    const p = pctFromEvent(e, canvasRef.current);
    const { kind, id, ox, oy } = dragRef.current;
    if (kind === 'mesa') {
      setLocalMesas((prev) =>
        prev.map((m) => (m.id === id ? { ...m, pos_x: Math.round((p.x + ox) * 10) / 10, pos_y: Math.round((p.y + oy) * 10) / 10 } : m))
      );
    } else {
      setFixtures((prev) =>
        prev.map((f) =>
          f.key === id
            ? { ...f, x: Math.round((p.x + ox) * 10) / 10, y: Math.round((p.y + oy) * 10) / 10 }
            : f
        )
      );
    }
    setDirty(true);
    if (kind === 'mesa') setSelected({ kind: 'mesa', id });
    else setSelected({ kind: 'fix', id });
  };

  const endDrag = () => {
    const d = dragRef.current;
    dragRef.current = null;
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', endDrag);
    if (d && !d.moved && d.kind === 'mesa') {
      const mesa = localMesas.find((m) => m.id === d.id);
      if (mesa && busyIds.has(mesa.id)) {
        setVerPedidoMesa(mesa);
      }
    }
  };

  useEffect(() => {
    endDragRef.current = endDrag;
  });
  useEffect(() => () => endDragRef.current && endDragRef.current(), []);

  const addMesa = async () => {
    const numero = nextNumero(localMesas);
    try {
      const creada = await createMesa({ numero, forma: 'circular', activa: true, pos_x: 50, pos_y: 45 });
      setLocalMesas((prev) => [...prev, creada]);
      setSelected({ kind: 'mesa', id: creada.id });
      setDirty(true);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const addFijo = (tipo) => {
    const key = `fix_${Date.now()}`;
    setFixtures((prev) => [...prev, { key, tipo, x: 50, y: 45, w: undefined, h: undefined, rotacion: 0 }]);
    setSelected({ kind: 'fix', id: key });
    setDirty(true);
  };

  const setMesaProp = (id, patch) => {
    setLocalMesas((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setDirty(true);
  };

  const setFixProp = (id, patch) => {
    setFixtures((prev) => prev.map((f) => (f.key === id ? { ...f, ...patch } : f)));
    setDirty(true);
  };

  const removeSelected = async () => {
    if (!selected) return;
    if (selected.kind === 'mesa') {
      try {
        await deleteMesa(selected.id);
        setLocalMesas((prev) => prev.filter((m) => m.id !== selected.id));
        setDirty(true);
      } catch (err) {
        notify(err.message, 'error');
      }
    } else {
      setFixtures((prev) => prev.filter((f) => f.key !== selected.id));
      setDirty(true);
    }
    setSelected(null);
  };

  const toggleSelectedActiva = async () => {
    if (!selected || selected.kind !== 'mesa') return;
    const mesa = localMesas.find((m) => m.id === selected.id);
    if (!mesa) return;
    try {
      const res = await toggleMesaActiva(mesa.id);
      setLocalMesas((prev) => prev.map((m) => (m.id === res.id ? res : m)));
      setDirty(true);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ops = localMesas.map((m) => {
        const orig = mesas.find((x) => x.id === m.id);
        const changed =
          !orig ||
          orig.pos_x !== m.pos_x ||
          orig.pos_y !== m.pos_y ||
          orig.forma !== m.forma ||
          (orig.rotacion || 0) !== (m.rotacion || 0) ||
          orig.activa !== m.activa;
        if (!changed) return Promise.resolve();
        return updateMesa(m.id, {
          pos_x: m.pos_x,
          pos_y: m.pos_y,
          forma: m.forma,
          rotacion: m.rotacion || 0,
          activa: m.activa,
        });
      });
      await Promise.all(ops);
      await saveLayout(
        fixtures.map(({ key: _key, ...f }) => f)
      );
      setDirty(false);
      notify('Plano guardado', 'success');
      onSaved();
    } catch (err) {
      notify(err.message || 'Error al guardar el plano', 'error');
    } finally {
      setSaving(false);
    }
  };

  const selectedMesa = selected?.kind === 'mesa' ? localMesas.find((m) => m.id === selected.id) : null;
  const selectedFix = selected?.kind === 'fix' ? fixtures.find((f) => f.key === selected.id) : null;

  if (loading) {
    return <div className="plano-loading">Cargando plano...</div>;
  }

  return (
    <div className="plano-editor">
      <div className="plano-toolbar">
        <button className="plano-tool" onClick={addMesa}>
          <i className="ti ti-plus"></i> Mesa
        </button>
        {Object.entries(TIPOS_FIJO).map(([tipo, cfg]) => (
          <button key={tipo} className="plano-tool" onClick={() => addFijo(tipo)}>
            <i className={`ti ${cfg.icon}`}></i> {cfg.label}
          </button>
        ))}
      </div>

      <div className="plano-legend">
        <span><i className="dot dot-free"></i> Libre</span>
        <span><i className="dot dot-busy"></i> Ocupada</span>
        <span className="plano-legend-hint">
          <i className="ti ti-move"></i> Arrastrá los elementos para acomodarlos como están en el local
        </span>
      </div>

      <div className="plano-canvas" ref={canvasRef}>
        <div className="plano-walls"><div className="plano-wall-top"></div></div>

        {fixtures.map((fix) => {
          const cfg = TIPOS_FIJO[fix.tipo];
          const isSel = selected?.kind === 'fix' && selected.id === fix.key;
          if (!cfg) return null;
          return (
            <div
              key={fix.key}
              className={`plano-item plano-fix plano-fix-${fix.tipo} ${isSel ? 'selected' : ''}`}
              style={fixStyle(fix)}
              onPointerDown={(e) => { beginDrag('fix', fix.key, e); setSelected({ kind: 'fix', id: fix.key }); }}
            >
              <span>{cfg.label}</span>
            </div>
          );
        })}

        {localMesas.map((mesa) => {
          const isBusy = busyIds.has(mesa.id);
          const isSel = selected?.kind === 'mesa' && selected.id === mesa.id;
          return (
            <div
              key={mesa.id}
              className={`plano-mesa ${mesa.forma === 'rectangular' ? 'rect' : ''} ${isBusy ? 'busy' : ''} ${!mesa.activa ? 'off' : ''} ${isSel ? 'selected' : ''}`}
              style={mesaStyle(mesa)}
              onPointerDown={(e) => { beginDrag('mesa', mesa.id, e); setSelected({ kind: 'mesa', id: mesa.id }); }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="plano-mesa-num">{mesa.numero}</span>
              {isSel && (
                <button
                  className="plano-mesa-qr"
                  onClick={(e) => { e.stopPropagation(); onQrMesa(mesa); }}
                  title="Ver QR"
                >
                  <i className="ti ti-qrcode"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {(selectedMesa || selectedFix) && (
        <div className="plano-controls">
          {selectedMesa && (
            <>
              <div className="plano-control-group">
                <span className="plano-control-label">Forma</span>
                <button
                  className={`plano-chip ${selectedMesa.forma !== 'rectangular' ? 'on' : ''}`}
                  onClick={() => setMesaProp(selectedMesa.id, { forma: 'circular' })}
                >
                  Redonda
                </button>
                <button
                  className={`plano-chip ${selectedMesa.forma === 'rectangular' ? 'on' : ''}`}
                  onClick={() => setMesaProp(selectedMesa.id, { forma: 'rectangular' })}
                >
                  Rectangular
                </button>
              </div>
              <div className="plano-control-group">
                <span className="plano-control-label">Rotar</span>
                <button className="plano-chip" onClick={() => setMesaProp(selectedMesa.id, { rotacion: ((selectedMesa.rotacion || 0) + 45) % 360 })}>
                  <i className="ti ti-rotate-clockwise-2"></i> {selectedMesa.rotacion || 0}°
                </button>
              </div>
              <button className="plano-chip" onClick={toggleSelectedActiva}>
                <i className={`ti ${selectedMesa.activa ? 'ti-toggle-right' : 'ti-toggle-left'}`}></i>
                {selectedMesa.activa ? 'Activa' : 'Inactiva'}
              </button>
              <button className="plano-chip plano-chip-del" onClick={removeSelected}>
                <i className="ti ti-trash"></i> Eliminar
              </button>
            </>
          )}
          {selectedFix && (
            <>
              {selectedFix.tipo === 'muro' && (
                <div className="plano-control-group">
                  <span className="plano-control-label">Ancho (%)</span>
                  <input
                    type="range"
                    min={6}
                    max={90}
                    value={(selectedFix.w ?? (TIPOS_FIJO[selectedFix.tipo]?.w || 45))}
                    onChange={(e) => setFixProp(selectedFix.key, { w: Number(e.target.value) })}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="plano-chip" onClick={() => setFixProp(selectedFix.key, { w: Math.max(6, (selectedFix.w ?? TIPOS_FIJO[selectedFix.tipo].w) - 5) })}>-</button>
                    <div style={{ alignSelf: 'center' }}>{Math.round((selectedFix.w ?? TIPOS_FIJO[selectedFix.tipo].w) * 10) / 10}%</div>
                    <button className="plano-chip" onClick={() => setFixProp(selectedFix.key, { w: Math.min(90, (selectedFix.w ?? TIPOS_FIJO[selectedFix.tipo].w) + 5) })}>+</button>
                  </div>
                </div>
              )}
              <div className="plano-control-group">
                <span className="plano-control-label">Rotar</span>
                <button className="plano-chip" onClick={() => setFixProp(selectedFix.key, { rotacion: ((selectedFix.rotacion || 0) + 45) % 360 })}>
                  <i className="ti ti-rotate-clockwise-2"></i> {selectedFix.rotacion || 0}°
                </button>
              </div>
              <button className="plano-chip plano-chip-del" onClick={removeSelected}>
                <i className="ti ti-trash"></i> Eliminar
              </button>
            </>
          )}
        </div>
      )}

      <div className="plano-savebar">
        <span className="plano-save-hint">{dirty ? 'Tenés cambios sin guardar' : 'Todo guardado'}</span>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !dirty}>
          {saving ? 'Guardando...' : 'Guardar plano'}
        </button>
      </div>

      {verPedidoMesa && (
        <div className="overlay active" onClick={() => setVerPedidoMesa(null)}>
          <div className="modal plano-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Mesa {verPedidoMesa.numero}</div>
                <div className="modal-subtitle">Pedidos en curso</div>
              </div>
              <button className="modal-close" onClick={() => setVerPedidoMesa(null)}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            <div className="modal-body">
              {(ordersPorMesa[verPedidoMesa.id] || []).length === 0 ? (
                <div className="plano-order-empty">Sin pedidos activos en esta mesa</div>
              ) : (
                (ordersPorMesa[verPedidoMesa.id] || []).map((order) => (
                  <div key={order.id} className="plano-order">
                    <div className="plano-order-head">
                      <span className="plano-order-id">Pedido #{order.id}</span>
                      <span className={`col-dot ${ESTADO_DOT[order.estado] || 'new'}`}></span>
                      <span className="plano-order-estado">{ESTADO_LABELS[order.estado] || order.estado}</span>
                      <span className={`plano-order-pay ${order.estado_pago === 'pagado' ? 'ok' : 'pending'}`}>
                        {order.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="plano-order-items">
                      {order.items?.map((item) => (
                        <div key={item.id} className="plano-order-item">
                          <div className="plano-order-item-main">
                            <span className="plano-order-qty">{item.cantidad}x</span>
                            <span>{item.plato?.nombre || `Plato #${item.plato_id}`}</span>
                          </div>
                          {item.presentacion_nombre && <div className="plano-order-line">{item.presentacion_nombre}</div>}
                          {item.agregados?.length > 0 && (
                            <div className="plano-order-line">
                              + {item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(' · ')}
                            </div>
                          )}
                          {item.observacion && <div className="plano-order-line">“{item.observacion}”</div>}
                        </div>
                      ))}
                    </div>
                    <div className="plano-order-bottom">
                      <span className="plano-order-time">
                        {new Date(order.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="plano-order-total">
                        Total {formatPrecio(
                          (order.items || []).reduce((s, i) => s + (i.plato?.precio || 0) * (i.cantidad || 1), 0)
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}