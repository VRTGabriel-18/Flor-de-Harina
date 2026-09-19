const API_BASE_URL = 'https://6aae9409606bd915d110ecc1.mockapi.io';

export const getClientes = () => 
  fetch(`${API_BASE_URL}/clientes`).then(res => res.json());

export const createCliente = (data) => 
  fetch(`${API_BASE_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateCliente = (id, data) => 
  fetch(`${API_BASE_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteCliente = (id) => 
  fetch(`${API_BASE_URL}/clientes/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());

// Alias en español
export const obtenerClientes = getClientes;
export const crearCliente = createCliente;
export const actualizarCliente = updateCliente;
export const eliminarCliente = deleteCliente;