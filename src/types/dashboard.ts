// Aggregated data for the learner dashboard (one API call in the real app).

export interface ContinueLearning {
  lessonId: string;
  title: string;
  moduleLabel: string;
  atSec: number;
  durationSec: number;
}

export interface NextUnlock {
  examId: string;
  moduleId: string;
  nextModuleId: string;
  lastScore: number;
  passScore: number;
}

export interface LatestInterview {
  sessionId: string;
  title: string;
  mode: string;
  score: number;
  outOf: number;
  at: string;
  highlight: string;
}

export interface PendingItem {
  id: string;
  title: string;
  detail: string;
  status: string;
  href: string;
}

export type ActivityKind = "submission" | "lesson" | "design" | "interview" | "exam";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  at: string;
  href: string;
  tone: "success" | "warning" | "destructive" | "info" | "muted";
}

export interface DashboardSummary {
  continueLearning: ContinueLearning;
  nextUnlock: NextUnlock;
  latestInterview: LatestInterview;
  pendingItems: PendingItem[];
  recentActivity: ActivityEntry[];
  /** Why adaptive selection picked each recommended problem. */
  recommendationReasons: Record<string, string>;
  weeklyGoal: { hoursDone: number; hoursTarget: number };
  problemsSolved: number;
}
