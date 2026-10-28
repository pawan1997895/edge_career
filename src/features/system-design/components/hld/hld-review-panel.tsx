"use client";

import { CircleCheck, Hourglass, LoaderCircle, Send, Sparkles, TrendingUp, UserCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/shared/score-ring";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DesignCheck, DesignReview } from "@/types/system-design";

const REVIEW_STEPS = ["Running automatic checks", "Reading your write-up", "Scoring against the rubric"];

/** Submit the design and show the AI review (or the human-review hand-off when the grader is unsure). */
export function HldReviewPanel({
  review,
  isNew,
  loading,
  checks,
  onSubmit,
}: {
  review?: DesignReview;
  /** True when the review came from a submission in this session. */
  isNew: boolean;
  loading: boolean;
  checks: DesignCheck[];
  onSubmit: () => void;
}) {
  const errors = checks.filter((c) => c.severity === "error").length;
  const warnings = checks.filter((c) => c.severity === "warning").length;

  if (loading) {
    return (
      <div className="rounded-lg border p-5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <LoaderCircle className="size-4 animate-spin text-primary" /> Reviewing your design…
        </p>
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
          {REVIEW_STEPS.map((step) => (
            <li key={step} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground/60" /> {step}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">Usually takes 20–40 seconds.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium">{review ? "Submit a new version" : "Ready to submit?"}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Automatic checks run first, then the AI reviewer scores the diagram and write-up against the rubric. If the grader is unsure, a human reviewer
          confirms the score.
        </p>
        {(errors > 0 || warnings > 0) && (
          <p className="mt-2 text-[13px] text-warning-foreground dark:text-warning">
            {errors > 0 && `${errors} ${errors === 1 ? "issue" : "issues"}`}
            {errors > 0 && warnings > 0 && " and "}
            {warnings > 0 && `${warnings} ${warnings === 1 ? "warning" : "warnings"}`} in the checks will cost points. You can still submit.
          </p>
        )}
        <Button className="mt-3 w-full" onClick={onSubmit}>
          <Send /> Submit for review
        </Button>
      </div>

      {review && <ReviewResult review={review} isNew={isNew} />}
    </div>
  );
}

function ReviewResult({ review, isNew }: { review: DesignReview; isNew: boolean }) {
  const pending = Boolean(review.humanReview);
  return (
    <div className="space-y-5">
      {pending && review.humanReview && (
        <Alert variant="warning">
          <Hourglass />
          <AlertTitle>Low grader confidence: sent to human review</AlertTitle>
          <AlertDescription>
            <p>{review.humanReview.reason}</p>
            <p className="mt-1">
              Submitted {formatDateTime(review.humanReview.submittedAt)} · expected by {formatDateTime(review.humanReview.expectedBy)}
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <ScoreRing score={review.overall} size={88} label={pending ? "provisional" : "out of 100"} />
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {isNew ? <Badge variant="info">New review</Badge> : <Badge variant="secondary">Last review</Badge>}
            <Badge variant={review.confidence === "low" ? "warning" : "success"}>
              {review.confidence === "low" ? <Hourglass /> : <UserCheck />} {review.confidence} confidence
            </Badge>
          </div>
          <p className="text-sm">
            {pending ? "Score not final until a reviewer confirms it." : review.overall >= 85 ? "Passed. This counts toward Module 4." : "Below the 85% pass bar. Revise and resubmit."}
          </p>
          <p className="text-xs text-muted-foreground">Reviewed {formatDateTime(review.reviewedAt)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Rubric</h3>
        <ul className="mt-2 space-y-3">
          {review.criteria.map((c) => {
            const pct = (c.score / c.max) * 100;
            return (
              <li key={c.criterion}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span>{c.criterion}</span>
                  <span className="text-xs font-medium tabular-nums">
                    {c.score}/{c.max}
                  </span>
                </div>
                <Progress value={pct} tone={pct >= 85 ? "success" : pct >= 65 ? "warning" : "destructive"} className="mt-1.5" />
                <p className="mt-1 text-[13px] text-muted-foreground">{c.comment}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <FeedbackList title="Strengths" icon={<CircleCheck className="size-4 text-success" />} items={review.strengths} />
      <FeedbackList title="Improve next" icon={<TrendingUp className="size-4 text-info" />} items={review.improvements} />

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Sparkles className="mt-0.5 size-3.5 shrink-0" />
        AI review by Claude against this problem&apos;s versioned rubric. Text inside your diagram or write-up can&apos;t change the rubric.
      </p>
    </div>
  );
}

function FeedbackList({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className={cn("flex gap-2 text-[13px]")}>
            <span className="mt-0.5 shrink-0">{icon}</span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
