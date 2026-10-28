"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { UsageMonth } from "@/types/billing";

/** Interview minutes used per month against the plan cap. */
export function UsageChart({ data, cap }: { data: UsageMonth[]; cap: number }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} domain={[0, cap + 20]} />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            formatter={(value) => [`${value} min`, "Used"]}
          />
          <ReferenceLine
            y={cap}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            label={{ value: `Cap ${cap} min`, position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Bar dataKey="minutesUsed" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
