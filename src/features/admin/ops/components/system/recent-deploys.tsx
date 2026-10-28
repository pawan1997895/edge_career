import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelative } from "@/lib/format";
import type { Deploy } from "@/types/admin-ops";

const DEPLOY_STATUS = {
  success: { label: "Deployed", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  rolled_back: { label: "Rolled back", variant: "warning" },
} as const;

export function RecentDeploys({ deploys }: { deploys: Deploy[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent deploys</CardTitle>
        <CardDescription>Staging → production via CI.</CardDescription>
      </CardHeader>
      <ul className="divide-y">
        {deploys.map((d) => (
          <li key={d.id} className="flex items-center gap-3 px-5 py-3 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate">
                <span className="font-medium">{d.service}</span> <code className="text-xs text-muted-foreground">{d.version}</code>
              </p>
              <p className="text-xs text-muted-foreground">
                {d.author} · {formatRelative(d.at)}
              </p>
            </div>
            <Badge variant={DEPLOY_STATUS[d.status].variant}>{DEPLOY_STATUS[d.status].label}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
