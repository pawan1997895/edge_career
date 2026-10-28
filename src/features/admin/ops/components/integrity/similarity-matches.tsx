"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Funnel, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmActionDialog } from "@/features/admin/users/components/confirm-action-dialog";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { LearnerRef, SimilarityMatch, SimilarityStatus } from "@/types/admin-ops";

const STATUS_BADGE: Record<SimilarityStatus, { label: string; variant: "warning" | "muted" | "destructive" }> = {
  open: { label: "Open", variant: "warning" },
  dismissed: { label: "Dismissed", variant: "muted" },
  escalated: { label: "Escalated", variant: "destructive" },
};

export function SimilarityMatches({ matches: initial }: { matches: SimilarityMatch[] }) {
  const { toast } = useToast();
  const [matches, setMatches] = React.useState(initial);
  const [status, setStatus] = React.useState<"all" | SimilarityStatus>("open");
  const [kind, setKind] = React.useState<"all" | "problem" | "exam">("all");
  const [query, setQuery] = React.useState("");

  const visible = matches.filter((m) => {
    if (status !== "all" && m.status !== status) return false;
    if (kind !== "all" && m.sourceKind !== kind) return false;
    const q = query.trim().toLowerCase();
    if (q && !`${m.learnerA.name} ${m.learnerB.name} ${m.source}`.toLowerCase().includes(q)) return false;
    return true;
  });

  function updateStatus(id: string, next: SimilarityStatus) {
    setMatches((current) => current.map((m) => (m.id === id ? { ...m, status: next } : m)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code similarity matches</CardTitle>
        <CardDescription>
          Submissions above 75% similarity to another learner or a known public solution. Short solutions are often similar by nature, so
          check line counts before escalating.
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">Last scan 18:00</Badge>
        </CardAction>
      </CardHeader>
      <div className="flex flex-col gap-2 px-5 pt-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search learner or problem" className="pl-8" />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="sm:w-40" aria-label="Status">
            <Funnel className="text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <SelectTrigger className="sm:w-40" aria-label="Source">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Problems and exams</SelectItem>
            <SelectItem value="problem">Practice problems</SelectItem>
            <SelectItem value="exam">Exams</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-3 pb-2">
        {visible.length === 0 ? (
          <div className="px-5 pb-3">
            <EmptyState
              icon={Search}
              title="No matches for these filters"
              description="Nothing needs attention here. Try another status or clear the search."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatus("all");
                    setKind("all");
                    setQuery("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learners</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Similarity</TableHead>
                <TableHead>Matched lines</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <LearnerLink learner={m.learnerA} />
                      <span className="text-xs text-muted-foreground">
                        and <LearnerLink learner={m.learnerB} muted />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-56 truncate">{m.source}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Badge variant={m.sourceKind === "exam" ? "info" : "secondary"}>{m.sourceKind === "exam" ? "Exam" : "Practice"}</Badge>
                      {m.language}
                    </div>
                  </TableCell>
                  <TableCell>
                    <SimilarityBar value={m.similarity} />
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {m.matchedLines} / {m.totalLines}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatRelative(m.detectedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[m.status].variant}>{STATUS_BADGE[m.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {m.status === "open" ? (
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            updateStatus(m.id, "dismissed");
                            toast({ title: "Match dismissed", description: `${m.source} · ${m.similarity}% similarity` });
                          }}
                        >
                          Dismiss
                        </Button>
                        <EscalateDialog
                          match={m}
                          onEscalate={() => {
                            updateStatus(m.id, "escalated");
                            toast({ title: "Sent to the human review queue", description: `${m.learnerA.name} · ${m.source}`, variant: "success" });
                          }}
                        />
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(m.id, "open")}>
                        Reopen
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}

function EscalateDialog({ match, onEscalate }: { match: SimilarityMatch; onEscalate: () => void }) {
  const [note, setNote] = React.useState("");
  return (
    <ConfirmActionDialog
      trigger={<Button size="sm" variant="outline">Escalate</Button>}
      title="Escalate to human review"
      description={`A reviewer will compare both submissions for ${match.source}. Scores stay unchanged until the review is resolved.`}
      confirmLabel="Escalate"
      canConfirm={note.trim().length > 0}
      onConfirm={onEscalate}
    >
      <div className="grid gap-2">
        <Label htmlFor={`note-${match.id}`}>Note for the reviewer</Label>
        <Textarea
          id={`note-${match.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Same variable names and identical comment on line 14"
        />
      </div>
      <Link href={routes.admin.reviews} className="inline-flex items-center gap-1 text-[13px] text-primary hover:underline">
        Open the review queue <ArrowUpRight className="size-3.5" />
      </Link>
    </ConfirmActionDialog>
  );
}

function LearnerLink({ learner, muted }: { learner: LearnerRef; muted?: boolean }) {
  if (learner.id === "ext") return <span className={cn(muted ? "text-muted-foreground" : "font-medium")}>{learner.name}</span>;
  return (
    <Link href={routes.admin.user(learner.id)} className={cn("hover:underline", muted ? "text-muted-foreground" : "font-medium")}>
      {learner.name}
    </Link>
  );
}

function SimilarityBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", value >= 90 ? "bg-destructive" : "bg-warning")} style={{ width: `${value}%` }} />
      </div>
      <span className="font-medium tabular-nums">{value}%</span>
    </div>
  );
}
