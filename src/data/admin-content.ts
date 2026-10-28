// Data access for the admin console (content, lesson production, review queue, grader accuracy).
// Replace the mock returns with API calls later.

import { getProblems } from "@/data/problems";
import {
  adminAlerts,
  agreementTrend,
  calibrationPoints,
  CONTENT_AUTHORS,
  dailySubmissions,
  featureCostsToday,
  lessonScripts,
  MIN_CALIBRATION_SET,
  moduleAccuracy,
  modulePublishStatus,
  overrideLog,
  overviewStats,
  pipelineLessons,
  problemFileOverrides,
  REVIEWERS,
  reviewDetails,
  reviewQueue,
  rubrics,
} from "@/mocks/admin-content";
import type {
  CiCheck,
  CommitEntry,
  HiddenTestGroup,
  LessonScript,
  ProblemFileMeta,
  PublishStatus,
  ReviewDetail,
  ReviewQueueItem,
} from "@/types/admin-content";
import type { CodeLanguage, ProblemDetail, ProblemSummary } from "@/types/practice";

export async function getOverview() {
  return {
    stats: overviewStats,
    dailySubmissions,
    featureCosts: featureCostsToday,
    alerts: adminAlerts,
  };
}

// ---------- Content ----------

export async function getModulePublishStatus(): Promise<Record<string, PublishStatus>> {
  return modulePublishStatus;
}

export async function getRubrics() {
  return rubrics;
}

export async function getRubric(id: string) {
  return rubrics.find((r) => r.id === id);
}

const CODE_LANGUAGES: CodeLanguage[] = ["python", "java", "cpp", "javascript", "go"];

/** Repository metadata for every problem file. Most are generated from the problem list. */
export async function getProblemFiles(): Promise<(ProblemSummary & { file: ProblemFileMeta })[]> {
  const problems = await getProblems();
  return problems.map((p, i) => ({ ...p, file: buildFileMeta(p, i) }));
}

export async function getProblemFile(problemId: string): Promise<ProblemFileMeta | undefined> {
  const files = await getProblemFiles();
  return files.find((p) => p.id === problemId)?.file;
}

function buildFileMeta(problem: ProblemSummary, index: number): ProblemFileMeta {
  const author = CONTENT_AUTHORS[index % CONTENT_AUTHORS.length]!;
  const hidden = problem.kind === "sql" ? 6 + (index % 5) : problem.difficulty === "hard" ? 50 : problem.difficulty === "medium" ? 40 : 24;
  const day = 10 + (index % 17);
  return {
    problemId: problem.id,
    sampleTests: problem.kind === "sql" ? 1 : 3,
    hiddenTests: hidden,
    languages: problem.kind === "sql" ? ["sql"] : CODE_LANGUAGES,
    rubricVersion: problem.kind === "sql" ? "sql-v1.4" : "coding-v3.2",
    ciStatus: "passing",
    author,
    lastCommit: {
      sha: (0x1a2b3c + index * 7919).toString(16).slice(0, 7),
      message: index % 3 === 0 ? "Tighten problem statement wording" : index % 3 === 1 ? "Add hidden tests for boundary values" : "Regenerate boilerplate for all languages",
      author,
      at: `2026-10-${String(day).padStart(2, "0")}T1${index % 10}:15:00+05:30`,
    },
    ...problemFileOverrides[problem.id],
  };
}

/** Automatic checks run by CI on every change to a problem file. */
export function buildCiChecks(problem: ProblemDetail, file: ProblemFileMeta): CiCheck[] {
  const running = file.ciStatus === "running";
  const failing = file.ciStatus === "failing" ? file.failingCheck ?? "Check failed" : undefined;
  const failsCompile = failing?.toLowerCase().includes("compile");
  const failsReference = failing && !failsCompile;
  const langs = problem.kind === "sql" ? "PostgreSQL 16" : "Python, Java, C++, JavaScript, Go";

  return [
    { id: "schema", label: "Problem file matches the schema", status: "pass", detail: "problem.yaml, tests/, rubric reference and starter code present." },
    {
      id: "reference",
      label: "Reference solution passes every test within 2 s / 256 MB",
      status: running ? "running" : failsReference ? "fail" : "pass",
      detail: failsReference ? failing! : `Slowest test 412 ms, peak memory 38 MB across ${file.sampleTests + file.hiddenTests} tests.`,
    },
    {
      id: "boilerplate",
      label: "Generated boilerplate compiles in each language",
      status: running ? "running" : failsCompile ? "fail" : "pass",
      detail: failsCompile ? failing! : `${langs}: starter code and judge harness built successfully.`,
    },
    { id: "rubric", label: "Rubric weights sum to 100", status: "pass", detail: `Uses ${file.rubricVersion}.` },
    {
      id: "large",
      label: "Hidden tests include large inputs so slow solutions time out",
      status: running ? "running" : "pass",
      detail: problem.kind === "sql" ? "Largest dataset: 250,000 rows; a cross join exceeds 2 s." : "Largest input n = 10⁵; an O(n²) solution times out at 2 s.",
    },
  ];
}

export function buildHiddenTestGroups(problem: ProblemDetail): HiddenTestGroup[] {
  const total = problem.hiddenTestCount;
  if (problem.kind === "sql") {
    const edge = Math.max(1, Math.round(total * 0.4));
    return [
      { name: "Sample-shaped datasets", count: total - edge - 1, note: "Small tables with ties and NULLs" },
      { name: "Edge cases", count: edge, note: "Empty tables, single department, duplicate salaries" },
      { name: "Large dataset", count: 1, note: "250,000 rows to catch slow queries" },
    ];
  }
  const basic = Math.round(total * 0.2);
  const edge = Math.round(total * 0.2);
  const large = Math.round(total * 0.4);
  return [
    { name: "Basic", count: basic, note: "Hand-written cases mirroring the examples" },
    { name: "Edge cases", count: edge, note: "Empty input, single element, duplicates, extremes" },
    { name: "Large inputs", count: large, note: "n up to 10⁵ to enforce the time limit" },
    { name: "Randomised", count: total - basic - edge - large, note: "Generated from a fixed seed, checked against the reference" },
  ];
}

export function buildProblemHistory(file: ProblemFileMeta): CommitEntry[] {
  return [
    file.lastCommit,
    { sha: "7d02e9f", message: "Review: clarify constraints section", author: "Arjun Nair", at: "2026-10-08T16:40:00+05:30" },
    { sha: "c51a8b3", message: `Bump rubric to ${file.rubricVersion}`, author: "Vikram Rao", at: "2026-09-29T12:05:00+05:30" },
    { sha: "29e6f10", message: "Initial problem file", author: file.author, at: "2026-09-12T10:30:00+05:30" },
  ];
}

// ---------- Lesson production ----------

export async function getPipelineLessons() {
  return pipelineLessons;
}

export async function getLessonScript(lessonId: string): Promise<LessonScript | undefined> {
  if (lessonScripts[lessonId]) return lessonScripts[lessonId];
  const lesson = pipelineLessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;

  // Generated placeholder for pipeline lessons without an authored script yet.
  const hasScript = lesson.stage !== "outline";
  return {
    lessonId: lesson.id,
    title: lesson.title,
    moduleTitle: lesson.moduleTitle,
    stage: lesson.stage,
    expert: lesson.owner,
    reviewer: lesson.owner === "Arjun Nair" ? "Vikram Rao" : "Arjun Nair",
    outline: [
      `What problem "${lesson.title}" solves`,
      "Core idea with one worked example",
      "Common mistakes",
      "How it comes up in interviews",
    ],
    sections: hasScript
      ? [
          { id: "s1", title: "Introduction", body: `In this lesson we look at ${lesson.title.toLowerCase()}: why it exists and where you will meet it in real systems.`, comments: [] },
          {
            id: "s2",
            title: "Worked example",
            body: "We walk through one concrete example step by step, pausing at each decision point.",
            comments:
              lesson.stage === "expert_review"
                ? [{ id: "c1", author: lesson.owner, at: lesson.updatedAt, text: "Use numbers from a real system here instead of a toy example.", resolved: false }]
                : [],
          },
          { id: "s3", title: "Summary", body: "Recap the key idea in two sentences and point to the practice problem that follows.", comments: [] },
        ]
      : [],
    video: {
      status: lesson.renderStatus,
      progress: lesson.renderProgress ?? (lesson.renderStatus === "ready" ? 100 : 0),
      avatar: "Ira (studio, neutral background)",
      voice: "Indian English, female, calm",
      durationSec: lesson.renderStatus === "ready" ? lesson.durationMin * 60 : undefined,
    },
    transcriptSync: lesson.renderStatus === "ready" ? "synced" : "pending",
    versions: [{ sha: "a19c0de", message: hasScript ? "Script draft generated (Claude)" : "Outline created", author: hasScript ? "Content pipeline" : lesson.owner, at: lesson.updatedAt }],
  };
}

// ---------- Human review ----------

export async function getReviewQueue(): Promise<ReviewQueueItem[]> {
  return reviewQueue;
}

export async function getReviewers() {
  return REVIEWERS;
}

export async function getReview(reviewId: string): Promise<ReviewDetail | undefined> {
  const item = reviewQueue.find((r) => r.id === reviewId);
  if (!item) return undefined;
  return { ...item, ...(reviewDetails[reviewId] ?? genericReviewDetail(item)) };
}

/** Placeholder detail so every queue row opens a working review screen. */
function genericReviewDetail(item: ReviewQueueItem): Omit<ReviewDetail, keyof ReviewQueueItem> {
  const isRubricOnly = item.itemType === "design" || item.itemType === "interview";
  const audit = [
    { at: item.submittedAt, actor: "AI grader", action: `Score ${item.aiScore}, confidence ${item.confidence}` },
    { at: item.submittedAt, actor: "System", action: "Sent to human review" },
  ];
  if (item.status === "resolved") audit.push({ at: item.submittedAt, actor: item.assignee ?? "Reviewer", action: "Resolved" });

  const artifact: ReviewDetail["artifact"] =
    item.itemType === "interview"
      ? {
          kind: "interview",
          excerpts: [
            { atSec: 312, speaker: "interviewer", text: "How would you handle duplicates in the input?" },
            { atSec: 330, speaker: "candidate", text: "I'd… I think a set would work, but then I lose the counts. Let me think about a map instead." },
            { atSec: 1260, speaker: "interviewer", text: "What's the time complexity of your final approach?" },
            { atSec: 1275, speaker: "candidate", text: "It's O(n log n) because of the sort, and O(n) extra space for the map." },
          ],
        }
      : item.itemType === "design"
        ? {
            kind: "design",
            components: ["Clients", "Load balancer", "API service ×2", "Postgres primary", "Redis cache"],
            sections: [{ title: "Summary", body: "Learner's written design sections appear here." }],
            checks: [
              { label: "Database has a replica (no single point of failure)", status: "fail" },
              { label: "Cache in front of read-heavy path", status: "pass" },
            ],
          }
        : { kind: "code", language: "python", fileName: "solution.py", code: "class Solution:\n    def solve(self, nums: list[int]) -> int:\n        # Learner's submitted code\n        ...\n" };

  return {
    passScore: 85,
    scoringRule: isRubricOnly ? "100% AI rubric" : "70% hidden tests + 30% AI rubric",
    scoreParts: isRubricOnly ? [{ label: "AI rubric", value: item.aiScore, weight: 100 }] : [
      { label: "Hidden tests", value: Math.min(100, item.aiScore + 6), weight: 70 },
      { label: "AI rubric", value: Math.max(0, item.aiScore - 14), weight: 30 },
    ],
    aiSummary: "The AI grader's summary of this submission appears here.",
    rubric: [
      { criterion: "Approach", score: 24, max: 30, weight: 30, comment: "Sound overall approach." },
      { criterion: "Edge cases", score: 18, max: 25, weight: 25, comment: "Some boundaries not handled." },
      { criterion: "Readability", score: 20, max: 25, weight: 25, comment: "Clear structure." },
      { criterion: "Complexity", score: 16, max: 20, weight: 20, comment: "Meets the expected bound." },
    ],
    artifact,
    integrityEvents:
      item.reason === "integrity_flag"
        ? [{ at: item.submittedAt, type: "similarity", detail: "87% similar to another submission on the same problem" }]
        : [],
    learnerNote: item.reason === "appeal" ? "I believe my solution was marked down unfairly. Please take another look." : undefined,
    audit,
  };
}

// ---------- Grader accuracy ----------

export async function getGraderAccuracy() {
  return {
    modules: moduleAccuracy,
    points: calibrationPoints,
    trend: agreementTrend,
    overrides: overrideLog,
    minCalibrationSet: MIN_CALIBRATION_SET,
    target: 90,
  };
}

export async function getOverrideLog() {
  return overrideLog;
}
