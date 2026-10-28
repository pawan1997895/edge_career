import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OverrideLogEntry } from "@/types/admin-content";

export function OverrideLog({ entries }: { entries: OverrideLogEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual grade overrides</CardTitle>
        <CardDescription>Every reviewer decision, including confirmations. Overrides feed back into the calibration set.</CardDescription>
      </CardHeader>
      <div className="mt-4 border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Learner and item</TableHead>
              <TableHead>AI → final</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => {
              const delta = e.finalScore - e.aiScore;
              return (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap text-[13px] text-muted-foreground">{formatDateTime(e.at)}</TableCell>
                  <TableCell className="whitespace-nowrap text-[13px]">{e.reviewer}</TableCell>
                  <TableCell className="min-w-48">
                    <p className="text-[13px] font-medium">{e.item}</p>
                    <p className="text-xs text-muted-foreground">{e.learner}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      {e.aiScore} <ArrowRight className="size-3 text-muted-foreground" />
                      <span className={cn("font-medium", delta > 0 && "text-success", delta < 0 && "text-destructive")}>{e.finalScore}</span>
                      {delta === 0 && <span className="text-xs text-muted-foreground">confirmed</span>}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-72 text-[13px] text-muted-foreground">{e.reason}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
