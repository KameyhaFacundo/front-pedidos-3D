import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarEmpresa } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotificationContext';

export default function RegistroModal({ onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notify } = useNotify();
  const [form, setForm] = useState({ empresa: '', nombre: '', email: '', whatsapp: '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.empresa.trim() || !form.nombre.trim() || !form.email.trim() || !form.password) {
      notify('Completá todos los campos obligatorios', 'error');
      return;
    }
    setSaving(true);
    try {
      const result = await registrarEmpresa({
        empresa: form.empresa,
        nombre: form.nombre,
        email: form.email,
        whatsapp: form.whatsapp || null,
        password: form.password,
      });
      login(result.token, result.user);
      localStorage.setItem('pidevo_slug', result.empresa.slug);
      notify('¡Tu local está listo! Bienvenido a Pidevo', 'success');
      onClose();
      navigate(`/${result.empresa.slug}/admin`);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="registro-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registro-header">
          <div>
            <div className="registro-title">Creá tu local</div>
            <div className="registro-sub">Gratis, en menos de 2 minutos</div>
          </div>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="registro-body" data-allow-autocomplete>
          <div className="field">
            <label>Nombre de tu local</label>
            <input
              type="text"
              placeholder="Ej: Tu Hambur"
              value={form.empresa}
              onChange={(e) => handleChange('empresa', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Tu nombre</label>
            <input
              type="text"
              placeholder="Nombre y apellido"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="tucorreo@email.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="field">
              <label>WhatsApp</label>
              <input
                type="tel"
                placeholder="381 5069332"
                value={form.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>

          <button type="submit" className="modal-save" disabled={saving}>
            {saving ? 'Creando tu local...' : 'Crear mi local →'}
          </button>
          <p className="registro-note">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" onClick={onClose}>Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
