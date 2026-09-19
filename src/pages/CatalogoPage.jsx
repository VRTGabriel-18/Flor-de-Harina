import { ProductoCard } from '../components/producto/ProductoCard';
import Banner from '../components/Layout/Banner';

export function CatalogoPage({ productos = [], categoriaActiva = "Inicio", onAddToCart, cargando }) {
  const productosFiltrados = categoriaActiva === "Inicio"
    ? productos
    : productos.filter(p => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <>
      {/* Section Header */}
      <section className="catalog-header">
        <div>
          <h2 className="catalog-title">
            {categoriaActiva === "Inicio" ? "Todos los Productos" : categoriaActiva}
          </h2>
          <p className="catalog-count">{productosFiltrados.length} producto(s) disponibles</p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="product-grid">
        {cargando ? (
          <p className="loading-text">Cargando productos...</p>
        ) : (
          productosFiltrados.map(p => (
            <ProductoCard key={p.id} producto={p} onAddToCart={onAddToCart} />
          ))
        )}
      </section>
    </>
  );
}