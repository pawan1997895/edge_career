import { Boxes, CodeXml, MessageSquare, MessagesSquare, Mic, Network, Video, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  INTERVIEW_MODE_LABELS,
  INTERVIEW_TYPE_LABELS,
  RECOMMENDATION_LABELS,
  type InterviewMode,
  type InterviewType,
  type Recommendation,
} from "@/types/interviews";

export const INTERVIEW_TYPE_ICONS: Record<InterviewType, LucideIcon> = {
  dsa: CodeXml,
  lld: Boxes,
  hld: Network,
  behavioral: MessagesSquare,
};

export const INTERVIEW_MODE_ICONS: Record<InterviewMode, LucideIcon> = {
  text: MessageSquare,
  voice: Mic,
  avatar: Video,
};

const RECOMMENDATION_VARIANT: Record<Recommendation, "success" | "info" | "warning" | "destructive"> = {
  strong_hire: "success",
  hire: "success",
  lean_hire: "info",
  lean_no_hire: "warning",
  no_hire: "destructive",
};

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return <Badge variant={RECOMMENDATION_VARIANT[recommendation]}>{RECOMMENDATION_LABELS[recommendation]}</Badge>;
}

export function InterviewTypeBadge({ type }: { type: InterviewType }) {
  const Icon = INTERVIEW_TYPE_ICONS[type];
  return (
    <Badge variant="secondary">
      <Icon /> {INTERVIEW_TYPE_LABELS[type]}
    </Badge>
  );
}

export function InterviewModeBadge({ mode }: { mode: InterviewMode }) {
  const Icon = INTERVIEW_MODE_ICONS[mode];
  return (
    <Badge variant="outline">
      <Icon /> {INTERVIEW_MODE_LABELS[mode]}
    </Badge>
  );
}

/** 3.6 → "3.6 / 5" */
export function formatInterviewScore(score: number | null | undefined) {
  return score == null ? "—" : `${score.toFixed(1)} / 5`;
}
