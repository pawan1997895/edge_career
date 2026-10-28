import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/features/billing/components/plan-card";
import { MarketingSection } from "@/features/marketing/components/section";
import { routes } from "@/lib/routes";
import type { Plan } from "@/types/billing";

export function PricingTeaser({ plans }: { plans: Plan[] }) {
  return (
    <MarketingSection
      eyebrow="Pricing"
      title="Start free, upgrade when you’re ready"
      description="Plans differ mainly in mock interview minutes. Prices in INR; international pricing on the pricing page."
      className="bg-card/50"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle="monthly" currency="inr" ctaHref={routes.signUp} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="link" asChild>
          <Link href={routes.pricing}>
            Compare every feature <ArrowRight />
          </Link>
        </Button>
      </div>
    </MarketingSection>
  );
}
