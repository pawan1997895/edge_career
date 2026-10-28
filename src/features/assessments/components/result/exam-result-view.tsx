import { Clock, ShieldCheck, ShieldAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { Card } from "@/components/ui/card";
import { formatDateTime, formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ExamResult } from "@/types/assessments";
import { AppealCard } from "./appeal-card";
import { OutcomeHeadline, OutcomePanel } from "./outcome-panel";
import { OutcomePreviewSwitcher } from "./outcome-preview-switcher";
import { ScoreScale } from "./score-scale";
import { SectionBreakdown } from "./section-breakdown";

export function ExamResultView({ result, nextModuleId, questionCount }: { result: ExamResult; nextModuleId?: string; questionCount: number }) {
  const { exam } = result;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[
          { label: "Assessments", href: routes.assessments },
          { label: exam.shortTitle, href: routes.exam(exam.id) },
          { label: "Result" },
        ]}
        title={`Result · ${exam.shortTitle}`}
        description={`Attempt ${result.attemptNumber} · submitted ${formatDateTime(result.submittedAt)}`}
        actions={<OutcomePreviewSwitcher examId={exam.id} outcome={result.outcome} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex-col gap-6 p-5 sm:flex-row sm:items-center">
            <ScoreRing score={result.score} passScore={exam.passScore} size={112} label="of 100" className="self-center" />
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <OutcomeHeadline result={result} />
                <p className="mt-1 text-sm text-muted-foreground">
                  Pass mark {exam.passScore}%. Scores from {exam.reviewBand.min}% to {exam.reviewBand.max}% are checked by a reviewer.
                </p>
              </div>
              <ScoreScale score={result.score} passScore={exam.passScore} band={exam.reviewBand} />
            </div>
          </Card>

          <OutcomePanel result={result} nextModuleId={nextModuleId} />
          <SectionBreakdown sections={result.sections} passScore={exam.passScore} />
        </div>

        <div className="space-y-6">
          <Card className="gap-4 p-5">
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">
                  {formatMinutes(result.timeTakenMin)} of {formatMinutes(exam.durationMin)}
                </p>
                <p className="text-xs text-muted-foreground">Time taken</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {result.integrityEvents === 0 ? (
                <ShieldCheck className="size-4 text-success" />
              ) : (
                <ShieldAlert className="size-4 text-warning" />
              )}
              <div className="text-sm">
                <p className="font-medium">
                  {result.integrityEvents === 0 ? "No integrity events" : `${result.integrityEvents} integrity event logged`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.integrityEvents === 0 ? "Nothing to review" : "One tab switch at 41:12, shared with the reviewer"}
                </p>
              </div>
            </div>
          </Card>
          <AppealCard questionCount={questionCount} alreadyInReview={result.outcome === "review"} />
        </div>
      </div>
    </PageContainer>
  );
}
