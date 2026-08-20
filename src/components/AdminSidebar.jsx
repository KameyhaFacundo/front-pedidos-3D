import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ITEMS = [
  { key: 'metricas', label: 'Métricas', icon: 'ti-chart-bar', roles: ['admin'] },
  { key: 'pedidos', label: 'Pedidos', icon: 'ti-receipt', roles: ['admin'] },
  { key: 'cocina', label: 'Cocina', icon: 'ti-chef-hat', route: 'cocina', roles: ['admin', 'cocina'] },
  { key: 'llamados', label: 'Llamados', icon: 'ti-bell-ringing', route: 'llamados', roles: ['admin', 'mozo'] },
  { key: 'menu', label: 'Menú', icon: 'ti-tools-kitchen-2', roles: ['admin'] },
  { key: 'mesas', label: 'Mesas', icon: 'ti-layout-grid', roles: ['admin'] },
  { key: 'equipo', label: 'Equipo', icon: 'ti-users', roles: ['admin'] },
  { key: 'configuracion', label: 'Configuración', icon: 'ti-settings', roles: ['admin'] },
];

export default function AdminSidebar({ view, setView: _setView, open, onToggle, onLogout, slug, empresa }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const rol = user?.rol || 'admin';
  const items = ITEMS.filter((item) => item.roles.includes(rol));

  const handleClick = (item) => {
    navigate(item.route ? `/${slug}/${item.route}` : `/${slug}/admin?view=${item.key}`);
  };

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-brand">
          {empresa?.logo ? (
            <img src={empresa.logo} alt={empresa.nombre || 'Logo'} className="brand-logo" />
          ) : (
            <span>{empresa?.nombre || 'Pidevo'}</span>
          )}
        </div>
        <button className="hamburger in-sidebar" onClick={onToggle} aria-label="Cerrar menú">
          <i className="ti ti-x"></i>
        </button>
      </div>
      <nav className="admin-nav">
        {items.map((item) => (
          <div
            key={item.key}
            className={`admin-nav-item ${view === item.key ? 'active' : ''}`}
            onClick={() => handleClick(item)}
          >
            <i className={`ti ${item.icon}`}></i>
            {item.label}
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
