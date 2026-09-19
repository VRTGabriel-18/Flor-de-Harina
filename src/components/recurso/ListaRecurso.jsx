import { formatearPrecio } from '../../utils/formato';

const hayValor = (v) => v !== undefined && v !== null && v !== '';

function Celda({ columna, fila }) {
  const valor = fila[columna.campo];

  if (columna.tipo === 'imagen') {
    return valor
      ? <img src={valor} alt={fila.nombre ?? ''} className="miniatura" loading="lazy" />
      : <span className="miniatura miniatura-vacia" aria-hidden="true">🥐</span>;
  }
  if (columna.tipo === 'precio') return <strong>{formatearPrecio(valor)}</strong>;
  if (columna.tipo === 'badge') {
    return hayValor(valor) ? <span className="badge">{valor}</span> : <span className="texto-suave">—</span>;
  }
  return hayValor(valor) ? String(valor) : <span className="texto-suave">—</span>;
}

export function ListaRecurso({ config, registros, cargando, error, onReintentar, onEditar, onEliminar }) {
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
                  <td key={col.campo} data-label={col.titulo}><Celda columna={col} fila={fila} /></td>
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
