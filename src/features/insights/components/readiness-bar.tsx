import { cn } from "@/lib/utils";

/**
 * Horizontal bar for an estimated readiness score with a marker at the expert-set bar.
 * Green once the score reaches the bar.
 */
export function ReadinessBar({ score, target, label, className }: { score: number; target: number; label: string; className?: string }) {
  const reached = score >= target;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      aria-valuetext={`${score} out of 100, bar is ${target}`}
      className={cn("relative h-2.5 w-full rounded-full bg-muted", className)}
    >
      <div className={cn("h-full rounded-full", reached ? "bg-success" : "bg-primary")} style={{ width: `${score}%` }} />
      <span
        aria-hidden
        title={`Expert-set bar: ${target}`}
        className="absolute -top-1 h-4.5 w-0.5 rounded-full bg-foreground"
        style={{ left: `calc(${target}% - 1px)` }}
      />
    </div>
  );
}
