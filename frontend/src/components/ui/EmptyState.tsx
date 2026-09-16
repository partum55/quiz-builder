import { FileQuestion } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  heading?: string;
  message: string;
  /** Optional action, e.g. a button/link. Copy and behavior are the caller's responsibility. */
  children?: ReactNode;
}

/** Quiet, centered "nothing here" placeholder. No copy is hardcoded — pass your own heading/message. */
export function EmptyState({ heading, message, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <FileQuestion className="h-8 w-8 text-ink-muted" aria-hidden="true" />
      {heading && <h2 className="text-md font-medium text-ink">{heading}</h2>}
      <p className="max-w-sm text-sm text-ink-muted">{message}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default EmptyState;
