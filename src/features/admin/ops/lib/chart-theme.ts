// Shared recharts styling so every admin chart matches the design tokens in light and dark mode.

import type { CSSProperties } from "react";

export const axisTick = { fill: "var(--muted-foreground)", fontSize: 12 };

export const axisProps = {
  tick: axisTick,
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = {
  stroke: "var(--border)",
  strokeDasharray: "3 3",
  vertical: false,
} as const;

export const tooltipContentStyle: CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
};

export const tooltipLabelStyle: CSSProperties = { color: "var(--foreground)", fontWeight: 500, marginBottom: 4 };

export const legendStyle: CSSProperties = { fontSize: 12, color: "var(--muted-foreground)" };

export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--info)", "var(--muted-foreground)"];
