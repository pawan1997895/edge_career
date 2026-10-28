"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { cycleSuffix, formatPrice, planPrice } from "@/features/billing/pricing";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Plan, Subscription } from "@/types/billing";
import type { PlanId } from "@/types/user";

export function CurrentPlanCard({ subscription, plans }: { subscription: Subscription; plans: Plan[] }) {
  const [cancelling, setCancelling] = React.useState(subscription.status === "cancelling");
  const plan = plans.find((p) => p.id === subscription.plan)!;
  const price = planPrice(plan, subscription.cycle, "inr");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {cancelling ? <Badge variant="warning">Cancels {formatDate(subscription.renewsAt)}</Badge> : <Badge variant="success">Active</Badge>}
        </div>
        <CardDescription>
          {formatPrice(price, "inr")}
          {cycleSuffix(subscription.cycle)} + GST · billed {subscription.cycle} via Razorpay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="mt-0.5 font-medium">{formatDate(subscription.startedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{cancelling ? "Access until" : "Next payment"}</dt>
            <dd className="mt-0.5 font-medium">{formatDate(subscription.renewsAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Interview cap</dt>
            <dd className="mt-0.5 font-medium">{plan.interviewMinutes} min / month</dd>
          </div>
        </dl>
        {cancelling && (
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>Your subscription is set to cancel</AlertTitle>
            <AlertDescription>
              You keep Pro until {formatDate(subscription.renewsAt)}, then move to Free. Your progress is kept.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-wrap justify-end">
        {cancelling ? (
          <Button variant="outline" onClick={() => setCancelling(false)}>
            <CalendarClock /> Keep my subscription
          </Button>
        ) : (
          <CancelSubscriptionDialog onConfirm={() => setCancelling(true)} renewsAt={subscription.renewsAt} />
        )}
        <ChangePlanDialog plans={plans} current={subscription.plan} />
      </CardFooter>
    </Card>
  );
}

function ChangePlanDialog({ plans, current }: { plans: Plan[]; current: PlanId }) {
  const [choice, setChoice] = React.useState<PlanId>(current === "pro" ? "pro_plus" : "pro");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change plan</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
          <DialogDescription>Upgrades start now and you pay the difference for this cycle. Downgrades apply at renewal.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={choice} onValueChange={(v) => setChoice(v as PlanId)}>
          {plans.map((p) => (
            <RadioCard
              key={p.id}
              value={p.id}
              title={
                <span className="flex items-center gap-2">
                  {p.name} {p.id === current && <Badge variant="secondary">Current</Badge>}
                </span>
              }
              description={`${p.priceInr.monthly === 0 ? "Free" : `${formatPrice(p.priceInr.monthly, "inr")}/month`} · ${p.interviewMinutesNote}`}
            />
          ))}
        </RadioGroup>
        <DialogFooter>
          {choice === current ? (
            <Button disabled>This is your current plan</Button>
          ) : (
            <Button asChild>
              <Link href={choice === "free" ? routes.billing : routes.checkout(choice)}>
                {choice === "free" ? "Downgrade at renewal" : "Continue to checkout"}
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const CANCEL_REASONS = [
  "I got the job I was preparing for",
  "It’s too expensive",
  "I’m not using it enough",
  "Missing a feature I need",
  "Something else",
];

function CancelSubscriptionDialog({ onConfirm, renewsAt }: { onConfirm: () => void; renewsAt: string }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState<string>("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Cancel subscription</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel your Pro subscription?</DialogTitle>
          <DialogDescription>
            You’ll keep access until {formatDate(renewsAt)}. After that you lose modules 2–6, system design, readiness estimates and
            monthly interview minutes. Your progress and history stay saved.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Why are you cancelling? (optional)</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a reason" />
            </SelectTrigger>
            <SelectContent>
              {CANCEL_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep Pro
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false);
              onConfirm();
              toast({ title: "Subscription will cancel at the end of this cycle" });
            }}
          >
            Cancel subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
