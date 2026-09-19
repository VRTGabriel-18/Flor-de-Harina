import { MenuInferior } from "./MenuInferior";

export function Footer({ categorias = [], setCategoriaActiva }) {

    return (
        <>
        <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <span className="brand-name">Flor de Harina</span>
            </div>
            <p className="footer-description">
              Pastelería artesanal colombiana: horneados y fritos hechos como en casa, con masa fresca todos los días.
            </p>
          </div>

          <div className="footer-links-group">
            <MenuInferior categorias={categorias} setCategoriaActiva={setCategoriaActiva}/>

            <div className="footer-column">
              <h4 className="footer-heading">Contacto & Horarios</h4>
              <p className="footer-info">📍 Cll 32 #2E - 35 La Cordialidad, Los Patios, Norte de Santander</p>
              <p className="footer-info">🕒 Lunes a Domingo: 7:00 AM - 7:00 PM</p>
              <p className="footer-info">📞 +57 320 458 6532</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Flor de Harina Casa Horneada. Todos los derechos reservados.</p>
        </div>
      </footer>
        </>
    );
}