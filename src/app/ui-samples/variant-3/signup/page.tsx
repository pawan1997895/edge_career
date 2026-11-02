import type { Metadata } from "next";
import { V3Signup } from "@/features/ui-samples/variant-3/signup/v3-signup";

export const metadata: Metadata = { title: "Create account" };

export default function VariantThreeSignupPage() {
  return <V3Signup />;
}
