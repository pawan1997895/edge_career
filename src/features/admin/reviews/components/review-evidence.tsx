import { ClipboardPaste, Copy, Maximize, PanelTopOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VerdictBadge } from "@/components/shared/status-badges";
import { formatDateTime } from "@/lib/format";
import type { IntegrityEvent } from "@/types/admin-content";
import type { TestResult } from "@/types/practice";

export function ReviewTestResults({ tests }: { tests: TestResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hidden test results</CardTitle>
        <CardDescription>Grouped by test file. Learners see only the verdicts.</CardDescription>
      </CardHeader>
      <div className="mt-4 border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Verdict</TableHead>
              <TableHead className="text-right">Runtime</TableHead>
              <TableHead className="text-right">Memory</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="min-w-48 text-[13px]">{t.name}</TableCell>
                <TableCell>
                  <VerdictBadge verdict={t.verdict} />
                </TableCell>
                <TableCell className="text-right tabular-nums text-[13px]">{t.runtimeMs} ms</TableCell>
                <TableCell className="text-right tabular-nums text-[13px]">{t.memoryMb} MB</TableCell>
                <TableCell className="min-w-48 font-mono text-xs text-muted-foreground">
                  {t.expected !== undefined && <>expected {t.expected}, got {t.actual}</>}
                  {t.expected === undefined && t.actual}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

const EVENT_ICON = {
  paste: ClipboardPaste,
  tab_switch: PanelTopOpen,
  similarity: Copy,
  fullscreen_exit: Maximize,
} as const;

export function IntegrityEvents({ events }: { events: IntegrityEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrity log</CardTitle>
        <CardDescription>Pastes, tab switches and similarity matches recorded during the attempt</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No integrity events were recorded.</p>
        ) : (
          <ul className="space-y-2.5">
            {events.map((e, i) => {
              const Icon = EVENT_ICON[e.type];
              return (
                <li key={i} className="flex gap-3 text-[13px]">
                  <Icon className={e.type === "similarity" ? "mt-0.5 size-4 shrink-0 text-destructive" : "mt-0.5 size-4 shrink-0 text-muted-foreground"} />
                  <span className="min-w-0 flex-1">{e.detail}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(e.at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
