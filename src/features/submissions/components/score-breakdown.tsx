import { Progress } from "@/components/ui/progress";
import type { ScoreBreakdown } from "@/types/practice";

/** Shows how the final score is built: hidden tests × 70% + AI rubric × 30%. */
export function ScoreBreakdownView({ score }: { score: ScoreBreakdown }) {
  const rows = [
    { label: "Hidden tests", value: score.tests, weight: score.testsWeight },
    { label: "AI rubric", value: score.rubric, weight: score.rubricWeight },
  ];
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-[13px]">
            <span>
              {row.label} <span className="text-muted-foreground">· {row.weight}% weight</span>
            </span>
            <span className="tabular-nums text-muted-foreground">
              {row.value} × {row.weight}% = <span className="font-medium text-foreground">{((row.value * row.weight) / 100).toFixed(1)}</span>
            </span>
          </div>
          <Progress value={row.value} tone={row.value >= 85 ? "success" : row.value >= 60 ? "warning" : "destructive"} />
        </div>
      ))}
      <div className="flex items-center justify-between border-t pt-3 text-sm">
        <span className="font-medium">Final score</span>
        <span className="font-semibold tabular-nums">{score.total} / 100</span>
      </div>
    </div>
  );
}
