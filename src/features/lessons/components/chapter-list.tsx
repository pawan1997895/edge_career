"use client";

import { CirclePlay } from "lucide-react";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LessonChapter } from "@/types/curriculum";

export function ChapterList({
  chapters,
  activeIndex,
  onSeek,
}: {
  chapters: LessonChapter[];
  activeIndex: number;
  onSeek: (sec: number) => void;
}) {
  return (
    <ol className="space-y-0.5 p-2">
      {chapters.map((chapter, i) => {
        const active = i === activeIndex;
        return (
          <li key={chapter.startSec}>
            <button
              type="button"
              onClick={() => onSeek(chapter.startSec)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm outline-none hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                active && "bg-accent font-medium text-accent-foreground",
              )}
            >
              <span className="w-5 text-xs tabular-nums text-muted-foreground">{i + 1}</span>
              <span className="flex-1">{chapter.title}</span>
              {active && <CirclePlay className="size-4 text-primary" />}
              <span className="text-xs tabular-nums text-muted-foreground">{formatClock(chapter.startSec)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
