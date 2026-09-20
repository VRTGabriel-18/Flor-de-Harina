import { useEffect, useState } from 'react';
import { ToastContext } from './toastContext';

// Iconos SVG para cada tipo de toast
const iconos = {
  ok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  advertencia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toast-icon">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

// Títulos por defecto según tipo
const titulosPorDefecto = {
  ok: '¡Éxito!',
  error: 'Error',
  advertencia: 'Atención',
  info: 'Información',
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const duracion = toast.duracion ?? 4000;
    const temporizador = window.setTimeout(() => setToast(null), duracion);
    return () => window.clearTimeout(temporizador);
  }, [toast]);

  const mostrarToast = (opciones) => {
    // Permitir llamada simple: mostrarToast('mensaje') o mostrarToast({ texto: 'mensaje' })
    if (typeof opciones === 'string') {
      opciones = { texto: opciones, tipo: 'info' };
    }
    const tipo = opciones.tipo || 'info';
    setToast({
      ...opciones,
      tipo,
      titulo: opciones.titulo ?? titulosPorDefecto[tipo],
      icono: iconos[tipo] || iconos.info,
    });
  };

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.tipo}`} role="status" aria-live="polite">
          <span className="toast-icono">{toast.icono}</span>
          <div className="toast-contenido">
            {toast.titulo && <div className="toast-titulo">{toast.titulo}</div>}
            <div className="toast-mensaje">{toast.texto}</div>
          </div>
          <button
            className="toast-cerrar"
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="toast-cerrar-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}