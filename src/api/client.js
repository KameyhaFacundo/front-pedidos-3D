const BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '/api')
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api');

function getToken() {
  return localStorage.getItem('token');
}

function getEmpresaSlug() {
  return localStorage.getItem('pidevo_slug');
}

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();
  const slug = getEmpresaSlug();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(slug ? { 'X-Empresa': slug } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const path = window.location.pathname;
    const slugMatch = path.match(/^\/([^\/]+)(?:\/|$)/);
    const slug = slugMatch && slugMatch[1] && !['admin', 'cocina', 'llamados', 'login', 'landing'].includes(slugMatch[1])
      ? slugMatch[1]
      : null;
    const loginPath = slug ? `/${slug}/login` : '/login';
    const isAdminRoute = /^\/([^\/]+\/)?(admin|cocina|llamados)/.test(path);
    if (isAdminRoute || slug) {
      window.location.href = loginPath;
    }
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error de conexión' }));
    throw new Error(error.message || error.detail || `Error ${response.status}`);
  }

  return response.json();
}

export function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registrarEmpresa(data) {
  return request('/registro', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logout() {
  return request('/logout', { method: 'POST' });
}

export function getMe() {
  return request('/me');
}

export function getMenu() {
  return request('/menu');
}

export function getEmpresa() {
  return request('/empresa');
}

export function updateEmpresa(data) {
  return request('/empresa', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function getPedido(id, token) {
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  return request(`/pedidos/${id}${query}`);
}

export function getPedidos(estado, page = 1) {
  const params = new URLSearchParams();
  if (estado) params.append('estado', estado);
  params.append('page', page);
  params.append('per_page', '50');
  return request(`/pedidos?${params}`).then((res) => res.data || res);
}

export function createPedido(data) {
  return request('/pedidos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePedidoEstado(id, estado) {
  return request(`/pedidos/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  });
}

export function getMesas(all = false) {
  return request(`/mesas${all ? '?all=1' : ''}`);
}

export function createMesa(data) {
  return request('/mesas', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateMesa(id, data) {
  return request(`/mesas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteMesa(id) {
  return request(`/mesas/${id}`, {
    method: 'DELETE',
  });
}

export function toggleMesaActiva(id) {
  return request(`/mesas/${id}/toggle`, {
    method: 'PATCH',
  });
}

export function saveLayout(layout = []) {
  return request('/empresa/layout', {
    method: 'PUT',
    body: JSON.stringify({ layout }),
  });
}

export function llamarMozo(mesaId) {
  return request(`/mesas/${mesaId}/llamar`, {
    method: 'POST',
  });
}

export function getMetricas() {
  return request('/metricas');
}

export function getPlatos() {
  return request('/platos');
}

export function createPlato(data) {
  const isFormData = data instanceof FormData;
  return request('/platos', {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data),
  });
}

export function updatePlato(id, data) {
  const isFormData = data instanceof FormData;
  if (isFormData) data.append('_method', 'PUT');
  return request(`/platos/${id}`, {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data),
  });
}

export function deletePlato(id) {
  return request(`/platos/${id}`, {
    method: 'DELETE',
  });
}

export function togglePlatoDisponible(id) {
  return request(`/platos/${id}/toggle`, {
    method: 'PATCH',
  });
}

export function getLlamados() {
  return request('/llamados');
}

export function atenderLlamado(llamadoId) {
  return request(`/llamados/${llamadoId}/atender`, {
    method: 'PATCH',
  });
}

export function updatePedidoPago(id) {
  return request(`/pedidos/${id}/pago`, {
    method: 'PATCH',
  });
}

export function registrarArVista(platoId) {
  return request(`/ar-vistas/${platoId}`, {
    method: 'POST',
  });
}

export function cancelarPedido(id) {
  return request(`/pedidos/${id}/cancelar`, {
    method: 'PATCH',
  });
}

export function validarCupon(codigo) {
  return request('/cupones/validar', {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  });
}

export function getCupones() {
  return request('/cupones');
}

export function createCupon(data) {
  return request('/cupones', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCupon(id, data) {
  return request(`/cupones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function toggleCupon(id) {
  return request(`/cupones/${id}/toggle`, {
    method: 'PATCH',
  });
}

export function deleteCupon(id) {
  return request(`/cupones/${id}`, {
    method: 'DELETE',
  });
}

export function getStaff() {
  return request('/staff');
}

export function createStaff(data) {
  return request('/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteStaff(id) {
  return request(`/staff/${id}`, {
    method: 'DELETE',
  });
}

export function reordenarPlatos(platos) {
  return request('/platos/orden', {
    method: 'PUT',
    body: JSON.stringify({ platos }),
  });
}
