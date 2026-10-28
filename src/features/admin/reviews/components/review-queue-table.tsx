"use client";

import * as React from "react";
import Link from "next/link";
import { Funnel, Inbox, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ConfidenceBadge,
  ITEM_TYPE_LABELS,
  REASON_LABELS,
  ReasonBadge,
  REVIEW_SLA_HOURS,
  ReviewStatusBadge,
  STATUS_LABELS,
  formatWaiting,
  waitingHours,
} from "@/features/admin/reviews/review-labels";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ReviewItemType, ReviewQueueItem, ReviewReason, ReviewStatus } from "@/types/admin-content";

const UNASSIGNED = "__unassigned";

export function ReviewQueueTable({ items, reviewers }: { items: ReviewQueueItem[]; reviewers: string[] }) {
  const { toast } = useToast();
  const [rows, setRows] = React.useState(items);
  const [reason, setReason] = React.useState<"all" | ReviewReason>("all");
  const [type, setType] = React.useState<"all" | ReviewItemType>("all");
  const [status, setStatus] = React.useState<"open" | "all" | ReviewStatus>("open");
  const [assignee, setAssignee] = React.useState("all");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [bulkReviewer, setBulkReviewer] = React.useState(reviewers[0] ?? "");

  const filtered = rows
    .filter(
      (r) =>
        (reason === "all" || r.reason === reason) &&
        (type === "all" || r.itemType === type) &&
        (status === "all" || (status === "open" ? r.status !== "resolved" : r.status === status)) &&
        (assignee === "all" || (assignee === UNASSIGNED ? !r.assignee : r.assignee === assignee)),
    )
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filtered.map((r) => r.id)));
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function assignSelected() {
    setRows((list) => list.map((r) => (selected.has(r.id) ? { ...r, assignee: bulkReviewer } : r)));
    toast({ title: `Assigned ${selected.size} item${selected.size === 1 ? "" : "s"} to ${bulkReviewer}`, variant: "success" });
    setSelected(new Set());
  }

  function clearFilters() {
    setReason("all");
    setType("all");
    setStatus("all");
    setAssignee("all");
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-full md:w-36" aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            {(Object.keys(STATUS_LABELS) as ReviewStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
            <SelectItem value="all">All statuses</SelectItem>
          </SelectContent>
        </Select>
        <Select value={reason} onValueChange={(v) => setReason(v as typeof reason)}>
          <SelectTrigger className="w-full md:w-52" aria-label="Reason">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All reasons</SelectItem>
            {(Object.keys(REASON_LABELS) as ReviewReason[]).map((r) => (
              <SelectItem key={r} value={r}>
                {REASON_LABELS[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-full md:w-36" aria-label="Item type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(Object.keys(ITEM_TYPE_LABELS) as ReviewItemType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {ITEM_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="w-full md:w-44" aria-label="Assignee">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Anyone</SelectItem>
            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
            {reviewers.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border bg-accent/50 px-3 py-2 sm:flex-row sm:items-center">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="flex gap-2 sm:ml-auto">
            <Select value={bulkReviewer} onValueChange={setBulkReviewer}>
              <SelectTrigger size="sm" className="w-40" aria-label="Reviewer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reviewers.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={assignSelected}>
              <UserPlus /> Assign
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        status === "open" && reason === "all" && type === "all" && assignee === "all" ? (
          <EmptyState icon={Inbox} title="The queue is empty" description="Every flagged result has been reviewed. New items appear here automatically." />
        ) : (
          <EmptyState
            icon={Funnel}
            title="No reviews match these filters"
            description="Try another reason or include resolved items."
            action={
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Show everything
              </Button>
            }
          />
        )
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>Learner and item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">AI score</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Waiting (SLA {REVIEW_SLA_HOURS}h)</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const hours = waitingHours(r.submittedAt);
                const late = r.status !== "resolved" && hours > REVIEW_SLA_HOURS;
                return (
                  <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.itemTitle}`} />
                    </TableCell>
                    <TableCell className="min-w-56">
                      <Link href={routes.admin.review(r.id)} className="font-medium hover:text-primary">
                        {r.itemTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {r.learnerName} · {r.moduleTitle}
                      </p>
                    </TableCell>
                    <TableCell className="text-[13px]">{ITEM_TYPE_LABELS[r.itemType]}</TableCell>
                    <TableCell className={cn("text-right font-medium tabular-nums", r.aiScore >= 85 ? "text-success" : "text-warning-foreground dark:text-warning")}>
                      {r.aiScore}
                    </TableCell>
                    <TableCell>
                      <ConfidenceBadge confidence={r.confidence} />
                    </TableCell>
                    <TableCell>
                      <ReasonBadge reason={r.reason} />
                    </TableCell>
                    <TableCell className="min-w-32">
                      {r.status === "resolved" ? (
                        <span className="text-xs text-muted-foreground">Done</span>
                      ) : (
                        <>
                          <span className={cn("text-[13px] tabular-nums", late && "font-medium text-destructive")}>
                            {formatWaiting(hours)} {late && "· overdue"}
                          </span>
                          <span className="mt-1 block h-1 w-24 rounded-full bg-muted">
                            <span
                              className={cn("block h-full rounded-full", late ? "bg-destructive" : hours > 18 ? "bg-warning" : "bg-success")}
                              style={{ width: `${Math.min(100, (hours / REVIEW_SLA_HOURS) * 100)}%` }}
                            />
                          </span>
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px]">{r.assignee ?? <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                    <TableCell>
                      <ReviewStatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
