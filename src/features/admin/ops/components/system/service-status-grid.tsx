import { Card } from "@/components/ui/card";
import { formatMs } from "@/features/admin/ops/lib/ops-format";
import { cn } from "@/lib/utils";
import type { ServiceState, ServiceStatus } from "@/types/admin-ops";

const STATE: Record<ServiceState, { label: string; dot: string; text: string }> = {
  operational: { label: "Operational", dot: "bg-success", text: "text-success" },
  degraded: { label: "Degraded", dot: "bg-warning", text: "text-warning-foreground dark:text-warning" },
  down: { label: "Down", dot: "bg-destructive", text: "text-destructive" },
};

export function ServiceStatusGrid({ services }: { services: ServiceStatus[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => {
        const state = STATE[s.state];
        return (
          <Card key={s.id} className={cn("gap-2 p-4", s.state !== "operational" && "border-warning/50")}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{s.name}</p>
              <span className={cn("flex items-center gap-1.5 text-xs font-medium", state.text)}>
                <span className={cn("size-2 rounded-full", state.dot)} />
                {state.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{s.description}</p>
            <div className="flex gap-4 text-xs">
              <span>
                <span className="text-muted-foreground">Uptime 30d </span>
                <span className="font-medium tabular-nums">{s.uptime30d}%</span>
              </span>
              {s.latencyMs !== undefined && (
                <span>
                  <span className="text-muted-foreground">Latency </span>
                  <span className="font-medium tabular-nums">{formatMs(s.latencyMs)}</span>
                </span>
              )}
            </div>
            {s.note && <p className={cn("text-xs", s.state !== "operational" ? state.text : "text-muted-foreground")}>{s.note}</p>}
          </Card>
        );
      })}
    </div>
  );
}
