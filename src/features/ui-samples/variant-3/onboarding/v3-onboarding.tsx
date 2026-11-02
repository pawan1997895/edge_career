"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { routes } from "@/lib/routes";
import { ONBOARDING_STEPS, canContinue, type OnboardingAnswers, type OnboardingStepId } from "@/features/onboarding/steps";
import { minimalSound } from "../sound";
import { AnimatedHeight, Card, CodeChip, Cursor, EASE, PrimaryButton, SecondaryButton, TypeOnce } from "../ui";
import { useReducedMotion } from "../use-reduced-motion";
import { STEP_COPY } from "./copy";
import { Progress } from "./progress";
import { CompaniesStep, LevelStep, PersonaStep, SalaryStep, StartStep, SummaryStep, stepChild } from "./steps";

// The step slides and un-blurs in from the side the user is moving towards (custom: 1 forward, -1 back).
const stageVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 16 * direction, filter: "blur(6px)" }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: EASE, staggerChildren: 0.05, delayChildren: 0.04 },
    transitionEnd: { filter: "none" },
  },
  exit: (direction: number) => ({ opacity: 0, x: -12 * direction, filter: "blur(4px)", transition: { duration: 0.16, ease: "easeIn" } }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** The current answer as a line of code (ASCII only, for the typing effect). */
function answerLine(stepId: OnboardingStepId, a: OnboardingAnswers) {
  switch (stepId) {
    case "persona":
      return a.persona ? `profile.persona = "${a.persona}"` : null;
    case "level":
      return a.level ? `profile.level = "${a.level}"` : null;
    case "companies":
      return a.companies.length ? `profile.targets = [${a.companies.map((c) => `"${c}"`).join(", ")}]` : null;
    case "salary":
      return a.salary ? `profile.salary = "${a.salary} LPA"` : null;
    case "start":
      return a.start ? `profile.start = "${a.start}"` : null;
    case "summary":
      return "plan.compile() // ready";
  }
}

/** Design Option 3 onboarding: one calm card per step, a thin progress line and soft code details. */
export function V3Onboarding({ companyOptions }: { companyOptions: string[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [answers, setAnswers] = React.useState<OnboardingAnswers>({ companies: [] });
  const [finishing, setFinishing] = React.useState(false);
  const hasMoved = React.useRef(false);

  const step = ONBOARDING_STEPS[stepIndex]!;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const copy = STEP_COPY[step.id];
  const titleId = `v3-title-${step.id}`;
  const line = answerLine(step.id, answers);
  const percent = Math.round((stepIndex / (ONBOARDING_STEPS.length - 1)) * 100);

  function update(patch: Partial<OnboardingAnswers>) {
    setAnswers((a) => ({ ...a, ...patch }));
  }

  function goTo(next: number) {
    minimalSound.play("nav");
    hasMoved.current = true;
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
  }

  function finish() {
    minimalSound.play("confirm");
    setFinishing(true);
    setTimeout(() => router.push(answers.start === "placement" ? routes.placementTest : routes.dashboard), 900);
  }

  // After moving between steps, put focus on the new question (not on first load). The new step only
  // mounts once the old one has left, so this runs when its entrance starts.
  function focusQuestion(definition: unknown) {
    if (definition === "center" && hasMoved.current) document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  return (
    // Anchored to the top so the progress line stays put while the card grows or shrinks between steps.
    <div className="relative mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 pt-4 pb-10 sm:pt-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
        <CodeChip key={percent} text={`progress: ${percent}%`} className="absolute top-[30%] -left-[230px]" />
        <CodeChip text="ai.plan.update()" dot="--v3-violet" delay={2} className="absolute top-[62%] -right-[220px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <Progress stepIndex={stepIndex} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="mt-6"
      >
        <Card className="p-6 sm:p-8">
          <AnimatedHeight>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.section
                key={step.id}
                custom={direction}
                variants={reduceMotion ? fadeVariants : stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationStart={focusQuestion}
              >
                <motion.p variants={stepChild} aria-hidden className="font-mono text-xs text-(--v3-cyan)/80">
                  {`// ${String(stepIndex + 1).padStart(2, "0")} · ${step.label.toLowerCase()}`}
                </motion.p>
                <motion.h1
                  id={titleId}
                  tabIndex={-1}
                  variants={stepChild}
                  className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-tight outline-none sm:text-[2rem]"
                >
                  {copy.title}
                </motion.h1>
                <motion.p variants={stepChild} className="mt-2 text-muted-foreground">
                  {copy.description}
                </motion.p>

                <div className="mt-6">
                  {step.id === "persona" && <PersonaStep value={answers.persona} labelledBy={titleId} onChange={(persona) => update({ persona })} />}
                  {step.id === "level" && <LevelStep value={answers.level} labelledBy={titleId} onChange={(level) => update({ level })} />}
                  {step.id === "companies" && (
                    <CompaniesStep options={companyOptions} value={answers.companies} onChange={(companies) => update({ companies })} />
                  )}
                  {step.id === "salary" && <SalaryStep value={answers.salary} labelledBy={titleId} onChange={(salary) => update({ salary })} />}
                  {step.id === "start" && <StartStep value={answers.start} labelledBy={titleId} onChange={(start) => update({ start })} />}
                  {step.id === "summary" && <SummaryStep answers={answers} />}
                </div>
              </motion.section>
            </AnimatePresence>
          </AnimatedHeight>

          <p aria-hidden className="mt-6 flex h-5 items-center gap-2 overflow-hidden font-mono text-xs whitespace-nowrap text-muted-foreground">
            <span className="text-(--v3-cyan)/70">&gt;</span>
            {line ? <TypeOnce key={line} text={line} /> : <span className="text-muted-foreground/60">awaiting selection</span>}
            <Cursor />
          </p>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-(--v3-line) pt-6">
            <SecondaryButton onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0 || finishing}>
              <ArrowLeft /> Back
            </SecondaryButton>
            {isLast ? (
              <PrimaryButton onClick={finish} disabled={finishing}>
                {finishing && <LoaderCircle className="animate-spin" />}
                {answers.start === "placement" ? "Start the placement test" : "Go to my dashboard"}
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => goTo(stepIndex + 1)} disabled={!canContinue(step.id, answers)}>
                Continue <ArrowRight />
              </PrimaryButton>
            )}
          </div>
        </Card>
      </motion.div>
      <p className="mt-5 text-center text-xs text-muted-foreground">You can change these answers any time in Settings.</p>
    </div>
  );
}
