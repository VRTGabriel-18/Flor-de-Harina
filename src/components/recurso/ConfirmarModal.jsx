import { useEffect, useRef } from 'react';

export function ConfirmarModal({
  abierto,
  titulo = 'Confirmar acción',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'peligro', // 'peligro' | 'primario' | 'advertencia'
  onConfirmar,
  onCancelar,
}) {
  const overlayRef = useRef(null);
  const primerBotonRef = useRef(null);

  // Manejar Escape y focus trap
  useEffect(() => {
    if (!abierto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancelar?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    // Focus en botón cancelar por seguridad (acción menos destructiva)
    setTimeout(() => primerBotonRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  const clasesVariante = {
    peligro: 'modal-peligro',
    primario: 'modal-primario',
    advertencia: 'modal-advertencia',
  };

  return (
    <div
      className={`modal-overlay ${clasesVariante[variante]}`}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      aria-describedby="modal-mensaje"
      onClick={(e) => e.target === overlayRef.current && onCancelar?.()}
    >
      <div className="modal-contenedor">
        <header className="modal-header">
          <h3 id="modal-titulo" className="modal-titulo">{titulo}</h3>
          <button
            type="button"
            className="modal-cerrar"
            onClick={onCancelar}
            aria-label="Cerrar diálogo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <p id="modal-mensaje" className="modal-mensaje">{mensaje}</p>

        <footer className="modal-footer">
          <button
            ref={primerBotonRef}
            type="button"
            className="btn btn-suave"
            onClick={onCancelar}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`btn ${variante === 'peligro' ? 'btn-peligro' : variante === 'advertencia' ? 'btn-advertencia' : 'btn-primario'}`}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </footer>
      </div>
    </div>
  );
}