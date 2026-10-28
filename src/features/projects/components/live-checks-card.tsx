"use client";

import { CircleCheck, CircleX, ExternalLink, Globe, LoaderCircle, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { DEMO_NOW, formatRelative } from "@/lib/format";
import type { LiveCheck } from "@/types/projects";

/** Health checks against the learner's deployed URL. "Re-check" simulates a fresh probe. */
export function LiveChecksCard({ liveUrl, checks }: { liveUrl?: string; checks: LiveCheck[] }) {
  const recheck = useSimulatedAction(() => checks.map((c) => ({ ...c, lastCheckedAt: DEMO_NOW })), 1500);
  const rows = recheck.data ?? checks;
  const passing = rows.filter((c) => c.passed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" /> Live URL checks
        </CardTitle>
        <CardDescription>
          {liveUrl ? (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[12.5px] hover:text-foreground">
              {liveUrl} <ExternalLink className="size-3" />
            </a>
          ) : (
            "Add the public URL of your deployment to enable checks."
          )}
        </CardDescription>
        {checks.length > 0 && (
          <CardAction>
            <Button variant="outline" size="sm" onClick={recheck.run} disabled={recheck.isLoading}>
              {recheck.isLoading ? <LoaderCircle className="animate-spin" /> : <RefreshCw />} Re-check
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className={checks.length ? "px-0 pb-2" : undefined}>
        {checks.length === 0 ? (
          <EmptyState icon={Globe} title="No live checks for this project" description="This project is graded without a deployed URL." />
        ) : (
          <>
            <p className="px-5 pb-3 text-sm text-muted-foreground">
              {passing} of {rows.length} passing · checked every 10 minutes from Mumbai, Singapore and Frankfurt
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Checked</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={recheck.isLoading ? "opacity-50" : undefined}>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <span className="font-mono text-[12.5px]">
                        <span className="text-muted-foreground">{c.method}</span> {c.path}
                      </span>
                      {c.note && <p className="mt-0.5 max-w-xs text-xs whitespace-normal text-muted-foreground">{c.note}</p>}
                    </TableCell>
                    <TableCell className="tabular-nums">{c.expectedStatus}</TableCell>
                    <TableCell className="tabular-nums">{c.actualStatus ?? <span className="text-muted-foreground">Timeout</span>}</TableCell>
                    <TableCell className="tabular-nums">{c.latencyMs !== null ? `${c.latencyMs} ms` : "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatRelative(c.lastCheckedAt)}</TableCell>
                    <TableCell>
                      {c.passed ? (
                        <Badge variant="success">
                          <CircleCheck /> Pass
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <CircleX /> Fail
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
