"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedHeight } from "@/components/ai-theme/animated-height";
import { GlowButton } from "@/components/ai-theme/glow-button";
import { EASE_OUT, stepItem, stepTransition } from "@/components/ai-theme/presets";
import styles from "@/components/ai-theme/ai-theme.module.css";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  CompaniesStep,
  LevelStep,
  PersonaStep,
  SalaryStep,
  StartStep,
  SummaryStep,
} from "@/features/onboarding/components/onboarding-steps";
import { OnboardingProgress } from "@/features/onboarding/components/onboarding-progress";
import { PathPreview } from "@/features/onboarding/components/path-preview";
import { ONBOARDING_STEPS, canContinue, type OnboardingAnswers } from "@/features/onboarding/steps";

const STEP_COPY: Record<(typeof ONBOARDING_STEPS)[number]["id"], { title: string; description: string }> = {
  persona: { title: "Which of these describes you best?", description: "This shapes the examples and pace we suggest." },
  level: { title: "What’s your current level?", description: "Pick the role closest to your experience today." },
  companies: { title: "Where do you want to work?", description: "Choose up to three companies. We’ll show readiness for each." },
  salary: { title: "What salary are you aiming for?", description: "Used for your salary readiness estimate on the dashboard." },
  start: { title: "Where would you like to start?", description: "Experienced engineers usually save weeks with the placement test." },
  summary: { title: "You’re all set", description: "Here’s what we’ll use to build your learning path." },
};

export function OnboardingWizard({ companyOptions }: { companyOptions: string[] }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [answers, setAnswers] = React.useState<OnboardingAnswers>({ companies: [] });
  const [finishing, setFinishing] = React.useState(false);
  const hasMoved = React.useRef(false);

  const step = ONBOARDING_STEPS[stepIndex]!;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const copy = STEP_COPY[step.id];

  function update(patch: Partial<OnboardingAnswers>) {
    setAnswers((a) => ({ ...a, ...patch }));
  }

  function goTo(next: number) {
    hasMoved.current = true;
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
  }

  function finish() {
    setFinishing(true);
    setTimeout(() => router.push(answers.start === "placement" ? routes.placementTest : routes.dashboard), 900);
  }

  // After moving between steps, put focus on the new question so keyboard and
  // screen-reader users land in the right place (not on first load).
  React.useEffect(() => {
    if (hasMoved.current) document.getElementById(`onboarding-title-${step.id}`)?.focus({ preventScroll: true });
  }, [step.id]);

  return (
    <div className="w-full max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
        <OnboardingProgress stepIndex={stepIndex} />
      </motion.div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <PathPreview answers={answers} stepIndex={stepIndex} className="hidden lg:block" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.1 }}
          className="min-w-0"
        >
          <div className={cn(styles.cardEdge, "rounded-2xl p-px")}>
            <div className="rounded-[15px] bg-card/80 p-6 backdrop-blur-md sm:p-8">
              <AnimatedHeight>
                <div className="relative">
                  <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div key={step.id} custom={direction} variants={stepTransition} initial="enter" animate="center" exit="exit">
                      <motion.h1
                        id={`onboarding-title-${step.id}`}
                        tabIndex={-1}
                        variants={stepItem}
                        className="text-2xl font-semibold tracking-tight outline-none"
                      >
                        {copy.title}
                      </motion.h1>
                      <motion.p variants={stepItem} className="mt-1.5 text-sm text-muted-foreground">
                        {copy.description}
                      </motion.p>

                      <div className="mt-6">
                        {step.id === "persona" && <PersonaStep value={answers.persona} onChange={(persona) => update({ persona })} />}
                        {step.id === "level" && <LevelStep value={answers.level} onChange={(level) => update({ level })} />}
                        {step.id === "companies" && (
                          <CompaniesStep options={companyOptions} value={answers.companies} onChange={(companies) => update({ companies })} />
                        )}
                        {step.id === "salary" && <SalaryStep value={answers.salary} onChange={(salary) => update({ salary })} />}
                        {step.id === "start" && <StartStep value={answers.start} onChange={(start) => update({ start })} />}
                        {step.id === "summary" && <SummaryStep answers={answers} />}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </AnimatedHeight>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                <Button
                  variant="ghost"
                  onClick={() => goTo(stepIndex - 1)}
                  disabled={stepIndex === 0 || finishing}
                  className="transition-transform motion-safe:hover:-translate-x-0.5"
                >
                  <ArrowLeft /> Back
                </Button>
                {isLast ? (
                  <GlowButton onClick={finish} disabled={finishing} className="w-auto">
                    {finishing && <LoaderCircle className="animate-spin" />}
                    {answers.start === "placement" ? "Start the placement test" : "Go to my dashboard"}
                  </GlowButton>
                ) : (
                  <GlowButton
                    onClick={() => goTo(stepIndex + 1)}
                    disabled={!canContinue(step.id, answers)}
                    className="w-auto disabled:opacity-45"
                  >
                    Continue <ArrowRight />
                  </GlowButton>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">You can change these answers any time in Settings.</p>
        </motion.div>
      </div>
    </div>
  );
}
