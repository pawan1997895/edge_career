"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/components/ai-theme/presets";
import styles from "@/components/ai-theme/ai-theme.module.css";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/features/onboarding/steps";

/**
 * Onboarding progress: on larger screens a rail of connected step nodes whose glowing
 * line fills as you advance; on phones a compact "Step x of 6" bar.
 */
export function OnboardingProgress({ stepIndex }: { stepIndex: number }) {
  const total = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[stepIndex]!;
  const inset = `${50 / total}%`; // the rail runs from the first node's centre to the last one's

  return (
    <>
      <ol aria-label="Onboarding progress" className="relative hidden grid-cols-6 sm:grid">
        <span aria-hidden className="absolute top-3 h-px bg-border/70" style={{ left: inset, right: inset }} />
        <motion.span
          aria-hidden
          className="absolute top-2.75 h-0.5 origin-left overflow-hidden rounded-full bg-linear-to-r from-(--ec-cyan) via-(--ec-blue) to-(--ec-violet) shadow-[0_0_10px_var(--ec-blue)]"
          style={{ left: inset, right: inset }}
          initial={false}
          animate={{ scaleX: stepIndex / (total - 1) }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <span className={styles.railShimmer} />
        </motion.span>
        {ONBOARDING_STEPS.map((s, i) => {
          const done = i < stepIndex;
          const isCurrent = i === stepIndex;
          return (
            <li key={s.id} aria-current={isCurrent ? "step" : undefined} className="relative flex flex-col items-center gap-2 text-center">
              <motion.span
                initial={false}
                animate={{ scale: isCurrent ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className={cn(
                  "relative z-10 flex size-6 items-center justify-center rounded-full border font-mono text-[10px] font-semibold transition-colors duration-300",
                  done && "border-transparent bg-linear-to-br from-(--ec-cyan) to-(--ec-blue) text-background",
                  isCurrent && "border-(--ec-cyan) bg-(--ec-bg) text-(--ec-cyan) shadow-[0_0_16px_-2px_var(--ec-cyan)]",
                  !done && !isCurrent && "border-border bg-card text-muted-foreground",
                )}
              >
                {isCurrent && <span aria-hidden className={cn(styles.pulseRing, "absolute inset-0 rounded-full border border-(--ec-cyan)")} />}
                {done ? <Check className="size-3.5" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
              </motion.span>
              <span
                className={cn(
                  "text-xs transition-colors duration-300",
                  isCurrent ? "font-medium text-foreground" : done ? "text-foreground/80" : "text-muted-foreground",
                )}
              >
                {s.label}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="sm:hidden">
        <p className="mb-2 text-xs text-muted-foreground">
          Step {stepIndex + 1} of {total} · {current.label}
        </p>
        <div
          role="progressbar"
          aria-label="Onboarding progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={stepIndex + 1}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            className="relative h-full origin-left overflow-hidden rounded-full bg-linear-to-r from-(--ec-cyan) via-(--ec-blue) to-(--ec-violet)"
            initial={false}
            animate={{ scaleX: (stepIndex + 1) / total }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <span className={styles.railShimmer} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
