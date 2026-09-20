import { useState } from 'react';
import { formatearPrecio } from '../../utils/formato';
import { useToast } from '../../hooks/useToast';

export function ProductoCard({ producto, onAddToCart }) {
  const { mostrarToast } = useToast();
  const { nombre, descripcion, precio, imagen, tag, categoria } = producto;
  const [imgSrc, setImgSrc] = useState(imagen || './pastel_pollo.jpg');
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    if (!imgError) {
      setImgError(true);
      // Fallback a foto artesanal según nombre o tipo
      const nombreMin = (nombre || '').toLowerCase();
      if (nombreMin.includes('buñuelo') || nombreMin.includes('pandebono') || nombreMin.includes('queso')) {
        setImgSrc('./bunuelos.jpg');
      } else {
        setImgSrc('./pastel_pollo.jpg');
      }
    }
  };

  return (
    <article className="producto-card-premium">
      <div className="producto-card-cabecera">
        {tag ? (
          <span className="producto-card-tag">{tag}</span>
        ) : (
          <span className="producto-card-tag tag-artesanal">✨ Casa</span>
        )}

        <span className="producto-card-rating">
          ⭐ 4.9
        </span>
      </div>

      <div className="producto-card-visual">
        <div className="producto-pedestal">
          <img
            src={imgSrc}
            alt={nombre}
            loading="lazy"
            onError={handleImgError}
            className="producto-card-img"
          />
        </div>
      </div>

      <div className="producto-card-cuerpo">
        {categoria && <span className="producto-card-categoria">🌾 {categoria}</span>}

        <h3 className="producto-card-nombre" title={nombre}>
          {nombre}
        </h3>

        {descripcion && (
          <p className="producto-card-descripcion" title={descripcion}>
            {descripcion}
          </p>
        )}

        <div className="producto-card-pie">
          <div className="producto-card-precio-box">
            <span className="producto-card-precio-label">Precio</span>
            <span className="producto-card-precio">{formatearPrecio(precio)}</span>
          </div>

          <button
            type="button"
            className="btn-card-agregar"
            aria-label={`Agregar ${nombre} al pedido`}
            onClick={() => {
              onAddToCart(producto);
              mostrarToast({ tipo: 'ok', texto: `${nombre} agregado al pedido.` });
            }}
          >
            <span className="btn-card-plus">+</span>
            <span className="btn-card-texto">Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
