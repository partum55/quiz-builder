import type { HTMLAttributes } from "react";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/** Rounded placeholder block with a pulse animation. Size it via `className` (e.g. `h-4 w-32`). */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-border/60 motion-reduce:animate-none ${className}`} {...props} />;
}

export default Skeleton;
