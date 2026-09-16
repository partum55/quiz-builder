"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { ApiError } from "@/lib/api/client";
import { submitQuiz } from "@/lib/api/quizzes";
import type { QuizDetail } from "@/lib/api/types";
import { AnswerQuestion } from "./AnswerQuestion";
import {
  buildAnswerSchema,
  defaultAnswerValues,
  toAnswerInputs,
  type AnswerFormValues,
} from "./answerSchema";

const MAX_NAME_LENGTH = 200;

type Phase = "name" | "answer" | "done";

export function TakeQuizFlow({ quiz }: { quiz: QuizDetail }) {
  const [phase, setPhase] = useState<Phase>("name");
  const [respondentName, setRespondentName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const methods = useForm<AnswerFormValues>({
    resolver: zodResolver(
      buildAnswerSchema(quiz.questions),
    ) as unknown as Resolver<AnswerFormValues>,
    defaultValues: defaultAnswerValues(quiz.questions),
  });

  function handleStartAnswering() {
    const trimmed = respondentName.trim();
    if (!trimmed) {
      setNameError("Enter your name to continue");
      return;
    }
    setRespondentName(trimmed);
    setPhase("answer");
  }

  async function onAnswerSubmit(values: AnswerFormValues) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await submitQuiz(quiz.id, {
        respondentName,
        answers: toAnswerInputs(quiz.questions, values),
      });
      setScore(result.score);
      setPhase("done");
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.messages
          : ["Couldn't submit your answers. Try again."],
      );
      setSubmitting(false);
    }
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <CheckCircle2 className="h-8 w-8 text-correct" aria-hidden="true" />
        <h1 className="font-serif text-xl text-ink">
          Thanks, {respondentName}
        </h1>
        <p className="max-w-sm text-sm text-ink-muted">
          Your answers for &quot;{quiz.title}&quot; have been submitted.
        </p>
        {score !== null && (
          <p className="mt-2 text-lg font-medium text-correct">
            You scored {score} of {quiz.questions.length}
          </p>
        )}
      </div>
    );
  }

  if (phase === "name") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">{quiz.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {quiz.questions.length} question
            {quiz.questions.length === 1 ? "" : "s"}
          </p>
        </div>
        <FormField
          id="respondent-name"
          label="Your name"
          required
          error={nameError ?? undefined}
        >
          <Input
            placeholder="e.g. Ada Lovelace"
            maxLength={MAX_NAME_LENGTH}
            value={respondentName}
            onChange={(event) => {
              setRespondentName(event.target.value);
              setNameError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleStartAnswering();
            }}
          />
        </FormField>
        <div>
          <Button
            variant="primary"
            icon={<ChevronRight />}
            onClick={handleStartAnswering}
          >
            Start
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onAnswerSubmit)}
        className="flex flex-col gap-6"
      >
        <div>
          <h1 className="font-serif text-2xl text-ink">{quiz.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Answer every question, then submit.
          </p>
        </div>

        <div className="flex flex-col">
          {quiz.questions.map((question, index) => (
            <AnswerQuestion
              key={question.id}
              question={question}
              index={index}
            />
          ))}
        </div>

        {submitError && (
          <div
            role="alert"
            className="rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger"
          >
            <ul className="list-disc pl-5">
              {submitError.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <Button type="submit" variant="primary" loading={submitting}>
            {submitting ? "Submitting…" : "Submit answers"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default TakeQuizFlow;
