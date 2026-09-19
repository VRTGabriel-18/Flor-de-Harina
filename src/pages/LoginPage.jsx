import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listar } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { RECURSOS } from '../resources';

export function LoginPage() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const { mostrarToast } = useToast();
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setEstado(null);
    setCargando(true);

    try {
      const usuarios = await listar(RECURSOS.usuarios.ruta);
      const usuario = usuarios.find((registro) => registro.nombre === nombre.trim() && registro.clave === clave);

      if (!usuario) {
        mostrarToast({ tipo: 'error', texto: 'El nombre o la clave no son correctos.' });
        setEstado({ tipo: 'error', texto: 'El nombre o la clave no son correctos.' });
        return;
      }

      iniciarSesion(usuario);
      mostrarToast({ tipo: 'ok', texto: `Bienvenido, ${usuario.nombre}.` });
      navigate('/', { replace: true });
    } catch (error) {
      mostrarToast({ tipo: 'error', texto: 'No se pudo consultar el servicio de usuarios.' });
      setEstado({ tipo: 'error', texto: `No se pudo iniciar sesión. ${error.message}.` });
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="gestion">
      <div className="gestion-encabezado">
        <h1>Iniciar sesión</h1>
        <p>Accede con un usuario registrado en Flor de Harina.</p>
      </div>

      {estado && <div className={`mensaje mensaje-${estado.tipo}`} role="alert">{estado.texto}</div>}

      <div className="panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="campo">
              <label htmlFor="login-nombre">Nombre de usuario</label>
              <input
                id="login-nombre"
                className="input"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="campo">
              <label htmlFor="login-clave">Clave</label>
              <input
                id="login-clave"
                className="input"
                type="password"
                value={clave}
                onChange={(evento) => setClave(evento.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="form-acciones">
            <button type="submit" className="btn btn-primario" disabled={cargando}>
              {cargando ? 'Validando...' : 'Iniciar sesión'}
            </button>
            <Link to="/pedido" className="btn btn-suave">
              Continuar como cliente
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}