import React from "react";
import type {
  AssessmentNoteEntry,
  AssessmentMetadata,
  ExecutiveDecision,
  ExecutiveDimension,
  ExecutiveRecommendation,
} from "../types";
import { build90DayPlan, buildExecutiveMessage } from "../utils/scoring";
import {
  exportActionPlanHTML,
  exportActionPlanJSON,
  exportExecutiveHTML,
  exportExecutivePDF,
} from "../utils/export";
import { Badge, Card, SectionTitle } from "./ui";

import { getPriorityLabel, getTypeLabel } from "../utils/labels";


function getRecommendationContext(rec: ExecutiveRecommendation) {
  if (rec.questionName) {
    return rec.questionName;
  }
  if (rec.questionId) {
    return `Pytanie ${rec.questionId}`;
  }
  return "Rekomendacja";
}

export function ExecutiveSummary({
  metadata,
  dimensionResults,
  decisionResults,
  topRecommendations,
  schemaVersion,
  notesSummary,
}: {
  metadata: AssessmentMetadata;
  dimensionResults: ExecutiveDimension[];
  decisionResults: ExecutiveDecision[];
  topRecommendations: ExecutiveRecommendation[];
  schemaVersion: string;
  notesSummary: AssessmentNoteEntry[];
}) {
  const assessedDimensions = dimensionResults.filter(
    (d) => d.label !== "brak danych"
  );

  const weakestDimensions = [...assessedDimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

const weakestDecisions = decisionResults
  .filter((d) => d.hasData)
  .sort((a, b) => a.score - b.score)
  .slice(0, 5);
  const strategicMessage = buildExecutiveMessage(dimensionResults);
  const plan90 = build90DayPlan({
    dimensionResults,
    decisionResults,
    topRecommendations,
  });

  const exportPayload = {
    metadata,
    message: strategicMessage,
    dimensions: weakestDimensions,
    decisions: weakestDecisions,
    recommendations: topRecommendations.slice(0, 5),
    plan90,
	notesSummary,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => exportExecutivePDF(exportPayload)}
          className="btn-primary rounded-xl bg-[var(--brand)] px-4 py-2 text-sm text-[color:var(--on-brand)] hover:opacity-90"
        >
          Eksport PDF
        </button>

        <button
          type="button"
          onClick={() => exportExecutiveHTML(exportPayload)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]"
        >
          Eksport HTML
        </button>

        <button
          type="button"
          onClick={() => exportActionPlanHTML(plan90, metadata)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]"
        >
          Plan działań HTML
        </button>

        <button
          type="button"
          onClick={() => exportActionPlanJSON(plan90, metadata, schemaVersion)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]"
        >
          Plan działań JSON
        </button>
      </div>

      <Card className="p-5">
         <SectionTitle subtext="Jednoekranowe podsumowanie dla kierownictwa">
           Widok kierowniczy
         </SectionTitle>
 
         <div className="mb-3 text-sm text-[var(--text-muted)]">
           Ocena przedstawia aktualny etap rozwoju organizacji w obszarze dostępności cyfrowej oraz wskazuje kierunki działań, które mogą wzmacniać spójność i skuteczność podejmowanych rozwiązań.
         </div>
 
         <div className="rounded-2xl bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--text-muted)]">
           {strategicMessage}
         </div>
       </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-1">
          <SectionTitle subtext="Obszary, w których dalsze działania mogą przynieść największy efekt">
            3 obszary wymagające największej uwagi
          </SectionTitle>

          <div className="space-y-3">
            {weakestDimensions.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)]">Brak wystarczających danych do oceny.</div>
            ) : (
              weakestDimensions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[var(--border)] p-4"
                >
                  <div className="text-sm text-[var(--text-muted)]">
                    {item.name}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                    {item.score.toFixed(1)}
                  </div>
                  <div className="mt-2 inline-flex rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm text-[var(--text-main)]">
                    {item.label}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5 xl:col-span-1">
          <SectionTitle subtext="Decyzje, które mogą wzmocnić zarządzanie dostępnością">
            5 kluczowych decyzji do podjęcia
          </SectionTitle>

          <div className="space-y-3">
            {weakestDecisions.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)]">Brak wystarczających danych do oceny.</div>
            ) : (
              weakestDecisions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[var(--border)] p-4"
                >
                  <div className="text-sm text-[var(--text-muted)]">
                    {item.id}
                  </div>
                  <div className="font-medium text-[var(--text-main)]">
                    {item.name}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-xl font-semibold text-[var(--text-main)]">
                      {item.hasData ? item.score.toFixed(1) : "–"}
                    </div>
                    <Badge>{item.label}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5 xl:col-span-1">
          <SectionTitle subtext="Rekomendacje wynikające z udzielonych odpowiedzi">
            Priorytetowe kierunki działań
          </SectionTitle>

          <div className="space-y-3">
            {topRecommendations.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)]">
                Brak rekomendacji.
              </div>
            ) : (
              topRecommendations.slice(0, 5).map((rec) => (
                <div
                  key={rec.key}
                  className="rounded-2xl border border-[var(--border)] p-4"
                >
<div className="mb-2 flex flex-wrap items-center gap-2">
  <Badge>{getTypeLabel(rec.type)}</Badge>
  <Badge>{getPriorityLabel(rec.priority)}</Badge>
</div>

<div className="text-sm font-medium text-[var(--text-main)]">
  {getRecommendationContext(rec)}
</div>

<div className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
  {rec.text}
</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle subtext="Proponowana kolejność działań wdrożeniowych">
          Plan 90 dni
        </SectionTitle>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-main)]">
              Pierwsze 30 dni
            </div>
            <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
              {plan90.first30.length === 0 ? (
                <li>Brak zaleceń.</li>
              ) : (
                plan90.first30.map((item, idx) => <li key={idx}>• {item}</li>)
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-main)]">
              Dzień 31–60
            </div>
            <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
              {plan90.day60.length === 0 ? (
                <li>Brak zaleceń.</li>
              ) : (
                plan90.day60.map((item, idx) => <li key={idx}>• {item}</li>)
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] p-4">
            <div className="mb-3 text-sm font-semibold text-[var(--text-main)]">
              Dzień 61–90
            </div>
            <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
              {plan90.day90.length === 0 ? (
                <li>Brak zaleceń.</li>
              ) : (
                plan90.day90.map((item, idx) => <li key={idx}>• {item}</li>)
              )}
            </ul>
          </div>
        </div>
      </Card>
       <Card className="p-5">
         <SectionTitle subtext="Komentarze dodane podczas wypełniania formularza">
           Uwagi osoby prowadzącej ocenę
         </SectionTitle>
 
         <div className="space-y-3">
           {notesSummary.length === 0 ? (
             <div className="text-sm text-[var(--text-muted)]">
               Nie dodano uwag do pytań.
             </div>
           ) : (
             notesSummary.map((item) => (
               <div
                 key={item.questionId}
                 className="rounded-2xl border border-[var(--border)] p-4"
               >
                 <div className="mb-1 text-sm text-[var(--text-muted)]">
                   {item.questionId}
                 </div>
                 <div className="text-sm font-medium text-[var(--text-main)]">
                   {item.questionName}
                 </div>
                 <div className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                   {item.note}
                 </div>
               </div>
             ))
           )}
         </div>
       </Card>
     </div>
   );
 }