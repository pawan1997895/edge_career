import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModuleStatus } from "@/types/curriculum";

/** Numbered circle used in the core-track stepper. Shows a tick when passed and a lock when locked. */
export function ModuleMarker({ number, status, className }: { number?: number; status: ModuleStatus; className?: string }) {
  const done = status === "passed" || status === "tested_out";
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums",
        done && "border-success bg-success text-success-foreground",
        status === "in_progress" && "border-primary bg-primary text-primary-foreground",
        status === "unlocked" && "border-primary text-primary",
        status === "locked" && "bg-muted text-muted-foreground",
        className,
      )}
    >
      {done ? <Check className="size-4" /> : status === "locked" ? <Lock className="size-3.5" /> : number}
    </span>
  );
}
