import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";
import { TakeQuizFlow } from "./_components/TakeQuizFlow";

export default async function TakeQuizPage({
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
    <div className="mx-auto w-full max-w-[720px] px-5 py-10 sm:px-8">
      <TakeQuizFlow quiz={quiz} />
    </div>
  );
}
