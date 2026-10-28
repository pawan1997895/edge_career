import type { Level, Persona, SalaryBand } from "@/types/user";

export interface OnboardingAnswers {
  persona?: Persona;
  level?: Level;
  companies: string[];
  salary?: SalaryBand;
  start?: "placement" | "module1";
}

export const ONBOARDING_STEPS = [
  { id: "persona", label: "About you" },
  { id: "level", label: "Experience" },
  { id: "companies", label: "Target companies" },
  { id: "salary", label: "Target salary" },
  { id: "start", label: "Starting point" },
  { id: "summary", label: "Summary" },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];

export const MAX_COMPANIES = 3;

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  beginner: "Learning to code or in your first internship",
  sde1: "0–2 years as a software engineer",
  sde2: "2–5 years, owning features end to end",
  sde3: "5+ years, leading designs across teams",
};

export function canContinue(step: OnboardingStepId, answers: OnboardingAnswers) {
  switch (step) {
    case "persona":
      return Boolean(answers.persona);
    case "level":
      return Boolean(answers.level);
    case "companies":
      return answers.companies.length > 0;
    case "salary":
      return Boolean(answers.salary);
    case "start":
      return Boolean(answers.start);
    default:
      return true;
  }
}
