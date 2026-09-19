const API_BASE_URL = 'https://6aae9409606bd915d110ecc1.mockapi.io';

export const getProductos = () => 
  fetch(`${API_BASE_URL}/productos`).then(res => res.json());

export const createProducto = (data) => 
  fetch(`${API_BASE_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const updateProducto = (id, data) => 
  fetch(`${API_BASE_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const deleteProducto = (id) => 
  fetch(`${API_BASE_URL}/productos/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());

// Alias en español
export const obtenerProductos = getProductos;
export const crearProducto = createProducto;
export const actualizarProducto = updateProducto;
export const eliminarProducto = deleteProducto;