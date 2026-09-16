"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import { QuestionList } from "@/components/quiz/QuestionList";
import { SubmissionsList } from "@/components/quiz/SubmissionsList";
import type { QuestionResponse, SubmissionSummary } from "@/lib/api/types";

type TabId = "preview" | "results";

export function QuizDetailTabs({
  questions,
  submissions,
}: {
  questions: QuestionResponse[];
  submissions: SubmissionSummary[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("preview");

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        steps={[
          { id: "preview", label: "Quiz preview" },
          { id: "results", label: `Results (${submissions.length})` },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />
      <div
        role="tabpanel"
        id="preview-panel"
        aria-labelledby="preview-tab"
        hidden={activeTab !== "preview"}
      >
        <Card className="overflow-hidden p-5">
          <QuestionList questions={questions} />
        </Card>
      </div>
      <div
        role="tabpanel"
        id="results-panel"
        aria-labelledby="results-tab"
        hidden={activeTab !== "results"}
      >
        <Card className="overflow-hidden p-5">
          <SubmissionsList
            submissions={submissions}
            questionCount={questions.length}
          />
        </Card>
      </div>
    </div>
  );
}

export default QuizDetailTabs;
