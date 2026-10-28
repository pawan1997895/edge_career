"use client";

import { CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { chartAxisProps, chartTooltipStyle } from "@/features/admin/overview/chart-theme";
import type { CalibrationPoint } from "@/types/admin-content";

const SERIES = [
  { module: "DSA", color: "var(--chart-1)" },
  { module: "SQL", color: "var(--chart-2)" },
  { module: "System design", color: "var(--chart-4)" },
];

/** AI vs human score for each calibration submission. Points between the dashed lines agree within ±5. */
export function CalibrationScatter({ points }: { points: CalibrationPoint[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
          <CartesianGrid stroke="var(--border)" />
          <XAxis type="number" dataKey="human" name="Human" domain={[40, 100]} {...chartAxisProps} label={{ value: "Human score", position: "insideBottom", offset: -4, fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis type="number" dataKey="ai" name="AI" domain={[40, 100]} {...chartAxisProps} />
          <ReferenceLine segment={[{ x: 40, y: 40 }, { x: 100, y: 100 }]} stroke="var(--muted-foreground)" />
          <ReferenceLine segment={[{ x: 40, y: 45 }, { x: 95, y: 100 }]} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <ReferenceLine segment={[{ x: 45, y: 40 }, { x: 100, y: 95 }]} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <Tooltip contentStyle={chartTooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {SERIES.map((s) => (
            <Scatter key={s.module} name={s.module} data={points.filter((p) => p.module === s.module)} fill={s.color} fillOpacity={0.75} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
