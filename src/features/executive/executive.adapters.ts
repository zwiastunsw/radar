import type { Question } from "./executive.types";

type RawQuestion = {
  id: string;
  section?: string;
  area?: string;
  title: string;
  text: string;
  answers: Array<{ value: 0 | 1 | 2 | 3; label: string; description?: string }>;
};

const QUESTION_TO_DECISION: Record<string, string> = {
  q1: "D1",
  q2: "D1",
  q3: "D2",
  q4: "D2",
  q5: "D3",
  q6: "D3",
  q7: "D4",
  q8: "D5",
  q9: "D6",
  q10: "D7",
  q11: "D8",
  q12: "D9",
  q13: "D10",
  q14: "D11",
  q15: "D12",
  q16: "D13",
  q17: "D14",
  q18: "D15",
};

function normalizeArea(value?: string): Question["area"] {
  switch (value) {
    case "strategiczne":
      return "strategiczne";
    case "informacja":
      return "informacja";
    case "uslugi":
      return "uslugi";
    case "systemy":
      return "systemy";
    case "zamowienia":
      return "zamowienia";
    default:
      return "strategiczne";
  }
}

export function adaptQuestions(rawQuestions: RawQuestion[]): Question[] {
  return rawQuestions.map((question) => ({
    id: question.id,
    area: normalizeArea(question.area ?? question.section),
    decisionId: QUESTION_TO_DECISION[question.id] ?? "D1",
    title: question.title,
    text: question.text,
    answers: question.answers,
  }));
}