import type { Metadata } from "next";
import { getTargetCompanyOptions } from "@/data/account";
import { V3Onboarding } from "@/features/ui-samples/variant-3/onboarding/v3-onboarding";

export const metadata: Metadata = { title: "Set up your path" };

export default async function VariantThreeOnboardingPage() {
  const companyOptions = await getTargetCompanyOptions();
  return <V3Onboarding companyOptions={companyOptions} />;
}
