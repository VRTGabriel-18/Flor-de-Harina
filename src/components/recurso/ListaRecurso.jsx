import { formatearPrecio } from '../../utils/formato';
import { SelectorEstadoBadge } from './SelectorEstadoBadge';

const hayValor = (v) => v !== undefined && v !== null && v !== '';

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

  return (
    <div className="panel">
      <div className="tabla-encabezado">
        <h3 className="panel-titulo">Lista de {config.titulo.toLowerCase()}</h3>
        <span className="contador">{registros.length} registro(s)</span>
      </div>

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              {config.columnas.map((col) => <th key={col.campo}>{col.titulo}</th>)}
              <th className="derecha">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((fila) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
