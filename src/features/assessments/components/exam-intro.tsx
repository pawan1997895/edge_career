import Link from "next/link";
import { ArrowRight, CircleCheck, Clock, ShieldAlert, Target } from "lucide-react";
import { PageContainer, PageHeader, type Crumb } from "@/components/layout/page-header";
import { LockedState } from "@/components/shared/locked-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ExamDetail } from "@/types/assessments";
import { ExamStatusBadge } from "./assessment-badges";
import { AttemptHistoryTable } from "./attempt-history-table";
import { EligibilityCard } from "./eligibility-card";
import { ExamRulesCard } from "./exam-rules-card";
import { StartExamCard } from "./start-exam-card";

export function ExamIntro({ exam }: { exam: ExamDetail }) {
  const crumbs: Crumb[] = [{ label: "Assessments", href: routes.assessments }];
  if (exam.moduleId && exam.moduleTitle) crumbs.push({ label: exam.moduleTitle, href: routes.module(exam.moduleId) });
  crumbs.push({ label: exam.kind === "placement" ? "Placement test" : "Checkpoint" });

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={crumbs}
        title={exam.title}
        description={
          exam.kind === "placement"
            ? "Test out of core modules you already know."
            : `The checkpoint for ${exam.moduleTitle}. Score ${exam.passScore}% or more to unlock ${exam.nextUnlock}.`
        }
        meta={
          <>
            <ExamStatusBadge status={exam.status} />
            <Badge variant="outline">
              <Clock /> {formatMinutes(exam.durationMin)}
            </Badge>
            <Badge variant="outline">
              <Target /> Pass {exam.passScore}%
            </Badge>
            {exam.bestScore !== undefined && <Badge variant="outline">Best {exam.bestScore}%</Badge>}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ExamRulesCard exam={exam} />

          <Alert variant="warning">
            <ShieldAlert />
            <AlertTitle>Integrity notice</AlertTitle>
            <AlertDescription>
              Pastes into answers and switches away from the exam tab are logged with timestamps. Code answers are checked for
              similarity with other submissions. Logged events don&apos;t fail you automatically; a reviewer looks at them in context.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Past attempts</CardTitle>
              <CardDescription>
                {exam.attempts.length === 0 ? "You haven't taken this exam yet." : `${exam.attempts.length} attempt(s) so far.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <AttemptHistoryTable attempts={exam.attempts} showExam={false} passScore={exam.passScore} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ExamAction exam={exam} />
          {exam.status !== "locked" && <EligibilityCard requirements={exam.requirements} />}
        </div>
      </div>
    </PageContainer>
  );
}

function ExamAction({ exam }: { exam: ExamDetail }) {
  if (exam.status === "locked") {
    return (
      <LockedState
        title="This checkpoint is locked"
        description="It opens when everything below is passed."
        requirements={exam.requirements}
        action={
          exam.moduleId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.module(exam.moduleId)}>
                Go to module <ArrowRight />
              </Link>
            </Button>
          )
        }
      />
    );
  }

  if (exam.status === "passed") {
    return (
      <Card className="gap-3 p-5">
        <p className="flex items-center gap-2 font-semibold text-success">
          <CircleCheck className="size-5" /> Passed with {exam.bestScore}%
        </p>
        <p className="text-[13px] text-muted-foreground">{exam.nextUnlock} is unlocked. There&apos;s nothing more to do here.</p>
        <Button variant="outline" size="sm" asChild>
          <Link href={routes.examResult(exam.id)}>View result</Link>
        </Button>
      </Card>
    );
  }

  return <StartExamCard exam={exam} />;
}
