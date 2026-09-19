import { useState } from 'react';
import { AuthContext } from './authContext';

const CLAVE_SESION = 'flor-de-harina-sesion';

function leerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  const iniciarSesion = (datosUsuario) => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}