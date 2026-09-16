import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/** Plain surface container — no shadow by design. Wrap it in a Next `<Link>` yourself for a clickable card. */
export function Card({ className = "", ...props }: CardProps) {
  return <div className={`rounded-lg border border-border bg-surface p-5 ${className}`} {...props} />;
}

export default Card;
