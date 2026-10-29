"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GitHubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { GlowButton } from "@/components/ai-theme/glow-button";
import { fadeUp, staggerContainer } from "@/components/ai-theme/presets";

// Premium AI-theme look (see src/components/ai-theme). Behaviour is unchanged.
const socialButtonClass =
  "h-10 border-border/70 bg-background/40 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:border-(--ec-blue)/50 hover:bg-accent/60 hover:shadow-[0_0_24px_-10px_var(--ec-blue)] motion-safe:hover:-translate-y-px";
const inputClass =
  "h-10 border-border/70 bg-background/50 transition-[border-color,box-shadow,background-color] duration-200 hover:border-border focus-visible:border-(--ec-cyan) focus-visible:bg-background/70 focus-visible:ring-(--ec-cyan)/25";

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
    <motion.div variants={staggerContainer} className="space-y-5">
      <motion.div variants={fadeUp} className="grid gap-2">
        <Button variant="outline" className={socialButtonClass} onClick={() => continueWith("google")} disabled={pending !== null}>
          {pending === "google" ? <LoaderCircle className="animate-spin" /> : <GoogleIcon className="size-4" />}
          Continue with Google
        </Button>
        <Button variant="outline" className={socialButtonClass} onClick={() => continueWith("github")} disabled={pending !== null}>
          {pending === "github" ? <LoaderCircle className="animate-spin" /> : <GitHubIcon className="size-4" />}
          Continue with GitHub
        </Button>
        <p className="text-xs text-muted-foreground">
          Module 5 projects run tests on your GitHub repositories, so you’ll need GitHub connected by then.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-border" /> or use a one-time code{" "}
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-border" />
      </motion.div>

      <motion.form variants={fadeUp} onSubmit={sendCode} noValidate className="space-y-4">
        {mode === "sign-up" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Aarav Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
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
            className={inputClass}
          />
          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                key="email-error"
                id="email-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <GlowButton type="submit" disabled={pending !== null}>
          {pending === "email" ? <LoaderCircle className="animate-spin" /> : <Mail />}
          {pending === "email" ? "Sending code…" : "Send me a code"}
        </GlowButton>
      </motion.form>

      <motion.p variants={fadeUp} className="text-center text-xs text-muted-foreground">
        By continuing you agree to the Terms of Service and Privacy Policy. We never post anything to your accounts.
      </motion.p>
    </motion.div>
  );
}
