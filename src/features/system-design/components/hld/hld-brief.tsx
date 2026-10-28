import { Building, Clock } from "lucide-react";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { formatMinutes } from "@/lib/format";
import type { HldProblem } from "@/types/system-design";

/** The problem statement, scale hints and rubric weights. */
export function HldBrief({ problem }: { problem: HldProblem }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {formatMinutes(problem.estimatedMin)}
          </span>
          <span className="flex items-center gap-1">
            <Building className="size-3.5" /> {problem.companies.join(", ")}
          </span>
        </div>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          {problem.brief.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Scale to design for</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {problem.scaleHints.map((hint) => (
            <li key={hint} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
              {hint}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold">What you&apos;re graded on</h3>
        <ul className="mt-2 divide-y rounded-md border">
          {problem.rubric.map((r) => (
            <li key={r.criterion} className="flex items-center justify-between px-3 py-2 text-sm">
              <span>{r.criterion}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{r.weight}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
