import { CheckCircle2 } from "lucide-react";
import { useRef, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  completed?: boolean;
  /** When true, the tab can't be activated (click, Enter, or arrow-key nav) until the gate clears. */
  disabled?: boolean;
}

export interface TabsProps {
  steps: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

/**
 * Tab-based navigator (real tab semantics, not a radio group — tabs switch between
 * distinct content panels). Controlled, with optional per-tab `disabled` gating. The
 * consuming page owns each panel and must give it `role="tabpanel"` with
 * `id={`${step.id}-panel`}` and `aria-labelledby={`${step.id}-tab`}` to match the ids
 * used here.
 *
 * Implements the WAI-ARIA APG "automatic activation" tabs pattern: Left/Right (wrapping)
 * and Home/End move focus *and* switch the active panel in one step, matching click
 * behavior — except a disabled tab is skipped over entirely (focus/activation stays put).
 */
export function Tabs({ steps, activeId, onChange }: TabsProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusAndActivate(index: number) {
    const next = steps[index];
    if (!next || next.disabled) return;
    onChange(next.id);
    buttonRefs.current[next.id]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = steps.findIndex((step) => step.id === activeId);
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusAndActivate((currentIndex + 1) % steps.length);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusAndActivate((currentIndex - 1 + steps.length) % steps.length);
        break;
      case "Home":
        event.preventDefault();
        focusAndActivate(0);
        break;
      case "End":
        event.preventDefault();
        focusAndActivate(steps.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Steps"
      onKeyDown={handleKeyDown}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      className="grid items-center border-b border-border"
    >
      {steps.map((step, index) => {
        const active = step.id === activeId;
        const alignment = index === 0 ? "justify-self-start" : index === steps.length - 1 ? "justify-self-end" : "justify-self-center";
        return (
          <button
            key={step.id}
            ref={(el) => {
              buttonRefs.current[step.id] = el;
            }}
            type="button"
            role="tab"
            id={`${step.id}-tab`}
            aria-selected={active}
            aria-controls={`${step.id}-panel`}
            aria-disabled={step.disabled || undefined}
            tabIndex={active ? 0 : -1}
            onClick={() => !step.disabled && onChange(step.id)}
            className={`flex items-center gap-2 rounded-t-md border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-[var(--duration-fast)] [&_svg]:h-4 [&_svg]:w-4 ${alignment} ${
              step.disabled
                ? "cursor-not-allowed border-transparent text-ink-muted opacity-50"
                : active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-transparent text-ink-muted hover:bg-surface hover:text-ink"
            }`}
          >
            {step.completed ? <CheckCircle2 aria-hidden="true" /> : step.icon}
            {step.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
