// Data access for lessons. Replace the mock returns with API calls later.

import { modules } from "@/mocks/curriculum";
import { lessonDetails } from "@/mocks/lessons";
import type { LearningItem, Lesson, Module } from "@/types/curriculum";

export interface LessonContext {
  lesson: Lesson;
  module: Module;
  topicTitle: string;
  item: LearningItem;
  prev?: LearningItem;
  next?: LearningItem;
  /** True when the lesson's module or the lesson itself is still locked. */
  locked: boolean;
}

/** The lesson plus where it sits in its module (for breadcrumbs and previous/next links). */
export async function getLessonContext(lessonId: string): Promise<LessonContext | undefined> {
  for (const mod of modules) {
    const items = mod.topics.flatMap((t) => t.items.map((item) => ({ item, topicTitle: t.title })));
    const index = items.findIndex(({ item }) => item.kind === "lesson" && item.refId === lessonId);
    if (index === -1) continue;

    const { item, topicTitle } = items[index]!;
    const detail = lessonDetails[lessonId];
    const lesson: Lesson = detail ? { ...detail, status: item.status } : placeholderLesson(item, mod, topicTitle);
    return {
      lesson,
      module: mod,
      topicTitle,
      item,
      prev: items[index - 1]?.item,
      next: items[index + 1]?.item,
      locked: mod.status === "locked" || item.status === "locked",
    };
  }
  return undefined;
}

/** Generic content so every lesson in the curriculum opens in the mock UI. */
function placeholderLesson(item: LearningItem, mod: Module, topicTitle: string): Lesson {
  const durationSec = item.durationMin * 60;
  const step = Math.floor(durationSec / 6);
  const lines = [
    `Welcome to “${item.title}”, part of ${topicTitle} in ${mod.title}.`,
    "We will start with the problem this idea solves, using a small, concrete example.",
    "Next, we will build the idea step by step and look at the trade-offs it brings.",
    "Then we will walk through how it shows up in a typical interview question.",
    "We will finish with common mistakes, and how to explain your reasoning clearly.",
    "The full script for this lesson is written by an expert and reviewed before recording.",
  ];
  return {
    id: item.refId,
    moduleId: mod.id,
    topicId: topicTitle,
    title: item.title,
    summary: `A ${item.durationMin}-minute lesson in ${topicTitle}. The full script lives in the content repository.`,
    durationSec,
    instructor: "Edge Career expert panel",
    chapters: [
      { title: "Introduction", startSec: 0 },
      { title: "Core idea", startSec: step },
      { title: "In interviews", startSec: step * 3 },
      { title: "Summary", startSec: step * 5 },
    ],
    transcript: lines.map((text, i) => ({ startSec: i * step, endSec: i === lines.length - 1 ? durationSec : (i + 1) * step, text })),
    resources: [{ title: "Lesson notes", kind: "notes" }],
    status: item.status,
    watchedSec: item.status === "passed" ? durationSec : 0,
  };
}
