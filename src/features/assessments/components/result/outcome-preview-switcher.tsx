import Link from "next/link";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ResultOutcome } from "@/types/assessments";

const OPTIONS: { value: ResultOutcome; label: string }[] = [
  { value: "pass", label: "Passed" },
  { value: "review", label: "Under review" },
  { value: "fail", label: "Not passed" },
];

/** Demo control for reviewing each result state. Not part of the real product. */
export function OutcomePreviewSwitcher({ examId, outcome }: { examId: string; outcome: ResultOutcome }) {
  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Preview outcome</span>
      <nav aria-label="Preview outcome" className="inline-flex h-9 items-center rounded-lg bg-muted p-1">
        {OPTIONS.map((o) => (
          <Link
            key={o.value}
            href={`${routes.examResult(examId)}?outcome=${o.value}`}
            replace
            scroll={false}
            aria-current={o.value === outcome ? "page" : undefined}
            className={cn(
              "flex h-full items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              o.value === outcome && "bg-card text-foreground shadow-xs",
            )}
          >
            {o.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
