"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { axisProps, CHART_COLORS, gridProps, legendStyle, tooltipContentStyle, tooltipLabelStyle } from "@/features/admin/ops/lib/chart-theme";
import { formatUSD } from "@/lib/format";
import type { AiFeatureUsage, DailyAiCost } from "@/types/admin-ops";

export function AiCostChart({ daily, features }: { daily: DailyAiCost[]; features: AiFeatureUsage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily cost by feature</CardTitle>
        <CardDescription>Last 14 days, USD. Every Claude call is logged by the AI layer.</CardDescription>
      </CardHeader>
      <div className="h-72 px-2 pt-4 pb-3">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 288 }}>
          <BarChart data={daily} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="date" {...axisProps} interval={1} />
            <YAxis {...axisProps} width={48} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              formatter={(value) => formatUSD(Number(value), 0)}
            />
            <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            {features.map((f, i) => (
              <Bar
                key={f.id}
                dataKey={f.id}
                name={f.feature}
                stackId="cost"
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                radius={i === features.length - 1 ? [3, 3, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
