import type { Metadata } from "next";
import { getPlans } from "@/data/billing";
import { getCoreModules, getElectives } from "@/data/curriculum";
import { landingFaqs } from "@/features/marketing/content";
import { CurriculumOverview } from "@/features/marketing/components/curriculum-overview";
import { FaqList } from "@/features/marketing/components/faq-list";
import { FeatureGrid } from "@/features/marketing/components/feature-grid";
import { FinalCta } from "@/features/marketing/components/final-cta";
import { Hero } from "@/features/marketing/components/hero";
import { HowItWorks } from "@/features/marketing/components/how-it-works";
import { PricingTeaser } from "@/features/marketing/components/pricing-teaser";
import { MarketingSection } from "@/features/marketing/components/section";

export const metadata: Metadata = {
  title: { absolute: "Edge Career · Structured interview preparation for software engineers" },
};

export default async function LandingPage() {
  const [coreModules, electives, plans] = await Promise.all([getCoreModules(), getElectives(), getPlans()]);
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeatureGrid />
      <CurriculumOverview coreModules={coreModules} electives={electives} />
      <PricingTeaser plans={plans} />
      <MarketingSection id="faq" eyebrow="FAQ" title="Questions engineers ask us">
        <div className="mx-auto max-w-3xl">
          <FaqList items={landingFaqs} />
        </div>
      </MarketingSection>
      <FinalCta />
    </>
  );
}
