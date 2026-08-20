import { createContext, useContext, useState, useEffect } from 'react';

const OrderModeContext = createContext();

const STORAGE_KEY = 'pidevo_order_mode';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.tipo === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function OrderModeProvider({ children }) {
  const initial = loadInitial();
  const [tipo, setTipo] = useState(initial?.tipo ?? null);
  const [mesaId, setMesaId] = useState(initial?.mesaId ?? null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tipo, mesaId }));
    } catch {}
  }, [tipo, mesaId]);

  return (
    <OrderModeContext.Provider value={{ tipo, setTipo, mesaId, setMesaId }}>
      {children}
    </OrderModeContext.Provider>
  );
}

export function useOrderMode() {
  const ctx = useContext(OrderModeContext);
  if (!ctx) throw new Error('useOrderMode must be inside OrderModeProvider');
  return ctx;
}