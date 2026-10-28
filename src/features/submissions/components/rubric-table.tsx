import { Progress } from "@/components/ui/progress";
import type { RubricScore } from "@/types/practice";

/** AI rubric criteria with score and the grader's comment. */
export function RubricTable({ rubric }: { rubric: RubricScore[] }) {
  const total = rubric.reduce((sum, r) => sum + r.score, 0);
  const max = rubric.reduce((sum, r) => sum + r.max, 0);
  return (
    <div className="divide-y rounded-md border">
      {rubric.map((r) => {
        const pct = (r.score / r.max) * 100;
        return (
          <div key={r.criterion} className="grid gap-2 p-3 sm:grid-cols-[minmax(0,12rem)_1fr]">
            <div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{r.criterion}</span>
                <span className="tabular-nums text-muted-foreground sm:hidden">
                  {r.score}/{r.max}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <Progress value={pct} tone={pct >= 80 ? "success" : pct >= 50 ? "warning" : "destructive"} className="flex-1" />
                <span className="hidden w-10 text-right text-xs tabular-nums text-muted-foreground sm:inline">
                  {r.score}/{r.max}
                </span>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">{r.comment}</p>
          </div>
        );
      })}
      <div className="flex items-center justify-between bg-muted/40 p-3 text-sm">
        <span className="font-medium">Rubric score</span>
        <span className="tabular-nums">
          {total}/{max} · <span className="font-semibold">{Math.round((total / max) * 100)}%</span>
        </span>
      </div>
    </div>
  );
}
