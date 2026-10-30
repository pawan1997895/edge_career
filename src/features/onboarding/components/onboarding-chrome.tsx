"use client";

import { AnimatePresence, motion } from "motion/react";
import { TypeLine } from "@/components/ai-theme/typewriter";
import { usePrefersReducedMotion } from "@/components/ai-theme/use-prefers-reduced-motion";
import styles from "@/components/ai-theme/ai-theme.module.css";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS } from "@/types/user";
import type { OnboardingAnswers, OnboardingStepId } from "@/features/onboarding/steps";

// Coding-journey details around the onboarding questions. All decorative (aria-hidden):
// the questions, answers and progress are already announced by the real controls.

const STEP_FILES: Record<OnboardingStepId, string> = {
  persona: "profile/persona.ts",
  level: "profile/level.ts",
  companies: "targets/companies.ts",
  salary: "targets/salary.ts",
  start: "path/start.ts",
  summary: "path/plan.json",
};

/** Editor-style title bar across the top of the card, naming a "file" for each step. */
export function WindowBar({ stepId }: { stepId: OnboardingStepId }) {
  const file = STEP_FILES[stepId];
  return (
    <div
      aria-hidden
      className="-mx-6 -mt-6 mb-5 flex items-center gap-3 rounded-t-[15px] border-b border-border/50 bg-background/30 px-4 py-2 font-mono text-[11px] text-muted-foreground sm:-mx-8 sm:-mt-8"
    >
      <span className="flex shrink-0 gap-1.5">
        <span className="size-2 rounded-full bg-(--ec-violet)/70" />
        <span className="size-2 rounded-full bg-(--ec-blue)/70" />
        <span className="size-2 rounded-full bg-(--ec-cyan)/70" />
      </span>
      <span className="flex min-w-0 items-center">
        <span className="text-(--ec-blue)">~/onboarding/</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={file}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="truncate text-foreground/80"
          >
            {file}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-1.5 text-(--ec-cyan)">
        <span className={cn(styles.hudPulse, "size-1.5 rounded-full bg-(--ec-cyan)")} /> AI live
      </span>
    </div>
  );
}

/** Typed code comment above each question, e.g. `// 03 · companies`. */
export function StepComment({ index, label }: { index: number; label: string }) {
  return (
    <span aria-hidden className="block h-4 font-mono text-xs text-(--ec-cyan)/80">
      <TypeLine text={`// ${String(index + 1).padStart(2, "0")} · ${label.toLowerCase()}`} speed={28} />
    </span>
  );
}

function consoleLine(stepId: OnboardingStepId, a: OnboardingAnswers): { done: boolean; text: string } {
  switch (stepId) {
    case "persona":
      return a.persona ? { done: true, text: `profile.persona = "${PERSONA_LABELS[a.persona]}"` } : { done: false, text: "awaiting input" };
    case "level":
      return a.level ? { done: true, text: `profile.level = "${LEVEL_LABELS[a.level]}"` } : { done: false, text: "awaiting input" };
    case "companies":
      return a.companies.length
        ? { done: true, text: `targets.companies = [${a.companies.map((c) => `"${c}"`).join(", ")}]` }
        : { done: false, text: "select up to 3 companies" };
    case "salary":
      return a.salary ? { done: true, text: `targets.salary = "${SALARY_LABELS[a.salary]}"` } : { done: false, text: "awaiting input" };
    case "start":
      return a.start
        ? { done: true, text: `path.start = "${a.start === "placement" ? "placement-test" : "module-1"}"` }
        : { done: false, text: "awaiting input" };
    case "summary":
      return { done: true, text: "path.compile() → ready" };
  }
}

/** Console line that echoes each answer as code the moment it's chosen. */
export function StepConsole({ stepId, answers, className }: { stepId: OnboardingStepId; answers: OnboardingAnswers; className?: string }) {
  const { done, text } = consoleLine(stepId, answers);
  return (
    <div
      aria-hidden
      className={cn("flex h-8 min-w-0 items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 font-mono text-xs", className)}
    >
      <span className={done ? "text-emerald-400" : "text-(--ec-cyan)"}>{done ? "✓" : "›"}</span>
      <span className={cn("min-w-0 truncate", done ? "text-foreground/85" : "text-muted-foreground")}>
        <TypeLine key={text} text={text} speed={14} cursor={!done} />
      </span>
    </div>
  );
}

/** A single light sweep down the card when a new step comes in. */
export function ScanSweep({ stepId }: { stepId: OnboardingStepId }) {
  const reduceMotion = usePrefersReducedMotion();
  if (reduceMotion) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[15px]">
      <motion.span
        key={stepId}
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{ duration: 0.9, ease: [0.45, 0, 0.55, 1] }}
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,color-mix(in_oklch,var(--ec-cyan)_7%,transparent)_96%,color-mix(in_oklch,var(--ec-cyan)_35%,transparent)_99.6%,transparent)]"
      />
    </span>
  );
}
