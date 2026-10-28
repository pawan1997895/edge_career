import { routes } from "@/lib/routes";
import type { DashboardSummary } from "@/types/dashboard";

export const dashboardSummary: DashboardSummary = {
  continueLearning: {
    lessonId: "lesson-consistent-hashing",
    title: "Consistent hashing",
    moduleLabel: "Module 4 · System Design · HLD building blocks",
    atSec: 372,
    durationSec: 1320,
  },
  nextUnlock: {
    examId: "exam-system-design",
    moduleId: "system-design",
    nextModuleId: "production-engineering",
    lastScore: 78,
    passScore: 85,
  },
  latestInterview: {
    sessionId: "iv-2041",
    title: "DSA mock interview",
    mode: "Voice",
    score: 3.6,
    outOf: 5,
    at: "2026-10-26T21:00:00+05:30",
    highlight: "Communication improved since your last session. Complexity analysis was the weakest stage.",
  },
  pendingItems: [
    {
      id: "p1",
      title: "Design a news feed",
      detail: "The AI grader's confidence was low, so a human reviewer is checking it. Usually within 24 hours.",
      status: "In human review",
      href: routes.hld("hld-news-feed"),
    },
  ],
  recentActivity: [
    { id: "a1", kind: "lesson", title: "Consistent hashing", detail: "Watched to 6:12 of 22:00", at: "2026-10-27T17:40:00+05:30", href: routes.lesson("lesson-consistent-hashing", 372), tone: "info" },
    { id: "a2", kind: "design", title: "Design a news feed", detail: "Submitted · sent to human review", at: "2026-10-27T15:55:00+05:30", href: routes.hld("hld-news-feed"), tone: "warning" },
    { id: "a3", kind: "interview", title: "DSA mock interview", detail: "Scorecard 3.6 / 5", at: "2026-10-26T21:40:00+05:30", href: routes.interviewScorecard("iv-2041"), tone: "info" },
    { id: "a4", kind: "submission", title: "Sliding window maximum", detail: "Time limit exceeded on hidden test 31", at: "2026-10-26T22:40:00+05:30", href: routes.submissions, tone: "destructive" },
    { id: "a5", kind: "submission", title: "Median of two sorted arrays", detail: "Wrong answer · 38/46 tests", at: "2026-10-26T20:15:00+05:30", href: routes.submissions, tone: "destructive" },
    { id: "a6", kind: "exam", title: "Module 4 checkpoint", detail: "Scored 78% · pass bar is 85%", at: "2026-10-24T12:30:00+05:30", href: routes.examResult("exam-system-design"), tone: "warning" },
    { id: "a7", kind: "design", title: "Design a URL shortener", detail: "Passed · 88%", at: "2026-10-22T21:05:00+05:30", href: routes.hld("hld-url-shortener"), tone: "success" },
  ],
  recommendationReasons: {
    "trapping-rain-water": "Monotonic stack is one of your weaker DSA skills",
    "sliding-window-maximum": "Your last attempt timed out; retry with a deque",
    "median-of-two-sorted-arrays": "Binary search is your lowest DSA skill",
    "alien-dictionary": "Hard graph problem asked often at Atlassian and Uber",
    "consecutive-login-streaks": "Window functions are below your target for Uber",
  },
  weeklyGoal: { hoursDone: 6.5, hoursTarget: 9 },
  problemsSolved: 23,
};
