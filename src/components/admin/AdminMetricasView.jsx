import { calcularMetricas, CATE_LABELS, formatearPrecio } from '../adminUtils';

export default function AdminMetricasView({ active, pedidos }) {
  const {
    platosMasPedidos,
    maxPlatoCount,
    totalRevenue,
    totalPedidos,
    cateEntries,
    totalCateItems,
    hourlyData,
    ticketPromedio,
    diasData,
    maxVentasDia,
    rangoFechas,
    promedioDia,
    tendenciaHoy,
    totalItemsVendidos,
  } = calcularMetricas(pedidos);

  return (
    <div className={`view ${active ? 'active' : ''}`}>
      <div className="admin-top">
        <div>
          <div className="admin-title">Métricas</div>
          <div className="admin-subtitle">Últimos 7 días · {rangoFechas}</div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-ember">
          <div className="kpi-icon"><i className="ti ti-currency-dollar"></i></div>
          <div className="kpi-body">
            <div className="kpi-value">{formatearPrecio(totalRevenue)}</div>
            <div className="kpi-label">Facturación total</div>
          </div>
        </div>
        <div className="kpi-card kpi-gold">
          <div className="kpi-icon"><i className="ti ti-receipt-2"></i></div>
          <div className="kpi-body">
            <div className="kpi-value">{totalPedidos}</div>
            <div className="kpi-label">Pedidos</div>
          </div>
        </div>
        <div className="kpi-card kpi-herb">
          <div className="kpi-icon"><i className="ti ti-receipt"></i></div>
          <div className="kpi-body">
            <div className="kpi-value">{formatearPrecio(ticketPromedio)}</div>
            <div className="kpi-label">Ticket promedio</div>
          </div>
        </div>
        <div className="kpi-card kpi-muted">
          <div className="kpi-icon"><i className="ti ti-tools-kitchen-2"></i></div>
          <div className="kpi-body">
            <div className="kpi-value">{totalItemsVendidos}</div>
            <div className="kpi-label">Platos vendidos</div>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-block">
          <div className="metric-block-head">
            <div className="metric-block-title">
              <span className="metric-block-icon block-ember"><i className="ti ti-chart-line"></i></span>
              <h3>Facturación por día</h3>
            </div>
            <span className="metric-hint">últimos 7 días</span>
          </div>
          <div className="day-chart">
            {diasData.map((d, idx) => (
              <div key={d.key} className={`day-bar-wrap ${idx === diasData.length - 1 ? 'today' : ''}`}>
                <div className="day-bar-val">{d.ventas > 0 ? `$${Math.round(d.ventas).toLocaleString('es-AR')}` : ''}</div>
                <div className="day-bar-track">
                  <div
                    className="day-bar-fill"
                    style={{ height: `${Math.max((d.ventas / maxVentasDia) * 100, d.ventas > 0 ? 4 : 1)}%` }}
                  />
                </div>
                <div className="day-bar-label">{d.label}</div>
              </div>
            ))}
          </div>
          <div className="metric-summary">
            <span>Promedio diario: <strong>{formatearPrecio(promedioDia)}</strong></span>
            {tendenciaHoy != null && (
              <span className={`metric-trend ${tendenciaHoy >= 0 ? 'up' : 'down'}`}>
                <i className={`ti ${tendenciaHoy >= 0 ? 'ti-trending-up' : 'ti-trending-down'}`}></i>
                {tendenciaHoy > 0 ? '+' : ''}{tendenciaHoy}% hoy vs ayer
              </span>
            )}
          </div>
        </div>

        <div className="metric-block">
          <div className="metric-block-head">
            <div className="metric-block-title">
              <span className="metric-block-icon block-gold"><i className="ti ti-clock-hour"></i></span>
              <h3>Pedidos por hora</h3>
            </div>
            <span className="metric-hint">distribución diaria</span>
          </div>
          <div className="hour-chart">
            {hourlyData.map(({ hour, count, pct }) => (
              <div key={hour} className="hour-bar-wrap" title={`${hour} — ${count} pedidos`}>
                <div className="hour-bar-track">
                  <div className="hour-bar-fill" style={{ height: `${Math.max(pct, count > 0 ? 4 : 1)}%` }} />
                </div>
                <div className="hour-bar-label">{hour}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-block">
          <div className="metric-block-head">
            <div className="metric-block-title">
              <span className="metric-block-icon block-herb"><i className="ti ti-trophy"></i></span>
              <h3>Platos más pedidos</h3>
            </div>
            <span className="metric-hint">ranking</span>
          </div>
          {platosMasPedidos.length === 0 && (
            <div className="metric-empty">Sin datos aún</div>
          )}
          <div className="top-list">
            {platosMasPedidos.map(([nombre, total], idx) => (
              <div key={nombre} className="top-row">
                <span className={`top-rank rank-${idx + 1}`}>{idx + 1}</span>
                <div className="top-body">
                  <div className="top-name">{nombre}</div>
                  <div className="top-track">
                    <div
                      className="top-fill"
                      style={{ width: `${(total / maxPlatoCount) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="top-count">{total}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-block">
          <div className="metric-block-head">
            <div className="metric-block-title">
              <span className="metric-block-icon block-muted"><i className="ti ti-category-2"></i></span>
              <h3>Por categoría</h3>
            </div>
            <span className="metric-hint">volumen de venta</span>
          </div>
          {cateEntries.length === 0 && (
            <div className="metric-empty">Sin datos aún</div>
          )}
          <div className="cate-list">
            {cateEntries.map(([cat, count]) => {
              const pct = Math.round((count / totalCateItems) * 100);
              return (
                <div key={cat} className="cate-row">
                  <div className="cate-head">
                    <span>{CATE_LABELS[cat] || cat}</span>
                    <span className="cate-pct">{pct}%</span>
                  </div>
                  <div className="cate-track">
                    <div className="cate-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}