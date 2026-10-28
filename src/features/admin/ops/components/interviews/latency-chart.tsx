"use client";

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { axisProps, gridProps, legendStyle, tooltipContentStyle, tooltipLabelStyle } from "@/features/admin/ops/lib/chart-theme";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import type { LatencyPoint } from "@/types/admin-ops";

export function InterviewLatencyChart({ data, targetMs }: { data: LatencyPoint[]; targetMs: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reply latency</CardTitle>
        <CardDescription>
          Time from the candidate finishing a sentence to the interviewer starting to speak. Target: under {formatMs(targetMs)}.
        </CardDescription>
      </CardHeader>
      <div className="h-72 px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 288 }}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="day" {...axisProps} interval={1} />
            <YAxis {...axisProps} width={48} domain={[0, 2500]} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(1)}s`} />
            <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} formatter={(value) => formatMs(Number(value))} />
            <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            <ReferenceLine
              y={targetMs}
              stroke="var(--destructive)"
              strokeDasharray="4 4"
              label={{ value: "Target", position: "insideTopRight", fill: "var(--destructive)", fontSize: 11 }}
            />
            <Line type="monotone" dataKey="p50Ms" name="p50" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="p95Ms" name="p95" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
