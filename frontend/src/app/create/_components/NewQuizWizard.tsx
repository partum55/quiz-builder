"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  ListChecks,
  Trash2,
} from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Tabs, { type TabItem } from "@/components/ui/Tabs";
import type { QuizDetail } from "@/lib/api/types";
import { DetailsStep } from "./DetailsStep";
import { QuestionsStep } from "./QuestionsStep";
import { PreviewStep } from "./PreviewStep";
import {
  fromQuestionResponses,
  questionUiSchema,
  quizFormSchema,
  type QuizFormValues,
} from "./formSchema";

export const DRAFT_STORAGE_KEY = "quiz-builder:new-quiz-draft";

type StepId = "details" | "questions" | "preview";
const STEP_IDS: StepId[] = ["details", "questions", "preview"];

const EMPTY_VALUES: QuizFormValues = { title: "", questions: [] };

interface StoredDraft {
  title: string;
  questions: QuizFormValues["questions"];
  activeStep: StepId;
}

function isStepId(value: unknown): value is StepId {
  return typeof value === "string" && (STEP_IDS as string[]).includes(value);
}

/** Best-effort shape check for a parsed localStorage draft — a stale or malformed value is discarded, never allowed to crash the page. */
function isStoredDraft(value: unknown): value is StoredDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;
  return (
    typeof draft.title === "string" &&
    Array.isArray(draft.questions) &&
    isStepId(draft.activeStep)
  );
}

function readDraft(): StoredDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoredDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: StoredDraft) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // storage unavailable/full — draft just won't persist, not fatal
  }
}

/** Wraps one step's content with the tabpanel ARIA wiring `Tabs` expects, plus a brief mount fade (same idiom as QuestionCard/OptionRow). Remounts (and re-animates) on every `activeStep` change because callers key it by step id. */
function StepPanel({
  stepId,
  children,
}: {
  stepId: StepId;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="tabpanel"
      id={`${stepId}-panel`}
      aria-labelledby={`${stepId}-tab`}
      className={`transition-all duration-[var(--duration-base)] ease-standard ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/** When `quiz` is passed, the wizard edits that existing quiz instead of creating a new one — pre-filled with its current title/questions, saving via PATCH, and with no localStorage draft (that's only for an in-progress *new* quiz). */
export function NewQuizWizard({ quiz }: { quiz?: QuizDetail } = {}) {
  const [activeStep, setActiveStep] = useState<StepId>("details");
  const [hydrated, setHydrated] = useState(false);
  const [startOverOpen, setStartOverOpen] = useState(false);
  const activeStepRef = useRef(activeStep);
  activeStepRef.current = activeStep;

  const initialValues: QuizFormValues = quiz
    ? { title: quiz.title, questions: fromQuestionResponses(quiz.questions) }
    : EMPTY_VALUES;

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const title = useWatch({ control: methods.control, name: "title" });
  const questions = useWatch({ control: methods.control, name: "questions" });

  // Load a saved draft only after mount — reading localStorage during render/SSR would
  // make the first client render disagree with the server-rendered HTML (hydration
  // mismatch). The form starts with EMPTY_VALUES, matching what the server rendered.
  // Editing an existing quiz never reads or writes this draft key — it already has its
  // own persisted state.
  useEffect(() => {
    if (quiz) {
      setHydrated(true);
      return;
    }
    const draft = readDraft();
    if (draft) {
      methods.reset({ title: draft.title, questions: draft.questions });
      setActiveStep(draft.activeStep);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced write on every field change — watch() fires per keystroke, so don't hit
  // localStorage directly from it.
  useEffect(() => {
    if (!hydrated || quiz) return;
    let timeout: ReturnType<typeof setTimeout>;
    const subscription = methods.watch((values) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        writeDraft({
          title: values.title ?? "",
          questions: (values.questions ?? []) as QuizFormValues["questions"],
          activeStep: activeStepRef.current,
        });
      }, 400);
    });
    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [hydrated, methods, quiz]);

  // Immediate (non-debounced) write whenever the active tab changes, so switching tabs
  // and refreshing right after never loses which tab was active.
  useEffect(() => {
    if (!hydrated || quiz) return;
    const values = methods.getValues();
    writeDraft({
      title: values.title,
      questions: values.questions,
      activeStep,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, hydrated]);

  function handleStartOver() {
    if (!quiz) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    methods.reset(initialValues);
    setActiveStep("details");
    setStartOverOpen(false);
  }

  const detailsCompleted = (title ?? "").trim().length > 0;
  const questionsCompleted = (questions ?? []).some(
    (q) => questionUiSchema.safeParse(q).success,
  );

  const steps: TabItem[] = [
    {
      id: "details",
      label: "Details",
      icon: <FileText />,
      completed: detailsCompleted,
    },
    {
      id: "questions",
      label: "Questions",
      icon: <ListChecks />,
      completed: questionsCompleted,
      disabled: !detailsCompleted,
    },
    {
      id: "preview",
      label: quiz ? "Preview & save" : "Preview & publish",
      icon: <Eye />,
      disabled: !detailsCompleted || !questionsCompleted,
    },
  ];

  const activeIndex = STEP_IDS.indexOf(activeStep);
  const previousStep = STEP_IDS[activeIndex - 1];
  const nextStep = STEP_IDS[activeIndex + 1];
  const nextStepBlocked = nextStep
    ? (steps.find((s) => s.id === nextStep)?.disabled ?? false)
    : true;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button
            variant="danger-ghost"
            size="sm"
            icon={<Trash2 />}
            onClick={() => setStartOverOpen(true)}
          >
            {quiz ? "Discard changes" : "Start over"}
          </Button>
        </div>

        <Tabs
          steps={steps}
          activeId={activeStep}
          onChange={(id) => setActiveStep(id as StepId)}
        />

        <StepPanel key={activeStep} stepId={activeStep}>
          {activeStep === "details" && <DetailsStep />}
          {activeStep === "questions" && <QuestionsStep />}
          {activeStep === "preview" && <PreviewStep quizId={quiz?.id} />}
        </StepPanel>

        <div className="flex justify-between border-t border-border pt-6">
          <Button
            variant="secondary"
            size="sm"
            icon={<ChevronLeft />}
            disabled={!previousStep}
            onClick={() => previousStep && setActiveStep(previousStep)}
          >
            Previous
          </Button>
          {nextStep && (
            <Button
              variant="primary"
              size="sm"
              icon={<ChevronRight />}
              disabled={nextStepBlocked}
              onClick={() => setActiveStep(nextStep)}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={startOverOpen}
        onConfirm={handleStartOver}
        onCancel={() => setStartOverOpen(false)}
        title={quiz ? "Discard your changes?" : "Discard this draft?"}
        description={
          quiz
            ? "Your edits will be lost and this quiz will revert to its last saved version."
            : "Your unsaved questions and title will be lost."
        }
        confirmLabel={quiz ? "Discard changes" : "Start over"}
      />
    </FormProvider>
  );
}

export default NewQuizWizard;
