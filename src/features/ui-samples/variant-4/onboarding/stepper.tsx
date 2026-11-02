"use client";

import { Building, Check, GraduationCap, IndianRupee, Route, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS, type OnboardingStepId } from "@/features/onboarding/steps";
import { CountUp, EASE } from "../ui";
import styles from "../studio.module.css";

const ICONS: Record<OnboardingStepId, LucideIcon> = {
  persona: UserRound,
  level: GraduationCap,
  companies: Building,
  salary: IndianRupee,
  start: Route,
  summary: Sparkles,
};

/** Six icon steps joined by a gradient line that fills as you go; the current step pulses. */
export function Stepper({ stepIndex }: { stepIndex: number }) {
  const total = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[stepIndex]!;
  const fraction = stepIndex / (total - 1);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p className="font-medium text-(--v4-muted)">
          Step {stepIndex + 1} of {total} · <span className="font-bold text-(--v4-ink)">{current.label}</span>
        </p>
        <p className="text-sm font-bold text-(--v4-indigo)">
          <CountUp value={Math.round(fraction * 100)} />%
        </p>
      </div>

      <ol aria-label="Onboarding progress" className="relative mt-4 grid grid-cols-6">
        <span aria-hidden className="absolute top-4 h-1 rounded-full bg-(--v4-line) sm:top-5" style={{ left: `${50 / total}%`, right: `${50 / total}%` }} />
        <motion.span
          aria-hidden
          className="absolute top-4 h-1 origin-left rounded-full bg-(image:--v4-gradient) sm:top-5"
          style={{ left: `${50 / total}%`, right: `${50 / total}%` }}
          initial={false}
          animate={{ scaleX: fraction }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        {ONBOARDING_STEPS.map((s, i) => {
          const Icon = ICONS[s.id];
          const done = i < stepIndex;
          const isCurrent = i === stepIndex;
          return (
            <li key={s.id} aria-current={isCurrent ? "step" : undefined} className="relative flex flex-col items-center gap-2 text-center">
              <motion.span
                initial={false}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "relative grid size-9 place-items-center rounded-full border-2 transition-colors duration-300 sm:size-11 [&_svg]:size-4 sm:[&_svg]:size-5",
                  done && "border-transparent bg-(image:--v4-gradient) text-white",
                  isCurrent && "border-(--v4-indigo) bg-white text-(--v4-indigo) shadow-[0_8px_20px_-8px_var(--v4-indigo)]",
                  !done && !isCurrent && "border-(--v4-line) bg-white text-(--v4-muted)/70",
                )}
              >
                {isCurrent && <span aria-hidden className={cn(styles.pulse, "absolute inset-0 rounded-full border-2 border-(--v4-indigo)")} />}
                {done ? <Check strokeWidth={3} /> : <Icon />}
              </motion.span>
              <span className={cn("hidden text-xs font-semibold md:block", isCurrent ? "text-(--v4-ink)" : "text-(--v4-muted)")}>
                {s.label}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
