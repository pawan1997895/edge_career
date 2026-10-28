// Data access for plans, the current subscription and invoices. Replace the mock returns with API calls later.

import { comparisonRows, invoices, paymentMethods, plans, subscription, usageHistory } from "@/mocks/billing";
import type { ComparisonRow, Invoice, PaymentMethod, Plan, Subscription, UsageMonth } from "@/types/billing";
import type { PlanId } from "@/types/user";

export async function getPlans(): Promise<Plan[]> {
  return plans;
}

export async function getPlan(planId: string): Promise<Plan | undefined> {
  return plans.find((p) => p.id === planId);
}

export async function getPlanComparison(): Promise<ComparisonRow[]> {
  return comparisonRows;
}

export async function getSubscription(): Promise<Subscription> {
  return subscription;
}

export async function getUsageHistory(): Promise<UsageMonth[]> {
  return usageHistory;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return paymentMethods;
}

export async function getInvoices(): Promise<Invoice[]> {
  return invoices;
}

export function isPlanId(value: string | undefined): value is PlanId {
  return value === "free" || value === "pro" || value === "pro_plus";
}
