"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteQuiz } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";
import type { QuizSummary } from "@/lib/api/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function QuizCard({ quiz }: { quiz: QuizSummary }) {
  const router = useRouter();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await deleteQuiz(quiz.id);
      toast.show("Quiz deleted.", "success");
      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError && error.messages[0]
          ? error.messages[0]
          : "Couldn't delete this quiz. Try again.";
      toast.show(message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li className="group relative border-t border-border transition-colors first:border-t-0 hover:bg-accent-soft">
      <Link
        href={`/quizzes/${quiz.id}`}
        className="flex min-w-0 items-center gap-4 px-5 py-4 pr-16"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
          <FileText className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-serif text-lg text-ink">{quiz.title}</h2>
          <p className="mt-0.5 truncate text-sm text-ink-muted">
            {quiz.questionCount}{" "}
            {quiz.questionCount === 1 ? "question" : "questions"} ·{" "}
            {dateFormatter.format(new Date(quiz.createdAt))}
          </p>
        </div>
      </Link>
      <Button
        variant="danger-ghost"
        icon={<Trash2 />}
        aria-label={`Delete "${quiz.title}"`}
        onClick={() => setConfirmOpen(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      />
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        title="Delete quiz?"
        description="This can't be undone."
        loading={deleting}
      />
    </li>
  );
}

export default QuizCard;
