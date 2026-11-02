import type { Metadata } from "next";
import { V5Signup } from "@/features/ui-samples/variant-5/signup/v5-signup";

export const metadata: Metadata = { title: "Create account" };

export default function VariantFiveSignupPage() {
  return <V5Signup />;
}
