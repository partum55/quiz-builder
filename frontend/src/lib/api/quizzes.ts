import { apiFetch } from "./client";
import type {
  CreateQuizInput,
  QuizDetail,
  QuizSummary,
  SubmissionCreated,
  SubmissionInput,
  SubmissionSummary,
} from "./types";

export function listQuizzes(init: RequestInit = { cache: "no-store" }): Promise<QuizSummary[]> {
  return apiFetch<QuizSummary[]>("/quizzes", init);
}

export function getQuiz(id: string, init: RequestInit = { cache: "no-store" }): Promise<QuizDetail> {
  return apiFetch<QuizDetail>(`/quizzes/${id}`, init);
}

export function createQuiz(input: CreateQuizInput): Promise<QuizDetail> {
  return apiFetch<QuizDetail>("/quizzes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteQuiz(id: string): Promise<void> {
  return apiFetch<void>(`/quizzes/${id}`, { method: "DELETE" });
}

export function submitQuiz(quizId: string, input: SubmissionInput): Promise<SubmissionCreated> {
  return apiFetch<SubmissionCreated>(`/quizzes/${quizId}/submissions`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listSubmissions(
  quizId: string,
  init: RequestInit = { cache: "no-store" },
): Promise<SubmissionSummary[]> {
  return apiFetch<SubmissionSummary[]>(`/quizzes/${quizId}/submissions`, init);
}
