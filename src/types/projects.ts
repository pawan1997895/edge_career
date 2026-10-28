// Module 5 projects (GitHub repos, test runner, live-URL checks) and Module 6 ML notebooks.

export type ProjectStatus = "not_started" | "in_progress" | "passed" | "failed";

export interface ProjectSummary {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  estimatedHours: number;
  skills: string[];
  repo?: string;
  lastRun?: { at: string; result: "passed" | "failed"; testsPassed: number; testsTotal: number };
}

export interface TestSuiteResult {
  id: string;
  name: string;
  passed: number;
  failed: number;
  durationMs: number;
  log: string;
}

export interface LiveCheck {
  id: string;
  method: "GET" | "POST" | "DELETE";
  path: string;
  expectedStatus: number;
  actualStatus: number | null;
  latencyMs: number | null;
  lastCheckedAt: string;
  passed: boolean;
  note?: string;
}

export interface ProjectRequirement {
  id: string;
  label: string;
  done: boolean;
  /** Checked automatically by tests or live checks, or marked by a reviewer. */
  checkedBy: "tests" | "live_check" | "reviewer" | "github";
}

export interface ProjectRun {
  id: string;
  at: string;
  commit: string;
  branch: string;
  result: "passed" | "failed";
  testsPassed: number;
  testsTotal: number;
  durationSec: number;
}

export interface ProjectDetail extends ProjectSummary {
  brief: string[];
  repositories: string[];
  branches: string[];
  latestCommit?: { sha: string; message: string; author: string; at: string };
  suites: TestSuiteResult[];
  liveUrl?: string;
  liveChecks: LiveCheck[];
  requirements: ProjectRequirement[];
  runs: ProjectRun[];
}

export interface GitHubConnection {
  connected: boolean;
  account: string;
  installedAt: string;
  repositories: { name: string; private: boolean; selected: boolean }[];
}

export type NotebookStatus = "not_started" | "in_progress" | "submitted" | "passed";

export interface NotebookSummary {
  id: string;
  title: string;
  summary: string;
  status: NotebookStatus;
  dataset: string;
  estimatedMin: number;
  lastEditedAt?: string;
}

export type CellOutput =
  | { kind: "text"; text: string }
  | { kind: "error"; text: string }
  | { kind: "table"; columns: string[]; rows: (string | number)[][] }
  | { kind: "chart"; chartType: "bar" | "line"; title: string; xLabel: string; yLabel: string; data: { x: string | number; y: number }[] };

export interface NotebookCell {
  id: string;
  kind: "markdown" | "code";
  source: string;
  outputs: CellOutput[];
  executionCount?: number;
  /** Mock stand-in for the kernel: what the cell prints when it runs, if it has no saved outputs. */
  outputsOnRun?: CellOutput[];
}

export interface GradedCheck {
  id: string;
  label: string;
  description: string;
  status: "pending" | "passed" | "failed";
  detail?: string;
}

export interface NotebookDetail extends NotebookSummary {
  kernel: { name: string; cpu: string; memory: string; cellTimeoutSec: number; packages: string[] };
  cells: NotebookCell[];
  checks: GradedCheck[];
}
