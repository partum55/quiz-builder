"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ToastVariant = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3500;
/** Must match --duration-base in globals.css. */
const EXIT_MS = 200;

let nextId = 0;

function ToastRow({ toast, onDone }: { toast: ToastItem; onDone: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true));
    const dismissTimer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(dismissTimer);
    };
  }, []);

  useEffect(() => {
    if (visible) return;
    const timeout = setTimeout(() => onDone(toast.id), EXIT_MS);
    return () => clearTimeout(timeout);
  }, [visible, toast.id, onDone]);

  const variantClass =
    toast.variant === "error"
      ? "border-danger bg-danger-soft text-danger"
      : "border-accent bg-accent-soft text-accent";

  const Icon = toast.variant === "error" ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-md border px-4 py-3 text-sm shadow-elevated transition-all duration-[var(--duration-base)] ease-standard ${variantClass} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {toast.message}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, variant: ToastVariant = "success") => {
    setToasts((current) => [...current, { id: nextId++, message, variant }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <ToastRow key={toast.id} toast={toast} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export default ToastProvider;
