import type { Metadata } from "next";
import { CreditCard, Globe, Mic } from "lucide-react";
import { getPlanComparison, getPlans } from "@/data/billing";
import { pricingFaqs } from "@/features/marketing/content";
import { FaqList } from "@/features/marketing/components/faq-list";
import { PlanComparisonTable } from "@/features/marketing/components/plan-comparison-table";
import { PricingPlans } from "@/features/marketing/components/pricing-plans";
import { MarketingSection } from "@/features/marketing/components/section";

export const metadata: Metadata = { title: "Pricing" };

export default async function PricingPage() {
  const [plans, rows] = await Promise.all([getPlans(), getPlanComparison()]);
  return (
    <>
      <section className="border-b py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple plans for every stage of preparation</h1>
            <p className="mt-3 text-muted-foreground">
              Every plan includes the placement test and the code judge. Paid plans unlock the full curriculum, system design and
              more mock interview minutes.
            </p>
          </div>
          <div className="mt-10">
            <PricingPlans plans={plans} />
          </div>
        </div>
      </section>

      <MarketingSection title="Compare plans" description="What’s included in each plan.">
        <PlanComparisonTable plans={plans} rows={rows} />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard icon={Mic} title="Why minutes are capped">
            Voice interviews run speech recognition, the AI interviewer and speech synthesis live, so each plan includes a monthly
            allowance. Text interviews use the same allowance.
          </InfoCard>
          <InfoCard icon={CreditCard} title="Paying from India">
            Razorpay handles UPI, debit and credit cards and netbanking. Prices exclude 18% GST and every payment gets a GST invoice.
          </InfoCard>
          <InfoCard icon={Globe} title="Paying from elsewhere">
            Stripe processes international cards in USD. Taxes are calculated at checkout based on your country.
          </InfoCard>
        </div>
      </MarketingSection>

      <MarketingSection title="Billing questions" className="pt-0 sm:pt-0">
        <div className="mx-auto max-w-3xl">
          <FaqList items={pricingFaqs} />
        </div>
      </MarketingSection>
    </>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof Mic; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
