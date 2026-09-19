export function Menu({categorias, onSelectCategoria, categoriaActiva}) {
    return (
        <>
            <nav className="nav-categories">
            {categorias.map((cat) => {
                const nombreCat = cat.nombre || cat.label;
                return (
                    <button
                        key={cat.id}
                        className={`category-pill ${categoriaActiva === nombreCat ? 'active' : ''}`}
                        onClick={() => onSelectCategoria(nombreCat)}
                    >
                        {nombreCat}
                    </button>
                );
            })}
            </nav>
        </>
    );
}


    