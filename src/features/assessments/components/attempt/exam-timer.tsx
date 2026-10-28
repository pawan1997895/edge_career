import { Timer } from "lucide-react";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Countdown display. Turns amber in the last 10 minutes and red in the last 2. */
export function ExamTimer({ remainingSec, className }: { remainingSec: number; className?: string }) {
  const tone = remainingSec <= 120 ? "text-destructive border-destructive/40 bg-destructive/8" : remainingSec <= 600 ? "border-warning/50 bg-warning/10" : "";
  return (
    <div
      role="timer"
      aria-label={`Time remaining ${formatClock(remainingSec)}`}
      className={cn("flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-sm font-medium tabular-nums", tone, className)}
    >
      <Timer className="size-4 text-muted-foreground" />
      {formatClock(remainingSec)}
    </div>
  );
}
