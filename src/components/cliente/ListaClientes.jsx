import { useEffect, useState } from 'react';

export function ListaClientes({ reloadTrigger }) {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarClientes = async () => {
    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/clientes');
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [reloadTrigger]);

  if (cargando) return <p>Cargando clientes...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
      {clientes.map((c) => (
        <div key={c.id} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D4A373', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#3E2723' }}>{c.nombre}</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{c.email}</p>
        </div>
      ))}
    </div>
  );
}