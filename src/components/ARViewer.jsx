import { useRef, useEffect, useState } from 'react';
import { registrarArVista } from '../api/client';

export default function ARViewer({ plato, onClose, onAddToCart }) {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (plato?.id) {
      registrarArVista(plato.id).catch(() => {});
    }
  }, [plato?.id]);

  useEffect(() => {
    if (!plato?.modelo_glb) {
      setStatus('no-model');
      return;
    }

    const viewer = modelRef.current;
    if (!viewer) return;

    let mounted = true;
    let timeout;

    const onLoad = () => {
      // activateAR() requires a fresh user gesture (WebXR transient
      // activation) -- calling it here, after the async model load, loses
      // that gesture and opens AR without camera access (black screen).
      // Show the 3D viewer instead and let the user tap the AR button.
      if (mounted) setStatus('viewer');
    };

    const onError = () => { if (mounted) setStatus('error'); };

    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);

    timeout = setTimeout(() => {
      if (mounted && status === 'loading') setStatus('viewer');
    }, 15000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
    };
  }, [plato?.modelo_glb]);

  const handleClose = () => {
    onClose();
  };

  const handleRetryAR = () => {
    const viewer = modelRef.current;
    if (viewer && viewer.activateAR) {
      setStatus('loading');
      viewer.activateAR().then(() => setStatus('ar-active')).catch(() => setStatus('viewer'));
    }
  };

  if (!plato) return null;

  const tieneModelo = plato.modelo_glb;
  const tieneFoto = plato.foto;

  return (
    <div className="ar-fullscreen" ref={containerRef}>
      {tieneModelo && (
        <model-viewer
          ref={modelRef}
          src={plato.modelo_glb}
          ios-src={plato.modelo_usdz || ''}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          scale="0.04 0.04 0.04"
          style={{
            width: '100%',
            height: '100%',
            opacity: status === 'viewer' ? 1 : 0,
            position: 'absolute',
          }}
          exposure="1"
          shadow-intensity="1"
          alt={plato.nombre}
        />
      )}

      {status === 'loading' && (
        <div className="ar-overlay">
          <div className="spinner" style={{ width: 48, height: 48, borderWidth: 3 }} />
          <p style={{ color: 'var(--cream)', fontSize: 16, marginTop: 20, fontWeight: 600 }}>
            Cargando modelo 3D...
          </p>
        </div>
      )}

      {status === 'viewer' && (
        <div className="ar-overlay ar-bottom-only">
          <div className="ar-full-toolbar">
            <div>
              <div className="ar-plato-name">{plato.nombre}</div>
              <div className="ar-plato-price">${Number(plato.precio).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="ar-cam-btn" onClick={handleRetryAR} title="Abrir cámara AR">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <button className="btn btn-success btn-sm" onClick={() => onAddToCart(plato)}>
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="ar-overlay">
          {tieneFoto ? (
            <img src={plato.foto} alt={plato.nombre} style={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain', borderRadius: 16 }} />
          ) : (
            <i className="ti ti-meat" style={{ fontSize: 64, color: 'var(--ember)', opacity: 0.6 }} />
          )}
          <div className="ar-plato-name" style={{ marginTop: 16 }}>{plato.nombre}</div>
          <div className="ar-plato-price">${Number(plato.precio).toFixed(2)}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {tieneModelo && (
              <button className="btn btn-primary btn-sm" onClick={handleRetryAR}>
                Reintentar AR
              </button>
            )}
            <button className="btn btn-success btn-sm" onClick={() => onAddToCart(plato)}>
              Agregar
            </button>
          </div>
        </div>
      )}

      {status === 'no-model' && (
        <div className="ar-overlay">
          {tieneFoto ? (
            <img src={plato.foto} alt={plato.nombre} style={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain', borderRadius: 16 }} />
          ) : (
            <i className="ti ti-meat" style={{ fontSize: 64, color: 'var(--ember)', opacity: 0.6 }} />
          )}
          <div className="ar-plato-name" style={{ marginTop: 16 }}>{plato.nombre}</div>
          <div className="ar-plato-price">${Number(plato.precio).toFixed(2)}</div>
          <button
            className="btn btn-success btn-sm"
            onClick={() => onAddToCart(plato)}
            style={{ marginTop: 16 }}
          >
            Agregar
          </button>
        </div>
      )}

      <button className="ar-full-close" onClick={handleClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

