import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import type { WorkerPool } from "@/types/admin-ops";

export function WorkerPools({ workers }: { workers: WorkerPool[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Judge worker pool</CardTitle>
        <CardDescription>One sealed container image per language.</CardDescription>
      </CardHeader>
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language</TableHead>
              <TableHead>Busy</TableHead>
              <TableHead className="text-right">Avg run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((w) => {
              const total = w.active + w.idle;
              return (
                <TableRow key={w.image}>
                  <TableCell>
                    <div className="font-medium">{w.language}</div>
                    <code className="text-xs text-muted-foreground">{w.image}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(w.active / total) * 100} tone={w.active / total > 0.8 ? "warning" : "primary"} className="w-16" aria-label="Busy workers" />
                      <span className="tabular-nums text-muted-foreground">
                        {w.active} / {total}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatMs(w.avgRunMs)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
