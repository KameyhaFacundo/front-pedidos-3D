import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleMock, estadoSegunElapsed } from './mock';

const storage = () => {
  const map = new Map();
  globalThis.localStorage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  };
};

const nuevoPedidoBody = () => ({
  items: [
    {
      plato_id: 2,
      cantidad: 1,
      presentacion_nombre: 'Doble',
      agregados: [{ nombre: 'Panceta', cantidad: 1 }, { nombre: 'Cheddar extra', cantidad: 2 }],
      observacion: 'Sin cebolla',
    },
  ],
  mesa_id: 3,
  nombre: 'Juan',
  celular: '3815551234',
  medio_pago: 'efectivo',
});

describe('mock demo', () => {
  beforeEach(() => {
    storage();
    vi.restoreAllMocks();
  });

  it('GET /menu expone abierto, tiempo_estimado e ingredientes', async () => {
    const data = await handleMock('/menu', { method: 'GET' });
    expect(data.empresa.abierto).toBe(true);
    expect(data.empresa.tiempo_estimado).toBe(25);
    expect(data.platos.some((p) => Array.isArray(p.ingredientes) && p.ingredientes.length > 0)).toBe(true);
  });

  it('POST /cupones/validar acepta DEMO10', async () => {
    const data = await handleMock('/cupones/validar', {
      method: 'POST',
      body: JSON.stringify({ codigo: 'demo10' }),
    });
    expect(data.codigo).toBe('DEMO10');
    expect(data.descuento).toBe(10);
    expect(data.tipo).toBe('porcentaje');
  });

  it('POST /cupones/validar rechaza un cupon inexistente', async () => {
    await expect(
      handleMock('/cupones/validar', { method: 'POST', body: JSON.stringify({ codigo: 'NADA' }) })
    ).rejects.toThrow('El cupón ingresado no es válido.');
  });

  it('POST /pedidos rechaza un pedido sin items', async () => {
    await expect(
      handleMock('/pedidos', { method: 'POST', body: JSON.stringify({ items: [] }) })
    ).rejects.toThrow('Debés incluir al menos un item');
  });

  it('POST /pedidos crea el pedido con precios calculados', async () => {
    const pedido = await handleMock('/pedidos', {
      method: 'POST',
      body: JSON.stringify(nuevoPedidoBody()),
    });
    expect(pedido.estado).toBe('nuevo');
    expect(pedido.mesa?.numero).toBe(3);
    expect(pedido.items[0].plato.nombre).toBe('Hamburguesa con papas');
    const panceta = pedido.items[0].agregados.find((a) => a.nombre === 'Panceta');
    const cheddar = pedido.items[0].agregados.find((a) => a.nombre === 'Cheddar extra');
    expect(panceta.precio).toBe(2000);
    expect(cheddar.precio).toBe(1500);
  });

  it('GET /pedidos/999 devuelve 404', async () => {
    try {
      await handleMock('/pedidos/999', { method: 'GET' });
      expect.unreachable('debería haber fallado');
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });

  it('estadoSegunElapsed avanza con el tiempo', () => {
    expect(estadoSegunElapsed(0)).toBe('nuevo');
    expect(estadoSegunElapsed(29999)).toBe('nuevo');
    expect(estadoSegunElapsed(30000)).toBe('preparacion');
    expect(estadoSegunElapsed(89999)).toBe('preparacion');
    expect(estadoSegunElapsed(90000)).toBe('listo');
    expect(estadoSegunElapsed(179999)).toBe('listo');
    expect(estadoSegunElapsed(180000)).toBe('entregado');
    expect(estadoSegunElapsed(1000000)).toBe('entregado');
  });
});
