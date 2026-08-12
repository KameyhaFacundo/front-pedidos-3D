import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'pedido3d_cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toast, setToast] = useState(null);
  const toastId = useRef(0);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((plato, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.plato.id === plato.id);
      if (existing) {
        return prev.map((item) =>
          item.plato.id === plato.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { plato, cantidad }];
    });
    const id = ++toastId.current;
    setToast({ plato, id });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 1800);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const removeFromCart = useCallback((platoId) => {
    setItems((prev) => prev.filter((item) => item.plato.id !== platoId));
  }, []);

  const updateQuantity = useCallback((platoId, cantidad) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((item) => item.plato.id !== platoId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.plato.id === platoId ? { ...item, cantidad } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.plato.precio * item.cantidad, 0);
  }, [items]);

  const itemCount = items.reduce((count, item) => count + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, itemCount, toast, dismissToast }}
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
