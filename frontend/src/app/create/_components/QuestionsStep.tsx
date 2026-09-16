"use client";

import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "@/components/ui/Button";
import {
  MAX_QUESTIONS_PER_QUIZ,
  defaultQuestion,
  type QuizFormValues,
} from "./formSchema";
import { QuestionCard } from "./QuestionCard";

export function QuestionsStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
  });

  const questionsListError =
    errors.questions?.root?.message ?? errors.questions?.message;

  return (
    <div className="flex flex-col">
      {/* pb-24 keeps the last card clear of the sticky "Add question" bar below, for both scroll and keyboard-tab visibility */}
      <div className="flex flex-col gap-4 pb-24">
        {fields.length === 0 && (
          <p className="text-sm text-ink-muted">
            No questions yet. Add your first one below.
          </p>
        )}

        {fields.map((field, index) => (
          <QuestionCard
            key={field.id}
            questionIndex={index}
            onRemove={() => remove(index)}
            update={update}
          />
        ))}

        {questionsListError && (
          <p className="text-sm text-danger">{questionsListError}</p>
        )}
      </div>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-paper/95 py-4 backdrop-blur">
        <Button
          type="button"
          variant="secondary"
          icon={<Plus />}
          disabled={fields.length >= MAX_QUESTIONS_PER_QUIZ}
          onClick={() => append(defaultQuestion("BOOLEAN"))}
        >
          Add question
        </Button>
        {fields.length >= MAX_QUESTIONS_PER_QUIZ && (
          <p className="text-xs text-ink-muted">
            {MAX_QUESTIONS_PER_QUIZ} questions max
          </p>
        )}
      </div>
    </div>
  );
}

export default QuestionsStep;
