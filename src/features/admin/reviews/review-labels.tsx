// Labels and badges for the human review queue.

import { CircleCheck, CircleDot, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEMO_NOW } from "@/lib/format";
import type { Confidence, ReviewItemType, ReviewReason, ReviewStatus } from "@/types/admin-content";

/** Results must be reviewed within this many hours. */
export const REVIEW_SLA_HOURS = 24;

export const REASON_LABELS: Record<ReviewReason, string> = {
  near_threshold: "Near pass bar (80–88%)",
  low_confidence: "Low AI confidence",
  appeal: "Learner appeal",
  integrity_flag: "Integrity flag",
};

export const ITEM_TYPE_LABELS: Record<ReviewItemType, string> = {
  code: "Code",
  design: "Design",
  exam: "Exam",
  interview: "Interview",
};

export const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending",
  in_review: "In review",
  resolved: "Resolved",
};

export function ReasonBadge({ reason }: { reason: ReviewReason }) {
  const variant = { near_threshold: "warning", low_confidence: "info", appeal: "default", integrity_flag: "destructive" } as const;
  return <Badge variant={variant[reason]}>{REASON_LABELS[reason]}</Badge>;
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const variant = { low: "destructive", medium: "warning", high: "success" } as const;
  return (
    <Badge variant={variant[confidence]} className="capitalize">
      {confidence}
    </Badge>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  if (status === "resolved")
    return (
      <Badge variant="success">
        <CircleCheck /> Resolved
      </Badge>
    );
  if (status === "in_review")
    return (
      <Badge variant="info">
        <CircleDot /> In review
      </Badge>
    );
  return (
    <Badge variant="outline">
      <Clock /> Pending
    </Badge>
  );
}

export function waitingHours(submittedAt: string) {
  return Math.max(0, Math.round((new Date(DEMO_NOW).getTime() - new Date(submittedAt).getTime()) / 3_600_000));
}

export function formatWaiting(hours: number) {
  if (hours < 1) return "< 1h";
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}
