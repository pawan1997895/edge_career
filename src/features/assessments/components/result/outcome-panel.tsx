import Link from "next/link";
import { ArrowRight, BookOpen, Check, CircleCheck, CircleX, Clock, Hourglass, LockOpen, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ExamResult } from "@/types/assessments";

/** The part of the result page that changes with the outcome: next steps, review status or retake plan. */
export function OutcomePanel({ result, nextModuleId }: { result: ExamResult; nextModuleId?: string }) {
  if (result.outcome === "pass") return <PassedPanel result={result} nextModuleId={nextModuleId} />;
  if (result.outcome === "review") return <ReviewPanel result={result} />;
  return <FailedPanel result={result} />;
}

function PassedPanel({ result, nextModuleId }: { result: ExamResult; nextModuleId?: string }) {
  const { exam } = result;
  return (
    <div className="space-y-4">
      <Alert variant="success">
        <LockOpen />
        <AlertTitle>{exam.kind === "placement" ? "Placement complete" : `${exam.nextUnlock} is unlocked`}</AlertTitle>
        <AlertDescription>
          {exam.kind === "placement"
            ? "Modules where you scored 85% or more are now marked tested out."
            : `You scored ${result.score}%, above the ${exam.passScore}% pass mark. Your progress and skill mastery have been updated.`}
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {nextModuleId && (
            <Button asChild>
              <Link href={routes.module(nextModuleId)}>
                Start {exam.nextUnlock} <ArrowRight />
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={routes.learn}>View curriculum</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={routes.progress}>See skill progress</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const REVIEW_STEPS = [
  { label: "Submitted", done: true },
  { label: "Auto-graded: hidden tests and AI rubric", done: true },
  { label: "Human review", done: false, current: true },
  { label: "Final result", done: false },
];

function ReviewPanel({ result }: { result: ExamResult }) {
  return (
    <div className="space-y-4">
      <Alert variant="warning">
        <Hourglass />
        <AlertTitle>A reviewer is checking your result</AlertTitle>
        <AlertDescription>
          {result.score}% is inside the {result.exam.reviewBand.min}–{result.exam.reviewBand.max}% band near the pass line, so a person checks
          the grading before it&apos;s final. Expected by {result.reviewDueAt ? formatDateTime(result.reviewDueAt) : "tomorrow"}.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>What happens next</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {REVIEW_STEPS.map((step) => (
              <li key={step.label} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    step.done && "border-success bg-success text-success-foreground",
                    step.current && "border-warning bg-warning/15",
                  )}
                >
                  {step.done ? <Check className="size-3" /> : step.current ? <Clock className="size-3 text-warning" /> : null}
                </span>
                <span className={cn(!step.done && !step.current && "text-muted-foreground", step.current && "font-medium")}>{step.label}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[13px] text-muted-foreground">
            The reviewer can confirm, raise or lower the score. Your module stays as it is until then, and you can keep working on
            optional items.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FailedPanel({ result }: { result: ExamResult }) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <CircleX />
        <AlertTitle>Not passed this time</AlertTitle>
        <AlertDescription>
          You scored {result.score}%; the pass mark is {result.exam.passScore}%. Your retake opens on{" "}
          {result.retakeAt ? formatDateTime(result.retakeAt) : "tomorrow"} and uses a fresh, randomized question set.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Weakest areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.weakAreas.map((w) => (
            <div key={w.skill} className="flex items-center gap-3 rounded-md border p-3">
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{w.skill}</p>
                <p className="text-xs text-muted-foreground">{w.score}% on related questions</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={w.href}>
                  {w.action} <ArrowRight />
                </Link>
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button disabled>
              <RotateCcw /> Retake available in 24h
            </Button>
            <Link href={routes.doubts} className="text-[13px] text-primary hover:underline">
              Ask the doubt hub about a question
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function OutcomeHeadline({ result }: { result: ExamResult }) {
  if (result.outcome === "pass") {
    return (
      <p className="flex items-center gap-2 text-lg font-semibold text-success">
        <CircleCheck className="size-5" /> Passed
      </p>
    );
  }
  if (result.outcome === "review") {
    return (
      <p className="flex items-center gap-2 text-lg font-semibold text-warning-foreground dark:text-warning">
        <Hourglass className="size-5" /> Under human review
      </p>
    );
  }
  return (
    <p className="flex items-center gap-2 text-lg font-semibold text-destructive">
      <CircleX className="size-5" /> Not passed
    </p>
  );
}
