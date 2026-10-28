"use client";

import { Flag, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatClock } from "@/lib/format";
import type { NavigatorState } from "./question-navigator";

export function SubmitExamDialog({
  open,
  onOpenChange,
  states,
  remainingSec,
  integrityEvents,
  submitting,
  onSubmit,
  onJump,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  states: NavigatorState[];
  remainingSec: number;
  integrityEvents: number;
  submitting: boolean;
  onSubmit: () => void;
  onJump: (index: number) => void;
}) {
  const unanswered = states.flatMap((s, i) => (s.answered ? [] : [i]));
  const flagged = states.flatMap((s, i) => (s.flagged ? [i] : []));

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit your exam?</DialogTitle>
          <DialogDescription>
            You have {formatClock(remainingSec)} left. You can&apos;t change answers after submitting.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md border p-3">
            <p className="text-lg font-semibold tabular-nums">{states.length - unanswered.length}</p>
            <p className="text-xs text-muted-foreground">Answered</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-lg font-semibold tabular-nums">{flagged.length}</p>
            <p className="text-xs text-muted-foreground">Flagged</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-lg font-semibold tabular-nums">{integrityEvents}</p>
            <p className="text-xs text-muted-foreground">Logged events</p>
          </div>
        </div>

        {unanswered.length > 0 && (
          <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <TriangleAlert className="size-4 text-warning" /> {unanswered.length} unanswered
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {unanswered.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onJump(i)}
                  className="rounded border bg-card px-2 py-0.5 text-xs font-medium hover:bg-accent"
                >
                  Q{i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {flagged.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Flag className="size-3.5 fill-warning text-warning" /> Flagged:
            {flagged.map((i) => (
              <button key={i} type="button" onClick={() => onJump(i)} className="rounded border bg-card px-2 py-0.5 text-xs font-medium hover:bg-accent">
                Q{i + 1}
              </button>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Keep working
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : <Send />}
            {submitting ? "Submitting…" : "Submit exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
