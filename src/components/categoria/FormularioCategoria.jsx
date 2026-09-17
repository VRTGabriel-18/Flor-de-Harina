import { useState, useEffect } from 'react';

export function FormularioCategoria({ categoriaAEditar, onGuardar, onCancelar, guardando }) {
  const initialFormState = {
    nombre: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (categoriaAEditar) {
      setFormData({
        nombre: categoriaAEditar.nombre || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [categoriaAEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa el nombre de la categoría.');
      return;
    }
    onGuardar(formData);
  };

  const esEdicion = Boolean(categoriaAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Categoría' : '➕ Registrar Nueva Categoría'}
        </h3>
        <p className="form-subtitle">
          {esEdicion ? 'Modifica el nombre de la categoría seleccionada' : 'Ingresa el nombre para agregar una categoría al menú'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre de la Categoría *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-input"
            placeholder="Ej. Postres"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </button>

          {esEdicion && (
            <button type="button" className="btn-cancel" onClick={onCancelar} disabled={guardando}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}