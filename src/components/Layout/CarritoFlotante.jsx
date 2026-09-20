import { Link, useLocation } from 'react-router-dom';

export function CarritoFlotante({ cartCount = 0 }) {
  const esCatalogo = useLocation().pathname === '/';

  if (!esCatalogo) return null;

  return (
    <Link
      to="/pedido"
      className="carrito-flotante"
      aria-label={`Mi pedido, ${cartCount} producto${cartCount !== 1 ? 's' : ''}`}
    >
      <span className="carrito-flotante-icono" aria-hidden="true">🛒</span>
      {cartCount > 0 && (
        <span className="carrito-flotante-cuenta" aria-live="polite">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
