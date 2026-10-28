import { CircleCheck, CircleX, Lightbulb, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { CheckSeverity, DesignCheck } from "@/types/system-design";

const SEVERITY: Record<CheckSeverity, { icon: LucideIcon; className: string; label: string }> = {
  error: { icon: CircleX, className: "text-destructive", label: "Issue" },
  warning: { icon: TriangleAlert, className: "text-warning", label: "Warning" },
  suggestion: { icon: Lightbulb, className: "text-info", label: "Suggestion" },
  pass: { icon: CircleCheck, className: "text-success", label: "Passed" },
};

export function checkIssueCount(checks: DesignCheck[]) {
  return checks.filter((c) => c.severity === "error" || c.severity === "warning").length;
}

/** Results of the automatic structural checks. They re-run on every diagram change. */
export function HldChecksList({ checks }: { checks: DesignCheck[] }) {
  if (checks.length === 0) {
    return <EmptyState icon={ShieldCheck} title="No checks yet" description="Add blocks to the canvas. Checks run automatically as you build the diagram." />;
  }
  const issues = checkIssueCount(checks);
  const passed = checks.filter((c) => c.severity === "pass").length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {issues === 0 ? "No structural issues found." : `${issues} ${issues === 1 ? "issue" : "issues"} to look at`} · {passed} passed. These rules run before the AI
        review and update as you edit.
      </p>
      <ul className="space-y-2">
        {checks.map((check) => {
          const { icon: Icon, className, label } = SEVERITY[check.severity];
          return (
            <li
              key={check.id}
              className={cn(
                "flex gap-3 rounded-lg border p-3",
                check.severity === "error" && "border-destructive/30 bg-destructive/5",
                check.severity === "warning" && "border-warning/40 bg-warning/5",
              )}
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", className)} aria-label={label} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{check.title}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{check.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
