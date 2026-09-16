import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

export interface ErrorStateProps {
  heading?: string;
  message: string;
  /** Optional action slot, typically a "Try again" button. */
  children?: ReactNode;
}

/** Same shape as `EmptyState`, for error messaging. */
export function ErrorState({
  heading = "Something went wrong",
  message,
  children,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <AlertCircle className="h-8 w-8 text-ink-muted" aria-hidden="true" />
      <h2 className="text-md font-medium text-ink">{heading}</h2>
      <p className="max-w-sm text-sm text-ink-muted">{message}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default ErrorState;
