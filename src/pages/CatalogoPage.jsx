import { Banner } from '../components/Layout/Banner';
import { ProductoCard } from '../components/producto/ProductoCard';
import { useRecurso } from '../hooks/useRecurso';
import { RECURSOS } from '../resources';

export function CatalogoPage({ categoriaActiva, onAddToCart }) {
  const { datos: productos, cargando, error, recargar } = useRecurso(RECURSOS.productos.ruta);

  const filtrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter((p) => (p.categoria ?? '').toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <>
      <Banner />

      <section className="catalogo-encabezado">
        <h2>{categoriaActiva === 'Todos' ? 'Todos los productos' : categoriaActiva}</h2>
        {!cargando && !error && <p className="contador">{filtrados.length} producto(s) disponibles</p>}
      </section>

      {cargando && <p className="estado-texto">Cargando productos...</p>}

      {error && (
        <div className="mensaje mensaje-error" role="alert">
          No se pudieron cargar los productos. {error}.
          <button type="button" className="btn btn-suave btn-chico" onClick={recargar}>Reintentar</button>
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="vacio">
          <p>No hay productos en esta categoría todavía.</p>
        </div>
      )}

      <section className="producto-grid">
        {!cargando && !error && filtrados.map((p) => (
          <ProductoCard key={p.id} producto={p} onAddToCart={onAddToCart} />
        ))}
      </section>
    </>
  );
}
