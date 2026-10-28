import { Progress } from "@/components/ui/progress";

/** Runtime and memory against the sandbox limits (2 s / 256 MB by default). */
export function ResourceUsage({
  runtimeMs,
  memoryMb,
  timeLimitMs = 2000,
  memoryLimitMb = 256,
}: {
  runtimeMs: number;
  memoryMb: number;
  timeLimitMs?: number;
  memoryLimitMb?: number;
}) {
  const rows = [
    { label: "Runtime", value: `${runtimeMs.toLocaleString("en-IN")} ms`, limit: `${timeLimitMs / 1000} s`, pct: (runtimeMs / timeLimitMs) * 100 },
    { label: "Memory", value: `${memoryMb} MB`, limit: `${memoryLimitMb} MB`, pct: (memoryMb / memoryLimitMb) * 100 },
  ];
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-[13px]">
            <span>{row.label}</span>
            <span className="tabular-nums text-muted-foreground">
              <span className="font-medium text-foreground">{row.value}</span> of {row.limit}
            </span>
          </div>
          <Progress value={row.pct} tone={row.pct >= 100 ? "destructive" : row.pct >= 75 ? "warning" : "primary"} />
        </div>
      ))}
    </div>
  );
}
