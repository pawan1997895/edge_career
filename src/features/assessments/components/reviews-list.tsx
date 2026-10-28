import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/format";
import type { ReviewCase } from "@/types/assessments";
import { REVIEW_ORIGIN_LABELS, ReviewStatusBadge } from "./assessment-badges";

/** Results that went to a human reviewer, automatically or by appeal. */
export function ReviewsList({ cases }: { cases: ReviewCase[] }) {
  if (cases.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No reviews or appeals"
        description="Results near the pass line, or where the AI grader is unsure, are checked by a person and appear here."
      />
    );
  }

  return (
    <ul className="divide-y">
      {cases.map((c) => (
        <li key={c.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={c.href} className="text-sm font-medium hover:text-primary">
                {c.title}
              </Link>
              <ReviewStatusBadge status={c.status} />
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {REVIEW_ORIGIN_LABELS[c.origin]} · opened {formatDate(c.openedAt)}
              {c.aiScore !== undefined && (
                <>
                  {" "}
                  · AI score {c.aiScore}%{c.finalScore !== undefined && ` → final ${c.finalScore}%`}
                </>
              )}
            </p>
            {c.resolution && <p className="mt-1.5 text-[13px]">{c.resolution}</p>}
            {c.status !== "resolved" && (
              <p className="mt-1.5 text-[13px] text-muted-foreground">A reviewer usually responds within 24 hours. Your module status won&apos;t change until then.</p>
            )}
          </div>
          <Link href={c.href} className="inline-flex shrink-0 items-center gap-1 text-[13px] text-primary hover:underline">
            View <ArrowRight className="size-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
