"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { routes } from "@/lib/routes";
import { ONBOARDING_STEPS, canContinue, type OnboardingAnswers } from "@/features/onboarding/steps";
import { studioSound } from "../sound";
import { AnimatedHeight, Card, EASE, GradientButton, SoftButton, Tag } from "../ui";
import { useReducedMotion } from "../use-reduced-motion";
import { AssistantPanel, MentorTip } from "./assistant-panel";
import { STEP_COPY } from "./copy";
import { Stepper } from "./stepper";
import { CompaniesStep, LevelStep, PersonaStep, SalaryStep, StartStep, SummaryStep, stepChild } from "./steps";

// The step slides in from the side the user is moving towards (custom: 1 forward, -1 back).
const stageVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 24 * direction, scale: 0.99 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: EASE, staggerChildren: 0.05, delayChildren: 0.04 } },
  exit: (direction: number) => ({ opacity: 0, x: -16 * direction, transition: { duration: 0.16, ease: "easeIn" } }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** Design Option 4 onboarding: icon stepper, friendly step card and the AI mentor panel. */
export function V4Onboarding({ companyOptions }: { companyOptions: string[] }) {
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
  const titleId = `v4-title-${step.id}`;

  function update(patch: Partial<OnboardingAnswers>) {
    setAnswers((a) => ({ ...a, ...patch }));
  }

  function goTo(next: number) {
    studioSound.play("nav");
    hasMoved.current = true;
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
  }

  function finish() {
    studioSound.play("confirm");
    setFinishing(true);
    setTimeout(() => router.push(answers.start === "placement" ? routes.placementTest : routes.dashboard), 900);
  }

  // After moving between steps, put focus on the new question (not on first load). The new step only
  // mounts once the old one has left, so this runs when its entrance starts.
  function focusQuestion(definition: unknown) {
    if (definition === "center" && hasMoved.current) document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  return (
    <div className="mx-auto grid w-full max-w-[1180px] flex-1 content-start gap-6 px-5 pt-4 pb-10 sm:px-8 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="min-w-0">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <Stepper stepIndex={stepIndex} />
        </motion.div>

        <MentorTip stepId={step.id} className="mt-6 lg:hidden" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }} className="mt-6">
          <Card className="p-6 sm:p-7">
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
                  <motion.div variants={stepChild}>
                    <Tag tone="purple" mono>
                      {`step ${String(stepIndex + 1).padStart(2, "0")}`}
                      <span className="text-(--v4-muted)">{"//"}</span>
                      {step.label.toLowerCase()}
                    </Tag>
                  </motion.div>
                  <motion.h1
                    id={titleId}
                    tabIndex={-1}
                    variants={stepChild}
                    className="mt-3 text-[1.75rem] leading-tight font-extrabold tracking-tight outline-none sm:text-[2rem]"
                  >
                    {copy.title}
                  </motion.h1>
                  <motion.p variants={stepChild} className="mt-2 text-(--v4-muted)">
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

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-(--v4-line) pt-6">
              <SoftButton onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0 || finishing}>
                <ArrowLeft /> Back
              </SoftButton>
              {isLast ? (
                <GradientButton onClick={finish} disabled={finishing}>
                  {finishing && <LoaderCircle className="animate-spin" />}
                  {answers.start === "placement" ? "Start the placement test" : "Go to my dashboard"}
                </GradientButton>
              ) : (
                <GradientButton onClick={() => goTo(stepIndex + 1)} disabled={!canContinue(step.id, answers)}>
                  Continue <ArrowRight />
                </GradientButton>
              )}
            </div>
          </Card>
        </motion.div>
        <p className="mt-4 text-center text-xs font-medium text-(--v4-muted)">You can change these answers any time in Settings.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        className="hidden lg:block"
      >
        <AssistantPanel stepId={step.id} answers={answers} className="sticky top-6" />
      </motion.div>
    </div>
  );
}
