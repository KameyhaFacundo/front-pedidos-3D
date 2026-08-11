import { createContext, useContext, useState } from 'react';

const OrderModeContext = createContext();

export function OrderModeProvider({ children }) {
  const [tipo, setTipo] = useState(null);
  const [mesaId, setMesaId] = useState(null);

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
