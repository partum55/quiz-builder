"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteQuiz } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";

export function DeleteQuizButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await deleteQuiz(id);
      toast.show("Quiz deleted.");
      router.push("/quizzes");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.messages[0]
          : "Couldn't delete this quiz. Try again.";
      toast.show(message, "error");
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="danger-ghost"
        icon={<Trash2 />}
        onClick={() => setOpen(true)}
      >
        Delete quiz
      </Button>
      <ConfirmDialog
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        title={`Delete "${title}"?`}
        description="This can't be undone."
        loading={loading}
      />
    </>
  );
}

export default DeleteQuizButton;
