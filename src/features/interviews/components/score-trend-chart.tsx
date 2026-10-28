"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ChartColumn } from "lucide-react";
import { INTERVIEW_TYPE_LABELS, type InterviewSummary } from "@/types/interviews";

/** Overall score across past interviews, oldest first. */
export function ScoreTrendChart({ history, className }: { history: InterviewSummary[]; className?: string }) {
  const points = history
    .filter((s) => s.overallScore !== undefined)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .map((s) => ({
      date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(s.startedAt)),
      score: s.overallScore,
      label: `${INTERVIEW_TYPE_LABELS[s.type]} · ${s.title}`,
    }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Score trend</CardTitle>
        <CardDescription>Overall score out of 5 across your scored interviews</CardDescription>
      </CardHeader>
      <CardContent>
        {points.length < 2 ? (
          <EmptyState icon={ChartColumn} title="Not enough interviews yet" description="Complete two scored interviews to see your trend." />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value) => [`${Number(value).toFixed(1)} / 5`, "Overall"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
                />
                <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3, fill: "var(--chart-1)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
