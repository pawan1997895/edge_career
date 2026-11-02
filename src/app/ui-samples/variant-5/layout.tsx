import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { NeonShell } from "@/features/ui-samples/variant-5/neon-shell";

// Techy grotesk face used only by this sample.
const neonFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-v5" });

export const metadata: Metadata = {
  title: { default: "Design option 5", template: "%s · Design option 5 · Edge Career" },
  robots: { index: false, follow: false },
};

// Design Option 5 (client demo). Sign-up and onboarding share this frame, so sound carries on between them.
export default function VariantFiveLayout({ children }: { children: React.ReactNode }) {
  return <NeonShell fontClassName={neonFont.variable}>{children}</NeonShell>;
}
