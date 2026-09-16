import Link, { type LinkProps } from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "danger-ghost" | "danger";
export type ButtonSize = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium transition-[color,background-color,border-color,transform] duration-[var(--duration-fast)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-surface hover:bg-accent-hover hover:-translate-y-px",
  secondary: "bg-surface text-ink border border-border hover:bg-accent-soft",
  ghost: "bg-transparent text-ink hover:bg-accent-soft",
  "danger-ghost": "bg-transparent text-danger hover:bg-danger-soft",
  danger: "bg-danger text-surface hover:bg-danger/90",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-3.5 text-xs",
};

/** Shared class-string builder used by both `Button` and `LinkButton` so their visuals never drift apart. */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): string {
  return `${base} ${variantStyles[variant]} ${sizeStyles[size]}`;
}

function Spinner() {
  return (
    <svg
      data-spinner
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Icon rendered before the label, sized to match text. Hidden in favor of the spinner while `loading`. */
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      disabled,
      className = "",
      children,
      type,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={`${buttonStyles(variant, size)} ${className}`}
        {...props}
      >
        {loading ? <Spinner /> : icon}
        {children}
      </button>
    );
  },
);

export interface LinkButtonProps
  extends
    LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
  /** Icon rendered before the label, sized to match text. */
  icon?: ReactNode;
}

/** A Next `<Link>` visually styled as a `Button`, for navigation that should look like an action. */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      icon,
      ...props
    },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={`${buttonStyles(variant, size)} ${className}`}
        {...props}
      >
        {icon}
        {children}
      </Link>
    );
  },
);

export default Button;
