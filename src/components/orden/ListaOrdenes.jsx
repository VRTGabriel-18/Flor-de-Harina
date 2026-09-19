import { useEffect, useState } from 'react';

export function ListaOrdenes({ reloadTrigger }) {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarOrdenes = async () => {
    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/ordenes');
      const data = await res.json();
      setOrdenes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, [reloadTrigger]);

  if (cargando) return <p>Cargando órdenes...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
      {ordenes.map((o) => (
        <div key={o.id} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #8B5A2B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#3E2723' }}>Órden #{o.id} - {o.cliente}</h4>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#8B5A2B' }}>Total: ${o.total}</p>
          <span style={{ fontSize: '0.8rem', backgroundColor: '#FAEDCD', padding: '2px 8px', borderRadius: '4px' }}>{o.estado}</span>
        </div>
      ))}
    </div>
  );
}