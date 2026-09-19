// "Todos" siempre existe en el menú; si la API trae una categoría "Todos" o "Inicio" se omite para no duplicarla.
export const nombresDeCategorias = (categorias) =>
  categorias
    .map((c) => c.nombre)
    .filter((n) => n && !['todos', 'inicio'].includes(n.toLowerCase()));
