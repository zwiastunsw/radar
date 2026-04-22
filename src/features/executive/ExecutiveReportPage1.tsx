import type {
  AreaScore,
  AssessmentMetadata,
  ExecutivePriorityDecision,
  ExecutiveSummaryData,
} from "./executive.types";
import { formatMaturityLevelLabel, formatScore } from "./executive.utils";

interface ExecutiveReportPageProps {
  metadata?: AssessmentMetadata;
  overallScore: number;
  summary: ExecutiveSummaryData;
  areaScores: AreaScore[];
  topDecisions: ExecutivePriorityDecision[];
}

export function ExecutiveReportPage({
  metadata,
  overallScore,
  summary,
  areaScores,
  topDecisions,
}: ExecutiveReportPageProps) {
  const strongest = [...areaScores].sort((a, b) => b.score - a.score).slice(0, 2);
  const weakest = [...areaScores].sort((a, b) => a.score - b.score).slice(0, 2);

  return (
    <article className="mx-auto max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
      <header className="border-b border-[var(--border)] pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Radar dostępności — samoocena dojrzałości
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[var(--text-main)]">
          Raport kierowniczy
        </h1>

        <div className="mt-3 grid gap-2 text-sm text-[var(--text-muted)] md:grid-cols-2">
          <p>
            <span className="font-semibold text-[var(--text-main)]">Organizacja: </span>
            {metadata?.organizationName || "—"}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-main)]">Jednostka: </span>
            {metadata?.unitName || "—"}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-main)]">Data samooceny: </span>
            {metadata?.assessmentDate || "—"}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-main)]">Model: </span>
            15 decyzji
          </p>
        </div>
      </header>

      <section className="mt-5 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-[var(--card-bg-hover)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Wynik ogólny
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">
            {formatMaturityLevelLabel(summary.level)}
          </h2>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Wynik: <strong>{formatScore(overallScore)}</strong> / 3,00
          </p>

          <p className="mt-3 text-sm leading-6 text-[var(--text-main)]">
            {summary.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Następny krok
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-main)]">
            {summary.nextStep}
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] p-4">
          <h2 className="text-base font-semibold text-[var(--text-main)]">
            Najsilniejsze obszary
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-main)]">
            {strongest.map((area) => (
              <li
                key={area.key}
                className="flex items-start justify-between gap-4 rounded-xl bg-[var(--card-bg-hover)] px-3 py-2"
              >
                <span>{area.label}</span>
                <strong>{formatScore(area.score)}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <h2 className="text-base font-semibold text-[var(--text-main)]">
            Najważniejsze ryzyka
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-main)]">
            {weakest.map((area) => (
              <li
                key={area.key}
                className="flex items-start justify-between gap-4 rounded-xl bg-[var(--card-bg-hover)] px-3 py-2"
              >
                <span>{area.label}</span>
                <strong>{formatScore(area.score)}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-[var(--border)] p-4">
        <h2 className="text-base font-semibold text-[var(--text-main)]">
          Trzy decyzje dla kierownictwa
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {topDecisions.map((decision, index) => (
            <div
              key={decision.id}
              className="rounded-2xl bg-[var(--card-bg-hover)] p-4"
            >
              <p className="text-sm font-semibold text-[var(--text-main)]">
                {index + 1}. {decision.executiveTitle}
              </p>

              <p className="mt-2 text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Dlaczego teraz
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                {decision.whyItMatters}
              </p>

              <p className="mt-3 text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Co to zmieni
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                {decision.impact}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}