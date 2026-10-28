// Skill mastery, readiness estimates and reported interview outcomes.

import type { SalaryBand } from "@/types/user";

export type SkillCategory = "Foundations" | "DSA" | "Databases" | "System design" | "Behavioral";

export const SKILL_CATEGORIES: SkillCategory[] = ["Foundations", "DSA", "Databases", "System design", "Behavioral"];

export interface SkillMastery {
  skill: string;
  category: SkillCategory;
  /** Recency-weighted mastery, 0–100. */
  mastery: number;
  /** Change over the last 4 weeks, in points. */
  delta: number;
  lastPracticed: string;
  /** Mastery at the end of each of the last 12 weeks, oldest first. null = not yet practised. */
  weekly: (number | null)[];
  practice: { label: string; href: string };
}

export interface ReadinessGap {
  skill: string;
  current: number;
  needed: number;
  href: string;
}

export interface CompanyReadiness {
  company: string;
  level: string;
  /** Estimated readiness, 0–100. */
  score: number;
  /** Expert-set bar for this company and level. */
  target: number;
  isTarget: boolean;
  focus: string;
  gaps: ReadinessGap[];
}

export interface SalaryReadiness {
  band: SalaryBand;
  score: number;
  target: number;
  isTarget: boolean;
}

export type OutcomeResult = "offer" | "rejected" | "awaiting" | "withdrew";

export interface InterviewOutcome {
  id: string;
  company: string;
  roleLevel: string;
  roundReached: string;
  result: OutcomeResult;
  offerCtcLpa?: number;
  date: string;
}

export const OUTCOME_LABELS: Record<OutcomeResult, string> = {
  offer: "Offer",
  rejected: "Not selected",
  awaiting: "Awaiting result",
  withdrew: "Withdrew",
};

export const INTERVIEW_ROUNDS = [
  "Online assessment",
  "Recruiter screen",
  "Technical round 1",
  "Technical round 2",
  "System design round",
  "Hiring manager round",
  "Final / bar raiser",
];
