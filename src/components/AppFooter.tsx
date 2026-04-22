import logoSygnet from "../assets/logo-sygnet.svg";
import { AccessibleAppIcon } from "../components/AccessibleAppIcon";

type AppFooterProps = {
  version?: string;
};

export function AppFooter({ version = "v1.0" }: AppFooterProps) {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        {/* oznaczenie dostępności */}
        <div
          className="app-footer__accessibility"
          aria-label="Oznaczenie dostępności aplikacji"
        >
          <AccessibleAppIcon
            className="app-footer__accessibility-icon text-[var(--text-main)]"
            size={28}
            title="Aplikacja dostępna cyfrowo"
          />

          <div className="app-footer__accessibility-text">
            <strong>Aplikacja dostępna cyfrowo</strong>
          </div>
        </div>

        {/* blok produktu */}
        <div className="app-footer__product">
          <img
            src={logoSygnet}
            alt=""
            className="app-footer__logo"
            width={36}
            height={36}
            aria-hidden="true"
          />

          <div className="app-footer__product-text">
            <span className="app-footer__product-name">
              Radar dostępności • {version}
            </span>

            <span className="app-footer__product-meta">
              © LepszyWeb.pl
            </span>

            <a
              href="https://lepszyweb.pl"
              target="_blank"
              rel="noreferrer"
              className="app-footer__link"
            >
              www.lepszyweb.pl
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}