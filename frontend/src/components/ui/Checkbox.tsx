import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className = "", ...props },
  ref,
) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-ink">
      <input ref={ref} type="checkbox" id={id} className={`peer sr-only ${className}`} {...props} />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-transparent transition-colors duration-[var(--duration-fast)] peer-checked:border-accent peer-checked:bg-accent peer-checked:text-surface peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      </span>
      {label}
    </label>
  );
});

export default Checkbox;
