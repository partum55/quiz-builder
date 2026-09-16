import { forwardRef, type TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`min-h-11 w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition-colors duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger ${className}`}
        {...props}
      />
    );
  },
);

export default Textarea;
