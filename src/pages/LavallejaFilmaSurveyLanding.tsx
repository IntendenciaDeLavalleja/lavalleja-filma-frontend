import SpaLink from "../components/SpaLink";
import FontSizeToggle from "../components/FontSizeToggle";
import ThemeToggle from "../components/ThemeToggle";

export default function LavallejaFilmaSurveyLanding() {
  return (
    <div className="lf-page lf-grain">
      <header className="lf-page-header">
        <div className="lf-page-brand">
          <SpaLink
            className="lf-page-brand-logo"
            href="/"
            aria-label="Ir al inicio de Lavalleja Filma"
          >
            <img src="/Logo.png" alt="Lavalleja Filma" />
          </SpaLink>
          <span className="lf-chip">Convocatoria abierta</span>
        </div>
        <div className="lf-page-header-actions">
          <FontSizeToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="lf-page-main lf-landing-main">
        <section className="lf-page-hero lf-card">
          <span className="lf-chip lf-page-hero-chip">Próximamente</span>
          <h1 className="lf-page-title">Lavalleja Filma</h1>
          <p className="lf-page-description">
            Estamos reuniendo a quienes pueden hacer posible un rodaje en Lavalleja:
            servicios, proveedores, profesionales, técnicos y colaboradores locales.
            Si podés aportar a una producción audiovisual, este es el momento de
            sumarte al futuro directorio de Lavalleja Filma.
          </p>
        </section>

        <section className="lf-landing-grid">
          <article className="lf-card lf-landing-card">
            <span className="lf-chip">Servicios y apoyo a rodajes</span>
            <h2 className="lf-landing-card-title">Proveedores y servicios</h2>
            <p className="lf-landing-card-text">
              Registrá tu empresa, comercio, emprendimiento o servicio para que las
              productoras puedan encontrarte cuando necesiten logística, alojamiento,
              gastronomía, suministros, infraestructura u otros apoyos en territorio.
            </p>
            <SpaLink className="lf-btn lf-btn-primary" href="/provider.html">
              ¿Sos proveedor?
            </SpaLink>
          </article>

          <article className="lf-card lf-landing-card">
            <span className="lf-chip">Talento audiovisual local</span>
            <h2 className="lf-landing-card-title">Profesionales y técnicos</h2>
            <p className="lf-landing-card-text">
              Sumate al directorio si tenés experiencia, formación o interés en
              producción, cámara, sonido, arte, edición, actuación, fotografía,
              drones, figuración u otras áreas vinculadas al audiovisual.
            </p>
            <SpaLink className="lf-btn lf-btn-ghost" href="/professional.html">
              ¿Sos profesional o técnico?
            </SpaLink>
          </article>
        </section>
      </main>

      <footer className="lf-footer">
        <p className="lf-footer-brand">Lavalleja Filma</p>
        <p className="lf-footer-text">Intendencia Departamental de Lavalleja</p>
        <p className="lf-footer-contact">
          Contacto: <a href="mailto:filma@lavalleja.uy">filma@lavalleja.uy</a>
        </p>
      </footer>
    </div>
  );
}
