// Admin console: content files, lesson production, human review queue and grader accuracy.

import type { Language, RubricScore, TestResult } from "@/types/practice";

export type CiStatus = "passing" | "failing" | "running";
export type CheckStatus = "pass" | "fail" | "running";

export interface CommitEntry {
  sha: string;
  message: string;
  author: string;
  at: string;
}

/** Repository metadata for a problem file under content/problems/<id>/. */
export interface ProblemFileMeta {
  problemId: string;
  sampleTests: number;
  hiddenTests: number;
  languages: Language[];
  rubricVersion: string;
  ciStatus: CiStatus;
  author: string;
  lastCommit: CommitEntry;
  /** Set when a check fails, e.g. which language harness did not compile. */
  failingCheck?: string;
}

export interface CiCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: number;
  description: string;
}

export interface Rubric {
  id: string;
  name: string;
  appliesTo: "Coding" | "SQL" | "HLD design" | "LLD design" | "Mock interview";
  version: string;
  status: "active" | "draft" | "retired";
  updatedAt: string;
  author: string;
  criteria: RubricCriterion[];
}

export type PublishStatus = "published" | "in_review" | "draft";

export interface HiddenTestGroup {
  name: string;
  count: number;
  note: string;
}

// ---------- Lesson production ----------

export type LessonStage = "outline" | "script_draft" | "expert_review" | "avatar_video" | "published";
export type RenderStatus = "not_started" | "queued" | "rendering" | "ready" | "failed";

export interface PipelineLesson {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  stage: LessonStage;
  owner: string;
  updatedAt: string;
  renderStatus: RenderStatus;
  renderProgress?: number;
  durationMin: number;
}

export interface ScriptComment {
  id: string;
  author: string;
  at: string;
  text: string;
  resolved: boolean;
}

export interface ScriptSection {
  id: string;
  title: string;
  body: string;
  comments: ScriptComment[];
}

export interface LessonScript {
  lessonId: string;
  title: string;
  moduleTitle: string;
  stage: LessonStage;
  expert: string;
  reviewer: string;
  outline: string[];
  sections: ScriptSection[];
  video: { status: RenderStatus; progress: number; avatar: string; voice: string; durationSec?: number };
  transcriptSync: "pending" | "synced" | "out_of_date";
  versions: CommitEntry[];
}

// ---------- Human review ----------

export type ReviewReason = "near_threshold" | "low_confidence" | "appeal" | "integrity_flag";
export type ReviewItemType = "code" | "design" | "exam" | "interview";
export type ReviewStatus = "pending" | "in_review" | "resolved";
export type Confidence = "low" | "medium" | "high";

export interface ReviewQueueItem {
  id: string;
  learnerId: string;
  learnerName: string;
  itemTitle: string;
  itemType: ReviewItemType;
  moduleTitle: string;
  aiScore: number;
  confidence: Confidence;
  reason: ReviewReason;
  submittedAt: string;
  assignee?: string;
  status: ReviewStatus;
}

export interface RubricRationale extends RubricScore {
  /** Weight of the criterion in the rubric (percent). */
  weight: number;
}

export type ReviewArtifact =
  | { kind: "code"; language: Language; code: string; fileName: string }
  | { kind: "design"; components: string[]; sections: { title: string; body: string }[]; checks: { label: string; status: CheckStatus }[] }
  | { kind: "exam"; questions: { id: string; prompt: string; points: number; awarded: number; disputed?: boolean }[]; disputedAnswer: { language: Language; code: string } }
  | { kind: "interview"; excerpts: { atSec: number; speaker: "interviewer" | "candidate"; text: string }[] };

export interface IntegrityEvent {
  at: string;
  type: "paste" | "tab_switch" | "similarity" | "fullscreen_exit";
  detail: string;
}

export interface AuditEntry {
  at: string;
  actor: string;
  action: string;
}

export interface ReviewDetail extends ReviewQueueItem {
  passScore: number;
  /** "70% tests + 30% rubric" or "100% rubric". */
  scoringRule: string;
  scoreParts: { label: string; value: number; weight: number }[];
  aiSummary: string;
  rubric: RubricRationale[];
  artifact: ReviewArtifact;
  tests?: TestResult[];
  integrityEvents: IntegrityEvent[];
  learnerNote?: string;
  audit: AuditEntry[];
}

// ---------- Grader accuracy ----------

export type GatingStatus = "ai_enabled" | "human_required" | "collecting";

export interface ModuleAccuracy {
  moduleId: string;
  moduleTitle: string;
  calibrationSize: number;
  /** Share of AI scores within ±5 points of the human score. */
  withinFivePct: number;
  meanAbsError: number;
  gating: GatingStatus;
}

export interface CalibrationPoint {
  ai: number;
  human: number;
  module: string;
}

export interface AgreementTrendPoint {
  week: string;
  dsa: number;
  sql: number;
  design: number;
}

export interface OverrideLogEntry {
  id: string;
  reviewer: string;
  learner: string;
  item: string;
  aiScore: number;
  finalScore: number;
  reason: string;
  at: string;
}

// ---------- Overview ----------

export interface OverviewStats {
  activeLearners: number;
  activeLearnersChange: number;
  submissionsToday: number;
  submissionsChange: number;
  reviewBacklog: number;
  oldestWaitingHours: number;
  aiCostTodayUsd: number;
  aiCostMonthUsd: number;
  aiBudgetMonthUsd: number;
  graderAgreementPct: number;
}

export interface DailySubmissions {
  day: string;
  code: number;
  sql: number;
  design: number;
}

export interface FeatureCost {
  feature: string;
  costUsd: number;
}

export interface AdminAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href: string;
}
