// Data access for the mock interview studio. Replace the mock returns with API calls later.

import { getCurrentUser } from "@/data/user";
import { interviewHistory, interviewQuotaMeta, liveSessions, scorecards } from "@/mocks/interviews";
import { TARGET_COMPANY_OPTIONS } from "@/mocks/user";
import type { InterviewQuota, InterviewSummary, LiveSession, Scorecard } from "@/types/interviews";

export async function getInterviewHistory(): Promise<InterviewSummary[]> {
  return interviewHistory;
}

export async function getScorecard(sessionId: string): Promise<Scorecard | undefined> {
  return scorecards.find((s) => s.id === sessionId);
}

export async function getLiveSession(sessionId: string): Promise<LiveSession | undefined> {
  return liveSessions.find((s) => s.id === sessionId);
}

/** Companies the interviewer can tailor questions to. */
export async function getCompanyFocusOptions(): Promise<string[]> {
  return TARGET_COMPANY_OPTIONS;
}

/** Interview minutes are capped per pricing plan and reset each billing cycle. */
export async function getInterviewQuota(): Promise<InterviewQuota> {
  const user = await getCurrentUser();
  return {
    plan: user.plan,
    minutesLeft: user.interviewMinutesLeft,
    minutesTotal: user.interviewMinutesTotal,
    ...interviewQuotaMeta,
  };
}
