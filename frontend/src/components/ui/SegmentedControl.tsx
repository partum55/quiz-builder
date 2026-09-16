export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Shared `name` for the underlying radio inputs. */
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  "aria-label"?: string;
}

/** A pill-style question-type picker built on real, fully keyboard-operable `<input type="radio">`s. */
export function SegmentedControl<T extends string = string>({
  name,
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex w-fit shrink-0 self-start divide-x divide-border overflow-hidden rounded-md border border-border bg-surface shadow-sm"
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <div key={option.value}>
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <label
              htmlFor={id}
              className="block cursor-pointer select-none px-5 py-2.5 text-sm text-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent-soft peer-checked:bg-accent peer-checked:text-surface peer-checked:hover:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent"
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
