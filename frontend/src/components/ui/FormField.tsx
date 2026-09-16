import { cloneElement, isValidElement, type ReactElement } from "react";

export interface FormFieldProps {
  /** Required — used to generate the label's `htmlFor` and wire up aria attributes on the control. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** The form control (Input/Textarea/etc.) — cloned to inject `id`, `aria-invalid`, and `aria-describedby`. */
  children: ReactElement<Record<string, unknown>>;
}

/** Label + control + hint/error, wired up for accessibility. Callers don't hand-wire ids themselves. */
export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-danger">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
