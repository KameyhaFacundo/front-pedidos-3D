import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast, dismissToast } = useCart();

  if (!toast) return null;

  return (
    <div className="toast" onClick={dismissToast}>
      <div className="toast-icon">
        <i className="ti ti-circle-check-filled"></i>
      </div>
      <div className="toast-body">
        <div className="toast-title">{toast.plato.nombre}</div>
        <div className="toast-sub">Agregado al carrito</div>
      </div>
    </div>
  );
}
