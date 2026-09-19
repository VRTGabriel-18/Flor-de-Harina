import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const linkStyle = {
    display: 'block',
    padding: '10px 15px',
    textDecoration: 'none',
    color: 'var(--color-texto)',
    borderBottom: '1px solid #eee'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: 'var(--color-primario)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>Flor de Harina</h1>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={toggleMenu}
            style={{ backgroundColor: 'var(--color-secundario)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
          >
            Menú de Gestión ▼
          </button>

          {menuAbierto && (
            <ul style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid var(--color-primario)', borderRadius: '5px', listStyle: 'none', padding: '0', margin: '5px 0 0 0', width: '200px', zIndex: 1000 }}>
              <li><Link to="/productos" style={linkStyle} onClick={toggleMenu}>Productos</Link></li>
              <li><Link to="/categorias" style={linkStyle} onClick={toggleMenu}>Categorías</Link></li>
            </ul>
          )}
        </div>
      </header>

      <main style={{ flexGrow: 1, padding: '2rem' }}>
        {children}
      </main>

      <footer style={{ backgroundColor: 'var(--color-texto)', color: 'white', textAlign: 'center', padding: '1.5rem' }}>
        <p style={{ margin: 0 }}>&copy; 2026 Flor de Harina | Casa Horneada.</p>
      </footer>
    </div>
  );
}