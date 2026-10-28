import { CircleX, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatRelative } from "@/lib/format";
import type { BudgetAlert } from "@/types/admin-ops";

const VARIANT = { info: "info", warning: "warning", critical: "destructive" } as const;
const ICON = { info: Info, warning: TriangleAlert, critical: CircleX } as const;

export function BudgetAlerts({ alerts }: { alerts: BudgetAlert[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {alerts.map((alert) => {
        const Icon = ICON[alert.severity];
        return (
          <Alert key={alert.id} variant={VARIANT[alert.severity]}>
            <Icon />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>
              <p>{alert.detail}</p>
              <p className="mt-1 text-xs">{formatRelative(alert.at)}</p>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}
