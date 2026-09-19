import { useState } from 'react';

export function FormularioCliente({ onClienteCreado }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const res = await fetch('https://66fa0bc2af25934120ea4a83.mockapi.io/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email })
      });
      if (res.ok) {
        setNombre('');
        setEmail('');
        if (onClienteCreado) onClienteCreado();
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #D4A373' }}>
      <h3 style={{ marginTop: 0, color: '#3E2723' }}>Añadir Cliente</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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