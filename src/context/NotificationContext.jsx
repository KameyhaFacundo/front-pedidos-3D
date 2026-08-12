import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

const TYPE_ICONS = {
  success: 'ti-circle-check',
  error: 'ti-alert-triangle',
  info: 'ti-info-circle',
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const idRef = useRef(0);

  const notify = useCallback((message, type = 'error') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirm = useCallback((message, onConfirm, opts = {}) => {
    setConfirmState({
      message,
      onConfirm,
      title: opts.title || 'Confirmar',
      confirmText: opts.confirmText || 'Aceptar',
      danger: opts.danger || false,
    });
  }, []);

  const closeConfirm = useCallback(() => setConfirmState(null), []);

  const handleConfirm = useCallback(() => {
    const cb = confirmState?.onConfirm;
    setConfirmState(null);
    if (cb) cb();
  }, [confirmState]);

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`notif-toast ${t.type}`} onClick={() => dismissToast(t.id)}>
            <i className={`ti ${TYPE_ICONS[t.type] || TYPE_ICONS.error}`}></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {confirmState && (
        <div className="overlay active" onClick={closeConfirm}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <i className={`ti ${confirmState.danger ? 'ti-alert-triangle' : 'ti-question-mark'}`}></i>
            </div>
            <div className="confirm-title">{confirmState.title}</div>
            <div className="confirm-message">{confirmState.message}</div>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={closeConfirm}>Cancelar</button>
              <button
                className={`btn ${confirmState.danger ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleConfirm}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotify must be used within NotificationProvider');
  return context;
}
