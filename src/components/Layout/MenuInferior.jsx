export function MenuInferior({ categorias = [], setCategoriaActiva }) {
    const listaCategorias = categorias.filter(cat => (cat.nombre || cat.label) !== "Inicio");

    return (
        <>
        <div className="footer-column">
              <h4 className="footer-heading">Categorías</h4>
              <ul className="footer-list">
                {listaCategorias.map((cat) => {
                    const nombreCat = cat.nombre || cat.label;
                    return (
                        <li key={cat.id}>
                            <button onClick={() => setCategoriaActiva(nombreCat)}>
                                {nombreCat}
                            </button>
                        </li>
                    );
                })}
              </ul>
            </div>
        </>
    );
}


    