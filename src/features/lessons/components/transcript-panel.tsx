"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircleQuestionMark, Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip } from "@/components/ui/tooltip";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { TranscriptCue } from "@/types/curriculum";

/** Transcript synced to playback: highlights the current line, click to seek, search, ask about a line. */
export function TranscriptPanel({
  lessonId,
  cues,
  activeIndex,
  onSeek,
}: {
  lessonId: string;
  cues: TranscriptCue[];
  activeIndex: number;
  onSeek: (sec: number) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [autoScroll, setAutoScroll] = React.useState(true);
  const listRef = React.useRef<HTMLOListElement>(null);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  const q = query.trim().toLowerCase();
  const visible = cues.map((cue, index) => ({ cue, index })).filter(({ cue }) => !q || cue.text.toLowerCase().includes(q));

  React.useEffect(() => {
    if (!autoScroll || q) return;
    const list = listRef.current;
    const el = itemRefs.current[activeIndex];
    if (!list || !el) return;
    list.scrollTo({ top: el.offsetTop - list.clientHeight / 3, behavior: "smooth" });
  }, [activeIndex, autoScroll, q]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcript"
            className="h-8 pl-8 text-[13px]"
            aria-label="Search transcript"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="transcript-autoscroll" checked={autoScroll} onCheckedChange={setAutoScroll} />
          <Label htmlFor="transcript-autoscroll" className="text-xs font-normal text-muted-foreground">
            Auto-scroll
          </Label>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
          <SearchX className="size-5" />
          No lines mention “{query}”.
        </div>
      ) : (
        <ol ref={listRef} className="relative max-h-[26rem] min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2 lg:max-h-none">
          {visible.map(({ cue, index }) => {
            const active = index === activeIndex;
            return (
              <li
                key={cue.startSec}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={cn("group flex items-start gap-1 rounded-md", active && "bg-accent")}
              >
                <button
                  type="button"
                  onClick={() => onSeek(cue.startSec)}
                  aria-current={active ? "true" : undefined}
                  className="flex flex-1 gap-3 rounded-md px-2 py-2 text-left text-[13px] leading-relaxed outline-none hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <span className={cn("w-10 shrink-0 pt-px text-xs tabular-nums", active ? "font-medium text-primary" : "text-muted-foreground")}>
                    {formatClock(cue.startSec)}
                  </span>
                  <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>
                    <Highlight text={cue.text} query={q} />
                  </span>
                </button>
                <Tooltip content="Ask about this line" side="left">
                  <Link
                    href={routes.askAboutLesson(lessonId, cue.startSec)}
                    aria-label={`Ask about the line at ${formatClock(cue.startSec)}`}
                    className={cn(
                      "mt-1.5 mr-1 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-card hover:text-primary focus-visible:opacity-100",
                      active && "opacity-100",
                    )}
                  >
                    <MessageCircleQuestionMark className="size-3.5" />
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query ? (
          <mark key={i} className="rounded-sm bg-warning/30 text-foreground">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
