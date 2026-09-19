import { useState } from 'react';

export function FormularioEstado({ onEstadoCreado }) {
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/estados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
      if (res.ok) {
        setNombre('');
        if (onEstadoCreado) onEstadoCreado();
      }
    } catch (error) {
      console.error('Error al crear estado:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #D4A373' }}>
      <h3 style={{ marginTop: 0, color: '#3E2723' }}>Añadir Estado de Orden</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nombre del estado (ej. Pendiente, En Preparación)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }}
        />
        <button type="submit" style={{ backgroundColor: '#8B5A2B', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Guardar
        </button>
      </div>
    </form>
  );
}