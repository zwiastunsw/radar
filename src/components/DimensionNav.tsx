import type { AnswersState, Dimension, Question } from "../types";
import { cn } from "../utils/scoring";
import { Card, SectionTitle } from "./ui";

function getProgressPercent(answered: number, total: number) {
  if (!total) return 0;
  return Math.round((answered / total) * 100);
}

export function DimensionNav({
  dimensions,
  questionsByDimension,
  activeDimensionId,
  setActiveDimensionId,
  answers,
  dimensionMap,
}: {
  dimensions: Dimension[];
  questionsByDimension: Record<string, Question[]>;
  activeDimensionId: string;
  setActiveDimensionId: (id: string) => void;
  answers: AnswersState;
  dimensionMap: Record<string, Dimension>;
}) {
  return (
    <Card className="sticky top-4 p-4">
      <SectionTitle subtext="Nawigacja po arkuszu">Wymiary</SectionTitle>

      <div className="space-y-2">
        {dimensions.map((dimension) => {
          const questions = questionsByDimension[dimension.id] || [];
          const qIds = questions.map((q) => q.id);
          const answered = qIds.filter((id) => answers[id] !== undefined).length;
          const total = qIds.length;
          const isActive = activeDimensionId === dimension.id;
          const progress = getProgressPercent(answered, total);
          const name = dimensionMap[dimension.id]?.name_pl || dimension.id;

          return (
            <button
              key={dimension.id}
              type="button"
              onClick={() => setActiveDimensionId(dimension.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "w-full rounded-2xl border px-3 py-3 text-left text-sm transition",
                isActive
                  ? "btn-primary border-[var(--brand)] bg-[var(--brand)] text-[color:var(--on-brand)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]"
              )}
            >
              <div className="font-medium">{name}</div>

              <div
                className={cn(
                  "mt-1 text-xs",
                  isActive
                    ? "text-[color:var(--on-brand)] opacity-80"
                    : "text-[var(--text-muted)]"
                )}
              >
                {answered} / {total} pytań
              </div>

              <div
                className={cn(
                  "mt-2 h-2 w-full overflow-hidden rounded-full",
                  isActive ? "bg-white/25" : "bg-[var(--surface-2)]"
                )}
                aria-hidden="true"
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    isActive ? "bg-white" : "bg-[var(--brand)]"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}