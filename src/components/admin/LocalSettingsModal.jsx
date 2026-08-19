import { useState } from 'react';
import { soundEnabled, setSoundEnabled } from '../adminUtils';

export default function LocalSettingsModal({ open, configForm, setConfigForm, onSave, saving, onClose }) {
  const [soundOn, setSoundOn] = useState(soundEnabled);

  const toggleSound = () => {
    const v = !soundOn;
    setSoundOn(v);
    setSoundEnabled(v);
  };

  return (
    <div className={`overlay ${open ? 'active' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Tu local</div>
            <div className="modal-subtitle">Estos datos aparecen en el menú que ven tus clientes</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div className="modal-body">
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
        </div>

        <div className="modal-footer">
          <button
            className="modal-save"
            disabled={saving || !configForm.nombre.trim()}
            onClick={onSave}
          >
            <i className="ti ti-device-floppy"></i>
            <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
