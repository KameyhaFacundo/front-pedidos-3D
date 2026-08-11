import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRModal({ mesa, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mesa && canvasRef.current) {
      const base = import.meta.env.VITE_APP_URL || window.location.origin;
      const url = `${base}/?mesa=${mesa.id}`;
      QRCode.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: { dark: '#1B160F', light: '#F7F1E6' },
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
        <p className="qr-hint">Escaneá para ver el menú</p>
        <button className="btn btn-primary btn-sm" onClick={onClose} style={{ marginTop: 12 }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
