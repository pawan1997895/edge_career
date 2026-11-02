"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/features/onboarding/steps";
import { CountUp, EASE } from "../ui";

/** "Step x of 6" with a percentage, and a thin gradient line with six points; a glowing ring marks the current one. */
export function Progress({ stepIndex }: { stepIndex: number }) {
  const total = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[stepIndex]!;
  const fraction = stepIndex / (total - 1);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p className="text-muted-foreground">
          Step {stepIndex + 1} of {total} · <span className="text-foreground">{current.label}</span>
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          <CountUp value={Math.round(fraction * 100)} />%
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={stepIndex + 1}
        className="relative mt-3 h-3"
      >
        <span aria-hidden className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-(--v3-line-strong)" />
        <motion.span
          aria-hidden
          className="absolute inset-x-1.5 top-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-(image:--v3-gradient) shadow-[0_0_10px_var(--v3-blue)]"
          initial={false}
          animate={{ scaleX: fraction }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <div aria-hidden className="absolute inset-0 flex items-center justify-between">
          {ONBOARDING_STEPS.map((s, i) => (
            <span key={s.id} className="relative grid size-3 place-items-center">
              <span className={cn("size-1.5 rounded-full transition-colors duration-500", i <= stepIndex ? "bg-white" : "bg-white/25")} />
              {i === stepIndex && (
                <motion.span
                  layoutId="v3-progress-current"
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute -inset-1 rounded-full border border-(--v3-cyan) shadow-[0_0_12px_var(--v3-cyan)]"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
