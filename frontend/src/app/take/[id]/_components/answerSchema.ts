import { z } from "zod";
import type { AnswerInput, QuestionResponse } from "@/lib/api/types";

/**
 * Answer values are keyed by question id (not array index — respondents never reorder
 * or add/remove questions, so there's no field-array churn to guard against). Each
 * field's shape depends on that question's type; built per-quiz since the question set
 * is only known once the quiz loads.
 */
export type AnswerFormValues = Record<string, "yes" | "no" | string | string[]>;

/** The exact field shape only exists per-quiz, built at runtime — callers cast the resolver to `AnswerFormValues`, RHF's target type. */
export function buildAnswerSchema(questions: QuestionResponse[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const question of questions) {
    switch (question.type) {
      case "BOOLEAN":
        shape[question.id] = z.enum(["yes", "no"], { message: "Answer this question" });
        break;
      case "INPUT":
        shape[question.id] = z.string().trim().min(1, "Answer this question");
        break;
      case "CHECKBOX":
        shape[question.id] = z.array(z.string()).min(1, "Select at least one option");
        break;
    }
  }
  return z.object(shape);
}

export function defaultAnswerValues(questions: QuestionResponse[]): AnswerFormValues {
  const values: AnswerFormValues = {};
  for (const question of questions) {
    values[question.id] = question.type === "CHECKBOX" ? [] : "";
  }
  return values;
}

/** Flattens the per-question-type UI values into the wire shape the submissions API expects. */
export function toAnswerInputs(questions: QuestionResponse[], values: AnswerFormValues): AnswerInput[] {
  return questions.map((question) => {
    const value = values[question.id];
    switch (question.type) {
      case "BOOLEAN":
        return { questionId: question.id, booleanValue: value === "yes" };
      case "INPUT":
        return { questionId: question.id, textValue: value as string };
      case "CHECKBOX":
        return { questionId: question.id, selectedOptions: value as string[] };
    }
  });
}
