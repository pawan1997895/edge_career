"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Mail } from "lucide-react";
import { GitHubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";

type Mode = "sign-in" | "sign-up";
type Pending = "email" | "google" | "github" | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Email one-time code, Google and GitHub. All three are simulated:
 * email goes to /verify, the social buttons go straight to the next step.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<Pending>(null);

  const nextAfterSocial = mode === "sign-up" ? routes.onboarding : routes.dashboard;

  function continueWith(provider: "google" | "github") {
    setPending(provider);
    setTimeout(() => router.push(nextAfterSocial), 900);
  }

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address, like name@company.com.");
      return;
    }
    setError(null);
    setPending("email");
    const params = new URLSearchParams({ email: email.trim(), intent: mode });
    setTimeout(() => router.push(`${routes.verify}?${params.toString()}`), 800);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-2">
        <Button variant="outline" onClick={() => continueWith("google")} disabled={pending !== null}>
          {pending === "google" ? <LoaderCircle className="animate-spin" /> : <GoogleIcon className="size-4" />}
          Continue with Google
        </Button>
        <Button variant="outline" onClick={() => continueWith("github")} disabled={pending !== null}>
          {pending === "github" ? <LoaderCircle className="animate-spin" /> : <GitHubIcon className="size-4" />}
          Continue with GitHub
        </Button>
        <p className="text-xs text-muted-foreground">
          Module 5 projects run tests on your GitHub repositories, so you’ll need GitHub connected by then.
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or use a one-time code <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={sendCode} noValidate className="space-y-4">
        {mode === "sign-up" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoComplete="name" placeholder="Aarav Mehta" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Work or personal email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "email-error" : undefined}
          />
          {error && (
            <p id="email-error" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={pending !== null}>
          {pending === "email" ? <LoaderCircle className="animate-spin" /> : <Mail />}
          {pending === "email" ? "Sending code…" : "Send me a code"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to the Terms of Service and Privacy Policy. We never post anything to your accounts.
      </p>
    </div>
  );
}
