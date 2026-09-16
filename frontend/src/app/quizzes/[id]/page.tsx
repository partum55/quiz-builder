import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getQuiz, listSubmissions } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";
import { DeleteQuizButton } from "./_components/DeleteQuizButton";
import { CopyLinkButton } from "./_components/CopyLinkButton";
import { QuizDetailTabs } from "./_components/QuizDetailTabs";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
  const submissions = await listSubmissions(id);

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-ink">{quiz.title}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"} ·{" "}
              {dateFormatter.format(new Date(quiz.createdAt))}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <LinkButton href={`/quizzes/${quiz.id}/edit`} variant="secondary" size="sm" icon={<Pencil />}>
              Edit
            </LinkButton>
            <CopyLinkButton quizId={quiz.id} />
          </div>
        </div>

        <div className="mt-8">
          <QuizDetailTabs questions={quiz.questions} submissions={submissions} />
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <DeleteQuizButton id={quiz.id} title={quiz.title} />
        </div>
      </PageContainer>
    </>
  );
}
