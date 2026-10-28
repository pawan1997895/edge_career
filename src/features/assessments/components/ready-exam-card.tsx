import Link from "next/link";
import { ArrowRight, Clock, ListChecks, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ExamDetail } from "@/types/assessments";
import { ExamStatusBadge } from "./assessment-badges";

/** A checkpoint the learner can take now, with what passing unlocks. */
export function ReadyExamCard({ exam }: { exam: ExamDetail }) {
  const lastAttempt = exam.attempts[0];
  const questionCount = exam.sections.reduce((sum, s) => sum + s.questionCount, 0);

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{exam.moduleNumber ? `Module ${exam.moduleNumber} · Core track` : "Elective"}</p>
          <h3 className="mt-0.5 font-semibold">{exam.shortTitle}</h3>
        </div>
        <ExamStatusBadge status={exam.status} />
      </div>

      <dl className="grid grid-cols-3 gap-3 text-[13px]">
        <div>
          <dt className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" /> Duration
          </dt>
          <dd className="mt-0.5 font-medium">{formatMinutes(exam.durationMin)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-muted-foreground">
            <ListChecks className="size-3.5" /> Questions
          </dt>
          <dd className="mt-0.5 font-medium">{questionCount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Pass mark</dt>
          <dd className="mt-0.5 font-medium">{exam.passScore}%</dd>
        </div>
      </dl>

      <div className="rounded-md bg-muted/60 px-3 py-2.5 text-[13px]">
        {lastAttempt ? (
          <p className="flex items-start gap-2">
            <Shuffle className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <span>
              Last attempt scored <span className="font-medium">{lastAttempt.score}%</span>. Your retake draws a fresh, randomized
              question set.
            </span>
          </p>
        ) : (
          <p className="text-muted-foreground">First attempt. Questions are drawn at random from a pool of {exam.poolSize}.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">
          Unlocks <span className="font-medium text-foreground">{exam.nextUnlock}</span>
        </p>
        <Button size="sm" asChild>
          <Link href={routes.exam(exam.id)}>
            {lastAttempt ? "Review and retake" : "Review and start"} <ArrowRight />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
