import { useState } from 'react';

export function FormularioOrden({ onOrdenCreada }) {
  const [cliente, setCliente] = useState('');
  const [total, setTotal] = useState('');
  const [estado, setEstado] = useState('Pendiente');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cliente.trim() || !total) return;

    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, total: Number(total), estado })
      });
      if (res.ok) {
        setCliente('');
        setTotal('');
        if (onOrdenCreada) onOrdenCreada();
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #D4A373' }}>
      <h3 style={{ marginTop: 0, color: '#3E2723' }}>Registrar Órden</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }}
        />
        <input
          type="number"
          placeholder="Total ($)"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completada">Completada</option>
        </select>
        <button type="submit" style={{ backgroundColor: '#8B5A2B', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Guardar
        </button>
      </div>
    </form>
  );
}