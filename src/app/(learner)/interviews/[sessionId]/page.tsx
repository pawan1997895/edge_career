import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getScorecard } from "@/data/interviews";
import { InterviewModeBadge, InterviewTypeBadge } from "@/features/interviews/components/interview-badges";
import { ScorecardActions } from "@/features/interviews/components/scorecard/scorecard-actions";
import { ScorecardView } from "@/features/interviews/components/scorecard/scorecard-view";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Interview scorecard" };

export default async function ScorecardPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const scorecard = await getScorecard(sessionId);
  if (!scorecard) notFound();

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Mock interviews", href: routes.interviews }, { label: "Scorecard" }]}
        title={scorecard.title}
        description={`${formatDateTime(scorecard.startedAt)} · ${scorecard.durationMin} min`}
        meta={
          <>
            <InterviewTypeBadge type={scorecard.type} />
            <InterviewModeBadge mode={scorecard.mode} />
            {scorecard.company && <Badge variant="outline">{scorecard.company} focus</Badge>}
          </>
        }
        actions={
          <>
            <ScorecardActions />
            <Button size="sm" asChild>
              <Link href={routes.interviewSetup(scorecard.type)}>
                <RotateCcw /> Practise again
              </Link>
            </Button>
          </>
        }
      />
      <ScorecardView scorecard={scorecard} />
    </PageContainer>
  );
}
