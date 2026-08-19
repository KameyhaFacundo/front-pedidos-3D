import { useState, useEffect, useCallback } from 'react';
import { getCupones, createCupon, updateCupon, toggleCupon, deleteCupon } from '../../api/client';
import LocalSettingsModal from './LocalSettingsModal';

const EMPTY_CUPON = { codigo: '', descuento: '', tipo: 'fijo' };

export default function AdminConfigView({ active, configForm, setConfigForm, onSave, saving, notify }) {
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [cupones, setCupones] = useState([]);
  const [cuponForm, setCuponForm] = useState(EMPTY_CUPON);
  const [savingCupon, setSavingCupon] = useState(false);
  const [editingCuponId, setEditingCuponId] = useState(null);

  const loadCupones = useCallback(() => {
    getCupones().then(setCupones).catch(() => {});
  }, []);

  useEffect(() => {
    if (active) loadCupones();
  }, [active, loadCupones]);

  const handleEditCupon = (c) => {
    setEditingCuponId(c.id);
    setCuponForm({ codigo: c.codigo, descuento: c.descuento, tipo: c.tipo });
  };

  const handleCancelEditCupon = () => {
    setEditingCuponId(null);
    setCuponForm(EMPTY_CUPON);
  };

  const handleSubmitCupon = async () => {
    if (!cuponForm.codigo.trim() || cuponForm.descuento === '') {
      notify('Completá el código y el descuento', 'error');
      return;
    }
    setSavingCupon(true);
    try {
      const data = {
        codigo: cuponForm.codigo.trim(),
        descuento: Number(cuponForm.descuento),
        tipo: cuponForm.tipo,
      };
      if (editingCuponId) {
        await updateCupon(editingCuponId, data);
        notify('Cupón actualizado', 'success');
      } else {
        await createCupon(data);
        notify('Cupón creado', 'success');
      }
      setCuponForm(EMPTY_CUPON);
      setEditingCuponId(null);
      loadCupones();
    } catch (err) {
      notify(err.message || 'Error al guardar el cupón', 'error');
    } finally {
      setSavingCupon(false);
    }
  };

  const handleToggleCupon = async (c) => {
    try {
      await toggleCupon(c.id);
      loadCupones();
    } catch (err) {
      notify(err.message || 'Error al actualizar el cupón', 'error');
    }
  };

  const handleDeleteCupon = async (c) => {
    if (!window.confirm(`¿Eliminar el cupón ${c.codigo}?`)) return;
    try {
      await deleteCupon(c.id);
      if (editingCuponId === c.id) handleCancelEditCupon();
      loadCupones();
      notify('Cupón eliminado', 'success');
    } catch (err) {
      notify(err.message || 'Error al eliminar el cupón', 'error');
    }
  };

  return (
    <div className={`view ${active ? 'active' : ''}`}>
      <div className="admin-top">
        <div>
          <div className="admin-title">Configuración</div>
          <div className="admin-subtitle">Datos de tu negocio</div>
        </div>
      </div>

      <div className="settings-page">
      <div className="settings-card settings-card-compact">
        <div className="settings-head">
          <i className="ti ti-building-store"></i>
          <div>
            <div className="settings-title">Tu local</div>
            <div className="settings-sub">
              {configForm.nombre || 'Sin nombre configurado'}
              {configForm.whatsapp ? ` · WhatsApp ${configForm.whatsapp}` : ''}
            </div>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setLocalModalOpen(true)}>
          <i className="ti ti-pencil"></i> Editar
        </button>
      </div>

      <LocalSettingsModal
        open={localModalOpen}
        configForm={configForm}
        setConfigForm={setConfigForm}
        onSave={onSave}
        saving={saving}
        onClose={() => setLocalModalOpen(false)}
      />

      <div className="settings-card">
        <div className="settings-head">
          <i className="ti ti-ticket icon-ember"></i>
          <div>
            <div className="settings-title">Cupones de descuento</div>
            <div className="settings-sub">Los clientes los aplican al finalizar su pedido</div>
          </div>
        </div>

        <div className="staff-form">
          <div className="field">
            <label>Código</label>
            <input
              type="text"
              value={cuponForm.codigo}
              onChange={(e) => setCuponForm((prev) => ({ ...prev, codigo: e.target.value }))}
              placeholder="Ej: BIENVENIDO10"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <div className="field">
            <label>Descuento</label>
            <input
              type="number"
              min="0"
              value={cuponForm.descuento}
              onChange={(e) => setCuponForm((prev) => ({ ...prev, descuento: e.target.value }))}
              placeholder="Ej: 10"
            />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select value={cuponForm.tipo} onChange={(e) => setCuponForm((prev) => ({ ...prev, tipo: e.target.value }))}>
              <option value="fijo">Monto fijo ($)</option>
              <option value="porcentaje">Porcentaje (%)</option>
            </select>
          </div>
          <div className="field field-btn">
            <label>Acción</label>
            <button className="modal-save" disabled={savingCupon} onClick={handleSubmitCupon}>
              <i className={`ti ${editingCuponId ? 'ti-device-floppy' : 'ti-plus'}`}></i>
              <span>
                {savingCupon
                  ? 'Guardando...'
                  : editingCuponId
                  ? 'Guardar cambios'
                  : 'Agregar cupón'}
              </span>
            </button>
          </div>
        </div>

        {editingCuponId && (
          <button className="settings-cancel-edit" onClick={handleCancelEditCupon}>
            Cancelar edición
          </button>
        )}

        {cupones.length === 0 ? (
          <div className="settings-empty">
            <i className="ti ti-ticket-off"></i>
            <span>Todavía no creaste cupones.</span>
          </div>
        ) : (
          <div className="settings-table-wrap">
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Cupón</th>
                  <th>Descuento</th>
                  <th>Estado</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cupones.map((c) => (
                  <tr key={c.id} className={editingCuponId === c.id ? 'editing' : ''}>
                    <td>
                      <div className="settings-cell-main">
                        <div className="settings-cupon-icon">
                          <i className="ti ti-ticket"></i>
                        </div>
                        <span className="settings-cupon-code">{c.codigo}</span>
                      </div>
                    </td>
                    <td>{c.tipo === 'porcentaje' ? `${c.descuento}%` : `$${c.descuento}`}</td>
                    <td>
                      <div className="settings-cell-main">
                        <div className={`switch ${c.activo ? 'on' : ''}`} onClick={() => handleToggleCupon(c)} />
                        <span className={`settings-status ${c.activo ? 'on' : ''}`}>
                          {c.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="col-actions">
                      <button className="icon-btn" onClick={() => handleEditCupon(c)} aria-label={`Editar ${c.codigo}`}>
                        <i className="ti ti-pencil"></i>
                      </button>
                      <button className="icon-btn danger" onClick={() => handleDeleteCupon(c)} aria-label={`Eliminar ${c.codigo}`}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
