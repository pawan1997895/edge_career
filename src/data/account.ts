// Data access for connected accounts, preferences and profile stats. Replace the mock returns with API calls later.

import { getModules } from "@/data/curriculum";
import { getProblems } from "@/data/problems";
import { INTERVIEW_VOICES, connectedAccounts, learningPreferences, notificationSettings, profileStats } from "@/mocks/account";
import { TARGET_COMPANY_OPTIONS } from "@/mocks/user";
import type { ConnectedAccount, LearningPreferences, NotificationSetting, ProfileStats } from "@/types/account";

/** Companies offered as targets during onboarding and in the profile editor. */
export async function getTargetCompanyOptions(): Promise<string[]> {
  return TARGET_COMPANY_OPTIONS;
}

export async function getConnectedAccounts(): Promise<ConnectedAccount[]> {
  return connectedAccounts;
}

export async function getLearningPreferences(): Promise<LearningPreferences> {
  return learningPreferences;
}

export async function getNotificationSettings(): Promise<NotificationSetting[]> {
  return notificationSettings;
}

export async function getInterviewVoices(): Promise<{ value: string; label: string }[]> {
  return INTERVIEW_VOICES;
}

export async function getProfileStats(): Promise<ProfileStats> {
  const [modules, problems] = await Promise.all([getModules(), getProblems()]);
  const core = modules.filter((m) => m.trackId === "core");
  return {
    modulesCompleted: core.filter((m) => m.status === "passed" || m.status === "tested_out").length,
    modulesTotal: core.length,
    problemsSolved: problems.filter((p) => p.progress === "solved").length,
    ...profileStats,
  };
}
