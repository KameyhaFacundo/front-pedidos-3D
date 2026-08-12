import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'pidevo_cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY) || localStorage.getItem('pedido3d_cart');
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function itemKey(plato, presentacion, agregados, observacion) {
  const ag = (agregados || [])
    .map((a) => `${a.nombre}x${a.cantidad}`)
    .sort()
    .join('|');
  return `${plato.id}:${presentacion || '-'}:${ag}:${(observacion || '').trim()}`;
}

function unitPrice(plato, presentacion, agregados) {
  let base = Number(plato.precio);
  if (presentacion && Array.isArray(plato.presentaciones)) {
    const pres = plato.presentaciones.find((p) => p.nombre === presentacion);
    if (pres) base = Number(pres.precio);
  }
  const extra = (agregados || []).reduce((sum, a) => sum + Number(a.precio || 0) * (a.cantidad || 1), 0);
  return base + extra;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toast, setToast] = useState(null);
  const toastId = useRef(0);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((plato, opts = {}) => {
    const { presentacion = null, agregados = [], observacion = '', cantidad = 1 } = opts;
    const key = itemKey(plato, presentacion, agregados, observacion);
    const precio = unitPrice(plato, presentacion, agregados);

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prev, { key, plato, presentacion, agregados, observacion, cantidad, precioUnitario: precio }];
    });

    const id = ++toastId.current;
    setToast({ plato, id });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 1800);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const removeFromCart = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, cantidad) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, cantidad } : item)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.precioUnitario || 0) * item.cantidad, 0);
  }, [items]);

  const itemCount = items.reduce((count, item) => count + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal, getTotal: getSubtotal, itemCount, toast, dismissToast }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
