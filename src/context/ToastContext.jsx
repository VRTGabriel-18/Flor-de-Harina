import { useEffect, useState } from 'react';
import { ToastContext } from './toastContext';

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const temporizador = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(temporizador);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ mostrarToast: setToast }}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.tipo}`} role="status">
          {toast.texto}
        </div>
      )}
    </ToastContext.Provider>
  );
}