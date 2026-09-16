import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LinkButton } from "@/components/ui/Button";
import { NewQuizWizard } from "./_components/NewQuizWizard";

export default function NewQuizPage() {
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
        <h1 className="font-serif text-2xl text-ink">New quiz</h1>
        <div className="mt-6">
          <NewQuizWizard />
        </div>
      </PageContainer>
    </>
  );
}
