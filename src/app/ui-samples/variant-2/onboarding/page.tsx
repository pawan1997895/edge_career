import type { Metadata } from "next";
import { getTargetCompanyOptions } from "@/data/account";
import { getCoreModules } from "@/data/curriculum";
import { V2Onboarding } from "@/features/ui-samples/variant-2/onboarding/v2-onboarding";

export const metadata: Metadata = { title: "Set up your path" };

export default async function VariantTwoOnboardingPage() {
  const [companyOptions, core] = await Promise.all([getTargetCompanyOptions(), getCoreModules()]);
  return <V2Onboarding companyOptions={companyOptions} modules={core.map((m) => m.title)} />;
}
