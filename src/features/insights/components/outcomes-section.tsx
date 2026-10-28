"use client";

import * as React from "react";
import { ClipboardList, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/shared/empty-state";
import { ReportOutcomeDialog } from "@/features/insights/components/report-outcome-dialog";
import { formatDate } from "@/lib/format";
import { OUTCOME_LABELS, type InterviewOutcome, type OutcomeResult } from "@/types/insights";

const RESULT_VARIANT: Record<OutcomeResult, "success" | "destructive" | "info" | "muted"> = {
  offer: "success",
  rejected: "destructive",
  awaiting: "info",
  withdrew: "muted",
};

/** The learner's reported interview results, kept in local state for the demo. */
export function OutcomesSection({ initialOutcomes }: { initialOutcomes: InterviewOutcome[] }) {
  const [outcomes, setOutcomes] = React.useState(initialOutcomes);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your interview outcomes</CardTitle>
        <CardDescription>Results you report from real interviews.</CardDescription>
        {outcomes.length > 0 && (
          <CardAction>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Plus /> Report outcome
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className={outcomes.length > 0 ? "px-0 pb-2" : undefined}>
        {outcomes.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No outcomes reported yet"
            description="Had a real interview? Tell us how it went. Every report makes readiness estimates more accurate."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus /> Report an outcome
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Furthest round</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outcomes.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.company}</TableCell>
                  <TableCell>{o.roleLevel}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{o.roundReached}</TableCell>
                  <TableCell>
                    <Badge variant={RESULT_VARIANT[o.result]}>
                      {OUTCOME_LABELS[o.result]}
                      {o.offerCtcLpa ? ` · ₹${o.offerCtcLpa} LPA` : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">{formatDate(o.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <ReportOutcomeDialog
        open={open}
        onOpenChange={setOpen}
        onSaved={(outcome) => {
          setOutcomes((list) => [outcome, ...list]);
          toast({ title: "Outcome saved", description: "Thank you. It will be used to calibrate readiness scores.", variant: "success" });
        }}
      />
    </Card>
  );
}
