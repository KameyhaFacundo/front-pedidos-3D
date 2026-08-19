import { useState } from 'react';
import { COLUMNAS, formatearPrecio, tiempoRelativo, descargarCSV } from '../adminUtils';

const FILTROS = [
  { key: '', label: 'Todos' },
  { key: 'mesa', label: 'Mesa' },
  { key: 'envio', label: 'Envío' },
  { key: 'retiro', label: 'Retiro' },
];

export default function AdminPedidosView({ active, pedidos, metricas, slug, onAvanzar, onPagar, onCancelar }) {
  const [filtro, setFiltro] = useState('');
  const visibles = filtro ? pedidos.filter((p) => p.tipo === filtro) : pedidos;
  const porColumna = (estado) => visibles.filter((p) => p.estado === estado);

  return (
    <div className={`view ${active ? 'active' : ''}`}>
      <div className="admin-top">
        <div>
          <div className="admin-title">Pedidos de hoy</div>
          <div className="admin-subtitle">Actualizado en tiempo real</div>
        </div>
        <button className="btn btn-sm" onClick={() => descargarCSV(pedidos, slug)}>
          <i className="ti ti-download"></i> Exportar CSV
        </button>
      </div>

      <div className="pedidos-filtros">
        {FILTROS.map(({ key, label }) => {
          const count = key ? pedidos.filter((p) => p.tipo === key).length : pedidos.length;
          return (
            <button
              key={key}
              className={`pedidos-filtro ${filtro === key ? 'active' : ''}`}
              onClick={() => setFiltro(key)}
            >
              {label} <span className="pedidos-filtro-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-metrics">
        <div className="admin-metric metric-ember">
          <div className="admin-metric-icon"><i className="ti ti-receipt-2"></i></div>
          <div>
            <div className="admin-metric-label">Pedidos hoy</div>
            <div className="admin-metric-value">{metricas?.pedidos_hoy || 0}</div>
          </div>
        </div>
        <div className="admin-metric metric-gold">
          <div className="admin-metric-icon"><i className="ti ti-currency-dollar"></i></div>
          <div>
            <div className="admin-metric-label">Ventas hoy</div>
            <div className="admin-metric-value">{formatearPrecio(metricas?.ventas_hoy || 0)}</div>
          </div>
        </div>
        <div className="admin-metric metric-herb">
          <div className="admin-metric-icon"><i className="ti ti-flame"></i></div>
          <div>
            <div className="admin-metric-label">Activos ahora</div>
            <div className="admin-metric-value">{metricas?.activos_ahora || 0}</div>
          </div>
        </div>
        <div className="admin-metric metric-muted">
          <div className="admin-metric-icon"><i className="ti ti-star"></i></div>
          <div>
            <div className="admin-metric-label">Más pedido</div>
            <div className="admin-metric-value admin-metric-value-sm">{metricas?.mas_pedido || '-'}</div>
          </div>
        </div>
      </div>

      <div className="admin-board">
        {COLUMNAS.map(({ key, label, dotClass }) => {
          const colPedidos = porColumna(key);
          return (
            <div key={key} className="admin-col">
              <div className="admin-col-head">
                <span className={`col-dot ${dotClass}`} />
                {label}
                <span className="admin-col-count">{colPedidos.length}</span>
              </div>
              {colPedidos.map((pedido) => (
                <div key={pedido.id} className="admin-order">
                  <div className="admin-order-top">
                    <span className="admin-order-id">#{pedido.id}</span>
                    <span className={`admin-tag ${pedido.tipo}`}>
                      {pedido.tipo === 'mesa'
                        ? `Mesa ${pedido.mesa?.numero || '?'}`
                        : pedido.tipo === 'envio'
                          ? 'Envío'
                          : 'Retiro'}
                    </span>
                  </div>

                  {(pedido.nombre || pedido.celular) && (
                    <div className="admin-order-customer">
                      {pedido.nombre && (
                        <span className="customer-name">
                          <i className="ti ti-user"></i> {pedido.nombre}
                        </span>
                      )}
                      {pedido.celular && (
                        <a
                          href={`https://wa.me/549${pedido.celular.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="admin-customer-whatsapp"
                        >
                          <i className="ti ti-brand-whatsapp"></i> {pedido.celular}
                        </a>
                      )}
                    </div>
                  )}

                  {pedido.tipo === 'envio' && pedido.direccion && (
                    <div className="admin-order-address">
                      <i className="ti ti-map-pin"></i> {pedido.direccion}
                    </div>
                  )}

                  <div className="admin-order-items">
                    {pedido.items?.map((item) => (
                      <div key={item.id} className="admin-order-item">
                        <div className="aoi-main">
                          <span className="aoi-qty">{item.cantidad}x</span>
                          <span className="aoi-name">{item.plato?.nombre || `Plato #${item.plato_id}`}</span>
                        </div>
                        {item.presentacion_nombre && (
                          <div className="aoi-line aoi-var">{item.presentacion_nombre}</div>
                        )}
                        {item.agregados?.length > 0 && (
                          <div className="aoi-line aoi-extras">
                            + {item.agregados.map((a) => `${a.nombre}${a.cantidad > 1 ? ` x${a.cantidad}` : ''}`).join(' · ')}
                          </div>
                        )}
                        {item.observacion && (
                          <div className="aoi-line aoi-obs">“{item.observacion}”</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="admin-order-bottom">
                    <span className="admin-order-time">{tiempoRelativo(pedido.created_at)}</span>
                    <span className={`admin-pay ${pedido.estado_pago === 'pagado' ? 'ok' : 'pending'}`}>
                      <i className={`ti ${pedido.estado_pago === 'pagado' ? 'ti-check' : 'ti-clock'}`}></i>{' '}
                      {pedido.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>

                  {key === 'nuevo' && (
                    <button className="btn btn-sm btn-block kanban-advance advance-prep"
                      onClick={(e) => { e.stopPropagation(); onAvanzar(pedido.id, 'preparacion'); }}>
                      <i className="ti ti-chef-hat"></i> A preparación
                    </button>
                  )}
                  {key === 'preparacion' && (
                    <button className="btn btn-sm btn-block kanban-advance advance-ready"
                      onClick={(e) => { e.stopPropagation(); onAvanzar(pedido.id, 'listo'); }}>
                      <i className="ti ti-circle-check"></i> Marcar listo
                    </button>
                  )}
                  {key === 'listo' && (
                    <button className="btn btn-sm btn-block kanban-advance advance-done"
                      onClick={(e) => { e.stopPropagation(); onAvanzar(pedido.id, 'entregado'); }}>
                      <i className="ti ti-truck-delivery"></i> Entregar
                    </button>
                  )}

                  {pedido.estado_pago === 'pendiente' && pedido.estado === 'entregado' && (
                    <button
                      className="kanban-advance advance-pay"
                      onClick={(e) => { e.stopPropagation(); onPagar(pedido.id); }}
                    >
                      <i className="ti ti-cash"></i> Marcar como pagado
                    </button>
                  )}
                  {(pedido.estado === 'nuevo' || pedido.estado === 'preparacion') && (
                    <button
                      className="kanban-advance advance-cancel"
                      onClick={(e) => { e.stopPropagation(); onCancelar(pedido.id); }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              ))}
              {colPedidos.length === 0 && (
                <div className="admin-order admin-order-empty">Sin pedidos</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
