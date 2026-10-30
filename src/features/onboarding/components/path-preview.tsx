"use client";

import { Building, GraduationCap, IndianRupee, Route, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT } from "@/components/ai-theme/presets";
import { Cursor } from "@/components/ai-theme/typewriter";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS } from "@/types/user";
import { ONBOARDING_STEPS, type OnboardingAnswers, type OnboardingStepId } from "@/features/onboarding/steps";

const ITEMS: { id: OnboardingStepId; label: string; icon: LucideIcon; value: (a: OnboardingAnswers) => string | undefined }[] = [
  { id: "persona", label: "About you", icon: UserRound, value: (a) => (a.persona ? PERSONA_LABELS[a.persona] : undefined) },
  { id: "level", label: "Experience", icon: GraduationCap, value: (a) => (a.level ? LEVEL_LABELS[a.level] : undefined) },
  { id: "companies", label: "Target companies", icon: Building, value: (a) => (a.companies.length ? a.companies.join(", ") : undefined) },
  { id: "salary", label: "Target salary", icon: IndianRupee, value: (a) => (a.salary ? SALARY_LABELS[a.salary] : undefined) },
  {
    id: "start",
    label: "Starting point",
    icon: Route,
    value: (a) => (a.start === "placement" ? "Placement test" : a.start === "module1" ? "Module 1" : undefined),
  },
];

/**
 * Live preview of the learning path being built, shown beside the onboarding card on
 * large screens. Each answer lights up its node as soon as it's chosen.
 */
export function PathPreview({ answers, stepIndex, className }: { answers: OnboardingAnswers; stepIndex: number; className?: string }) {
  const currentId = ONBOARDING_STEPS[stepIndex]?.id;
  const answered = ITEMS.filter((item) => item.value(answers)).length;
  const fill = answered <= 1 ? 0 : (answered - 1) / (ITEMS.length - 1);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
      aria-label="Your learning path so far"
      className={cn("rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm", className)}
    >
      <p className="flex items-center gap-2 text-xs font-medium text-(--ec-cyan)">
        <Sparkles className="size-3.5" /> Your AI learning path
        <span aria-hidden className="ml-auto font-mono text-[10px] font-normal text-muted-foreground">
          {answered}/{ITEMS.length}
        </span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {answered === ITEMS.length ? "Everything we need to personalise your plan." : "Builds as you answer."}
      </p>

      <ol className="relative mt-5 space-y-4">
        <span aria-hidden className="absolute top-3 bottom-8 left-[11px] w-px bg-border/60" />
        <motion.span
          aria-hidden
          className="absolute top-3 bottom-8 left-[11px] w-px origin-top bg-linear-to-b from-(--ec-cyan) to-(--ec-violet) shadow-[0_0_8px_var(--ec-cyan)]"
          initial={false}
          animate={{ scaleY: fill }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />
        {ITEMS.map((item) => {
          const value = item.value(answers);
          const active = currentId === item.id;
          return (
            <li key={item.id} className="relative flex h-11 gap-3">
              <motion.span
                initial={false}
                animate={{ scale: value ? 1 : 0.9 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className={cn(
                  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  value
                    ? "border-(--ec-cyan)/60 bg-(--ec-bg) text-(--ec-cyan) shadow-[0_0_14px_-2px_var(--ec-cyan)]"
                    : active
                      ? "border-(--ec-blue) bg-(--ec-bg) text-(--ec-blue)"
                      : "border-border bg-(--ec-bg) text-muted-foreground",
                )}
              >
                <item.icon className="size-3.5" />
              </motion.span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={value ?? (active ? "choosing" : "empty")}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    title={value}
                    className={cn("truncate text-sm", value ? "font-medium text-foreground" : "text-muted-foreground/70")}
                  >
                    {value ?? (active ? "Choosing…" : "Not set yet")}
                  </motion.p>
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Decorative build line under the path. */}
      <p aria-hidden className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3 font-mono text-[11px]">
        {answered === ITEMS.length ? (
          <>
            <span className="text-emerald-400">✓</span>
            <span className="text-foreground/85">path.compile() → ready</span>
          </>
        ) : (
          <>
            <span className="text-(--ec-cyan)">›</span>
            <span className="text-muted-foreground">compiling path</span>
            <span className="flex gap-0.5">
              {ITEMS.map((item, i) => (
                <span
                  key={item.id}
                  className={cn("h-2 w-1.5 rounded-[1px] transition-colors duration-300", i < answered ? "bg-(--ec-cyan)" : "bg-muted")}
                />
              ))}
            </span>
            <Cursor />
          </>
        )}
      </p>
    </motion.aside>
  );
}
