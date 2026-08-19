import { useState, useRef, useEffect } from 'react';
import { createPlato, updatePlato, deletePlato } from '../../api/client';
import { useNotify } from '../../context/NotificationContext';
import { CATEGORIAS, EMPTY_PLATO } from '../adminUtils';

export default function PlatoModal({ open, plato, onClose, onSaved }) {
  const { notify, confirm } = useNotify();
  const [form, setForm] = useState({ ...EMPTY_PLATO });
  const [saving, setSaving] = useState(false);
  const [presentaciones, setPresentaciones] = useState([]);
  const [agregados, setAgregados] = useState([]);
  const [fotoFile, setFotoFile] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  const [usdzFile, setUsdzFile] = useState(null);
  const fotoInputRef = useRef(null);
  const glbInputRef = useRef(null);
  const usdzInputRef = useRef(null);

  const fotoPreview = fotoFile ? URL.createObjectURL(fotoFile) : (plato?.foto || null);

  useEffect(() => {
    if (!open) return;
    setForm({
      nombre: plato?.nombre || '',
      precio: plato?.precio ?? '',
      categoria: plato?.categoria || 'principales',
      descripcion: plato?.descripcion || '',
      disponible: plato?.disponible !== false,
    });
    setFotoFile(null);
    setGlbFile(null);
    setUsdzFile(null);
    setPresentaciones((plato?.presentaciones || []).map((p) => ({ id: p.id, nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio })));
    setAgregados((plato?.agregados || []).map((a) => ({ id: a.id, nombre: a.nombre, descripcion: a.descripcion || '', precio: a.precio })));
  }, [open, plato]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      notify('Ingresá el nombre del plato', 'error');
      return;
    }
    if (!form.precio) {
      notify('Ingresá el precio del plato', 'error');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('precio', Number(form.precio));
      formData.append('categoria', form.categoria);
      formData.append('descripcion', form.descripcion || '');
      formData.append('disponible', form.disponible ? '1' : '0');

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

      if (plato) {
        await updatePlato(plato.id, formData);
      } else {
        await createPlato(formData);
      }
      onClose();
      onSaved?.();
      notify(plato ? 'Plato actualizado' : 'Plato creado', 'success');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!plato) return;
    confirm('¿Eliminar este plato? Esta acción no se puede deshacer.', async () => {
      try {
        await deletePlato(plato.id);
        onClose();
        onSaved?.();
        notify('Plato eliminado', 'success');
      } catch (e) {
        notify(e.message, 'error');
      }
    }, { confirmText: 'Eliminar', danger: true });
  };

  return (
    <div className={`overlay ${open ? 'active' : ''}`} onClick={onClose}>
      <div className="modal plato-modal-admin" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {plato ? 'Editar plato' : 'Nuevo plato'}
            </div>
            <div className="modal-subtitle">
              {plato ? 'Modificá los datos del plato' : 'Cargá un nuevo plato al menú'}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
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
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Bunker Cranch Doble"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Precio base</label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="field">
              <label>Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
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
              value={form.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
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
              className={`switch ${form.disponible ? 'on' : ''}`}
              onClick={() => handleChange('disponible', !form.disponible)}
            />
          </div>
        </div>

        <div className="modal-footer">
          {plato && (
            <button className="btn-delete" onClick={handleDelete}>
              <i className="ti ti-trash"></i> Eliminar
            </button>
          )}
          <button
            className="modal-save"
            disabled={saving || !form.nombre.trim() || !form.precio}
            onClick={handleSave}
          >
            {saving ? 'Guardando...' : plato ? 'Guardar cambios' : 'Crear plato'}
          </button>
        </div>
      </div>
    </div>
  );
}