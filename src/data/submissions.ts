// Data access for submissions and judge results. Replace the mock returns with API calls later.

import { submissionLogs, submissions } from "@/mocks/submissions";
import type { Submission } from "@/types/practice";

export async function getSubmissions(): Promise<Submission[]> {
  return [...submissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getSubmission(submissionId: string): Promise<Submission | undefined> {
  return submissions.find((s) => s.id === submissionId);
}

export async function getSubmissionsForProblem(problemId: string): Promise<Submission[]> {
  return (await getSubmissions()).filter((s) => s.problemId === problemId);
}

/** Compiler output or runtime error trace for a submission, if any. */
export async function getSubmissionLog(submissionId: string): Promise<string | undefined> {
  return submissionLogs[submissionId];
}
