import { CircleCheck, Hourglass, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { GatingStatus, ModuleAccuracy } from "@/types/admin-content";

function GatingBadge({ status }: { status: GatingStatus }) {
  if (status === "ai_enabled")
    return (
      <Badge variant="success">
        <CircleCheck /> AI may lock/unlock
      </Badge>
    );
  if (status === "human_required")
    return (
      <Badge variant="warning">
        <UserCheck /> Human review required
      </Badge>
    );
  return (
    <Badge variant="muted">
      <Hourglass /> Collecting calibration set
    </Badge>
  );
}

/** Agreement between AI and human grades per module, and whether AI scores may gate progress. */
export function AccuracyTable({ modules, target, minSet }: { modules: ModuleAccuracy[]; target: number; minSet: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agreement by module</CardTitle>
        <CardDescription>
          A module&apos;s AI scores can lock or unlock progress only when at least {target}% of them land within ±5 points of a human grade, measured
          on a calibration set of {minSet}+ human-graded submissions.
        </CardDescription>
      </CardHeader>
      <div className="mt-4 border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead className="text-right">Calibration set</TableHead>
              <TableHead>Within ±5 points (target {target}%)</TableHead>
              <TableHead className="text-right">Mean abs. error</TableHead>
              <TableHead>Gating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((m) => {
              const measured = m.gating !== "collecting";
              const meets = m.withinFivePct >= target;
              return (
                <TableRow key={m.moduleId}>
                  <TableCell className="min-w-52 font-medium">{m.moduleTitle}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.calibrationSize}
                    {!measured && <span className="text-muted-foreground"> / {minSet}</span>}
                  </TableCell>
                  <TableCell className="min-w-56">
                    {measured ? (
                      <div className="flex items-center gap-3">
                        <div className="relative h-1.5 flex-1 rounded-full bg-muted">
                          <span
                            className={cn("absolute inset-y-0 left-0 rounded-full", meets ? "bg-success" : "bg-warning")}
                            style={{ width: `${m.withinFivePct}%` }}
                          />
                          <span className="absolute -top-1 h-3.5 w-0.5 bg-foreground/60" style={{ left: `${target}%` }} aria-hidden />
                        </div>
                        <span className={cn("w-12 text-right text-[13px] font-medium tabular-nums", !meets && "text-warning-foreground dark:text-warning")}>
                          {m.withinFivePct.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not enough human grades yet</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{measured ? m.meanAbsError.toFixed(1) : "—"}</TableCell>
                  <TableCell>
                    <GatingBadge status={m.gating} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
