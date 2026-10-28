// Shared helpers for mastery and readiness displays.

/** Heatmap shade for a mastery score. Buckets keep the legend readable. */
export const MASTERY_BUCKETS = [
  { min: 90, label: "90+", className: "bg-primary" },
  { min: 80, label: "80–89", className: "bg-primary/80" },
  { min: 70, label: "70–79", className: "bg-primary/60" },
  { min: 60, label: "60–69", className: "bg-primary/45" },
  { min: 50, label: "50–59", className: "bg-primary/30" },
  { min: 0, label: "Below 50", className: "bg-primary/15" },
] as const;

export function masteryCellClass(value: number | null) {
  if (value === null) return "bg-muted";
  return MASTERY_BUCKETS.find((b) => value >= b.min)!.className;
}

export function average(values: number[]) {
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
}

export type ReadinessStatus = "ready" | "close" | "building";

export function readinessStatus(score: number, target: number): ReadinessStatus {
  if (score >= target) return "ready";
  if (target - score <= 8) return "close";
  return "building";
}

export const READINESS_STATUS_LABEL: Record<ReadinessStatus, { label: string; variant: "success" | "warning" | "secondary" }> = {
  ready: { label: "At the bar", variant: "success" },
  close: { label: "Close", variant: "warning" },
  building: { label: "Building", variant: "secondary" },
};

const shortDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

export function formatWeek(iso: string) {
  return shortDate.format(new Date(iso));
}
