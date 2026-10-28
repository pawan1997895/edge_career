// Data access for coding and SQL problems. Replace the mock returns with API calls later.

import { problemDetails, problemHints, problemSummaries, recommendationReasons, sqlJudgeData } from "@/mocks/problems";
import type { ProblemDetail, ProblemSummary } from "@/types/practice";
import type { ProblemHint, ProblemRecommendation, SqlJudgeData } from "@/types/submissions";

export async function getProblems(): Promise<ProblemSummary[]> {
  return problemSummaries;
}

export async function getRecommendedProblems(): Promise<ProblemSummary[]> {
  return problemSummaries.filter((p) => p.recommended);
}

/** Recommended problems with the reason adaptive selection picked each one. */
export async function getRecommendations(): Promise<(ProblemRecommendation & { problem: ProblemSummary })[]> {
  return recommendationReasons.flatMap((r) => {
    const problem = problemSummaries.find((p) => p.id === r.problemId);
    return problem ? [{ ...r, problem }] : [];
  });
}

export async function getProblemHints(problem: ProblemSummary): Promise<ProblemHint[]> {
  return problemHints[problem.id] ?? genericHints(problem);
}

/** Reference output of the SQL judge's reference query (and a wrong result for the demo). */
export async function getSqlJudgeData(problemId: string): Promise<SqlJudgeData> {
  return (
    sqlJudgeData[problemId] ?? {
      expected: {
        columns: ["id", "name"],
        rows: [
          [1, "Asha"],
          [2, "Rohan"],
        ],
      },
      wrongAnswer: { columns: ["id", "name"], rows: [[1, "Asha"]] },
    }
  );
}

function genericHints(problem: ProblemSummary): ProblemHint[] {
  const topics = problem.topics.join(", ");
  return [
    { level: "nudge", text: "Work through the first example by hand. What do you keep track of as you go?" },
    { level: "concept", text: `This problem is tagged ${topics}. Which pattern from those lessons fits the constraints?` },
    { level: "approach", text: "Check the constraints first: with up to 10⁵ items you need O(n log n) or better, so avoid nested loops over the input." },
    { level: "pseudocode", text: "Write the steps as comments before coding:\n    handle the edge cases\n    the main loop and what it updates\n    what you return" },
  ];
}

export async function getProblem(problemId: string): Promise<ProblemDetail | undefined> {
  const summary = problemSummaries.find((p) => p.id === problemId);
  if (!summary) return undefined;
  return { ...summary, ...(problemDetails[problemId] ?? placeholderDetail(summary)) };
}

/** Generic content so every problem in the list opens a working workspace in the mock UI. */
function placeholderDetail(summary: ProblemSummary): Omit<ProblemDetail, keyof ProblemSummary> {
  if (summary.kind === "sql") {
    return {
      statement: [`Write a PostgreSQL query for "${summary.title}". The full statement is authored in the content repository.`],
      examples: [{ input: "See the schema panel", output: "Expected rows are compared with the reference query" }],
      constraints: ["Return rows in any order unless the problem says otherwise"],
      starterCode: { sql: "-- Write a PostgreSQL query\nSELECT 1;\n" },
      sampleTests: [{ id: "t1", input: "Sample dataset", expected: "Matches reference output" }],
      hiddenTestCount: 6,
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      schema: [
        {
          name: "users",
          columns: [
            { name: "id", type: "int" },
            { name: "name", type: "varchar" },
            { name: "created_at", type: "date" },
          ],
          rows: [
            [1, "Asha", "2026-01-04"],
            [2, "Rohan", "2026-02-11"],
          ],
        },
      ],
    };
  }
  return {
    statement: [`Solve "${summary.title}". The full statement is authored in the content repository.`],
    examples: [{ input: "nums = [1, 2, 3]", output: "6" }],
    constraints: ["1 ≤ n ≤ 10⁵"],
    starterCode: {
      python: "class Solution:\n    def solve(self, nums: list[int]) -> int:\n        pass\n",
      java: "class Solution {\n    public int solve(int[] nums) {\n        return 0;\n    }\n}\n",
      cpp: "class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        return 0;\n    }\n};\n",
      javascript: "function solve(nums) {\n  // Write your solution here\n}\n",
      go: "func solve(nums []int) int {\n\treturn 0\n}\n",
    },
    sampleTests: [{ id: "t1", input: "[1, 2, 3]", expected: "6" }],
    hiddenTestCount: 30,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
  };
}
