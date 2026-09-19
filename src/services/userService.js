const API_BASE_URL = 'https://6aae9409606bd915d110ecc1.mockapi.io';

export const getUsuarios = () => 
  fetch(`${API_BASE_URL}/usuarios`).then(res => res.json());

export const createUsuario = (data) => 
  fetch(`${API_BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateUsuario = (id, data) => 
  fetch(`${API_BASE_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteUsuario = (id) => 
  fetch(`${API_BASE_URL}/usuarios/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());

// Alias en español
export const obtenerUsuarios = getUsuarios;
export const crearUsuario = createUsuario;
export const actualizarUsuario = updateUsuario;
export const eliminarUsuario = deleteUsuario;