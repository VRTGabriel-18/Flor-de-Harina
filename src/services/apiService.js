import { API_BASE_URL } from '../config';

// Todas las peticiones pasan por aquí. Si la API responde con error (404, 500...)
// se lanza una excepción, para que la interfaz no muestre "éxito" cuando falló.
const solicitar = async (ruta, opciones = {}) => {
  // Content-Type solo cuando se envía cuerpo (POST/PUT); así GET y DELETE no requieren verificación CORS previa.
  const headers = opciones.body ? { 'Content-Type': 'application/json' } : undefined;
  const respuesta = await fetch(`${API_BASE_URL}/${ruta}`, { headers, ...opciones });

  if (!respuesta.ok) {
    throw new Error(`La API respondió ${respuesta.status} en "/${ruta}"`);
  }
  return respuesta.json();
};

export const listar = (recurso) => solicitar(recurso);

export const crear = (recurso, datos) =>
  solicitar(recurso, { method: 'POST', body: JSON.stringify(datos) });

export const actualizar = (recurso, id, datos) =>
  solicitar(`${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(datos) });

export const eliminar = (recurso, id) =>
  solicitar(`${recurso}/${id}`, { method: 'DELETE' });
