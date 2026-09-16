"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useFormContext, type FieldErrors } from "react-hook-form";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { QuestionList } from "@/components/quiz/QuestionList";
import { ApiError } from "@/lib/api/client";
import { createQuiz, updateQuiz } from "@/lib/api/quizzes";
import { DRAFT_STORAGE_KEY } from "./NewQuizWizard";
import {
  toCreateQuizInput,
  toQuestionResponses,
  type QuizFormValues,
} from "./formSchema";

/** Recursively counts leaf error messages in an RHF error tree — not pixel-perfect, just enough to tell the user "N issues". */
function countFieldErrors(errors: FieldErrors): number {
  let count = 0;
  for (const value of Object.values(errors)) {
    if (!value || typeof value !== "object") continue;
    if ("message" in value && typeof value.message === "string") {
      count += 1;
    } else {
      count += countFieldErrors(value as FieldErrors);
    }
  }
  return count;
}

/** When `quizId` is set, this step saves changes to that existing quiz instead of creating a new one. */
export function PreviewStep({ quizId }: { quizId?: string } = {}) {
  const router = useRouter();
  const toast = useToast();
  const methods = useFormContext<QuizFormValues>();
  const { getValues, formState, trigger } = methods;
  const [submitError, setSubmitError] = useState<string[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fields not yet blurred have no error populated yet (mode: "onBlur") — validate the
  // whole form once the user reaches this step so the Publish gate is accurate.
  // `trigger` is stable across renders; the wrapping `methods` object from
  // useFormContext() is NOT (FormProvider re-memoizes it on every formState change),
  // so depending on `[methods]` here caused an infinite validate-loop that froze the tab.
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = getValues();
  const errorCount = countFieldErrors(formState.errors);
  const canPublish = errorCount === 0;

  async function onPublish() {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const input = toCreateQuizInput(getValues());
      if (quizId) {
        await updateQuiz(quizId, input);
        router.push(`/quizzes/${quizId}`);
      } else {
        const created = await createQuiz(input);
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
          // ignore — nothing to clean up if storage isn't available
        }
        router.push(`/quizzes/${created.id}`);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.messages);
      } else {
        toast.show(
          quizId
            ? "Couldn't save changes. Try again."
            : "Couldn't create this quiz. Try again.",
          "error",
        );
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-lg text-ink">
          {values.title || "Untitled quiz"}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {values.questions.length} question
          {values.questions.length === 1 ? "" : "s"}
        </p>
      </div>

      <QuestionList questions={toQuestionResponses(values.questions)} />

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger"
        >
          <p className="font-medium">
            {quizId ? "Couldn't save changes" : "Couldn't create this quiz"}
          </p>
          <ul className="mt-1 list-disc pl-5">
            {submitError.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col items-start gap-2">
        <Button
          type="button"
          variant="primary"
          icon={<Check />}
          loading={submitting}
          disabled={!canPublish}
          onClick={onPublish}
        >
          {quizId
            ? submitting
              ? "Saving…"
              : "Save changes"
            : submitting
              ? "Publishing…"
              : "Publish quiz"}
        </Button>
        {!canPublish && (
          <p className="text-xs text-danger">
            Fix {errorCount} issue{errorCount === 1 ? "" : "s"} before{" "}
            {quizId ? "saving" : "publishing"}.
          </p>
        )}
      </div>
    </div>
  );
}

export default PreviewStep;
