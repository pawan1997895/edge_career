import { formatINR, formatUSD } from "@/lib/format";
import { GST_RATE, type BillingCycle, type Currency, type Plan } from "@/types/billing";

export function planPrice(plan: Plan, cycle: BillingCycle, currency: Currency) {
  return currency === "inr" ? plan.priceInr[cycle] : plan.priceUsd[cycle];
}

export function formatPrice(amount: number, currency: Currency) {
  return currency === "inr" ? formatINR(amount) : formatUSD(amount, 0);
}

/** "/month" or "/year". */
export function cycleSuffix(cycle: BillingCycle) {
  return cycle === "monthly" ? "/month" : "/year";
}

/** How much a yearly plan saves over paying monthly for 12 months. */
export function yearlySavings(plan: Plan, currency: Currency) {
  const prices = currency === "inr" ? plan.priceInr : plan.priceUsd;
  return prices.monthly * 12 - prices.yearly;
}

/** Subtotal, GST and total for an Indian (Razorpay) payment. */
export function inrTotals(subtotal: number) {
  const gst = Math.round(subtotal * GST_RATE);
  return { subtotal, gst, total: subtotal + gst };
}
