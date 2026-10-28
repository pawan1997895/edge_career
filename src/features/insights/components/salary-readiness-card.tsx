import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadinessBar } from "@/features/insights/components/readiness-bar";
import { READINESS_STATUS_LABEL, readinessStatus } from "@/features/insights/lib";
import type { SalaryReadiness } from "@/types/insights";
import { SALARY_LABELS } from "@/types/user";

export function SalaryReadinessCard({ bands }: { bands: SalaryReadiness[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>By salary band</CardTitle>
        <CardDescription>Bars reflect the skills typically expected at each band in India.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {bands.map((b) => {
          const status = READINESS_STATUS_LABEL[readinessStatus(b.score, b.target)];
          return (
            <div key={b.band}>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{SALARY_LABELS[b.band]}</span>
                {b.isTarget && <Badge>Your target</Badge>}
                <span className="ml-auto flex items-center gap-2">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="w-16 text-right tabular-nums">
                    {b.score}
                    <span className="text-muted-foreground"> / {b.target}</span>
                  </span>
                </span>
              </div>
              <ReadinessBar score={b.score} target={b.target} label={`${SALARY_LABELS[b.band]} readiness`} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
