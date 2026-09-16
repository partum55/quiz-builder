import { z } from "zod";
import type { CreateQuizInput, QuestionInput, QuestionResponse } from "@/lib/api/types";

/**
 * Form-only (UI) schema. A CHECKBOX question's options are tracked as
 * `{ value, correct }` rather than a plain `string[]` + a value-keyed
 * `correctOptions: string[]` — correctness lives next to the text, indexed
 * by field array position, so editing an option's text can never desync
 * which one is marked correct. `toCreateQuizInput` below flattens to the
 * backend's `options`/`correctOptions` string-array shape only once, at
 * submit time. Limits here mirror `backend/src/quizzes/dto/limits.ts` —
 * keep both in sync.
 */

// Mirrors backend/src/quizzes/dto/limits.ts — keep these two in sync.
export const MAX_QUESTIONS_PER_QUIZ = 50;
export const MAX_OPTIONS_PER_QUESTION = 10;
export const MAX_TEXT_LENGTH = 500;

const textField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(MAX_TEXT_LENGTH, `${label} must be ${MAX_TEXT_LENGTH} characters or fewer`);

const booleanQuestionUi = z.object({
  type: z.literal("BOOLEAN"),
  text: textField("Question text"),
  correctBoolean: z.boolean(),
});

const inputQuestionUi = z.object({
  type: z.literal("INPUT"),
  text: textField("Question text"),
  correctText: textField("Answer"),
});

const checkboxOptionUi = z.object({
  value: textField("Option"),
  correct: z.boolean(),
});

const checkboxQuestionUi = z
  .object({
    type: z.literal("CHECKBOX"),
    text: textField("Question text"),
    options: z
      .array(checkboxOptionUi)
      .min(2, "Add at least 2 options")
      .max(MAX_OPTIONS_PER_QUESTION, `You can add up to ${MAX_OPTIONS_PER_QUESTION} options`),
  })
  .refine((q) => q.options.some((o) => o.correct), {
    message: "Select at least one correct answer",
    path: ["options"],
  })
  .refine((q) => new Set(q.options.map((o) => o.value)).size === q.options.length, {
    message: "Options must be unique",
    path: ["options"],
  });

/** Exported so the wizard can check "is this one question valid?" (Questions step completion) without duplicating the union. */
export const questionUiSchema = z.discriminatedUnion("type", [
  booleanQuestionUi,
  inputQuestionUi,
  checkboxQuestionUi,
]);

export const quizFormSchema = z.object({
  title: textField("Title"),
  questions: z
    .array(questionUiSchema)
    .min(1, "Add at least one question")
    .max(MAX_QUESTIONS_PER_QUIZ, `You can add up to ${MAX_QUESTIONS_PER_QUIZ} questions`),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = QuizFormValues["questions"][number];
export type QuestionFormType = QuestionFormValues["type"];

/** Fresh default object for a question of the given type — used both for "Add question" and for a type switch (see QuestionsStep/QuestionCard: switching type replaces the whole object via `update`, never patches individual fields across a shape change). */
export function defaultQuestion(type: QuestionFormType, text = ""): QuestionFormValues {
  switch (type) {
    case "BOOLEAN":
      return { type: "BOOLEAN", text, correctBoolean: true };
    case "INPUT":
      return { type: "INPUT", text, correctText: "" };
    case "CHECKBOX":
      return {
        type: "CHECKBOX",
        text,
        options: [
          { value: "", correct: false },
          { value: "", correct: false },
        ],
      };
  }
}

/** Flattens one UI-shaped question to the wire shape — shared by `toCreateQuizInput` and `toQuestionResponses` so the CHECKBOX options→correctOptions flattening only happens in one place. */
function toQuestionInput(q: QuestionFormValues): QuestionInput {
  if (q.type !== "CHECKBOX") return q;
  return {
    type: "CHECKBOX",
    text: q.text,
    options: q.options.map((o) => o.value),
    correctOptions: q.options.filter((o) => o.correct).map((o) => o.value),
  };
}

/** Flattens the UI shape to the wire shape the API client expects. */
export function toCreateQuizInput(values: QuizFormValues): CreateQuizInput {
  return {
    title: values.title,
    questions: values.questions.map(toQuestionInput),
  };
}

/**
 * Adapts in-progress form values into the `QuestionResponse[]` shape the shared
 * `QuestionList` component (built for the detail page) expects, so the Preview step
 * can reuse it. `id`/`order` are synthetic (array index) since nothing here is
 * persisted yet.
 */
export function toQuestionResponses(questions: QuestionFormValues[]): QuestionResponse[] {
  return questions.map((q, index) => {
    const input = toQuestionInput(q);
    return {
      id: `draft-${index}`,
      order: index,
      text: input.text,
      type: input.type,
      correctBoolean: input.type === "BOOLEAN" ? input.correctBoolean : null,
      correctText: input.type === "INPUT" ? input.correctText : null,
      options: input.type === "CHECKBOX" ? input.options : null,
      correctOptions: input.type === "CHECKBOX" ? input.correctOptions : null,
    };
  });
}
