import { useState, useEffect, useCallback } from 'react';
import { getStaff, createStaff, deleteStaff } from '../../api/client';

const EMPTY_STAFF = { nombre: '', email: '', password: '', rol: 'cocina' };

const ROL_LABELS = { admin: 'Admin', cocina: 'Cocina', mozo: 'Mozo' };

export default function AdminEquipoView({ active, notify }) {
  const [staff, setStaff] = useState([]);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [savingStaff, setSavingStaff] = useState(false);

  const loadStaff = useCallback(() => {
    getStaff().then(setStaff).catch(() => {});
  }, []);

  useEffect(() => {
    if (active) loadStaff();
  }, [active, loadStaff]);

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
        rol: staffForm.rol,
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
          <div className="admin-title">Equipo</div>
          <div className="admin-subtitle">Invita a tu personal para que accedan al panel</div>
        </div>
      </div>

      <div className="settings-page">
        <div className="settings-card">
          <div className="settings-head">
            <i className="ti ti-users icon-herb"></i>
            <div>
              <div className="settings-title">Personal</div>
              <div className="settings-sub">Cada persona accede con su propio email y contraseña</div>
            </div>
          </div>

          <div className="staff-form staff-form-equipo">
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
            <div className="field">
              <label>Rol</label>
              <select value={staffForm.rol} onChange={(e) => setStaffForm((prev) => ({ ...prev, rol: e.target.value }))}>
                <option value="cocina">Cocina</option>
                <option value="mozo">Mozo</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field field-btn">
              <label>Acción</label>
              <button className="modal-save" disabled={savingStaff} onClick={handleAddStaff}>
                <i className="ti ti-user-plus"></i>
                <span>{savingStaff ? 'Invitando...' : 'Invitar'}</span>
              </button>
            </div>
          </div>

          {staff.length === 0 ? (
            <div className="settings-empty">
              <i className="ti ti-user-off"></i>
              <span>Todavía no hay personal invitado.</span>
            </div>
          ) : (
            <div className="settings-list">
              {staff.map((u) => (
                <div key={u.id} className="settings-row">
                  <div className="settings-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                  <div className="settings-row-info">
                    <span className="settings-staff-name">{u.name}</span>
                    <span className="settings-staff-email">{u.email}</span>
                  </div>
                  <span className={`role-badge role-${u.rol || 'admin'}`}>{ROL_LABELS[u.rol] || 'Admin'}</span>
                  <button className="icon-btn danger" onClick={() => handleDeleteStaff(u)} aria-label={`Eliminar ${u.name}`}>
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
