"use client";

import { ArrowLeft } from "lucide-react";
import Button, { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import ErrorState from "@/components/ui/ErrorState";

export default function QuizDetailError({
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
          <LinkButton href="/quizzes" variant="ghost" icon={<ArrowLeft />}>
            Back to quizzes
          </LinkButton>
        }
      />
      <PageContainer>
        <ErrorState message="Couldn't load this quiz. Try again.">
          <Button onClick={() => retry()}>Try again</Button>
        </ErrorState>
      </PageContainer>
    </>
  );
}
