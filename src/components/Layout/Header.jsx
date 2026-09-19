import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from './Menu';
import { RECURSOS } from '../../resources';
import { useAuth } from '../../hooks/useAuth';

const claseLink = ({ isActive }) => `nav-link${isActive ? ' activo' : ''}`;

export function Header({ categorias = [], categoriaActiva, onSelectCategoria, cartCount = 0, informacion }) {
  const [abierto, setAbierto] = useState(false);
  const { usuario, cerrarSesion } = useAuth();
  const esCatalogo = useLocation().pathname === '/';
  const cerrar = () => setAbierto(false);

  return (
    <header className="header">
      <div className="header-barra">
        <div className="header-inner">
          <Link to="/" className="marca" onClick={cerrar}>
            <span className="marca-icono" aria-hidden="true">🥐</span>
            <span className="marca-nombre">{informacion?.nombre ?? 'Flor de Harina'}</span>
          </Link>

          {esCatalogo && (
            <Link to="/pedido" className="carrito" aria-label={`Mi pedido, ${cartCount} productos`}>
              🛒 <span className="carrito-texto">Mi pedido</span>
              {cartCount > 0 && <span className="carrito-cuenta">{cartCount}</span>}
            </Link>
          )}

          {usuario ? (
            <div className="sesion">
              <span className="sesion-nombre">{usuario.nombre}</span>
              <button type="button" className="btn btn-suave btn-chico" onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-suave btn-chico" onClick={cerrar}>Iniciar sesión</Link>
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
