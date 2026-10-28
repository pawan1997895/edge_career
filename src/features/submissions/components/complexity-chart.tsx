"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ComplexityEstimate } from "@/types/practice";

function formatN(n: number) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}k`;
  return String(n);
}

/** Measured runtime against input size, with the time limit drawn when runtimes get close to it. */
export function ComplexityChart({ samples, timeLimitMs = 2000, height = 160 }: { samples: ComplexityEstimate["samples"]; timeLimitMs?: number; height?: number }) {
  const maxMs = Math.max(...samples.map((s) => s.ms));
  const showLimit = maxMs >= timeLimitMs * 0.4;
  const data = samples.map((s) => ({ n: formatN(s.n), ms: s.ms }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="n" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={52}
            domain={[0, showLimit ? Math.max(timeLimitMs, maxMs) : "auto"]}
            tickFormatter={(v: number) => `${v} ms`}
          />
          <Tooltip
            formatter={(value) => [`${value} ms`, "Runtime"]}
            labelFormatter={(label) => `n = ${label}`}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
          />
          {showLimit && (
            <ReferenceLine
              y={timeLimitMs}
              stroke="var(--destructive)"
              strokeDasharray="4 4"
              label={{ value: `${timeLimitMs / 1000}s limit`, position: "insideTopRight", fontSize: 11, fill: "var(--destructive)" }}
            />
          )}
          <Line type="monotone" dataKey="ms" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3, fill: "var(--chart-1)" }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
