"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TranscriptTurn } from "@/types/interviews";
import { StageDivider } from "../live/live-transcript";

/** Full transcript with search and stage markers. `highlightId` is scrolled into view and outlined. */
export function TranscriptView({ transcript, highlightId }: { transcript: TranscriptTurn[]; highlightId?: string }) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const turns = q ? transcript.filter((t) => t.text.toLowerCase().includes(q)) : transcript;

  React.useEffect(() => {
    if (!highlightId) return;
    document.getElementById(`turn-${highlightId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [highlightId]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the transcript" className="h-8 pl-8" aria-label="Search the transcript" />
        </div>
        <span className="text-xs text-muted-foreground sm:ml-auto">
          {q ? `${turns.length} of ${transcript.length} turns match` : `${transcript.length} turns`}
        </span>
      </div>

      {turns.length === 0 ? (
        <EmptyState icon={Search} title={`Nothing matches “${query}”`} description="Try a different word or phrase." className="m-5" />
      ) : (
        <ol className="space-y-3 p-5">
          {turns.map((turn, i) => {
            const stageChanged = i === 0 || turns[i - 1]!.stage !== turn.stage;
            const isCandidate = turn.speaker === "candidate";
            return (
              <React.Fragment key={turn.id}>
                {stageChanged && (
                  <li aria-hidden>
                    <StageDivider stage={turn.stage} />
                  </li>
                )}
                <li
                  id={`turn-${turn.id}`}
                  className={cn(
                    "grid scroll-mt-24 grid-cols-[3.5rem_1fr] gap-3 rounded-md p-2 sm:grid-cols-[3.5rem_7rem_1fr]",
                    turn.id === highlightId && "bg-accent ring-2 ring-primary/40",
                  )}
                >
                  <span className="pt-0.5 font-mono text-xs text-muted-foreground tabular-nums">{formatClock(turn.atSec)}</span>
                  <span className={cn("text-xs font-medium sm:pt-0.5", isCandidate ? "text-primary" : "text-foreground")}>
                    {isCandidate ? "You" : "Interviewer"}
                  </span>
                  <p className="col-span-2 text-sm leading-relaxed sm:col-span-1">
                    <Highlighted text={turn.text} query={q} />
                  </p>
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query ? (
          <mark key={i} className="rounded-sm bg-warning/30 px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
