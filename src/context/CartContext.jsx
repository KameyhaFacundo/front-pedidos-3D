import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CartContext = createContext(null);

const CART_KEY = 'pidevo_cart';
const RESERVED = ['admin', 'cocina', 'llamados', 'login', 'landing'];

function getSlugFromPath(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && !RESERVED.includes(first) ? first : null;
}

function getCartKey(slug) {
  return slug ? `pidevo_cart:${slug}` : CART_KEY;
}

function loadCart(slug) {
  try {
    const stored = localStorage.getItem(getCartKey(slug)) || localStorage.getItem(CART_KEY) || localStorage.getItem('pedido3d_cart');
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
  const location = useLocation();
  const slug = getSlugFromPath(location.pathname);
  const slugRef = useRef(slug);
  const [items, setItems] = useState(() => loadCart(slug));
  const [toast, setToast] = useState(null);
  const toastId = useRef(0);

  // Persiste el carrito de la empresa actual. Si cambiamos de empresa (o
  // salimos de la demo), recarga el de esa empresa en vez de guardar el
  // anterior encima del otro.
  useEffect(() => {
    if (slugRef.current !== slug) {
      slugRef.current = slug;
      setItems(loadCart(slug));
      return;
    }
    localStorage.setItem(getCartKey(slug), JSON.stringify(items));
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('pedido3d_cart');
  }, [items, slug]);

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
    localStorage.removeItem(getCartKey(slug));
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('pedido3d_cart');
  }, [slug]);

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
