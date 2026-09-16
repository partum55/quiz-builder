import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getQuiz } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";
import { NewQuizWizard } from "../../../create/_components/NewQuizWizard";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let quiz;
  try {
    quiz = await getQuiz(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <SiteHeader
        action={
          <LinkButton
            href={`/quizzes/${id}`}
            variant="ghost"
            icon={<ArrowLeft />}
          >
            Back to quiz
          </LinkButton>
        }
      />
      <PageContainer>
        <h1 className="font-serif text-2xl text-ink">Edit quiz</h1>
        <div className="mt-6">
          <NewQuizWizard quiz={quiz} />
        </div>
      </PageContainer>
    </>
  );
}
