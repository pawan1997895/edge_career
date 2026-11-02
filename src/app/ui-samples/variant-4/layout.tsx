import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { StudioShell } from "@/features/ui-samples/variant-4/studio-shell";

// Friendly, rounded face used only by this sample.
const studioFont = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-v4" });

export const metadata: Metadata = {
  title: { default: "Design option 4", template: "%s · Design option 4 · Edge Career" },
  robots: { index: false, follow: false },
};

// Design Option 4 (client demo). Sign-up and onboarding share this frame, so sound carries on between them.
export default function VariantFourLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell fontClassName={studioFont.variable}>{children}</StudioShell>;
}
