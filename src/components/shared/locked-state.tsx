import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UnlockRequirement {
  label: string;
  done: boolean;
}

/** Full panel for content the learner cannot open yet. Lists exactly what unlocks it. */
export function LockedState({
  title,
  description,
  requirements,
  action,
  className,
}: {
  title: string;
  description?: string;
  requirements?: UnlockRequirement[];
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-lg border bg-card px-6 py-10 text-center", className)}>
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Lock className="size-5" />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {requirements && requirements.length > 0 && (
        <ul className="mt-5 w-full max-w-sm space-y-2 text-left">
          {requirements.map((r) => (
            <li key={r.label} className="flex items-start gap-2.5 text-sm">
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                  r.done ? "border-success bg-success text-success-foreground" : "border-input",
                )}
              >
                {r.done && <Check className="size-3" />}
              </span>
              <span className={cn(r.done && "text-muted-foreground line-through")}>{r.label}</span>
            </li>
          ))}
        </ul>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Slim banner for pages that are viewable as a preview while still locked. */
export function LockedBanner({ children, action, className }: { children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border bg-muted/60 px-4 py-3 text-sm sm:flex-row sm:items-center", className)}>
      <Lock className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 text-muted-foreground">{children}</div>
      {action}
    </div>
  );
}
