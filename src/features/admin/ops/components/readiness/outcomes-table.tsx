import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OutcomeSummary } from "@/types/admin-ops";

/** Real interview outcomes reported by learners, collected from launch to calibrate readiness later. */
export function OutcomesTable({ outcomes }: { outcomes: OutcomeSummary[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported interview outcomes</CardTitle>
        <CardDescription>
          Learners report real interviews from their readiness page. A company is calibrated once it has {outcomes[0]?.required ?? 50}{" "}
          outcomes.
        </CardDescription>
      </CardHeader>
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Outcomes</TableHead>
              <TableHead className="text-right">Offers</TableHead>
              <TableHead className="text-right">Avg rounds reached</TableHead>
              <TableHead>Calibration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outcomes.map((o) => {
              const ready = o.outcomes >= o.required;
              return (
                <TableRow key={o.company}>
                  <TableCell className="font-medium">{o.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(o.outcomes / o.required) * 100} tone={ready ? "success" : "primary"} className="w-20" aria-label="Outcomes collected" />
                      <span className="tabular-nums text-muted-foreground">
                        {o.outcomes} / {o.required}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {o.offers} <span className="text-muted-foreground">({Math.round((o.offers / o.outcomes) * 100)}%)</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {o.avgRoundsReached.toFixed(1)} of {o.totalRounds}
                  </TableCell>
                  <TableCell>
                    {ready ? <Badge variant="success">Calibrated</Badge> : <Badge variant="muted">Needs {o.required - o.outcomes} more</Badge>}
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
