import type { ExecutiveSummaryData } from "./executive.types";
import { formatMaturityLevelLabel } from "./executive.utils";

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummaryData;
  overallScore: number;
}

export function ExecutiveSummaryCard({
  summary,
  overallScore,
}: ExecutiveSummaryCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Interpretacja dla kierownictwa
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--text-main)]">
            {summary.headline}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {formatMaturityLevelLabel(summary.level)} · wynik ogólny:{" "}
            <strong>{overallScore.toFixed(2).replace(".", ",")}</strong> / 3,00
          </p>
        </div>

        <div className="space-y-3 text-sm leading-6 text-[var(--text-main)]">
          <p>{summary.summary}</p>

          <div className="rounded-2xl bg-[var(--card-bg-hover)] p-4">
            <p className="font-semibold">Co działa</p>
            <p className="mt-1 text-[var(--text-muted)]">{summary.strengthsText}</p>
          </div>

          <div className="rounded-2xl bg-[var(--card-bg-hover)] p-4">
            <p className="font-semibold">Co najbardziej hamuje rozwój</p>
            <p className="mt-1 text-[var(--text-muted)]">{summary.risksText}</p>
          </div>

          <div className="rounded-2xl border border-dashed border-[var(--border)] p-4">
            <p className="font-semibold">Najbliższy krok</p>
            <p className="mt-1 text-[var(--text-muted)]">{summary.nextStep}</p>
          </div>
        </div>
      </div>
    </section>
  );
}