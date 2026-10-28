import type { Metadata } from "next";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BullQueues } from "@/features/admin/ops/components/system/bull-queues";
import { JudgeQueueChart } from "@/features/admin/ops/components/system/judge-queue-chart";
import { RecentDeploys } from "@/features/admin/ops/components/system/recent-deploys";
import { SentryIssues } from "@/features/admin/ops/components/system/sentry-issues";
import { ServiceStatusGrid } from "@/features/admin/ops/components/system/service-status-grid";
import { SandboxPolicyCard } from "@/features/admin/ops/components/system/sandbox-policy";
import { WorkerPools } from "@/features/admin/ops/components/system/worker-pools";
import { getSystemHealth } from "@/data/admin-ops";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "System health" };

export default async function SystemHealthPage() {
  const health = await getSystemHealth();
  const unhealthy = health.services.filter((s) => s.state !== "operational");

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Operations" }, { label: "System health" }]}
        title="System health"
        description="Services, the code judge, job queues and errors. Updated every minute."
      />

      {unhealthy.length > 0 ? (
        <Alert variant="warning" className="mb-4">
          <TriangleAlert />
          <AlertTitle>
            {unhealthy.length} service{unhealthy.length > 1 ? "s" : ""} degraded
          </AlertTitle>
          <AlertDescription>{unhealthy.map((s) => `${s.name}: ${s.note ?? "investigating"}`).join(" · ")}</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="success" className="mb-4">
          <CircleCheck />
          <AlertTitle>All systems operational</AlertTitle>
        </Alert>
      )}

      <ServiceStatusGrid services={health.services} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <JudgeQueueChart data={health.queue} />
        <SandboxPolicyCard policy={health.sandbox} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <WorkerPools workers={health.workers} />
        <BullQueues queues={health.queues} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <SentryIssues issues={health.sentry} />
        <RecentDeploys deploys={health.deploys} />
      </div>
    </PageContainer>
  );
}
