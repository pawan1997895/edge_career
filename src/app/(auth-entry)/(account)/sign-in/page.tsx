import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthEntryPanel } from "@/features/auth/components/entry/auth-entry-panel";
import { animatedLinkClass } from "@/components/ai-theme/presets";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthEntryPanel
      title="Sign in to Edge Career"
      description="Pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link href={routes.signUp} className={animatedLinkClass}>
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthEntryPanel>
  );
}
