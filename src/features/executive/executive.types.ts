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

export interface AreaScore {
  key: AreaKey;
  label: string;
  score: number; // 0-3
}

export interface DecisionResult {
  id: string;
  title: string;
  area: AreaKey;
  score: number; // 0-3
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
  timeframe: ExecutiveDecisionMeta["timeframe"];
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

export interface OrganizationMetadata {
  organizationName?: string;
  unitName?: string;
  assessmentDate?: string;
}