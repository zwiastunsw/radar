import { executiveDecisionMeta, executiveNarratives } from "./executive.content";
import type {
  AreaKey,
  AreaScore,
  DecisionResult,
  ExecutivePriorityDecision,
  ExecutiveSummaryData,
  MaturityLevel,
} from "./executive.types";

const areaOrder: AreaKey[] = [
  "strategiczne",
  "informacja",
  "uslugi",
  "systemy",
  "zamowienia",
];

export function getMaturityLevelFromScore(score: number): MaturityLevel {
  if (score < 0.75) return "poczatkowy";
  if (score < 1.5) return "porzadkowania";
  if (score < 2.25) return "integracji";
  return "dojrzalosci";
}

export function clampScore(score: number, min = 0, max = 3): number {
  return Math.min(max, Math.max(min, score));
}

export function getAreaLabel(area: AreaKey): string {
  const labels: Record<AreaKey, string> = {
    strategiczne: "Decyzje strategiczne",
    informacja: "Zarządzanie informacją",
    uslugi: "Usługi cyfrowe",
    systemy: "Systemy informatyczne",
    zamowienia: "Zakupy i zamówienia publiczne",
  };

  return labels[area];
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

export function getScoreSpread(areaScores: AreaScore[]): number {
  if (!areaScores.length) return 0;

  const values = areaScores.map((item) => item.score);
  return Math.max(...values) - Math.min(...values);
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

export function getDecisionPriority(params: {
  score: number;
  systemImpact: number;
  leadershipWeight: number;
  area: AreaKey;
}): number {
  const deficit = 3 - clampScore(params.score);

  const strategicBoost = params.area === "strategiczne" ? 1.5 : 0;
  const veryLowScoreBoost = params.score <= 1 ? 1 : 0;

  return deficit * 3 + params.systemImpact * 2 + params.leadershipWeight * 2 + strategicBoost + veryLowScoreBoost;
}

export function getTopExecutiveDecisions(
  decisionResults: DecisionResult[],
  limit = 3,
): ExecutivePriorityDecision[] {
  const enriched = decisionResults
    .map((decision) => {
      const meta = executiveDecisionMeta[decision.id];
      if (!meta) return null;

      const priorityScore = getDecisionPriority({
        score: decision.score,
        systemImpact: meta.systemImpact,
        leadershipWeight: meta.leadershipWeight,
        area: decision.area,
      });

      return {
        id: decision.id,
        title: decision.title,
        area: decision.area,
        areaLabel: getAreaLabel(decision.area),
        score: decision.score,
        priorityScore,
        executiveTitle: meta.executiveTitle,
        whyItMatters: meta.whyItMatters,
        impact: meta.impact,
        timeframe: meta.timeframe,
      } satisfies ExecutivePriorityDecision;
    })
    .filter(Boolean) as ExecutivePriorityDecision[];

  const sorted = enriched.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;

    const areaDelta = areaOrder.indexOf(a.area) - areaOrder.indexOf(b.area);
    if (areaDelta !== 0) return areaDelta;

    return a.score - b.score;
  });

  return sorted.slice(0, limit);
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