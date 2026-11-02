import type { Metadata } from "next";
import { MinimalShell } from "@/features/ui-samples/variant-3/minimal-shell";

export const metadata: Metadata = {
  title: { default: "Design option 3", template: "%s · Design option 3 · Edge Career" },
  robots: { index: false, follow: false },
};

// Design Option 3 (client demo). Sign-up and onboarding share this frame, so sound carries on between them.
export default function VariantThreeLayout({ children }: { children: React.ReactNode }) {
  return <MinimalShell>{children}</MinimalShell>;
}
