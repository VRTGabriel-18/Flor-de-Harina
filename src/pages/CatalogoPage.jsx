import { useState, useMemo } from 'react';
import { Banner } from '../components/Layout/Banner';
import { ProductoCard } from '../components/producto/ProductoCard';
import { SkeletonGrid } from '../components/producto/SkeletonCard';
import { useRecurso } from '../hooks/useRecurso';
import { RECURSOS } from '../resources';
import { formatearPrecio } from '../utils/formato';
import { useToast } from '../hooks/useToast';

export function CatalogoPage({ categoriaActiva, onAddToCart }) {
  const { mostrarToast } = useToast();
  const { datos: productos, cargando, error, recargar } = useRecurso(RECURSOS.productos.ruta);
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    let lista = categoriaActiva === 'Todos'
      ? productos
      : productos.filter((p) => (p.categoria ?? '').toLowerCase() === categoriaActiva.toLowerCase());

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      lista = lista.filter((p) =>
        (p.nombre ?? '').toLowerCase().includes(q) ||
        (p.descripcion ?? '').toLowerCase().includes(q) ||
        (p.categoria ?? '').toLowerCase().includes(q)
      );
    }
    return lista;
  }, [productos, categoriaActiva, busqueda]);

  // Producto estrella para el Spotlight (primer pastel o producto disponible)
  const productoEstrella = productos.find((p) =>
    (p.nombre ?? '').toLowerCase().includes('pastel') || (p.tag ?? '').toLowerCase().includes('popular')
  ) || productos[0];

  return (
    <>
      <Banner />

      {/* Spotlight / Especialidad del Día */}
      {productoEstrella && !cargando && !busqueda && (
        <section className="spotlight-horneado">
          <div className="spotlight-badge">
            <span>⭐ Especialidad del Día</span>
          </div>
          <div className="spotlight-contenido">
            <div className="spotlight-info">
              <span className="spotlight-tag">Hojaldre 100% Casero</span>
              <h2 className="spotlight-titulo">{productoEstrella.nombre}</h2>
              <p className="spotlight-descripcion">
                {productoEstrella.descripcion || 'Masa hojaldrada crujiente con sellado tradicional y relleno jugoso preparado con sazón de casa.'}
              </p>
              <div className="spotlight-pie">
                <span className="spotlight-precio">{formatearPrecio(productoEstrella.precio)}</span>
                <button
                  type="button"
                  className="btn btn-primario btn-spotlight"
                  onClick={() => {
                    onAddToCart(productoEstrella);
                    mostrarToast({ tipo: 'ok', texto: `${productoEstrella.nombre} agregado al pedido.` });
                  }}
                >
                  🛒 Agregar Especialidad
                </button>
              </div>
            </div>
            <div className="spotlight-imagen-wrap">
              <img
                src={productoEstrella.imagen || './pastel_pollo.jpg'}
                alt={productoEstrella.nombre}
                className="spotlight-imagen"
                onError={(e) => { e.currentTarget.src = './pastel_pollo.jpg'; }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Encabezado del Catálogo & Barra de Búsqueda */}
      <section className="catalogo-encabezado" id="catalogo">
        <div className="catalogo-titulo-wrap">
          <span className="catalogo-subtitulo">Vitrina de horneados</span>
          <h2>🥐 {categoriaActiva === 'Todos' ? 'Nuestra Selección Completa' : categoriaActiva}</h2>
        </div>

        <div className="catalogo-filtros-wrap">
          <div className="catalogo-busqueda">
            <span className="busqueda-icono" aria-hidden="true">🔍</span>
            <input
              type="search"
              className="busqueda-input"
              placeholder="Buscar por nombre o relleno..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar productos"
            />
            {busqueda && (
              <button
                type="button"
                className="busqueda-limpiar"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {!cargando && !error && (
            <span className="contador">
              {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>
      </section>

      {cargando && <SkeletonGrid cantidad={6} />}

      {error && (
        <div className="mensaje mensaje-error" role="alert">
          <span>No se pudieron cargar los productos en este momento. {error}.</span>
          <button type="button" className="btn btn-suave btn-chico" onClick={recargar}>Reintentar</button>
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="vacio vacio-catalogo">
          <span className="vacio-icono">🌾</span>
          <h3>No encontramos horneados con ese criterio</h3>
          <p>Prueba con otra búsqueda o selecciona una categoría diferente.</p>
          {busqueda && (
            <button type="button" className="btn btn-suave" onClick={() => setBusqueda('')}>
              Mostrar todos los productos
            </button>
          )}
        </div>
      )}

      {/* Grilla de Productos */}
      <section className="producto-grid" aria-label="Lista de productos del catálogo">
        {!cargando && !error && filtrados.map((p, idx) => (
          <ProductoCard key={p.id} producto={p} onAddToCart={onAddToCart} cardIndex={idx} />
        ))}
      </section>
    </>
  );
}
