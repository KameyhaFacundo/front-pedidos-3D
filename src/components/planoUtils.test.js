import { describe, it, expect } from 'vitest';
import { mesaSize, mesaStyle, fixStyle, clamp, nextNumero, TIPOS_FIJO } from './planoUtils';

describe('mesaSize', () => {
  it('usa medidas rectangulares', () => {
    expect(mesaSize({ forma: 'rectangular' })).toEqual({ w: 9, h: 14 });
  });
  it('usa medidas circulares por defecto', () => {
    expect(mesaSize({ forma: 'circular' })).toEqual({ w: 6.8, h: 13.6 });
  });
});

describe('mesaStyle', () => {
  it('devuelve posicion, tamaño y variables', () => {
    const style = mesaStyle({ forma: 'circular', pos_x: 30, pos_y: 40, numero: 3, rotacion: 0 });
    expect(style.left).toBe('30%');
    expect(style.top).toBe('40%');
    expect(style['--num']).toBe(3);
    expect(style['--msize']).toBe('13.6%');
  });
});

describe('fixStyle', () => {
  it('usa x/y y rotacion', () => {
    const style = fixStyle({ tipo: 'entrada', x: 20, y: 25, rotacion: 45 });
    expect(style.left).toBe('20%');
    expect(style.top).toBe('25%');
    expect(style['--rot']).toBe('45deg');
  });
  it('cae en defaults si falta el tipo', () => {
    const style = fixStyle({ tipo: 'inexistente' });
    expect(style.width).toBe('12%');
  });
});

describe('clamp', () => {
  it('limita entre min y max', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(20, 0, 10)).toBe(10);
  });
});

describe('nextNumero', () => {
  it('devuelve el siguiente numero de mesa', () => {
    expect(nextNumero([{ numero: 1 }, { numero: 5 }])).toBe(6);
  });
  it('empieza en 1 sin mesas', () => {
    expect(nextNumero([])).toBe(1);
  });
});

describe('TIPOS_FIJO', () => {
  it('incluye los tipos basicos', () => {
    for (const tipo of ['entrada', 'muro', 'barra', 'cocina', 'banio', 'ventana', 'mostrador']) {
      expect(TIPOS_FIJO[tipo]).toBeDefined();
    }
  });
});