import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import type { ExamDetail } from "@/types/assessments";

/** One line describing what still blocks a locked checkpoint. */
export function lockedReason(exam: ExamDetail) {
  const unmet = exam.requirements.filter((r) => !r.done);
  if (unmet.length === 0) return "Opens soon";
  const first = unmet[0]!.label;
  const firstText = first.startsWith("Pass ") ? first : `Finish “${first}”`;
  return unmet.length === 1 ? firstText : `${firstText} and ${unmet.length - 1} more`;
}

export function LockedExamsCard({ exams }: { exams: ExamDetail[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Locked checkpoints</CardTitle>
        <CardDescription>Each checkpoint opens when every required item in its module is passed.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <ul className="divide-y">
          {exams.map((exam) => (
            <li key={exam.id}>
              <Link href={routes.exam(exam.id)} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{exam.shortTitle}</span>
                  <span className="block truncate text-[13px] text-muted-foreground">{lockedReason(exam)}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
