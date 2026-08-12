import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';

export default function BuscarPedidoModal({ onClose }) {
  const navigate = useNavigate();
  const { path } = useCompany();
  const [codigo, setCodigo] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    const id = codigo.trim();
    if (!id || !/^\d+$/.test(id)) return;
    onClose();
    navigate(path(`/pedido/${id}`));
  };

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="buscar-pedido-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registro-header">
          <div>
            <div className="registro-title">Buscar mi pedido</div>
            <div className="registro-sub">Ingresá el número de tu pedido</div>
          </div>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x"></i></button>
        </div>

        <form onSubmit={handleBuscar} className="buscar-pedido-body">
          <div className="field">
            <label>Número de pedido</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 42"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/[^\d]/g, ''))}
              autoFocus
            />
          </div>
          <button type="submit" className="modal-save" disabled={!/^\d+$/.test(codigo.trim())}>
            <i className="ti ti-search"></i> Buscar pedido
          </button>
        </form>
      </div>
    </div>
  );
}
