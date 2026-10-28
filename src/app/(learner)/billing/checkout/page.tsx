import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getPlan, isPlanId } from "@/data/billing";
import { CheckoutFlow } from "@/features/billing/components/checkout-flow";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan: requested } = await searchParams;
  // Free needs no checkout; anything unknown falls back to Pro Plus.
  const planId = isPlanId(requested) && requested !== "free" ? requested : "pro_plus";
  const plan = (await getPlan(planId))!;

  return (
    <PageContainer>
      <PageHeader
        title={`Upgrade to ${plan.name}`}
        description={plan.tagline}
        breadcrumbs={[{ label: "Billing", href: routes.billing }, { label: "Checkout" }]}
      />
      <CheckoutFlow key={plan.id} plan={plan} />
    </PageContainer>
  );
}
