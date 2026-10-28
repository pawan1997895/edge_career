import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { INTERVIEW_STAGES, type StageTiming } from "@/types/interviews";

function formatMin(min: number) {
  return `${min.toFixed(1)} min`;
}

/** Time spent in each stage compared with the suggested pacing. */
export function StageTimeline({ timings }: { timings: StageTiming[] }) {
  const total = timings.reduce((sum, t) => sum + t.actualMin, 0);
  const rows = INTERVIEW_STAGES.map((stage, i) => ({
    ...stage,
    color: `var(--chart-${(i % 5) + 1})`,
    actualMin: timings.find((t) => t.stage === stage.key)?.actualMin ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stage timeline</CardTitle>
        <CardDescription>{formatMin(total)} in total. Suggested pacing is based on a 45-minute round.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Time spent per stage">
          {rows
            .filter((r) => r.actualMin > 0)
            .map((r) => (
              <Tooltip key={r.key} content={`${r.label}: ${formatMin(r.actualMin)}`}>
                <span className="h-full border-r border-card last:border-r-0" style={{ width: `${(r.actualMin / total) * 100}%`, background: r.color }} />
              </Tooltip>
            ))}
        </div>
        <ul className="divide-y text-sm">
          {rows.map((r) => {
            const over = r.actualMin - r.suggestedMin;
            return (
              <li key={r.key} className="flex items-center gap-3 py-2">
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: r.color }} />
                <span className="flex-1">{r.label}</span>
                <span className="w-20 text-right tabular-nums">{r.actualMin > 0 ? formatMin(r.actualMin) : "—"}</span>
                <span className="hidden w-28 text-right text-xs text-muted-foreground tabular-nums sm:inline">
                  suggested {r.suggestedMin} min
                </span>
                <span className="w-24 text-right">
                  {r.actualMin === 0 ? (
                    <Badge variant="muted">Skipped</Badge>
                  ) : over > 3 ? (
                    <Badge variant="warning">+{over.toFixed(1)} min</Badge>
                  ) : (
                    <Badge variant="success">On pace</Badge>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
