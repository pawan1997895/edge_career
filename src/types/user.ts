// The signed-in user and their onboarding choices.

export type Persona = "student" | "career_switcher" | "working_engineer" | "senior_engineer";
export type Level = "beginner" | "sde1" | "sde2" | "sde3";
/** Target salary band in lakhs per annum (LPA). */
export type SalaryBand = "10-20" | "20-35" | "35-50" | "50+";
export type PlanId = "free" | "pro" | "pro_plus";
export type Role = "learner" | "reviewer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  persona: Persona;
  level: Level;
  targetCompanies: string[];
  targetSalary: SalaryBand;
  plan: PlanId;
  githubUsername?: string;
  location: string;
  joinedAt: string;
  streakDays: number;
  /** Interview minutes left in the current billing cycle. */
  interviewMinutesLeft: number;
  interviewMinutesTotal: number;
}

export const PERSONA_LABELS: Record<Persona, string> = {
  student: "Student or recent graduate",
  career_switcher: "Switching into software engineering",
  working_engineer: "Working engineer aiming higher",
  senior_engineer: "Senior engineer preparing for staff roles",
};

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "Beginner",
  sde1: "SDE 1",
  sde2: "SDE 2",
  sde3: "SDE 3 / Senior",
};

export const SALARY_LABELS: Record<SalaryBand, string> = {
  "10-20": "₹10–20 LPA",
  "20-35": "₹20–35 LPA",
  "35-50": "₹35–50 LPA",
  "50+": "₹50 LPA+",
};

export const PLAN_LABELS: Record<PlanId, string> = {
  free: "Free",
  pro: "Pro",
  pro_plus: "Pro Plus",
};
