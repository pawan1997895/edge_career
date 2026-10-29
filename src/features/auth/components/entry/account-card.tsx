"use client";

import { Lightbulb, Mic, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedHeight } from "@/components/ai-theme/animated-height";
import { EASE_OUT, fadeUp, staggerContainer } from "@/components/ai-theme/presets";
import styles from "@/components/ai-theme/ai-theme.module.css";
import { cn } from "@/lib/utils";
import { AuthTabs } from "./auth-tabs";

const HIGHLIGHTS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Sparkles, title: "AI feedback on every submission", body: "Hidden tests plus an AI code review that points to the exact line to improve." },
  { icon: Lightbulb, title: "Hints that teach", body: "The doubt hub nudges you step by step and never hands over the full answer." },
  { icon: Mic, title: "Voice mock interviews", body: "Practise real interview rounds and get a scorecard backed by your own words." },
];

/**
 * Sign-in / sign-up card with the switcher, plus the product promise beside it on large
 * screens. Stays mounted between the two pages so the switch animates smoothly.
 */
export function AccountCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
      <BrandPanel />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        className="mx-auto w-full max-w-[440px]"
      >
        <div className={cn(styles.cardEdge, "rounded-2xl p-px")}>
          <div className="rounded-[15px] bg-card/80 p-6 backdrop-blur-md sm:p-8">
            <AuthTabs />
            <AnimatedHeight>{children}</AnimatedHeight>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function BrandPanel() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      aria-label="About Edge Career"
      className="hidden max-w-xl lg:block"
    >
      <motion.p
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-(--ec-cyan)/30 bg-(--ec-cyan)/10 px-3 py-1 text-xs font-medium text-(--ec-cyan)"
      >
        <span className="relative flex size-2">
          <span className={cn(styles.pulseRing, "absolute inline-flex size-full rounded-full bg-(--ec-cyan)")} />
          <span className="relative inline-flex size-2 rounded-full bg-(--ec-cyan)" />
        </span>
        AI-guided interview preparation
      </motion.p>
      <motion.h2 variants={fadeUp} className="mt-5 text-4xl leading-tight font-semibold tracking-tight xl:text-5xl">
        Prepare for engineering interviews with a plan,{" "}
        <span className="bg-linear-to-r from-(--ec-cyan) via-(--ec-blue) to-(--ec-violet) bg-clip-text text-transparent">
          not a pile of problems
        </span>
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
        Lessons, a code judge, system design and mock interviews in one structured path, with AI feedback at every step.
      </motion.p>
      <ul className="mt-8 space-y-4">
        {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
          <motion.li key={title} variants={fadeUp} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-(--ec-blue)/30 bg-(--ec-blue)/10 text-(--ec-cyan) shadow-[0_0_24px_-8px_var(--ec-blue)]">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">{body}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
