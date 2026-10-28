"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import { INTERVIEW_STAGES } from "@/types/interviews";
import type { LiveTurn } from "./use-conversation";

/** Running transcript of the session, with a marker whenever the stage changes. */
export function LiveTranscript({ turns, typing = false }: { turns: LiveTurn[]; typing?: boolean }) {
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [turns.length, typing]);

  if (turns.length === 0 && !typing) {
    return <p className="p-4 text-sm text-muted-foreground">The transcript will appear here as you talk.</p>;
  }

  return (
    <div className="space-y-3 p-4">
      {turns.map((turn, i) => {
        const stageChanged = i === 0 || turns[i - 1]!.stage !== turn.stage;
        return (
          <React.Fragment key={turn.id}>
            {stageChanged && <StageDivider stage={turn.stage} />}
            <TranscriptBubble turn={turn} />
          </React.Fragment>
        );
      })}
      {typing && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </span>
          Interviewer is typing
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

export function StageDivider({ stage }: { stage: LiveTurn["stage"] }) {
  const label = INTERVIEW_STAGES.find((s) => s.key === stage)?.label ?? stage;
  return (
    <div className="flex items-center gap-2 pt-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function TranscriptBubble({ turn }: { turn: LiveTurn }) {
  const isCandidate = turn.speaker === "candidate";
  return (
    <div className={cn("flex flex-col gap-1", isCandidate && "items-end")}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{isCandidate ? "You" : "Interviewer"}</span>
        <span className="tabular-nums">{formatClock(turn.atSec)}</span>
        {turn.interrupted && <Badge variant="muted">Interrupted</Badge>}
      </div>
      <p
        className={cn(
          "max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed",
          isCandidate ? "bg-primary/10" : "bg-muted",
          turn.interrupted && "opacity-70",
        )}
      >
        {turn.text}
      </p>
    </div>
  );
}
