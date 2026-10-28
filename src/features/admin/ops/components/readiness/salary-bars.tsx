import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SalaryBandBar } from "@/types/admin-ops";
import { SALARY_LABELS } from "@/types/user";

export function SalaryBars({ bars }: { bars: SalaryBandBar[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary-level bars</CardTitle>
        <CardDescription>Readiness score needed for each target salary band.</CardDescription>
      </CardHeader>
      <ul className="space-y-4 px-5 py-5">
        {bars.map((b) => (
          <li key={b.band}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{SALARY_LABELS[b.band]}</span>
              <span className="tabular-nums">{b.bar}</span>
            </div>
            <Progress value={b.bar} className="mt-1.5" aria-label={`${SALARY_LABELS[b.band]} bar`} />
            <p className="mt-1 text-xs text-muted-foreground">{b.setBy}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
