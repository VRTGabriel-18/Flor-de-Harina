import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [cartCount, setCartCount] = useState(0);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  const cargarProductos = () => {
    setCargando(true);
    obtenerProductos()
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setCargando(false);
      });
  };

  const cargarCategorias = () => {
    obtenerCategorias()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Header 
        categorias={categorias}
        categoriaActiva={categoriaActiva} 
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
      />
      
      <main className="app-container">
        <Routes>
          {/* Ruta del Catálogo Principal */}
          <Route 
            path="/" 
            element={
              <CatalogoPage 
                productos={productos}
                categoriaActiva={categoriaActiva}
                onAddToCart={handleAddToCart}
                cargando={cargando}
              />
            } 
          />

          {/* Ruta de Gestión de Productos */}
          <Route 
            path="/productos" 
            element={
              <ProductosPage 
                productos={productos}
                categorias={categorias}
                onActualizarProductos={cargarProductos}
                cargando={cargando}
              />
            } 
          />

          {/* Ruta 404 para cualquier otra URL */}
                    {/* Ruta de Gestión de Categorías */}
          <Route 
            path="/categorias" 
            element={
              <CategoriasPage 
                categorias={categorias}
                onActualizarCategorias={cargarCategorias}
                cargando={cargando}
              />
            } 
          />

          {/* Ruta 404 para cualquier otra URL */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer integrado */}
      <Footer 
        categorias={categorias}
        setCategoriaActiva={handleSeleccionarCategoriaFooter}
      />
    </div>
  );
}

export default App;