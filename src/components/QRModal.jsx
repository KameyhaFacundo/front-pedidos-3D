import { useEffect, useRef } from 'react';

export default function QRModal({ mesa, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mesa && canvasRef.current) {
      const base = import.meta.env.VITE_APP_URL || window.location.origin;
      // prefer stored slug, otherwise derive from current path
      let slug = null;
      try { slug = localStorage.getItem('pidevo_slug'); } catch (e) {}
      if (!slug) {
        const m = window.location.pathname.match(/^\/([^\/]+)(?:\/|$)/);
        if (m && !['admin', 'cocina', 'login', 'llamados', 'landing'].includes(m[1])) slug = m[1];
      }
      const params = new URLSearchParams();
      params.set('mesa', mesa.id);
      params.set('open_picker', '1');
      const url = slug ? `${base}/${slug}/?${params.toString()}` : `${base}/?${params.toString()}`;
      import('qrcode').then(({ default: QRCode }) => {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 240,
          margin: 2,
          color: { dark: '#1B160F', light: '#F7F1E6' },
        });
      });
    }
  }, [mesa]);

  if (!mesa) return null;

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-top">
          <span>Mesa {mesa.numero}</span>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <canvas ref={canvasRef} />
        <p className="qr-hint">Escaneá para ver el menú y seleccionar tu mesa</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-primary btn-sm" onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            const slug = (localStorage.getItem('pidevo_slug') || '').replace(/[^a-z0-9_-]/gi, '') || 'pidevo';
            a.href = url;
            a.download = `${slug}_mesa_${mesa.numero}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}>Descargar QR</button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
