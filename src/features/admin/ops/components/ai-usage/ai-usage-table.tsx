import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompact, formatMs } from "@/features/admin/ops/lib/ops-format";
import { formatNumber, formatUSD } from "@/lib/format";
import type { AiFeatureUsage } from "@/types/admin-ops";

export function AiUsageTable({ features, periodLabel }: { features: AiFeatureUsage[]; periodLabel: string }) {
  const totalCost = features.reduce((sum, f) => sum + f.costUsd, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage by feature</CardTitle>
        <CardDescription>
          {periodLabel}. One model for every feature; effort is set per feature: low for speed, high for depth.
        </CardDescription>
      </CardHeader>
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Model · effort</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Tokens in / out</TableHead>
              <TableHead className="text-right">Cache hits</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">p50 / p95</TableHead>
              <TableHead>Prompt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  <div className="font-medium">{f.feature}</div>
                  <div className="max-w-60 truncate text-xs text-muted-foreground">{f.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs text-muted-foreground">{f.model}</code>
                    <Badge variant={f.effort === "high" ? "default" : "secondary"}>{f.effort === "high" ? "High" : "Low"}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(f.calls)}</TableCell>
                <TableCell className="text-right whitespace-nowrap tabular-nums text-muted-foreground">
                  {formatCompact(f.inputTokens)} / {formatCompact(f.outputTokens)}
                </TableCell>
                <TableCell className={f.cacheHitRate < 65 ? "text-right font-medium text-warning-foreground tabular-nums dark:text-warning" : "text-right tabular-nums"}>
                  {f.cacheHitRate}%
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatUSD(f.costUsd, 0)}</TableCell>
                <TableCell className="text-right whitespace-nowrap tabular-nums text-muted-foreground">
                  {formatMs(f.p50Ms)} / {formatMs(f.p95Ms)}
                </TableCell>
                <TableCell>
                  <code className="text-xs">{f.promptVersion}</code>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableCell className="font-medium">Total</TableCell>
              <TableCell />
              <TableCell className="text-right font-medium tabular-nums">{formatNumber(features.reduce((s, f) => s + f.calls, 0))}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="text-right font-semibold tabular-nums">{formatUSD(totalCost, 0)}</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
