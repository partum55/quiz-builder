export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

/** Mirrors the backend's cross-field rule: each variant sets only the fields relevant to its type. */
export type QuestionInput =
  | { type: "BOOLEAN"; text: string; correctBoolean: boolean }
  | { type: "INPUT"; text: string; correctText: string }
  | { type: "CHECKBOX"; text: string; options: string[]; correctOptions: string[] };

export interface CreateQuizInput {
  title: string;
  questions: QuestionInput[];
}

export interface QuizSummary {
  id: string;
  title: string;
  /** ISO date string as sent over JSON — not a Date. */
  createdAt: string;
  questionCount: number;
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  correctBoolean: boolean | null;
  correctText: string | null;
  options: string[] | null;
  correctOptions: string[] | null;
}

export interface QuizDetail {
  id: string;
  title: string;
  createdAt: string;
  questions: QuestionResponse[];
}

/** Mirrors the backend's per-question-type answer shape — one respondent's answer to one question. */
export interface AnswerInput {
  questionId: string;
  booleanValue?: boolean;
  textValue?: string;
  selectedOptions?: string[];
}

export interface SubmissionInput {
  respondentName: string;
  answers: AnswerInput[];
}

export interface SubmissionSummary {
  id: string;
  respondentName: string;
  /** ISO date string as sent over JSON — not a Date. */
  submittedAt: string;
  score: number;
}

export interface SubmissionCreated {
  id: string;
  score: number;
}
