import { GestionCategorias } from '../components/categoria/GestionCategorias';

export function CategoriasPage({ categorias, onActualizarCategorias, cargando }) {
  return (
    <GestionCategorias
      categorias={categorias}
      onActualizarCategorias={onActualizarCategorias}
      cargando={cargando}
    />
  );
}
