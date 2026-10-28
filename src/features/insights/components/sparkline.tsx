import { cn } from "@/lib/utils";

/** Tiny trend line for a series of values (nulls are skipped). */
export function Sparkline({ values, className, width = 72, height = 20 }: { values: (number | null)[]; className?: string; width?: number; height?: number }) {
  const points = values.map((v, i) => ({ v, i })).filter((p): p is { v: number; i: number } => p.v !== null);
  if (points.length < 2) return <span className="text-xs text-muted-foreground">–</span>;

  const min = Math.min(...points.map((p) => p.v));
  const max = Math.max(...points.map((p) => p.v));
  const range = Math.max(1, max - min);
  const step = width / (values.length - 1);
  const path = points.map((p) => `${(p.i * step).toFixed(1)},${(height - 2 - ((p.v - min) / range) * (height - 4)).toFixed(1)}`).join(" ");
  const rising = points[points.length - 1]!.v >= points[0]!.v;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn("overflow-visible", className)} aria-hidden>
      <polyline
        points={path}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={rising ? "stroke-success" : "stroke-destructive"}
      />
    </svg>
  );
}
