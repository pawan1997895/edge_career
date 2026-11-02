import type { Metadata } from "next";
import { V4Signup } from "@/features/ui-samples/variant-4/signup/v4-signup";

export const metadata: Metadata = { title: "Create account" };

export default function VariantFourSignupPage() {
  return <V4Signup />;
}
