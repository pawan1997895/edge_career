"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheck, CircleX, Landmark, LoaderCircle, Lock, RotateCcw, Smartphone, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cycleSuffix, formatPrice, inrTotals, planPrice, yearlySavings } from "@/features/billing/pricing";
import { routes } from "@/lib/routes";
import type { BillingCycle, BillingRegion, Plan } from "@/types/billing";

type Method = "upi" | "card" | "netbanking";
type Status = "form" | "processing" | "success" | "failed";

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank"];

/** Plan checkout. Razorpay for India, Stripe for international. Payment is simulated. */
export function CheckoutFlow({ plan }: { plan: Plan }) {
  const [cycle, setCycle] = React.useState<BillingCycle>("monthly");
  const [region, setRegion] = React.useState<BillingRegion>("india");
  const [method, setMethod] = React.useState<Method>("upi");
  const [simulateFailure, setSimulateFailure] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("form");

  const currency = region === "india" ? "inr" : "usd";
  const price = planPrice(plan, cycle, currency);
  const totals = region === "india" ? inrTotals(price) : { subtotal: price, gst: 0, total: price };
  const activeMethod: Method = region === "india" ? method : "card";
  const provider = region === "india" ? "Razorpay" : "Stripe";

  function pay() {
    setStatus("processing");
    setTimeout(() => setStatus(simulateFailure ? "failed" : "success"), 1600);
  }

  if (status === "success") {
    return (
      <ResultCard
        tone="success"
        title={`You’re on ${plan.name}`}
        description={`Payment of ${formatPrice(totals.total, currency)} received via ${provider}. A receipt is on its way to your email.`}
        actions={
          <>
            <Button asChild>
              <Link href={routes.dashboard}>Go to dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={routes.billing}>View billing</Link>
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Your interview allowance is now {plan.interviewMinutes} minutes a month, starting today.
        </p>
      </ResultCard>
    );
  }

  if (status === "failed") {
    return (
      <ResultCard
        tone="error"
        title="Payment didn’t go through"
        description={`Your bank declined the payment. No money was taken. Try again or use a different ${region === "india" ? "method" : "card"}.`}
        actions={
          <>
            <Button onClick={pay}>
              <RotateCcw /> Try again
            </Button>
            <Button variant="outline" onClick={() => setStatus("form")}>
              Change payment method
            </Button>
          </>
        }
      />
    );
  }

  const processing = status === "processing";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={cycle} onValueChange={(v) => setCycle(v as BillingCycle)} className="sm:grid-cols-2">
              <RadioCard value="monthly" title="Monthly" description={`${formatPrice(planPrice(plan, "monthly", currency), currency)} a month`} />
              <RadioCard
                value="yearly"
                title={
                  <span className="flex items-center gap-2">
                    Yearly <Badge variant="success">Save {formatPrice(yearlySavings(plan, currency), currency)}</Badge>
                  </span>
                }
                description={`${formatPrice(planPrice(plan, "yearly", currency), currency)} a year`}
              />
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>
              {region === "india" ? "Processed by Razorpay in INR." : "Processed by Stripe in USD."} Your details go straight to{" "}
              {provider}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs value={region} onValueChange={(v) => setRegion(v as BillingRegion)}>
              <TabsList>
                <TabsTrigger value="india">Paying from India</TabsTrigger>
                <TabsTrigger value="international">International</TabsTrigger>
              </TabsList>
            </Tabs>

            {region === "india" && (
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as Method)} className="sm:grid-cols-3">
                <RadioCard value="upi" icon={<Smartphone />} title="UPI" />
                <RadioCard value="card" icon={<CreditCard />} title="Card" />
                <RadioCard value="netbanking" icon={<Landmark />} title="Netbanking" />
              </RadioGroup>
            )}

            {activeMethod === "upi" && (
              <div className="space-y-1.5">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input id="upi-id" defaultValue="aarav@okhdfcbank" />
                <p className="text-xs text-muted-foreground">You’ll approve the payment in your UPI app.</p>
              </div>
            )}
            {activeMethod === "card" && (
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <div className="space-y-1.5">
                  <Label htmlFor="card-number">Card number</Label>
                  <Input id="card-number" inputMode="numeric" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Input id="card-expiry" placeholder="MM / YY" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input id="card-cvc" inputMode="numeric" placeholder="123" />
                </div>
              </div>
            )}
            {activeMethod === "netbanking" && (
              <div className="space-y-1.5">
                <Label>Bank</Label>
                <Select defaultValue={BANKS[0]}>
                  <SelectTrigger className="w-full sm:w-72">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BANKS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <label className="flex items-center justify-between gap-4 rounded-lg border border-dashed px-4 py-3 text-sm">
          <span>
            <span className="font-medium">Simulate payment failure</span>
            <span className="block text-[13px] text-muted-foreground">Preview only: shows the declined-payment state.</span>
          </span>
          <Switch checked={simulateFailure} onCheckedChange={setSimulateFailure} />
        </label>
      </div>

      <Card className="lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span>
              {plan.name} · {cycle}
            </span>
            <span className="tabular-nums">
              {formatPrice(totals.subtotal, currency)}
              <span className="text-muted-foreground">{cycleSuffix(cycle)}</span>
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground">{plan.interviewMinutesNote}</p>
          <Separator />
          {region === "india" ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="tabular-nums">{formatPrice(totals.gst, currency)}</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxes</span>
              <span className="text-muted-foreground">Calculated by Stripe</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold">
            <span>Total today</span>
            <span className="tabular-nums">{formatPrice(totals.total, currency)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 border-t-0 pt-0 pb-5">
          <Button size="lg" onClick={pay} disabled={processing}>
            {processing ? <LoaderCircle className="animate-spin" /> : <Lock />}
            {processing ? `Waiting for ${provider}…` : `Pay ${formatPrice(totals.total, currency)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Renews automatically. Cancel any time from Billing. 7-day refund on your first payment.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function ResultCard({
  tone,
  title,
  description,
  actions,
  children,
}: {
  tone: "success" | "error";
  title: string;
  description: string;
  actions: React.ReactNode;
  children?: React.ReactNode;
}) {
  const Icon = tone === "success" ? CircleCheck : CircleX;
  return (
    <Card className="mx-auto max-w-lg items-center p-8 text-center">
      <span
        className={
          tone === "success"
            ? "flex size-12 items-center justify-center rounded-full bg-success/12 text-success"
            : "flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
        }
      >
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-3">{children}</div>}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">{actions}</div>
    </Card>
  );
}
