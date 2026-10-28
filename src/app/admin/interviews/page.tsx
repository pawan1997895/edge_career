import type { Metadata } from "next";
import { Gauge, Hand, Mic, Timer, Zap } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ActiveSessions } from "@/features/admin/ops/components/interviews/active-sessions";
import { InterviewCostBreakdownCard } from "@/features/admin/ops/components/interviews/cost-breakdown";
import { InterviewLatencyChart } from "@/features/admin/ops/components/interviews/latency-chart";
import { PlanMinutes } from "@/features/admin/ops/components/interviews/plan-minutes";
import { SttVendorTrials } from "@/features/admin/ops/components/interviews/stt-vendor-trials";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import { getInterviewOps } from "@/data/admin-ops";
import { formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Interview ops" };

export default async function InterviewOpsPage() {
  const ops = await getInterviewOps();
  const latest = ops.latency[ops.latency.length - 1]!;
  const daysOverTarget = ops.latency.filter((p) => p.p95Ms > ops.latencyTargetMs).length;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Operations" }, { label: "Interview ops" }]}
        title="Interview operations"
        description="Voice pipeline health, cost per interview and minutes against plan caps. Use these numbers to set prices and caps."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Interviews this month" value={formatNumber(ops.sessionsThisMonth)} icon={Mic} hint={`${formatNumber(ops.minutesThisMonth)} minutes`} />
        <StatCard label="Reply latency p50" value={formatMs(latest.p50Ms)} icon={Timer} hint="Today" />
        <StatCard
          label="Reply latency p95"
          value={formatMs(latest.p95Ms)}
          icon={Gauge}
          hint={`Above ${formatMs(ops.latencyTargetMs)} on ${daysOverTarget} of ${ops.latency.length} days`}
        />
        <StatCard label="Candidate interruptions" value={`${ops.interruptionRate}%`} icon={Hand} hint="Of interviewer turns" />
      </div>

      <Alert variant="info" className="mt-6">
        <Zap />
        <AlertTitle>Latency option: Claude fast mode</AlertTitle>
        <AlertDescription>
          p95 replies are above the 1.5 s target on weekends. Fast mode for live interview turns would cut model time at about 2× the
          Claude price, adding roughly $0.70 per voice interview. Grading and scorecards would stay on standard speed.
        </AlertDescription>
      </Alert>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <InterviewLatencyChart data={ops.latency} targetMs={ops.latencyTargetMs} />
        <PlanMinutes plans={ops.plans} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <InterviewCostBreakdownCard costs={ops.costs} />
        <ActiveSessions sessions={ops.active} latencyTargetMs={ops.latencyTargetMs} />
      </div>

      <div className="mt-6">
        <SttVendorTrials vendors={ops.vendors} accentGroups={ops.accentGroups} />
      </div>
    </PageContainer>
  );
}
