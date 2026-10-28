"use client";

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartAxisProps, chartTooltipStyle } from "@/features/admin/overview/chart-theme";
import type { AgreementTrendPoint } from "@/types/admin-content";

export function AgreementTrendChart({ data, target }: { data: AgreementTrendPoint[]; target: number }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="week" {...chartAxisProps} />
          <YAxis domain={[70, 100]} {...chartAxisProps} tickFormatter={(v: number) => `${v}%`} />
          <ReferenceLine
            y={target}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            label={{ value: `Target ${target}%`, position: "insideTopLeft", fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `${Number(v).toFixed(1)}%`} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="dsa" name="DSA" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sql" name="SQL" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="design" name="System design" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
