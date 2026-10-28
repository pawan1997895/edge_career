import { CircleCheck, CircleDot, CircleX, Hourglass, Lock, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AttemptOutcome, ExamDetail, ReviewCase, ReviewOrigin } from "@/types/assessments";

export function AttemptOutcomeBadge({ outcome, humanReviewed }: { outcome: AttemptOutcome; humanReviewed?: boolean }) {
  if (outcome === "under_review") {
    return (
      <Badge variant="warning">
        <Hourglass /> Under review
      </Badge>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {outcome === "passed" ? (
        <Badge variant="success">
          <CircleCheck /> Passed
        </Badge>
      ) : (
        <Badge variant="destructive">
          <CircleX /> Not passed
        </Badge>
      )}
      {humanReviewed && (
        <Badge variant="muted">
          <UserCheck /> Human reviewed
        </Badge>
      )}
    </span>
  );
}

export function ExamStatusBadge({ status }: { status: ExamDetail["status"] }) {
  switch (status) {
    case "available":
      return (
        <Badge variant="info">
          <CircleDot /> Ready to take
        </Badge>
      );
    case "passed":
      return (
        <Badge variant="success">
          <CircleCheck /> Passed
        </Badge>
      );
    case "under_review":
      return (
        <Badge variant="warning">
          <Hourglass /> Under review
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <CircleX /> Not passed
        </Badge>
      );
    default:
      return (
        <Badge variant="muted">
          <Lock /> Locked
        </Badge>
      );
  }
}

export const REVIEW_ORIGIN_LABELS: Record<ReviewOrigin, string> = {
  appeal: "Your appeal",
  near_threshold: "Near the pass line (80–88%)",
  low_confidence: "AI grader unsure",
};

export function ReviewStatusBadge({ status }: { status: ReviewCase["status"] }) {
  if (status === "resolved") return <Badge variant="secondary">Resolved</Badge>;
  if (status === "in_review") return <Badge variant="info">In review</Badge>;
  return <Badge variant="warning">Queued</Badge>;
}
