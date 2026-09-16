import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import ErrorState from "@/components/ui/ErrorState";

export default function QuizDetailNotFound() {
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
        <ErrorState
          heading="Quiz not found"
          message="This quiz may have been deleted or the link is wrong."
        >
          <LinkButton href="/quizzes" icon={<ArrowLeft />}>
            Back to quizzes
          </LinkButton>
        </ErrorState>
      </PageContainer>
    </>
  );
}
