import { ListChecks, TextCursorInput, ToggleLeft } from "lucide-react";
import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import type { QuestionResponse } from "@/lib/api/types";

const TYPE_LABEL: Record<QuestionResponse["type"], string> = {
  BOOLEAN: "Yes/No",
  INPUT: "Short answer",
  CHECKBOX: "Multiple choice",
};

const TYPE_ICON: Record<QuestionResponse["type"], ReactNode> = {
  BOOLEAN: <ToggleLeft className="h-3.5 w-3.5" aria-hidden="true" />,
  INPUT: <TextCursorInput className="h-3.5 w-3.5" aria-hidden="true" />,
  CHECKBOX: <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />,
};

function CheckboxAnswer({ question }: { question: QuestionResponse }) {
  const options = question.options ?? [];
  const correct = question.correctOptions ?? [];

  return (
    <div className="mt-2">
      <ul className="flex flex-col gap-1">
        {options.map((option) => {
          const isCorrect = correct.includes(option);
          return (
            <li key={option} className="flex items-baseline gap-2 text-sm">
              <span aria-hidden="true" className="w-4 text-correct">
                {isCorrect ? "✓" : ""}
              </span>
              <span className={isCorrect ? "font-medium text-ink" : "text-ink-muted"}>
                {option}
                <span className="sr-only">{isCorrect ? " (correct answer)" : " (not a correct answer)"}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-sm text-ink-muted">
        Correct answer{correct.length === 1 ? "" : "s"}: <span className="text-ink">{correct.join(", ")}</span>
      </p>
    </div>
  );
}

function Answer({ question }: { question: QuestionResponse }) {
  switch (question.type) {
    case "BOOLEAN":
      return <p className="mt-2 text-sm text-ink">Answer: {question.correctBoolean ? "Yes" : "No"}</p>;
    case "INPUT":
      return <p className="mt-2 text-sm text-ink">Answer: {question.correctText}</p>;
    case "CHECKBOX":
      return <CheckboxAnswer question={question} />;
  }
}

export function QuestionList({ questions }: { questions: QuestionResponse[] }) {
  return (
    <ol className="flex flex-col">
      {questions.map((question, index) => (
        <li key={question.id} className="border-t border-border py-6 first:border-t-0 first:pt-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-ink">
              {index + 1}. {question.text}
            </p>
            <Badge className="shrink-0">
              {TYPE_ICON[question.type]}
              {TYPE_LABEL[question.type]}
            </Badge>
          </div>
          <Answer question={question} />
        </li>
      ))}
    </ol>
  );
}

export default QuestionList;
