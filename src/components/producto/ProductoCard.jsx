export function ProductoCard({ producto, onAddToCart }) {
  return (
    <div style={{ border: '1px solid #D4A373', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#3E2723' }}>{producto.nombre}</h3>
      <p style={{ margin: '0 0 8px 0', color: '#666' }}>{producto.descripcion}</p>
      <p style={{ fontWeight: 'bold', color: '#8B5A2B' }}>${producto.precio}</p>
      {onAddToCart && (
        <button onClick={() => onAddToCart(producto)} style={{ backgroundColor: '#8B5A2B', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          Agregar
        </button>
      )}
    </div>
  );
}