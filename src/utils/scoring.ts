import type {
  AnswersState,
  AssessmentMetadata,
  AssessmentModel,
  Decision,
  Dimension,
  ExecutiveDecision,
  ExecutiveDimension,
  ExecutiveRecommendation,
  Question,
  RecommendationLevel,
  RecommendationType,
} from "../types";

type RecommendationPriority = "high" | "medium" | "low";

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

export function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function short(text: string | undefined, max = 80) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getDefaultMetadata(): AssessmentMetadata {
  return {
    organization: "",
    assessmentDate: todayIsoDate(),
    previousAssessmentDate: "",
    assessor: "",
    mode: "individual",
    notes: "",
  };
}

export function getDimensionMap(model: AssessmentModel) {
  return Object.fromEntries(
    model.dimensions.map((d) => [d.id, d])
  ) as Record<string, Dimension>;
}

export function getDecisionMap(model: AssessmentModel) {
  return Object.fromEntries(
    model.decisions.map((d) => [d.id, d])
  ) as Record<string, Decision>;
}

function findThreshold(model: AssessmentModel, score: number) {
  return model.scoring.dimension_thresholds.find(
    (threshold) => score >= threshold.min && score <= threshold.max
  );
}

export function getMaturityLabel(
  score: number,
  model?: AssessmentModel,
  fallback = "poziom początkowy"
) {
  if (!model) {
    if (score < 1.5) return "poziom początkowy";
    if (score < 2.5) return "poziom porządkowania";
    if (score < 3.5) return "poziom integracji";
    return "poziom dojrzałości";
  }

  return findThreshold(model, score)?.label ?? fallback;
}

export function getMaturityDescription(
  score: number,
  model?: AssessmentModel,
  fallback = "Brak opisu poziomu dojrzałości."
) {
  if (!model) {
    if (score < 1.5) {
      return "Działania są na etapie początkowym. Organizacja wymaga podstawowych decyzji i uporządkowania podejścia do dostępności.";
    }
    if (score < 2.5) {
      return "Organizacja porządkuje działania w tym obszarze, określa zasady i odpowiedzialności, ale rozwiązania nie są jeszcze w pełni utrwalone.";
    }
    if (score < 3.5) {
      return "Działania są włączane w procesy i stosowane w praktyce, ale wymagają pełniejszego domknięcia i większej spójności.";
    }
    return "Działania są systemowe, spójne i stale doskonalone. Obszar można uznać za dojrzały.";
  }

  const threshold = findThreshold(model, score);
  if (!threshold) return fallback;

  const scaleMatch = model.scoring.scale.find(
    (item) => item.label === threshold.label
  );

  return scaleMatch?.description ?? fallback;
}

function getQuestionDisplayName(question: Question) {
  return question.short_name || question.text;
}

function getRecommendationLevel(
  answer: number | undefined,
  model: AssessmentModel
): RecommendationLevel | null {
  if (answer === undefined) return null;
  if (!Number.isInteger(answer)) return null;

  const mapping = model.recommendations.answer_to_level_mapping;
  const key = String(answer) as keyof typeof mapping;
  return mapping[key] ?? null;
}

function getPriorityFromLevel(level: RecommendationLevel): RecommendationPriority {
  switch (level) {
    case "low":
      return "high";
    case "medium":
      return "medium";
    case "high":
      return "low";
  }
}

function priorityOrder(priority: RecommendationPriority) {
  const order: Record<RecommendationPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return order[priority];
}

function recommendationTypeOrder(type: RecommendationType) {
  const order: Record<RecommendationType, number> = {
    strategic: 0,
    systemic: 1,
    operational: 2,
  };

  return order[type];
}

export function buildRecommendations(
  question: Question,
  answer: number | undefined,
  model: AssessmentModel
): ExecutiveRecommendation[] {
  const level = getRecommendationLevel(answer, model);
  if (!level) return [];

  const recommendationSet = question.recommendations?.[level];
  if (!recommendationSet) return [];

  const orderedTypes: RecommendationType[] = [
    "strategic",
    "systemic",
    "operational",
  ];

  return orderedTypes
    .filter((type) => recommendationSet[type])
    .map((type) => ({
      key: `${question.id}-${level}-${type}`,
      questionId: question.id,
      questionName: getQuestionDisplayName(question),
      dimensionId: question.dimension_id,
      decisionId: question.decision_id,
      level,
      priority: getPriorityFromLevel(level),
      type,
      text: recommendationSet[type] as string,
    }));
}

function sortRecommendations(
  recommendations: ExecutiveRecommendation[]
): ExecutiveRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const byPriority = priorityOrder(a.priority) - priorityOrder(b.priority);
    if (byPriority !== 0) return byPriority;

    const byType =
      recommendationTypeOrder(a.type) - recommendationTypeOrder(b.type);
    if (byType !== 0) return byType;

    const byQuestion = a.questionId.localeCompare(b.questionId);
    if (byQuestion !== 0) return byQuestion;

    return a.text.localeCompare(b.text);
  });
}

export function build90DayPlan({
  dimensionResults,
  decisionResults,
  topRecommendations,
}: {
  dimensionResults: ExecutiveDimension[];
  decisionResults: ExecutiveDecision[];
  topRecommendations: ExecutiveRecommendation[];
}) {
  const first30 = [
    ...dimensionResults
      .filter((d) => d.label !== "brak danych")
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map((d) => `Rozpocząć działania porządkujące w obszarze: ${d.name}.`),
    ...decisionResults
	  .filter((d) => d.hasData)
      .slice(0, 2)
      .map((d) => `Podjąć decyzję i wyznaczyć odpowiedzialność w obszarze: ${d.name}.`),
  ].slice(0, 3);

  const day60 = topRecommendations
    .filter((r) => r.type === "strategic" || r.type === "systemic")
    .slice(0, 3)
    .map((r) => r.text);

  const day90 = [
    ...topRecommendations
      .filter((r) => r.type === "operational")
      .slice(0, 2)
      .map((r) => r.text),
    "Przeprowadzić przegląd postępów i zaktualizować plan działań.",
  ].slice(0, 3);

  return { first30, day60, day90 };
}

export function buildExecutiveMessage(dimensionResults: ExecutiveDimension[]) {
  const weakestDimensions = [...dimensionResults]
    .filter((d) => d.label !== "brak danych")
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  if (!weakestDimensions.length) {
    return "Brak wystarczających danych do sformułowania wniosku kierowniczego.";
  }

  const names = weakestDimensions.map((d) => d.name).join(", ");
  const lowestScore = weakestDimensions[0].score;

  if (lowestScore < 1.5) {
    return `Organizacja znajduje się na poziomie początkowym w najniżej ocenionych obszarach: ${names}. W pierwszej kolejności potrzebne są działania porządkujące, określenie zasad, odpowiedzialności i podstawowego sposobu działania.`;
  }

  if (lowestScore < 2.5) {
    return `Najniżej ocenione obszary to: ${names}. Organizacja jest na etapie porządkowania działań i wymaga ich dalszego domknięcia, utrwalenia oraz włączenia w procesy.`;
  }

  if (lowestScore < 3.5) {
    return `Najniżej ocenione obszary to: ${names}. Działania są już włączane w procesy, ale wymagają większej spójności i pełniejszej integracji w całej organizacji.`;
  }

  return `Najniżej ocenione obszary to: ${names}. Organizacja osiągnęła w nich poziom dojrzałości, a dalsze działania mogą koncentrować się na utrzymaniu jakości i stałym doskonaleniu.`;
}

export function computeResults(
  model: AssessmentModel,
  answers: AnswersState,
  dimensionMap: Record<string, Dimension>,
  decisionMap: Record<string, Decision>
) {
  const answeredEntries = Object.entries(answers).filter(
    ([, value]) => value !== undefined
  ) as Array<[string, number]>;

  const overallScore = answeredEntries.length
    ? average(answeredEntries.map(([, value]) => value))
    : 0;

  const dimensionResults: ExecutiveDimension[] = model.dimensions.map(
    (dimension) => {
      const values = model.questions
        .filter((q) => q.dimension_id === dimension.id)
        .map((q) => answers[q.id])
        .filter((v): v is number => v !== undefined);

      const score = values.length ? average(values) : 0;

      return {
        id: dimension.id,
        name: dimensionMap[dimension.id]?.name_pl || dimension.id,
        score,
        label: values.length ? getMaturityLabel(score, model) : "brak danych",
        description: values.length
          ? getMaturityDescription(score, model)
          : "Brak wystarczających danych do oceny tego wymiaru.",
      };
    }
  );

  const decisionBuckets = model.questions.reduce((acc, question) => {
    const value = answers[question.id];
    if (value === undefined) return acc;

    if (!acc[question.decision_id]) {
      acc[question.decision_id] = [];
    }

    acc[question.decision_id].push(value);
    return acc;
  }, {} as Record<string, number[]>);

   const decisionResults: ExecutiveDecision[] = model.decisions
     .map((decision) => {
       const values = decisionBuckets[decision.id] ?? [];
       const hasData = values.length > 0;
       const score = hasData ? average(values) : 0;
 
       return {
         id: decision.id,
         name: decisionMap[decision.id]?.name_pl || decision.id,
         score,
         label: hasData ? getMaturityLabel(score, model) : "brak danych",
         hasData,
       };
     })
     .sort((a, b) => {
       if (a.hasData && !b.hasData) return -1;
       if (!a.hasData && b.hasData) return 1;
       return a.score - b.score;
     });

  const questionRecommendations: ExecutiveRecommendation[] = model.questions
    .filter((q) => answers[q.id] !== undefined)
    .flatMap((q) => buildRecommendations(q, answers[q.id], model));

  const aggregatedRecommendations = sortRecommendations(questionRecommendations);

  return {
    answeredEntries,
    overallScore,
    dimensionResults,
    decisionResults,
    aggregatedRecommendations,
    topRecommendations: aggregatedRecommendations.slice(0, 8),
  };
}