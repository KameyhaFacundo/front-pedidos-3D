export function formatearPrecio(n) {
  return '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function tiempoRelativo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'Ahora';
  if (diff === 1) return 'Hace 1 min';
  return `Hace ${diff} min`;
}

export function categoriaIcon(categoria) {
  switch (categoria) {
    case 'principales': return 'ti-meat';
    case 'entradas': return 'ti-salad';
    case 'postres': return 'ti-cake';
    case 'bebidas': return 'ti-glass';
    default: return 'ti-tools-kitchen-2';
  }
}

export const CATEGORIAS = [
  { value: 'principales', label: 'Principales' },
  { value: 'entradas', label: 'Entradas' },
  { value: 'postres', label: 'Postres' },
  { value: 'bebidas', label: 'Bebidas' },
];

export const COLUMNAS = [
  { key: 'nuevo', label: 'Nuevo', dotClass: 'new' },
  { key: 'preparacion', label: 'Preparación', dotClass: 'prep' },
  { key: 'listo', label: 'Listo', dotClass: 'ready' },
  { key: 'entregado', label: 'Entregado', dotClass: 'done' },
  { key: 'cancelado', label: 'Cancelado', dotClass: 'done' },
];

export const EMPTY_PLATO = {
  nombre: '',
  precio: '',
  categoria: 'principales',
  descripcion: '',
  disponible: true,
};

export const CATE_LABELS = { principales: 'Principales', entradas: 'Entradas', postres: 'Postres', bebidas: 'Bebidas' };

export function totalPedido(pedido) {
  if (pedido.estado === 'cancelado') return 0;
  return (pedido.items || []).reduce((s, i) => s + (i.plato?.precio || 0) * (i.cantidad || 1), 0);
}

export function pedidosToCSV(pedidos) {
  const header = ['ID', 'Fecha', 'Tipo', 'Cliente', 'Celular', 'Direccion', 'Estado', 'Pago', 'Items', 'Total'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = pedidos.map((p) => [
    p.id,
    new Date(p.created_at).toLocaleString('es-AR'),
    p.tipo,
    p.nombre || '',
    p.celular || '',
    p.direccion || '',
    p.estado,
    p.estado_pago,
    (p.items || []).map((i) => `${i.plato?.nombre || `Plato #${i.plato_id}`} x${i.cantidad || 1}`).join('; '),
    totalPedido(p),
  ]);
  return [header, ...rows].map((r) => r.map(esc).join(',')).join('\n');
}

export function descargarCSV(pedidos, slug) {
  const csv = pedidosToCSV(pedidos);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug || 'pedidos'}_pedidos_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function soundEnabled() {
  try {
    return localStorage.getItem('pidevo_sound_enabled') !== '0';
  } catch {
    return true;
  }
}

export function setSoundEnabled(value) {
  try {
    localStorage.setItem('pidevo_sound_enabled', value ? '1' : '0');
  } catch {}
}

export function playNewOrderSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = now + i * 0.18;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.18);
    });
  } catch {}
}

export function calcularMetricas(pedidos) {
  const platoCounts = {};
  pedidos.forEach((p) => {
    if (p.estado === 'cancelado') return;
    (p.items || []).forEach((item) => {
      const name = item.plato?.nombre || `Plato #${item.plato_id}`;
      platoCounts[name] = (platoCounts[name] || 0) + (item.cantidad || 1);
    });
  });
  const platosMasPedidos = Object.entries(platoCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxPlatoCount = platosMasPedidos.length > 0 ? platosMasPedidos[0][1] : 1;

  const totalRevenue = pedidos.reduce((sum, p) => sum + totalPedido(p), 0);
  const totalPedidos = pedidos.filter((p) => p.estado !== 'cancelado').length;

  const cateCounts = {};
  pedidos.forEach((p) => {
    if (p.estado === 'cancelado') return;
    (p.items || []).forEach((item) => {
      const cat = item.plato?.categoria || 'sin categoria';
      cateCounts[cat] = (cateCounts[cat] || 0) + (item.cantidad || 1);
    });
  });

  const hourlyData = (() => {
    const hours = new Array(24).fill(0);
    pedidos.forEach((p) => {
      if (p.estado === 'cancelado') return;
      const h = new Date(p.created_at).getHours();
      hours[h] += 1;
    });
    const max = Math.max(1, ...hours);
    return hours.map((count, hour) => ({ hour: `${String(hour).padStart(2, '0')}:00`, count, pct: (count / max) * 100 }));
  })();

  const ticketPromedio = totalPedidos > 0 ? totalRevenue / totalPedidos : 0;

  const diasData = (() => {
    const dias = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const label = d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '');
      dias.push({ key: d.toDateString(), label, ventas: 0, pedidos: 0 });
    }
    pedidos.forEach((p) => {
      if (p.estado === 'cancelado') return;
      const dia = dias.find((d) => d.key === new Date(p.created_at).toDateString());
      if (!dia) return;
      dia.pedidos += 1;
      dia.ventas += totalPedido(p);
    });
    return dias;
  })();
  const maxVentasDia = Math.max(1, ...diasData.map((d) => d.ventas));

  const rangoFechas = (() => {
    const f = (key) => new Date(key).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    return diasData.length ? `${f(diasData[0].key)} – ${f(diasData[diasData.length - 1].key)}` : '';
  })();

  const promedioDia = (() => {
    const diasConVentas = diasData.filter((d) => d.ventas > 0).length;
    return diasConVentas > 0 ? totalRevenue / diasConVentas : 0;
  })();

  const tendenciaHoy = (() => {
    if (diasData.length < 2) return null;
    const ayer = diasData[diasData.length - 2].ventas;
    const hoyV = diasData[diasData.length - 1].ventas;
    if (ayer <= 0) return hoyV > 0 ? 100 : null;
    return Math.round(((hoyV - ayer) / ayer) * 100);
  })();

  const totalItemsVendidos = pedidos.reduce((sum, p) => {
    if (p.estado === 'cancelado') return sum;
    return sum + (p.items || []).reduce((s, i) => s + (i.cantidad || 1), 0);
  }, 0);

  const cateEntries = Object.entries(cateCounts).sort((a, b) => b[1] - a[1]);
  const totalCateItems = cateEntries.reduce((s, [, c]) => s + c, 0) || 1;

  return {
    platosMasPedidos,
    maxPlatoCount,
    totalRevenue,
    totalPedidos,
    cateCounts,
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
  };
}
