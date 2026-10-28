import type { ConnectedAccount, LearningPreferences, NotificationSetting } from "@/types/account";

export const connectedAccounts: ConnectedAccount[] = [
  { provider: "google", connected: true, handle: "aarav.mehta@example.com", connectedAt: "2026-06-02T10:00:00+05:30" },
  { provider: "github", connected: true, handle: "aarav-codes", connectedAt: "2026-06-02T10:04:00+05:30" },
];

export const learningPreferences: LearningPreferences = {
  defaultLanguage: "java",
  editorFontSize: 14,
  editorTheme: "match",
  dailyGoalHours: 2,
  interviewVoice: "en-IN-female",
  speechPace: "normal",
};

export const INTERVIEW_VOICES = [
  { value: "en-IN-female", label: "Indian English · female" },
  { value: "en-IN-male", label: "Indian English · male" },
  { value: "en-US-female", label: "US English · female" },
  { value: "en-GB-male", label: "UK English · male" },
];

export const notificationSettings: NotificationSetting[] = [
  { id: "grades", label: "Grades and AI feedback", description: "When a submission, design or exam is graded.", email: false, inApp: true },
  { id: "reviews", label: "Human review results", description: "When a reviewer confirms or changes a score, or answers an appeal.", email: true, inApp: true },
  { id: "unlocks", label: "Module unlocks", description: "When a checkpoint becomes available or a new module unlocks.", email: true, inApp: true },
  { id: "interviews", label: "Interview reminders", description: "Scheduled mock interviews and new scorecards.", email: true, inApp: true },
  { id: "streak", label: "Daily goal reminders", description: "A nudge in the evening if you haven’t practised yet.", email: false, inApp: true },
  { id: "billing", label: "Billing", description: "Receipts, failed payments and renewal notices.", email: true, inApp: true },
  { id: "product", label: "Product updates", description: "New modules, electives and features.", email: false, inApp: false },
];

export const profileStats = {
  mockInterviews: 6,
  hoursThisMonth: 31,
};
