"use client";

import * as React from "react";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import type { QueueStats } from "@/types/admin-ops";

export function BullQueues({ queues: initial }: { queues: QueueStats[] }) {
  const { toast } = useToast();
  const [queues, setQueues] = React.useState(initial);
  const [retrying, setRetrying] = React.useState<string | null>(null);

  function retryFailed(name: string) {
    setRetrying(name);
    setTimeout(() => {
      setQueues((current) => current.map((q) => (q.name === name ? { ...q, failed: 0, waiting: q.waiting + q.failed } : q)));
      setRetrying(null);
      toast({ title: "Failed jobs re-queued", description: name, variant: "success" });
    }, 900);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job queues</CardTitle>
        <CardDescription>BullMQ on Redis.</CardDescription>
      </CardHeader>
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Queue</TableHead>
              <TableHead className="text-right">Waiting</TableHead>
              <TableHead className="text-right">Active</TableHead>
              <TableHead className="text-right">Done (1h)</TableHead>
              <TableHead className="text-right">Retrying</TableHead>
              <TableHead className="text-right">Failed</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues.map((q) => (
              <TableRow key={q.name}>
                <TableCell>
                  <code className="text-xs font-medium">{q.name}</code>
                  <div className="text-xs text-muted-foreground">{q.purpose}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{q.waiting}</TableCell>
                <TableCell className="text-right tabular-nums">{q.active}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{formatNumber(q.completedLastHour)}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{q.retrying}</TableCell>
                <TableCell className={q.failed > 0 ? "text-right font-medium text-destructive tabular-nums" : "text-right tabular-nums text-muted-foreground"}>
                  {q.failed}
                </TableCell>
                <TableCell className="text-right">
                  {q.failed > 0 && (
                    <Button variant="ghost" size="sm" disabled={retrying === q.name} onClick={() => retryFailed(q.name)}>
                      {retrying === q.name ? <LoaderCircle className="animate-spin" /> : <RotateCcw />}
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
