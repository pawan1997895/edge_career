import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModuleStatusBadge } from "@/components/shared/status-badges";
import { ModuleMarker } from "@/features/curriculum/components/module-marker";
import { lockReason, moduleLabel } from "@/features/curriculum/lib";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Module } from "@/types/curriculum";

/** The six core modules as an ordered stepper. Each module unlocks after the previous one. */
export function CoreTrackList({ modules, all }: { modules: Module[]; all: Module[] }) {
  return (
    <ol className="relative space-y-3">
      {modules.map((mod, i) => (
        <li key={mod.id} className="relative flex gap-3 sm:gap-4">
          {/* Connector line between markers */}
          {i < modules.length - 1 && <span aria-hidden className="absolute top-10 bottom-[-0.75rem] left-4 w-px bg-border" />}
          <ModuleMarker number={mod.number} status={mod.status} className="relative mt-4" />
          <CoreModuleCard mod={mod} all={all} />
        </li>
      ))}
    </ol>
  );
}

function CoreModuleCard({ mod, all }: { mod: Module; all: Module[] }) {
  const locked = mod.status === "locked";
  const reason = locked ? lockReason(mod, all) : undefined;
  const { checkpoint } = mod;
  const cta =
    mod.status === "in_progress" ? "Continue" : mod.status === "passed" || mod.status === "tested_out" ? "Review" : locked ? "View outline" : "Start";

  return (
    <Card className={cn("min-w-0 flex-1 p-4 sm:p-5", mod.status === "in_progress" && "border-primary/40")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{moduleLabel(mod)}</span>
            <ModuleStatusBadge status={mod.status} />
          </div>
          <h3 className={cn("mt-1 font-semibold", locked && "text-muted-foreground")}>{mod.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{mod.summary}</p>
        </div>
        <Button variant={mod.status === "in_progress" ? "default" : "outline"} size="sm" asChild className="self-start">
          <Link href={routes.module(mod.id)}>
            {cta} <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" /> {mod.weeks} weeks
        </span>
        <span className="flex items-center gap-1.5">
          <ClipboardCheck className="size-3.5" />
          {checkpoint.bestScore !== undefined
            ? `Checkpoint best ${checkpoint.bestScore}% (pass ${checkpoint.passScore}%)`
            : `Checkpoint pass mark ${checkpoint.passScore}%`}
        </span>
        {reason && (
          <span className="flex items-center gap-1.5 text-foreground">
            <Lock className="size-3.5 text-muted-foreground" /> {reason}
          </span>
        )}
      </div>

      {!locked && (
        <div className="mt-3 flex items-center gap-3">
          <Progress value={mod.progress} tone={mod.progress === 100 ? "success" : "primary"} aria-label={`${mod.title} progress`} />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{mod.progress}%</span>
        </div>
      )}
    </Card>
  );
}
