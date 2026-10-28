import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getOverview, getPipelineLessons, getProblemFiles, getReviewQueue } from "@/data/admin-content";
import { AdminAlerts } from "@/features/admin/overview/components/admin-alerts";
import { ContentPipelineStatus } from "@/features/admin/overview/components/content-pipeline-status";
import { FeatureCostChart } from "@/features/admin/overview/components/feature-cost-chart";
import { OverviewKpis } from "@/features/admin/overview/components/overview-kpis";
import { ReviewQueuePreview } from "@/features/admin/overview/components/review-queue-preview";
import { SubmissionsChart } from "@/features/admin/overview/components/submissions-chart";
import { formatDateTime, DEMO_NOW } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const [overview, queue, problems, lessons] = await Promise.all([getOverview(), getReviewQueue(), getProblemFiles(), getPipelineLessons()]);

  return (
    <PageContainer wide>
      <PageHeader
        title="Admin overview"
        description={`Platform health at ${formatDateTime(DEMO_NOW)}. Figures refresh every 5 minutes.`}
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.admin.reviews}>Review queue</Link>
          </Button>
        }
      />

      <OverviewKpis stats={overview.stats} />

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Submissions per day</CardTitle>
            <CardDescription>Code, SQL and design submissions over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionsChart data={overview.dailySubmissions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI cost by feature</CardTitle>
            <CardDescription>Today, all on claude-opus-5-5</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href={routes.admin.aiUsage}>Details</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FeatureCostChart data={overview.featureCosts} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <ReviewQueuePreview items={queue} />
          <ContentPipelineStatus ciStatuses={problems.map((p) => p.file.ciStatus)} lessons={lessons} />
        </div>
        <div className="order-first xl:order-none">
          <AdminAlerts alerts={overview.alerts} />
        </div>
      </div>
    </PageContainer>
  );
}
