import type { ExamQuestion } from "@/types/assessments";
import type { Language } from "@/types/practice";

export type Answer = string | string[];

export interface IntegrityEvent {
  id: number;
  kind: "paste" | "tab_switch" | "focus_loss";
  /** Seconds since the exam started. */
  atSec: number;
  questionNumber: number;
}

export const INTEGRITY_LABELS: Record<IntegrityEvent["kind"], string> = {
  paste: "Paste into an answer",
  tab_switch: "Switched away from the exam tab",
  focus_loss: "Left the exam window",
};

export function defaultLanguage(q: ExamQuestion): Language {
  const languages = Object.keys(q.starterCode ?? {}) as Language[];
  return languages[0] ?? "python";
}

export function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Whether a question counts as answered for the navigator and the submit summary. */
export function isAnswered(q: ExamQuestion, answer: Answer | undefined, language: Language): boolean {
  if (answer === undefined) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  if (q.kind === "code") return answer.trim() !== (q.starterCode?.[language] ?? "").trim();
  if (q.kind === "design") return wordCount(answer) > 0;
  return answer !== "";
}
