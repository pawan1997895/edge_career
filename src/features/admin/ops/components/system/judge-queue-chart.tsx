"use client";

import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { axisProps, gridProps, legendStyle, tooltipContentStyle, tooltipLabelStyle } from "@/features/admin/ops/lib/chart-theme";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import type { QueuePoint } from "@/types/admin-ops";

export function JudgeQueueChart({ data }: { data: QueuePoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Judge queue</CardTitle>
        <CardDescription>Jobs waiting for a sandbox and average wait before a run starts, last 60 minutes.</CardDescription>
      </CardHeader>
      <div className="h-72 px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 288 }}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="time" {...axisProps} />
            <YAxis yAxisId="depth" {...axisProps} width={40} />
            <YAxis yAxisId="wait" orientation="right" {...axisProps} width={44} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(1)}s`} />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value, name) => (name === "Wait time" ? formatMs(Number(value)) : `${value} jobs`)}
            />
            <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            <Area
              yAxisId="depth"
              type="monotone"
              dataKey="depth"
              name="Queue depth"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Line yAxisId="wait" type="monotone" dataKey="waitMs" name="Wait time" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
