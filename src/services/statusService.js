const API_BASE_URL = 'https://6aae9409606bd915d110ecc1.mockapi.io';

export const getEstados = () => 
  fetch(`${API_BASE_URL}/estados`).then(res => res.json());

export const createEstado = (data) => 
  fetch(`${API_BASE_URL}/estados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateEstado = (id, data) => 
  fetch(`${API_BASE_URL}/estados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteEstado = (id) => 
  fetch(`${API_BASE_URL}/estados/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());

// Alias en español
export const obtenerEstados = getEstados;
export const crearEstado = createEstado;
export const actualizarEstado = updateEstado;
export const eliminarEstado = deleteEstado;