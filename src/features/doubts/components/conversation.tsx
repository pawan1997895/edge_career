"use client";

import * as React from "react";
import { CircleCheck, MessageCircleQuestionMark, PanelLeft, Paperclip, RotateCcw, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DoubtThread } from "@/types/doubts";
import { HintLadder } from "./hint-ladder";
import { MessageBubble, TypingIndicator } from "./message-bubble";

export type HubView = "chat" | "context";

export function ConversationHeader({
  thread,
  view,
  onViewChange,
  onOpenList,
  onToggleResolved,
}: {
  thread: DoubtThread;
  view: HubView;
  onViewChange: (view: HubView) => void;
  onOpenList: () => void;
  onToggleResolved: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-b bg-card px-3 py-2.5 sm:px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onOpenList} aria-label="Show all doubts">
          <PanelLeft />
        </Button>
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">{thread.title}</h1>
        {thread.draft ? (
          <Badge variant="info">Draft</Badge>
        ) : (
          <Button variant="ghost" size="sm" onClick={onToggleResolved}>
            {thread.status === "resolved" ? (
              <>
                <RotateCcw /> Reopen
              </>
            ) : (
              <>
                <CircleCheck /> Mark resolved
              </>
            )}
          </Button>
        )}
      </div>
      <div className="flex h-8 rounded-md bg-muted p-0.5 xl:hidden" role="tablist" aria-label="Doubt view">
        {(["chat", "context"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => onViewChange(v)}
            className={cn(
              "flex-1 rounded-[5px] text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              view === v && "bg-card text-foreground shadow-xs",
            )}
          >
            {v === "chat" ? "Conversation" : "Context"}
          </button>
        ))}
      </div>
    </div>
  );
}

function suggestionsFor(thread: DoubtThread) {
  if (thread.context.lessonMoment) {
    return ["Can you explain this part more simply?", "Why does this approach work?", "Where is this used in real systems?"];
  }
  if (thread.context.problem) {
    return ["Why does my code fail a hidden test?", "Give me a nudge, not the answer", "What concept does this problem use?"];
  }
  return ["I don't understand a lesson concept", "My code works locally but fails here", "How should I prepare for the checkpoint?"];
}

function attachedLabels(thread: DoubtThread) {
  const c = thread.context;
  const labels: string[] = [];
  if (c.lessonMoment) labels.push(`Lesson at ${formatClock(c.lessonMoment.atSec)}`);
  if (c.problem) labels.push("Problem");
  if (c.code) labels.push("Current code");
  if (c.lastResult && c.lastResult.tone !== "info") labels.push("Latest result");
  return labels;
}

/** Messages, the hint ladder and the composer for one thread. Remount per thread (key) to reset the draft text. */
export function ChatPane({
  thread,
  typing,
  onSend,
  onHint,
  className,
}: {
  thread: DoubtThread;
  typing: boolean;
  onSend: (text: string) => void;
  onHint: () => void;
  className?: string;
}) {
  const [text, setText] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const attached = attachedLabels(thread);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.messages.length, typing]);

  function submit() {
    const value = text.trim();
    if (!value || typing) return;
    onSend(value);
    setText("");
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-5 px-4 py-5">
          {thread.messages.length === 0 && !typing ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircleQuestionMark className="size-5" />
              </span>
              <h2 className="mt-4 text-sm font-semibold">What are you stuck on?</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Edge AI explains and gives hints step by step. It never hands over a full solution.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {suggestionsFor(thread).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setText(s)}
                    className="rounded-full border bg-card px-3 py-1.5 text-[13px] hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            thread.messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          {typing && <TypingIndicator />}
        </div>
      </div>

      <div className="shrink-0 border-t bg-card">
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-3">
          <HintLadder given={thread.hintsGiven} busy={typing} onNext={onHint} />
          <div className="rounded-lg border bg-background focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/25">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={2}
              placeholder="Describe what you expected and what happened…"
              aria-label="Your question"
              className="min-h-14 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center gap-2 px-2.5 pb-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {attached.map((label) => (
                  <span key={label} className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    <Paperclip className="size-3" /> {label}
                  </span>
                ))}
              </div>
              <Button size="sm" onClick={submit} disabled={!text.trim() || typing}>
                <Send /> Ask
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">Enter to send · Shift + Enter for a new line</p>
        </div>
      </div>
    </div>
  );
}
