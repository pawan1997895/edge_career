import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/auth-form";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in to Edge Career"
      description="Pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link href={routes.signUp} className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthCard>
  );
}
