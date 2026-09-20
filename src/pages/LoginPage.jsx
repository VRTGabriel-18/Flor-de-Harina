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
    <section className="login-page">
      <div className="login-card">
        <button type="button" className="login-close" aria-label="Cerrar" onClick={() => navigate('/')}>
          ×
        </button>

        <div className="login-header">
          <span className="login-logo-icon" aria-hidden="true">🥐</span>
          <h1>Iniciar Sesión</h1>
          <p className="login-subtitulo">Accede al panel de Flor de Harina</p>
        </div>

        {estado && <div className={`mensaje mensaje-${estado.tipo}`} role="alert">{estado.texto}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-nombre">Email</label>
            <div className="login-input-wrap">
              <input
                id="login-nombre"
                className="login-input"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                required
                autoComplete="username"
              />
              <span className="login-input-icon" aria-hidden="true">✉</span>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-clave">Password</label>
            <div className="login-input-wrap">
              <input
                id="login-clave"
                className="login-input"
                type="password"
                value={clave}
                onChange={(evento) => setClave(evento.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="login-input-icon" aria-hidden="true">◌</span>
            </div>
          </div>

          <div className="login-options">
            <label className="login-check">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <Link to="/login" className="login-forgot">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={cargando}>
            {cargando ? 'Validando...' : 'Login'}
          </button>

          <div className="login-secondary-row">
            <Link to="/pedido" className="login-customer-btn">
              Ingresar como cliente
            </Link>
          </div>

          <p className="login-register">
            Don&apos;t have an account? <Link to="/pedido">Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
}