// Connected sign-in providers and learner preferences.

import type { CodeLanguage } from "@/types/practice";

export type Provider = "google" | "github";

export interface ConnectedAccount {
  provider: Provider;
  connected: boolean;
  /** Email for Google, username for GitHub. */
  handle?: string;
  connectedAt?: string;
}

export interface LearningPreferences {
  defaultLanguage: CodeLanguage;
  editorFontSize: number;
  editorTheme: "match" | "light" | "dark";
  dailyGoalHours: number;
  interviewVoice: string;
  speechPace: "slower" | "normal" | "faster";
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

export interface ProfileStats {
  modulesCompleted: number;
  modulesTotal: number;
  problemsSolved: number;
  mockInterviews: number;
  hoursThisMonth: number;
}
