// System design workbench: HLD canvas problems and LLD multi-file problems.

import type { Difficulty, RubricScore } from "@/types/practice";

export type DesignKind = "hld" | "lld";
export type DesignStatus = "not_started" | "in_progress" | "in_review" | "passed" | "failed";

export interface DesignProblemSummary {
  id: string;
  kind: DesignKind;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedMin: number;
  companies: string[];
  status: DesignStatus;
  lastScore?: number;
  /** Required for the Module 4 checkpoint, or extra practice. */
  required: boolean;
}

/** Typed blocks available on the HLD canvas. */
export type BlockType =
  | "client"
  | "cdn"
  | "load_balancer"
  | "api_gateway"
  | "service"
  | "cache"
  | "database"
  | "replica"
  | "queue"
  | "worker"
  | "object_storage"
  | "search";

export interface DesignNode {
  id: string;
  type: BlockType;
  label: string;
  x: number;
  y: number;
}

export interface DesignEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/** The written sections that sit alongside the diagram. */
export interface DesignSections {
  requirements: string;
  estimates: string;
  apis: string;
  dataModel: string;
  tradeoffs: string;
}

export type CheckSeverity = "error" | "warning" | "suggestion" | "pass";

export interface DesignCheck {
  id: string;
  severity: CheckSeverity;
  title: string;
  detail: string;
}

export interface DesignReview {
  overall: number;
  confidence: "low" | "medium" | "high";
  criteria: RubricScore[];
  strengths: string[];
  improvements: string[];
  reviewedAt: string;
  /** Present when low grader confidence sent the submission to a human reviewer. */
  humanReview?: { reason: string; submittedAt: string; expectedBy: string };
}

export interface HldProblem extends DesignProblemSummary {
  kind: "hld";
  brief: string[];
  scaleHints: string[];
  /** Read-heavy systems should put a cache in front of the database. */
  readHeavy: boolean;
  rubric: { criterion: string; weight: number }[];
  nodes: DesignNode[];
  edges: DesignEdge[];
  sections: DesignSections;
  lastReview?: DesignReview;
}

export type LldLanguage = "java" | "python";

export interface LldFile {
  id: string;
  name: string;
  content: string;
  readOnly?: boolean;
}

export interface LldTestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  message?: string;
}

export interface LldProblem extends DesignProblemSummary {
  kind: "lld";
  brief: string[];
  files: Record<LldLanguage, LldFile[]>;
  tests: LldTestResult[];
  rubric: RubricScore[];
  patternsDetected: { name: string; where: string; verdict: "good" | "questionable" }[];
}
