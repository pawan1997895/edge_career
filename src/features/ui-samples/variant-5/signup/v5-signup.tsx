"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GitHubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { routes } from "@/lib/routes";
import { v5Paths } from "../paths";
import { neonSound } from "../sound";
import { AiCore, Card, EASE, Field, GhostButton, NeonButton } from "../ui";
import { CodeStep } from "./code-step";
import { NeonIllustration } from "./neon-illustration";

// Same rules as the real sign-up form (src/features/auth/components/auth-form.tsx).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Stage = "form" | "verify" | "done";
type Pending = "email" | "google" | "github" | null;

const stageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

/** Design Option 5 sign-up: the form first, the neon coding-studio illustration beside it. */
export function V5Signup() {
  return (
    <div className="mx-auto grid w-full max-w-[1240px] flex-1 content-center items-center gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="order-2 mx-auto w-full max-w-[440px] lg:order-1"
      >
        <SignupCard />
      </motion.div>
      <NeonIllustration className="order-1 lg:order-2" />
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
    router.prefetch(v5Paths.onboarding);
  }, [router]);

  function done() {
    neonSound.play("confirm");
    setStage("done");
    setTimeout(() => router.push(v5Paths.onboarding), 1000);
  }

  function continueWith(provider: "google" | "github") {
    neonSound.play("select");
    setPending(provider);
    setTimeout(done, 800);
  }

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      neonSound.play("error");
      setError("Enter a valid email address, like name@company.com.");
      return;
    }
    neonSound.play("confirm");
    setError(null);
    setPending("email");
    setTimeout(() => {
      setPending(null);
      setStage("verify");
    }, 800);
  }

  return (
    <Card neon innerClassName="p-7 sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "form" && (
          <motion.div key="form" {...stageMotion}>
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-white/60">Free to start. No card needed.</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <GhostButton type="button" aria-label="Continue with Google" onClick={() => continueWith("google")} disabled={pending !== null}>
                {pending === "google" ? <LoaderCircle className="animate-spin" /> : <GoogleIcon className="size-4" />}
                Google
              </GhostButton>
              <GhostButton type="button" aria-label="Continue with GitHub" onClick={() => continueWith("github")} disabled={pending !== null}>
                {pending === "github" ? <LoaderCircle className="animate-spin" /> : <GitHubIcon className="size-4" />}
                GitHub
              </GhostButton>
            </div>
            <p className="mt-2.5 text-xs text-white/50">
              Module 5 projects run tests on your GitHub repositories, so you’ll need GitHub connected by then.
            </p>

            <div className="my-5 flex items-center gap-3 text-xs font-medium text-white/45">
              <span className="h-px flex-1 bg-(--v5-line-strong)" /> or use a one-time code <span className="h-px flex-1 bg-(--v5-line-strong)" />
            </div>

            <form onSubmit={sendCode} noValidate className="space-y-4">
              <Field id="v5-name" label="Full name" autoComplete="name" placeholder="Aarav Mehta" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="space-y-1.5">
                <Field
                  id="v5-email"
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
                  aria-describedby={error ? "v5-email-error" : undefined}
                />
                <AnimatePresence initial={false}>
                  {error && (
                    <motion.p
                      key="error"
                      id="v5-email-error"
                      role="alert"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs font-medium text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <NeonButton type="submit" disabled={pending !== null} className="w-full">
                {pending === "email" ? <LoaderCircle className="animate-spin" /> : <Mail />}
                {pending === "email" ? "Sending code…" : "Send me a code"}
                {pending !== "email" && <ArrowRight />}
              </NeonButton>
            </form>

            <p className="mt-5 text-center text-xs text-white/45">
              By continuing you agree to the Terms of Service and Privacy Policy. We never post anything to your accounts.
            </p>
            <p className="mt-3 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link href={routes.signIn} className="font-semibold text-(--v5-emerald) underline-offset-4 hover:underline">
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
                neonSound.play("nav");
                setStage("form");
              }}
            />
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" {...stageMotion} className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <AiCore size={104} pulse={1} />
            <p role="status" className="mt-6 text-2xl font-bold tracking-tight">
              You’re in
            </p>
            <p className="mt-1 text-sm text-white/60">Booting your learning path…</p>
            <div className="mt-6 h-1.5 w-52 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left rounded-full bg-(image:--v5-gradient) shadow-[0_0_12px_var(--v5-emerald)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.95, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
