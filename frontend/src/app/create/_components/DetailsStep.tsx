"use client";

import { useFormContext } from "react-hook-form";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { MAX_TEXT_LENGTH, type QuizFormValues } from "./formSchema";

export function DetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  return (
    <FormField id="title" label="Title" required error={errors.title?.message}>
      <Input
        placeholder="e.g. Capitals of Europe"
        maxLength={MAX_TEXT_LENGTH}
        {...register("title")}
      />
    </FormField>
  );
}

export default DetailsStep;
