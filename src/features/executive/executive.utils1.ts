import { executiveDecisionMeta, executiveNarratives } from "./executive.content";
import type {
  AreaKey,
  AreaScore,
  DecisionScore,
  ExecutivePriorityDecision,
  ExecutiveSummaryData,
  MaturityLevel,
  MaturityValue,
  Question,
  ResponsesMap,
} from "./executive.types";

const AREA_LABELS: Record<AreaKey, string> = {
  strategiczne: "Decyzje strategiczne",
  informacja: "Zarządzanie informacją",
  uslugi: "Usługi cyfrowe",
  systemy: "Systemy informatyczne",
  zamowienia: "Zakupy i zamówienia publiczne",
};

const AREA_ORDER: AreaKey[] = [
  "strategiczne",
  "informacja",
  "uslugi",
  "systemy",
  "zamowienia",
];

function isAnswered(value: MaturityValue | undefined): value is MaturityValue {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getAreaLabel(area: AreaKey): string {
  return AREA_LABELS[area];
}

export function getMaturityLevelFromScore(score: number): MaturityLevel {
  if (score < 0.75) return "poczatkowy";
  if (score < 1.5) return "porzadkowania";
  if (score < 2.25) return "integracji";
  return "dojrzalosci";
}

export function formatMaturityLevelLabel(level: MaturityLevel): string {
  const labels: Record<MaturityLevel, string> = {
    poczatkowy: "Poziom początkowy",
    porzadkowania: "Poziom porządkowania",
    integracji: "Poziom integracji",
    dojrzalosci: "Poziom dojrzałości",
  };

  return labels[level];
}

export function formatScore(score: number): string {
  return score.toFixed(2).replace(".", ",");
}

export function getOverallScore(questions: Question[], responses: ResponsesMap): number {
  const values = questions
    .map((question) => responses[question.id])
    .filter(isAnswered);

  return average(values);
}

export function getAreaScores(questions: Question[], responses: ResponsesMap): AreaScore[] {
  return AREA_ORDER.map((areaKey) => {
    const areaQuestions = questions.filter((question) => question.area === areaKey);
    const answeredValues = areaQuestions
      .map((question) => responses[question.id])
      .filter(isAnswered);

    return {
      key: areaKey,
      label: AREA_LABELS[areaKey],
      score: average(answeredValues),
      answeredCount: answeredValues.length,
      totalQuestions: areaQuestions.length,
    };
  });
}

export function getDecisionScores(
  questions: Question[],
  responses: ResponsesMap,
): DecisionScore[] {
  const decisionMap = new Map<string, Question[]>();

  for (const question of questions) {
    const list = decisionMap.get(question.decisionId) ?? [];
    list.push(question);
    decisionMap.set(question.decisionId, list);
  }

  return Array.from(decisionMap.entries()).map(([decisionId, decisionQuestions]) => {
    const answeredValues = decisionQuestions
      .map((question) => responses[question.id])
      .filter(isAnswered);

    return {
      decisionId,
      area: decisionQuestions[0]?.area ?? "strategiczne",
      title: decisionQuestions[0]?.title ?? decisionId,
      score: average(answeredValues),
      answeredCount: answeredValues.length,
      totalQuestions: decisionQuestions.length,
    };
  });
}

export function getScoreSpread(areaScores: AreaScore[]): number {
  if (!areaScores.length) return 0;
  const values = areaScores.map((item) => item.score);
  return Math.max(...values) - Math.min(...values);
}

export function getStrongestAndWeakestAreas(areaScores: AreaScore[]) {
  if (!areaScores.length) {
    return { strongestArea: undefined, weakestArea: undefined };
  }

  const sorted = [...areaScores].sort((a, b) => b.score - a.score);

  return {
    strongestArea: sorted[0],
    weakestArea: sorted[sorted.length - 1],
  };
}

export function buildExecutiveSummary(params: {
  overallScore: number;
  areaScores: AreaScore[];
}): ExecutiveSummaryData {
  const level = getMaturityLevelFromScore(params.overallScore);
  const narrative = executiveNarratives[level];
  const { strongestArea, weakestArea } = getStrongestAndWeakestAreas(params.areaScores);
  const spread = getScoreSpread(params.areaScores);

  let variabilityText = "";
  if (spread >= 1.2) {
    variabilityText =
      " Wyniki między obszarami są wyraźnie nierówne, co sugeruje, że organizacja rozwija się niespójnie i wymaga silniejszego powiązania działań.";
  } else if (spread >= 0.6) {
    variabilityText =
      " Wyniki między obszarami są umiarkowanie zróżnicowane, co wskazuje na częściową nierównowagę rozwoju.";
  } else {
    variabilityText =
      " Wyniki między obszarami są względnie spójne, co sugeruje podobny etap rozwoju całej organizacji.";
  }

  const strongestText = strongestArea
    ? `Najsilniejszym obszarem jest ${strongestArea.label}.`
    : "";

  const weakestText = weakestArea
    ? `Najwięcej uwagi wymaga obszar: ${weakestArea.label}.`
    : "";

  return {
    level,
    headline: narrative.headline,
    summary: `${narrative.summary}${variabilityText}`,
    strengthsText: `${narrative.strengthsLabel} ${strongestText}`.trim(),
    risksText: `${narrative.risksLabel} ${weakestText}`.trim(),
    nextStep: narrative.nextStep,
    strongestArea,
    weakestArea,
    spread,
  };
}

function getDecisionPriority(params: {
  score: number;
  systemImpact: number;
  leadershipWeight: number;
  area: AreaKey;
}): number {
  const deficit = 3 - params.score;
  const strategicBoost = params.area === "strategiczne" ? 1.5 : 0;
  const veryLowScoreBoost = params.score <= 1 ? 1 : 0;

  return (
    deficit * 3 +
    params.systemImpact * 2 +
    params.leadershipWeight * 2 +
    strategicBoost +
    veryLowScoreBoost
  );
}

export function getTopExecutiveDecisions(
  decisionScores: DecisionScore[],
  limit = 3,
): ExecutivePriorityDecision[] {
  const enriched = decisionScores
    .map((decision) => {
      const meta = executiveDecisionMeta[decision.decisionId];
      if (!meta) return null;

      return {
        id: decision.decisionId,
        title: decision.title,
        area: decision.area,
        areaLabel: getAreaLabel(decision.area),
        score: decision.score,
        priorityScore: getDecisionPriority({
          score: decision.score,
          systemImpact: meta.systemImpact,
          leadershipWeight: meta.leadershipWeight,
          area: decision.area,
        }),
        executiveTitle: meta.executiveTitle,
        whyItMatters: meta.whyItMatters,
        impact: meta.impact,
        timeframe: meta.timeframe,
      } satisfies ExecutivePriorityDecision;
    })
    .filter(Boolean) as ExecutivePriorityDecision[];

  return enriched
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }

      const areaDiff = AREA_ORDER.indexOf(a.area) - AREA_ORDER.indexOf(b.area);
      if (areaDiff !== 0) return areaDiff;

      return a.score - b.score;
    })
    .slice(0, limit);
}

export function buildExecutiveModuleData(
  questions: Question[],
  responses: ResponsesMap,
) {
  const overallScore = getOverallScore(questions, responses);
  const areaScores = getAreaScores(questions, responses);
  const decisionScores = getDecisionScores(questions, responses);
  const executiveSummary = buildExecutiveSummary({ overallScore, areaScores });
  const topExecutiveDecisions = getTopExecutiveDecisions(decisionScores, 3);

  return {
    overallScore,
    areaScores,
    decisionScores,
    executiveSummary,
    topExecutiveDecisions,
  };
}