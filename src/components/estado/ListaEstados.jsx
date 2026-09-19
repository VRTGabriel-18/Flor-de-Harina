import { useEffect, useState } from 'react';

export function ListaEstados({ reloadTrigger }) {
  const [estados, setEstados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarEstados = async () => {
    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/estados');
      const data = await res.json();
      setEstados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar estados:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstados();
  }, [reloadTrigger]);

  if (cargando) return <p>Cargando estados...</p>;

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {estados.map((e) => (
        <span key={e.id} style={{ backgroundColor: '#FAEDCD', color: '#3E2723', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid #D4A373' }}>
          {e.nombre}
        </span>
      ))}
    </div>
  );
}