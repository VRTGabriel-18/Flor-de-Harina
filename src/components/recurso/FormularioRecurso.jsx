import { useState } from 'react';
import { RECURSOS } from '../../resources';
import { useRecurso } from '../../hooks/useRecurso';

// Convierte el valor guardado en la API al texto que muestra el input.
// En campos numéricos deja solo dígitos ("$3.500" -> "3500").
const valorInicial = (campo, registro) => {
  const valor = registro?.[campo.name];
  if (campo.tipo === 'checkbox') return Boolean(valor);
  if (valor === undefined || valor === null) return '';
  return campo.tipo === 'number' ? String(valor).replace(/[^\d]/g, '') : String(valor);
};

// Filtra el input según el tipo de campo para permitir solo caracteres válidos
const filtrarValor = (tipo, valor) => {
  switch (tipo) {
    case 'number':
      // Solo dígitos
      return valor.replace(/[^\d]/g, '');
    case 'text':
    case 'textarea':
      // Solo letras, números, espacios y puntuación básica (.,-')
      return valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,\-']/g, '');
    case 'tel':
      // Solo dígitos, espacios, +, -, (, )
      return valor.replace(/[^\d\s+\-()]/g, '');
    case 'url':
      // Caracteres válidos para URL
      return valor.replace(/[^\w\-\.\/\:\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]/g, '');
    default:
      return valor;
  }
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

const cantidades = Array.from({ length: 20 }, (_, indice) => indice + 1);

const leerProductosOrden = (valor) => {
  try {
    const productos = JSON.parse(valor || '[]');
    return Array.isArray(productos) && productos.length > 0
      ? productos.map((item) => ({
        producto: String(item.producto ?? ''),
        nombre: item.nombre ?? '',
        cantidad: Number(item.cantidad) || 1,
      }))
      : [{ producto: '', nombre: '', cantidad: 1 }];
  } catch {
    return [{ producto: '', nombre: '', cantidad: 1 }];
  }
};

function ProductosOrden({ campo, valor, onChange }) {
  const { datos: productos, cargando } = useRecurso(RECURSOS.productos.ruta);
  const [lineas, setLineas] = useState(() => leerProductosOrden(valor));

  const actualizar = (nuevasLineas) => {
    setLineas(nuevasLineas);
    onChange({ target: { name: campo.name, value: JSON.stringify(nuevasLineas) } });
  };

  const cambiarLinea = (indice, propiedad, nuevoValor) => {
    const nuevasLineas = lineas.map((linea, posicion) => {
      if (posicion !== indice) return linea;
      if (propiedad === 'producto') {
        const producto = productos.find((item) => String(item.id) === nuevoValor);
        return { ...linea, producto: nuevoValor, nombre: producto?.nombre ?? linea.nombre };
      }
      return { ...linea, [propiedad]: Number(nuevoValor) };
    });
    actualizar(nuevasLineas);
  };

  const quitarLinea = (indice) => {
    const nuevasLineas = lineas.filter((_, posicion) => posicion !== indice);
    actualizar(nuevasLineas);
  };

  return (
    <div className="productos-orden">
      {lineas.map((linea, indice) => (
        <div className="producto-orden-fila" key={`${indice}-${linea.producto}`}>
          <select
            className="input"
            aria-label={`Producto ${indice + 1}`}
            value={linea.producto}
            onChange={(evento) => cambiarLinea(indice, 'producto', evento.target.value)}
            disabled={cargando}
            required
          >
            <option value="">{cargando ? 'Cargando productos...' : 'Selecciona un producto'}</option>
            {linea.producto && !productos.some((producto) => String(producto.id) === linea.producto) && (
              <option value={linea.producto}>{linea.nombre || linea.producto}</option>
            )}
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>{producto.nombre}</option>
            ))}
          </select>

          <select
            className="input producto-orden-cantidad"
            aria-label={`Cantidad del producto ${indice + 1}`}
            value={linea.cantidad}
            onChange={(evento) => cambiarLinea(indice, 'cantidad', evento.target.value)}
          >
            {cantidades.map((cantidad) => <option key={cantidad} value={cantidad}>{cantidad}</option>)}
          </select>

          <button type="button" className="btn btn-peligro btn-chico" onClick={() => quitarLinea(indice)}>
            Quitar
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-suave btn-chico"
        onClick={() => actualizar([...lineas, { producto: '', nombre: '', cantidad: 1 }])}
      >
        + Agregar producto
      </button>
    </div>
  );
}

export function FormularioRecurso({ config, registro, guardando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() =>
    Object.fromEntries(config.campos.map((c) => [c.name, valorInicial(c, registro)]))
  );
  const [aviso, setAviso] = useState('');
  const esEdicion = Boolean(registro);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const campo = config.campos.find((item) => item.name === name);
    
    if (campo?.tipo === 'checkbox') {
      setValores((prev) => ({ ...prev, [name]: e.target.checked }));
      return;
    }

    // Filtrar el valor según el tipo de campo
    const valorFiltrado = filtrarValor(campo?.tipo || type, value);
    setValores((prev) => ({ ...prev, [name]: valorFiltrado }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const faltantes = config.campos.filter((c) => {
      if (!c.requerido) return false;
      if (c.tipo === 'productos-orden') {
        try {
          return !JSON.parse(valores[c.name] || '[]').some((producto) => producto.producto);
        } catch {
          return true;
        }
      }
      return !String(valores[c.name]).trim();
    });
    if (faltantes.length > 0) {
      setAviso(`Completa: ${faltantes.map((c) => c.label).join(', ')}.`);
      return;
    }

    setAviso('');
    const datos = {};
    config.campos.forEach((c) => {
      if (c.tipo === 'checkbox') {
        datos[c.name] = Boolean(valores[c.name]);
        return;
      }
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
              ) : c.tipo === 'productos-orden' ? (
                <ProductosOrden campo={c} valor={valores[c.name]} onChange={handleChange} />
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
              ) : c.tipo === 'checkbox' ? (
                <label className="campo-checkbox">
                  <input
                    id={c.name}
                    name={c.name}
                    type="checkbox"
                    checked={Boolean(valores[c.name])}
                    onChange={handleChange}
                  />
                  <span>{c.label}</span>
                </label>
              ) : (
                <input
                  id={c.name}
                  name={c.name}
                  type={c.tipo}
                  className="input"
                  required={c.requerido}
                  placeholder={c.placeholder}
                  min={c.tipo === 'number' ? '0' : undefined}
                  // Mejorar validación y UX en móviles
                  inputMode={c.tipo === 'number' ? 'numeric' : c.tipo === 'tel' ? 'tel' : c.tipo === 'url' ? 'url' : 'text'}
                  pattern={c.tipo === 'number' ? '[0-9]*' : c.tipo === 'tel' ? '[\d\s+\-()]*' : undefined}
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
