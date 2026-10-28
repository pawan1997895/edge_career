// Data access for checkpoint exams, the placement test, results and reviews.
// Replace the mock-backed functions with API calls later.

import { getModules } from "@/data/curriculum";
import { itemHref, routes } from "@/lib/routes";
import {
  DEFAULT_LAYOUT,
  PASS_SCORE,
  PLACEMENT_EXAM_ID,
  RETAKE_COOLDOWN_HOURS,
  REVIEW_BAND,
  examAttempts,
  examLayouts,
  generalQuestions,
  placementLayout,
  placementQuestions,
  placementSummary,
  reviewCases,
  systemDesignQuestions,
} from "@/mocks/assessments";
import type {
  ExamAttempt,
  ExamDetail,
  ExamQuestion,
  ExamResult,
  PlacementSummary,
  ResultOutcome,
  ReviewCase,
} from "@/types/assessments";
import type { Module } from "@/types/curriculum";

function moduleLabel(m: Module) {
  return m.number ? `Module ${m.number}: ${m.title}` : m.title;
}

function buildCheckpointExam(mod: Module, all: Module[]): ExamDetail {
  const layout = examLayouts[mod.id] ?? DEFAULT_LAYOUT;

  const prerequisites = mod.prerequisiteIds
    .map((id) => all.find((m) => m.id === id))
    .filter((m): m is Module => Boolean(m))
    .map((m) => ({
      label: `Pass ${moduleLabel(m)}`,
      done: m.status === "passed" || m.status === "tested_out",
      href: routes.module(m.id),
    }));

  const items = mod.topics
    .flatMap((t) => t.items)
    .filter((i) => i.required && i.kind !== "checkpoint")
    .map((i) => ({ label: i.title, done: i.status === "passed", href: itemHref(i) }));

  const nextCore = mod.number ? all.find((m) => m.trackId === "core" && m.number === mod.number! + 1) : undefined;
  const nextUnlock = nextCore
    ? moduleLabel(nextCore)
    : mod.trackId === "core"
      ? "Core track certificate"
      : "Elective certificate on your profile";

  return {
    id: mod.checkpoint.examId,
    kind: "checkpoint",
    title: mod.number ? `Module ${mod.number} checkpoint · ${mod.title}` : `Elective checkpoint · ${mod.title}`,
    shortTitle: `${mod.title} checkpoint`,
    moduleId: mod.id,
    moduleNumber: mod.number,
    moduleTitle: mod.title,
    durationMin: layout.durationMin,
    passScore: mod.checkpoint.passScore,
    reviewBand: REVIEW_BAND,
    poolSize: layout.poolSize,
    sections: layout.sections,
    retakeCooldownHours: RETAKE_COOLDOWN_HOURS,
    status: mod.checkpoint.status,
    bestScore: mod.checkpoint.bestScore,
    requirements: [...prerequisites, ...items],
    nextUnlock,
    attempts: examAttempts.filter((a) => a.examId === mod.checkpoint.examId),
  };
}

function buildPlacementExam(): ExamDetail {
  return {
    id: PLACEMENT_EXAM_ID,
    kind: "placement",
    title: "Placement test",
    shortTitle: "Placement test",
    durationMin: placementLayout.durationMin,
    passScore: PASS_SCORE,
    reviewBand: REVIEW_BAND,
    poolSize: placementLayout.poolSize,
    sections: placementLayout.sections,
    retakeCooldownHours: 24 * 30,
    status: "available",
    requirements: [],
    nextUnlock: "Modules where you score 85% or more are marked tested out",
    attempts: examAttempts.filter((a) => a.examId === PLACEMENT_EXAM_ID),
  };
}

/** Every checkpoint exam (core modules first, then electives) plus the placement test. */
export async function getExams(): Promise<ExamDetail[]> {
  const all = await getModules();
  return [...all.map((m) => buildCheckpointExam(m, all)), buildPlacementExam()];
}

export { PLACEMENT_EXAM_ID };

export async function getPlacementExam(): Promise<ExamDetail> {
  return buildPlacementExam();
}

export async function getExam(examId: string): Promise<ExamDetail | undefined> {
  if (examId === PLACEMENT_EXAM_ID) return buildPlacementExam();
  const all = await getModules();
  const mod = all.find((m) => m.checkpoint.examId === examId);
  return mod ? buildCheckpointExam(mod, all) : undefined;
}

export async function getExamAttempts(): Promise<ExamAttempt[]> {
  return examAttempts;
}

export async function getReviewCases(): Promise<ReviewCase[]> {
  return reviewCases;
}

export async function getPlacementSummary(): Promise<PlacementSummary> {
  return placementSummary;
}

/** The randomized question set for this attempt. Mock: a fixed demo set per exam type. */
export async function getExamQuestions(examId: string): Promise<ExamQuestion[]> {
  if (examId === "exam-system-design") return systemDesignQuestions;
  if (examId === PLACEMENT_EXAM_ID) return placementQuestions;
  return generalQuestions;
}

const OUTCOME_SCORE: Record<ResultOutcome, number> = { pass: 91, review: 84, fail: 74 };
const SECTION_SPREAD = [4, -3, -2, 3];
const WEAK_SCORES: Record<ResultOutcome, number[]> = { pass: [82, 84, 86], review: [74, 78, 81], fail: [62, 66, 70] };

/** Result of the latest attempt. `outcome` lets the UI preview each result state. */
export async function getExamResult(examId: string, outcome: ResultOutcome): Promise<ExamResult | undefined> {
  const exam = await getExam(examId);
  if (!exam) return undefined;

  const score =
    outcome === "pass" && exam.bestScore !== undefined && exam.bestScore >= exam.passScore ? exam.bestScore : OUTCOME_SCORE[outcome];

  // Spread section scores around the total so their weighted average matches it.
  const weights = exam.sections.map((s) => s.weight);
  const spread = SECTION_SPREAD.slice(0, weights.length);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const meanSpread = spread.reduce((sum, d, i) => sum + d * weights[i]!, 0) / totalWeight;
  const sections = exam.sections.map((s, i) => ({
    title: s.title,
    weight: s.weight,
    score: Math.max(0, Math.min(100, Math.round(score + spread[i]! - meanSpread))),
  }));

  const all = await getModules();
  const mod = all.find((m) => m.id === exam.moduleId);
  const weakSkills =
    exam.kind === "placement"
      ? placementSummary.sections.filter((s) => !s.testedOut).map((s) => ({ skill: s.moduleTitle, href: routes.module(s.moduleId) }))
      : (mod?.skills.slice(-3) ?? []).map((skill) => ({ skill, href: routes.module(mod!.id) }));

  return {
    exam,
    outcome,
    score,
    sections,
    timeTakenMin: Math.round(exam.durationMin * 0.9),
    submittedAt: "2026-10-27T18:12:00+05:30",
    attemptNumber: exam.attempts.length + (exam.status === "passed" ? 0 : 1),
    integrityEvents: outcome === "review" ? 1 : 0,
    reviewDueAt: "2026-10-28T18:30:00+05:30",
    retakeAt: "2026-10-28T18:12:00+05:30",
    weakAreas: weakSkills.slice(0, 3).map((w, i) => ({
      ...w,
      score: WEAK_SCORES[outcome][i] ?? 70,
      action: "Review in module",
    })),
  };
}
