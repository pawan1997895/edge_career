import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";
import { ConfidenceBadge } from "@/features/admin/reviews/review-labels";
import type { ReviewDetail } from "@/types/admin-content";

/** AI score, how it was built, and the grader's own summary. */
export function ReviewScoreCard({ review }: { review: ReviewDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI grade</CardTitle>
        <CardDescription>{review.scoringRule} · pass mark {review.passScore}%</CardDescription>
        <CardAction>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Confidence <ConfidenceBadge confidence={review.confidence} />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <ScoreRing score={review.aiScore} passScore={review.passScore} label="AI total" className="shrink-0 self-center sm:self-start" />
        <div className="min-w-0 flex-1 space-y-4">
          <ul className="space-y-2">
            {review.scoreParts.map((part) => (
              <li key={part.label} className="text-[13px]">
                <div className="flex items-baseline justify-between gap-2">
                  <span>{part.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {part.value} × {part.weight}% = <span className="font-medium text-foreground">{((part.value * part.weight) / 100).toFixed(1)}</span>
                  </span>
                </div>
                <span className="mt-1 block h-1.5 rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${part.value}%` }} />
                </span>
              </li>
            ))}
          </ul>
          <p className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">{review.aiSummary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
