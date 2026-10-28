// Plans, subscriptions, invoices and checkout.

import type { PlanId } from "@/types/user";

export type BillingCycle = "monthly" | "yearly";
export type Currency = "inr" | "usd";
/** India pays through Razorpay; everyone else through Stripe. */
export type BillingRegion = "india" | "international";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceInr: Record<BillingCycle, number>;
  priceUsd: Record<BillingCycle, number>;
  /** Interview minutes per billing month. For Free this is a one-time trial. */
  interviewMinutes: number;
  interviewMinutesNote: string;
  features: string[];
  highlighted?: boolean;
}

export type ComparisonValue = boolean | string;

export interface ComparisonRow {
  group: string;
  label: string;
  values: Record<PlanId, ComparisonValue>;
}

export interface Subscription {
  plan: PlanId;
  cycle: BillingCycle;
  status: "active" | "cancelling" | "past_due";
  startedAt: string;
  renewsAt: string;
  minutesUsed: number;
  minutesCap: number;
}

export interface UsageMonth {
  month: string;
  minutesUsed: number;
  cap: number;
}

export interface PaymentMethod {
  id: string;
  kind: "upi" | "card";
  label: string;
  detail: string;
  provider: "Razorpay" | "Stripe";
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  /** Total charged including GST, in rupees. */
  amountInr: number;
  status: "paid" | "failed" | "refunded";
  method: string;
}

/** GST added to Indian payments. */
export const GST_RATE = 0.18;
