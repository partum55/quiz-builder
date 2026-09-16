import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { listQuizzes } from "@/lib/api/quizzes";
import { QuizCard } from "./_components/QuizCard";

export default async function QuizzesPage() {
  const quizzes = await listQuizzes();

  return (
    <>
      <SiteHeader
        action={
          <LinkButton href="/create" icon={<Plus />}>
            New quiz
          </LinkButton>
        }
      />
      <PageContainer>
        <h1 className="font-serif text-2xl text-ink">Your quizzes</h1>
        {quizzes.length > 0 && (
          <p className="mt-1 text-sm text-ink-muted">
            {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
          </p>
        )}
        {quizzes.length === 0 ? (
          <div className="mt-6">
            <EmptyState message="You haven't created any quizzes yet.">
              <LinkButton href="/create" icon={<Plus />}>
                Create your first quiz
              </LinkButton>
            </EmptyState>
          </div>
        ) : (
          <Card className="mt-6 overflow-hidden p-0">
            <ul className="flex flex-col">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </ul>
          </Card>
        )}
      </PageContainer>
    </>
  );
}
