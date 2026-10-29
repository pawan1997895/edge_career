import { AiShell } from "@/components/ai-theme/ai-shell";

// Sign-in, sign-up and onboarding: dark AI-themed frame with the animated neural-network
// background. It stays mounted while moving between these pages.
export default function AuthEntryLayout({ children }: { children: React.ReactNode }) {
  return <AiShell>{children}</AiShell>;
}
