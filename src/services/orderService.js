const API_BASE_URL = 'https://6aae9409606bd915d110ecc1.mockapi.io';

export const getOrdenes = () => 
  fetch(`${API_BASE_URL}/ordenes`).then(res => res.json());

export const createOrden = (data) => 
  fetch(`${API_BASE_URL}/ordenes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateOrden = (id, data) => 
  fetch(`${API_BASE_URL}/ordenes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteOrden = (id) => 
  fetch(`${API_BASE_URL}/ordenes/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());

// Alias en español
export const obtenerOrdenes = getOrdenes;
export const crearOrden = createOrden;
export const actualizarOrden = updateOrden;
export const eliminarOrden = deleteOrden;