"use client";

import { Lightbulb, Quote } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, type ProgressTone } from "@/components/ui/progress";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import { INTERVIEW_METRICS, type ScorecardMetric, type TranscriptTurn } from "@/types/interviews";

export function scoreTone(score: number): ProgressTone {
  if (score >= 3.8) return "success";
  if (score >= 3) return "primary";
  return "warning";
}

/** One scorecard metric: score, evidence quoted from the transcript, and tips. */
export function MetricCard({
  metric,
  transcript,
  onJumpToTurn,
}: {
  metric: ScorecardMetric;
  transcript: TranscriptTurn[];
  onJumpToTurn: (turnId: string) => void;
}) {
  const meta = INTERVIEW_METRICS.find((m) => m.key === metric.key)!;
  const assessed = metric.score !== null;

  return (
    <Card className={cn(!assessed && "bg-muted/30")}>
      <CardHeader>
        <CardTitle>{meta.label}</CardTitle>
        <CardDescription>{meta.description}</CardDescription>
        <CardAction className="text-right">
          {assessed ? (
            <p className="text-lg font-semibold tabular-nums">
              {metric.score!.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground"> / 5</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Not assessed</p>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessed && <Progress value={(metric.score! / 5) * 100} tone={scoreTone(metric.score!)} aria-label={`${meta.label} score`} />}
        <p className="text-sm">{metric.summary}</p>

        {metric.evidence.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Quote className="size-3.5" /> Evidence from your transcript
            </p>
            <ul className="space-y-2">
              {metric.evidence.map((e) => {
                const turn = transcript.find((t) => t.id === e.turnId);
                return (
                  <li key={e.turnId}>
                    <button
                      type="button"
                      onClick={() => onJumpToTurn(e.turnId)}
                      className="group flex w-full gap-3 rounded-md border-l-2 border-primary/40 bg-muted/40 px-3 py-2 text-left text-[13px] hover:bg-accent"
                    >
                      <span className="shrink-0 font-mono text-xs text-primary tabular-nums group-hover:underline">
                        {turn ? formatClock(turn.atSec) : "—"}
                      </span>
                      <span className="italic">“{e.quote}”</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {metric.tips.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Lightbulb className="size-3.5" /> How to improve
            </p>
            <ul className="list-disc space-y-1 pl-5 text-[13px]">
              {metric.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
