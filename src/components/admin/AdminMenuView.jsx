import { useState } from 'react';
import { categoriaIcon, formatearPrecio } from '../adminUtils';

export default function AdminMenuView({ active, platos, onNew, onEdit }) {
  const [menuSearch, setMenuSearch] = useState('');

  return (
    <div className={`view ${active ? 'active' : ''}`}>
      <div className="admin-top">
        <div>
          <div className="admin-title">Menú</div>
          <div className="admin-subtitle">
            {platos.length} platos · {platos.filter((p) => p.disponible === false).length} pausados
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onNew}>
          <i className="ti ti-plus"></i> Nuevo plato
        </button>
      </div>

      <div className="menu-search" style={{ marginBottom: 16 }}>
        <i className="ti ti-search"></i>
        <input
          type="text"
          placeholder="Buscar plato..."
          value={menuSearch}
          onChange={(e) => setMenuSearch(e.target.value)}
        />
        {menuSearch && (
          <button className="search-clear" onClick={() => setMenuSearch('')}>
            <i className="ti ti-x"></i>
          </button>
        )}
      </div>

      <div className="dish-grid">
        {platos
          .filter((p) => {
            if (!menuSearch.trim()) return true;
            const q = menuSearch.toLowerCase();
            return p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q);
          })
          .map((plato) => {
            const icon = categoriaIcon(plato.categoria);
            return (
              <div
                key={plato.id}
                className="dish-card"
                onClick={() => onEdit(plato)}
                style={{ cursor: 'pointer' }}
              >
                <div className="dish-thumb" style={{ background: 'var(--surface)' }}>
                  {plato.foto ? (
                    <img
                      src={plato.foto}
                      alt={plato.nombre}
                      className="dish-thumb-img"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <i className={`ti ${icon}`}></i>
                  )}
                </div>
                <div className="dish-cat">{plato.categoria}</div>
                <div className="dish-name">{plato.nombre}</div>
                <div className="dish-bottom">
                  <div className="dish-price">{formatearPrecio(plato.precio)}</div>
                  <div className={`avail ${plato.disponible !== false ? 'on' : 'off'}`}>
                    <i className={`ti ${plato.disponible !== false ? 'ti-circle-check' : 'ti-circle-off'}`}></i>
                    {plato.disponible !== false ? 'Activo' : 'Pausado'}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
