import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { routes } from "@/lib/routes";
import type { PlacementSectionResult } from "@/types/assessments";

/** Per-module placement scores against the 85% test-out bar. */
export function PlacementResultList({ sections, passScore = 85 }: { sections: PlacementSectionResult[]; passScore?: number }) {
  return (
    <ul className="space-y-4">
      {sections.map((s) => (
        <li key={s.moduleId}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link href={routes.module(s.moduleId)} className="min-w-0 truncate hover:text-primary">
              {s.moduleTitle}
            </Link>
            <span className="flex shrink-0 items-center gap-2">
              {s.testedOut && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <CircleCheck className="size-3.5" /> Tested out
                </span>
              )}
              <span className="font-semibold tabular-nums">{s.score}%</span>
            </span>
          </div>
          <div className="relative mt-2">
            <Progress value={s.score} tone={s.testedOut ? "success" : "muted"} aria-label={`${s.moduleTitle} score`} />
            <span
              className="absolute -top-1 h-3.5 w-px bg-foreground/60"
              style={{ left: `${passScore}%` }}
              aria-hidden
              title={`${passScore}% test-out bar`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
