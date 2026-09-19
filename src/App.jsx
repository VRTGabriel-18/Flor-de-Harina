import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CategoriasPage from './pages/CategoriasPage';
import ProductosPage from './pages/ProductosPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;