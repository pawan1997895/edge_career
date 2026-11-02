"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, SALARY_LABELS } from "@/types/user";
import { ONBOARDING_STEPS, canContinue, type OnboardingAnswers } from "@/features/onboarding/steps";
import { neonSound } from "../sound";
import { AnimatedHeight, Card, DataStream, EASE, GhostButton, NeonButton, NeonEditor, type CodeLine } from "../ui";
import { useReducedMotion } from "../use-reduced-motion";
import styles from "../neon.module.css";
import { AiFeedback, type Feedback } from "./ai-feedback";
import { PERSONA_SHORT, STEP_COPY } from "./copy";
import { Progress } from "./progress";
import { CompaniesStep, LevelStep, PersonaStep, SalaryStep, StartStep, SummaryStep, stepChild } from "./steps";

const stageVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 22 * direction, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: EASE, staggerChildren: 0.05, delayChildren: 0.04 } },
  exit: (direction: number) => ({ opacity: 0, x: -14 * direction, transition: { duration: 0.16, ease: "easeIn" } }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Faint background code (wide screens only). ASCII, short lines.
const BACKDROP_CODE: CodeLine[][] = [
  [
    [["kw", "const "], ["prop", "path"], ["punc", " = "], ["fn", "ai.plan"], ["punc", "();"]],
    [["fn", "path.add"], ["punc", "("], ["str", '"dsa"'], ["punc", ");"]],
    [["fn", "path.add"], ["punc", "("], ["str", '"system-design"'], ["punc", ");"]],
    [["kw", "await "], ["fn", "path.save"], ["punc", "();"]],
  ],
  [
    [["kw", "for "], ["punc", "("], ["kw", "const "], ["prop", "s"], ["kw", " of "], ["prop", "steps"], ["punc", ")"]],
    [["fn", "  s.check"], ["punc", "();"]],
    [["com", "// onboarding in progress"]],
    [["fn", "ai.ready"], ["punc", "();"]],
  ],
];

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      <div className="absolute right-6 bottom-8 w-[270px] opacity-45">
        <NeonEditor file="path.ts" scripts={BACKDROP_CODE} hold={4000} />
      </div>
      <span className="absolute top-24 left-6 flex h-72 gap-2 opacity-60">
        <DataStream digits="1011001101001011" className="h-full text-(--v5-emerald)/70" dur={10} />
        <DataStream digits="0100110010110100" className="h-full" dur={13} delay={4} />
      </span>
      {[
        { text: "{}", left: "7%", top: "68%", dur: 7 },
        { text: "=>", left: "88%", top: "18%", dur: 6.5 },
      ].map((s, i) => (
        <span
          key={s.text}
          className={cn(styles.mono, styles.float, "absolute text-lg font-bold text-(--v5-emerald)/40")}
          style={{ left: s.left, top: s.top, "--dur": `${s.dur}s`, "--delay": `${-i * 2}s` } as React.CSSProperties}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}

/** Design Option 5 onboarding: neon progress, a clean step card with AI feedback, and a faint coding backdrop. */
export function V5Onboarding({ companyOptions }: { companyOptions: string[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [answers, setAnswers] = React.useState<OnboardingAnswers>({ companies: [] });
  const [finishing, setFinishing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);
  const nextFeedbackId = React.useRef(1);
  const hasMoved = React.useRef(false);

  const step = ONBOARDING_STEPS[stepIndex]!;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const copy = STEP_COPY[step.id];
  const titleId = `v5-title-${step.id}`;

  // The "got it" note fades after a moment.
  React.useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2600);
    return () => clearTimeout(timer);
  }, [feedback]);

  function update(patch: Partial<OnboardingAnswers>, note: string) {
    setAnswers((a) => ({ ...a, ...patch }));
    setFeedback({ id: nextFeedbackId.current++, text: note });
  }

  function setCompanies(companies: string[]) {
    const added = companies.find((c) => !answers.companies.includes(c));
    const removed = answers.companies.find((c) => !companies.includes(c));
    update({ companies }, added ? `Target locked: ${added}` : `Removed: ${removed}`);
  }

  function goTo(next: number) {
    neonSound.play("nav");
    hasMoved.current = true;
    setFeedback(null);
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
  }

  function finish() {
    neonSound.play("confirm");
    setFinishing(true);
    setTimeout(() => router.push(answers.start === "placement" ? routes.placementTest : routes.dashboard), 900);
  }

  // After moving between steps, put focus on the new question (not on first load). The new step only
  // mounts once the old one has left, so this runs when its entrance starts.
  function focusQuestion(definition: unknown) {
    if (definition === "center" && hasMoved.current) document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <Backdrop />
      <div className="relative mx-auto w-full max-w-[780px] px-5 pt-3 pb-10 sm:px-8 sm:pt-5">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <Progress stepIndex={stepIndex} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }} className="mt-6">
          <Card neon innerClassName="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <span aria-hidden className={cn(styles.mono, "shrink-0 rounded-full bg-(--v5-emerald)/10 px-2.5 py-1 text-xs font-semibold text-(--v5-emerald)")}>
                {`// ${String(stepIndex + 1).padStart(2, "0")} ${step.label.toLowerCase()}`}
              </span>
              <AiFeedback feedback={feedback} />
            </div>

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
                  <motion.h1
                    id={titleId}
                    tabIndex={-1}
                    variants={stepChild}
                    className="mt-3 text-[1.75rem] leading-tight font-bold tracking-tight outline-none sm:text-[2rem]"
                  >
                    {copy.title}
                  </motion.h1>
                  <motion.p variants={stepChild} className="mt-2 text-white/60">
                    {copy.description}
                  </motion.p>

                  <div className="mt-6">
                    {step.id === "persona" && (
                      <PersonaStep
                        value={answers.persona}
                        labelledBy={titleId}
                        onChange={(persona) => update({ persona }, `Got it: ${PERSONA_SHORT[persona]}`)}
                      />
                    )}
                    {step.id === "level" && (
                      <LevelStep value={answers.level} labelledBy={titleId} onChange={(level) => update({ level }, `Calibrated: ${LEVEL_LABELS[level]}`)} />
                    )}
                    {step.id === "companies" && <CompaniesStep options={companyOptions} value={answers.companies} onChange={setCompanies} />}
                    {step.id === "salary" && (
                      <SalaryStep value={answers.salary} labelledBy={titleId} onChange={(salary) => update({ salary }, `Target set: ${SALARY_LABELS[salary]}`)} />
                    )}
                    {step.id === "start" && (
                      <StartStep
                        value={answers.start}
                        labelledBy={titleId}
                        onChange={(start) => update({ start }, `Route: ${start === "placement" ? "Placement test" : "Module 1"}`)}
                      />
                    )}
                    {step.id === "summary" && <SummaryStep answers={answers} />}
                  </div>
                </motion.section>
              </AnimatePresence>
            </AnimatedHeight>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-(--v5-line) pt-6">
              <GhostButton onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0 || finishing}>
                <ArrowLeft /> Back
              </GhostButton>
              {isLast ? (
                <NeonButton onClick={finish} disabled={finishing}>
                  {finishing && <LoaderCircle className="animate-spin" />}
                  {answers.start === "placement" ? "Start the placement test" : "Go to my dashboard"}
                </NeonButton>
              ) : (
                <NeonButton onClick={() => goTo(stepIndex + 1)} disabled={!canContinue(step.id, answers)}>
                  Continue <ArrowRight />
                </NeonButton>
              )}
            </div>
          </Card>
        </motion.div>
        <p className="mt-4 text-center text-xs font-medium text-white/45">You can change these answers any time in Settings.</p>
      </div>
    </div>
  );
}
