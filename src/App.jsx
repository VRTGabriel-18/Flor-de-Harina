import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { GestionRecurso } from './components/recurso/GestionRecurso';
import { CatalogoPage } from './pages/CatalogoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { PedidoPage } from './pages/PedidoPage';
import { RutaProtegida } from './components/RutaProtegida';
import { useRecurso } from './hooks/useRecurso';
import { RECURSOS } from './resources';

const CLAVE_CARRITO = 'flor-de-harina-carrito';

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [carrito, setCarrito] = useState(leerCarrito);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  // Las categorías alimentan el menú del header y del footer.
  const { datos: categorias, recargar: recargarCategorias } = useRecurso(RECURSOS.categorias.ruta);

  // La información general (nombre, descripción, dirección, horario, teléfono)
  // viene del Mock API y alimenta el header y el footer. Se usa el primer registro.
  const { datos: infoLista, recargar: recargarInformacion } = useRecurso(RECURSOS.informacion.ruta);
  const informacion = infoLista[0];

  const seleccionarCategoria = (nombre) => {
    setCategoriaActiva(nombre);
    navigate('/');
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.producto.id === producto.id);
      if (existente) {
        return actual.map((item) => item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item);
      }
      return [...actual, { producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (productoId, valor) => {
    const cantidad = Math.max(1, Number(valor) || 1);
    setCarrito((actual) => actual.map((item) => item.producto.id === productoId
      ? { ...item, cantidad }
      : item));
  };

  const quitarDelCarrito = (productoId) => {
    setCarrito((actual) => actual.filter((item) => item.producto.id !== productoId));
  };

  const cartCount = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="app-layout">
      <Header
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={seleccionarCategoria}
        cartCount={cartCount}
        informacion={informacion}
      />

      <main className="app-contenido">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/pedido"
            element={
              <PedidoPage
                carrito={carrito}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarDelCarrito}
                onOrdenCreada={() => setCarrito([])}
              />
            }
          />
          <Route
            path="/"
            element={
              <CatalogoPage
                categoriaActiva={categoriaActiva}
                onAddToCart={agregarAlCarrito}
              />
            }
          />

          {/* Una ruta de gestión por cada recurso: /productos, /categorias, /clientes... */}
          {Object.keys(RECURSOS).map((clave) => (
            <Route
              key={clave}
              path={`/${clave}`}
              element={
                <RutaProtegida>
                  <GestionRecurso
                    key={clave}
                    recurso={clave}
                    onCambio={
                      clave === 'categorias'
                        ? recargarCategorias
                        : clave === 'informacion'
                          ? recargarInformacion
                          : undefined
                    }
                  />
                </RutaProtegida>
              }
            />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer categorias={categorias} onSelectCategoria={seleccionarCategoria} informacion={informacion} />
    </div>
  );
}

export default App;
