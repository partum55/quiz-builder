"use client";

import { Link2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function CopyLinkButton({ quizId }: { quizId: string }) {
  const toast = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/take/${quizId}`,
      );
      toast.show("Quiz link copied.");
    } catch {
      toast.show("Couldn't copy the link. Try again.", "error");
    }
  }

  return (
    <Button variant="secondary" size="sm" icon={<Link2 />} onClick={handleCopy}>
      Copy quiz link
    </Button>
  );
}

export default CopyLinkButton;
