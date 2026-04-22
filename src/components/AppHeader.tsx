import React from "react";
import { RadarIcon } from "./RadarIcon";

type AppHeaderProps = {
  answeredCount: number;
  totalQuestions: number;
  showResults: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onShowResults: () => void;
  onExportJson: () => void;
  onImportJsonClick: () => void;
  onGoHome: () => void;
};

export function AppHeader({
  answeredCount,
  totalQuestions,
  showResults,
  theme,
  onToggleTheme,
  onShowResults,
  onExportJson,
  onImportJsonClick,
  onGoHome,
}: AppHeaderProps) {
  const progress =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;


  return (
    <header className="app-header" role="banner">
      <div className="app-header__inner">
        <div className="app-header__top">
          <div className="app-header__brand">
            <button
              type="button"
              className="app-header__brand-button"
              onClick={onGoHome}
              aria-label="Radar dostępności. Idź do ekranu startowego"
            >
<span className="app-header__logo" aria-hidden="true">
  <RadarIcon />
</span>

              <div className="app-header__titles">
                <h1 className="app-header__title">Radar dostępności </h1>
                <p className="app-header__subtitle">
                  Samoocena dojrzałości (model 15 decyzji)
                </p>
              </div>
            </button>
          </div>

          <nav className="app-header__actions" aria-label="Główne działania">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onShowResults}
              aria-pressed={showResults}
            >
              {showResults ? "Pokaż formularz" : "Pokaż wyniki"}
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={onImportJsonClick}
            >
              Import JSON
            </button>

            <button
              type="button"
              className="btn btn--primary"
              onClick={onExportJson}
            >
              Eksport JSON
            </button>
          </nav>
        </div>

        <div className="app-header__bottom">
          <div className="app-progress" aria-label="Postęp wypełnienia formularza">
            <div className="app-progress__labels">
              <span className="app-progress__label">Postęp</span>
              <span className="app-progress__value">
                {answeredCount}/{totalQuestions} ({progress}%)
              </span>
            </div>

            <div
              className="app-progress__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
              aria-valuenow={answeredCount}
              aria-valuetext={`Uzupełniono ${answeredCount} z ${totalQuestions} pytań`}
            >
              <div
                className="app-progress__bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark"
                ? "Przełącz na jasny motyw"
                : "Przełącz na ciemny motyw"
            }
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Jasny motyw" : "Ciemny motyw"}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
            <span className="theme-toggle__text">
              {theme === "dark" ? "Jasny" : "Ciemny"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}