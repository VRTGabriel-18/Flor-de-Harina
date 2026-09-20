import { useState, useMemo, useCallback } from 'react';
import { formatearPrecio } from '../../utils/formato';
import { SelectorEstadoBadge } from './SelectorEstadoBadge';

const hayValor = (v) => v !== undefined && v !== null && v !== '';
const TAMANO_PAGINA_DEFAULT = 10;

function renderProductos(valor) {
  if (!hayValor(valor)) return <span className="texto-suave">—</span>;

  let lista = [];
  if (Array.isArray(valor)) {
    lista = valor;
  } else if (typeof valor === 'string') {
    try {
      const parseado = JSON.parse(valor);
      if (Array.isArray(parseado)) {
        lista = parseado;
      } else {
        return <span className="chip-producto">🥟 {valor}</span>;
      }
    } catch {
      return <span className="chip-producto">🥟 {valor}</span>;
    }
  } else if (typeof valor === 'object') {
    lista = [valor];
  }

  if (lista.length === 0) return <span className="texto-suave">—</span>;

  return (
    <div className="lista-chips-productos">
      {lista.map((item, idx) => {
        const cant = item.cantidad ? `${item.cantidad}x ` : '';
        const nom = item.nombre || item.producto || (typeof item === 'string' ? item : 'Producto');
        return (
          <span key={idx} className="chip-producto">
            🥟 {cant}{nom}
          </span>
        );
      })}
    </div>
  );
}

function Celda({ columna, fila, onActualizarEstado, opcionesEstados }) {
  const valor = fila[columna.campo];

  if (columna.tipo === 'imagen') {
    return valor
      ? <img src={valor} alt={fila.nombre ?? ''} className="miniatura" loading="lazy" />
      : <span className="miniatura miniatura-vacia" aria-hidden="true">🥐</span>;
  }
  if (columna.tipo === 'precio') return <strong>{formatearPrecio(valor)}</strong>;
  if (columna.tipo === 'productos' || columna.campo === 'productos' || columna.campo === 'pedido') {
    return renderProductos(valor);
  }
  if (columna.tipo === 'fecha' && hayValor(valor)) {
    try {
      const f = new Date(valor);
      return !isNaN(f.getTime()) ? f.toLocaleDateString('es-CO') : String(valor);
    } catch {
      return String(valor);
    }
  }
  if (columna.campo === 'direccion' && hayValor(valor)) {
    return <span className="direccion-texto">📍 {valor}</span>;
  }
  if (columna.tipo === 'estado-interactivo') {
    return (
      <SelectorEstadoBadge
        valor={valor}
        fila={fila}
        onCambio={(nuevoEstado) => onActualizarEstado && onActualizarEstado(fila, nuevoEstado)}
        opciones={opcionesEstados}
      />
    );
  }
  if (columna.tipo === 'badge') {
    if (typeof valor === 'boolean') {
      return <span className={`badge ${valor ? 'badge-activo' : 'badge-inactivo'}`}>{valor ? 'Activo' : 'Inactivo'}</span>;
    }
    return hayValor(valor) ? <span className="badge">{String(valor)}</span> : <span className="texto-suave">—</span>;
  }
  if (typeof valor === 'boolean') {
    return valor ? 'Sí' : 'No';
  }
  return hayValor(valor) ? String(valor) : <span className="texto-suave">—</span>;
}

// Helpers para búsqueda y ordenación
function obtenerValorBusqueda(fila, config) {
  // Busca en campos de texto visibles (nombre, cliente, dirección, etc.)
  const camposTexto = config.columnas
    .filter((c) => !['imagen', 'precio', 'badge', 'estado-interactivo', 'productos', 'fecha'].includes(c.tipo))
    .map((c) => c.campo);
  
  return camposTexto
    .map((campo) => String(fila[campo] ?? ''))
    .join(' ')
    .toLowerCase();
}

function compararValores(a, b, direccion) {
  if (a === b) return 0;
  const resultado = a < b ? -1 : 1;
  return direccion === 'asc' ? resultado : -resultado;
}

export function ListaRecurso({
  config,
  registros,
  cargando,
  error,
  onReintentar,
  onEditar,
  onEliminar,
  onActualizarEstado,
  opcionesEstados,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamanoPagina] = useState(TAMANO_PAGINA_DEFAULT);
  const [orden, setOrden] = useState({ campo: null, direccion: 'asc' });

  // Filtrar y ordenar registros
  const registrosFiltrados = useMemo(() => {
    let resultado = [...registros];

    // Búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.trim().toLowerCase();
      resultado = resultado.filter((fila) => 
        obtenerValorBusqueda(fila, config).includes(termino) ||
        String(fila.id).includes(termino)
      );
    }

    // Ordenación
    if (orden.campo) {
      resultado.sort((a, b) => {
        const valorA = a[orden.campo] ?? '';
        const valorB = b[orden.campo] ?? '';
        return compararValores(String(valorA).toLowerCase(), String(valorB).toLowerCase(), orden.direccion);
      });
    }

    return resultado;
  }, [registros, busqueda, orden, config.columnas]);

  // Paginación
  const totalPaginas = Math.ceil(registrosFiltrados.length / tamanoPagina) || 1;
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const registrosPagina = registrosFiltrados.slice(
    (paginaSegura - 1) * tamanoPagina,
    paginaSegura * tamanoPagina
  );

  const handleOrdenar = useCallback((campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc',
    }));
    setPaginaActual(1);
  }, []);

  const handleCambioPagina = useCallback((nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  }, [totalPaginas]);

  // Reset página al cambiar búsqueda
  useState(() => {
    if (busqueda) setPaginaActual(1);
  });

  if (cargando) {
    return <p className="estado-texto">Cargando {config.titulo.toLowerCase()}...</p>;
  }

  if (error) {
    return (
      <div className="mensaje mensaje-error" role="alert">
        No se pudo cargar la lista de {config.titulo.toLowerCase()}. {error}.
        <button type="button" className="btn btn-suave btn-chico" onClick={onReintentar}>Reintentar</button>
      </div>
    );
  }

  if (registros.length === 0) {
    return (
      <div className="vacio">
        <p>Aún no hay {config.titulo.toLowerCase()} registrados. Usa el formulario de arriba para agregar el primero.</p>
      </div>
    );
  }

  // Determinar columnas ordenables (excluir imagen, acciones, badges complejos)
  const columnasOrdenables = config.columnas.filter(
    (c) => !['imagen', 'estado-interactivo', 'productos'].includes(c.tipo)
  );

  return (
    <div className="panel">
      <div className="tabla-encabezado">
        <h3 className="panel-titulo">Lista de {config.titulo.toLowerCase()}</h3>
        <div className="tabla-controles">
          <div className="buscador">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="buscador-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="input buscador-input"
              placeholder={`Buscar ${config.titulo.toLowerCase()}...`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label={`Buscar ${config.titulo.toLowerCase()}`}
            />
          </div>
          <span className="contador">
            {registrosFiltrados.length} de {registros.length} registro(s)
          </span>
        </div>
      </div>

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              {config.columnas.map((col) => (
                <th
                  key={col.campo}
                  className={columnasOrdenables.some((c) => c.campo === col.campo) ? 'ordenable' : ''}
                  onClick={() => columnasOrdenables.some((c) => c.campo === col.campo) && handleOrdenar(col.campo)}
                  aria-sort={orden.campo === col.campo ? (orden.direccion === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <span className="th-contenido">
                    {col.titulo}
                    {orden.campo === col.campo && (
                      <span className="orden-icon" aria-hidden="true">
                        {orden.direccion === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              <th className="derecha">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registrosPagina.length === 0 ? (
              <tr>
                <td colSpan={config.columnas.length + 2} className="texto-suave texto-centrado">
                  No se encontraron resultados para "{busqueda}"
                </td>
              </tr>
            ) : (
              registrosPagina.map((fila) => (
                <tr key={fila.id}>
                  <td className="texto-suave" data-label="ID">#{fila.id}</td>
                  {config.columnas.map((col) => (
                    <td key={col.campo} data-label={col.titulo}>
                      <Celda
                        columna={col}
                        fila={fila}
                        onActualizarEstado={onActualizarEstado}
                        opcionesEstados={opcionesEstados}
                      />
                    </td>
                  ))}
                  <td className="derecha acciones">
                    <button type="button" className="btn btn-suave btn-chico" onClick={() => onEditar(fila)}>Editar</button>
                    <button type="button" className="btn btn-peligro btn-chico" onClick={() => onEliminar(fila)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <nav className="paginacion" aria-label="Paginación de registros">
          <button
            type="button"
            className="btn btn-suave btn-chico"
            onClick={() => handleCambioPagina(paginaSegura - 1)}
            disabled={paginaSegura === 1}
            aria-label="Página anterior"
          >
            ‹ Anterior
          </button>
          <span className="paginacion-info" aria-live="polite">
            Página {paginaSegura} de {totalPaginas}
          </span>
          <button
            type="button"
            className="btn btn-suave btn-chico"
            onClick={() => handleCambioPagina(paginaSegura + 1)}
            disabled={paginaSegura === totalPaginas}
            aria-label="Página siguiente"
          >
            Siguiente ›
          </button>
        </nav>
      )}
    </div>
  );
}
