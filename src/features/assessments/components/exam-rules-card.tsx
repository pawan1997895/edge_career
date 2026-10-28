import { Clock, RotateCcw, Scale, Shuffle, Target, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes } from "@/lib/format";
import type { ExamDetail } from "@/types/assessments";
import { ExamSectionsTable } from "./exam-sections-table";

export function ExamRulesCard({ exam }: { exam: ExamDetail }) {
  const questionCount = exam.sections.reduce((sum, s) => sum + s.questionCount, 0);
  const rules = [
    { icon: Clock, title: `${formatMinutes(exam.durationMin)}, one sitting`, detail: "The timer keeps running if you close the tab. Answers save automatically." },
    { icon: Shuffle, title: `${questionCount} questions from a pool of ${exam.poolSize}`, detail: "Every attempt draws a fresh, randomized set." },
    {
      icon: Target,
      title: `Pass mark ${exam.passScore}%`,
      detail: exam.kind === "placement" ? "Each section at 85% or more marks that module as tested out." : `Passing unlocks ${exam.nextUnlock}.`,
    },
    {
      icon: UserCheck,
      title: `Human review from ${exam.reviewBand.min}% to ${exam.reviewBand.max}%`,
      detail: "Scores near the pass line, or answers the AI grader is unsure about, are checked by a person before the result is final.",
    },
    { icon: Scale, title: "How answers are scored", detail: "Coding: 70% hidden tests, 30% AI rubric. Written design answers: rubric only." },
    {
      icon: RotateCcw,
      title: `Retake after ${exam.retakeCooldownHours >= 48 ? `${Math.round(exam.retakeCooldownHours / 24)} days` : `${exam.retakeCooldownHours} hours`}`,
      detail: "Use the wait to review the weak areas listed on your result.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Format and rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {rules.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-[13px] text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="-mx-5 border-t">
          <ExamSectionsTable sections={exam.sections} />
        </div>
      </CardContent>
    </Card>
  );
}
