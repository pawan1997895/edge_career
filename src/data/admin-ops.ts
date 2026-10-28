// Data access for the admin console's operations and people pages.
// Replace the mock returns with API calls later.

import { modules } from "@/mocks/curriculum";
import {
  ACCENT_GROUPS,
  INJECTIONS_THIS_MONTH,
  POOL_REPEAT_TARGET,
  activeInterviews,
  adminUsers,
  aiDailyCost,
  aiFeatures,
  budgetAlerts,
  bullQueues,
  companyBars,
  deploys,
  examIntegrity,
  injectionAttempts,
  interviewCosts,
  interviewLatency,
  interviewOutcomes,
  interviewTotals,
  planMinutes,
  promptVersions,
  questionPools,
  salaryBars,
  sandboxPolicy,
  sentryIssues,
  services,
  similarityMatches,
  sttVendors,
  userDetailOverrides,
  workerPools,
  judgeQueue,
} from "@/mocks/admin-ops";
import type {
  AdminUserDetail,
  AdminUserModule,
  AdminUserRow,
  AiUsageReport,
  ExamAttemptIntegrity,
  InterviewOpsReport,
  QuestionPoolCoverage,
  ReadinessCalibration,
  SimilarityMatch,
  SystemHealth,
} from "@/types/admin-ops";

export async function getSimilarityMatches(): Promise<SimilarityMatch[]> {
  return similarityMatches;
}

export async function getExamIntegrity(): Promise<ExamAttemptIntegrity[]> {
  return examIntegrity;
}

/** Question pools plus the repeat-rate target (share of questions seen again on a retake). */
export async function getQuestionPools(): Promise<{ pools: QuestionPoolCoverage[]; repeatTarget: number }> {
  return { pools: questionPools, repeatTarget: POOL_REPEAT_TARGET };
}

export async function getAiUsage(): Promise<AiUsageReport & { injectionsThisMonth: number }> {
  return {
    periodLabel: "1–27 Oct 2026",
    monthlyBudgetUsd: 18000,
    monthToDateUsd: aiFeatures.reduce((sum, f) => sum + f.costUsd, 0),
    features: aiFeatures,
    daily: aiDailyCost,
    prompts: promptVersions,
    injections: injectionAttempts,
    alerts: budgetAlerts,
    injectionsThisMonth: INJECTIONS_THIS_MONTH,
  };
}

export async function getInterviewOps(): Promise<InterviewOpsReport> {
  return {
    ...interviewTotals,
    plans: planMinutes,
    costs: interviewCosts,
    latency: interviewLatency,
    accentGroups: ACCENT_GROUPS,
    vendors: sttVendors,
    active: activeInterviews,
  };
}

export async function getReadinessCalibration(): Promise<ReadinessCalibration> {
  return { bars: companyBars, salaryBars, outcomes: interviewOutcomes };
}

export async function getSystemHealth(): Promise<SystemHealth> {
  return {
    services,
    queue: judgeQueue,
    workers: workerPools,
    sandbox: sandboxPolicy,
    queues: bullQueues,
    sentry: sentryIssues,
    deploys,
  };
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  return adminUsers;
}

export async function getAdminUser(userId: string): Promise<AdminUserDetail | undefined> {
  const row = adminUsers.find((u) => u.id === userId);
  if (!row) return undefined;
  return { ...generatedDetail(row), ...userDetailOverrides[userId] };
}

/* ---------- Generated mock detail for users without hand-written data ---------- */

const CORE_MODULES = modules.filter((m) => m.trackId === "core");
const COMPANIES = ["Google", "Amazon", "Microsoft", "Atlassian", "Uber", "Flipkart", "Razorpay", "Swiggy", "PhonePe"];
const PLAN_PRICE = { free: 0, pro: 1499, pro_plus: 2999 } as const;
const PLAN_NAME = { free: "Free", pro: "Pro", pro_plus: "Pro Plus" } as const;

function seed(id: string) {
  return [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function moduleProgress(row: AdminUserRow): AdminUserModule[] {
  if (row.id === "u_1042") {
    // The demo learner's real state from the curriculum mock.
    return CORE_MODULES.map((m) => ({
      moduleId: m.id,
      number: m.number,
      title: m.title,
      status: m.status,
      progress: m.progress,
      checkpointBest: m.checkpoint.bestScore,
      checkpointAttempts: m.checkpoint.attempts,
    }));
  }
  if (!row.currentModuleId) return [];
  const currentIndex = CORE_MODULES.findIndex((m) => m.id === row.currentModuleId);
  const s = seed(row.id);
  return CORE_MODULES.map((m, i) => {
    if (i < currentIndex) {
      return { moduleId: m.id, number: m.number, title: m.title, status: "passed", progress: 100, checkpointBest: 85 + ((s + i * 3) % 9), checkpointAttempts: 1 + ((s + i) % 2) };
    }
    if (i === currentIndex) {
      return { moduleId: m.id, number: m.number, title: m.title, status: row.progress > 0 ? "in_progress" : "unlocked", progress: row.progress, checkpointAttempts: 0 };
    }
    return { moduleId: m.id, number: m.number, title: m.title, status: "locked", progress: 0, checkpointAttempts: 0 };
  });
}

function generatedDetail(row: AdminUserRow): AdminUserDetail {
  const s = seed(row.id);
  const staff = row.role !== "learner";
  const billing: AdminUserDetail["billing"] =
    row.plan === "free"
      ? []
      : [10, 9, 8].map((month, i) => {
          return {
            id: `inv-${s}${i}`,
            date: `2026-${String(month).padStart(2, "0")}-20T09:00:00+05:30`,
            description: `${PLAN_NAME[row.plan]} · monthly`,
            amountInr: PLAN_PRICE[row.plan],
            method: i % 2 === 0 ? "Razorpay · UPI" : "Razorpay · Card",
            status: i === 0 && row.flags.includes("payment_failed") ? "failed" : "paid",
          };
        });

  const integrity: AdminUserDetail["integrity"] = [
    ...similarityMatches
      .filter((m) => m.learnerA.id === row.id || m.learnerB.id === row.id)
      .map((m) => ({
        id: m.id,
        kind: "Code similarity",
        detail: `${m.similarity}% match on ${m.source}`,
        at: m.detectedAt,
        status: m.status,
      })),
    ...examIntegrity
      .filter((a) => a.learner.id === row.id && a.risk !== "low")
      .map((a) => ({
        id: a.id,
        kind: "Exam events",
        detail: `${a.pastes} pastes and ${a.tabSwitches} tab switches in ${a.exam}`,
        at: a.startedAt,
        status: "open" as const,
      })),
  ];

  return {
    ...row,
    persona: staff ? "senior_engineer" : (["student", "career_switcher", "working_engineer"] as const)[s % 3],
    level: staff ? "sde3" : (["beginner", "sde1", "sde2"] as const)[s % 3],
    targetCompanies: staff ? [] : [COMPANIES[s % COMPANIES.length]!, COMPANIES[(s + 4) % COMPANIES.length]!],
    targetSalary: (["10-20", "20-35", "35-50"] as const)[s % 3],
    joinedAt: `2026-0${5 + (s % 4)}-1${s % 9}T10:00:00+05:30`,
    githubUsername: s % 2 === 0 ? row.email.split("@")[0]!.replace(".", "-") : undefined,
    modules: moduleProgress(row),
    billing,
    submissions: staff
      ? []
      : [
          { id: `sub-${s}1`, title: "Merge intervals", kind: "code", score: 70 + (s % 25), result: "Accepted", at: "2026-10-26T19:20:00+05:30" },
          { id: `sub-${s}2`, title: "Second highest salary", kind: "sql", score: 60 + (s % 30), result: s % 3 === 0 ? "Wrong answer" : "Accepted", at: "2026-10-24T21:05:00+05:30" },
          { id: `sub-${s}3`, title: "Valid parentheses", kind: "code", score: 100, result: "Accepted", at: "2026-10-21T08:40:00+05:30" },
        ],
    interviews:
      row.minutesUsed === 0
        ? []
        : [
            { id: `iv-${s}1`, type: "DSA", mode: "voice", minutes: Math.min(45, row.minutesUsed), score: 2.8 + (s % 10) / 10, at: "2026-10-25T20:00:00+05:30" },
            ...(row.minutesUsed > 45
              ? [{ id: `iv-${s}2`, type: "Behavioral", mode: "text" as const, minutes: Math.min(30, row.minutesUsed - 45), score: 3.1, at: "2026-10-17T18:30:00+05:30" }]
              : []),
          ],
    integrity,
  };
}
