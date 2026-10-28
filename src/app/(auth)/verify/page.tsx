import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { OtpForm } from "@/features/auth/components/otp-form";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ email?: string; intent?: string }> }) {
  const { email = "aarav.mehta@example.com", intent } = await searchParams;
  return (
    <AuthCard
      title="Check your email"
      description={
        <>
          We sent a six-digit code to <span className="font-medium text-foreground">{email}</span>. It expires in 10 minutes.
        </>
      }
    >
      <OtpForm email={email} intent={intent === "sign-in" ? "sign-in" : "sign-up"} />
    </AuthCard>
  );
}
