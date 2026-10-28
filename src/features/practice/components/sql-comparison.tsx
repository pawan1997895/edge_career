import { CircleCheck, TriangleAlert } from "lucide-react";
import type { SqlComparison, SqlResultSet } from "@/types/submissions";
import { cn } from "@/lib/utils";

/** Your rows next to the reference query's rows, with missing and extra rows highlighted. */
export function SqlComparisonView({ comparison }: { comparison: SqlComparison }) {
  const { missing, extra } = comparison;
  const matches = missing.length === 0 && extra.length === 0;
  return (
    <div className="space-y-3">
      <p className={cn("flex items-center gap-2 text-sm font-medium", matches ? "text-success" : "text-destructive")}>
        {matches ? <CircleCheck className="size-4" /> : <TriangleAlert className="size-4" />}
        {matches
          ? `All ${comparison.expected.rows.length} rows match the reference output (order ignored)`
          : `${missing.length} ${missing.length === 1 ? "row" : "rows"} missing, ${extra.length} extra`}
      </p>
      <div className="grid gap-3 xl:grid-cols-2">
        <ResultTable title="Expected (reference query)" result={comparison.expected} highlighted={missing} tone="missing" />
        <ResultTable title="Your output" result={comparison.actual} highlighted={extra} tone="extra" />
      </div>
      {!matches && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-destructive/25" /> Missing from your output
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-warning/35" /> Not in the expected output
          </span>
        </div>
      )}
    </div>
  );
}

function ResultTable({
  title,
  result,
  highlighted,
  tone,
}: {
  title: string;
  result: SqlResultSet;
  highlighted: number[];
  tone: "missing" | "extra";
}) {
  return (
    <section className="overflow-hidden rounded-md border">
      <header className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5 text-xs">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground">{result.rows.length} rows</span>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              {result.columns.map((c) => (
                <th key={c} className="px-3 py-1.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => {
              const flagged = highlighted.includes(i);
              return (
                <tr
                  key={i}
                  className={cn("border-b last:border-0", flagged && (tone === "missing" ? "bg-destructive/12" : "bg-warning/20"))}
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 whitespace-nowrap">
                      {cell === null ? <span className="text-muted-foreground">NULL</span> : String(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
