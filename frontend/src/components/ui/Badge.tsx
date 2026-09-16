import type { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/** Small tinted pill. Label text (e.g. a question-type name) is supplied by the caller. */
export function Badge({ className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
