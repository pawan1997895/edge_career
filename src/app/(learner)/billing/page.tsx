import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getInvoices, getPaymentMethods, getPlans, getSubscription, getUsageHistory } from "@/data/billing";
import { BillingDetailsCard } from "@/features/billing/components/billing-details-card";
import { CurrentPlanCard } from "@/features/billing/components/current-plan-card";
import { InvoicesTable } from "@/features/billing/components/invoices-table";
import { MinutesUsageCard } from "@/features/billing/components/minutes-usage-card";
import { PaymentMethodsCard } from "@/features/billing/components/payment-methods-card";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const [subscription, plans, history, methods, invoices] = await Promise.all([
    getSubscription(),
    getPlans(),
    getUsageHistory(),
    getPaymentMethods(),
    getInvoices(),
  ]);
  return (
    <PageContainer>
      <PageHeader
        title="Billing"
        description="Your plan, interview minutes, payment methods and invoices."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.pricing}>Compare plans</Link>
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <CurrentPlanCard subscription={subscription} plans={plans} />
          <MinutesUsageCard subscription={subscription} history={history} />
        </div>
        <div className="space-y-6">
          <PaymentMethodsCard methods={methods} />
          <BillingDetailsCard />
        </div>
      </div>
      <div className="mt-6">
        <InvoicesTable invoices={invoices} />
      </div>
    </PageContainer>
  );
}
