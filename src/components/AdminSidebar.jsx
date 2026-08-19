import { useTheme } from '../context/ThemeContext';

const ITEMS = [
  { key: 'metricas', label: 'Métricas', icon: 'ti-chart-bar' },
  { key: 'pedidos', label: 'Pedidos', icon: 'ti-receipt' },
  { key: 'menu', label: 'Menú', icon: 'ti-tools-kitchen-2' },
  { key: 'mesas', label: 'Mesas', icon: 'ti-layout-grid' },
  { key: 'configuracion', label: 'Configuración', icon: 'ti-settings' },
];

export default function AdminSidebar({ view, setView, open, onToggle, onLogout }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-brand"><img src="/pidevo.png" alt="Pidevo" className="brand-logo" /></div>
        <button className="hamburger in-sidebar" onClick={onToggle} aria-label="Cerrar menú">
          <i className="ti ti-x"></i>
        </button>
      </div>
      <nav className="admin-nav">
        {ITEMS.map(({ key, label, icon }) => (
          <div
            key={key}
            className={`admin-nav-item ${view === key ? 'active' : ''}`}
            onClick={() => setView(key)}
          >
            <i className={`ti ${icon}`}></i>
            {label}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-bottom">
        <button className="theme-toggle admin-theme-toggle" onClick={toggleTheme}>
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`}></i>
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button className="admin-logout" onClick={onLogout}>
          <i className="ti ti-logout"></i>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
