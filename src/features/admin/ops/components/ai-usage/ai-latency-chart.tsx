"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { axisProps, legendStyle, tooltipContentStyle, tooltipLabelStyle } from "@/features/admin/ops/lib/chart-theme";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import type { AiFeatureUsage } from "@/types/admin-ops";

/** Latency spans 0.6 s (interview turns) to over a minute (script drafts), so the axis is logarithmic. */
export function AiLatencyChart({ features }: { features: AiFeatureUsage[] }) {
  const data = features.map((f) => ({ feature: f.feature, p50: f.p50Ms / 1000, p95: f.p95Ms / 1000 }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response time by feature</CardTitle>
        <CardDescription>p50 and p95 in seconds (log scale). Live features use low effort for speed.</CardDescription>
      </CardHeader>
      <div className="h-72 px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 288 }}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              scale="log"
              domain={[0.1, 100]}
              ticks={[0.1, 1, 10, 100]}
              allowDataOverflow
              {...axisProps}
              tickFormatter={(v) => `${v}s`}
            />
            <YAxis type="category" dataKey="feature" {...axisProps} width={132} />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              formatter={(value) => formatMs(Number(value) * 1000)}
            />
            <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            <Bar dataKey="p50" name="p50" fill="var(--chart-1)" radius={[0, 3, 3, 0]} barSize={8} />
            <Bar dataKey="p95" name="p95" fill="var(--chart-3)" radius={[0, 3, 3, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
