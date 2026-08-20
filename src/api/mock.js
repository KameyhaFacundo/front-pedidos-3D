const DEMO_EMPRESA = {
  id: 1,
  slug: 'demo',
  nombre: 'Pidevo',
  logo: '/pidevo.png',
  whatsapp: '5493815069332',
  activo: true,
  abierto: true,
  tiempo_estimado: 25,
};

const DEMO_PLATOS = [
  {
    id: 1,
    nombre: 'Bunker Cranch Doble',
    categoria: 'principales',
    descripcion: 'Doble medallón, cheddar y panceta ahumada',
    ingredientes: ['Cebolla', 'Tomate', 'Lechuga', 'Panceta'],
    precio: 13500,
    foto: '/hamburguesa.png',
    disponible: true,
    presentaciones: [],
    agregados: [],
  },
  {
    id: 2,
    nombre: 'Hamburguesa con papas',
    categoria: 'principales',
    descripcion: 'Con panceta, cheddar y papas fritas',
    ingredientes: ['Cebolla', 'Tomate', 'Panceta'],
    precio: 12000,
    foto: '/hamburguesa con papas.png',
    disponible: true,
    presentaciones: [
      { id: 21, nombre: 'Simple', descripcion: 'Un solo medallón', precio: 12000 },
      { id: 22, nombre: 'Doble', descripcion: 'Dos medallones', precio: 14500 },
      { id: 23, nombre: 'Con huevo', descripcion: 'Medallón con huevo frito', precio: 13200 },
    ],
    agregados: [
      { id: 201, nombre: 'Cheddar extra', descripcion: 'Más queso cheddar', precio: 1500 },
      { id: 202, nombre: 'Panceta', descripcion: 'Panceta ahumada crocante', precio: 2000 },
      { id: 203, nombre: 'Papas extra', descripcion: 'Porción adicional de papas', precio: 2500 },
    ],
  },
  {
    id: 3,
    nombre: 'Milanesa napolitana',
    categoria: 'principales',
    descripcion: 'Con papas al horno y ensalada',
    ingredientes: ['Jamón', 'Queso', 'Tomate'],
    precio: 11000,
    foto: '/napolitana.png',
    disponible: true,
    presentaciones: [],
    agregados: [],
  },
  {
    id: 4,
    nombre: 'Papas con cheddar',
    categoria: 'entradas',
    descripcion: 'Con cebolla caramelizada',
    precio: 9500,
    foto: '/hamburguesa con papas.png',
    disponible: true,
    presentaciones: [],
    agregados: [],
  },
  {
    id: 5,
    nombre: 'Limonada natural',
    categoria: 'bebidas',
    descripcion: 'Con menta y jengibre',
    precio: 2800,
    foto: svgFoto('🍋', 'Limonada natural'),
    disponible: true,
    presentaciones: [],
    agregados: [],
  },
  {
    id: 6,
    nombre: 'Flan casero',
    categoria: 'postres',
    descripcion: 'Con dulce de leche y crema',
    precio: 4500,
    foto: svgFoto('🍮', 'Flan casero'),
    disponible: true,
    presentaciones: [],
    agregados: [],
  },
];

const DEMO_MESAS = [
  { id: 1, numero: 1, activa: true, ocupada: false, forma: 'circular', pos_x: 22, pos_y: 30, rotacion: 0 },
  { id: 2, numero: 2, activa: true, ocupada: false, forma: 'circular', pos_x: 60, pos_y: 30, rotacion: 0 },
  { id: 3, numero: 3, activa: true, ocupada: false, forma: 'circular', pos_x: 22, pos_y: 62, rotacion: 0 },
  { id: 4, numero: 4, activa: true, ocupada: false, forma: 'rectangular', pos_x: 62, pos_y: 62, rotacion: 0 },
  { id: 5, numero: 5, activa: true, ocupada: false, forma: 'circular', pos_x: 42, pos_y: 12, rotacion: 0 },
  { id: 6, numero: 6, activa: true, ocupada: false, forma: 'circular', pos_x: 76, pos_y: 50, rotacion: 0 },
];

const STORAGE_KEY = 'pidevo_demo_pedido';

function svgFoto(emoji, texto) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<rect width="200" height="200" fill="#2A2318"/>` +
    `<text x="100" y="95" font-size="60" text-anchor="middle">${emoji}</text>` +
    `<text x="100" y="152" font-size="13" fill="#E8AE2D" text-anchor="middle" font-family="Inter,sans-serif">${texto}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function estadoSegunElapsed(ms) {
  if (ms < 30000) return 'nuevo';
  if (ms < 90000) return 'preparacion';
  if (ms < 180000) return 'listo';
  return 'entregado';
}

function guardarDemoPedido(pedido) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
  } catch {}
}

function leerDemoPedido() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function crearPedido(body) {
  const items = (body.items || []).map((item) => {
    const plato = DEMO_PLATOS.find((p) => p.id === item.plato_id);
    const agregados = (item.agregados || []).map((a) => {
      const modelo = plato?.agregados?.find((x) => x.nombre === a.nombre);
      return { nombre: a.nombre, cantidad: a.cantidad || 1, precio: modelo ? Number(modelo.precio) : 0 };
    });
    return {
      plato_id: item.plato_id,
      cantidad: item.cantidad,
      presentacion_nombre: item.presentacion_nombre || null,
      agregados,
      observacion: item.observacion || null,
      plato,
    };
  });

  const mesa = body.mesa_id ? DEMO_MESAS.find((m) => m.id === Number(body.mesa_id)) || null : null;

  const pedido = {
    id: Math.floor(1000 + Math.random() * 9000),
    token: Array.from({ length: 40 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join(''),
    tipo: body.tipo,
    mesa_id: body.mesa_id || null,
    nombre: body.nombre || null,
    celular: body.celular || null,
    direccion: body.direccion || null,
    medio_pago: body.medio_pago,
    estado: 'nuevo',
    estado_pago: 'pendiente',
    descuento: 0,
    items,
    mesa,
    createdAt: Date.now(),
  };

  guardarDemoPedido(pedido);
  return { ...pedido };
}

function leerPedidoConEstado(id) {
  const pedido = leerDemoPedido();
  if (!pedido || String(pedido.id) !== String(id)) {
    const err = new Error('Pedido no encontrado');
    err.status = 404;
    throw err;
  }
  const estado = estadoSegunElapsed(Date.now() - pedido.createdAt);
  return { ...pedido, estado };
}

function parseEndpoint(endpoint) {
  return endpoint.split('?')[0];
}

export function handleMock(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const path = parseEndpoint(endpoint);
  const resolve = (data) => Promise.resolve(data);
  const reject = (msg, status = 422) => {
    const err = new Error(msg);
    err.status = status;
    return Promise.reject(err);
  };

  if (method === 'GET' && path === '/menu') {
    return resolve({ empresa: DEMO_EMPRESA, platos: DEMO_PLATOS });
  }
  if (method === 'GET' && path === '/mesas') {
    return resolve(DEMO_MESAS);
  }
  if (method === 'GET' && path === '/empresa') {
    return resolve(DEMO_EMPRESA);
  }
  if (method === 'GET' && /^\/pedidos\/\d+$/.test(path)) {
    try {
      return resolve(leerPedidoConEstado(path.split('/')[2]));
    } catch (err) {
      return reject(err.message, err.status || 404);
    }
  }
  if (method === 'POST' && path === '/pedidos') {
    let body = {};
    try {
      body = JSON.parse(options.body || '{}');
    } catch {}
    if (!body.items || body.items.length === 0) {
      return reject('Debés incluir al menos un item');
    }
    return resolve(crearPedido(body));
  }
  if (method === 'POST' && path === '/cupones/validar') {
    let body = {};
    try {
      body = JSON.parse(options.body || '{}');
    } catch {}
    if ((body.codigo || '').trim().toUpperCase() === 'DEMO10') {
      return resolve({ id: 1, codigo: 'DEMO10', descuento: 10, tipo: 'porcentaje' });
    }
    return reject('El cupón ingresado no es válido.');
  }
  if (method === 'POST' && /^\/mesas\/\d+\/llamar$/.test(path)) {
    return resolve({ message: 'Mozo llamado a la mesa' });
  }

  return reject('No disponible en el modo demo.');
}