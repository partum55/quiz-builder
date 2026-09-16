import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface SiteHeaderProps {
  /** Page-specific content rendered on the right side of the header (e.g. a "New quiz" or "Back" button). */
  action?: ReactNode;
}

/** Sticky top bar with the site wordmark. Each page renders its own instance with a page-specific `action`, since the root layout has no per-route knowledge of what belongs there. */
export function SiteHeader({ action }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border border-t-2 border-t-accent bg-paper/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[720px] items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-medium text-ink">
          <Image src="/logo.svg" alt="" width={20} height={20} priority />
          Quiz Builder
        </Link>
        {action}
      </div>
    </header>
  );
}

export default SiteHeader;
