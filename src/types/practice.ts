// Coding and SQL problems, submissions, judge results and AI feedback (AOIs).

export type Difficulty = "easy" | "medium" | "hard";
export type CodeLanguage = "python" | "java" | "cpp" | "javascript" | "go";
export type Language = CodeLanguage | "sql";
export type ProblemKind = "code" | "sql";
export type ProblemProgress = "not_started" | "attempted" | "solved";

export interface ProblemSummary {
  id: string;
  title: string;
  kind: ProblemKind;
  difficulty: Difficulty;
  moduleId: string;
  topics: string[];
  progress: ProblemProgress;
  /** Share of learners whose submissions were accepted. */
  acceptanceRate: number;
  companies: string[];
  /** Picked by adaptive problem selection for this learner. */
  recommended?: boolean;
  /** True if the module containing it is still locked for this learner. */
  locked?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expected: string;
}

export interface SqlTable {
  name: string;
  columns: { name: string; type: string }[];
  rows: (string | number | null)[][];
}

export interface ProblemDetail extends ProblemSummary {
  /** Paragraphs of the problem statement. Inline `code` is wrapped in backticks. */
  statement: string[];
  examples: ProblemExample[];
  constraints: string[];
  /** Starter code per language, generated from the function signature. */
  starterCode: Partial<Record<Language, string>>;
  sampleTests: TestCase[];
  hiddenTestCount: number;
  timeLimitMs: number;
  memoryLimitMb: number;
  /** SQL problems only: the tables the query runs against. */
  schema?: SqlTable[];
}

export type Verdict =
  | "accepted"
  | "wrong_answer"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "runtime_error"
  | "compile_error"
  | "pending";

export interface TestResult {
  id: string;
  name: string;
  verdict: Verdict;
  runtimeMs: number;
  memoryMb: number;
  hidden: boolean;
  input?: string;
  expected?: string;
  actual?: string;
}

/** Final score = 70% hidden tests + 30% AI rubric for coding problems. */
export interface ScoreBreakdown {
  total: number;
  tests: number;
  rubric: number;
  testsWeight: number;
  rubricWeight: number;
}

export interface ComplexityEstimate {
  time: string;
  space: string;
  confidence: "low" | "medium" | "high";
  /** Measured runtimes on growing input sizes. */
  samples: { n: number; ms: number }[];
  note: string;
}

export type AoiCategory = "edge_cases" | "readability" | "complexity" | "correctness" | "style";

/** An Area of Improvement from the AI review of a submission. */
export interface AoiItem {
  id: string;
  category: AoiCategory;
  severity: "info" | "suggestion" | "important";
  title: string;
  detail: string;
  line?: number;
}

export interface RubricScore {
  criterion: string;
  score: number;
  max: number;
  comment: string;
}

export interface AiFeedback {
  summary: string;
  aois: AoiItem[];
  rubric: RubricScore[];
  /** Grader confidence; low confidence routes the result to human review. */
  confidence: "low" | "medium" | "high";
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  kind: ProblemKind;
  language: Language;
  submittedAt: string;
  verdict: Verdict;
  testsPassed: number;
  testsTotal: number;
  runtimeMs: number;
  memoryMb: number;
  score: ScoreBreakdown;
  complexity?: ComplexityEstimate;
  feedback?: AiFeedback;
  tests: TestResult[];
  code: string;
  review?: { status: "queued" | "reviewed"; reason: string; reviewerNote?: string };
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python 3",
  java: "Java 21",
  cpp: "C++ 20",
  javascript: "JavaScript (Node 22)",
  go: "Go 1.23",
  sql: "PostgreSQL 16",
};

export const VERDICT_LABELS: Record<Verdict, string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong answer",
  time_limit_exceeded: "Time limit exceeded",
  memory_limit_exceeded: "Memory limit exceeded",
  runtime_error: "Runtime error",
  compile_error: "Compile error",
  pending: "Running",
};
