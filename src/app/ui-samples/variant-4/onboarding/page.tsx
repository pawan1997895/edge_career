import type { Metadata } from "next";
import { getTargetCompanyOptions } from "@/data/account";
import { V4Onboarding } from "@/features/ui-samples/variant-4/onboarding/v4-onboarding";

export const metadata: Metadata = { title: "Set up your path" };

export default async function VariantFourOnboardingPage() {
  const companyOptions = await getTargetCompanyOptions();
  return <V4Onboarding companyOptions={companyOptions} />;
}
