import React from "react";
import type { Decision, Dimension, Question, AssessmentModel } from "../types";
import { getMaturityLabel, cn } from "../utils/scoring";
import { Badge, Card } from "./ui";

type QuestionAnswerOption = NonNullable<Question["answers"]>[number];

function ScaleOptions({
  options,
  value,
  onChange,
}: {
  options: QuestionAnswerOption[];
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  if (!options.length) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
        Brak zdefiniowanych odpowiedzi dla tego pytania.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={cn(
              "flex h-full flex-col items-start justify-start rounded-2xl border p-3 text-left transition",
              selected
                ? "btn-primary border-[var(--brand)] bg-[var(--brand)] text-[color:var(--on-brand)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]"
            )}
          >
            <div className="text-sm font-semibold">
              {option.value} – {option.label}
            </div>

            <div
              className={cn(
                "mt-1 text-xs leading-5",
                selected
                  ? "text-[color:var(--on-brand)] opacity-85"
                  : "text-[var(--text-muted)]"
              )}
            >
              {option.text}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  dimension,
  decision,
  note,
  onNote,
  dimensionScore,
  model,
}: {
  question: Question;
  answer: number | undefined;
  onAnswer: (value: number) => void;
  dimension: Dimension | undefined;
  decision: Decision | undefined;
  note: string | undefined;
  onNote: (value: string) => void;
  dimensionScore: number | null;
  model: AssessmentModel;
}) {
  const options = question.answers ?? [];
  const noteId = `note-${question.id}`;

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge>{question.id}</Badge>
        {dimension?.name_pl ? <Badge>{dimension.name_pl}</Badge> : null}
        {decision?.id ? <Badge>{decision.id}</Badge> : null}
        {dimensionScore !== null ? (
          <Badge>
            {dimensionScore.toFixed(1)} ({getMaturityLabel(dimensionScore, model)})
          </Badge>
        ) : null}
      </div>

      <h3 className="text-lg font-semibold text-[var(--text-main)]">
        {question.text}
      </h3>

      {question.area_label ? (
        <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">
          Obszar: {question.area_label}
        </p>
      ) : question.short_name ? (
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {question.short_name}
        </p>
      ) : null}

      <div className="mt-5">
        <ScaleOptions options={options} value={answer} onChange={onAnswer} />
      </div>

     {question.evidence_examples?.length ? (
         <div className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
           <span className="font-medium text-[var(--text-main)]">
             Przykłady dowodów:
           </span>{" "}
           {question.evidence_examples.join(", ")}
         </div>
       ) : null}
	   
      <div className="mt-4">
        <label
          htmlFor={noteId}
          className="mb-2 block text-sm font-medium text-[var(--text-main)]"
        >
          Komentarz do pytania
        </label>
        <textarea
          id={noteId}
          value={note || ""}
          onChange={(e) => onNote(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
          placeholder="Dodaj obserwację, przykład lub krótkie wyjaśnienie odpowiedzi."
          rows={4}
        />
      </div>
    </Card>
  );
}