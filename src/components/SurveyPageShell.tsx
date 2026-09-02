import type { ReactNode } from "react";
import SpaLink from "./SpaLink";
import FontSizeToggle from "./FontSizeToggle";
import ThemeToggle from "./ThemeToggle";

interface SurveyPageShellProps {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}

export default function SurveyPageShell({
  title,
  description,
  backHref,
  backLabel,
  children,
}: SurveyPageShellProps) {
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
          <SpaLink className="lf-btn lf-btn-ghost lf-page-backlink" href={backHref}>
            {backLabel}
          </SpaLink>
        </div>
      </header>

      <main className="lf-page-main">
        <section className="lf-page-hero lf-card">
          <span className="lf-chip lf-page-hero-chip">Próximamente</span>
          <h1 className="lf-page-title">{title}</h1>
          <p className="lf-page-description">{description}</p>
        </section>

        <section className="lf-page-content lf-form-container">
          <div className="lf-form-card">{children}</div>
        </section>
      </main>

      <footer className="lf-footer">
        <p className="lf-footer-brand">Lavalleja Filma</p>
        <p className="lf-footer-text">Intendencia Departamental de Lavalleja</p>
        <p className="lf-footer-contact">
          Contacto: <a href="mailto:lavallejafilma@lavalleja.uy">lavallejafilma@lavalleja.uy</a>
        </p>
      </footer>
    </div>
  );
}
