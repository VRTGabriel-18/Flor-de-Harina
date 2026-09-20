import { Link } from 'react-router-dom';

export function Banner() {
  return (
    <section className="banner-artesanal">
      {/* Elementos decorativos de fondo: harina y trigo */}
      <div className="decoracion-harina decoracion-1" aria-hidden="true">🌾</div>
      <div className="decoracion-harina decoracion-2" aria-hidden="true">✨</div>
      <div className="decoracion-harina decoracion-3" aria-hidden="true">🥐</div>

      <div className="banner-hero-grid">
        <div className="banner-hero-texto">
          <div className="banner-badge">
            <span className="banner-badge-icono">🌾</span>
            <span>Flor de Harina | Casa Horneada</span>
          </div>

          <h1 className="banner-titulo">
            ¡El sabor de casa, recién horneado!
          </h1>

          <p className="banner-texto">
            Pasteles hojaldrados con repulgue tradicional, buñuelos esponjosos y pandebonos recién salidos del horno. Amasados con harina seleccionada y el auténtico toque casero cada mañana.
          </p>

          <div className="banner-acciones">
            <a href="#catalogo" className="btn btn-primario btn-hero">
              Explorar pasteles
            </a>
            <Link to="/pedido" className="btn btn-suave btn-hero">
              🛒 Hacer pedido
            </Link>
          </div>

          <div className="banner-metricas">
            <div className="metrica-item">
              <strong>100%</strong>
              <span>Masa Fresca</span>
            </div>
            <div className="metrica-separador" />
            <div className="metrica-item">
              <strong>7:00 AM</strong>
              <span>Primer Horneado</span>
            </div>
            <div className="metrica-separador" />
            <div className="metrica-item">
              <strong>⭐ 4.9</strong>
              <span>Calificación</span>
            </div>
          </div>
        </div>

        <div className="banner-hero-visual">
          <div className="hero-img-marco">
            <img
              src="/hero_pasteles.jpg"
              alt="Flor de Harina — Pasteles artesanales dorados recién horneados"
              className="hero-img-foto"
            />
            <div className="hero-badge-flotante">
              <span className="hero-badge-icono">🔥</span>
              <div>
                <strong>Recién horneados</strong>
                <p>Crujientes por fuera, suaves por dentro</p>
              </div>
            </div>
            <div className="hero-tag-flotante">
              ⭐ 4.9 <span>(500+ reseñas)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pilares artesanales estilo Bodren 01, 02, 03, 04 */}
      <div className="banner-pilares">
        <div className="pilar-card">
          <span className="pilar-numero">01</span>
          <div className="pilar-contenido">
            <h3>Selección de Harina y Trigo</h3>
            <p>Usamos mezclas de harina pura sin conservantes para lograr el hojaldre y textura perfecta.</p>
          </div>
        </div>

        <div className="pilar-card">
          <span className="pilar-numero">02</span>
          <div className="pilar-contenido">
            <h3>Horneado Diario al Alba</h3>
            <p>Comenzamos a hornear desde las 5:00 AM para que siempre disfrutes de productos calientes.</p>
          </div>
        </div>

        <div className="pilar-card">
          <span className="pilar-numero">03</span>
          <div className="pilar-contenido">
            <h3>Auténtico Repulgue y Sabor</h3>
            <p>Pasteles sellados a mano con el repulgue tradicional y rellenos generosos llenos de sabor.</p>
          </div>
        </div>

        <div className="pilar-card">
          <span className="pilar-numero">04</span>
          <div className="pilar-contenido">
            <h3>Hecho con Amor de Casa</h3>
            <p>Cada pieza se elabora artesanalmente preservando recetas de familia transmitidas por generaciones.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
