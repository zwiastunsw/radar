import type { ExecutivePriorityDecision } from "./executive.types";

interface TopExecutiveDecisionsProps {
  decisions: ExecutivePriorityDecision[];
}

function getTimeframeLabel(value: ExecutivePriorityDecision["timeframe"]) {
  switch (value) {
    case "teraz":
      return "Teraz";
    case "najblizsze_miesiace":
      return "Najbliższe miesiące";
    case "utrwalic":
      return "Utrwalić";
    default:
      return "";
  }
}

export function TopExecutiveDecisions({
  decisions,
}: TopExecutiveDecisionsProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Priorytety kierownicze
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--text-main)]">
          3 najważniejsze decyzje dla kierownictwa
        </h2>
      </div>

      <div className="space-y-4">
        {decisions.map((decision, index) => (
          <article
            key={decision.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg-hover)] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--border)] px-2 text-xs font-semibold">
                {index + 1}
              </span>
              <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text-muted)]">
                {decision.areaLabel}
              </span>
              <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text-muted)]">
                {getTimeframeLabel(decision.timeframe)}
              </span>
            </div>

            <h3 className="mt-3 text-base font-semibold text-[var(--text-main)]">
              {decision.executiveTitle}
            </h3>

            <div className="mt-3 space-y-2 text-sm leading-6">
              <p>
                <span className="font-semibold">Dlaczego teraz: </span>
                <span className="text-[var(--text-muted)]">
                  {decision.whyItMatters}
                </span>
              </p>
              <p>
                <span className="font-semibold">Co to zmieni: </span>
                <span className="text-[var(--text-muted)]">{decision.impact}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}