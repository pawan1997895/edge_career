"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GitHubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { CodeLine } from "../code";
import { CodeLoop } from "../code";
import { v2Paths } from "../paths";
import { commandSound } from "../sound";
import { CommandButton, CountUp, EASE, GhostButton, HudPanel, Kicker } from "../ui";
import styles from "../command.module.css";
import { AiCore } from "./ai-core";
import { OtpStage } from "./otp-stage";

// Same rules as the real sign-up form (src/features/auth/components/auth-form.tsx).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Stage = "form" | "verify" | "granted";
type Pending = "email" | "google" | "github" | null;

export interface SignupStats {
  coreModules: number;
  electives: number;
}

const stageMotion = {
  initial: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  animate: { opacity: 1, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

/** Design Option 2 sign-up: mission briefing, the sign-up terminal, and an AI core column. */
export function V2Signup({ stats }: { stats: SignupStats }) {
  return (
    <div className="relative mx-auto grid w-full max-w-[1320px] flex-1 content-center items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
      <Briefing stats={stats} className="order-2 lg:order-1" />
      <SignupConsole className="order-1 lg:order-2" />
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
        className="order-3 hidden flex-col gap-6 xl:flex"
      >
        <AiCore />
        <HudPanel index="04" title="live.ts" status="writing" bodyClassName="px-4 py-3">
          <CodeLoop scripts={LIVE_CODE} numbered className="h-[150px] overflow-hidden text-[11.5px] leading-[22px]" />
        </HudPanel>
      </motion.div>
    </div>
  );
}

function Briefing({ stats, className }: { stats: SignupStats; className?: string }) {
  const readouts = [
    { label: "Core modules", node: <CountUp value={stats.coreModules} pad={2} /> },
    { label: "Electives", node: <CountUp value={stats.electives} pad={2} /> },
    {
      label: "Checkpoint to unlock",
      node: (
        <>
          <CountUp value={85} />%
        </>
      ),
    },
    {
      label: "Tests / AI review",
      node: (
        <>
          <CountUp value={70} />
          <span className="text-muted-foreground">/</span>
          <CountUp value={30} />
        </>
      ),
    },
  ];

  return (
    <motion.section
      aria-label="About Edge Career"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      className={cn("relative flex flex-col gap-6", className)}
    >
      <div>
        <Kicker>&gt; AI developer command center</Kicker>
        <h2 className={cn(styles.display, "mt-3 text-3xl leading-[1.05] font-semibold tracking-tight xl:text-[2.6rem]")}>
          Prepare with a plan, <span className="text-(--v2-mint)">not a pile of problems.</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Lessons, a code judge, system design and mock interviews in one structured path, with AI feedback at every step.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {readouts.map((r) => (
          <div
            key={r.label}
            className={cn(styles.chamfer, "flex flex-col-reverse bg-(--v2-surface)/85 px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--v2-line)] [--v2-cut:10px]")}
          >
            <dt className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{r.label}</dt>
            <dd className={cn(styles.display, "text-3xl leading-none font-semibold text-(--v2-mint) tabular-nums")}>{r.node}</dd>
          </div>
        ))}
      </dl>

      <HudPanel index="01" title="boot.log" status="live" className="hidden lg:block" bodyClassName="px-4 py-3">
        <CodeLoop scripts={bootScripts(stats)} hold={3000} className="h-[120px] text-[11.5px] leading-[24px]" />
      </HudPanel>
    </motion.section>
  );
}

function SignupConsole({ className }: { className?: string }) {
  const router = useRouter();
  const [stage, setStage] = React.useState<Stage>("form");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<Pending>(null);

  React.useEffect(() => {
    router.prefetch(v2Paths.onboarding);
  }, [router]);

  function grantAccess() {
    commandSound.play("confirm");
    setStage("granted");
    setTimeout(() => router.push(v2Paths.onboarding), 1100);
  }

  function continueWith(provider: "google" | "github") {
    commandSound.play("select");
    setPending(provider);
    setTimeout(grantAccess, 800);
  }

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      commandSound.play("error");
      setError("Enter a valid email address, like name@company.com.");
      return;
    }
    commandSound.play("confirm");
    setError(null);
    setPending("email");
    setTimeout(() => {
      setPending(null);
      setStage("verify");
    }, 800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn("mx-auto w-full max-w-[560px]", className)}
    >
      <HudPanel focus index="02" title="create-account.sh" status="secure" bodyClassName="relative p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "form" && (
            <motion.div key="form" {...stageMotion}>
              <Kicker>&gt; edge.career / new operator</Kicker>
              <h1 className={cn(styles.display, "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl")}>
                Create your account
                <span aria-hidden className={cn(styles.cursor, "ml-2 inline-block h-[0.8em] w-[0.45em] bg-(--v2-mint)")} />
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Free to start. No card needed.</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <GhostButton
                  type="button"
                  onClick={() => continueWith("google")}
                  disabled={pending !== null}
                  className="normal-case tracking-normal text-foreground"
                >
                  {pending === "google" ? <LoaderCircle className="animate-spin" /> : <GoogleIcon className="size-4" />}
                  Continue with Google
                </GhostButton>
                <GhostButton
                  type="button"
                  onClick={() => continueWith("github")}
                  disabled={pending !== null}
                  className="normal-case tracking-normal text-foreground"
                >
                  {pending === "github" ? <LoaderCircle className="animate-spin" /> : <GitHubIcon className="size-4" />}
                  Continue with GitHub
                </GhostButton>
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground">
                Module 5 projects run tests on your GitHub repositories, so you’ll need GitHub connected by then.
              </p>

              <div className="my-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="h-px flex-1 bg-(--v2-line)" /> or use a one-time code <span className="h-px flex-1 bg-(--v2-line)" />
              </div>

              <form onSubmit={sendCode} noValidate className="space-y-4">
                <TerminalField
                  id="v2-name"
                  label="Full name"
                  hint="user.name"
                  autoComplete="name"
                  placeholder="Aarav Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="space-y-1.5">
                  <TerminalField
                    id="v2-email"
                    label="Work or personal email"
                    hint="user.email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "v2-email-error" : undefined}
                  />
                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.p
                        key="error"
                        id="v2-email-error"
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="font-mono text-xs text-destructive"
                      >
                        <span className="font-semibold">✗ ERR</span> {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <CommandButton type="submit" disabled={pending !== null} className="w-full">
                  {pending === "email" ? <LoaderCircle className="animate-spin" /> : <Mail />}
                  {pending === "email" ? "Sending code…" : "Send me a code"}
                  {pending !== "email" && <ArrowRight />}
                </CommandButton>
              </form>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                By continuing you agree to the Terms of Service and Privacy Policy. We never post anything to your accounts.
              </p>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href={routes.signIn} className="font-medium text-(--v2-mint) underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}

          {stage === "verify" && (
            <motion.div key="verify" {...stageMotion}>
              <OtpStage
                email={email.trim()}
                onVerified={grantAccess}
                onBack={() => {
                  commandSound.play("nav");
                  setStage("form");
                }}
              />
            </motion.div>
          )}

          {stage === "granted" && (
            <motion.div key="granted" {...stageMotion} className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className={cn(styles.chamfer, "grid size-16 place-items-center bg-(--v2-mint)/15 text-(--v2-mint) [--v2-cut:12px]")}>
                <ShieldCheck className="size-8" />
              </span>
              <p role="status" className={cn(styles.display, "mt-5 text-3xl font-semibold tracking-[0.12em] text-(--v2-mint)")}>
                ACCESS GRANTED
              </p>
              <p className="mt-2 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">Loading mission configuration…</p>
              <div className="mt-6 h-1 w-56 overflow-hidden bg-(--v2-line)">
                <motion.div
                  className="h-full origin-left bg-linear-to-r from-(--v2-mint) to-(--v2-amber)"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HudPanel>
    </motion.div>
  );
}

/** Text field styled as a terminal prompt: cut corners, mono input and a gradient underline on focus. */
export function TerminalField({
  id,
  label,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint: string }) {
  const invalid = props["aria-invalid"] === true;
  return (
    <div className={cn("group space-y-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        <span>
          <span className="text-(--v2-mint)">❯</span> {label}
        </span>
        <span aria-hidden className="tracking-normal normal-case text-muted-foreground/55">
          {hint}
        </span>
      </label>
      <div
        className={cn(
          styles.chamfer,
          "relative p-px transition-colors duration-200 [--v2-cut:9px]",
          invalid ? "bg-destructive/70" : "bg-(--v2-line) group-focus-within:bg-(--v2-mint)/70 hover:bg-(--v2-line-strong)",
        )}
      >
        <input
          id={id}
          className={cn(
            styles.chamfer,
            "h-12 w-full bg-(--v2-bg) px-4 font-mono text-[15px] text-foreground caret-(--v2-mint) outline-none [--v2-cut:9px] placeholder:text-muted-foreground/40",
          )}
          {...props}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-(--v2-mint) to-(--v2-amber) transition-transform duration-500 group-focus-within:scale-x-100"
        />
      </div>
    </div>
  );
}

// ---------- decorative code ----------

function bootScripts(stats: SignupStats): CodeLine[][] {
  return [
    // ASCII only: typed lines are sized in `ch`, and symbols outside the mono font's subset would overflow.
    [
      [["kw", "$ "], ["fn", "edge boot"], ["plain", " --profile new"]],
      [["str", "[ok] "], ["plain", "curriculum ... "], ["num", `${stats.coreModules} modules`]],
      [["str", "[ok] "], ["plain", "code judge ... "], ["str", "ready"]],
      [["str", "[ok] "], ["plain", "ai mentor .... "], ["str", "online"]],
      [["kw", "> "], ["com", "awaiting operator"]],
    ],
    [
      [["kw", "$ "], ["fn", "edge status"], ["plain", " --services"]],
      [["str", "[ok] "], ["plain", "hidden tests . "], ["num", "70%"]],
      [["str", "[ok] "], ["plain", "ai review .... "], ["num", "30%"]],
      [["str", "[ok] "], ["plain", "interviews ... "], ["str", "standby"]],
      [["kw", "> "], ["com", "create your account"]],
    ],
  ];
}

const LIVE_CODE: CodeLine[][] = [
  [
    [["kw", "const "], ["prop", "you"], ["punc", " = "], ["kw", "await "], ["fn", "edge.signup"], ["punc", "({"]],
    [["prop", "  track"], ["punc", ": "], ["str", '"core"'], ["punc", ","]],
    [["prop", "  mentor"], ["punc", ": "], ["str", '"ai"'], ["punc", ","]],
    [["punc", "});"]],
    [["kw", "await "], ["fn", "ai.mentor.attach"], ["punc", "("], ["prop", "you"], ["punc", ");"]],
    [["fn", "judge.run"], ["punc", "("], ["prop", "you.code"], ["punc", "); "], ["com", "// hidden tests"]],
  ],
  [
    [["kw", "for "], ["punc", "("], ["kw", "const "], ["prop", "mod"], ["kw", " of "], ["prop", "path.modules"], ["punc", ") {"]],
    [["kw", "  await "], ["fn", "mod.learn"], ["punc", "();"]],
    [["kw", "  if "], ["punc", "("], ["prop", "mod.checkpoint"], ["punc", " >= "], ["num", "85"], ["punc", ") {"]],
    [["fn", "    path.unlock"], ["punc", "("], ["prop", "mod.next"], ["punc", ");"]],
    [["punc", "  }"]],
    [["punc", "}"]],
  ],
  [
    [["kw", "const "], ["prop", "round"], ["punc", " = "], ["fn", "interview.mock"], ["punc", "("], ["str", '"design"'], ["punc", ");"]],
    [["prop", "round.voice"], ["punc", " = "], ["kw", "true"], ["punc", ";"]],
    [["kw", "const "], ["prop", "card"], ["punc", " = "], ["kw", "await "], ["fn", "round.finish"], ["punc", "();"]],
    [["fn", "review"], ["punc", "("], ["prop", "card.feedback"], ["punc", ");"]],
    [["com", "// scorecard backed by your answers"]],
    [["kw", "return "], ["prop", "card"], ["punc", ";"]],
  ],
];
