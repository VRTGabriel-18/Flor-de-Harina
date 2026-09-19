import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from './Menu';
import { RECURSOS } from '../../resources';

const claseLink = ({ isActive }) => `nav-link${isActive ? ' activo' : ''}`;

export function Header({ categorias = [], categoriaActiva, onSelectCategoria, cartCount = 0 }) {
  const [abierto, setAbierto] = useState(false);
  const esCatalogo = useLocation().pathname === '/';
  const cerrar = () => setAbierto(false);

  return (
    <header className="header">
      <div className="header-barra">
        <div className="header-inner">
          <Link to="/" className="marca" onClick={cerrar}>
            <span className="marca-icono" aria-hidden="true">🥐</span>
            <span className="marca-nombre">Flor de Harina</span>
          </Link>

          {esCatalogo && (
            <button type="button" className="carrito" aria-label={`Mi pedido, ${cartCount} productos`}>
              🛒 <span className="carrito-texto">Mi pedido</span>
              {cartCount > 0 && <span className="carrito-cuenta">{cartCount}</span>}
            </button>
          )}

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={abierto}
            aria-controls="menu-principal"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? '✕' : '☰'}
          </button>

          <nav id="menu-principal" className={`nav-principal${abierto ? ' abierto' : ''}`} aria-label="Menú principal">
            <NavLink to="/" end className={claseLink} onClick={cerrar}>🛍️ Catálogo</NavLink>
            {Object.entries(RECURSOS).map(([clave, recurso]) => (
              <NavLink key={clave} to={`/${clave}`} className={claseLink} onClick={cerrar}>
                {recurso.icono} {recurso.titulo}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {esCatalogo && (
        <Menu categorias={categorias} categoriaActiva={categoriaActiva} onSelectCategoria={onSelectCategoria} />
      )}
    </header>
  );
}
