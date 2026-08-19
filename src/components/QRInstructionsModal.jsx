export default function QRInstructionsModal({ onClose }) {
  return (
    <div className="overlay active" onClick={onClose}>
      <div className="modal registro-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registro-header">
          <div>
            <div className="registro-title">¿Cómo usar el QR?</div>
            <div className="registro-sub">Accedé al menú desde la mesa</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>
        <div className="registro-body">
          <ol>
            <li>Buscá el código QR de tu mesa.</li>
            <li>Abrilo con la cámara o app de QR de tu teléfono.</li>
            <li>Serás redirigido al menú y la mesa quedará seleccionada.</li>
          </ol>
          <p className="registro-note">Si no encontrás el QR, pedí ayuda al personal.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={onClose}>Entendido</button>
          </div>
        </div>
      </div>
    </div>
  );
}
