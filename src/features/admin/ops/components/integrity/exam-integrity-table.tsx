"use client";

import * as React from "react";
import Link from "next/link";
import { ClipboardPaste, EyeOff, Maximize, PanelTop, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/shared/empty-state";
import { formatOffset } from "@/features/admin/ops/lib/ops-format";
import { formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ExamAttemptIntegrity, IntegrityEventKind } from "@/types/admin-ops";

const RISK_VARIANT = { low: "success", medium: "warning", high: "destructive" } as const;

const EVENT_META: Record<IntegrityEventKind, { label: string; icon: LucideIcon }> = {
  paste: { label: "Paste", icon: ClipboardPaste },
  tab_switch: { label: "Tab switch", icon: PanelTop },
  focus_loss: { label: "Focus lost", icon: EyeOff },
  fullscreen_exit: { label: "Left full screen", icon: Maximize },
};

export function ExamIntegrityTable({ attempts }: { attempts: ExamAttemptIntegrity[] }) {
  const { toast } = useToast();
  const [risk, setRisk] = React.useState<"all" | "medium_high" | "high">("medium_high");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [reviewed, setReviewed] = React.useState<string[]>([]);

  const visible = attempts.filter((a) => (risk === "all" ? true : risk === "high" ? a.risk === "high" : a.risk !== "low"));
  const selected = attempts.find((a) => a.id === openId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam integrity events</CardTitle>
        <CardDescription>Pastes, tab switches and focus loss logged during checkpoint and placement attempts.</CardDescription>
        <CardAction>
          <Select value={risk} onValueChange={(v) => setRisk(v as typeof risk)}>
            <SelectTrigger size="sm" className="w-40" aria-label="Risk filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medium_high">Medium and high risk</SelectItem>
              <SelectItem value="high">High risk only</SelectItem>
              <SelectItem value="all">All attempts</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <div className="pt-3 pb-2">
        {visible.length === 0 ? (
          <div className="px-5 pb-3">
            <EmptyState icon={PanelTop} title="No flagged attempts" description="No attempts match this risk level." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learner</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Pastes</TableHead>
                <TableHead>Tab switches</TableHead>
                <TableHead>Focus lost</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Link href={routes.admin.user(a.learner.id)} className="font-medium hover:underline">
                      {a.learner.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{formatDateTime(a.startedAt)}</div>
                  </TableCell>
                  <TableCell className="max-w-56 truncate">{a.exam}</TableCell>
                  <TableCell className="tabular-nums">{a.score}%</TableCell>
                  <TableCell className={cn("tabular-nums", a.pastes >= 3 && "font-medium text-destructive")}>{a.pastes}</TableCell>
                  <TableCell className={cn("tabular-nums", a.tabSwitches >= 5 && "font-medium text-destructive")}>{a.tabSwitches}</TableCell>
                  <TableCell className="tabular-nums">{a.focusLosses}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={RISK_VARIANT[a.risk]} className="capitalize">
                        {a.risk}
                      </Badge>
                      {reviewed.includes(a.id) && <Badge variant="muted">Reviewed</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setOpenId(a.id)}>
                      Timeline
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setOpenId(null)}>
        <SheetContent className="gap-0 p-0">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.learner.name}</SheetTitle>
                <SheetDescription>
                  {selected.exam} · {formatDateTime(selected.startedAt)} · {selected.durationMin} min · scored {selected.score}%
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4">
                {selected.events.length === 0 ? (
                  <EmptyState icon={PanelTop} title="No events logged" description="The learner stayed in the exam tab for the whole attempt." />
                ) : (
                  <ol className="relative space-y-4 border-l pl-5">
                    {selected.events.map((event, i) => {
                      const meta = EVENT_META[event.kind];
                      return (
                        <li key={i} className="relative">
                          <span className="absolute top-0.5 -left-[29px] flex size-4 items-center justify-center rounded-full border bg-card">
                            <meta.icon className="size-2.5 text-muted-foreground" />
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-xs text-muted-foreground tabular-nums">{formatOffset(event.atSec)}</span>
                            <span className="text-sm font-medium">{meta.label}</span>
                          </div>
                          <p className="mt-0.5 text-[13px] text-muted-foreground">{event.detail}</p>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
              <div className="flex gap-2 border-t p-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setReviewed((r) => [...r, selected.id]);
                    setOpenId(null);
                    toast({ title: "Marked as reviewed", description: `${selected.learner.name} · ${selected.exam}` });
                  }}
                >
                  Mark reviewed
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setOpenId(null);
                    toast({ title: "Escalated to human review", description: "The attempt's score is held until a reviewer decides.", variant: "success" });
                  }}
                >
                  Escalate
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
