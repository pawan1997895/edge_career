import Link from "next/link";
import { ClipboardCheck, Lock, Shuffle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";
import { routes } from "@/lib/routes";
import type { CheckpointSummary } from "@/types/curriculum";

const STATUS_BADGE: Record<CheckpointSummary["status"], { label: string; variant: "muted" | "info" | "success" | "destructive" | "warning" }> = {
  locked: { label: "Locked", variant: "muted" },
  available: { label: "Ready", variant: "info" },
  passed: { label: "Passed", variant: "success" },
  failed: { label: "Not passed", variant: "destructive" },
  under_review: { label: "In human review", variant: "warning" },
};

/** Checkpoint exam summary for a module: best score against the pass bar, attempts and the next action. */
export function CheckpointCard({ checkpoint, moduleLocked }: { checkpoint: CheckpointSummary; moduleLocked: boolean }) {
  const badge = STATUS_BADGE[checkpoint.status];
  const isRetake = checkpoint.attempts > 0 && checkpoint.status === "available";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="size-4 text-muted-foreground" /> Checkpoint exam
        </CardTitle>
        <CardDescription>Pass mark {checkpoint.passScore}%</CardDescription>
        <CardAction>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {checkpoint.bestScore !== undefined ? (
          <div className="flex items-center gap-4">
            <ScoreRing score={checkpoint.bestScore} passScore={checkpoint.passScore} size={72} label="best" />
            <div className="text-sm">
              <p>
                {checkpoint.attempts} attempt{checkpoint.attempts === 1 ? "" : "s"}
              </p>
              <p className="text-muted-foreground">
                {checkpoint.status === "passed"
                  ? "Passed. You can still review your answers."
                  : `${checkpoint.passScore - checkpoint.bestScore} points below the pass mark`}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {checkpoint.status === "locked"
              ? "Becomes available once every required item in this module is passed."
              : "Not attempted yet."}
          </p>
        )}

        <p className="flex gap-2 text-[13px] text-muted-foreground">
          <Shuffle className="mt-0.5 size-3.5 shrink-0" />
          Retakes use a fresh, randomized question set.
        </p>

        {checkpoint.status === "locked" || moduleLocked ? (
          <Button variant="outline" className="w-full" disabled>
            <Lock /> Checkpoint locked
          </Button>
        ) : checkpoint.status === "passed" ? (
          <Button variant="outline" className="w-full" asChild>
            <Link href={routes.examResult(checkpoint.examId)}>View result</Link>
          </Button>
        ) : checkpoint.status === "under_review" ? (
          <Button variant="outline" className="w-full" asChild>
            <Link href={routes.examResult(checkpoint.examId)}>View review status</Link>
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={routes.exam(checkpoint.examId)}>{isRetake ? "Retake checkpoint" : "Start checkpoint"}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
