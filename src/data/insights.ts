// Data access for skill mastery, readiness estimates and reported outcomes.
// Replace the mock returns with API calls later.

import { companyReadiness, masteryWeeks, reportedOutcomes, salaryReadiness, skillMastery } from "@/mocks/insights";
import type { CompanyReadiness, InterviewOutcome, SalaryReadiness, SkillMastery } from "@/types/insights";

export async function getSkillMastery(): Promise<{ skills: SkillMastery[]; weeks: string[] }> {
  return { skills: skillMastery, weeks: masteryWeeks };
}

export async function getCompanyReadiness(): Promise<CompanyReadiness[]> {
  return companyReadiness;
}

export async function getSalaryReadiness(): Promise<SalaryReadiness[]> {
  return salaryReadiness;
}

export async function getReportedOutcomes(): Promise<InterviewOutcome[]> {
  return reportedOutcomes;
}
