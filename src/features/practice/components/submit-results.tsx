import Link from "next/link";
import { ArrowUpRight, MessageCircleQuestionMark, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/shared/score-ring";
import { VerdictBadge } from "@/components/shared/status-badges";
import { AoiList } from "@/features/submissions/components/aoi-list";
import { ComplexitySummary } from "@/features/submissions/components/complexity-summary";
import { LogOutput } from "@/features/submissions/components/log-output";
import { ResourceUsage } from "@/features/submissions/components/resource-usage";
import { ScoreBreakdownView } from "@/features/submissions/components/score-breakdown";
import { SqlComparisonView } from "@/features/practice/components/sql-comparison";
import { routes } from "@/lib/routes";
import type { ProblemDetail } from "@/types/practice";
import type { SubmitOutcome } from "@/types/submissions";

/** Verdict panel after Submit: tests, limits, score split, complexity estimate and AOIs. */
export function SubmitResults({ outcome, problem, fullResultHref }: { outcome: SubmitOutcome; problem: ProblemDetail; fullResultHref: string }) {
  const s = outcome.submission;
  const compiled = s.verdict !== "compile_error";

  return (
    <div className="space-y-5 p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <VerdictBadge verdict={s.verdict} />
        <span className="text-sm font-medium">
          {s.testsPassed}/{s.testsTotal} tests passed
        </span>
        <span className="text-xs text-muted-foreground">including {problem.hiddenTestCount} hidden</span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={routes.askAboutProblem(problem.id)}>
              <MessageCircleQuestionMark /> Ask
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={fullResultHref}>
              Full result <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>

      {outcome.log && <LogOutput title={s.verdict === "compile_error" ? "Compiler output" : s.kind === "sql" ? "PostgreSQL error" : "Runtime error (first failing test)"} log={outcome.log} />}
      {outcome.sql && <SqlComparisonView comparison={outcome.sql} />}

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-md border p-4">
          <h3 className="mb-3 text-sm font-semibold">Score</h3>
          <div className="flex items-center gap-4">
            <ScoreRing score={s.score.total} size={72} />
            <div className="flex-1">
              <ScoreBreakdownView score={s.score} />
            </div>
          </div>
        </section>
        <section className="rounded-md border p-4">
          <h3 className="mb-3 text-sm font-semibold">Resources</h3>
          {compiled ? (
            <ResourceUsage runtimeMs={s.runtimeMs} memoryMb={s.memoryMb} timeLimitMs={problem.timeLimitMs} memoryLimitMb={problem.memoryLimitMb} />
          ) : (
            <p className="text-[13px] text-muted-foreground">Nothing ran: the code has to compile first.</p>
          )}
        </section>
      </div>

      {s.complexity && (
        <section className="rounded-md border p-4">
          <h3 className="mb-3 text-sm font-semibold">Time complexity</h3>
          <ComplexitySummary complexity={s.complexity} timeLimitMs={problem.timeLimitMs} />
        </section>
      )}

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" /> Areas of improvement
          {s.feedback && <Badge variant="muted">AI review</Badge>}
        </h3>
        {s.feedback ? (
          <>
            <p className="mb-3 text-[13px] text-muted-foreground">{s.feedback.summary}</p>
            <AoiList aois={s.feedback.aois} />
          </>
        ) : (
          <p className="text-[13px] text-muted-foreground">The AI review runs once your code compiles.</p>
        )}
      </section>
    </div>
  );
}
