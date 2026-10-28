"use client";

import { CircleCheck, CircleX, FlaskConical, LoaderCircle, Play, Scale } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LldProblem, LldTestResult } from "@/types/system-design";

export interface LldSubmissionResult {
  testsPassed: number;
  testsTotal: number;
  rubricPercent: number;
  total: number;
}

/** Hidden test results, the SOLID/patterns rubric and the final submission score. */
export function LldResultsPanel({
  problem,
  fileCount,
  testState,
  testResults,
  onRunTests,
  submission,
  submitting,
}: {
  problem: LldProblem;
  fileCount: number;
  testState: "idle" | "loading" | "success" | "error";
  testResults?: LldTestResult[];
  onRunTests: () => void;
  submission?: LldSubmissionResult;
  submitting: boolean;
}) {
  const rubricAvailable = Boolean(submission) || problem.status !== "not_started";

  return (
    <Tabs defaultValue="tests" className="flex min-h-0 flex-1 flex-col gap-0 bg-card">
      <div className="shrink-0 border-b px-3 py-2">
        <TabsList className="w-full">
          <TabsTrigger value="tests" className="flex-1">
            <FlaskConical /> Hidden tests
          </TabsTrigger>
          <TabsTrigger value="rubric" className="flex-1">
            <Scale /> Rubric
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {(submitting || submission) && <SubmissionCard submission={submission} submitting={submitting} />}

        <TabsContent value="tests">
          {testState === "idle" && (
            <EmptyState
              icon={FlaskConical}
              title="Hidden tests haven't run yet"
              description={`${problem.tests.length} unit tests call your public classes. You see names and failure messages, not the test code.`}
              action={
                <Button size="sm" onClick={onRunTests}>
                  <Play /> Run hidden tests
                </Button>
              }
            />
          )}
          {testState === "loading" && <TestsLoading fileCount={fileCount} testCount={problem.tests.length} />}
          {testState === "success" && testResults && <TestResults results={testResults} onRerun={onRunTests} />}
        </TabsContent>

        <TabsContent value="rubric">
          {rubricAvailable ? (
            <RubricView problem={problem} />
          ) : (
            <EmptyState
              icon={Scale}
              title="Rubric score appears after you submit"
              description="The AI reviewer scores SOLID principles, design patterns, extensibility and naming."
            />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}

function SubmissionCard({ submission, submitting }: { submission?: LldSubmissionResult; submitting: boolean }) {
  if (submitting || !submission) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-lg border p-4 text-sm">
        <LoaderCircle className="size-4 animate-spin text-primary" />
        Grading your submission: hidden tests, then the rubric review…
      </div>
    );
  }
  return (
    <div className="mb-4 flex items-center gap-4 rounded-lg border p-4">
      <ScoreRing score={submission.total} size={72} />
      <div className="min-w-0 text-sm">
        <p className="font-medium">{submission.total >= 85 ? "Passed" : "Below the 85% pass bar"}</p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Tests {submission.testsPassed}/{submission.testsTotal} (70%) · Rubric {submission.rubricPercent}% (30%)
        </p>
      </div>
    </div>
  );
}

function TestsLoading({ fileCount, testCount }: { fileCount: number; testCount: number }) {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm">
        <LoaderCircle className="size-4 animate-spin text-primary" />
        Compiling {fileCount} files and running {testCount} hidden tests in the sandbox…
      </p>
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-9" />
      ))}
    </div>
  );
}

function TestResults({ results, onRerun }: { results: LldTestResult[]; onRerun: () => void }) {
  const passed = results.filter((r) => r.passed).length;
  const allPassed = passed === results.length;
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">
            {passed} of {results.length} tests passed
          </p>
          <Button variant="outline" size="sm" onClick={onRerun}>
            <Play /> Run again
          </Button>
        </div>
        <Progress value={(passed / results.length) * 100} tone={allPassed ? "success" : passed / results.length >= 0.7 ? "warning" : "destructive"} className="mt-2" />
      </div>
      <ul className="divide-y rounded-lg border">
        {results.map((r) => (
          <li key={r.name} className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              {r.passed ? <CircleCheck className="size-4 shrink-0 text-success" /> : <CircleX className="size-4 shrink-0 text-destructive" />}
              <span className="min-w-0 flex-1 truncate font-mono text-[12.5px]">{r.name}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{r.durationMs} ms</span>
            </div>
            {!r.passed && r.message && <p className="mt-1.5 ml-6 rounded-md bg-destructive/5 p-2 text-[13px] text-destructive">{r.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RubricView({ problem }: { problem: LldProblem }) {
  const total = problem.rubric.reduce((s, c) => s + c.score, 0);
  const max = problem.rubric.reduce((s, c) => s + c.max, 0);
  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">Design rubric</h3>
        <span className="text-sm font-medium tabular-nums">
          {total}/{max} · {Math.round((total / max) * 100)}%
        </span>
      </div>
      <ul className="space-y-3">
        {problem.rubric.map((c) => (
          <li key={c.criterion}>
            <div className="flex items-center justify-between text-sm">
              <span>{c.criterion}</span>
              <span className="flex gap-0.5" aria-label={`${c.score} out of ${c.max}`}>
                {Array.from({ length: c.max }, (_, i) => (
                  <span key={i} className={cn("h-1.5 w-3 rounded-full", i < c.score ? "bg-primary" : "bg-muted")} />
                ))}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{c.comment}</p>
          </li>
        ))}
      </ul>
      <div>
        <h3 className="text-sm font-semibold">Design patterns detected</h3>
        <ul className="mt-2 space-y-2">
          {problem.patternsDetected.map((p) => (
            <li key={p.name} className="flex items-start justify-between gap-3 rounded-md border px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="font-mono text-[12px] text-muted-foreground">{p.where}</p>
              </div>
              <Badge variant={p.verdict === "good" ? "success" : "warning"}>{p.verdict === "good" ? "Good use" : "Questionable"}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
