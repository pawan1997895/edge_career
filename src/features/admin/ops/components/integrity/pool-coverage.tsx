import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import type { QuestionPoolCoverage } from "@/types/admin-ops";

/** Retakes draw a fresh randomized set, so each pool must be several times larger than one attempt. */
export function PoolCoverage({ pools, repeatTarget }: { pools: QuestionPoolCoverage[]; repeatTarget: number }) {
  const overTarget = pools.filter((p) => p.repeatRate > repeatTarget);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Randomized question pools</CardTitle>
        <CardDescription>
          Retakes draw a fresh set. The repeat rate is the average share of questions a learner sees again on a retake; the target is below{" "}
          {repeatTarget}%.
        </CardDescription>
      </CardHeader>
      {overTarget.length > 0 && (
        <div className="px-5 pt-4">
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>{overTarget.length} pools repeat too many questions</AlertTitle>
            <AlertDescription>
              {overTarget.map((p) => p.exam).join(", ")} need more questions. Aim for a pool at least 8× the questions per attempt.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Pool size</TableHead>
              <TableHead>Per attempt</TableHead>
              <TableHead>Pool ÷ attempt</TableHead>
              <TableHead>Repeat rate</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Refreshed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((p) => {
              const ratio = p.poolSize / p.perAttempt;
              const over = p.repeatRate > repeatTarget;
              return (
                <TableRow key={p.examId}>
                  <TableCell className="font-medium">{p.exam}</TableCell>
                  <TableCell className="tabular-nums">{p.poolSize}</TableCell>
                  <TableCell className="tabular-nums">{p.perAttempt}</TableCell>
                  <TableCell className="tabular-nums">{ratio.toFixed(1)}×</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.repeatRate * 4} tone={over ? "warning" : "success"} className="w-16" aria-label="Repeat rate" />
                      <span className={over ? "font-medium text-warning-foreground tabular-nums dark:text-warning" : "tabular-nums"}>{p.repeatRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{formatNumber(p.attempts)}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(p.lastRefreshed)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
