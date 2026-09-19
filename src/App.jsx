import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { GestionRecurso } from './components/recurso/GestionRecurso';
import { CatalogoPage } from './pages/CatalogoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useRecurso } from './hooks/useRecurso';
import { RECURSOS } from './resources';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Las categorías alimentan el menú del header y del footer.
  const { datos: categorias, recargar: recargarCategorias } = useRecurso(RECURSOS.categorias.ruta);

  const seleccionarCategoria = (nombre) => {
    setCategoriaActiva(nombre);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Header
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={seleccionarCategoria}
        cartCount={cartCount}
      />

      <main className="app-contenido">
        <Routes>
          <Route
            path="/"
            element={
              <CatalogoPage
                categoriaActiva={categoriaActiva}
                onAddToCart={() => setCartCount((n) => n + 1)}
              />
            }
          />

          {/* Una ruta de gestión por cada recurso: /productos, /categorias, /clientes... */}
          {Object.keys(RECURSOS).map((clave) => (
            <Route
              key={clave}
              path={`/${clave}`}
              element={
                <GestionRecurso
                  key={clave}
                  recurso={clave}
                  onCambio={clave === 'categorias' ? recargarCategorias : undefined}
                />
              }
            />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer categorias={categorias} onSelectCategoria={seleccionarCategoria} />
    </div>
  );
}

export default App;
