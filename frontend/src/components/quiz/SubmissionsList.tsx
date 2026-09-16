import { EmptyState } from "@/components/ui/EmptyState";
import type { SubmissionSummary } from "@/lib/api/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function SubmissionsList({
  submissions,
  questionCount,
}: {
  submissions: SubmissionSummary[];
  questionCount: number;
}) {
  if (submissions.length === 0) {
    return <EmptyState message="No one has completed this quiz yet." />;
  }

  return (
    <ul className="flex flex-col">
      {submissions.map((submission) => (
        <li
          key={submission.id}
          className="flex items-center justify-between gap-3 border-t border-border py-4 first:border-t-0 first:pt-0"
        >
          <span className="text-sm font-medium text-ink">
            {submission.respondentName}
          </span>
          <span className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="font-medium text-correct">
              {submission.score}/{questionCount}
            </span>
            {dateFormatter.format(new Date(submission.submittedAt))}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default SubmissionsList;
