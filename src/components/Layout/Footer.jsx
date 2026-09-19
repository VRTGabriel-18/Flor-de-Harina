import { Link } from 'react-router-dom';
import { MenuInferior } from './MenuInferior';
import { RECURSOS } from '../../resources';

export function Footer({ categorias = [], onSelectCategoria, informacion }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-marca">
          <p className="marca-nombre">🥐 {informacion?.nombre ?? 'Flor de Harina'}</p>
          <p className="footer-texto">
            {informacion?.descripcion ??
              'Pastelería artesanal colombiana: horneados y fritos hechos como en casa, con masa fresca todos los días.'}
          </p>
        </div>

        <MenuInferior categorias={categorias} onSelectCategoria={onSelectCategoria} />

        <div className="footer-columna">
          <h4 className="footer-titulo">Gestión</h4>
          <ul className="footer-lista">
            {Object.entries(RECURSOS).map(([clave, recurso]) => (
              <li key={clave}><Link to={`/${clave}`}>{recurso.titulo}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-columna">
          <h4 className="footer-titulo">Contacto y horarios</h4>
          <p className="footer-texto">📍 {informacion?.direccion ?? 'Cll 32 #2E - 35 La Cordialidad, Los Patios, Norte de Santander'}</p>
          <p className="footer-texto">🕒 {informacion?.horario ?? 'Lunes a domingo: 7:00 AM - 7:00 PM'}</p>
          <p className="footer-texto">📞 {informacion?.telefono ?? '+57 320 458 6532'}</p>
        </div>
      </div>

      <div className="footer-base">
        <p>© {new Date().getFullYear()} {informacion?.nombre ?? 'Flor de Harina'} Casa Horneada. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
