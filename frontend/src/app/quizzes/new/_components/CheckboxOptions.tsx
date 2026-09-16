"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, type FieldError } from "react-hook-form";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { MAX_OPTIONS_PER_QUESTION, MAX_TEXT_LENGTH, type QuizFormValues } from "./formSchema";

function OptionRow({
  questionIndex,
  optionIndex,
  onRemove,
  canRemove,
}: {
  questionIndex: number;
  optionIndex: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuizFormValues>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const fieldId = `question-${questionIndex}-option-${optionIndex}`;
  // RHF's FieldErrors type doesn't discriminate cleanly across a zod
  // discriminated union's variants — narrow with a light, local cast.
  const questionErrors = errors.questions?.[questionIndex] as
    | { options?: { message?: string; root?: { message?: string } } & Array<{ value?: FieldError }> }
    | undefined;
  const optionError = questionErrors?.options?.[optionIndex]?.value;

  return (
    <div
      className={`flex items-end gap-2 transition-all duration-[var(--duration-base)] ease-standard ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      <div className="min-w-0 flex-1">
        <FormField id={fieldId} label={`Option ${optionIndex + 1}`} required error={optionError?.message}>
          <Input
            placeholder={`Option ${optionIndex + 1}`}
            maxLength={MAX_TEXT_LENGTH}
            {...register(`questions.${questionIndex}.options.${optionIndex}.value`)}
          />
        </FormField>
      </div>
      <Checkbox
        id={`${fieldId}-correct`}
        label="Correct"
        className="mb-2.5"
        {...register(`questions.${questionIndex}.options.${optionIndex}.correct`)}
      />
      <Button
        type="button"
        variant="danger-ghost"
        size="sm"
        className="mb-0.5"
        icon={<Trash2 />}
        aria-label={`Remove option ${optionIndex + 1}`}
        onClick={onRemove}
        disabled={!canRemove}
      >
        Remove
      </Button>
    </div>
  );
}

export function CheckboxOptions({ questionIndex }: { questionIndex: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const questionErrors = errors.questions?.[questionIndex] as
    | { options?: { message?: string; root?: { message?: string } } }
    | undefined;
  const optionsMessage = questionErrors?.options?.root?.message ?? questionErrors?.options?.message;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-ink">
        Options
        <span aria-hidden="true" className="text-danger">
          {" "}
          *
        </span>
        <span className="sr-only"> (required)</span>
      </span>

      <div className="flex flex-col gap-3">
        {fields.map((field, optionIndex) => (
          <OptionRow
            key={field.id}
            questionIndex={questionIndex}
            optionIndex={optionIndex}
            onRemove={() => remove(optionIndex)}
            canRemove={fields.length > 2}
          />
        ))}
      </div>

      {optionsMessage && <p className="text-xs text-danger">{optionsMessage}</p>}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={<Plus />}
          disabled={fields.length >= MAX_OPTIONS_PER_QUESTION}
          onClick={() => append({ value: "", correct: false })}
        >
          Add option
        </Button>
        {fields.length >= MAX_OPTIONS_PER_QUESTION && (
          <p className="text-xs text-ink-muted">{MAX_OPTIONS_PER_QUESTION} options max</p>
        )}
      </div>
    </div>
  );
}

export default CheckboxOptions;
