import { useState, useEffect, useCallback } from 'react';
import { soundEnabled, setSoundEnabled } from '../adminUtils';
import { getCupones, createCupon, toggleCupon, deleteCupon, getStaff, createStaff, deleteStaff } from '../../api/client';

const EMPTY_CUPON = { codigo: '', descuento: '', tipo: 'fijo' };
const EMPTY_STAFF = { nombre: '', email: '', password: '' };

export default function AdminConfigView({ active, configForm, setConfigForm, onSave, saving, notify }) {
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [cupones, setCupones] = useState([]);
  const [cuponForm, setCuponForm] = useState(EMPTY_CUPON);
  const [savingCupon, setSavingCupon] = useState(false);
  const [staff, setStaff] = useState([]);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [savingStaff, setSavingStaff] = useState(false);

  const toggleSound = () => {
    const v = !soundOn;
    setSoundOn(v);
    setSoundEnabled(v);
  };

  const loadCupones = useCallback(() => {
    getCupones().then(setCupones).catch(() => {});
  }, []);

  const loadStaff = useCallback(() => {
    getStaff().then(setStaff).catch(() => {});
  }, []);

  useEffect(() => {
    if (active) {
      loadCupones();
      loadStaff();
    }
  }, [active, loadCupones, loadStaff]);

  const handleAddCupon = async () => {
    if (!cuponForm.codigo.trim() || cuponForm.descuento === '') {
      notify('Completá el código y el descuento', 'error');
      return;
    }
    setSavingCupon(true);
    try {
      await createCupon({
        codigo: cuponForm.codigo.trim(),
        descuento: Number(cuponForm.descuento),
        tipo: cuponForm.tipo,
      });
      setCuponForm(EMPTY_CUPON);
      loadCupones();
      notify('Cupón creado', 'success');
    } catch (err) {
      notify(err.message || 'Error al crear el cupón', 'error');
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
      loadCupones();
      notify('Cupón eliminado', 'success');
    } catch (err) {
      notify(err.message || 'Error al eliminar el cupón', 'error');
    }
  };

  const handleAddStaff = async () => {
    if (!staffForm.nombre.trim() || !staffForm.email.trim() || !staffForm.password) {
      notify('Completá todos los campos', 'error');
      return;
    }
    setSavingStaff(true);
    try {
      await createStaff({
        nombre: staffForm.nombre.trim(),
        email: staffForm.email.trim(),
        password: staffForm.password,
      });
      setStaffForm(EMPTY_STAFF);
      loadStaff();
      notify('Usuario invitado', 'success');
    } catch (err) {
      notify(err.message || 'Error al invitar', 'error');
    } finally {
      setSavingStaff(false);
    }
  };

  const handleDeleteStaff = async (u) => {
    if (!window.confirm(`¿Eliminar el acceso de ${u.name}?`)) return;
    try {
      await deleteStaff(u.id);
      loadStaff();
      notify('Usuario eliminado', 'success');
    } catch (err) {
      notify(err.message || 'Error al eliminar', 'error');
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

      <div className="settings-card">
        <div className="settings-head">
          <i className="ti ti-building-store"></i>
          <div>
            <div className="settings-title">Tu local</div>
            <div className="settings-sub">Estos datos aparecen en el menú que ven tus clientes</div>
          </div>
        </div>

        <div className="field">
          <label>Nombre del local</label>
          <input
            type="text"
            value={configForm.nombre}
            onChange={(e) => setConfigForm((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Tu Hambur"
          />
        </div>

        <div className="field">
          <label>WhatsApp (con código de país, sin +)</label>
          <input
            type="text"
            value={configForm.whatsapp}
            onChange={(e) => setConfigForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
            placeholder="Ej: 5493815069332"
          />
        </div>

        <div className="toggle-row settings-toggle">
          <div>
            <div className="t-label">Sonido en pedidos nuevos</div>
            <div className="t-sub">Reproduce un beep cuando entra un pedido</div>
          </div>
          <div className={`switch ${soundOn ? 'on' : ''}`} onClick={toggleSound} />
        </div>

        <div className="settings-footer">
          <button
            className="modal-save"
            disabled={saving || !configForm.nombre.trim()}
            onClick={onSave}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-head">
          <i className="ti ti-ticket"></i>
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
          <button className="modal-save" disabled={savingCupon} onClick={handleAddCupon}>
            {savingCupon ? 'Creando...' : 'Agregar cupón'}
          </button>
        </div>

        {cupones.length === 0 ? (
          <p className="settings-empty">Todavía no creaste cupones.</p>
        ) : (
          <div className="settings-list">
            {cupones.map((c) => (
              <div key={c.id} className="settings-row">
                <div className="settings-row-info">
                  <span className="settings-cupon-code">{c.codigo}</span>
                  <span className="settings-cupon-value">
                    {c.tipo === 'porcentaje' ? `${c.descuento}%` : `$${c.descuento}`}
                  </span>
                </div>
                <div className={`switch ${c.activo ? 'on' : ''}`} onClick={() => handleToggleCupon(c)} />
                <button className="icon-btn danger" onClick={() => handleDeleteCupon(c)} aria-label={`Eliminar ${c.codigo}`}>
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="settings-card">
        <div className="settings-head">
          <i className="ti ti-users"></i>
          <div>
            <div className="settings-title">Equipo</div>
            <div className="settings-sub">Invita a tu personal para que accedan al panel</div>
          </div>
        </div>

        <div className="staff-form">
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              value={staffForm.nombre}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Cocinero"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={staffForm.email}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Ej: cocina@milocal.com"
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              value={staffForm.password}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button className="modal-save" disabled={savingStaff} onClick={handleAddStaff}>
            {savingStaff ? 'Invitando...' : 'Invitar'}
          </button>
        </div>

        {staff.length === 0 ? (
          <p className="settings-empty">Todavía no hay personal invitado.</p>
        ) : (
          <div className="settings-list">
            {staff.map((u) => (
              <div key={u.id} className="settings-row">
                <div className="settings-row-info">
                  <span className="settings-staff-name">{u.name}</span>
                  <span className="settings-staff-email">{u.email}</span>
                </div>
                <button className="icon-btn danger" onClick={() => handleDeleteStaff(u)} aria-label={`Eliminar ${u.name}`}>
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}