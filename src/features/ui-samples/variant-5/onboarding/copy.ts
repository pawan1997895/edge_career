import type { Persona } from "@/types/user";
import type { OnboardingStepId } from "@/features/onboarding/steps";
import type { ChipTone } from "../ui";

// Same questions as the real onboarding (src/features/onboarding/components/onboarding-wizard.tsx).
export const STEP_COPY: Record<OnboardingStepId, { title: string; description: string }> = {
  persona: { title: "Which of these describes you best?", description: "This shapes the examples and pace we suggest." },
  level: { title: "What’s your current level?", description: "Pick the role closest to your experience today." },
  companies: { title: "Where do you want to work?", description: "Choose up to three companies. We’ll show readiness for each." },
  salary: { title: "What salary are you aiming for?", description: "Used for your salary readiness estimate on the dashboard." },
  start: { title: "Where would you like to start?", description: "Experienced engineers usually save weeks with the placement test." },
  summary: { title: "You’re all set", description: "Here’s what we’ll use to build your learning path." },
};

/** Short names for the AI's "Got it" feedback. */
export const PERSONA_SHORT: Record<Persona, string> = {
  student: "Student",
  career_switcher: "Career switcher",
  working_engineer: "Working engineer",
  senior_engineer: "Senior engineer",
};

/** One tag per core module area; they light up as onboarding steps are completed. */
export const STACK: { label: string; tone: ChipTone }[] = [
  { label: "Python", tone: "lime" },
  { label: "DSA", tone: "emerald" },
  { label: "SQL", tone: "cyan" },
  { label: "System design", tone: "violet" },
  { label: "Git & CI", tone: "emerald" },
  { label: "LLMs", tone: "cyan" },
];
