import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from './Menu';

export function Header({ 
  categorias = [], 
  categoriaActiva, 
  onSelectCategoria, 
  cartCount = 0 
}) {
  const location = useLocation();
  const esCatalogo = location.pathname === '/';

  return (
    <header className="header-navbar">
      <div className="header-inner">
        {/* Brand / Logo con Link a la ruta raíz */}
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo">⚡</div>
          <span className="brand-name">Quick<span className="brand-highlight">Order</span></span>
        </Link>
        
        {/* Nav de categorías sólo en la página de catálogo */}
        {esCatalogo ? (
          <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
        ) : (
          <div className="view-title-nav">
            <span className="view-badge">Modo Administración</span>
          </div>
        )}

        {/* Naves de rutas con NavLink y Carrito */}
        <div className="header-actions" style={{ gap: '12px' }}>
          <div className="view-nav">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              🛍️ Catálogo
            </NavLink>
            <NavLink 
              to="/productos" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              ⚙️ Productos
            </NavLink>
            <NavLink 
              to="/categorias" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              🗂️ Categorías
            </NavLink>
          </div>

          {esCatalogo && (
            <button className="cart-button">
              <span className="cart-icon">🛒</span>
              <span className="cart-label">Mi Pedido</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}