import type { Metadata } from "next";
import { buildLessonDraft, buildProblemDraft, getDoubtThreads, getGenericHints } from "@/data/doubts";
import { DoubtHub } from "@/features/doubts/components/doubt-hub";

export const metadata: Metadata = { title: "Doubt hub" };

export default async function DoubtsPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string; lesson?: string; t?: string; problem?: string }>;
}) {
  const { thread, lesson, t, problem } = await searchParams;
  const [threads, genericHints] = await Promise.all([getDoubtThreads(), getGenericHints()]);

  // "Ask about this moment" (lesson) or "Ask in doubt hub" (problem) opens a new, prefilled thread.
  const draft = lesson
    ? await buildLessonDraft(lesson, Math.max(0, Number(t) || 0))
    : problem
      ? await buildProblemDraft(problem)
      : undefined;

  const all = draft ? [draft, ...threads] : threads;
  const selectedId = draft?.id ?? (all.some((x) => x.id === thread) ? thread! : all[0]!.id);

  return <DoubtHub initialThreads={all} initialSelectedId={selectedId} newThreadHints={genericHints} />;
}
