import type { Metadata } from "next";
import { getTargetCompanyOptions } from "@/data/account";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export const metadata: Metadata = { title: "Set up your learning path" };

export default async function OnboardingPage() {
  const companyOptions = await getTargetCompanyOptions();
  return <OnboardingWizard companyOptions={companyOptions} />;
}
