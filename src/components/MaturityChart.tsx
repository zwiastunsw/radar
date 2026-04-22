import type { AssessmentModel } from "../types";
import { getMaturityLabel } from "../utils/scoring";

type ChartItem = {
  id: string;
  label: string;
  score: number;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(4, score));
}

function formatRange(min: number, max: number) {
  return `${min.toFixed(2).replace(".", ",")}–${max
    .toFixed(2)
    .replace(".", ",")}`;
}

function getLevelKey(score: number) {
  if (score < 1.5) return "critical";
  if (score < 2.5) return "weak";
  if (score < 3.5) return "partial";
  return "mature";
}

function getBarStyle(score: number, isOverall: boolean) {
  const level = getLevelKey(score);

  const base =
    level === "critical"
      ? {
          backgroundColor: "var(--maturity-critical)",
          boxShadow: "none",
        }
      : level === "weak"
      ? {
          backgroundColor: "var(--maturity-weak)",
          boxShadow: "none",
        }
      : level === "partial"
      ? {
          backgroundColor: "var(--maturity-partial)",
          boxShadow: "none",
        }
      : {
          backgroundColor: "var(--maturity-mature)",
          boxShadow: "none",
        };

  if (!isOverall) return base;

  return {
    ...base,
    boxShadow: "0 0 0 2px var(--maturity-overall-ring) inset",
  };
}

function getLegendStyle(level: "critical" | "weak" | "partial" | "mature") {
  switch (level) {
    case "critical":
      return {
        backgroundColor: "var(--maturity-critical-soft)",
        borderColor: "var(--maturity-critical)",
      };
    case "weak":
      return {
        backgroundColor: "var(--maturity-weak-soft)",
        borderColor: "var(--maturity-weak)",
      };
    case "partial":
      return {
        backgroundColor: "var(--maturity-partial-soft)",
        borderColor: "var(--maturity-partial)",
      };
    case "mature":
      return {
        backgroundColor: "var(--maturity-mature-soft)",
        borderColor: "var(--maturity-mature)",
      };
  }
}

function getLegendTone(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("początk")) return "critical";
  if (normalized.includes("porządk")) return "weak";
  if (normalized.includes("integr")) return "partial";
  return "mature";
}

export function MaturityChart({
  title = "Poziom dojrzałości według wymiarów",
  subtitle = "Skala 0–4",
  items,
  overallScore,
  model,
}: {
  title?: string;
  subtitle?: string;
  items: ChartItem[];
  overallScore: number;
  model: AssessmentModel;
}) {
  const allItems: ChartItem[] = [
    ...items,
    {
      id: "overall",
      label: "Poziom ogólny",
      score: overallScore,
    },
  ];

  const thresholds = model.scoring.dimension_thresholds ?? [];

  return (
    <section
      aria-labelledby="maturity-chart-title"
      className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-sm"
    >
      <div className="mb-4">
        <h2
          id="maturity-chart-title"
          className="text-lg font-semibold tracking-tight text-[var(--text-main)]"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
      </div>

      <div
        className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Legenda poziomów dojrzałości"
      >
        {thresholds.map((threshold) => {
          const tone = getLegendTone(threshold.label);

          return (
            <div
              key={`${threshold.min}-${threshold.max}-${threshold.label}`}
              className="rounded-xl border px-3 py-2 text-xs text-[var(--text-main)]"
              style={getLegendStyle(tone)}
            >
              {formatRange(threshold.min, threshold.max)}: {threshold.label}
            </div>
          );
        })}
      </div>

      <div className="space-y-4" role="list" aria-label="Wykres poziomów dojrzałości">
        {allItems.map((item) => {
          const score = clampScore(item.score);
          const width = `${(score / 4) * 100}%`;
          const level = getMaturityLabel(score, model);
          const isOverall = item.id === "overall";

          return (
            <div
              key={item.id}
              role="listitem"
              className="grid gap-2 md:grid-cols-[220px_1fr_140px] md:items-center"
            >
              <div
                className={
                  isOverall
                    ? "font-semibold text-[var(--text-main)]"
                    : "text-[var(--text-main)]"
                }
              >
                {item.label}
              </div>

              <div>
                <div
                  className="h-4 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--maturity-track)" }}
                  aria-hidden="true"
                >
                  <div
                    className="h-4 rounded-full transition-all duration-300"
                    style={{
                      width,
                      ...getBarStyle(score, isOverall),
                    }}
                  />
                </div>

                <div
                  className="mt-1 flex justify-between text-[11px] text-[var(--text-muted)]"
                  aria-hidden="true"
                >
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                </div>
              </div>

              <div className="text-sm text-[var(--text-main)] md:text-right">
                <span className="font-semibold">{score.toFixed(1)}</span>
                <span className="ml-2 text-[var(--text-muted)]">{level}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sr-only" aria-live="polite">
        Wykres pokazuje poziom dojrzałości dla {items.length} wymiarów oraz poziom ogólny.
      </div>
    </section>
  );
}