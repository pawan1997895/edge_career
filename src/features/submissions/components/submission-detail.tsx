import Link from "next/link";
import { CodeXml, MessageCircleQuestionMark, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ScoreRing } from "@/components/shared/score-ring";
import { VerdictBadge } from "@/components/shared/status-badges";
import { AoiList } from "@/features/submissions/components/aoi-list";
import { AppealDialog } from "@/features/submissions/components/appeal-dialog";
import { CodeViewer } from "@/features/submissions/components/code-viewer";
import { ComplexitySummary } from "@/features/submissions/components/complexity-summary";
import { LogOutput } from "@/features/submissions/components/log-output";
import { ResourceUsage } from "@/features/submissions/components/resource-usage";
import { ReviewStatusAlert, ReviewStatusBadge } from "@/features/submissions/components/review-status";
import { RubricTable } from "@/features/submissions/components/rubric-table";
import { ScoreBreakdownView } from "@/features/submissions/components/score-breakdown";
import { TestResults } from "@/features/submissions/components/test-results";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ProblemDetail, Submission } from "@/types/practice";
import { LANGUAGE_LABELS } from "@/types/practice";

const CONFIDENCE_VARIANT = { high: "success", medium: "warning", low: "destructive" } as const;

/** Full result page for one submission: score, tests, AI feedback (AOIs + rubric), complexity and code. */
export function SubmissionDetail({ submission: s, problem, log }: { submission: Submission; problem?: ProblemDetail; log?: string }) {
  const timeLimitMs = problem?.timeLimitMs ?? 2000;
  const memoryLimitMb = problem?.memoryLimitMb ?? 256;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Submissions", href: routes.submissions }, { label: s.id }]}
        title={s.problemTitle}
        meta={
          <>
            <VerdictBadge verdict={s.verdict} />
            <Badge variant="outline">{LANGUAGE_LABELS[s.language]}</Badge>
            <span className="text-[13px] text-muted-foreground">Submitted {formatDateTime(s.submittedAt)}</span>
            <ReviewStatusBadge review={s.review} />
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.problem(s.problemId)}>
                <CodeXml /> Open in workspace
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.askAboutProblem(s.problemId)}>
                <MessageCircleQuestionMark /> Ask in doubt hub
              </Link>
            </Button>
            <AppealDialog submissionId={s.id} alreadyInReview={s.review?.status === "queued"} />
          </>
        }
      />

      <div className="space-y-4">
        {s.review && <ReviewStatusAlert review={s.review} />}
        {log && <LogOutput title={s.verdict === "compile_error" ? "Compiler output" : "Runtime error"} log={log} />}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Score</CardTitle>
              <CardDescription>Coding problems are scored 70% on hidden tests and 30% on the AI rubric.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <ScoreRing score={s.score.total} label="of 100" />
              <div className="w-full flex-1">
                <ScoreBreakdownView score={s.score} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> AI feedback
              </CardTitle>
              <CardDescription>Areas of improvement from the AI review of your code and test results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {s.feedback ? (
                <>
                  <div className="rounded-md bg-muted/50 p-3 text-sm">{s.feedback.summary}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                    <ShieldCheck className="size-4" />
                    Grader confidence
                    <Badge variant={CONFIDENCE_VARIANT[s.feedback.confidence]}>{s.feedback.confidence}</Badge>
                    {s.feedback.confidence === "low" && <span>Low-confidence grades always go to a human reviewer.</span>}
                  </div>
                  <section>
                    <h3 className="mb-2 text-sm font-semibold">Areas of improvement</h3>
                    <AoiList aois={s.feedback.aois} />
                  </section>
                  <section>
                    <h3 className="mb-2 text-sm font-semibold">Rubric</h3>
                    <RubricTable rubric={s.feedback.rubric} />
                  </section>
                </>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No AI review for this submission"
                  description="The AI review runs once your code compiles and the tests run. Fix the error above and submit again."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test results</CardTitle>
              <CardDescription>
                {s.testsPassed} of {s.testsTotal} tests passed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {s.tests.length > 0 ? (
                <TestResults tests={s.tests} />
              ) : (
                <EmptyState icon={CodeXml} title="Tests didn't run" description="The code didn't compile, so no tests were executed." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submitted code</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeViewer code={s.code} language={s.language} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resources used</CardTitle>
              <CardDescription>Sandbox limits for this problem</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceUsage runtimeMs={s.runtimeMs} memoryMb={s.memoryMb} timeLimitMs={timeLimitMs} memoryLimitMb={memoryLimitMb} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complexity</CardTitle>
            </CardHeader>
            <CardContent>
              {s.complexity ? (
                <ComplexitySummary complexity={s.complexity} timeLimitMs={timeLimitMs} />
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  {s.kind === "sql"
                    ? "SQL answers are graded by comparing your rows with the reference query's output, plus the rubric. No complexity estimate is made."
                    : "No estimate: the code has to compile and run before it can be timed."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next steps</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href={routes.problem(s.problemId)}>
                  <RotateCcw /> Try again in the workspace
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href={routes.askAboutProblem(s.problemId)}>
                  <MessageCircleQuestionMark /> Ask about this result
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href={routes.submissions}>All submissions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
