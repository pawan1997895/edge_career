// Curriculum structure: Track → Module → Topic → Item (lesson, practice, assignment) → Checkpoint exam.

/** Lifecycle of every learning item, from the plan's locking rules. */
export type ItemStatus = "locked" | "unlocked" | "in_progress" | "submitted" | "passed" | "failed";
export type ItemKind = "lesson" | "practice" | "assignment" | "checkpoint";

/** Module-level state. `tested_out` means the learner skipped it via the placement test. */
export type ModuleStatus = "locked" | "unlocked" | "in_progress" | "passed" | "tested_out";

/** Which roadmap phase ships the module's content and tooling. */
export type ReleasePhase = 1 | 2 | 3;

export interface LearningItem {
  id: string;
  kind: ItemKind;
  title: string;
  status: ItemStatus;
  required: boolean;
  durationMin: number;
  /** Lesson id, problem id, design problem id or exam id this item opens. */
  refId: string;
  /** Best score (0–100) for graded items. */
  score?: number;
}

export interface Topic {
  id: string;
  title: string;
  items: LearningItem[];
}

export interface CheckpointSummary {
  examId: string;
  passScore: number;
  bestScore?: number;
  attempts: number;
  /** "under_review" when the score fell in the human-review band (80–88%). */
  status: "locked" | "available" | "passed" | "failed" | "under_review";
}

export interface Module {
  id: string;
  trackId: "core" | "electives";
  /** Order in the core track (1–6). Electives have no number. */
  number?: number;
  title: string;
  summary: string;
  weeks: number;
  status: ModuleStatus;
  /** 0–100, share of required items passed. */
  progress: number;
  prerequisiteIds: string[];
  skills: string[];
  releasePhase: ReleasePhase;
  topics: Topic[];
  checkpoint: CheckpointSummary;
}

export interface Track {
  id: "core" | "electives";
  title: string;
  description: string;
  moduleIds: string[];
}

export interface TranscriptCue {
  startSec: number;
  endSec: number;
  text: string;
}

export interface LessonChapter {
  title: string;
  startSec: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  topicId: string;
  title: string;
  summary: string;
  durationSec: number;
  instructor: string;
  /** Pre-recorded avatar video served from the CDN (absent in mock data). */
  videoUrl?: string;
  chapters: LessonChapter[];
  transcript: TranscriptCue[];
  resources: { title: string; kind: "notes" | "slides" | "code" | "link" }[];
  status: ItemStatus;
  /** Seconds already watched, for resume. */
  watchedSec: number;
}
