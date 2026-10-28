import { CircleCheck, CircleX, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import type { ProjectRun } from "@/types/projects";

export function RunHistoryCard({ runs }: { runs: ProjectRun[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run history</CardTitle>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" /> No runs yet.
          </p>
        ) : (
          <ol className="space-y-3">
            {runs.map((run) => (
              <li key={run.id} className="flex items-start gap-2.5">
                {run.result === "passed" ? (
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <div className="min-w-0 text-sm">
                  <p>
                    <span className="tabular-nums">
                      {run.testsPassed}/{run.testsTotal}
                    </span>{" "}
                    tests · <code className="text-xs">{run.commit}</code> on {run.branch}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(run.at)} · {Math.round(run.durationSec / 60)} min
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
