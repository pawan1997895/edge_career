// Admin console, operations and people: integrity, AI usage, interview ops,
// readiness calibration, system health and user management.

import type { Level, Persona, PlanId, Role, SalaryBand } from "@/types/user";
import type { ModuleStatus } from "@/types/curriculum";

/* ---------- Integrity ---------- */

export type SimilarityStatus = "open" | "dismissed" | "escalated";

export interface LearnerRef {
  id: string;
  name: string;
}

/** Two submissions whose code is suspiciously similar. */
export interface SimilarityMatch {
  id: string;
  learnerA: LearnerRef;
  learnerB: LearnerRef;
  source: string;
  sourceKind: "problem" | "exam";
  language: string;
  similarity: number;
  matchedLines: number;
  totalLines: number;
  detectedAt: string;
  status: SimilarityStatus;
}

export type IntegrityEventKind = "paste" | "tab_switch" | "focus_loss" | "fullscreen_exit";

export interface IntegrityEvent {
  /** Seconds since the attempt started. */
  atSec: number;
  kind: IntegrityEventKind;
  detail: string;
}

export interface ExamAttemptIntegrity {
  id: string;
  learner: LearnerRef;
  exam: string;
  startedAt: string;
  durationMin: number;
  score: number;
  pastes: number;
  tabSwitches: number;
  focusLosses: number;
  risk: "low" | "medium" | "high";
  events: IntegrityEvent[];
}

/** How well a randomized question pool keeps retakes fresh. */
export interface QuestionPoolCoverage {
  examId: string;
  exam: string;
  poolSize: number;
  perAttempt: number;
  attempts: number;
  /** Average share of questions repeated between two attempts by the same learner. */
  repeatRate: number;
  lastRefreshed: string;
}

/* ---------- AI usage ---------- */

export type AiFeatureId = "hints" | "interview_turns" | "code_grading" | "design_review" | "scorecards" | "lesson_scripts" | "doubt_hub";
export type AiEffort = "low" | "high";

export interface AiFeatureUsage {
  id: AiFeatureId;
  feature: string;
  description: string;
  model: string;
  effort: AiEffort;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  cacheHitRate: number;
  costUsd: number;
  p50Ms: number;
  p95Ms: number;
  promptVersion: string;
}

export type DailyAiCost = { date: string } & Record<AiFeatureId, number>;

export interface PromptVersion {
  id: string;
  name: string;
  kind: "prompt" | "rubric";
  feature: string;
  version: string;
  updatedAt: string;
  author: string;
  change: string;
  /** Agreement with the human-graded set, where measured. */
  evalAgreement?: number;
}

export interface InjectionAttempt {
  id: string;
  learner: LearnerRef;
  problem: string;
  snippet: string;
  detectedAt: string;
  action: string;
  scoreImpact: string;
}

export interface BudgetAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  at: string;
}

export interface AiUsageReport {
  periodLabel: string;
  monthlyBudgetUsd: number;
  monthToDateUsd: number;
  features: AiFeatureUsage[];
  daily: DailyAiCost[];
  prompts: PromptVersion[];
  injections: InjectionAttempt[];
  alerts: BudgetAlert[];
}

/* ---------- Interview operations ---------- */

export interface PlanMinutesUsage {
  plan: PlanId;
  learners: number;
  capMinutes: number;
  avgUsedMinutes: number;
  /** Share of learners who hit the cap this cycle. */
  atCapRate: number;
}

export interface InterviewCostBreakdown {
  type: string;
  avgMinutes: number;
  sttUsd: number;
  llmUsd: number;
  ttsUsd: number;
}

export interface LatencyPoint {
  day: string;
  p50Ms: number;
  p95Ms: number;
}

export interface SttVendorTrial {
  vendor: string;
  /** Word error rate (%) per accent group. */
  wer: Record<string, number>;
  latencyMs: number;
  costPerMinUsd: number;
  decision: "selected" | "backup" | "rejected";
  note: string;
}

export interface ActiveInterviewSession {
  id: string;
  learner: LearnerRef;
  type: string;
  mode: "text" | "voice" | "avatar";
  stage: string;
  elapsedMin: number;
  avgLatencyMs: number;
}

export interface InterviewOpsReport {
  sessionsThisMonth: number;
  minutesThisMonth: number;
  interruptionRate: number;
  latencyTargetMs: number;
  plans: PlanMinutesUsage[];
  costs: InterviewCostBreakdown[];
  latency: LatencyPoint[];
  accentGroups: string[];
  vendors: SttVendorTrial[];
  active: ActiveInterviewSession[];
}

/* ---------- Readiness calibration ---------- */

export type ReadinessLevel = "SDE 1" | "SDE 2" | "SDE 3";

/** Expert-set readiness bar: the score a learner needs to be "ready" for this company and level. */
export interface CompanyBar {
  id: string;
  company: string;
  level: ReadinessLevel;
  bar: number;
  setBy: string;
  updatedAt: string;
}

export interface SalaryBandBar {
  band: SalaryBand;
  bar: number;
  setBy: string;
}

export interface OutcomeSummary {
  company: string;
  outcomes: number;
  offers: number;
  avgRoundsReached: number;
  totalRounds: number;
  /** Outcomes needed before scores can be calibrated against real data. */
  required: number;
}

export interface ReadinessCalibration {
  bars: CompanyBar[];
  salaryBars: SalaryBandBar[];
  outcomes: OutcomeSummary[];
}

/* ---------- System health ---------- */

export type ServiceState = "operational" | "degraded" | "down";

export interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  state: ServiceState;
  uptime30d: number;
  latencyMs?: number;
  note?: string;
}

export interface QueuePoint {
  time: string;
  depth: number;
  waitMs: number;
}

export interface WorkerPool {
  language: string;
  image: string;
  active: number;
  idle: number;
  avgRunMs: number;
}

export interface QueueStats {
  name: string;
  purpose: string;
  waiting: number;
  active: number;
  completedLastHour: number;
  failed: number;
  retrying: number;
}

export interface SentryIssue {
  id: string;
  title: string;
  culprit: string;
  level: "error" | "warning";
  count: number;
  users: number;
  lastSeen: string;
  release: string;
}

export interface Deploy {
  id: string;
  service: string;
  version: string;
  at: string;
  author: string;
  status: "success" | "failed" | "rolled_back";
}

export interface SandboxPolicy {
  label: string;
  value: string;
}

export interface SystemHealth {
  services: ServiceStatus[];
  queue: QueuePoint[];
  workers: WorkerPool[];
  sandbox: SandboxPolicy[];
  queues: QueueStats[];
  sentry: SentryIssue[];
  deploys: Deploy[];
}

/* ---------- Users ---------- */

export type AccountStatus = "active" | "suspended" | "invited";
export type UserFlag = "similarity" | "integrity" | "appeal" | "payment_failed" | "minutes_cap";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  city: string;
  plan: PlanId;
  role: Role;
  status: AccountStatus;
  currentModuleId: string;
  currentModule: string;
  progress: number;
  minutesUsed: number;
  minutesCap: number;
  lastActive: string;
  flags: UserFlag[];
}

export interface AdminUserModule {
  moduleId: string;
  number?: number;
  title: string;
  status: ModuleStatus;
  progress: number;
  checkpointBest?: number;
  checkpointAttempts: number;
}

export interface AdminUserDetail extends AdminUserRow {
  persona: Persona;
  level: Level;
  targetCompanies: string[];
  targetSalary: SalaryBand;
  joinedAt: string;
  githubUsername?: string;
  modules: AdminUserModule[];
  billing: { id: string; date: string; description: string; amountInr: number; method: string; status: "paid" | "failed" | "refunded" }[];
  submissions: { id: string; title: string; kind: "code" | "sql" | "design" | "exam"; score: number; result: string; at: string }[];
  interviews: { id: string; type: string; mode: "text" | "voice" | "avatar"; minutes: number; score?: number; at: string }[];
  integrity: { id: string; kind: string; detail: string; at: string; status: "open" | "dismissed" | "escalated" }[];
}
