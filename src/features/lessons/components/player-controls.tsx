"use client";

import { Captions, Maximize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Tooltip } from "@/components/ui/tooltip";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LessonChapter } from "@/types/curriculum";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function PlayerControls({
  currentSec,
  durationSec,
  chapters,
  currentChapter,
  playing,
  muted,
  speed,
  showCaptions,
  onTogglePlay,
  onSeek,
  onToggleMute,
  onSpeedChange,
  onToggleCaptions,
  onFullscreen,
}: {
  currentSec: number;
  durationSec: number;
  chapters: LessonChapter[];
  currentChapter?: LessonChapter;
  playing: boolean;
  muted: boolean;
  speed: number;
  showCaptions: boolean;
  onTogglePlay: () => void;
  onSeek: (sec: number) => void;
  onToggleMute: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleCaptions: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="space-y-2 border-t px-3 pt-3 pb-2 sm:px-4">
      {/* Scrubber with chapter markers */}
      <div className="relative py-1">
        <Slider
          value={[currentSec]}
          max={durationSec}
          step={1}
          onValueChange={([v]) => onSeek(v ?? 0)}
          aria-label="Seek"
        />
        {chapters.slice(1).map((c) => (
          <span
            key={c.startSec}
            aria-hidden
            title={c.title}
            className="pointer-events-none absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 bg-card"
            style={{ left: `${(c.startSec / durationSec) * 100}%` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content={playing ? "Pause (Space)" : "Play (Space)"}>
          <Button variant="ghost" size="icon-sm" onClick={onTogglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause /> : <Play />}
          </Button>
        </Tooltip>
        <Tooltip content="Back 10 seconds">
          <Button variant="ghost" size="icon-sm" onClick={() => onSeek(Math.max(0, currentSec - 10))} aria-label="Back 10 seconds">
            <RotateCcw />
          </Button>
        </Tooltip>
        <Tooltip content="Forward 10 seconds">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSeek(Math.min(durationSec, currentSec + 10))}
            aria-label="Forward 10 seconds"
          >
            <RotateCw />
          </Button>
        </Tooltip>
        <Button variant="ghost" size="icon-sm" onClick={onToggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX /> : <Volume2 />}
        </Button>
        <span className="ml-1 text-xs tabular-nums text-muted-foreground">
          {formatClock(currentSec)} / {formatClock(durationSec)}
        </span>
        {currentChapter && (
          <span className="ml-2 hidden min-w-0 truncate text-xs text-muted-foreground md:inline">· {currentChapter.title}</span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Tooltip content={showCaptions ? "Hide captions" : "Show captions"}>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleCaptions}
              aria-pressed={showCaptions}
              aria-label="Captions"
              className={cn(showCaptions && "bg-accent text-accent-foreground")}
            >
              <Captions />
            </Button>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-14 px-2 tabular-nums" aria-label="Playback speed">
                {speed}×
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-32">
              <DropdownMenuLabel>Speed</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={String(speed)} onValueChange={(v) => onSpeedChange(Number(v))}>
                {SPEEDS.map((s) => (
                  <DropdownMenuRadioItem key={s} value={String(s)}>
                    {s}×
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip content="Full screen">
            <Button variant="ghost" size="icon-sm" onClick={onFullscreen} aria-label="Full screen">
              <Maximize />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
