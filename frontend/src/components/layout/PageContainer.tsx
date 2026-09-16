import type { HTMLAttributes } from "react";

export type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/** Centered content column shared by every page: 720px max width, responsive side padding. */
export function PageContainer({ className = "", ...props }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[720px] px-5 py-10 sm:px-8 ${className}`}
      {...props}
    />
  );
}

export default PageContainer;
