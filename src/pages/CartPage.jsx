import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompany } from '../context/CompanyContext';

function formatear(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const { path } = useCompany();

  if (items.length === 0) {
    return (
      <div className="page-center cart-empty">
        <i className="ti ti-shopping-cart" style={{ fontSize: 64, color: 'var(--muted)' }}></i>
        <h2>Tu carrito está vacío</h2>
        <p>Agregá platos desde el menú para comenzar tu pedido.</p>
        <Link to={path('/menu')} className="btn btn-primary">
          Ver menú
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="page-header">
        <Link to={path('/menu')} className="back-link">
          <i className="ti ti-arrow-left"></i>
          Volver al menú
        </Link>
        <h1>Tu Carrito</h1>
      </header>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.key} className="cart-item">
            <div className="cart-item-image">
              <img
                src={item.plato.foto}
                alt={item.plato.nombre}
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect fill="%232A2318" width="80" height="80"/></svg>';
                }}
              />
            </div>
            <div className="cart-item-info">
              <h3>{item.plato.nombre}</h3>
              {item.presentacion && (
                <span className="cart-item-variant">{item.presentacion}</span>
              )}
              {item.agregados?.length > 0 && (
                <div className="cart-item-extras">
                  {item.agregados.map((a, i) => (
                    <span key={i}>+ {a.nombre}{a.cantidad > 1 ? ` x${a.cantidad}` : ''}</span>
                  ))}
                </div>
              )}
              {item.observacion && (
                <div className="cart-item-obs">“{item.observacion}”</div>
              )}
              <p className="cart-item-price">{formatear(item.precioUnitario)} c/u</p>
            </div>
            <div className="cart-item-controls">
              <button
                className="btn-qty"
                onClick={() => updateQuantity(item.key, item.cantidad - 1)}
              >
                -
              </button>
              <span className="cart-item-qty">{item.cantidad}</span>
              <button
                className="btn-qty"
                onClick={() => updateQuantity(item.key, item.cantidad + 1)}
              >
                +
              </button>
            </div>
            <div className="cart-item-subtotal">
              {formatear(item.precioUnitario * item.cantidad)}
            </div>
            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.key)}
              title="Eliminar"
              aria-label="Eliminar"
            >
              <i className="ti ti-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span className="cart-total-amount">{formatear(getTotal())}</span>
        </div>
        <Link to={path('/checkout')} className="btn btn-primary btn-block">
          Continuar pedido
        </Link>
      </div>
    </div>
  );
}
