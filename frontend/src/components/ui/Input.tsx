import { forwardRef, type InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`min-h-11 w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition-colors duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger ${className}`}
      {...props}
    />
  );
});

export default Input;
