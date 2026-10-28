import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Gauge, Hourglass, ListChecks } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { SubmissionHistory } from "@/features/submissions/components/submission-history";
import { getSubmissions } from "@/data/submissions";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Submissions" };

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();
  const accepted = submissions.filter((s) => s.verdict === "accepted").length;
  const graded = submissions.filter((s) => s.verdict !== "compile_error");
  const avgScore = graded.length ? Math.round(graded.reduce((sum, s) => sum + s.score.total, 0) / graded.length) : 0;
  const inReview = submissions.filter((s) => s.review?.status === "queued").length;

  return (
    <PageContainer wide>
      <PageHeader
        title="Submissions"
        description="Every solution you've submitted, with its verdict, score and AI feedback."
        actions={
          <Button asChild>
            <Link href={routes.practice}>Practise a problem</Link>
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Submissions" value={submissions.length} icon={ListChecks} hint="Last 30 days" />
        <StatCard
          label="Accepted"
          value={`${submissions.length ? Math.round((accepted / submissions.length) * 100) : 0}%`}
          icon={CircleCheck}
          hint={`${accepted} of ${submissions.length}`}
        />
        <StatCard label="Average score" value={avgScore} icon={Gauge} hint="Excludes compile errors" />
        <StatCard label="In human review" value={inReview} icon={Hourglass} hint="Provisional scores" />
      </div>
      <SubmissionHistory submissions={submissions} />
    </PageContainer>
  );
}
