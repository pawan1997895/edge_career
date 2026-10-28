"use client";

import * as React from "react";
import Link from "next/link";
import { Lightbulb, Lock, MessageCircleQuestionMark, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeBlock, RichText } from "@/components/shared/rich-text";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProblemHint } from "@/types/submissions";
import { HINT_LEVELS } from "@/types/submissions";

/**
 * Escalating hints: nudge → concept → approach → pseudocode, one at a time after a confirm.
 * The revealed count lives in the workspace so it survives switching tabs.
 */
export function HintLadder({
  hints,
  revealed,
  onReveal,
  problemId,
}: {
  hints: ProblemHint[];
  revealed: number;
  onReveal: () => void;
  problemId: string;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const next = HINT_LEVELS[revealed];

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <p className="text-[13px] text-muted-foreground">
        Hints get more specific at each step. Take only what you need: hints you open are noted on your submission so you can see how much
        help you used.
      </p>

      <ol className="space-y-2.5">
        {HINT_LEVELS.map((level, i) => {
          const hint = hints.find((h) => h.level === level.level);
          const isRevealed = i < revealed;
          const isNext = i === revealed;
          return (
            <li key={level.level} className={cn("rounded-md border", isRevealed && "border-primary/30 bg-accent/40")}>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isRevealed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
                {isNext && (
                  <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)}>
                    <Lightbulb /> Reveal
                  </Button>
                )}
                {!isRevealed && !isNext && <Lock className="size-4 text-muted-foreground" aria-label="Reveal the previous hint first" />}
              </div>
              {isRevealed && hint && (
                <div className="border-t px-3 py-3 text-sm">
                  {hint.level === "pseudocode" ? <CodeBlock code={hint.text} className="bg-card" /> : <RichText text={hint.text} />}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-3 sm:flex-row sm:items-center">
        <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
        <p className="flex-1 text-[13px] text-muted-foreground">Hints never include the full solution. For a conversation about your own code, use the doubt hub.</p>
        <Button size="sm" variant="secondary" asChild>
          <Link href={routes.askAboutProblem(problemId)}>
            <MessageCircleQuestionMark /> Continue in doubt hub
          </Link>
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reveal the {next?.label.toLowerCase()} hint?</DialogTitle>
            <DialogDescription>
              {next?.description}. Try for a few more minutes first if you can; struggling a little is how the pattern sticks.
            </DialogDescription>
          </DialogHeader>
          {revealed > 0 && (
            <Badge variant="muted" className="w-fit">
              {revealed} of {HINT_LEVELS.length} hints used
            </Badge>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep trying</Button>
            </DialogClose>
            <Button
              onClick={() => {
                onReveal();
                setConfirmOpen(false);
              }}
            >
              Reveal hint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
