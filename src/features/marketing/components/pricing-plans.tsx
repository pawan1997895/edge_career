"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCard } from "@/features/billing/components/plan-card";
import { routes } from "@/lib/routes";
import type { BillingCycle, Currency, Plan } from "@/types/billing";

/** Plan cards with monthly/yearly and INR/USD switches. */
export function PricingPlans({ plans }: { plans: Plan[] }) {
  const [cycle, setCycle] = React.useState<BillingCycle>("monthly");
  const [currency, setCurrency] = React.useState<Currency>("inr");

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Tabs value={cycle} onValueChange={(v) => setCycle(v as BillingCycle)}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly · 2 months free</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
          <TabsList>
            <TabsTrigger value="inr">India (₹)</TabsTrigger>
            <TabsTrigger value="usd">International ($)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} currency={currency} ctaHref={routes.signUp} />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {currency === "inr"
          ? "Prices exclude 18% GST. Payments in India are processed by Razorpay (UPI, cards, netbanking)."
          : "International payments are processed by Stripe. Local taxes are calculated at checkout."}
      </p>
    </div>
  );
}
