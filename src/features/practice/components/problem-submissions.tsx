import Link from "next/link";
import { ChevronRight, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { VerdictBadge } from "@/components/shared/status-badges";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Submission } from "@/types/practice";
import { LANGUAGE_LABELS } from "@/types/practice";

/** Past submissions for the open problem. `latest` is the one just made in this session (not saved). */
export function ProblemSubmissions({ submissions, latest, latestHref }: { submissions: Submission[]; latest?: Submission; latestHref: string }) {
  if (submissions.length === 0 && !latest) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No submissions yet"
        description="Submit to run the hidden tests and get a score with AI feedback."
        className="m-4"
      />
    );
  }

  return (
    <ul className="divide-y">
      {latest && <Row submission={latest} href={latestHref} isNew />}
      {submissions.map((s) => (
        <Row key={s.id} submission={s} href={routes.submission(s.id)} />
      ))}
    </ul>
  );
}

function Row({ submission: s, href, isNew = false }: { submission: Submission; href: string; isNew?: boolean }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <VerdictBadge verdict={s.verdict} />
            {isNew && <Badge variant="info">This session</Badge>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {LANGUAGE_LABELS[s.language]} · {s.testsPassed}/{s.testsTotal} tests · {isNew ? "just now" : formatRelative(s.submittedAt)}
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums">{s.score.total}</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </li>
  );
}
