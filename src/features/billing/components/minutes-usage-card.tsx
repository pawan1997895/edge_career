import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UsageChart } from "@/features/billing/components/usage-chart";
import { formatDate } from "@/lib/format";
import type { Subscription, UsageMonth } from "@/types/billing";

export function MinutesUsageCard({ subscription, history }: { subscription: Subscription; history: UsageMonth[] }) {
  const left = subscription.minutesCap - subscription.minutesUsed;
  const usedPct = (subscription.minutesUsed / subscription.minutesCap) * 100;
  const cappedMonths = history.filter((m) => m.minutesUsed >= m.cap).map((m) => m.month);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview minutes</CardTitle>
        <CardDescription>This billing cycle · resets {formatDate(subscription.renewsAt)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-2xl font-semibold tabular-nums">
              {left} <span className="text-sm font-normal text-muted-foreground">min left</span>
            </p>
            <p className="text-sm text-muted-foreground tabular-nums">
              {subscription.minutesUsed} of {subscription.minutesCap} used
            </p>
          </div>
          <Progress value={usedPct} tone={usedPct >= 90 ? "warning" : "primary"} className="mt-2 h-2" />
        </div>

        <UsageChart data={history} cap={subscription.minutesCap} />

        <div className="flex gap-2.5 rounded-md bg-muted/60 p-3 text-[13px] text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Each plan includes a monthly cap because voice interviews run speech recognition, the AI interviewer and speech
            synthesis live. Every connected minute counts and unused minutes don’t roll over.
            {cappedMonths.length > 0 && ` You reached the cap in ${cappedMonths.join(", ")}; Pro Plus includes 400 minutes.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
