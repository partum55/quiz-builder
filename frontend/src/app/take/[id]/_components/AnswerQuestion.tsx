"use client";

import { Controller, useFormContext, type FieldErrors } from "react-hook-form";
import Checkbox from "@/components/ui/Checkbox";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import SegmentedControl from "@/components/ui/SegmentedControl";
import type { QuestionResponse } from "@/lib/api/types";
import type { AnswerFormValues } from "./answerSchema";

const YES_NO_OPTIONS = [
  { value: "yes" as const, label: "Yes" },
  { value: "no" as const, label: "No" },
];

export function AnswerQuestion({ question, index }: { question: QuestionResponse; index: number }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AnswerFormValues>();
  const error = (errors as FieldErrors<Record<string, { message?: string }>>)[question.id]?.message as
    | string
    | undefined;

  return (
    <div className="flex flex-col gap-3 border-t border-border py-6 first:border-t-0 first:pt-0">
      <p className="text-sm font-medium text-ink">
        {index + 1}. {question.text}
      </p>

      {question.type === "BOOLEAN" && (
        <Controller
          control={control}
          name={question.id}
          render={({ field }) => (
            <SegmentedControl
              name={`answer-${question.id}`}
              value={(field.value as "yes" | "no") ?? ""}
              onChange={field.onChange}
              options={YES_NO_OPTIONS}
              aria-label={`Answer to question ${index + 1}`}
            />
          )}
        />
      )}

      {question.type === "INPUT" && (
        <FormField id={`answer-${question.id}`} label="Your answer" error={error}>
          <Input placeholder="Type your answer" {...register(question.id)} />
        </FormField>
      )}

      {question.type === "CHECKBOX" && (
        <Controller
          control={control}
          name={question.id}
          render={({ field }) => {
            const selected = (field.value as string[]) ?? [];
            return (
              <div className="flex flex-col gap-2">
                {(question.options ?? []).map((option) => (
                  <Checkbox
                    key={option}
                    id={`answer-${question.id}-${option}`}
                    label={option}
                    checked={selected.includes(option)}
                    onChange={(event) =>
                      field.onChange(
                        event.target.checked ? [...selected, option] : selected.filter((value) => value !== option),
                      )
                    }
                  />
                ))}
              </div>
            );
          }}
        />
      )}

      {error && question.type !== "INPUT" && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export default AnswerQuestion;
