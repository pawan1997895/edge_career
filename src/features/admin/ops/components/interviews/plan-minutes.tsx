import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/format";
import type { PlanMinutesUsage } from "@/types/admin-ops";
import { PLAN_LABELS } from "@/types/user";

/** Interview minutes are capped per plan to control voice cost. */
export function PlanMinutes({ plans }: { plans: PlanMinutesUsage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minutes used vs plan caps</CardTitle>
        <CardDescription>Current billing cycle. Learners who hit the cap see an upgrade prompt.</CardDescription>
      </CardHeader>
      <ul className="divide-y">
        {plans.map((p) => {
          const usedPct = (p.avgUsedMinutes / p.capMinutes) * 100;
          return (
            <li key={p.plan} className="px-5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium">{PLAN_LABELS[p.plan]}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(p.learners)} learners</p>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={usedPct} tone={usedPct > 70 ? "warning" : "primary"} aria-label={`${PLAN_LABELS[p.plan]} average minutes used`} />
                <span className="shrink-0 text-sm tabular-nums">
                  {p.avgUsedMinutes} / {p.capMinutes} min
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Average used per learner · <span className={p.atCapRate > 20 ? "font-medium text-foreground" : ""}>{p.atCapRate}% hit the cap</span>
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
