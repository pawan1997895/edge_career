import Link from "next/link";
import { CalendarDays, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModuleStatusBadge } from "@/components/shared/status-badges";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";

/** Elective cards. Each shows its prerequisite and whether it is unlocked yet. */
export function ElectiveGrid({ electives, all }: { electives: Module[]; all: Module[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {electives.map((mod) => {
        const prereq = all.find((m) => m.id === mod.prerequisiteIds[0]);
        const locked = mod.status === "locked";
        return (
          <Card key={mod.id} className="group relative p-4 transition-colors hover:border-primary/40">
            <div className="flex items-start justify-between gap-2">
              <Link href={routes.module(mod.id)} className={cn("font-medium after:absolute after:inset-0", locked && "text-muted-foreground")}>
                {mod.title}
              </Link>
              <ModuleStatusBadge status={mod.status} />
            </div>
            <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{mod.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3" /> {mod.weeks} weeks
              </span>
              {prereq && (
                <span className="flex items-center gap-1">
                  {locked && <Lock className="size-3" />}
                  Requires {prereq.number ? `Module ${prereq.number}` : prereq.title}
                  {prereq.number ? ` · ${prereq.title}` : ""}
                </span>
              )}
            </div>
            {!locked && (
              <div className="mt-3 flex items-center gap-2">
                <Progress value={mod.progress} tone={mod.progress === 100 ? "success" : "primary"} aria-label={`${mod.title} progress`} />
                <span className="text-xs tabular-nums text-muted-foreground">{mod.progress}%</span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
