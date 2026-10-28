// Every URL in the app is built here, so links stay consistent and routes are easy to rename.

import type { LearningItem } from "@/types/curriculum";
import type { PlanId } from "@/types/user";

export const routes = {
  home: "/",
  pricing: "/pricing",
  signIn: "/sign-in",
  signUp: "/sign-up",
  verify: "/verify",
  onboarding: "/onboarding",

  dashboard: "/dashboard",
  learn: "/learn",
  module: (moduleId: string) => `/learn/modules/${moduleId}`,
  lesson: (lessonId: string, atSec?: number) => `/learn/lessons/${lessonId}${atSec !== undefined ? `?t=${atSec}` : ""}`,

  practice: "/practice",
  problem: (problemId: string) => `/practice/${problemId}`,
  submissions: "/submissions",
  submission: (submissionId: string) => `/submissions/${submissionId}`,

  assessments: "/assessments",
  placementTest: "/assessments/placement",
  exam: (examId: string) => `/assessments/${examId}`,
  examAttempt: (examId: string) => `/assessments/${examId}/attempt`,
  examResult: (examId: string) => `/assessments/${examId}/result`,

  doubts: "/doubts",
  doubtThread: (threadId: string) => `/doubts?thread=${threadId}`,
  /** "Ask about this moment" from the lesson player. */
  askAboutLesson: (lessonId: string, atSec: number) => `/doubts?lesson=${lessonId}&t=${Math.floor(atSec)}`,
  /** Opens a new doubt with the problem, current code and latest result as context. */
  askAboutProblem: (problemId: string) => `/doubts?problem=${problemId}`,

  systemDesign: "/system-design",
  hld: (designId: string) => `/system-design/hld/${designId}`,
  lld: (designId: string) => `/system-design/lld/${designId}`,

  interviews: "/interviews",
  interviewSetup: (type?: string) => `/interviews/new${type ? `?type=${type}` : ""}`,
  interviewRoom: (sessionId: string) => `/interviews/${sessionId}/live`,
  interviewScorecard: (sessionId: string) => `/interviews/${sessionId}`,

  progress: "/progress",
  readiness: "/readiness",

  projects: "/projects",
  project: (projectId: string) => `/projects/${projectId}`,
  notebooks: "/notebooks",
  notebook: (notebookId: string) => `/notebooks/${notebookId}`,

  profile: "/profile",
  settings: "/settings",
  billing: "/billing",
  checkout: (plan: PlanId) => `/billing/checkout?plan=${plan}`,

  screens: "/screens",
  designSystem: "/design-system",

  admin: {
    overview: "/admin",
    content: "/admin/content",
    problem: (problemId: string) => `/admin/content/problems/${problemId}`,
    lessons: "/admin/content/lessons",
    lessonScript: (lessonId: string) => `/admin/content/lessons/${lessonId}`,
    reviews: "/admin/reviews",
    review: (reviewId: string) => `/admin/reviews/${reviewId}`,
    grading: "/admin/grading",
    integrity: "/admin/integrity",
    aiUsage: "/admin/ai-usage",
    interviews: "/admin/interviews",
    readiness: "/admin/readiness",
    system: "/admin/system",
    users: "/admin/users",
    user: (userId: string) => `/admin/users/${userId}`,
  },
} as const;

/** Where a curriculum item opens, based on its kind and the prefix of its refId. */
export function itemHref(item: Pick<LearningItem, "kind" | "refId">): string {
  const { kind, refId } = item;
  if (kind === "lesson") return routes.lesson(refId);
  if (kind === "checkpoint") return routes.exam(refId);
  if (refId.startsWith("hld-")) return routes.hld(refId);
  if (refId.startsWith("lld-")) return routes.lld(refId);
  if (refId.startsWith("project-")) return routes.project(refId);
  if (refId.startsWith("nb-")) return routes.notebook(refId);
  if (refId.startsWith("interview-")) return routes.interviews;
  if (refId.startsWith("lesson-")) return routes.lesson(refId);
  return routes.problem(refId);
}
