import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="pagina-404">
      <h2>404</h2>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primario">Volver al catálogo</Link>
    </div>
  );
}
