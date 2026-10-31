import type { Metadata } from "next";
import { getCoreModules, getElectives } from "@/data/curriculum";
import { V2Signup } from "@/features/ui-samples/variant-2/signup/v2-signup";

export const metadata: Metadata = { title: "Create account" };

export default async function VariantTwoSignupPage() {
  const [core, electives] = await Promise.all([getCoreModules(), getElectives()]);
  return <V2Signup stats={{ coreModules: core.length, electives: electives.length }} />;
}
