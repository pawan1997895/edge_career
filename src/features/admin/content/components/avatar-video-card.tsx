"use client";

import { CirclePlay, Clapperboard, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RenderStatusBadge } from "@/features/admin/content/content-badges";
import { formatClock } from "@/lib/format";
import type { LessonScript, RenderStatus } from "@/types/admin-content";

/** Avatar video render status (provider: HeyGen). Rendering progress is simulated by the parent. */
export function AvatarVideoCard({
  video,
  onRetry,
}: {
  video: LessonScript["video"];
  onRetry: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar video</CardTitle>
        <CardDescription>
          {video.avatar} · {video.voice}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <VideoPreview status={video.status} durationSec={video.durationSec} />
        <div className="flex items-center justify-between gap-2">
          <RenderStatusBadge status={video.status} progress={video.progress} />
          {video.status === "failed" && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RotateCcw /> Retry render
            </Button>
          )}
        </div>
        {(video.status === "rendering" || video.status === "queued") && (
          <div>
            <Progress value={video.progress} tone="info" aria-label="Render progress" />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {video.status === "queued" ? "Waiting for a render slot…" : `Rendering on HeyGen · ${video.progress}%`}
            </p>
          </div>
        )}
        {video.status === "failed" && (
          <p className="flex gap-2 text-xs text-destructive">
            <TriangleAlert className="mt-px size-3.5 shrink-0" /> Provider timed out at 81%. No credits were charged for the failed render.
          </p>
        )}
        {video.status === "not_started" && (
          <p className="text-xs text-muted-foreground">The video is generated automatically once the script is approved.</p>
        )}
      </CardContent>
    </Card>
  );
}

function VideoPreview({ status, durationSec }: { status: RenderStatus; durationSec?: number }) {
  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md border bg-muted">
      {status === "ready" ? (
        <>
          <CirclePlay className="size-10 text-muted-foreground" />
          {durationSec && (
            <span className="absolute right-2 bottom-2 rounded bg-foreground/80 px-1.5 py-0.5 text-[11px] text-background tabular-nums">
              {formatClock(durationSec)}
            </span>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
          <Clapperboard className="size-7" />
          <span className="text-xs">{status === "failed" ? "Render failed" : "Preview appears when the render finishes"}</span>
        </div>
      )}
    </div>
  );
}
