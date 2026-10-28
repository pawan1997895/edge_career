import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SttVendorTrial } from "@/types/admin-ops";

const DECISION = {
  selected: { label: "Selected", variant: "success" },
  backup: { label: "Backup", variant: "info" },
  rejected: { label: "Rejected", variant: "muted" },
} as const;

/** Speech-to-text vendors were trialled on Indian English accents before choosing one. */
export function SttVendorTrials({ vendors, accentGroups }: { vendors: SttVendorTrial[]; accentGroups: string[] }) {
  const best = Object.fromEntries(accentGroups.map((g) => [g, Math.min(...vendors.map((v) => v.wer[g] ?? Infinity))]));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech-to-text trial on Indian English</CardTitle>
        <CardDescription>
          Word error rate (%) on 1,200 recorded interview answers per accent group, including Hindi–English code-switching. Lower is
          better; the best per group is bold.
        </CardDescription>
      </CardHeader>
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              {accentGroups.map((g) => (
                <TableHead key={g} className="text-right">
                  {g}
                </TableHead>
              ))}
              <TableHead className="text-right">First word</TableHead>
              <TableHead className="text-right">Cost / min</TableHead>
              <TableHead>Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((v) => (
              <TableRow key={v.vendor}>
                <TableCell>
                  <div className="font-medium">{v.vendor}</div>
                  <div className="max-w-56 text-xs text-muted-foreground">{v.note}</div>
                </TableCell>
                {accentGroups.map((g) => (
                  <TableCell key={g} className={cn("text-right tabular-nums", v.wer[g] === best[g] ? "font-semibold" : "text-muted-foreground")}>
                    {v.wer[g]?.toFixed(1)}
                  </TableCell>
                ))}
                <TableCell className="text-right tabular-nums">{v.latencyMs} ms</TableCell>
                <TableCell className="text-right tabular-nums">{formatUSD(v.costPerMinUsd, 4)}</TableCell>
                <TableCell>
                  <Badge variant={DECISION[v.decision].variant}>{DECISION[v.decision].label}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
