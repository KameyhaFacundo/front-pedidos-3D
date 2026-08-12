export const PLANO_ASPECT = 2;
export const PLANO_PADDING = 4;

export const TIPOS_FIJO = {
  entrada:  { label: 'Entrada',    icon: 'ti-door-exit',      color: 'var(--herb)',   w: 11, h: 7 },
  mostrador: { label: 'Mostrador', icon: 'ti-tools-kitchen-2', color: 'var(--gold)',  w: 24, h: 14 },
  cocina:   { label: 'Cocina',    icon: 'ti-chef-hat',        color: 'var(--ember)', w: 22, h: 16 },
  banio:    { label: 'Baño',      icon: 'ti-bath',            color: 'var(--ember-dim)', w: 12, h: 10 },
  ventana:  { label: 'Ventana',   icon: 'ti-window',          color: 'var(--muted)', w: 20, h: 8 },
  barra:    { label: 'Barra',     icon: 'ti-glass-full',      color: 'var(--gold)',  w: 22, h: 11 },
  muro:     { label: 'Muro',      icon: 'ti-layout-grid',    color: 'var(--hair)',  w: 45, h: 4 },
};

export function mesaSize(mesa) {
  if (mesa.forma === 'rectangular') return { w: 9, h: 14 };
  return { w: 6.8, h: 13.6 };
}

export function mesaStyle(mesa) {
  const { w, h } = mesaSize(mesa);
  const size = Math.max(w, h);
  return {
    left: `${mesa.pos_x ?? 50}%`,
    top: `${mesa.pos_y ?? 50}%`,
    width: `${w}%`,
    height: `${h}%`,
    '--num': mesa.numero,
    '--rot': `${mesa.rotacion || 0}deg`,
    '--msize': `${size}%`,
  };
}

export function fixStyle(fix) {
  const cfg = TIPOS_FIJO[fix.tipo] || { w: 12, h: 12 };
  const w = fix.w || cfg.w;
  const h = fix.h || cfg.h;
  return {
    left: `${fix.x ?? 50}%`,
    top: `${fix.y ?? 50}%`,
    width: `${w}%`,
    height: `${h}%`,
    '--rot': `${fix.rotacion || 0}deg`,
  };
}

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function nextNumero(mesas) {
  const nums = mesas.map((m) => Number(m.numero) || 0);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}