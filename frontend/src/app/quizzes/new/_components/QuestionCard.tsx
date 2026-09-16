"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext, useWatch, type UseFieldArrayUpdate } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { CheckboxOptions } from "./CheckboxOptions";
import { MAX_TEXT_LENGTH, defaultQuestion, type QuestionFormType, type QuizFormValues } from "./formSchema";

const TYPE_OPTIONS: { value: QuestionFormType; label: string }[] = [
  { value: "BOOLEAN", label: "Yes/No" },
  { value: "INPUT", label: "Short answer" },
  { value: "CHECKBOX", label: "Multiple choice" },
];

const YES_NO_OPTIONS = [
  { value: "yes" as const, label: "Yes" },
  { value: "no" as const, label: "No" },
];

export function QuestionCard({
  questionIndex,
  onRemove,
  update,
}: {
  questionIndex: number;
  onRemove: () => void;
  update: UseFieldArrayUpdate<QuizFormValues, "questions">;
}) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<QuizFormValues>();
  const type = useWatch({ control, name: `questions.${questionIndex}.type` });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // RHF's FieldErrors type doesn't discriminate cleanly across a zod
  // discriminated union's variants — narrow with a light, local cast.
  const questionErrors = errors.questions?.[questionIndex] as
    | { text?: { message?: string }; correctText?: { message?: string } }
    | undefined;

  function handleTypeChange(nextType: QuestionFormType) {
    if (nextType === type) return;
    const currentText = getValues(`questions.${questionIndex}.text`);
    update(questionIndex, defaultQuestion(nextType, currentText));
  }

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 transition-all duration-[var(--duration-base)] ease-standard ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg text-ink">Question {questionIndex + 1}</h2>
        <Button
          type="button"
          variant="danger-ghost"
          size="sm"
          icon={<Trash2 />}
          aria-label={`Remove question ${questionIndex + 1}`}
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Question type</span>
        <SegmentedControl
          name={`question-${questionIndex}-type`}
          value={type}
          onChange={handleTypeChange}
          options={TYPE_OPTIONS}
          aria-label={`Question ${questionIndex + 1} type`}
        />
      </div>

      <FormField
        id={`question-${questionIndex}-text`}
        label="Question text"
        required
        error={questionErrors?.text?.message}
      >
        <Input
          placeholder="Type your question"
          maxLength={MAX_TEXT_LENGTH}
          {...register(`questions.${questionIndex}.text`)}
        />
      </FormField>

      {type === "BOOLEAN" && (
        <Controller
          control={control}
          name={`questions.${questionIndex}.correctBoolean`}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">
                Correct answer
                <span aria-hidden="true" className="text-danger">
                  {" "}
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>
              <SegmentedControl
                name={`question-${questionIndex}-correct`}
                value={field.value ? "yes" : "no"}
                onChange={(value) => field.onChange(value === "yes")}
                options={YES_NO_OPTIONS}
                aria-label={`Question ${questionIndex + 1} correct answer`}
              />
            </div>
          )}
        />
      )}

      {type === "INPUT" && (
        <FormField
          id={`question-${questionIndex}-answer`}
          label="Correct answer"
          required
          error={questionErrors?.correctText?.message}
        >
          <Input
            placeholder="Expected answer"
            maxLength={MAX_TEXT_LENGTH}
            {...register(`questions.${questionIndex}.correctText`)}
          />
        </FormField>
      )}

      {type === "CHECKBOX" && <CheckboxOptions questionIndex={questionIndex} />}
    </div>
  );
}

export default QuestionCard;
