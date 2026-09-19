import { useState, useEffect, useCallback } from 'react';
import { listar } from '../services/apiService';

// Carga la lista de un recurso del MockAPI.
// Devuelve { datos, cargando, error, recargar }.
export function useRecurso(ruta) {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState({ ruta: null, datos: [], error: null });

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let activo = true;

    listar(ruta)
      .then((datos) => {
        if (activo) setResultado({ ruta, datos: Array.isArray(datos) ? datos : [], error: null });
      })
      .catch((err) => {
        if (activo) setResultado({ ruta, datos: [], error: err.message });
      });

    return () => {
      activo = false;
    };
  }, [ruta, version]);

  return {
    datos: resultado.datos,
    cargando: resultado.ruta !== ruta,
    error: resultado.error,
    recargar,
  };
}
