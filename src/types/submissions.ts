// Extra judge-UI types: hints, SQL row comparison, sample runs and recommendations.
// Core submission shapes live in @/types/practice.

import type { Submission, Verdict } from "@/types/practice";

export type HintLevel = "nudge" | "concept" | "approach" | "pseudocode";

export interface ProblemHint {
  level: HintLevel;
  text: string;
}

export const HINT_LEVELS: { level: HintLevel; label: string; description: string }[] = [
  { level: "nudge", label: "Nudge", description: "A question that points you in the right direction" },
  { level: "concept", label: "Concept", description: "The idea or pattern the problem relies on" },
  { level: "approach", label: "Approach", description: "How to apply that idea, step by step" },
  { level: "pseudocode", label: "Pseudocode", description: "An outline of the algorithm, never the full solution" },
];

export type SqlValue = string | number | null;

export interface SqlResultSet {
  columns: string[];
  rows: SqlValue[][];
}

/** Reference output plus a deliberately wrong result used by the "Wrong answer" demo. */
export interface SqlJudgeData {
  expected: SqlResultSet;
  wrongAnswer: SqlResultSet;
}

/** Your rows vs the reference query's rows. Indices point into each result's rows. */
export interface SqlComparison {
  expected: SqlResultSet;
  actual: SqlResultSet;
  missing: number[];
  extra: number[];
}

/** Verdicts a reviewer can preview in the workspace demo. */
export type DemoVerdict = Exclude<Verdict, "pending" | "memory_limit_exceeded">;

export interface SampleRunResult {
  testId: string;
  label: string;
  verdict: Verdict;
  input: string;
  expected: string;
  actual: string;
  runtimeMs: number;
  stderr?: string;
}

export interface RunOutcome {
  verdict: Verdict;
  results: SampleRunResult[];
  /** Compiler or interpreter output when the code doesn't build. */
  compileOutput?: string;
  customInput?: string;
  sql?: SqlComparison;
  sqlError?: string;
}

export interface SubmitOutcome {
  submission: Submission;
  /** Compiler output or runtime error trace. */
  log?: string;
  sql?: SqlComparison;
}

export interface ProblemRecommendation {
  problemId: string;
  skill: string;
  reason: string;
}
