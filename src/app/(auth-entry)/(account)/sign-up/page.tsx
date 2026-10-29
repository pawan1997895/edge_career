import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthEntryPanel } from "@/features/auth/components/entry/auth-entry-panel";
import { animatedLinkClass } from "@/components/ai-theme/presets";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthEntryPanel
      title="Create your account"
      description="Free to start. No card needed."
      footer={
        <>
          Already have an account?{" "}
          <Link href={routes.signIn} className={animatedLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-up" />
    </AuthEntryPanel>
  );
}
