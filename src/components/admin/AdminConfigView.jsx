import { useState } from 'react';
import { soundEnabled, setSoundEnabled } from '../adminUtils';

export default function AdminConfigView({ active, configForm, setConfigForm, onSave, saving }) {
  const [soundOn, setSoundOn] = useState(soundEnabled);

  const toggleSound = () => {
    const v = !soundOn;
    setSoundOn(v);
    setSoundEnabled(v);
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
    </div>
  );
}