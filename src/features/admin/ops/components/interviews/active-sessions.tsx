import Link from "next/link";
import { Mic, MessageSquare, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import { routes } from "@/lib/routes";
import type { ActiveInterviewSession } from "@/types/admin-ops";

const MODE_ICON = { text: MessageSquare, voice: Mic, avatar: Video } as const;

export function ActiveSessions({ sessions, latencyTargetMs }: { sessions: ActiveInterviewSession[]; latencyTargetMs: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live sessions</CardTitle>
        <CardDescription>Interviews running right now.</CardDescription>
        <CardAction>
          <Badge variant="success">
            <span className="size-1.5 rounded-full bg-success" /> {sessions.length} live
          </Badge>
        </CardAction>
      </CardHeader>
      <div className="pt-3 pb-2">
        {sessions.length === 0 ? (
          <div className="px-5 pb-3">
            <EmptyState icon={Mic} title="No live interviews" description="Sessions appear here while they are running." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learner</TableHead>
                <TableHead>Interview</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Elapsed</TableHead>
                <TableHead className="text-right">Avg reply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => {
                const Icon = MODE_ICON[s.mode];
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link href={routes.admin.user(s.learner.id)} className="font-medium hover:underline">
                        {s.learner.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="size-3.5 text-muted-foreground" />
                        {s.type} · <span className="capitalize">{s.mode}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.stage}</TableCell>
                    <TableCell className="text-right tabular-nums">{s.elapsedMin} min</TableCell>
                    <TableCell
                      className={
                        s.avgLatencyMs > latencyTargetMs
                          ? "text-right font-medium text-destructive tabular-nums"
                          : "text-right tabular-nums text-muted-foreground"
                      }
                    >
                      {s.mode === "text" ? "—" : formatMs(s.avgLatencyMs)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}
