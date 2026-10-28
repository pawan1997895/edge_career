"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartAxisProps, chartTooltipStyle } from "@/features/admin/overview/chart-theme";
import { formatUSD } from "@/lib/format";
import type { FeatureCost } from "@/types/admin-content";

export function FeatureCostChart({ data }: { data: FeatureCost[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
          <XAxis type="number" {...chartAxisProps} tickFormatter={(v: number) => `$${v}`} />
          <YAxis type="category" dataKey="feature" {...chartAxisProps} width={128} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            cursor={{ fill: "var(--muted)" }}
            formatter={(value) => [formatUSD(Number(value)), "Cost today"]}
          />
          <Bar dataKey="costUsd" fill="var(--chart-1)" radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
