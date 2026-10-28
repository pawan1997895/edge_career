import Link from "next/link";
import { Check, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BillingCycle, Currency, Plan } from "@/types/billing";
import { cycleSuffix, formatPrice, planPrice, yearlySavings } from "@/features/billing/pricing";

export function PlanCard({
  plan,
  cycle,
  currency,
  ctaHref,
  ctaLabel,
  current = false,
  compact = false,
}: {
  plan: Plan;
  cycle: BillingCycle;
  currency: Currency;
  ctaHref: string;
  ctaLabel?: string;
  current?: boolean;
  compact?: boolean;
}) {
  const price = planPrice(plan, cycle, currency);
  const savings = cycle === "yearly" ? yearlySavings(plan, currency) : 0;

  return (
    <Card className={cn("relative p-5", plan.highlighted && "border-primary ring-1 ring-primary")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{plan.name}</h3>
        {current ? (
          <Badge variant="secondary">Current plan</Badge>
        ) : (
          plan.highlighted && <Badge variant="solid">Most popular</Badge>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{formatPrice(price, currency)}</span>
        {price > 0 && <span className="text-sm text-muted-foreground">{cycleSuffix(cycle)}</span>}
      </div>
      <p className="mt-1 h-4 text-xs text-muted-foreground">
        {price === 0
          ? "Free forever"
          : savings > 0
            ? `Save ${formatPrice(savings, currency)} vs monthly`
            : currency === "inr"
              ? "+ 18% GST"
              : "Taxes calculated at checkout"}
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-[13px]">
        <Mic className="size-4 shrink-0 text-primary" />
        <span>{plan.interviewMinutesNote}</span>
      </div>

      {!compact && (
        <ul className="mt-4 space-y-2 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {current ? (
        <Button className="mt-5 w-full" variant="outline" disabled>
          Your current plan
        </Button>
      ) : (
        <Button asChild className="mt-5 w-full" variant={plan.highlighted ? "default" : "outline"}>
          <Link href={ctaHref}>{ctaLabel ?? (price === 0 ? "Start free" : `Get ${plan.name}`)}</Link>
        </Button>
      )}
    </Card>
  );
}
