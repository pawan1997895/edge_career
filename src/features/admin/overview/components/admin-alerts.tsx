import Link from "next/link";
import { ChevronRight, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminAlert } from "@/types/admin-content";

const SEVERITY = {
  critical: { icon: CircleAlert, className: "text-destructive" },
  warning: { icon: TriangleAlert, className: "text-warning" },
  info: { icon: Info, className: "text-info" },
} as const;

export function AdminAlerts({ alerts }: { alerts: AdminAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>Things that need attention now</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        <ul className="divide-y">
          {alerts.map((alert) => {
            const { icon: Icon, className } = SEVERITY[alert.severity];
            return (
              <li key={alert.id}>
                <Link href={alert.href} className="flex gap-3 px-5 py-3 hover:bg-accent/40">
                  <Icon className={cn("mt-0.5 size-4 shrink-0", className)} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{alert.title}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">{alert.detail}</span>
                  </span>
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
