// Data access for the doubt hub. Replace the mock-backed functions with API calls later.

import { findItemByRef } from "@/data/curriculum";
import { getProblem } from "@/data/problems";
import { DEMO_NOW, formatClock } from "@/lib/format";
import { doubtThreads, genericHints } from "@/mocks/doubts";
import type { DoubtThread } from "@/types/doubts";

export async function getDoubtThreads(): Promise<DoubtThread[]> {
  return [...doubtThreads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Hint ladder used by brand-new threads that have no problem- or lesson-specific hints. */
export async function getGenericHints(): Promise<DoubtThread["hints"]> {
  return genericHints;
}

/** New, unsent thread for "Ask about this moment" in the lesson player. */
export async function buildLessonDraft(lessonId: string, atSec: number): Promise<DoubtThread | undefined> {
  const found = await findItemByRef(lessonId);
  if (!found) return undefined;
  const known = doubtThreads.find((t) => t.context.lessonMoment?.lessonId === lessonId)?.context.lessonMoment;
  const excerpt =
    known && Math.abs(known.atSec - atSec) < 60
      ? known.excerpt
      : `The transcript lines around ${formatClock(atSec)} will be attached when you send your question.`;

  return {
    id: `draft-lesson-${lessonId}-${atSec}`,
    title: `Question about “${found.item.title}” at ${formatClock(atSec)}`,
    source: "lesson",
    status: "open",
    updatedAt: DEMO_NOW,
    hintsGiven: [],
    hints: genericHints,
    messages: [],
    draft: true,
    context: { lessonMoment: { lessonId, lessonTitle: found.item.title, atSec, excerpt } },
  };
}

/** New, unsent thread opened from a problem; the latest code and result are attached as context. */
export async function buildProblemDraft(problemId: string): Promise<DoubtThread | undefined> {
  const problem = await getProblem(problemId);
  if (!problem) return undefined;
  const language = problem.kind === "sql" ? "sql" : "python";

  return {
    id: `draft-problem-${problemId}`,
    title: `Help with “${problem.title}”`,
    source: "problem",
    status: "open",
    updatedAt: DEMO_NOW,
    hintsGiven: [],
    hints: genericHints,
    messages: [],
    draft: true,
    context: {
      problem: { id: problem.id, title: problem.title, difficulty: problem.difficulty },
      code: { language, snippet: (problem.starterCode[language] ?? "").trimEnd() },
      lastResult: {
        tone: "info",
        title: "No runs yet",
        detail: "Run or submit in the workspace and the latest output will be attached here automatically.",
      },
    },
  };
}
