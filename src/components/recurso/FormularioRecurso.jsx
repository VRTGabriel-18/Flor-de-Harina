import { useState } from 'react';
import { RECURSOS } from '../../resources';
import { useRecurso } from '../../hooks/useRecurso';

// Convierte el valor guardado en la API al texto que muestra el input.
// En campos numéricos deja solo dígitos ("$3.500" -> "3500").
const valorInicial = (campo, registro) => {
  const valor = registro?.[campo.name];
  if (valor === undefined || valor === null) return '';
  return campo.tipo === 'number' ? String(valor).replace(/[^\d]/g, '') : String(valor);
};

function OpcionesSelect({ campo, opciones, valor, onChange, cargando = false }) {
  // Si el registro editado tiene un valor que ya no está en la lista, se conserva para no perderlo.
  const lista = valor && !opciones.includes(valor) ? [valor, ...opciones] : opciones;
  const vacio = cargando
    ? 'Cargando opciones...'
    : lista.length > 0
      ? 'Selecciona una opción'
      : `Primero registra datos en ${RECURSOS[campo.origen]?.titulo ?? 'la lista'}`;

  return (
    <select
      id={campo.name}
      name={campo.name}
      className="input"
      value={valor}
      onChange={onChange}
      required={campo.requerido}
      disabled={cargando}
    >
      <option value="">{vacio}</option>
      {lista.map((opcion) => (
        <option key={opcion} value={opcion}>{opcion}</option>
      ))}
    </select>
  );
}

// Opciones tomadas de otro recurso de la API (ej. categorías, clientes, estados).
function SelectOrigen({ campo, valor, onChange }) {
  const { datos, cargando } = useRecurso(RECURSOS[campo.origen].ruta);
  const opciones = Array.from(new Set(datos.map((d) => d.nombre).filter(Boolean)));
  return <OpcionesSelect campo={campo} opciones={opciones} valor={valor} onChange={onChange} cargando={cargando} />;
}

function CampoSelect({ campo, valor, onChange }) {
  return campo.origen
    ? <SelectOrigen campo={campo} valor={valor} onChange={onChange} />
    : <OpcionesSelect campo={campo} opciones={campo.opciones ?? []} valor={valor} onChange={onChange} />;
}

export function FormularioRecurso({ config, registro, guardando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() =>
    Object.fromEntries(config.campos.map((c) => [c.name, valorInicial(c, registro)]))
  );
  const [aviso, setAviso] = useState('');
  const esEdicion = Boolean(registro);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const faltantes = config.campos.filter((c) => c.requerido && !valores[c.name].trim());
    if (faltantes.length > 0) {
      setAviso(`Completa: ${faltantes.map((c) => c.label).join(', ')}.`);
      return;
    }

    setAviso('');
    const datos = {};
    config.campos.forEach((c) => {
      const texto = valores[c.name].trim();
      datos[c.name] = c.tipo === 'number' && texto !== '' ? Number(texto) : texto;
    });
    onGuardar(datos);
  };

  return (
    <div className="panel">
      <h3 className="panel-titulo">
        {esEdicion ? `✏️ Editar ${config.singular.toLowerCase()}` : `➕ Registrar ${config.singular.toLowerCase()}`}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {config.campos.map((c) => (
            <div key={c.name} className={`campo${c.completo ? ' campo-completo' : ''}`}>
              <label htmlFor={c.name}>{c.label}{c.requerido && ' *'}</label>

              {c.tipo === 'select' ? (
                <CampoSelect campo={c} valor={valores[c.name]} onChange={handleChange} />
              ) : c.tipo === 'textarea' ? (
                <textarea
                  id={c.name}
                  name={c.name}
                  className="input"
                  rows="3"
                  required={c.requerido}
                  placeholder={c.placeholder}
                  value={valores[c.name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  id={c.name}
                  name={c.name}
                  type={c.tipo}
                  className="input"
                  required={c.requerido}
                  placeholder={c.placeholder}
                  min={c.tipo === 'number' ? '0' : undefined}
                  value={valores[c.name]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        {aviso && <p className="aviso-form" role="alert">{aviso}</p>}

        <div className="form-acciones">
          <button type="submit" className="btn btn-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : `Registrar ${config.singular.toLowerCase()}`}
          </button>
          {esEdicion && (
            <button type="button" className="btn btn-suave" onClick={onCancelar} disabled={guardando}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
