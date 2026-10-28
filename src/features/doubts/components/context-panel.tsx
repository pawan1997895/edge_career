import Link from "next/link";
import { ArrowUpRight, BookOpen, CirclePlay, FileSearch, Info, TriangleAlert, CircleX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { CodeBlock } from "@/components/shared/rich-text";
import { DifficultyBadge, PhaseBadge } from "@/components/shared/status-badges";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import { LANGUAGE_LABELS } from "@/types/practice";
import type { DoubtContext } from "@/types/doubts";
import { CallFlowDiagram } from "./call-flow-diagram";
import { ExecutionTracePreview } from "./execution-trace-preview";

function ContextSection({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-b px-4 py-4 last:border-b-0">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

const RESULT_ICON = { error: CircleX, warning: TriangleAlert, info: Info } as const;
const RESULT_VARIANT = { error: "destructive", warning: "warning", info: "info" } as const;

/** Everything Edge AI sees for this doubt: problem, code, latest result, matched lesson, diagrams. */
export function ContextPanel({ context }: { context: DoubtContext }) {
  const hasContext = Boolean(context.problem || context.lessonMoment || context.code || context.lastResult);

  if (!hasContext) {
    return (
      <div className="p-4">
        <EmptyState
          icon={FileSearch}
          title="No context attached"
          description="Open the doubt hub from a problem or a lesson and your code, latest result and lesson moment are attached automatically."
        />
      </div>
    );
  }

  const ResultIcon = context.lastResult ? RESULT_ICON[context.lastResult.tone] : Info;

  return (
    <div>
      <p className="border-b px-4 py-3 text-xs text-muted-foreground">Edge AI only sees the context listed here.</p>

      {context.problem && (
        <ContextSection title="Problem">
          <Link href={routes.problem(context.problem.id)} className="group flex items-start justify-between gap-2">
            <span className="text-sm font-medium group-hover:text-primary">{context.problem.title}</span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
          <div className="mt-1">
            <DifficultyBadge difficulty={context.problem.difficulty} />
          </div>
        </ContextSection>
      )}

      {context.lessonMoment && (
        <ContextSection title="Lesson moment">
          <Link
            href={routes.lesson(context.lessonMoment.lessonId, context.lessonMoment.atSec)}
            className="group flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <CirclePlay className="size-4 text-muted-foreground group-hover:text-primary" />
            {context.lessonMoment.lessonTitle}
            <Badge variant="outline" className="font-mono">
              {formatClock(context.lessonMoment.atSec)}
            </Badge>
          </Link>
          <blockquote className="mt-2 border-l-2 pl-3 text-[13px] text-muted-foreground italic">{context.lessonMoment.excerpt}</blockquote>
        </ContextSection>
      )}

      {context.code && (
        <ContextSection title="Your current code" aside={<span className="text-xs text-muted-foreground">{LANGUAGE_LABELS[context.code.language]}</span>}>
          <CodeBlock code={context.code.snippet} className="max-h-56 overflow-y-auto text-xs" />
        </ContextSection>
      )}

      {context.lastResult && (
        <ContextSection title="Latest result">
          <Alert variant={RESULT_VARIANT[context.lastResult.tone]}>
            <ResultIcon />
            <AlertTitle>{context.lastResult.title}</AlertTitle>
            <AlertDescription className="font-mono text-xs whitespace-pre-line">{context.lastResult.detail}</AlertDescription>
          </Alert>
        </ContextSection>
      )}

      <ContextSection
        title="Matched lesson section"
        aside={context.lessonMatch && <Badge variant="success">{Math.round(context.lessonMatch.similarity * 100)}% match</Badge>}
      >
        {context.lessonMatch ? (
          <>
            <Link
              href={routes.lesson(context.lessonMatch.lessonId, context.lessonMatch.atSec)}
              className="group flex items-center gap-2 text-sm font-medium hover:text-primary"
            >
              <BookOpen className="size-4 text-muted-foreground group-hover:text-primary" />
              {context.lessonMatch.lessonTitle}
              <Badge variant="outline" className="font-mono">
                {formatClock(context.lessonMatch.atSec)}
              </Badge>
            </Link>
            <blockquote className="mt-2 border-l-2 pl-3 text-[13px] text-muted-foreground italic">{context.lessonMatch.excerpt}</blockquote>
          </>
        ) : (
          <p className="text-[13px] text-muted-foreground">No lesson section closely matches this doubt yet.</p>
        )}
      </ContextSection>

      <ContextSection title="Call-stack flowchart">
        {context.callFlow ? (
          <CallFlowDiagram title={context.callFlow.title} root={context.callFlow.root} />
        ) : (
          <p className="text-[13px] text-muted-foreground">A flowchart is generated when your doubt is about running code.</p>
        )}
      </ContextSection>

      {context.trace && context.trace.length > 0 && (
        <ContextSection title="Execution trace" aside={<PhaseBadge phase={2} />}>
          <p className="mb-3 text-[13px] text-muted-foreground">Preview. Real step-by-step traces from the judge arrive in Phase 2.</p>
          <ExecutionTracePreview steps={context.trace} code={context.code?.snippet} />
        </ContextSection>
      )}
    </div>
  );
}
