import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatRelative } from "@/lib/format";
import type { SentryIssue } from "@/types/admin-ops";

export function SentryIssues({ issues }: { issues: SentryIssue[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent errors</CardTitle>
        <CardDescription>Unresolved Sentry issues across the web app, API, judge and interview agent.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" disabled title="Links to Sentry once monitoring is connected">
            <ExternalLink /> Open Sentry
          </Button>
        </CardAction>
      </CardHeader>
      <ul className="divide-y">
        {issues.map((issue) => (
          <li key={issue.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={issue.level === "error" ? "destructive" : "warning"}>{issue.level === "error" ? "Error" : "Warning"}</Badge>
                <p className="truncate text-sm font-medium">{issue.title}</p>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                <code>{issue.culprit}</code> · {issue.release} · {issue.id}
              </p>
            </div>
            <div className="flex shrink-0 gap-5 text-xs sm:text-right">
              <div>
                <p className="font-medium tabular-nums">{formatNumber(issue.count)}</p>
                <p className="text-muted-foreground">events</p>
              </div>
              <div>
                <p className="font-medium tabular-nums">{issue.users}</p>
                <p className="text-muted-foreground">users</p>
              </div>
              <div className="w-16">
                <p className="font-medium">{formatRelative(issue.lastSeen)}</p>
                <p className="text-muted-foreground">last seen</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
