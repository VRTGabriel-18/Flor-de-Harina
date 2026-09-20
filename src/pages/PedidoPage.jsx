import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato';
import { crear, listar, actualizar } from '../services/apiService';
import { useRecurso } from '../hooks/useRecurso';
import { useAuth } from '../hooks/useAuth';
import { RECURSOS } from '../resources';
import { useToast } from '../hooks/useToast';

const precioNumerico = (valor) => Number(valor) || 0;

export function PedidoPage({ carrito, onCambiarCantidad, onQuitar, onOrdenCreada }) {
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();
  const { datos: estados } = useRecurso(RECURSOS.estados.ruta);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [ordenCreada, setOrdenCreada] = useState(null);
  const [datosEntrega, setDatosEntrega] = useState({
    nombre: usuario?.nombre ?? '',
    direccion: '',
  });
  const total = carrito.reduce(
    (suma, item) => suma + precioNumerico(item.producto.precio) * item.cantidad,
    0,
  );

  const finalizarCompra = async () => {
    const nombre = datosEntrega.nombre.trim();
    const direccion = datosEntrega.direccion.trim();
    if (!nombre || !direccion) {
      setMensaje({ tipo: 'error', texto: 'Escribe tu nombre y la dirección donde deseas recibir el pedido.' });
      return;
    }

    setProcesando(true);
    setMensaje(null);
    const estadoInicial = estados.find((estado) => estado.nombre?.toLowerCase() === 'pendiente')?.nombre
      ?? estados[0]?.nombre
      ?? 'Pendiente';

    // Resumen legible del pedido para visualización rápida
    const resumenPedido = carrito.map(({ producto, cantidad }) => `${cantidad}x ${producto.nombre}`).join(', ');

    const datosOrden = {
      cliente: nombre,
      direccion,
      productos: carrito.map(({ producto, cantidad }) => ({
        producto: producto.id,
        nombre: producto.nombre,
        cantidad,
        precio: precioNumerico(producto.precio),
      })),
      total,
      fecha: new Date().toISOString().split('T')[0],
      estado: estadoInicial,
      ...(usuario ? { usuario: usuario.id } : {}),
    };

    try {
      // 1. Crear la orden en la gestión de órdenes
      const orden = await crear(RECURSOS.ordenes.ruta, datosOrden);

      // 2. Sincronizar en la gestión de clientes (nombre, dirección, último pedido)
      try {
        const clientesActuales = await listar(RECURSOS.clientes.ruta);
        const clienteExistente = Array.isArray(clientesActuales)
          ? clientesActuales.find((c) => (c.nombre ?? '').trim().toLowerCase() === nombre.toLowerCase())
          : null;

        const infoCliente = {
          nombre,
          direccion,
          pedido: resumenPedido,
          estado: true,
        };

        if (clienteExistente) {
          await actualizar(RECURSOS.clientes.ruta, clienteExistente.id, {
            ...clienteExistente,
            ...infoCliente,
          });
        } else {
          await crear(RECURSOS.clientes.ruta, infoCliente);
        }
      } catch (errCliente) {
        console.warn('Nota: No se pudo actualizar cliente en MockAPI:', errCliente);
      }

      setOrdenCreada(orden);
      mostrarToast({ tipo: 'ok', texto: 'Orden creada correctamente.' });
      onOrdenCreada();
    } catch (error) {
      mostrarToast({ tipo: 'error', texto: 'No se pudo crear la orden.' });
      setMensaje({ tipo: 'error', texto: `No se pudo crear la orden. ${error.message}.` });
    } finally {
      setProcesando(false);
    }
  };

  if (ordenCreada) {
    return (
      <section className="gestion pedido">
        <div className="gestion-encabezado">
          <h1>Orden confirmada</h1>
          <p>Tu pedido fue registrado correctamente.</p>
        </div>
        <div className="mensaje mensaje-ok" role="status">
          Orden #{ordenCreada.id} creada por {formatearPrecio(ordenCreada.total ?? total)} con estado {ordenCreada.estado ?? 'Pendiente'}.
        </div>
        <Link to="/" className="btn btn-primario">Volver al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="gestion pedido">
      <div className="gestion-encabezado">
        <h1>🛒 Mi pedido</h1>
        <p>Revisa los productos y cantidades antes de finalizar tu compra.</p>
      </div>

      {carrito.length === 0 ? (
        <div className="vacio vacio-pedido">
          <span className="vacio-icono">🥐</span>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestras delicias recién horneadas y agrégalas a tu pedido.</p>
          <Link to="/" className="btn btn-primario">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="panel panel-pedido">
          {mensaje && <div className={`mensaje mensaje-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>}
          <div className="datos-entrega">
            <h3>📍 Datos de entrega</h3>
            <p className="texto-suave">Puedes pedir sin iniciar sesión. Solo necesitamos estos datos.</p>
            <div className="form-grid">
              <div className="campo">
                <label htmlFor="nombre-entrega">Nombre</label>
                <input
                  id="nombre-entrega"
                  className="input"
                  type="text"
                  value={datosEntrega.nombre}
                  onChange={(evento) => setDatosEntrega((actual) => ({ ...actual, nombre: evento.target.value }))}
                  placeholder="Ej. María Pérez"
                  required
                />
              </div>
              <div className="campo">
                <label htmlFor="direccion-entrega">¿Dónde enviamos tu pedido?</label>
                <input
                  id="direccion-entrega"
                  className="input"
                  type="text"
                  value={datosEntrega.direccion}
                  onChange={(evento) => setDatosEntrega((actual) => ({ ...actual, direccion: evento.target.value }))}
                  placeholder="Ej. Calle 10 #20-30, Bogotá"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pedido-separador">
            <h3>🛍️ Productos seleccionados</h3>
          </div>

          <div className="pedido-lista">
            {carrito.map(({ producto, cantidad }) => (
              <article className="pedido-item" key={producto.id}>
                <div>
                  <h3>{producto.nombre}</h3>
                  <p className="texto-suave">{formatearPrecio(producto.precio)} por unidad</p>
                </div>

                <div className="pedido-controles">
                  <label htmlFor={`cantidad-${producto.id}`}>Cantidad</label>
                  <input
                    id={`cantidad-${producto.id}`}
                    className="input pedido-cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(evento) => onCambiarCantidad(producto.id, evento.target.value)}
                  />
                  <strong>{formatearPrecio(precioNumerico(producto.precio) * cantidad)}</strong>
                  <button type="button" className="btn btn-peligro btn-chico" onClick={() => onQuitar(producto.id)}>
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="pedido-total">
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>

          <div className="form-acciones">
            <Link to="/" className="btn btn-suave">Seguir comprando</Link>
            <button type="button" className="btn btn-primario" onClick={finalizarCompra} disabled={procesando}>
              {procesando ? 'Creando orden...' : 'Enviar pedido'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}