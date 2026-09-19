import { useEffect, useState } from 'react';

export function ListaUsuarios({ reloadTrigger }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/usuarios');
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [reloadTrigger]);

  if (cargando) return <p>Cargando usuarios...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {usuarios.map((u) => (
        <div key={u.id} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D4A373', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#3E2723' }}>{u.nombre}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#8B5A2B', fontWeight: 'bold' }}>Rol: {u.rol}</p>
        </div>
      ))}
    </div>
  );
}