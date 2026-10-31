import type { OnboardingStepId } from "@/features/onboarding/steps";

// The questions are the same as the real onboarding (src/features/onboarding/components/onboarding-wizard.tsx);
// only the code names and "file" names are new to this design.

export const STEP_COPY: Record<OnboardingStepId, { title: string; description: string }> = {
  persona: { title: "Which of these describes you best?", description: "This shapes the examples and pace we suggest." },
  level: { title: "What’s your current level?", description: "Pick the role closest to your experience today." },
  companies: { title: "Where do you want to work?", description: "Choose up to three companies. We’ll show readiness for each." },
  salary: { title: "What salary are you aiming for?", description: "Used for your salary readiness estimate on the dashboard." },
  start: { title: "Where would you like to start?", description: "Experienced engineers usually save weeks with the placement test." },
  summary: { title: "You’re all set", description: "Here’s what we’ll use to build your learning path." },
};

export const STEP_CODES: Record<OnboardingStepId, string> = {
  persona: "Identity",
  level: "Calibration",
  companies: "Targets",
  salary: "Compensation",
  start: "Launch vector",
  summary: "Compile",
};

export const STEP_FILES: Record<OnboardingStepId, string> = {
  persona: "profile/identity.ts",
  level: "profile/level.ts",
  companies: "targets/companies.ts",
  salary: "targets/salary.ts",
  start: "path/launch.ts",
  summary: "path/compile.ts",
};

export const SALARY_RANGES: Record<string, readonly [number, number | null]> = {
  "10-20": [10, 20],
  "20-35": [20, 35],
  "35-50": [35, 50],
  "50+": [50, null],
};
