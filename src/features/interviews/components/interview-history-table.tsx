"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import {
  INTERVIEW_MODE_LABELS,
  INTERVIEW_TYPE_LABELS,
  type InterviewMode,
  type InterviewSummary,
  type InterviewType,
} from "@/types/interviews";
import { formatInterviewScore, InterviewModeBadge, RecommendationBadge } from "./interview-badges";

type TypeFilter = InterviewType | "all";
type ModeFilter = InterviewMode | "all";

export function InterviewHistoryTable({ history }: { history: InterviewSummary[] }) {
  const [type, setType] = React.useState<TypeFilter>("all");
  const [mode, setMode] = React.useState<ModeFilter>("all");

  const rows = history.filter((s) => (type === "all" || s.type === type) && (mode === "all" || s.mode === mode));

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
        <Select value={type} onValueChange={(v) => setType(v as TypeFilter)}>
          <SelectTrigger size="sm" className="w-44" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(Object.keys(INTERVIEW_TYPE_LABELS) as InterviewType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {INTERVIEW_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={mode} onValueChange={(v) => setMode(v as ModeFilter)}>
          <SelectTrigger size="sm" className="w-36" aria-label="Filter by mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            {(Object.keys(INTERVIEW_MODE_LABELS) as InterviewMode[]).map((m) => (
              <SelectItem key={m} value={m}>
                {INTERVIEW_MODE_LABELS[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} interviews</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews match these filters"
          description="Try another type or mode, or start a new interview."
          className="m-5"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setType("all");
                setMode("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Interview</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Overall</TableHead>
              <TableHead>Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="min-w-56">
                  {s.status === "completed" ? (
                    <Link href={routes.interviewScorecard(s.id)} className="font-medium hover:text-primary hover:underline">
                      {s.title}
                    </Link>
                  ) : (
                    <span className="font-medium text-muted-foreground">{s.title}</span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {INTERVIEW_TYPE_LABELS[s.type]}
                    {s.company && ` · ${s.company} focus`}
                  </p>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(s.startedAt)}</TableCell>
                <TableCell>
                  <InterviewModeBadge mode={s.mode} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{s.durationMin} min</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatInterviewScore(s.overallScore)}</TableCell>
                <TableCell>
                  {s.recommendation ? (
                    <RecommendationBadge recommendation={s.recommendation} />
                  ) : (
                    <Tooltip content={s.note}>
                      <span className="cursor-help text-xs text-muted-foreground underline decoration-dotted underline-offset-2">Not scored</span>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
