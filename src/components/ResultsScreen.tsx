import React from "react";
import type {
  AssessmentNoteEntry,
  AssessmentMetadata,
  AssessmentModel,
  AnswersState,
  NotesState,
  Decision,
  Dimension,
  ExecutiveRecommendation,
} from "../types";
import { computeResults, getMaturityLabel } from "../utils/scoring";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { Badge, Card, SectionTitle } from "./ui";
import { SummaryCard } from "./SummaryCard";
import { MaturityChart } from "./MaturityChart";

import { getPriorityLabel, getTypeLabel } from "../utils/labels";

function RecommendationCard({
  recommendation,
}: {
  recommendation: ExecutiveRecommendation;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge>{getTypeLabel(recommendation.type)}</Badge>
        <Badge>{getPriorityLabel(recommendation.priority)}</Badge>
        <Badge>{recommendation.questionId}</Badge>
      </div>

      <div className="text-sm font-medium text-[var(--text-main)]">
        {recommendation.questionName}
      </div>

      <div className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {recommendation.text}
      </div>
    </div>
  );
}

export function ResultsScreen({
  model,
  metadata,
  answers,
  notes,
  dimensionMap,
  decisionMap,
}: {
  model: AssessmentModel;
  metadata: AssessmentMetadata;
  answers: AnswersState;
  notes: NotesState;
  dimensionMap: Record<string, Dimension>;
  decisionMap: Record<string, Decision>;
}) {
  const {
    answeredEntries,
    overallScore,
    dimensionResults,
    decisionResults,
    topRecommendations,
  } = computeResults(model, answers, dimensionMap, decisionMap);

  const notesSummary: AssessmentNoteEntry[] = model.questions
     .map((question) => {
       const note = notes[question.id]?.trim();
       if (!note) return null;
 
       return {
         questionId: question.id,
         questionName: question.short_name || question.text,
         dimensionId: question.dimension_id,
         decisionId: question.decision_id,
         note,
       };
     })
     .filter((item): item is AssessmentNoteEntry => item !== null);
	 
  const assessedDimensionsCount = dimensionResults.filter(
    (d) => d.label !== "brak danych"
  ).length;

  const initialDimensionsCount = dimensionResults.filter(
    (d) => d.label !== "brak danych" && d.score < 1.5
  ).length;

  return (
    <div className="space-y-6">
      <ExecutiveSummary
        metadata={metadata}
        dimensionResults={dimensionResults}
        decisionResults={decisionResults}
        topRecommendations={topRecommendations}
		schemaVersion={model.schema_version ?? "1.0"}
		notesSummary={notesSummary}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Wynik ogólny"
          value={answeredEntries.length ? overallScore.toFixed(1) : "–"}
          subtitle={
            answeredEntries.length
              ? getMaturityLabel(overallScore, model)
              : "brak danych"
          }
        />

        <SummaryCard
          title="Liczba odpowiedzi"
          value={`${answeredEntries.length} / ${model.questions.length}`}
          subtitle="Udzielone odpowiedzi"
        />

        <SummaryCard
          title="Obszary początkowe"
          value={assessedDimensionsCount ? initialDimensionsCount : "–"}
          subtitle="Wymiary wymagające podstawowych działań porządkujących"
        />
      </div>

      <MaturityChart
        title="Poziom dojrzałości według wymiarów"
        subtitle="Skala 0–4"
        items={dimensionResults.map((item) => ({
          id: item.id,
          label: item.name,
          score: item.score,
        }))}
        overallScore={overallScore}
        model={model}
      />

      <Card className="p-5">
        <SectionTitle subtext="Ocena w poszczególnych wymiarach">
          Wyniki według wymiarów
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dimensionResults.map((result) => (
            <Card key={result.id} className="p-4">
              <div className="text-sm text-[var(--text-muted)]">
                {result.name}
              </div>

              <div className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                {result.label === "brak danych" ? "–" : result.score.toFixed(1)}
              </div>

              <div className="mt-2 inline-flex rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm text-[var(--text-main)]">
                {result.label}
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                {result.description}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle subtext="Najniżej ocenione decyzje są pokazane na górze">
          Wyniki według decyzji
        </SectionTitle>

        <div className="space-y-3">
          {decisionResults.every((decision) => !decision.hasData) ? (
            <div className="text-sm text-[var(--text-muted)]">
              Brak danych do oceny decyzji.
            </div>
          ) : (
            decisionResults.map((decision) => (
              <div
                key={decision.id}
                className="rounded-2xl border border-[var(--border)] p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {decision.id}
                    </div>
                    <div className="font-medium text-[var(--text-main)]">
                      {decision.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xl font-semibold text-[var(--text-main)]">
                      {decision.hasData ? decision.score.toFixed(1) : "–"}
                    </div>
                    <Badge>{decision.label}</Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle subtext="Najważniejsze zalecenia wygenerowane na podstawie udzielonych odpowiedzi">
          Najważniejsze rekomendacje
        </SectionTitle>

        <div className="space-y-3">
          {topRecommendations.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)]">
              Brak rekomendacji. Uzupełnij odpowiedzi w formularzu.
            </div>
          ) : (
            topRecommendations.map((rec) => (
              <RecommendationCard key={rec.key} recommendation={rec} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}