import type { Metadata } from "next";
import { getTargetCompanyOptions } from "@/data/account";
import { V5Onboarding } from "@/features/ui-samples/variant-5/onboarding/v5-onboarding";

export const metadata: Metadata = { title: "Set up your path" };

export default async function VariantFiveOnboardingPage() {
  const companyOptions = await getTargetCompanyOptions();
  return <V5Onboarding companyOptions={companyOptions} />;
}
