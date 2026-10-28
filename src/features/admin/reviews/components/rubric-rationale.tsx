import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RichText } from "@/components/shared/rich-text";
import { cn } from "@/lib/utils";
import type { RubricRationale as Rationale } from "@/types/admin-content";

export function RubricRationale({ rubric }: { rubric: Rationale[] }) {
  const total = rubric.reduce((sum, r) => sum + r.score, 0);
  const max = rubric.reduce((sum, r) => sum + r.max, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI rationale by criterion</CardTitle>
        <CardDescription>
          Rubric total {total} / {max}. Each comment is the grader&apos;s stated reason for the points.
        </CardDescription>
      </CardHeader>
      <div className="mt-4 border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criterion</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead>Rationale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rubric.map((r) => {
              const pct = r.max ? r.score / r.max : 0;
              return (
                <TableRow key={r.criterion}>
                  <TableCell className="min-w-44 align-top">
                    <p className="font-medium">{r.criterion}</p>
                    <p className="text-xs text-muted-foreground">Weight {r.weight}%</p>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right align-top font-medium tabular-nums",
                      pct >= 0.8 ? "text-success" : pct >= 0.5 ? "text-warning-foreground dark:text-warning" : "text-destructive",
                    )}
                  >
                    {r.score} / {r.max}
                  </TableCell>
                  <TableCell className="min-w-64 align-top text-[13px] text-muted-foreground">
                    <RichText text={r.comment} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
