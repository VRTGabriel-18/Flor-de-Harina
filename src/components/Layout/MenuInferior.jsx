import { nombresDeCategorias } from '../../utils/categorias';

export function MenuInferior({ categorias = [], onSelectCategoria }) {
  const nombres = ['Todos', ...nombresDeCategorias(categorias)];

  return (
    <div className="footer-columna">
      <h4 className="footer-titulo">Categorías</h4>
      <ul className="footer-lista">
        {nombres.map((nombre) => (
          <li key={nombre}>
            <button type="button" onClick={() => onSelectCategoria(nombre)}>{nombre}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
