import assessmentModel from "./assessment-questions.json";

export type AssessmentModel = typeof assessmentModel;
export type Question = AssessmentModel["questions"][number];
export type Dimension = AssessmentModel["dimensions"][number];
export type Decision = AssessmentModel["decisions"][number];

export type AnswersState = Record<string, number | undefined>;
export type NotesState = Record<string, string | undefined>;
export type Stage = "intro" | "form" | "results";

export type AssessmentMetadata = {
  organization: string;
  assessmentDate: string;
  previousAssessmentDate: string;
  assessor: string;
  mode: "individual" | "team";
  notes: string;
};

export type ExecutiveDimension = {
  id: string;
  name: string;
  score: number;
  label: string;
  description: string;
};

export type ExecutiveDecision = {
  id: string;
  name: string;
  score: number;
  label: string;
  hasData: boolean;
};

export type RecommendationType = "strategic" | "systemic" | "operational";
export type RecommendationLevel = "low" | "medium" | "high";

export type EmbeddedRecommendationSet = Partial<
  Record<RecommendationType, string>
>;

export type EmbeddedQuestionRecommendations = Partial<
  Record<RecommendationLevel, EmbeddedRecommendationSet>
>;

export type RecommendationMapping = Record<
  "0" | "1" | "2" | "3" | "4",
  RecommendationLevel | null
>;

export type ExecutiveRecommendation = {
  key: string;
  questionId: string;
  questionName: string;
  dimensionId: string;
  decisionId: string;
  level: RecommendationLevel;
  priority: "high" | "medium" | "low";
  type: RecommendationType;
  text: string;
};
  // --- NOTES ---
  
 export type AssessmentNoteEntry = {
   questionId: string;
   questionName: string;
   dimensionId: string;
   decisionId: string;
   note: string;
 };
 
 // --- SCORING ---

export type DimensionThreshold = {
  min: number;
  max: number;
  label: string;
  description: string;
};

export type ModelScoring = AssessmentModel["scoring"];

export type ModelRecommendationsConfig = AssessmentModel["recommendations"];