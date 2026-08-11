const BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '/api')
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api');

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    window.location.href = '/login';
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

export function logout() {
  return request('/logout', { method: 'POST' });
}

export function getMe() {
  return request('/me');
}

export function getMenu() {
  return request('/menu');
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

export function getMesas() {
  return request('/mesas');
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
  data.append('_method', 'PUT');
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
