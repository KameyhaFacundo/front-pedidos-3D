import { describe, it, expect, vi } from 'vitest';
import { formatearPrecio, tiempoRelativo, categoriaIcon, totalPedido, calcularMetricas, pedidosToCSV } from './adminUtils';

describe('formatearPrecio', () => {
  it('formatea con separador de miles y 2 decimales', () => {
    expect(formatearPrecio(1500)).toBe('$1.500,00');
  });
  it('formatea cero', () => {
    expect(formatearPrecio(0)).toBe('$0,00');
  });
});

describe('tiempoRelativo', () => {
  it('dice Ahora para < 1 min', () => {
    expect(tiempoRelativo(new Date().toISOString())).toBe('Ahora');
  });
  it('dice Hace 1 min para 1 min', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-01T00:01:00').getTime());
    expect(tiempoRelativo('2026-01-01T00:00:00')).toBe('Hace 1 min');
    vi.restoreAllMocks();
  });
  it('dice Hace N min para N min', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-01T00:15:00').getTime());
    expect(tiempoRelativo('2026-01-01T00:00:00')).toBe('Hace 15 min');
    vi.restoreAllMocks();
  });
});

describe('categoriaIcon', () => {
  it('mapea cada categoria conocida', () => {
    expect(categoriaIcon('principales')).toBe('ti-meat');
    expect(categoriaIcon('entradas')).toBe('ti-salad');
    expect(categoriaIcon('postres')).toBe('ti-cake');
    expect(categoriaIcon('bebidas')).toBe('ti-glass');
  });
  it('usa icono default para categorias desconocidas', () => {
    expect(categoriaIcon('combo')).toBe('ti-tools-kitchen-2');
  });
});

describe('totalPedido', () => {
  it('suma precio x cantidad de los items', () => {
    const pedido = {
      estado: 'nuevo',
      items: [
        { plato: { precio: 100 }, cantidad: 2 },
        { plato: { precio: 50 }, cantidad: 1 },
      ],
    };
    expect(totalPedido(pedido)).toBe(250);
  });
  it('es 0 para pedidos cancelados', () => {
    const pedido = { estado: 'cancelado', items: [{ plato: { precio: 100 }, cantidad: 2 }] };
    expect(totalPedido(pedido)).toBe(0);
  });
  it('es 0 sin items', () => {
    expect(totalPedido({ estado: 'nuevo' })).toBe(0);
  });
});

describe('calcularMetricas', () => {
  const hoy = new Date();
  const hoyKey = hoy.toDateString();

  const pedidos = [
    {
      id: 1,
      estado: 'nuevo',
      created_at: hoy.toISOString(),
      items: [
        { plato: { nombre: 'Hamburguesa', precio: 100, categoria: 'principales' }, cantidad: 2 },
        { plato: { nombre: 'Coca', precio: 50, categoria: 'bebidas' }, cantidad: 1 },
      ],
    },
    {
      id: 2,
      estado: 'cancelado',
      created_at: hoy.toISOString(),
      items: [{ plato: { nombre: 'Hamburguesa', precio: 100, categoria: 'principales' }, cantidad: 1 }],
    },
  ];

  it('excluye cancelados de ingresos y conteos', () => {
    const m = calcularMetricas(pedidos);
    expect(m.totalRevenue).toBe(250);
    expect(m.totalPedidos).toBe(1);
    expect(m.totalItemsVendidos).toBe(3);
  });

  it('calcula ticket promedio', () => {
    const m = calcularMetricas(pedidos);
    expect(m.ticketPromedio).toBe(250);
  });

  it('arma el ranking de platos', () => {
    const m = calcularMetricas(pedidos);
    expect(m.platosMasPedidos).toEqual([['Hamburguesa', 2], ['Coca', 1]]);
    expect(m.maxPlatoCount).toBe(2);
  });

  it('arma distribucion por categoria', () => {
    const m = calcularMetricas(pedidos);
    expect(m.cateEntries).toEqual([['principales', 2], ['bebidas', 1]]);
    expect(m.totalCateItems).toBe(3);
  });

  it('acumula ventas del dia actual', () => {
    const m = calcularMetricas(pedidos);
    const hoyData = m.diasData.find((d) => d.key === hoyKey);
    expect(hoyData.pedidos).toBe(1);
    expect(hoyData.ventas).toBe(250);
  });

  it('devolvio datos vacios sin pedidos', () => {
    const m = calcularMetricas([]);
    expect(m.totalRevenue).toBe(0);
    expect(m.totalPedidos).toBe(0);
    expect(m.platosMasPedidos).toEqual([]);
    expect(m.cateEntries).toEqual([]);
    expect(m.diasData).toHaveLength(7);
  });

  it('calcula promedio por dia con dias con ventas', () => {
    const m = calcularMetricas(pedidos);
    expect(m.promedioDia).toBe(250);
  });

  it('calcula tendencia de hoy vs ayer', () => {
    const m = calcularMetricas(pedidos);
    expect(m.tendenciaHoy).toBe(100);
  });
});

describe('pedidosToCSV', () => {
  it('genera header y fila con total', () => {
    const pedido = {
      id: 7,
      estado: 'nuevo',
      estado_pago: 'pendiente',
      tipo: 'mesa',
      nombre: 'Juan',
      created_at: '2026-01-01T12:00:00',
      items: [{ plato: { nombre: 'Hamburguesa', precio: 100 }, cantidad: 2 }],
    };
    const csv = pedidosToCSV([pedido]);
    const lines = csv.split('\n');
    expect(lines[0]).toContain('ID');
    expect(lines[0]).toContain('Total');
    expect(lines[1]).toContain('"7"');
    expect(lines[1]).toContain('Hamburguesa x2');
    expect(lines[1]).toContain('"200"');
  });
});