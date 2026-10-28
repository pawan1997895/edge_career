"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartAxisProps, chartTooltipStyle } from "@/features/admin/overview/chart-theme";
import type { DailySubmissions } from "@/types/admin-content";

export function SubmissionsChart({ data }: { data: DailySubmissions[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="day" {...chartAxisProps} interval="preserveStartEnd" minTickGap={16} />
          <YAxis {...chartAxisProps} />
          <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="code" name="Code" stackId="s" fill="var(--chart-1)" />
          <Bar dataKey="sql" name="SQL" stackId="s" fill="var(--chart-2)" />
          <Bar dataKey="design" name="Design" stackId="s" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
