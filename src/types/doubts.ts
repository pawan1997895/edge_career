// AI doubt hub: threads, escalating hints and the context sent with each question.

import type { Difficulty, Language } from "@/types/practice";

/** Hints escalate one level at a time. The full solution is never given. */
export type HintLevel = "nudge" | "concept" | "approach" | "pseudocode";

export const HINT_LEVELS: { id: HintLevel; label: string; description: string }[] = [
  { id: "nudge", label: "Nudge", description: "A question that points you in the right direction" },
  { id: "concept", label: "Concept", description: "The idea or data structure that applies" },
  { id: "approach", label: "Approach", description: "The steps of a working approach, in words" },
  { id: "pseudocode", label: "Pseudocode", description: "Language-neutral outline, never full code" },
];

export interface DoubtMessage {
  id: string;
  role: "learner" | "assistant";
  content: string;
  at: string;
  hintLevel?: HintLevel;
  code?: string;
}

/** One node of the generated call-stack flowchart. */
export interface CallNode {
  id: string;
  label: string;
  note?: string;
  tone?: "default" | "base" | "memo" | "error" | "active";
  children?: CallNode[];
}

/** Recorded step for the execution-trace preview (real traces are Phase 2). */
export interface TraceStep {
  line: number;
  description: string;
  variables: { name: string; value: string }[];
  stack: string[];
}

export interface DoubtContext {
  problem?: { id: string; title: string; difficulty: Difficulty };
  /** Set when the doubt was raised from the lesson player. */
  lessonMoment?: { lessonId: string; lessonTitle: string; atSec: number; excerpt: string };
  code?: { language: Language; snippet: string };
  lastResult?: { tone: "error" | "warning" | "info"; title: string; detail: string };
  /** Best-matching lesson section found by vector search. */
  lessonMatch?: { lessonId: string; lessonTitle: string; atSec: number; excerpt: string; similarity: number };
  callFlow?: { title: string; root: CallNode };
  trace?: TraceStep[];
}

export interface DoubtThread {
  id: string;
  title: string;
  source: "lesson" | "problem" | "general";
  status: "open" | "resolved";
  updatedAt: string;
  /** Hints already revealed, in order. */
  hintsGiven: HintLevel[];
  /** Canned hint text per level, used by the mock hint ladder. */
  hints: Record<HintLevel, string>;
  messages: DoubtMessage[];
  context: DoubtContext;
  /** A draft thread created from a lesson moment or problem that has no messages yet. */
  draft?: boolean;
}
