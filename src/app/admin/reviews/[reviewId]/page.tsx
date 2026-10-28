import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquareQuote } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getReview } from "@/data/admin-content";
import { ReviewArtifact } from "@/features/admin/reviews/components/review-artifact";
import { ReviewDecision } from "@/features/admin/reviews/components/review-decision";
import { IntegrityEvents, ReviewTestResults } from "@/features/admin/reviews/components/review-evidence";
import { ReviewScoreCard } from "@/features/admin/reviews/components/review-score-card";
import { RubricRationale } from "@/features/admin/reviews/components/rubric-rationale";
import { ITEM_TYPE_LABELS, ReasonBadge, ReviewStatusBadge } from "@/features/admin/reviews/review-labels";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ reviewId: string }> }): Promise<Metadata> {
  const { reviewId } = await params;
  const review = await getReview(reviewId);
  return { title: review ? `Review: ${review.itemTitle}` : "Review not found" };
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = await params;
  const review = await getReview(reviewId);
  if (!review) notFound();

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: routes.admin.overview },
          { label: "Review queue", href: routes.admin.reviews },
          { label: review.id },
        ]}
        title={review.itemTitle}
        description={`${review.moduleTitle} · submitted ${formatDateTime(review.submittedAt)}`}
        meta={
          <>
            <ReviewStatusBadge status={review.status} />
            <ReasonBadge reason={review.reason} />
            <Badge variant="outline">{ITEM_TYPE_LABELS[review.itemType]}</Badge>
          </>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          {review.learnerNote && (
            <Alert variant="info">
              <MessageSquareQuote />
              <AlertTitle>Learner&apos;s appeal</AlertTitle>
              <AlertDescription>&ldquo;{review.learnerNote}&rdquo;</AlertDescription>
            </Alert>
          )}
          <ReviewScoreCard review={review} />
          <RubricRationale rubric={review.rubric} />
          <ReviewArtifact artifact={review.artifact} />
          {review.tests && <ReviewTestResults tests={review.tests} />}
          <IntegrityEvents events={review.integrityEvents} />
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Avatar name={review.learnerName} className="size-10" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{review.learnerName}</p>
                <p className="text-xs text-muted-foreground">{review.learnerId}</p>
              </div>
              <Link href={routes.admin.user(review.learnerId)} className="text-xs text-primary hover:underline">
                Profile
              </Link>
            </CardContent>
          </Card>
          <ReviewDecision review={review} />
        </aside>
      </div>
    </PageContainer>
  );
}
