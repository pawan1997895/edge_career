import Link from "next/link";
import { ClockFading, ShieldAlert } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ExamAttempt } from "@/types/assessments";
import { AttemptOutcomeBadge } from "./assessment-badges";

/** Past attempts, newest first. `showExam` adds the exam column for the overview page. */
export function AttemptHistoryTable({ attempts, showExam = true, passScore = 85 }: { attempts: ExamAttempt[]; showExam?: boolean; passScore?: number }) {
  if (attempts.length === 0) {
    return <EmptyState icon={ClockFading} title="No attempts yet" description="Your attempts and their scores will appear here." className="border-0" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {showExam && <TableHead>Exam</TableHead>}
          <TableHead>Attempt</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead className="hidden md:table-cell">Time</TableHead>
          <TableHead className="hidden lg:table-cell">Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attempts.map((a) => (
          <TableRow key={a.id}>
            {showExam && (
              <TableCell className="max-w-56">
                <Link href={routes.exam(a.examId)} className="line-clamp-2 font-medium hover:text-primary">
                  {a.examTitle}
                </Link>
              </TableCell>
            )}
            <TableCell className="tabular-nums">#{a.attemptNumber}</TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(a.takenAt)}</TableCell>
            <TableCell className={cn("text-right font-semibold tabular-nums", a.score >= passScore ? "text-success" : "text-foreground")}>
              {a.score}%
            </TableCell>
            <TableCell>
              <AttemptOutcomeBadge outcome={a.outcome} humanReviewed={a.humanReviewed} />
            </TableCell>
            <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
              {formatMinutes(a.durationMin)}
              {a.integrityEvents > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-warning-foreground dark:text-warning" title="Integrity events logged">
                  <ShieldAlert className="size-3" /> {a.integrityEvents}
                </span>
              )}
            </TableCell>
            <TableCell className="hidden max-w-72 text-[13px] text-muted-foreground lg:table-cell">{a.reviewNote ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
