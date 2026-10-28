import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, Clock, Inbox, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { getReviewers, getReviewQueue } from "@/data/admin-content";
import { ReviewQueueTable } from "@/features/admin/reviews/components/review-queue-table";
import { REVIEW_SLA_HOURS, waitingHours } from "@/features/admin/reviews/review-labels";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Review queue" };

export default async function ReviewQueuePage() {
  const [items, reviewers] = await Promise.all([getReviewQueue(), getReviewers()]);
  const open = items.filter((i) => i.status !== "resolved");
  const waits = open.map((i) => waitingHours(i.submittedAt));
  const overdue = waits.filter((h) => h > REVIEW_SLA_HOURS).length;
  const avgWait = waits.length ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : 0;
  const appeals = open.filter((i) => i.reason === "appeal").length;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Review queue" }]}
        title="Human review queue"
        description="Scores between 80% and 88%, results the AI grader was unsure about, learner appeals and integrity flags. A score here does not lock or unlock a module until a reviewer resolves it."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.admin.grading}>
              <Scale /> Grader accuracy
            </Link>
          </Button>
        }
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open items" value={open.length} icon={Inbox} hint={`${open.filter((i) => !i.assignee).length} unassigned`} />
        <StatCard
          label="Past the 24h SLA"
          value={<span className={overdue ? "text-destructive" : undefined}>{overdue}</span>}
          icon={CircleAlert}
          hint="Learners are waiting on these"
        />
        <StatCard label="Average wait" value={`${avgWait}h`} icon={Clock} hint="Open items" />
        <StatCard label="Open appeals" value={appeals} icon={Scale} hint="Learner-initiated" />
      </div>
      <ReviewQueueTable items={items} reviewers={reviewers} />
    </PageContainer>
  );
}
