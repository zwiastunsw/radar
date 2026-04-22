import { useMemo } from "react";
import type {
  AssessmentModel,
  Question,
} from "../types";
import { buildRecommendations } from "../utils/scoring";
import { Badge, Card, SectionTitle } from "./ui";

import { getPriorityLabel, getTypeLabel } from "../utils/labels";

export function CurrentRecommendationsPanel({
  currentQuestion,
  currentAnswer,
  model,
}: {
  currentQuestion: Question | undefined;
  currentAnswer: number | undefined;
  model: AssessmentModel;
}) {
  const generated = useMemo(() => {
    if (!currentQuestion || currentAnswer === undefined) {
      return [];
    }

    return buildRecommendations(currentQuestion, currentAnswer, model);
  }, [currentQuestion, currentAnswer, model]);

  return (
    <Card className="sticky top-4 p-4">
      <SectionTitle subtext="Dla bieżącego pytania">Rekomendacje</SectionTitle>

      {currentAnswer === undefined ? (
        <div className="text-sm text-[var(--text-muted)]">Wybierz odpowiedź.</div>
      ) : generated.length === 0 ? (
        <div className="text-sm text-[var(--text-muted)]">
          Dla tej odpowiedzi nie wygenerowano rekomendacji.
        </div>
      ) : (
        <div className="space-y-3">
          {generated.map((rec) => (
            <div
              key={rec.key}
              className="rounded-2xl border border-[var(--border)] p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{getTypeLabel(rec.type)}</Badge>
                <Badge>{getPriorityLabel(rec.priority)}</Badge>
              </div>



              <div className="text-sm leading-6 text-[var(--text-muted)]">
                {rec.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}