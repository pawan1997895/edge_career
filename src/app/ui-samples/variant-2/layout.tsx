import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { CommandShell } from "@/features/ui-samples/variant-2/command-shell";

// Angular display face used only by this sample.
const display = Chakra_Petch({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-v2-display" });

export const metadata: Metadata = {
  title: { default: "Design option 2", template: "%s · Design option 2 · Edge Career" },
  robots: { index: false, follow: false },
};

// Design Option 2 (client demo). Sign-up and onboarding share this frame, so sound carries on between them.
export default function VariantTwoLayout({ children }: { children: React.ReactNode }) {
  return <CommandShell fontClassName={display.variable}>{children}</CommandShell>;
}
