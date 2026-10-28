import { Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HINT_LEVELS, type HintLevel } from "@/types/doubts";

/** Nudge → Concept → Approach → Pseudocode, revealed one level at a time. */
export function HintLadder({ given, busy, onNext }: { given: HintLevel[]; busy: boolean; onNext: () => void }) {
  const next = HINT_LEVELS[given.length];

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <ol className="flex items-center gap-1" aria-label="Hint levels">
        {HINT_LEVELS.map((level, i) => {
          const done = given.includes(level.id);
          const isNext = level.id === next?.id;
          return (
            <li key={level.id} className="flex items-center gap-1">
              {i > 0 && <span className={cn("h-px w-3 sm:w-4", done ? "bg-primary" : "bg-border")} aria-hidden />}
              <Tooltip content={level.description}>
                <span
                  tabIndex={0}
                  className={cn(
                    "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px] font-medium whitespace-nowrap",
                    done && "border-primary/30 bg-primary/10 text-primary",
                    isNext && "border-primary border-dashed text-foreground",
                    !done && !isNext && "text-muted-foreground",
                  )}
                >
                  {done && <Check className="size-3" />}
                  {level.label}
                </span>
              </Tooltip>
            </li>
          );
        })}
      </ol>
      {next ? (
        <Button variant="outline" size="sm" onClick={onNext} disabled={busy}>
          <Lightbulb /> Get {next.label.toLowerCase()} hint
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">All hint levels used. The full solution is never shown.</p>
      )}
    </div>
  );
}
