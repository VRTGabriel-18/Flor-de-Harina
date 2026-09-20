import { useState, useRef, useEffect } from 'react';

const normalizarTexto = (v) => (v === undefined || v === null ? '' : String(v).trim());

function obtenerIconoEstado(nombre = '') {
  const n = nombre.toLowerCase();
  if (n.includes('camino') || n.includes('reparto') || n.includes('entrega') || n.includes('domicilio')) return '🛵';
  if (n.includes('horno') || n.includes('cocina') || n.includes('prepar')) return '🔥';
  if (n.includes('entregad') || n.includes('listo') || n.includes('complet') || n.includes('finaliz')) return '✅';
  if (n.includes('pend') || n.includes('espera') || n.includes('recib')) return '⏳';
  if (n.includes('cancel') || n.includes('anul') || n.includes('rechaz')) return '❌';
  return '🏷️';
}

export function SelectorEstadoBadge({ valor, fila, onCambio, opciones = [] }) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const contenedorRef = useRef(null);

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    function manejarClicFuera(e) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    }
    function manejarTecla(e) {
      if (e.key === 'Escape') setAbierto(false);
    }
    if (abierto) {
      document.addEventListener('mousedown', manejarClicFuera);
      document.addEventListener('keydown', manejarTecla);
    }
    return () => {
      document.removeEventListener('mousedown', manejarClicFuera);
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [abierto]);

  const valorStr = normalizarTexto(valor);

  // Generar lista EXCLUSIVAMENTE a partir de los estados agregados en la sección de Estados
  const listaEstados = (() => {
    const mapa = new Map();

    if (Array.isArray(opciones)) {
      opciones.forEach((op) => {
        const nom = typeof op === 'string' ? op : op?.nombre;
        const nomStr = normalizarTexto(nom);
        // Mostrar si tiene nombre y no está inactivo (si tiene campo estado booleano)
        if (nomStr && op?.estado !== false && !mapa.has(nomStr.toLowerCase())) {
          mapa.set(nomStr.toLowerCase(), {
            id: op.id || nomStr.toLowerCase().replace(/\s+/g, '-'),
            nombre: nomStr,
            icono: obtenerIconoEstado(nomStr),
            desc: op?.descripcion || '',
            color: op?.color || null,
          });
        }
      });
    }

    // Si el valor actual del pedido no está en la lista de estados, incluirlo para no perder visibilidad
    if (valorStr && !mapa.has(valorStr.toLowerCase())) {
      mapa.set(valorStr.toLowerCase(), {
        id: 'actual',
        nombre: valorStr,
        icono: obtenerIconoEstado(valorStr),
        desc: 'Estado actual',
      });
    }

    return Array.from(mapa.values());
  })();

  const estadoActual = listaEstados.find(
    (e) => normalizarTexto(e.nombre).toLowerCase() === valorStr.toLowerCase()
  ) || {
    nombre: valorStr || 'Sin estado',
    icono: obtenerIconoEstado(valorStr),
    desc: '',
  };

  const seleccionar = async (nuevoEstado) => {
    if (nuevoEstado === valorStr) {
      setAbierto(false);
      return;
    }
    setCargando(true);
    try {
      if (onCambio) await onCambio(nuevoEstado);
      setAbierto(false);
    } finally {
      setCargando(false);
    }
  };

  const nombreEstadoStr = normalizarTexto(estadoActual.nombre);
  const claseEstado = nombreEstadoStr.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="selector-estado-contenedor" ref={contenedorRef}>
      <button
        type="button"
        className={`badge-estado-interactivo estado-${claseEstado} ${abierto ? 'abierto' : ''}`}
        onClick={() => setAbierto((prev) => !prev)}
        disabled={cargando}
        title="Haz clic para cambiar el estado"
        aria-haspopup="listbox"
        aria-expanded={abierto}
      >
        <span className="badge-estado-icono">{estadoActual.icono}</span>
        <span className="badge-estado-texto">{nombreEstadoStr || 'Sin estado'}</span>
        <span className="badge-estado-flecha" aria-hidden="true">▾</span>
      </button>

      {abierto && (
        <div className="selector-estado-menu" role="listbox">
          <div className="selector-estado-header">
            <span>⚡ Estados ({listaEstados.length})</span>
          </div>
          <div className="selector-estado-opciones">
            {listaEstados.length === 0 ? (
              <div className="estado-vacio-menu">
                <p className="texto-suave" style={{ padding: '8px', fontSize: '0.82rem' }}>
                  No hay estados registrados en <strong>/estados</strong>.
                </p>
              </div>
            ) : (
              listaEstados.map((op) => {
                const opNombreStr = normalizarTexto(op.nombre);
                const seleccionado = opNombreStr.toLowerCase() === valorStr.toLowerCase();
                const esEnCamino = opNombreStr.toLowerCase().includes('camino');
                return (
                  <button
                    key={op.id}
                    type="button"
                    role="option"
                    aria-selected={seleccionado}
                    className={`selector-estado-opcion ${seleccionado ? 'activa' : ''} ${esEnCamino ? 'opcion-en-camino' : ''}`}
                    onClick={() => seleccionar(op.nombre)}
                  >
                    <span className="opcion-icono">{op.icono}</span>
                    <div className="opcion-info">
                      <span className="opcion-nombre">{op.nombre}</span>
                      {op.desc && <span className="opcion-desc">{op.desc}</span>}
                    </div>
                    {seleccionado && <span className="opcion-check">✓</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
