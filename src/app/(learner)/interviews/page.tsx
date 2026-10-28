import type { Metadata } from "next";
import Link from "next/link";
import { Award, CalendarCheck, Plus, TrendingUp } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { getInterviewHistory, getInterviewQuota } from "@/data/interviews";
import { InterviewHistoryTable } from "@/features/interviews/components/interview-history-table";
import { InterviewTypeCards } from "@/features/interviews/components/interview-type-cards";
import { MinutesCard } from "@/features/interviews/components/minutes-card";
import { ScoreTrendChart } from "@/features/interviews/components/score-trend-chart";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Mock interviews" };

export default async function InterviewStudioPage() {
  const [history, quota] = await Promise.all([getInterviewHistory(), getInterviewQuota()]);
  const scored = history.filter((s) => s.overallScore !== undefined);
  const average = scored.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / Math.max(1, scored.length);
  const latest = scored[0];
  const previous = scored[1];
  const change =
    latest?.overallScore !== undefined && previous?.overallScore !== undefined ? latest.overallScore - previous.overallScore : undefined;

  return (
    <PageContainer wide>
      <PageHeader
        title="Mock interviews"
        description="Practise with an AI interviewer that adapts its follow-ups to your answers. Every session ends with a scorecard that quotes your transcript."
        actions={
          <Button asChild>
            <Link href={routes.interviewSetup()}>
              <Plus /> New interview
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Interviews completed" value={scored.length} hint="since June 2026" icon={CalendarCheck} />
        <StatCard
          label="Latest overall score"
          value={latest?.overallScore?.toFixed(1) ?? "—"}
          icon={TrendingUp}
          trend={change !== undefined ? { value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}`, positive: change >= 0 } : undefined}
          hint="vs previous interview"
        />
        <StatCard label="Average score" value={average.toFixed(1)} hint="out of 5" icon={Award} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ScoreTrendChart history={history} className="lg:col-span-2" />
        <MinutesCard quota={quota} />
      </div>

      <section className="mt-8">
        <SectionHeader title="Start an interview" description="Text and voice are available for every type. The live video avatar is a Phase 2 preview." />
        <InterviewTypeCards history={history} />
      </section>

      <section className="mt-8">
        <SectionHeader title="History" description="Open a scorecard to see evidence from your transcript and tips for next time." />
        <InterviewHistoryTable history={history} />
      </section>
    </PageContainer>
  );
}
