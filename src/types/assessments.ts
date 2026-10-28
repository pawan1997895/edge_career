// Checkpoint exams, the placement test, attempts, results and human reviews/appeals.

import type { Language } from "@/types/practice";

export type ExamKind = "checkpoint" | "placement";
export type QuestionKind = "single" | "multi" | "code" | "design";
export type AttemptOutcome = "passed" | "not_passed" | "under_review";
export type ResultOutcome = "pass" | "review" | "fail";

export interface ExamSection {
  id: string;
  title: string;
  kind: QuestionKind | "mixed";
  questionCount: number;
  /** Share of the final score, 0–100. */
  weight: number;
  durationMin?: number;
}

export interface ExamRequirement {
  label: string;
  done: boolean;
  href?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  attemptNumber: number;
  takenAt: string;
  score: number;
  outcome: AttemptOutcome;
  /** True when the score fell in the review band and a human checked it. */
  humanReviewed: boolean;
  reviewNote?: string;
  durationMin: number;
  integrityEvents: number;
}

export interface ExamDetail {
  id: string;
  kind: ExamKind;
  title: string;
  shortTitle: string;
  moduleId?: string;
  moduleNumber?: number;
  moduleTitle?: string;
  durationMin: number;
  passScore: number;
  reviewBand: { min: number; max: number };
  /** Number of questions in the randomized pool the exam draws from. */
  poolSize: number;
  sections: ExamSection[];
  retakeCooldownHours: number;
  status: "locked" | "available" | "passed" | "failed" | "under_review";
  bestScore?: number;
  requirements: ExamRequirement[];
  /** What passing unlocks, e.g. "Module 5: Production Engineering". */
  nextUnlock: string;
  attempts: ExamAttempt[];
}

export interface ExamOption {
  id: string;
  label: string;
}

export interface ExamQuestion {
  id: string;
  sectionTitle: string;
  kind: QuestionKind;
  prompt: string;
  points: number;
  options?: ExamOption[];
  /** Coding questions. */
  starterCode?: Partial<Record<Language, string>>;
  sampleTests?: { input: string; expected: string }[];
  /** Design questions. */
  wordLimit?: number;
}

export interface SectionResult {
  title: string;
  score: number;
  weight: number;
}

export interface ExamResult {
  exam: ExamDetail;
  outcome: ResultOutcome;
  score: number;
  sections: SectionResult[];
  timeTakenMin: number;
  submittedAt: string;
  attemptNumber: number;
  integrityEvents: number;
  /** For "review": when the human reviewer is expected to finish. */
  reviewDueAt?: string;
  /** For "fail": when a retake opens. */
  retakeAt?: string;
  weakAreas: { skill: string; score: number; href: string; action: string }[];
}

export type ReviewOrigin = "appeal" | "near_threshold" | "low_confidence";
export type ReviewStatus = "queued" | "in_review" | "resolved";

/** A result that went to a human: automatically (review band, low AI confidence) or by learner appeal. */
export interface ReviewCase {
  id: string;
  title: string;
  kind: "exam" | "submission" | "design";
  origin: ReviewOrigin;
  openedAt: string;
  status: ReviewStatus;
  aiScore?: number;
  finalScore?: number;
  resolution?: string;
  href: string;
}

export interface PlacementSectionResult {
  moduleId: string;
  moduleTitle: string;
  score: number;
  testedOut: boolean;
}

export interface PlacementSummary {
  takenAt: string;
  durationMin: number;
  sections: PlacementSectionResult[];
  nextAvailableAt: string;
}
