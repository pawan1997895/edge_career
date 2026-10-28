import { CircleCheck, CircleDashed, CircleDot, Lock } from "lucide-react";
import type { ProblemProgress } from "@/types/practice";

const LABELS: Record<ProblemProgress | "locked", string> = {
  solved: "Solved",
  attempted: "Attempted",
  not_started: "Not started",
  locked: "Locked",
};

/** Solved / attempted / not started / locked marker for problem lists. */
export function ProblemStatusIcon({ progress, locked = false }: { progress: ProblemProgress; locked?: boolean }) {
  const key = locked ? "locked" : progress;
  const label = LABELS[key];
  if (key === "locked") return <Lock className="size-4 text-muted-foreground" aria-label={label} />;
  if (key === "solved") return <CircleCheck className="size-4 text-success" aria-label={label} />;
  if (key === "attempted") return <CircleDot className="size-4 text-warning" aria-label={label} />;
  return <CircleDashed className="size-4 text-muted-foreground/60" aria-label={label} />;
}

export function problemProgressLabel(progress: ProblemProgress) {
  return LABELS[progress];
}
