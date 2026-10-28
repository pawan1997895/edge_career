import Link from "next/link";
import { ArrowRight, ClipboardCheck, Compass, Inbox, Trophy } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ExamAttempt, ExamDetail, PlacementSummary, ReviewCase } from "@/types/assessments";
import { AttemptHistoryTable } from "./attempt-history-table";
import { IntegrityPolicyCard } from "./integrity-policy-card";
import { LockedExamsCard } from "./locked-exams-card";
import { PlacementResultList } from "./placement-result-list";
import { ReadyExamCard } from "./ready-exam-card";
import { ReviewsList } from "./reviews-list";

export function AssessmentsOverview({
  exams,
  attempts,
  reviews,
  placement,
}: {
  exams: ExamDetail[];
  attempts: ExamAttempt[];
  reviews: ReviewCase[];
  placement: PlacementSummary;
}) {
  const checkpoints = exams.filter((e) => e.kind === "checkpoint");
  const ready = checkpoints.filter((e) => e.status === "available");
  const locked = checkpoints.filter((e) => e.status === "locked");
  const passed = checkpoints.filter((e) => e.status === "passed");
  const openReviews = reviews.filter((r) => r.status !== "resolved");
  const passedScores = passed.map((e) => e.bestScore ?? 0);
  const average = passedScores.length ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) : 0;
  const checkpointIds = new Set(checkpoints.map((e) => e.id));
  const checkpointAttempts = attempts.filter((a) => checkpointIds.has(a.examId));

  return (
    <PageContainer>
      <PageHeader
        title="Assessments"
        description="Checkpoint exams unlock the next module at 85% or more. Scores between 80% and 88%, or where the AI grader is unsure, are checked by a person."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.placementTest}>
              <Compass /> Placement test
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Checkpoints passed" value={passed.length} hint={`of ${checkpoints.length} checkpoints`} icon={Trophy} />
        <StatCard label="Ready to take" value={ready.length} hint="all required items passed" icon={ClipboardCheck} />
        <StatCard label="Open reviews and appeals" value={openReviews.length} hint="usually answered within 24h" icon={Inbox} />
        <StatCard label="Average passing score" value={`${average}%`} hint="across passed checkpoints" />
      </div>

      <section className="mt-8">
        <SectionHeader title="Ready to take" description="Every required item in these modules is passed." />
        <div className="grid gap-4 lg:grid-cols-2">
          {ready.map((exam) => (
            <ReadyExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Attempt history</CardTitle>
              <CardDescription>Every checkpoint attempt, including those a reviewer checked.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <AttemptHistoryTable attempts={checkpointAttempts} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews and appeals</CardTitle>
              <CardDescription>Results checked by a person, automatically or because you asked.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <ReviewsList cases={reviews} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Placement test</CardTitle>
              <CardDescription>Taken {formatDate(placement.takenAt)}</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={routes.placementTest}>
                    Details <ArrowRight />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <PlacementResultList sections={placement.sections} />
            </CardContent>
          </Card>
          <LockedExamsCard exams={locked} />
          <IntegrityPolicyCard />
        </div>
      </div>
    </PageContainer>
  );
}
