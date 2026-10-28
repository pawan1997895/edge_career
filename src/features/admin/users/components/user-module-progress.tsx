import { GraduationCap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { ModuleStatusBadge } from "@/components/shared/status-badges";
import type { AdminUserModule } from "@/types/admin-ops";

export function UserModuleProgress({ modules }: { modules: AdminUserModule[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core track progress</CardTitle>
        <CardDescription>Modules unlock in order; each needs every required item passed and a checkpoint score of 85% or more.</CardDescription>
      </CardHeader>
      {modules.length === 0 ? (
        <div className="p-5">
          <EmptyState icon={GraduationCap} title="Not enrolled in a track" description="Staff accounts don't take the curriculum." />
        </div>
      ) : (
        <ul className="divide-y">
          {modules.map((m) => (
            <li key={m.moduleId} className="grid gap-2 px-5 py-3 sm:grid-cols-[minmax(0,1fr)_8rem_10rem] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  <span className="text-muted-foreground">M{m.number}</span> · {m.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Checkpoint:{" "}
                  {m.checkpointAttempts === 0
                    ? "not attempted"
                    : `best ${m.checkpointBest ?? "—"}% · ${m.checkpointAttempts} attempt${m.checkpointAttempts > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={m.progress} tone={m.progress === 100 ? "success" : "primary"} aria-label={`${m.title} progress`} />
                <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{m.progress}%</span>
              </div>
              <div className="sm:justify-self-end">
                <ModuleStatusBadge status={m.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
