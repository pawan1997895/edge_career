import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { INTERVIEW_STAGES, type InterviewStage } from "@/types/interviews";

/** Compact progress through the eight fixed interview stages. */
export function StageTracker({ stage, className }: { stage: InterviewStage; className?: string }) {
  const currentIndex = INTERVIEW_STAGES.findIndex((s) => s.key === stage);
  const current = INTERVIEW_STAGES[currentIndex];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ol className="flex items-center gap-1" aria-label="Interview stages">
        {INTERVIEW_STAGES.map((s, i) => (
          <li key={s.key}>
            <Tooltip content={s.label} side="bottom">
              <span
                aria-current={i === currentIndex ? "step" : undefined}
                aria-label={s.label}
                className={cn(
                  "block h-1.5 rounded-full transition-colors",
                  i === currentIndex ? "w-6 bg-primary" : "w-3.5",
                  i < currentIndex && "bg-primary/50",
                  i > currentIndex && "bg-muted-foreground/25",
                )}
              />
            </Tooltip>
          </li>
        ))}
      </ol>
      <p className="text-xs whitespace-nowrap text-muted-foreground">
        <span className="tabular-nums">
          {currentIndex + 1}/{INTERVIEW_STAGES.length}
        </span>{" "}
        · <span className="font-medium text-foreground">{current?.label}</span>
      </p>
    </div>
  );
}
