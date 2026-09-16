"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Disables both buttons and shows a loading state on the confirm button while a request is in flight. */
  loading?: boolean;
}

/** A `Dialog` preconfigured as a destructive-action confirmation (delete, etc.). */
export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          {title}
        </span>
      }
    >
      {description && <p className="text-sm text-ink-muted">{description}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
