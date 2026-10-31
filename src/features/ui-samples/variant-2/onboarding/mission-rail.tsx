"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/features/onboarding/steps";
import { CountUp, EASE, HudPanel } from "../ui";
import styles from "../command.module.css";
import { STEP_CODES } from "./copy";

const total = ONBOARDING_STEPS.length;
const percentAt = (stepIndex: number) => Math.round((stepIndex / (total - 1)) * 100);

function Segments({ stepIndex }: { stepIndex: number }) {
  return (
    <div aria-hidden className="grid grid-cols-6 gap-1">
      {ONBOARDING_STEPS.map((s, i) => (
        <span key={s.id} className="relative h-1.5 overflow-hidden bg-(--v2-line)">
          <motion.span
            className={cn("absolute inset-0 origin-left", i === stepIndex ? cn(styles.pulse, "bg-(--v2-amber)") : "bg-(--v2-mint)")}
            initial={false}
            animate={{ scaleX: i <= stepIndex ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: i <= stepIndex ? 0.05 * i : 0 }}
          />
        </span>
      ))}
    </div>
  );
}

/** Left rail on large screens: big "path configured" percentage and the six mission steps. */
export function MissionRail({ stepIndex, className }: { stepIndex: number; className?: string }) {
  return (
    <HudPanel index="00" title="mission" status="live" className={className} bodyClassName="p-5">
      <span className={cn(styles.display, "block text-6xl leading-none font-semibold text-(--v2-mint) tabular-nums")}>
        <CountUp value={percentAt(stepIndex)} pad={2} duration={0.6} />
        <span className="text-3xl text-muted-foreground">%</span>
      </span>
      <span className="mt-2 block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Path configured</span>
      <div className="mt-4">
        <Segments stepIndex={stepIndex} />
      </div>

      <ol aria-label="Onboarding progress" className="mt-5 space-y-1">
        {ONBOARDING_STEPS.map((s, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li key={s.id} aria-current={current ? "step" : undefined} className="relative flex items-center gap-3 px-2.5 py-2">
              {current && (
                <motion.span
                  layoutId="v2-rail-active"
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-0 border-l-2 border-(--v2-mint) bg-(--v2-mint)/8"
                />
              )}
              <span
                className={cn(
                  "relative grid w-6 shrink-0 place-items-center font-mono text-[11px] font-semibold",
                  done ? "text-(--v2-mint)" : current ? "text-(--v2-amber)" : "text-muted-foreground/60",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative min-w-0">
                <span className={cn("block font-mono text-[11px] tracking-[0.14em] uppercase", current ? "text-foreground" : "text-muted-foreground")}>
                  {STEP_CODES[s.id]}
                </span>
                <span className="block text-xs text-muted-foreground/80">
                  {s.label}
                  {done && <span className="sr-only"> (completed)</span>}
                </span>
              </span>
              {current && <span aria-hidden className={cn(styles.pulse, "relative ml-auto text-xs text-(--v2-amber)")}>▸</span>}
            </li>
          );
        })}
      </ol>
    </HudPanel>
  );
}

/** Compact progress for phones and tablets. */
export function MobileProgress({ stepIndex, className }: { stepIndex: number; className?: string }) {
  const current = ONBOARDING_STEPS[stepIndex]!;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] tracking-[0.12em] uppercase">
        <span className="text-muted-foreground">
          Step {stepIndex + 1} of {total} · {current.label}
        </span>
        <span className={cn(styles.display, "text-lg font-semibold text-(--v2-mint) tabular-nums")}>
          <CountUp value={percentAt(stepIndex)} duration={0.6} />%
        </span>
      </div>
      <div role="progressbar" aria-label="Onboarding progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={stepIndex + 1}>
        <Segments stepIndex={stepIndex} />
      </div>
    </div>
  );
}
