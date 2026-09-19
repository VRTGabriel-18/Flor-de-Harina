const API_BASE_URL = 'https://6aae9409606bd915d110ecc1.mockapi.io';

export const getCategorias = () => 
  fetch(`${API_BASE_URL}/categorias`).then(res => res.json());

export const createCategoria = (data) => 
  fetch(`${API_BASE_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

// Alias en español requerido por tu componente
export const crearCategoria = createCategoria;

export const actualizarCategoria = (id, data) => 
  fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const eliminarCategoria = (id) => 
  fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());