"use client";

import * as React from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { LiveTurn } from "./use-conversation";
import { LiveTranscript } from "./live-transcript";

/** Chat-based interview: the transcript plus a message composer. */
export function TextChat({
  turns,
  typing,
  done,
  sampleAnswer,
  onSend,
}: {
  turns: LiveTurn[];
  typing: boolean;
  done: boolean;
  sampleAnswer?: string;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = React.useState("");

  function submit() {
    if (!draft.trim() || typing) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <LiveTranscript turns={turns} typing={typing} />
      </div>
      <div className="shrink-0 border-t bg-card p-3">
        {done ? (
          <p className="py-2 text-center text-sm text-muted-foreground">The interviewer has wrapped up. End the interview to get your scorecard.</p>
        ) : (
          <>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Type your answer… (Shift + Enter for a new line)"
              className="max-h-40 min-h-16 resize-none"
              aria-label="Your answer"
            />
            <div className="mt-2 flex items-center gap-2">
              {sampleAnswer && (
                <Button variant="ghost" size="sm" onClick={() => setDraft(sampleAnswer)} disabled={typing}>
                  <Sparkles /> Use sample answer
                </Button>
              )}
              <Button size="sm" className="ml-auto" onClick={submit} disabled={!draft.trim() || typing}>
                <Send /> Send
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
