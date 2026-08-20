import { useState, useRef } from 'react';
import { soundEnabled, setSoundEnabled } from '../adminUtils';

export default function LocalSettingsModal({ open, configForm, setConfigForm, logoFile, setLogoFile, setLogoRemoved, logoPreview, onSave, saving, onClose }) {
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const fileRef = useRef(null);

  const toggleSound = () => {
    const v = !soundOn;
    setSoundOn(v);
    setSoundEnabled(v);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoRemoved(false);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoRemoved(true);
    if (fileRef.current) fileRef.current.value = '';
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

          <div className="field">
            <label>Logo del local</label>
            <div className="logo-upload">
              {logoFile || configForm.logo ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="logo-upload-preview"
                />
              ) : (
                <div className="logo-upload-empty">
                  <i className="ti ti-photo"></i>
                </div>
              )}
              <div className="logo-upload-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => fileRef.current && fileRef.current.click()}
                >
                  <i className="ti ti-upload"></i> {logoFile || configForm.logo ? 'Cambiar' : 'Subir logo'}
                </button>
                {(logoFile || configForm.logo) && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm danger"
                    onClick={handleRemoveLogo}
                  >
                    <i className="ti ti-trash"></i> Quitar
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleLogoChange}
                />
              </div>
            </div>
            <p className="logo-upload-hint">Se muestra en el menú de tus clientes y en tu panel. JPG, PNG o WebP (máx. 8 MB).</p>
          </div>

          <div className="toggle-row settings-toggle">
            <div>
              <div className="t-label">Local abierto</div>
              <div className="t-sub">Si está cerrado, los clientes pueden ver el menú pero no pedir</div>
            </div>
            <div
              className={`switch ${configForm.abierto ? 'on' : ''}`}
              onClick={() => setConfigForm((prev) => ({ ...prev, abierto: !prev.abierto }))}
            />
          </div>

          <div className="field">
            <label>Tiempo estimado de entrega (minutos)</label>
            <input
              type="number"
              min="0"
              max="600"
              value={configForm.tiempo_estimado ?? ''}
              onChange={(e) => setConfigForm((prev) => ({ ...prev, tiempo_estimado: e.target.value === '' ? '' : Number(e.target.value) }))}
              placeholder="Ej: 25"
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
