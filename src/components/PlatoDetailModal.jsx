import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function formatear(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const EMPTY = [];

export default function PlatoDetailModal({ plato, onClose }) {
  const { addToCart } = useCart();
  const presentaciones = plato?.presentaciones || EMPTY;
  const agregados = plato?.agregados || EMPTY;

  const [presentacion, setPresentacion] = useState(null);
  const [seleccion, setSeleccion] = useState({});
  const [observacion, setObservacion] = useState('');

  useEffect(() => {
    if (presentaciones.length > 0 && !presentacion) {
      setPresentacion(presentaciones[0].nombre);
    }
  }, [presentaciones, presentacion]);

  if (!plato) return null;

  const precioBase = presentacion
    ? presentaciones.find((p) => p.nombre === presentacion)?.precio ?? plato.precio
    : plato.precio;

  const extras = agregados
    .filter((a) => (seleccion[a.id] || 0) > 0)
    .map((a) => ({ nombre: a.nombre, cantidad: seleccion[a.id], precio: a.precio }));

  const extraTotal = extras.reduce((sum, e) => sum + Number(e.precio) * e.cantidad, 0);
  const total = Number(precioBase) + extraTotal;

  const handleAgregar = () => {
    addToCart(plato, {
      presentacion,
      agregados: extras,
      observacion,
      cantidad: 1,
    });
    onClose();
  };

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="plato-modal" onClick={(e) => e.stopPropagation()}>
        <div className="plato-modal-hero">
          {plato.foto ? (
            <img src={plato.foto} alt={plato.nombre} loading="lazy" />
          ) : (
            <div className="plato-modal-hero-placeholder"><i className="ti ti-meat"></i></div>
          )}
          <button className="plato-modal-close" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div className="plato-modal-body">
          <div className="plato-modal-title">{plato.nombre}</div>
          {plato.descripcion && <div className="plato-modal-desc">{plato.descripcion}</div>}

          {presentaciones.length > 0 && (
            <div className="plato-section">
              <div className="plato-section-title">Presentaciones</div>
              <div className="plato-section-sub">Seleccioná una opción.</div>
              <div className="pres-list">
                {presentaciones.map((pres) => (
                  <label key={pres.id} className={`pres-option ${presentacion === pres.nombre ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="presentacion"
                      value={pres.nombre}
                      checked={presentacion === pres.nombre}
                      onChange={() => setPresentacion(pres.nombre)}
                    />
                    <div className="pres-option-body">
                      <div className="pres-option-name">{pres.nombre}</div>
                      {pres.descripcion && <div className="pres-option-desc">{pres.descripcion}</div>}
                    </div>
                    <div className="pres-option-price">{formatear(pres.precio)}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {agregados.length > 0 && (
            <div className="plato-section">
              <div className="plato-section-title">Agregados</div>
              <div className="plato-section-sub">Seleccioná las opciones que quieras.</div>
              <div className="agregados-list">
                {agregados.map((ag) => {
                  const cant = seleccion[ag.id] || 0;
                  return (
                    <div key={ag.id} className="agregado-row">
                      <div className="agregado-info">
                        <div className="agregado-nombre">{ag.nombre}</div>
                        {ag.descripcion && <div className="agregado-desc">{ag.descripcion}</div>}
                        {Number(ag.precio) > 0 && (
                          <div className="agregado-precio">+{formatear(ag.precio)}</div>
                        )}
                      </div>
                      <div className="agregado-controls">
                        {cant > 0 ? (
                          <>
                            <button className="agregado-btn" onClick={() => setSeleccion((s) => ({ ...s, [ag.id]: cant - 1 }))}>
                              <i className="ti ti-minus"></i>
                            </button>
                            <span className="agregado-cant">{cant}</span>
                          </>
                        ) : null}
                        <button className={`agregado-btn ${cant > 0 ? '' : 'add'}`} onClick={() => setSeleccion((s) => ({ ...s, [ag.id]: cant + 1 }))}>
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="plato-section">
            <div className="plato-section-title">Observaciones</div>
            <div className="plato-section-sub">
              {observacion.length} / 150
            </div>
            <textarea
              className="input-textarea"
              maxLength={150}
              rows={2}
              placeholder="Si querés, ingresá una observación para que la tengan en cuenta en tu pedido (máximo 150 caracteres)."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>
        </div>

        <div className="plato-modal-footer">
          <button className="btn btn-primary btn-block btn-lg" onClick={handleAgregar}>
            Agregar · {formatear(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
