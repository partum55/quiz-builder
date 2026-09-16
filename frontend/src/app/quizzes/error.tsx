"use client";

import { Plus } from "lucide-react";
import Button, { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import ErrorState from "@/components/ui/ErrorState";

export default function QuizzesError({
  retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  retry: () => void;
}) {
  return (
    <>
      <SiteHeader
        action={
          <LinkButton href="/quizzes/new" icon={<Plus />}>
            New quiz
          </LinkButton>
        }
      />
      <PageContainer>
        <ErrorState message="We couldn't load your quizzes. Please try again.">
          <Button onClick={() => retry()}>Try again</Button>
        </ErrorState>
      </PageContainer>
    </>
  );
}
