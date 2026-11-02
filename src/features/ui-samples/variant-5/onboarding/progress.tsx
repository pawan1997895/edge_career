"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/features/onboarding/steps";
import { CountUp, EASE, TechChip } from "../ui";
import { STACK } from "./copy";

/** "Step x of 6", a neon progress bar with a glowing head, and the stack tags lighting up as you go. */
export function Progress({ stepIndex }: { stepIndex: number }) {
  const total = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[stepIndex]!;
  const fraction = stepIndex / (total - 1);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p className="font-medium text-white/55">
          Step {stepIndex + 1} of {total} · <span className="font-bold text-white">{current.label}</span>
        </p>
        <p className="font-bold text-(--v5-emerald)">
          <CountUp value={Math.round(fraction * 100)} />%
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={stepIndex + 1}
        className="relative mt-3 h-2.5 rounded-full bg-white/8"
      >
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-(image:--v5-gradient) shadow-[0_0_16px_-2px_var(--v5-emerald)]"
          initial={false}
          animate={{ scaleX: Math.max(fraction, 0.015) }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <motion.span
          aria-hidden
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--v5-bg) bg-(--v5-lime) shadow-[0_0_14px_var(--v5-lime)]"
          initial={false}
          animate={{ left: `${fraction * 100}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      <ol aria-hidden className="mt-2.5 hidden grid-cols-6 md:grid">
        {ONBOARDING_STEPS.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              "text-xs font-semibold transition-colors duration-300",
              i === 0 ? "text-left" : i === total - 1 ? "text-right" : "text-center",
              i === stepIndex ? "text-white" : i < stepIndex ? "text-(--v5-emerald)" : "text-white/35",
            )}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <div aria-hidden className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-white/40">Your stack</span>
        {STACK.map((t, i) => {
          // One tag per completed step; all of them on the final step.
          const lit = i < stepIndex || stepIndex === total - 1;
          return (
            <motion.span key={t.label} initial={false} animate={{ scale: lit ? 1 : 0.94 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <TechChip tone={t.tone} lit={lit}>
                {t.label}
              </TechChip>
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
