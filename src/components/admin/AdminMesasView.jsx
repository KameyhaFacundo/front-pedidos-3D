import PlanoEditor from '../PlanoEditor';

export default function AdminMesasView({ active, mesas, ocupadas, mesasActivasIds, ordersPorMesa, onQrMesa, onSaved, notify }) {
  const descargarTodosQR = async () => {
    const base = import.meta.env.VITE_APP_URL || window.location.origin;
    let slug = null;
    try { slug = localStorage.getItem('pidevo_slug'); } catch {}
    if (!slug) {
      const m = window.location.pathname.match(/^\/([^\/]+)(?:\/|$)/);
      if (m && !['admin', 'cocina', 'login', 'llamados', 'landing'].includes(m[1])) slug = m[1];
    }
    for (const mesa of mesas) {
      try {
        const params = new URLSearchParams();
        params.set('mesa', mesa.id);
        params.set('open_picker', '1');
        const url = slug ? `${base}/${slug}/?${params.toString()}` : `${base}/?${params.toString()}`;
        const { default: QRCode } = await import('qrcode');
        const dataUrl = await QRCode.toDataURL(url, { width: 480, margin: 2, color: { dark: '#1B160F', light: '#F7F1E6' } });
        const a = document.createElement('a');
        const filename = `${(slug || 'pidevo')}_mesa_${mesa.numero}.png`;
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        await new Promise((res) => setTimeout(res, 200));
      } catch (e) {
        console.error('QR download failed for mesa', mesa.id, e);
      }
    }
  };

  return (
    <div className={`view ${active ? 'active' : ''}`}>
      <div className="admin-top">
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>
              <div className="admin-title">Mesas</div>
              <div className="admin-subtitle">
                {ocupadas} ocupadas de {mesas.length} · plano del local
              </div>
            </div>
            <div>
              <button className="btn btn-sm" onClick={descargarTodosQR}>
                Descargar todos los QR
              </button>
            </div>
          </div>
        </div>
      </div>

      <PlanoEditor
        mesas={mesas}
        busyIds={mesasActivasIds}
        ordersPorMesa={ordersPorMesa}
        onQrMesa={onQrMesa}
        onSaved={onSaved}
        notify={notify}
      />
    </div>
  );
}