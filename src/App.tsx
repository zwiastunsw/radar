import { useEffect, useMemo, useRef, useState } from "react";
import assessmentModel from "./assessment-questions.json";
import type {
  AnswersState,
  AssessmentMetadata,
  NotesState,
  Question,
  Stage,
} from "./types";
import { IntroScreen } from "./components/IntroScreen";
import { DimensionNav } from "./components/DimensionNav";
import { QuestionCard } from "./components/QuestionCard";
import { CurrentRecommendationsPanel } from "./components/CurrentRecommendationsPanel";
import { ResultsScreen } from "./components/ResultsScreen";
import { Card } from "./components/ui";
import { AppHeader } from "./components/AppHeader";
import { AppFooter } from "./components/AppFooter";
import {
  getDefaultMetadata,
  getDimensionMap,
  getDecisionMap,
  average,
  clamp,
} from "./utils/scoring";
import { exportAssessmentJSON } from "./utils/export";
import "./styles/layout.css";

type ImportedAssessmentPayload = {
  schema_version?: string;
  exported_at?: string;
  metadata?: AssessmentMetadata;
  activeDimensionId?: string;
  currentIndex?: number;
  answers?: AnswersState;
  notes?: NotesState;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getAllowedAnswerValues(model: typeof assessmentModel): number[] {
  const mappedValues = Object.keys(model.recommendations.answer_to_level_mapping)
    .map((key) => Number(key))
    .filter((value) => Number.isInteger(value));

  return mappedValues.sort((a, b) => a - b);
}

function sanitizeAnswers(
  rawAnswers: unknown,
  questionMap: Record<string, Question>,
  model: typeof assessmentModel
): AnswersState {
  if (!isRecord(rawAnswers)) return {};

  const result: AnswersState = {};

  for (const [key, value] of Object.entries(rawAnswers)) {
    const question = questionMap[key];
    if (!question) continue;

    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    if (!Number.isInteger(value)) continue;

    const allowedValues = getAllowedAnswerValues(model);
    if (!allowedValues.includes(value)) continue;

    result[key] = value;
  }

  return result;
}

function sanitizeNotes(
  rawNotes: unknown,
  validQuestionIds: Set<string>
): NotesState {
  if (!isRecord(rawNotes)) return {};

  const result: NotesState = {};

  for (const [key, value] of Object.entries(rawNotes)) {
    if (!validQuestionIds.has(key)) continue;
    if (typeof value !== "string") continue;
    result[key] = value;
  }

  return result;
}

function sanitizeMetadata(rawMetadata: unknown): AssessmentMetadata {
  const defaults = getDefaultMetadata();

  if (!isRecord(rawMetadata)) {
    return defaults;
  }

  return {
    organization:
      typeof rawMetadata.organization === "string"
        ? rawMetadata.organization
        : defaults.organization,
    assessmentDate:
      typeof rawMetadata.assessmentDate === "string"
        ? rawMetadata.assessmentDate
        : defaults.assessmentDate,
    previousAssessmentDate:
      typeof rawMetadata.previousAssessmentDate === "string"
        ? rawMetadata.previousAssessmentDate
        : defaults.previousAssessmentDate,
    assessor:
      typeof rawMetadata.assessor === "string"
        ? rawMetadata.assessor
        : defaults.assessor,
    mode:
      rawMetadata.mode === "individual" || rawMetadata.mode === "team"
        ? rawMetadata.mode
        : defaults.mode,
    notes:
      typeof rawMetadata.notes === "string"
        ? rawMetadata.notes
        : defaults.notes,
  };
}

export default function AccessibilityAssessmentUI() {
  const model = assessmentModel;

  const dimensionMap = useMemo(() => getDimensionMap(model), [model]);
  const decisionMap = useMemo(() => getDecisionMap(model), [model]);
  const questionMap = useMemo(
    () =>
      Object.fromEntries(model.questions.map((q) => [q.id, q])) as Record<
        string,
        Question
      >,
    [model]
  );

  const questionsByDimension = useMemo(() => {
    return model.questions.reduce((acc, q) => {
      if (!acc[q.dimension_id]) acc[q.dimension_id] = [];
      acc[q.dimension_id].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [model]);

  const validQuestionIds = useMemo(
    () => new Set(model.questions.map((q) => q.id)),
    [model]
  );

  const validDimensionIds = useMemo(
    () => new Set(model.dimensions.map((d) => d.id)),
    [model]
  );

  const [stage, setStage] = useState<Stage>("intro");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [metadata, setMetadata] = useState<AssessmentMetadata>(
    getDefaultMetadata()
  );
  const [activeDimensionId, setActiveDimensionId] = useState(
    model.dimensions[0]?.id || ""
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [notes, setNotes] = useState<NotesState>({});
  const [liveMessage, setLiveMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const shouldMoveFocusRef = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sdadc-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sdadc-theme", theme);
  }, [theme]);

  const activeQuestions = questionsByDimension[activeDimensionId] || [];
  const safeIndex = clamp(
    currentIndex,
    0,
    Math.max(activeQuestions.length - 1, 0)
  );
  const currentQuestion = activeQuestions[safeIndex];

  useEffect(() => {
    if (stage !== "form") return;
    if (!currentQuestion) return;
    if (!shouldMoveFocusRef.current) return;

    requestAnimationFrame(() => {
      questionHeadingRef.current?.focus();
      shouldMoveFocusRef.current = false;
    });
  }, [stage, activeDimensionId, currentIndex, currentQuestion]);

  const dimensionScore = useMemo(() => {
    const values = activeQuestions
      .map((q) => answers[q.id])
      .filter((v): v is number => v !== undefined);

    return values.length ? average(values) : null;
  }, [activeQuestions, answers]);

  const totalQuestions = model.questions.length;
  const answeredCount = Object.values(answers).filter(
    (v) => v !== undefined
  ).length;

  const currentDimensionIndex = model.dimensions.findIndex(
    (d) => d.id === activeDimensionId
  );
  const isLastQuestionInDimension =
    activeQuestions.length > 0 && safeIndex >= activeQuestions.length - 1;

  const nextDimension = (() => {
    for (let i = currentDimensionIndex + 1; i < model.dimensions.length; i++) {
      const candidate = model.dimensions[i];
      if ((questionsByDimension[candidate.id] || []).length > 0) {
        return candidate;
      }
    }
    return null;
  })();

  const isLastQuestionOverall = isLastQuestionInDimension && !nextDimension;

  const handleExportJson = () => {
    const payload = {
      schema_version: model.schema_version ?? "1.0",
      exported_at: new Date().toISOString(),
      metadata,
      activeDimensionId,
      currentIndex: safeIndex,
      answers,
      notes,
    };

    exportAssessmentJSON(payload);
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as ImportedAssessmentPayload;
      const importedSchemaVersion =
        typeof parsed.schema_version === "string" ? parsed.schema_version : null;
      const currentSchemaVersion = model.schema_version ?? "1.0";

      const nextMetadata = sanitizeMetadata(parsed.metadata);
      const nextAnswers = sanitizeAnswers(parsed.answers, questionMap, model);
      const nextNotes = sanitizeNotes(parsed.notes, validQuestionIds);

      const nextDimensionId =
        typeof parsed.activeDimensionId === "string" &&
        validDimensionIds.has(parsed.activeDimensionId)
          ? parsed.activeDimensionId
          : model.dimensions[0]?.id || "";

      const importedQuestions = questionsByDimension[nextDimensionId] || [];
      const maxIndex = Math.max(importedQuestions.length - 1, 0);

      const nextIndex =
        typeof parsed.currentIndex === "number" &&
        Number.isInteger(parsed.currentIndex)
          ? clamp(parsed.currentIndex, 0, maxIndex)
          : 0;

      setMetadata(nextMetadata);
      setAnswers(nextAnswers);
      setNotes(nextNotes);
      setActiveDimensionId(nextDimensionId);
      setCurrentIndex(nextIndex);
      setStage("form");
      shouldMoveFocusRef.current = true;
      setLiveMessage(
        `Wczytano ocenę. Aktywny wymiar: ${
          dimensionMap[nextDimensionId]?.name_pl ?? "nieznany"
        }.`
      );

      if (
        importedSchemaVersion &&
        importedSchemaVersion !== currentSchemaVersion
      ) {
        window.alert(
          `Uwaga: importowany plik ma wersję kontraktu ${importedSchemaVersion}, a bieżąca aplikacja pracuje na wersji ${currentSchemaVersion}. Dane zostały wczytane po sanityzacji, ale część informacji mogła zostać pominięta.`
        );
      }
    } catch {
      window.alert(
        "Nie udało się wczytać pliku JSON. Sprawdź, czy plik ma poprawny format."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleToggleResults = () => {
    setStage((prev) => (prev === "results" ? "form" : "results"));
  };

  const handleGoHome = () => {
    setStage("intro");
  };

  const handlePrevious = () => {
    if (!activeQuestions.length) return;

    if (safeIndex > 0) {
      shouldMoveFocusRef.current = true;
      setCurrentIndex((i) =>
        clamp(i - 1, 0, Math.max(activeQuestions.length - 1, 0))
      );
      setLiveMessage(
        `Pytanie ${safeIndex} z ${activeQuestions.length} w wymiarze ${
          dimensionMap[activeDimensionId]?.name_pl ?? ""
        }.`
      );
      return;
    }

    for (let i = currentDimensionIndex - 1; i >= 0; i--) {
      const previousDimension = model.dimensions[i];
      const previousQuestions = questionsByDimension[previousDimension.id] || [];

      if (previousQuestions.length > 0) {
        shouldMoveFocusRef.current = true;
        setActiveDimensionId(previousDimension.id);
        setCurrentIndex(previousQuestions.length - 1);
        setLiveMessage(
          `Przejście do poprzedniego wymiaru: ${previousDimension.name_pl}.`
        );
        return;
      }
    }
  };

  const handleNext = () => {
    if (!activeQuestions.length) return;

    if (!isLastQuestionInDimension) {
      shouldMoveFocusRef.current = true;
      setCurrentIndex((i) =>
        clamp(i + 1, 0, Math.max(activeQuestions.length - 1, 0))
      );
      setLiveMessage(
        `Pytanie ${safeIndex + 2} z ${activeQuestions.length} w wymiarze ${
          dimensionMap[activeDimensionId]?.name_pl ?? ""
        }.`
      );
      return;
    }

    if (nextDimension) {
      shouldMoveFocusRef.current = true;
      setActiveDimensionId(nextDimension.id);
      setCurrentIndex(0);
      setLiveMessage(`Przejście do kolejnego wymiaru: ${nextDimension.name_pl}.`);
      return;
    }

    setLiveMessage(
      "To jest ostatnie pytanie ostatniego wymiaru. Możesz przejść do wyników."
    );
  };

  return (
    <div className="app-shell min-h-screen">
      <a className="skip-link" href="#main-content">
        Przejdź do treści
      </a>

      <div className="mx-auto max-w-7xl p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportFile}
        />

        <AppHeader
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          showResults={stage === "results"}
          onShowResults={handleToggleResults}
          onExportJson={handleExportJson}
          onImportJsonClick={() => fileInputRef.current?.click()}
          onGoHome={handleGoHome}
          theme={theme}
          onToggleTheme={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
        />

        <div className="sr-only" aria-live="polite">
          {liveMessage}
        </div>

        <main id="main-content" className="app-main">
          {stage === "intro" ? (
            <IntroScreen
              metadata={metadata}
              setMetadata={setMetadata}
              onStart={() => setStage("form")}
            />
          ) : stage === "results" ? (
            <ResultsScreen
              model={model}
              metadata={metadata}
              answers={answers}
              notes={notes}
              dimensionMap={dimensionMap}
              decisionMap={decisionMap}
            />
          ) : (
            <div className="grid gap-6 xl:grid-cols-[260px_1fr_300px]">
              <DimensionNav
                dimensions={model.dimensions}
                questionsByDimension={questionsByDimension}
                activeDimensionId={activeDimensionId}
                setActiveDimensionId={(id) => {
                  shouldMoveFocusRef.current = true;
                  setActiveDimensionId(id);
                  setCurrentIndex(0);
                  setLiveMessage(
                    `Przejście do wymiaru: ${dimensionMap[id]?.name_pl ?? id}.`
                  );
                }}
                answers={answers}
                dimensionMap={dimensionMap}
              />

              <div className="space-y-4">
                {currentQuestion ? (
                  <QuestionCard
                    question={currentQuestion}
                    answer={answers[currentQuestion.id]}
                    onAnswer={(v) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: v,
                      }))
                    }
                    note={notes[currentQuestion.id]}
                    onNote={(v) =>
                      setNotes((prev) => ({
                        ...prev,
                        [currentQuestion.id]: v,
                      }))
                    }
                    dimension={dimensionMap[currentQuestion.dimension_id]}
                    decision={decisionMap[currentQuestion.decision_id]}
                    dimensionScore={dimensionScore}
                    headingRef={questionHeadingRef}
                  />
                ) : (
                  <Card className="p-5 text-sm text-[var(--text-muted)]">
                    Brak pytań w wybranym wymiarze.
                  </Card>
                )}

                <Card className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-[var(--text-muted)]">
                      Pytanie {activeQuestions.length ? safeIndex + 1 : 0} z{" "}
                      {activeQuestions.length} w tym wymiarze
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]"
                      >
                        ← Poprzednie
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary rounded-2xl px-4 py-2 text-sm"
                      >
                        {isLastQuestionOverall
                          ? "To już ostatnie pytanie"
                          : isLastQuestionInDimension
                          ? "Następny wymiar →"
                          : "Następne pytanie →"}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>

              <CurrentRecommendationsPanel
                currentQuestion={currentQuestion}
                currentAnswer={
                  currentQuestion ? answers[currentQuestion.id] : undefined
                }
                model={model}
              />
            </div>
          )}
        </main>

        <AppFooter version={`v${model.schema_version ?? "1.0"}`} />
      </div>
    </div>
  );
}