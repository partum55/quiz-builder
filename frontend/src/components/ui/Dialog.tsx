"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** Must match --duration-base in globals.css (the CSS var can't be read back into a JS timeout). */
const TRANSITION_MS = 200;

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}

/**
 * Built on native <dialog> for free focus-trapping, ESC-to-close, and backdrop semantics.
 * Stays mounted always; `data-state` is flipped a frame after showModal()/before close() so
 * the CSS transition in globals.css (`.qb-dialog`) actually has something to animate between.
 */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<"open" | "closed">("closed");
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() => setState("open"));
      return () => cancelAnimationFrame(frame);
    }

    if (dialog.open) {
      setState("closed");
      const timeout = setTimeout(() => dialog.close(), TRANSITION_MS);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // ESC fires "cancel" natively; intercept so the close animation runs instead of an instant snap.
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      data-state={state}
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="qb-dialog m-auto w-[calc(100vw-2.5rem)] max-w-[480px] rounded-lg border border-border bg-surface p-0 text-ink shadow-elevated"
    >
      <div className="p-6">
        <h2 id={titleId} className="font-serif text-lg font-medium text-ink">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}

export default Dialog;
