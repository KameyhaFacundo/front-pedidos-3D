export function MenuSkeleton() {
  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="skeleton skeleton-text" style={{ width: 100 }} />
        <div className="skeleton skeleton-title" style={{ width: 140 }} />
      </header>
      <div className="skeleton-row">
        {[80, 100, 70, 90].map((w, i) => (
          <div key={i} className="skeleton skeleton-chip" style={{ width: w }} />
        ))}
      </div>
      <div className="menu-list">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="menu-item skeleton-item">
            <div className="skeleton skeleton-thumb" />
            <div className="menu-item-info" style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              <div className="skeleton skeleton-text" style={{ width: '90%', marginTop: 6 }} />
              <div className="skeleton-row" style={{ marginTop: 8 }}>
                <div className="skeleton skeleton-text" style={{ width: 60 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-nav" />
        ))}
      </div>
      <div className="admin-main">
        <div className="admin-top">
          <div>
            <div className="skeleton skeleton-title" style={{ width: 140 }} />
            <div className="skeleton skeleton-text" style={{ width: 100, marginTop: 6 }} />
          </div>
        </div>
        <div className="skeleton skeleton-card" style={{ height: 300 }} />
      </div>
    </div>
  );
}

export function PageSkeleton({ message = 'Cargando...' }) {
  return (
    <div className="page-center">
      <div className="skeleton skeleton-card" style={{ width: 280, height: 160 }} />
      <div className="skeleton skeleton-text" style={{ width: 120, marginTop: 16 }} />
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>{message}</p>
    </div>
  );
}
