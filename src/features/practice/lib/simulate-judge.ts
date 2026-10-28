// DEMO ONLY. Produces fake judge results so the workspace UI can be reviewed without
// the sandbox. Delete this file when Run/Submit call the real judge API.

import { DEMO_NOW } from "@/lib/format";
import type { AiFeedback, AoiItem, CodeLanguage, ComplexityEstimate, Language, ProblemDetail, Submission, TestResult, Verdict } from "@/types/practice";
import type { DemoVerdict, RunOutcome, SampleRunResult, SqlComparison, SqlJudgeData, SqlResultSet, SubmitOutcome } from "@/types/submissions";

export const CODE_DEMO_VERDICTS: DemoVerdict[] = ["accepted", "wrong_answer", "time_limit_exceeded", "runtime_error", "compile_error"];
export const SQL_DEMO_VERDICTS: DemoVerdict[] = ["accepted", "wrong_answer", "time_limit_exceeded", "runtime_error"];

const COMPILE_ERRORS: Record<CodeLanguage, string> = {
  python: `  File "solution.py", line 6
    best = max(best, right - left + 1
                    ^
SyntaxError: '(' was never closed`,
  java: `Solution.java:5: error: ';' expected
        int best = 0
                    ^
1 error`,
  cpp: `solution.cpp: In member function 'int Solution::solve()':
solution.cpp:6:23: error: expected ';' before 'for'
    6 |         int best = 0
      |                     ^
      |                     ;`,
  javascript: `solution.js:7
}
^
SyntaxError: Unexpected token '}'`,
  go: `./solution.go:5:2: syntax error: unexpected newline in composite literal; possibly missing comma or }`,
};

const RUNTIME_ERRORS: Record<CodeLanguage, string> = {
  python: `Traceback (most recent call last):
  File "solution.py", line 9, in solve
    if s[right] in last:
IndexError: string index out of range`,
  java: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
    at Solution.solve(Solution.java:9)`,
  cpp: `AddressSanitizer: heap-buffer-overflow on address 0x602000000014
READ of size 4 at solution.cpp:9`,
  javascript: `TypeError: Cannot read properties of undefined (reading 'length')
    at solve (solution.js:9:21)`,
  go: `panic: runtime error: index out of range [3] with length 3

goroutine 1 [running]:
main.solve(...)
	/sandbox/solution.go:9 +0x1d4`,
};

const SQL_ERRORS = {
  runtime_error: `ERROR:  syntax error at or near "FORM"
LINE 6: FORM employee e
        ^`,
  time_limit_exceeded: "ERROR:  canceling statement due to statement timeout (limit 2000 ms)",
};

/** Run against the sample tests only (no score, no AI review). */
export function simulateRun(
  problem: ProblemDetail,
  language: Language,
  verdict: DemoVerdict,
  customInput: string | undefined,
  sql: SqlJudgeData | undefined,
): RunOutcome {
  if (problem.kind === "sql" && sql) {
    if (verdict === "runtime_error" || verdict === "time_limit_exceeded") {
      return { verdict, results: [], sqlError: SQL_ERRORS[verdict] };
    }
    const comparison = compareSqlResults(sql.expected, verdict === "wrong_answer" ? sql.wrongAnswer : sql.expected);
    return { verdict: comparison.missing.length + comparison.extra.length > 0 ? "wrong_answer" : "accepted", results: [], sql: comparison };
  }

  const codeLanguage = language as CodeLanguage;
  if (verdict === "compile_error") {
    return { verdict, results: [], compileOutput: COMPILE_ERRORS[codeLanguage] };
  }

  const samples = problem.sampleTests;
  const failingIndex = verdict === "wrong_answer" ? samples.length - 1 : verdict === "runtime_error" ? Math.min(1, samples.length - 1) : -1;
  const results: SampleRunResult[] = samples.map((t, i) => {
    const fails = i === failingIndex;
    const resultVerdict: Verdict = fails ? (verdict === "wrong_answer" ? "wrong_answer" : "runtime_error") : "accepted";
    return {
      testId: t.id,
      label: `Case ${i + 1}`,
      verdict: resultVerdict,
      input: t.input,
      expected: t.expected,
      actual: resultVerdict === "accepted" ? t.expected : resultVerdict === "wrong_answer" ? wrongOutput(t.expected) : "",
      runtimeMs: 12 + i * 3,
      stderr: resultVerdict === "runtime_error" ? RUNTIME_ERRORS[codeLanguage] : undefined,
    };
  });
  return {
    verdict: results.find((r) => r.verdict !== "accepted")?.verdict ?? "accepted",
    results,
    customInput: customInput?.trim() ? customInput : undefined,
  };
}

/**
 * Full submission: hidden tests, score, complexity and AI feedback.
 * Reuses a matching mock submission for this problem when one exists so the feedback is specific.
 */
export function simulateSubmit(
  problem: ProblemDetail,
  language: Language,
  code: string,
  verdict: DemoVerdict,
  templates: Submission[],
  sql: SqlJudgeData | undefined,
): SubmitOutcome {
  const template = templates.find((t) => t.verdict === verdict && t.language === language);
  const submission: Submission = template
    ? { ...template, id: "sub-preview", submittedAt: DEMO_NOW, code, review: undefined }
    : genericSubmission(problem, language, code, verdict);

  let log: string | undefined;
  let comparison: SqlComparison | undefined;
  if (problem.kind === "sql") {
    if (verdict === "runtime_error" || verdict === "time_limit_exceeded") log = SQL_ERRORS[verdict];
    else if (sql) comparison = compareSqlResults(sql.expected, verdict === "wrong_answer" ? sql.wrongAnswer : sql.expected);
  } else if (verdict === "compile_error") {
    log = COMPILE_ERRORS[language as CodeLanguage];
  } else if (verdict === "runtime_error") {
    log = RUNTIME_ERRORS[language as CodeLanguage];
  }
  return { submission, log, sql: comparison };
}

/** Multiset comparison of rows: which expected rows are missing and which of yours are extra. */
export function compareSqlResults(expected: SqlResultSet, actual: SqlResultSet): SqlComparison {
  const key = (row: SqlResultSet["rows"][number]) => JSON.stringify(row);
  const remaining = new Map<string, number>();
  actual.rows.forEach((row) => remaining.set(key(row), (remaining.get(key(row)) ?? 0) + 1));

  const missing: number[] = [];
  expected.rows.forEach((row, i) => {
    const count = remaining.get(key(row)) ?? 0;
    if (count > 0) remaining.set(key(row), count - 1);
    else missing.push(i);
  });

  const expectedCounts = new Map<string, number>();
  expected.rows.forEach((row) => expectedCounts.set(key(row), (expectedCounts.get(key(row)) ?? 0) + 1));
  const extra: number[] = [];
  actual.rows.forEach((row, i) => {
    const count = expectedCounts.get(key(row)) ?? 0;
    if (count > 0) expectedCounts.set(key(row), count - 1);
    else extra.push(i);
  });

  return { expected, actual, missing, extra };
}

function wrongOutput(expected: string) {
  const n = Number(expected);
  if (!Number.isNaN(n) && expected.trim() !== "") return String(n + 1);
  if (expected.startsWith("[")) return expected === "[]" ? "[0]" : "[]";
  return '""';
}

const PASS_RATE: Record<DemoVerdict, number> = {
  accepted: 1,
  wrong_answer: 0.7,
  time_limit_exceeded: 0.8,
  runtime_error: 0.4,
  compile_error: 0,
};

const RUBRIC: Record<DemoVerdict, number> = {
  accepted: 78,
  wrong_answer: 58,
  time_limit_exceeded: 52,
  runtime_error: 45,
  compile_error: 0,
};

function genericSubmission(problem: ProblemDetail, language: Language, code: string, verdict: DemoVerdict): Submission {
  const total = problem.sampleTests.length + problem.hiddenTestCount;
  const passed = Math.round(total * PASS_RATE[verdict]);
  const testsScore = Math.round((passed / total) * 100);
  const rubric = RUBRIC[verdict];
  const failFrom = passed; // tests are indexed 0..total-1; the last (total - passed) fail

  const tests: TestResult[] =
    verdict === "compile_error"
      ? []
      : [
          ...problem.sampleTests.map((t, i) => ({
            id: t.id,
            name: `Sample ${i + 1}`,
            verdict: "accepted" as Verdict,
            runtimeMs: 10 + i * 2,
            memoryMb: 16.4,
            hidden: false,
            input: t.input,
            expected: t.expected,
            actual: t.expected,
          })),
          ...Array.from({ length: problem.hiddenTestCount }, (_, i) => {
            const index = problem.sampleTests.length + i;
            const fails = index >= failFrom;
            const v: Verdict = fails ? (verdict === "accepted" ? "accepted" : verdict) : "accepted";
            return {
              id: `h${index + 1}`,
              name: `Hidden test ${index + 1}`,
              verdict: v,
              runtimeMs: v === "time_limit_exceeded" ? problem.timeLimitMs : 14 + ((i * 7) % 23),
              memoryMb: 18.4,
              hidden: true,
            };
          }),
        ];

  return {
    id: "sub-preview",
    problemId: problem.id,
    problemTitle: problem.title,
    kind: problem.kind,
    language,
    submittedAt: DEMO_NOW,
    verdict,
    testsPassed: passed,
    testsTotal: total,
    runtimeMs: { accepted: 64, wrong_answer: 58, time_limit_exceeded: problem.timeLimitMs, runtime_error: 12, compile_error: 0 }[verdict],
    memoryMb: verdict === "compile_error" ? 0 : 18.4,
    score: { tests: testsScore, rubric, total: Math.round(testsScore * 0.7 + rubric * 0.3), testsWeight: 70, rubricWeight: 30 },
    complexity: problem.kind === "sql" || verdict === "compile_error" ? undefined : genericComplexity(verdict),
    feedback: verdict === "compile_error" ? undefined : genericFeedback(verdict, passed, total, rubric),
    tests,
    code,
  };
}

function genericComplexity(verdict: DemoVerdict): ComplexityEstimate {
  if (verdict === "time_limit_exceeded") {
    return {
      time: "O(n²)",
      space: "O(1)",
      confidence: "medium",
      samples: [
        { n: 1_000, ms: 9 },
        { n: 10_000, ms: 640 },
        { n: 50_000, ms: 1_900 },
        { n: 100_000, ms: 2_000 },
      ],
      note: "Runtime roughly squares as the input grows, so the largest hidden inputs hit the 2-second limit.",
    };
  }
  return {
    time: "O(n)",
    space: "O(n)",
    confidence: "high",
    samples: [1_000, 10_000, 100_000, 500_000, 1_000_000].map((n) => ({ n, ms: Math.max(1, Math.round(n / 9_000)) })),
    note: "Runtime grows linearly with input size.",
  };
}

function genericFeedback(verdict: DemoVerdict, passed: number, total: number, rubric: number): AiFeedback {
  const aois: AoiItem[] = [];
  if (verdict === "wrong_answer") {
    aois.push({
      id: "g1",
      category: "correctness",
      severity: "important",
      title: "Recheck boundary conditions",
      detail: `${passed} of ${total} tests passed. The failures cluster on inputs at the edges of the constraints. Trace the smallest and largest cases by hand.`,
    });
  }
  if (verdict === "time_limit_exceeded") {
    aois.push({
      id: "g1",
      category: "complexity",
      severity: "important",
      title: "Large inputs time out",
      detail: "Your runtime grows faster than linear. With n up to 10⁵, aim for O(n log n) or better and avoid nested loops over the input.",
    });
  }
  if (verdict === "runtime_error") {
    aois.push({
      id: "g1",
      category: "correctness",
      severity: "important",
      title: "Guard against out-of-range access",
      detail: "The code reads past the end of an array on some inputs. Check loop bounds and empty inputs before indexing.",
      line: 9,
    });
  }
  aois.push(
    {
      id: "g2",
      category: "edge_cases",
      severity: verdict === "accepted" ? "info" : "suggestion",
      title: "Say your edge cases out loud",
      detail: "Empty input, a single element and duplicates are the cases interviewers ask about first. List them before you code.",
    },
    {
      id: "g3",
      category: "readability",
      severity: "suggestion",
      title: "Name variables after what they hold",
      detail: "Descriptive names make your reasoning visible to the interviewer and to the reviewer reading your code.",
    },
  );
  const scale = (max: number) => Math.round((rubric / 100) * max);
  return {
    summary:
      verdict === "accepted"
        ? "Accepted. The approach is sound; the rubric points go to clearer naming and stating edge cases explicitly."
        : "The approach needs work before it passes every hidden test. Start with the important item below.",
    confidence: verdict === "accepted" ? "high" : "medium",
    aois,
    rubric: [
      { criterion: "Algorithm choice", score: scale(10), max: 10, comment: "Judged against the expected optimal approach." },
      { criterion: "Edge-case handling", score: scale(10), max: 10, comment: "Based on failing tests and the code's guards." },
      { criterion: "Readability and naming", score: scale(10), max: 10, comment: "How easily a reviewer can follow the logic." },
      { criterion: "Complexity awareness", score: scale(10), max: 10, comment: "Whether the solution fits the input limits." },
    ],
  };
}
