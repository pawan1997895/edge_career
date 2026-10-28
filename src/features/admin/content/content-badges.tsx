// Badges for content files, publish states and the lesson production pipeline.

import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CheckStatus, CiStatus, LessonStage, PublishStatus, RenderStatus } from "@/types/admin-content";

export function CiStatusBadge({ status }: { status: CiStatus }) {
  if (status === "passing")
    return (
      <Badge variant="success">
        <CircleCheck /> Passing
      </Badge>
    );
  if (status === "failing")
    return (
      <Badge variant="destructive">
        <CircleX /> Failing
      </Badge>
    );
  return (
    <Badge variant="info">
      <LoaderCircle className="animate-spin" /> Running
    </Badge>
  );
}

export function CheckStatusIcon({ status }: { status: CheckStatus }) {
  if (status === "pass") return <CircleCheck className="size-4 shrink-0 text-success" aria-label="Passed" />;
  if (status === "fail") return <CircleX className="size-4 shrink-0 text-destructive" aria-label="Failed" />;
  return <LoaderCircle className="size-4 shrink-0 animate-spin text-info" aria-label="Running" />;
}

export function PublishBadge({ status }: { status: PublishStatus }) {
  const map = {
    published: { label: "Published", variant: "success" },
    in_review: { label: "In review", variant: "warning" },
    draft: { label: "Draft", variant: "muted" },
  } as const;
  return <Badge variant={map[status].variant}>{map[status].label}</Badge>;
}

export const STAGES: { id: LessonStage; label: string; who: string }[] = [
  { id: "outline", label: "Outline", who: "Subject expert" },
  { id: "script_draft", label: "Script draft", who: "Claude drafts" },
  { id: "expert_review", label: "Expert review", who: "Subject expert" },
  { id: "avatar_video", label: "Avatar video", who: "HeyGen render" },
  { id: "published", label: "Published", who: "CDN + transcript" },
];

export function stageLabel(stage: LessonStage) {
  return STAGES.find((s) => s.id === stage)!.label;
}

export function RenderStatusBadge({ status, progress }: { status: RenderStatus; progress?: number }) {
  switch (status) {
    case "ready":
      return <Badge variant="success">Video ready</Badge>;
    case "rendering":
      return (
        <Badge variant="info">
          <LoaderCircle className="animate-spin" /> Rendering {progress ?? 0}%
        </Badge>
      );
    case "queued":
      return <Badge variant="secondary">Render queued</Badge>;
    case "failed":
      return <Badge variant="destructive">Render failed</Badge>;
    default:
      return <Badge variant="muted">No video yet</Badge>;
  }
}
