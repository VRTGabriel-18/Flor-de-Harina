import { nombresDeCategorias } from '../../utils/categorias';

export function Menu({ categorias = [], categoriaActiva, onSelectCategoria }) {
  const nombres = ['Todos', ...nombresDeCategorias(categorias)];

  return (
    <nav className="menu-categorias" aria-label="Categorías del catálogo">
      <div className="menu-categorias-inner">
        {nombres.map((nombre) => (
          <button
            type="button"
            key={nombre}
            className={`pildora${categoriaActiva === nombre ? ' activa' : ''}`}
            aria-pressed={categoriaActiva === nombre}
            onClick={() => onSelectCategoria(nombre)}
          >
            {nombre}
          </button>
        ))}
      </div>
    </nav>
  );
}
