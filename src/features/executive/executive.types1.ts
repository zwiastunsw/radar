export type MaturityLevel =
  | "poczatkowy"
  | "porzadkowania"
  | "integracji"
  | "dojrzalosci";

export type AreaKey =
  | "strategiczne"
  | "informacja"
  | "uslugi"
  | "systemy"
  | "zamowienia";

export type MaturityValue = 0 | 1 | 2 | 3;

export interface AnswerOption {
  value: MaturityValue;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  area: AreaKey;
  decisionId: string; // np. D1-D15
  title: string;
  text: string;
  answers: AnswerOption[];
}

export type ResponsesMap = Record<string, MaturityValue | undefined>;

export interface AssessmentMetadata {
  organizationName?: string;
  unitName?: string;
  assessmentDate?: string;
}

export interface AreaScore {
  key: AreaKey;
  label: string;
  score: number;
  answeredCount: number;
  totalQuestions: number;
}

export interface DecisionScore {
  decisionId: string;
  area: AreaKey;
  title: string;
  score: number;
  answeredCount: number;
  totalQuestions: number;
}

export interface ExecutiveNarrative {
  headline: string;
  summary: string;
  strengthsLabel: string;
  risksLabel: string;
  nextStep: string;
}

export interface ExecutiveDecisionMeta {
  id: string;
  executiveTitle: string;
  whyItMatters: string;
  impact: string;
  timeframe: "teraz" | "najblizsze_miesiace" | "utrwalic";
  systemImpact: 1 | 2 | 3;
  leadershipWeight: 1 | 2 | 3;
}

export interface ExecutivePriorityDecision {
  id: string;
  title: string;
  area: AreaKey;
  areaLabel: string;
  score: number;
  priorityScore: number;
  executiveTitle: string;
  whyItMatters: string;
  impact: string;
  timeframe: "teraz" | "najblizsze_miesiace" | "utrwalic";
}

export interface ExecutiveSummaryData {
  level: MaturityLevel;
  headline: string;
  summary: string;
  strengthsText: string;
  risksText: string;
  nextStep: string;
  strongestArea?: AreaScore;
  weakestArea?: AreaScore;
  spread: number;
}