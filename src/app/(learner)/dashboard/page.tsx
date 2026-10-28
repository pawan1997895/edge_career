import type { Metadata } from "next";
import Link from "next/link";
import { CodeXml, Flame, Mic, Target } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { ContinueLearningCard } from "@/features/dashboard/components/continue-learning-card";
import { NextUnlockCard } from "@/features/dashboard/components/next-unlock-card";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { RecommendedProblemsCard } from "@/features/dashboard/components/recommended-problems-card";
import {
  LatestInterviewCard,
  MasterySnapshotCard,
  PendingReviewsCard,
  ReadinessSummaryCard,
} from "@/features/dashboard/components/side-cards";
import { TrackProgressCard } from "@/features/dashboard/components/track-progress-card";
import { getCoreModules, requiredItemCounts } from "@/data/curriculum";
import { getDashboardSummary } from "@/data/dashboard";
import { getCompanyReadiness, getSkillMastery } from "@/data/insights";
import { getRecommendedProblems } from "@/data/problems";
import { getCurrentUser } from "@/data/user";
import { DEMO_NOW } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Dashboard" };

function greeting(iso: string) {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date(iso)));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const [user, summary, core, recommended, { skills }, companies] = await Promise.all([
    getCurrentUser(),
    getDashboardSummary(),
    getCoreModules(),
    getRecommendedProblems(),
    getSkillMastery(),
    getCompanyReadiness(),
  ]);

  const current = core.find((m) => m.id === summary.nextUnlock.moduleId)!;
  const next = core.find((m) => m.id === summary.nextUnlock.nextModuleId);
  const bySkill = [...skills].sort((a, b) => b.mastery - a.mastery);
  const firstName = user.name.split(" ")[0];
  const { hoursDone, hoursTarget } = summary.weeklyGoal;

  return (
    <PageContainer wide>
      <PageHeader
        title={`${greeting(DEMO_NOW)}, ${firstName}`}
        description={`Module ${current.number} of 6 · ${current.title}. Your checkpoint retake is the next step to unlock ${next?.title ?? "the next module"}.`}
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.learn}>Open curriculum</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Learning streak" value={`${user.streakDays} days`} hint="Keep it going today" icon={Flame} />
        <StatCard
          label="This week"
          value={`${hoursDone} / ${hoursTarget} h`}
          hint={`${Math.round((hoursDone / hoursTarget) * 100)}% of weekly goal`}
          icon={Target}
        />
        <StatCard label="Problems solved" value={summary.problemsSolved} trend={{ value: "+4", positive: true }} hint="this week" icon={CodeXml} />
        <StatCard
          label="Interview minutes"
          value={`${user.interviewMinutesLeft} left`}
          hint={`of ${user.interviewMinutesTotal} this cycle`}
          icon={Mic}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <ContinueLearningCard data={summary.continueLearning} />
            <NextUnlockCard data={summary.nextUnlock} current={current} next={next} required={requiredItemCounts(current)} />
          </div>
          <TrackProgressCard modules={core} />
          <RecommendedProblemsCard problems={recommended} reasons={summary.recommendationReasons} />
          <RecentActivityCard entries={summary.recentActivity} />
        </div>

        <aside className="space-y-6">
          <PendingReviewsCard items={summary.pendingItems} />
          <LatestInterviewCard
            interview={summary.latestInterview}
            minutesLeft={user.interviewMinutesLeft}
            minutesTotal={user.interviewMinutesTotal}
          />
          <ReadinessSummaryCard companies={companies.filter((c) => c.isTarget)} />
          <MasterySnapshotCard strongest={bySkill.slice(0, 3)} weakest={bySkill.slice(-3).reverse()} />
        </aside>
      </div>
    </PageContainer>
  );
}
