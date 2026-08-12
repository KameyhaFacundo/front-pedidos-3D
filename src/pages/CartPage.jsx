import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-center cart-empty">
        <i className="ti ti-shopping-cart" style={{ fontSize: 64, color: 'var(--muted)' }}></i>
        <h2>Tu carrito está vacío</h2>
        <p>Agregá platos desde el menú para comenzar tu pedido.</p>
        <Link to="/menu" className="btn btn-primary">
          Ver menú
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="page-header">
        <Link to="/menu" className="back-link">
          <i className="ti ti-arrow-left"></i>
          Volver al menú
        </Link>
        <h1>Tu Carrito</h1>
      </header>

      <div className="cart-items">
        {items.map(({ plato, cantidad }) => (
          <div key={plato.id} className="cart-item">
            <div className="cart-item-image">
              <img
                src={plato.foto}
                alt={plato.nombre}
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect fill="%232A2318" width="80" height="80"/></svg>';
                }}
              />
            </div>
            <div className="cart-item-info">
              <h3>{plato.nombre}</h3>
              <p className="cart-item-price">${Number(plato.precio).toFixed(2)} c/u</p>
            </div>
            <div className="cart-item-controls">
              <button
                className="btn-qty"
                onClick={() => updateQuantity(plato.id, cantidad - 1)}
              >
                -
              </button>
              <span className="cart-item-qty">{cantidad}</span>
              <button
                className="btn-qty"
                onClick={() => updateQuantity(plato.id, cantidad + 1)}
              >
                +
              </button>
            </div>
            <div className="cart-item-subtotal">
              ${(plato.precio * cantidad).toFixed(2)}
            </div>
            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(plato.id)}
              title="Eliminar"
            >
              <i className="ti ti-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span className="cart-total-amount">${getTotal().toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary btn-block">
          Continuar pedido
        </Link>
      </div>
    </div>
  );
}
