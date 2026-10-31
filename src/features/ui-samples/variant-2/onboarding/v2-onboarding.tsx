"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ai-theme/use-prefers-reduced-motion";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS, canContinue, type OnboardingAnswers } from "@/features/onboarding/steps";
import { commandSound } from "../sound";
import { CommandButton, EASE, GhostButton, HudPanel } from "../ui";
import styles from "../command.module.css";
import { AnalysisPanel, type LogEntry } from "./analysis-panel";
import { STEP_CODES, STEP_COPY, STEP_FILES } from "./copy";
import { CompileStep, StartStep } from "./launch-steps";
import { MissionRail, MobileProgress } from "./mission-rail";
import { stepChild } from "./parts";
import { LevelStep, PersonaStep } from "./profile-steps";
import { CompaniesStep, SalaryStep } from "./target-steps";

// The step container reveals from the side the user is moving towards (custom: 1 forward, -1 back).
const stageVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: 18 * direction,
    clipPath: direction > 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
  }),
  center: {
    opacity: 1,
    x: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.05, delayChildren: 0.08 },
    transitionEnd: { clipPath: "none" },
  },
  exit: (direction: number) => ({ opacity: 0, x: -14 * direction, transition: { duration: 0.16, ease: "easeIn" } }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.02 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const timeNow = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

/** A bright line that sweeps across the stage when a step changes. */
function Wipe({ direction }: { direction: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <motion.span
        initial={{ left: direction > 0 ? "-6%" : "106%" }}
        animate={{ left: direction > 0 ? "106%" : "-6%" }}
        transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1] }}
        className="absolute inset-y-0 w-px bg-(--v2-mint) shadow-[0_0_26px_7px_color-mix(in_oklch,var(--v2-mint)_40%,transparent)]"
      />
    </span>
  );
}

/** Design Option 2 onboarding: mission rail, a stage with a distinct layout per step, and live AI analysis. */
export function V2Onboarding({ companyOptions, modules }: { companyOptions: string[]; modules: string[] }) {
  const router = useRouter();
  const reduceMotion = usePrefersReducedMotion();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [answers, setAnswers] = React.useState<OnboardingAnswers>({ companies: [] });
  const [finishing, setFinishing] = React.useState(false);
  const [log, setLog] = React.useState<LogEntry[]>([{ id: 0, time: "--:--:--", text: "mission.config loaded" }]);
  const nextLogId = React.useRef(1);
  const hasMoved = React.useRef(false);

  const step = ONBOARDING_STEPS[stepIndex]!;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const copy = STEP_COPY[step.id];
  const titleId = `v2-title-${step.id}`;
  const ready = canContinue(step.id, answers);

  function addLog(text: string) {
    const entry = { id: nextLogId.current++, time: timeNow(), text };
    setLog((entries) => [...entries.slice(-4), entry]);
  }

  function update(patch: Partial<OnboardingAnswers>, text: string) {
    setAnswers((a) => ({ ...a, ...patch }));
    addLog(text);
  }

  function goTo(next: number) {
    commandSound.play("nav");
    hasMoved.current = true;
    setDirection(next > stepIndex ? 1 : -1);
    setStepIndex(next);
    addLog(`open ${STEP_FILES[ONBOARDING_STEPS[next]!.id]}`);
  }

  function finish() {
    commandSound.play("confirm");
    setFinishing(true);
    addLog(`deploy -> ${answers.start === "placement" ? "placement test" : "dashboard"}`);
    setTimeout(() => router.push(answers.start === "placement" ? routes.placementTest : routes.dashboard), 900);
  }

  function setCompanies(companies: string[]) {
    const added = companies.find((c) => !answers.companies.includes(c));
    const removed = answers.companies.find((c) => !companies.includes(c));
    update({ companies }, added ? `target locked -> ${added}` : `target released -> ${removed}`);
  }

  // After moving between steps, put focus on the new question (not on first load). The new step only
  // mounts once the old one has left, so this runs when its entrance starts.
  function focusQuestion(definition: unknown) {
    if (definition === "center" && hasMoved.current) document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  return (
    <div className="relative mx-auto grid w-full max-w-[1360px] flex-1 content-center items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={stepIndex}
          aria-hidden
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={cn(styles.giant, "pointer-events-none absolute right-0 bottom-0 hidden text-[18rem] lg:block")}
        >
          {String(stepIndex + 1).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>

      <MobileProgress stepIndex={stepIndex} className="lg:hidden" />

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        className="hidden lg:block"
      >
        <MissionRail stepIndex={stepIndex} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="min-w-0"
      >
        <HudPanel
          focus
          index={String(stepIndex + 1).padStart(2, "0")}
          title={`~/onboarding/${STEP_FILES[step.id]}`}
          status={ready ? "locked" : "awaiting input"}
          bodyClassName="relative p-5 sm:p-7"
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={reduceMotion ? fadeVariants : stageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              onAnimationStart={focusQuestion}
            >
              <motion.p variants={stepChild} className="font-mono text-[11px] tracking-[0.2em] text-(--v2-mint) uppercase">
                Step {String(stepIndex + 1).padStart(2, "0")} / {String(ONBOARDING_STEPS.length).padStart(2, "0")} · {STEP_CODES[step.id]}
              </motion.p>
              <motion.h1
                id={titleId}
                tabIndex={-1}
                variants={stepChild}
                className={cn(styles.display, "mt-2 text-[1.7rem] leading-tight font-semibold tracking-tight outline-none sm:text-[2rem]")}
              >
                {copy.title}
              </motion.h1>
              <motion.p variants={stepChild} className="mt-1.5 text-sm text-muted-foreground">
                {copy.description}
              </motion.p>

              <div className="mt-6">
                {/* Log text is ASCII: typed lines are sized in `ch`, which only fits the mono font's own glyphs. */}
                {step.id === "persona" && (
                  <PersonaStep value={answers.persona} labelledBy={titleId} onChange={(persona) => update({ persona }, `persona -> ${persona}`)} />
                )}
                {step.id === "level" && <LevelStep value={answers.level} labelledBy={titleId} onChange={(level) => update({ level }, `level -> ${level}`)} />}
                {step.id === "companies" && <CompaniesStep options={companyOptions} value={answers.companies} onChange={setCompanies} />}
                {step.id === "salary" && (
                  <SalaryStep value={answers.salary} labelledBy={titleId} onChange={(salary) => update({ salary }, `salary -> ${salary}`)} />
                )}
                {step.id === "start" && (
                  <StartStep value={answers.start} labelledBy={titleId} modules={modules} onChange={(start) => update({ start }, `start -> ${start}`)} />
                )}
                {step.id === "summary" && <CompileStep answers={answers} />}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-(--v2-line) pt-5">
            <GhostButton onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0 || finishing}>
              <ArrowLeft /> Back
            </GhostButton>
            <span aria-hidden className="hidden font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase md:block">
              {isLast ? "Path compiled" : ready ? "● Input locked" : "Awaiting input"}
            </span>
            {isLast ? (
              <CommandButton onClick={finish} disabled={finishing}>
                {finishing && <LoaderCircle className="animate-spin" />}
                {answers.start === "placement" ? "Start the placement test" : "Go to my dashboard"}
              </CommandButton>
            ) : (
              <CommandButton onClick={() => goTo(stepIndex + 1)} disabled={!ready}>
                Continue <ArrowRight />
              </CommandButton>
            )}
          </div>

          {!reduceMotion && <Wipe key={step.id} direction={direction} />}
        </HudPanel>
        <p className="mt-4 text-center font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
          You can change these answers any time in Settings.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
        className="hidden xl:block"
      >
        <AnalysisPanel answers={answers} log={log} />
      </motion.div>
    </div>
  );
}
