import Link from "next/link";
import { Mic } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { InterviewQuota } from "@/types/interviews";
import { PLAN_LABELS } from "@/types/user";

/** Interview minutes left this billing cycle, with the cap for each plan. */
export function MinutesCard({ quota, className }: { quota: InterviewQuota; className?: string }) {
  const percentLeft = (quota.minutesLeft / quota.minutesTotal) * 100;
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Interview minutes</CardTitle>
        <CardDescription>{PLAN_LABELS[quota.plan]} plan · resets {formatDate(quota.resetsAt)}</CardDescription>
        <CardAction>
          <Mic className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {quota.minutesLeft}
            <span className="text-sm font-normal text-muted-foreground"> of {quota.minutesTotal} min left</span>
          </p>
          <Progress className="mt-2" value={percentLeft} tone={percentLeft < 20 ? "warning" : "primary"} aria-label="Interview minutes left" />
          <p className="mt-1.5 text-xs text-muted-foreground">{quota.minutesUsed} min used this cycle</p>
        </div>
        <ul className="space-y-1.5 border-t pt-3 text-[13px]">
          {quota.planCaps.map((cap) => (
            <li key={cap.plan} className={cn("flex justify-between", cap.plan === quota.plan ? "font-medium" : "text-muted-foreground")}>
              <span>{PLAN_LABELS[cap.plan]}</span>
              <span className="tabular-nums">
                {cap.minutes} min {cap.period}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">Minutes are charged only for live interview time.</p>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={routes.pricing}>Get more minutes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
