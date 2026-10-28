"use client";

import { Gauge, Hand, Info, Mic, MicOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LiveTurn } from "./use-conversation";
import { StreamingCaption } from "./streaming-caption";

const LATENCY_TARGET_MS = 1500;

/**
 * The interviewer in voice and avatar sessions: speaking state, live captions,
 * mic and interrupt controls, and reply latency against the 1.5 s target.
 */
export function VoicePanel({
  variant,
  turns,
  speaking,
  speakingTurn,
  muted,
  onToggleMute,
  onInterrupt,
  waitingForMic,
  done,
}: {
  variant: "voice" | "avatar";
  turns: LiveTurn[];
  speaking: boolean;
  speakingTurn?: LiveTurn;
  muted: boolean;
  onToggleMute: () => void;
  onInterrupt: () => void;
  waitingForMic: boolean;
  done: boolean;
}) {
  const latencies = turns.filter((t) => t.speaker === "interviewer" && t.latencyMs).map((t) => t.latencyMs!);
  const lastLatency = latencies.at(-1);
  const avgLatency = latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : undefined;
  const lastTurn = turns.at(-1);

  const status = done ? "Interview complete" : speaking ? "Speaking" : waitingForMic ? "Waiting for you" : "Listening";

  return (
    <div className="space-y-4 border-b p-4">
      {variant === "avatar" && (
        <Alert variant="info">
          <Info />
          <AlertDescription>Preview: the live video avatar is planned for Phase 2; this session runs in voice.</AlertDescription>
        </Alert>
      )}

      {variant === "avatar" ? (
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted">
          <InterviewerAvatar speaking={speaking} size="lg" />
          <Badge variant="secondary" className="absolute top-2 left-2">
            Avatar preview
          </Badge>
          <span className="absolute bottom-2 left-2 rounded bg-background/80 px-1.5 py-0.5 text-xs">Interviewer</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <InterviewerAvatar speaking={speaking} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">AI interviewer</p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <SpeakingBars active={speaking} /> {status}
            </p>
          </div>
        </div>
      )}
      {variant === "avatar" && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <SpeakingBars active={speaking} /> {status}
        </p>
      )}

      <div className="min-h-16 rounded-md bg-muted/50 p-3 text-sm" aria-live="polite">
        {lastTurn ? (
          <>
            <span className="text-xs font-medium text-muted-foreground">{lastTurn.speaker === "interviewer" ? "Interviewer" : "You"}</span>
            <p className="mt-0.5 leading-relaxed">
              <StreamingCaption key={lastTurn.id} text={lastTurn.text} streaming={speaking && speakingTurn?.id === lastTurn.id} />
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Connecting… the interviewer will greet you in a moment.</p>
        )}
      </div>

      {waitingForMic && (
        <Alert variant="warning">
          <MicOff />
          <AlertDescription>You&apos;re muted. Unmute to answer.</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button variant={muted ? "destructive" : "outline"} className="flex-1" onClick={onToggleMute} aria-pressed={muted}>
          {muted ? <MicOff /> : <Mic />} {muted ? "Unmute" : "Mute"}
        </Button>
        <Tooltip content="Cut the interviewer off and start speaking">
          <Button variant="outline" className="flex-1" onClick={onInterrupt} disabled={!speaking}>
            <Hand /> Interrupt
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Gauge className="size-3.5" />
        <span>Reply latency</span>
        {avgLatency !== undefined ? (
          <>
            <span className="font-medium text-foreground tabular-nums">{(avgLatency / 1000).toFixed(1)} s avg</span>
            <span
              className={cn(
                "tabular-nums",
                lastLatency !== undefined && lastLatency > LATENCY_TARGET_MS ? "text-warning-foreground dark:text-warning" : "",
              )}
            >
              · last {((lastLatency ?? 0) / 1000).toFixed(1)} s
            </span>
            <span className="ml-auto">target &lt; 1.5 s</span>
          </>
        ) : (
          <span className="ml-auto">measuring…</span>
        )}
      </div>
    </div>
  );
}

function InterviewerAvatar({ speaking, size }: { speaking: boolean; size: "sm" | "lg" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/12 font-semibold text-primary ring-offset-2 ring-offset-background transition-shadow",
        size === "sm" ? "size-11 text-sm" : "size-24 text-2xl",
        speaking ? "ring-2 ring-primary" : "ring-0",
      )}
      aria-hidden
    >
      AI
    </span>
  );
}

/** Small level bars shown while the interviewer is speaking. */
function SpeakingBars({ active }: { active: boolean }) {
  return (
    <span className="flex h-3 items-end gap-0.5" aria-hidden>
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <span
          key={i}
          className={cn("w-0.5 rounded-full", active ? "animate-pulse bg-primary" : "bg-muted-foreground/40")}
          style={{ height: active ? `${h * 100}%` : "30%", animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
