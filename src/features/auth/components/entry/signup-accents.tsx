"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CodeTerminal, type TerminalLine } from "@/components/ai-theme/typewriter";
import { usePrefersReducedMotion } from "@/components/ai-theme/use-prefers-reduced-motion";
import styles from "@/components/ai-theme/ai-theme.module.css";
import { cn } from "@/lib/utils";

// Decorative coding details shown only on sign-up (sign-in stays as it was).

const SIGNUP_SCRIPTS: TerminalLine[][] = [
  [
    { kind: "cmd", text: "npx edge-career init" },
    { kind: "ok", text: "AI mentor", value: "online" },
    { kind: "ok", text: "6 core modules", value: "loaded" },
    { kind: "wait", text: "waiting for your account" },
  ],
  [
    { kind: "cmd", text: 'ai plan --target "SDE 2"' },
    { kind: "ok", text: "Placement test", value: "queued" },
    { kind: "ok", text: "Mock interviewer", value: "standby" },
    { kind: "wait", text: "create your account to begin" },
  ],
  [
    { kind: "cmd", text: "judge run two-sum.ts" },
    { kind: "ok", text: "Hidden tests", value: "12/12" },
    { kind: "ok", text: "AI code review", value: "2 notes" },
    { kind: "wait", text: "your turn next" },
  ],
];

const STATUSES = ["secure session", "one-time code ready", "AI mentor online"];

/** Terminal under the product promise; expands in when arriving on sign-up. */
export function SignupTerminal() {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <CodeTerminal title="~/edge-career — zsh" scripts={SIGNUP_SCRIPTS} className="mt-7" />
    </motion.div>
  );
}

/**
 * Details around the sign-up card: corner brackets, a component tag on the top edge, a live
 * status on the bottom edge and large braces beside it on wide screens. They sit on the card's
 * edge or outside it, never over the form fields.
 */
export function SignupCardAccents() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="pointer-events-none absolute inset-0"
    >
      <span className={cn(styles.hudPulse, "absolute -top-1.5 -left-1.5 size-5 rounded-tl-[22px] border-t-2 border-l-2 border-(--ec-cyan)/70")} />
      <span className={cn(styles.hudPulse, "absolute -top-1.5 -right-1.5 size-5 rounded-tr-[22px] border-t-2 border-r-2 border-(--ec-cyan)/70")} />
      <span className={cn(styles.hudPulse, "absolute -bottom-1.5 -left-1.5 size-5 rounded-bl-[22px] border-b-2 border-l-2 border-(--ec-violet)/70")} />
      <span className={cn(styles.hudPulse, "absolute -right-1.5 -bottom-1.5 size-5 rounded-br-[22px] border-r-2 border-b-2 border-(--ec-violet)/70")} />

      <span className="absolute -top-2.5 right-8 rounded-full border border-(--ec-cyan)/30 bg-(--ec-bg) px-2 py-0.5 font-mono text-[10px] leading-4 text-(--ec-cyan)">
        {"<CreateAccount />"}
      </span>
      <span className="absolute -bottom-2.5 left-8 flex items-center gap-1.5 rounded-full border border-(--ec-blue)/30 bg-(--ec-bg) px-2 py-0.5 font-mono text-[10px] leading-4 text-muted-foreground">
        <span className={cn(styles.hudPulse, "size-1.5 rounded-full bg-emerald-400")} />
        <StatusCycle />
      </span>

      <FloatingBrace side="left" />
      <FloatingBrace side="right" />
    </motion.div>
  );
}

function StatusCycle() {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % STATUSES.length), 2800);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <span className="relative inline-grid overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {STATUSES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FloatingBrace({ side }: { side: "left" | "right" }) {
  return (
    <span
      className={cn(
        styles.braceFloat,
        "absolute top-1/2 hidden -translate-y-1/2 bg-linear-to-b from-(--ec-cyan) to-(--ec-violet) bg-clip-text font-mono text-7xl font-light text-transparent opacity-30 xl:block",
        side === "left" ? "-left-16" : "-right-16 [animation-delay:-3s]",
      )}
    >
      {side === "left" ? "{" : "}"}
    </span>
  );
}
