import { formatearPrecio } from '../../utils/formato';
import { useToast } from '../../hooks/useToast';

export function ProductoCard({ producto, onAddToCart }) {
  const { mostrarToast } = useToast();
  const { nombre, descripcion, precio, imagen, tag } = producto;

  return (
    <article className="producto">
      <div className="producto-imagen">
        {tag && <span className="producto-tag">{tag}</span>}
        {imagen
          ? <img src={imagen} alt={nombre} loading="lazy" />
          : <span className="producto-vacio" aria-hidden="true">🥐</span>}
      </div>

      <div className="producto-cuerpo">
        <h3 className="producto-nombre">{nombre}</h3>
        {descripcion && <p className="producto-descripcion">{descripcion}</p>}

        <div className="producto-pie">
          <span className="producto-precio">{formatearPrecio(precio)}</span>
          <button type="button" className="btn btn-primario btn-chico" onClick={() => {
            onAddToCart(producto);
            mostrarToast({ tipo: 'ok', texto: `${nombre} agregado al pedido.` });
          }}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
