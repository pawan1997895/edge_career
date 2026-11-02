"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GitHubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { routes } from "@/lib/routes";
import { v3Paths } from "../paths";
import { minimalSound } from "../sound";
import { AiOrb, Card, CodeChip, EASE, PrimaryButton, SecondaryButton, TextField } from "../ui";
import { CodeStep } from "./code-step";

// Same rules as the real sign-up form (src/features/auth/components/auth-form.tsx).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Stage = "form" | "verify" | "done";
type Pending = "email" | "google" | "github" | null;

const stageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

/** Design Option 3 sign-up: a small AI orb, one clean card, and a few code chips floating around it. */
export function V3Signup() {
  return (
    <div className="relative mx-auto flex w-full max-w-[460px] flex-1 flex-col items-center justify-center px-5 pt-2 pb-10">
      <FloatingChips />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mt-4"
      >
        <AiOrb />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        AI-guided interview preparation
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        className="mt-5 w-full"
      >
        <SignupCard />
      </motion.div>
    </div>
  );
}

function FloatingChips() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      <CodeChip text="ai.mentor.online()" className="absolute top-[18%] -left-[290px]" />
      <CodeChip text="tests: 12/12 passed" dot="--v3-blue" delay={2.5} className="absolute top-[44%] -right-[300px]" />
      <CodeChip text="path.compile()" dot="--v3-violet" delay={5} className="absolute bottom-[22%] -left-[250px]" />
      <CodeChip text="hint.next()" delay={1.2} className="absolute -right-[230px] bottom-[10%]" />
    </div>
  );
}

function SignupCard() {
  const router = useRouter();
  const [stage, setStage] = React.useState<Stage>("form");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<Pending>(null);

  React.useEffect(() => {
    router.prefetch(v3Paths.onboarding);
  }, [router]);

  function done() {
    minimalSound.play("confirm");
    setStage("done");
    setTimeout(() => router.push(v3Paths.onboarding), 1000);
  }

  function continueWith(provider: "google" | "github") {
    minimalSound.play("select");
    setPending(provider);
    setTimeout(done, 800);
  }

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      minimalSound.play("error");
      setError("Enter a valid email address, like name@company.com.");
      return;
    }
    minimalSound.play("confirm");
    setError(null);
    setPending("email");
    setTimeout(() => {
      setPending(null);
      setStage("verify");
    }, 800);
  }

  return (
    <Card className="p-6 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "form" && (
          <motion.div key="form" {...stageMotion}>
            <h1 className="text-[1.65rem] leading-tight font-semibold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Free to start. No card needed.</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <SecondaryButton type="button" aria-label="Continue with Google" onClick={() => continueWith("google")} disabled={pending !== null}>
                {pending === "google" ? <LoaderCircle className="animate-spin" /> : <GoogleIcon className="size-4" />}
                Google
              </SecondaryButton>
              <SecondaryButton type="button" aria-label="Continue with GitHub" onClick={() => continueWith("github")} disabled={pending !== null}>
                {pending === "github" ? <LoaderCircle className="animate-spin" /> : <GitHubIcon className="size-4" />}
                GitHub
              </SecondaryButton>
            </div>
            <p className="mt-2.5 text-xs text-muted-foreground">
              Module 5 projects run tests on your GitHub repositories, so you’ll need GitHub connected by then.
            </p>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-(--v3-line)" /> or use a one-time code <span className="h-px flex-1 bg-(--v3-line)" />
            </div>

            <form onSubmit={sendCode} noValidate className="space-y-4">
              <TextField id="v3-name" label="Full name" autoComplete="name" placeholder="Aarav Mehta" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="space-y-1.5">
                <TextField
                  id="v3-email"
                  label="Work or personal email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "v3-email-error" : undefined}
                />
                <AnimatePresence initial={false}>
                  {error && (
                    <motion.p
                      key="error"
                      id="v3-email-error"
                      role="alert"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <PrimaryButton type="submit" disabled={pending !== null} className="w-full">
                {pending === "email" ? <LoaderCircle className="animate-spin" /> : <Mail />}
                {pending === "email" ? "Sending code…" : "Send me a code"}
                {pending !== "email" && <ArrowRight />}
              </PrimaryButton>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              By continuing you agree to the Terms of Service and Privacy Policy. We never post anything to your accounts.
            </p>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href={routes.signIn} className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}

        {stage === "verify" && (
          <motion.div key="verify" {...stageMotion}>
            <CodeStep
              email={email.trim()}
              onVerified={done}
              onBack={() => {
                minimalSound.play("nav");
                setStage("form");
              }}
            />
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" {...stageMotion} className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <svg aria-hidden viewBox="0 0 52 52" className="size-16">
              <circle cx="26" cy="26" r="24" fill="none" stroke="var(--v3-line-strong)" strokeWidth="2" />
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="url(#v3-done)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
              <motion.path
                d="M16 27l7 7 13-15"
                fill="none"
                stroke="var(--v3-cyan)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.45 }}
              />
              <defs>
                <linearGradient id="v3-done" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--v3-blue)" />
                  <stop offset="1" stopColor="var(--v3-violet)" />
                </linearGradient>
              </defs>
            </svg>
            <p role="status" className="mt-5 text-xl font-semibold tracking-tight">
              You’re in
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Setting up your learning path…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
