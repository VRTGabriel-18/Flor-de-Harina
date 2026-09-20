import { useState } from 'react';
import { RECURSOS } from '../../resources';
import { useRecurso } from '../../hooks/useRecurso';
import { crear, actualizar, eliminar } from '../../services/apiService';
import { FormularioRecurso } from './FormularioRecurso';
import { ListaRecurso } from './ListaRecurso';
import { useToast } from '../../hooks/useToast';

export function GestionRecurso({ recurso, onCambio }) {
  const config = RECURSOS[recurso];
  const { mostrarToast } = useToast();
  const { datos, cargando, error, recargar } = useRecurso(config.ruta);
  const { datos: listaEstados } = useRecurso(recurso === 'ordenes' ? RECURSOS.estados.ruta : null);

  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [formKey, setFormKey] = useState(0); // al cambiar, el formulario se vacía

  const refrescar = () => {
    recargar();
    if (onCambio) onCambio(); // avisa a quien dependa de estos datos (ej. el menú de categorías)
  };

  const handleActualizarEstado = async (fila, nuevoEstado) => {
    try {
      const datosActualizados = { ...fila, estado: nuevoEstado };
      await actualizar(config.ruta, fila.id, datosActualizados);
      
      if (nuevoEstado?.toLowerCase() === 'en camino') {
        mostrarToast({
          tipo: 'ok',
          texto: `🛵 ¡Pedido #${fila.id} marcado como "En Camino"! Salió y está siendo entregado exitosamente.`,
        });
      } else {
        mostrarToast({
          tipo: 'ok',
          texto: `Estado de orden #${fila.id} cambiado a "${nuevoEstado}".`,
        });
      }
      refrescar();
    } catch (err) {
      mostrarToast({ tipo: 'error', texto: `No se pudo cambiar el estado. ${err.message}` });
    }
  };

  const handleGuardar = async (datosFormulario) => {
    setGuardando(true);
    setMensaje(null);
    try {
      if (editando) {
        await actualizar(config.ruta, editando.id, datosFormulario);
        mostrarToast({ tipo: 'ok', texto: `${config.singular} actualizado correctamente.` });
        setMensaje({ tipo: 'ok', texto: 'Registro actualizado correctamente.' });
      } else {
        await crear(config.ruta, datosFormulario);
        mostrarToast({ tipo: 'ok', texto: `${config.singular} creado correctamente.` });
        setMensaje({ tipo: 'ok', texto: 'Registro creado correctamente.' });
      }
      setEditando(null);
      setFormKey((k) => k + 1);
      refrescar();
    } catch (err) {
      mostrarToast({ tipo: 'error', texto: `No se pudo guardar ${config.singular.toLowerCase()}.` });
      setMensaje({ tipo: 'error', texto: `No se pudo guardar. ${err.message}.` });
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (fila) => {
    setMensaje(null);
    setEditando(fila);
    window.scrollTo({ top: 0 });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormKey((k) => k + 1);
  };

  const handleEliminar = async (fila) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer.')) return;

    setMensaje(null);
    try {
      await eliminar(config.ruta, fila.id);
      mostrarToast({ tipo: 'ok', texto: `${config.singular} eliminado correctamente.` });
      if (editando && editando.id === fila.id) handleCancelar();
      setMensaje({ tipo: 'ok', texto: 'Registro eliminado correctamente.' });
      refrescar();
    } catch (err) {
      mostrarToast({ tipo: 'error', texto: `No se pudo eliminar ${config.singular.toLowerCase()}.` });
      setMensaje({ tipo: 'error', texto: `No se pudo eliminar. ${err.message}.` });
    }
  };

  return (
    <section className="gestion">
      <div className="gestion-encabezado">
        <h2>{config.icono} Gestión de {config.titulo.toLowerCase()}</h2>
        <p>{config.descripcion}</p>
      </div>

      {mensaje && (
        <div className={`mensaje mensaje-${mensaje.tipo}`} role="status">{mensaje.texto}</div>
      )}

      <FormularioRecurso
        key={`${editando ? editando.id : 'nuevo'}-${formKey}`}
        config={config}
        registro={editando}
        guardando={guardando}
        onGuardar={handleGuardar}
        onCancelar={handleCancelar}
      />

      <ListaRecurso
        config={config}
        registros={datos}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onActualizarEstado={handleActualizarEstado}
        opcionesEstados={listaEstados}
      />
    </section>
  );
}
