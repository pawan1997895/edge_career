"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  const [answers, setAnswers] = React.useState<OnboardingAnswers>({ companies: [] });
  const [finishing, setFinishing] = React.useState(false);

  const step = ONBOARDING_STEPS[stepIndex]!;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const copy = STEP_COPY[step.id];

  function update(patch: Partial<OnboardingAnswers>) {
    setAnswers((a) => ({ ...a, ...patch }));
  }

  function finish() {
    setFinishing(true);
    setTimeout(() => router.push(answers.start === "placement" ? routes.placementTest : routes.dashboard), 900);
  }

  return (
    <div className="w-full max-w-2xl">
      <ol className="mb-6 hidden grid-cols-6 gap-2 sm:grid" aria-label="Onboarding steps">
        {ONBOARDING_STEPS.map((s, i) => (
          <li key={s.id} className="space-y-1.5">
            <span className={cn("block h-1 rounded-full", i <= stepIndex ? "bg-primary" : "bg-muted")} />
            <span className={cn("block text-xs", i === stepIndex ? "font-medium text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>
      <div className="mb-5 sm:hidden">
        <p className="mb-2 text-xs text-muted-foreground">
          Step {stepIndex + 1} of {ONBOARDING_STEPS.length} · {step.label}
        </p>
        <Progress value={((stepIndex + 1) / ONBOARDING_STEPS.length) * 100} />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-xs sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.description}</p>

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

        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
          <Button variant="ghost" onClick={() => setStepIndex((i) => i - 1)} disabled={stepIndex === 0 || finishing}>
            <ArrowLeft /> Back
          </Button>
          {isLast ? (
            <Button onClick={finish} disabled={finishing}>
              {finishing && <LoaderCircle className="animate-spin" />}
              {answers.start === "placement" ? "Start the placement test" : "Go to my dashboard"}
            </Button>
          ) : (
            <Button onClick={() => setStepIndex((i) => i + 1)} disabled={!canContinue(step.id, answers)}>
              Continue <ArrowRight />
            </Button>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">You can change these answers any time in Settings.</p>
    </div>
  );
}
