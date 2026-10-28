"use client";

import * as React from "react";
import { Play, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stand-in for the pre-recorded avatar video. Shows a presenter placeholder, the
 * current chapter as a "slide", and captions. The real player streams from the CDN.
 */
export function VideoStage({
  ref,
  playing,
  chapterTitle,
  moduleLabel,
  caption,
  showCaptions,
  onTogglePlay,
  onSeekBy,
}: {
  ref?: React.Ref<HTMLDivElement>;
  playing: boolean;
  chapterTitle: string;
  moduleLabel: string;
  caption?: string;
  showCaptions: boolean;
  onTogglePlay: () => void;
  onSeekBy: (deltaSec: number) => void;
}) {
  return (
    <div
      ref={ref}
      role="region"
      aria-label="Lesson video. Space to play or pause, arrow keys to skip 5 seconds."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "k") {
          e.preventDefault();
          onTogglePlay();
        } else if (e.key === "ArrowRight") {
          onSeekBy(5);
        } else if (e.key === "ArrowLeft") {
          onSeekBy(-5);
        }
      }}
      onClick={onTogglePlay}
      className="relative aspect-video w-full cursor-pointer overflow-hidden bg-muted outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
    >
      <div className="grid h-full grid-cols-1 sm:grid-cols-[2fr_3fr]">
        {/* Avatar presenter placeholder */}
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-20 items-center justify-center rounded-full border-4 border-card bg-primary/15 text-primary sm:size-28">
            <User className="size-10 sm:size-14" />
          </span>
          <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-xs">AI avatar presenter</span>
        </div>
        {/* Slide area */}
        <div className="hidden items-center p-6 sm:flex">
          <div className="w-full rounded-lg border bg-card p-5 shadow-xs">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{moduleLabel}</p>
            <p className="mt-2 text-lg font-semibold leading-snug">{chapterTitle}</p>
            <div className="mt-4 space-y-1.5">
              <div className="h-2 w-5/6 rounded bg-muted" />
              <div className="h-2 w-2/3 rounded bg-muted" />
              <div className="h-2 w-3/4 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>

      {!playing && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md">
            <Play className="ml-0.5 size-6" />
          </span>
        </span>
      )}

      {showCaptions && caption && (
        <p
          className={cn(
            "absolute inset-x-0 bottom-3 mx-auto w-fit max-w-[92%] rounded-md bg-foreground/85 px-3 py-1.5 text-center text-[13px] leading-snug text-background sm:bottom-5 sm:text-sm",
          )}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
