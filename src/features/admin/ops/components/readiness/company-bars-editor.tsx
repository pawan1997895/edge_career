"use client";

import * as React from "react";
import { LoaderCircle, RotateCcw, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CompanyBar, ReadinessLevel } from "@/types/admin-ops";

const LEVELS: ReadinessLevel[] = ["SDE 1", "SDE 2", "SDE 3"];

function isValid(value: string) {
  const n = Number(value);
  return value.trim() !== "" && Number.isInteger(n) && n >= 50 && n <= 100;
}

/** Company × level matrix of expert-set readiness bars. Calibrated companies are read-only. */
export function CompanyBarsEditor({ bars }: { bars: CompanyBar[] }) {
  const { toast } = useToast();
  const initial = React.useMemo(() => Object.fromEntries(bars.map((b) => [b.id, String(b.bar)])), [bars]);
  const [baseline, setBaseline] = React.useState<Record<string, string>>(initial);
  const [values, setValues] = React.useState<Record<string, string>>(initial);

  const companies = [...new Set(bars.map((b) => b.company))];
  const changed = Object.keys(values).filter((id) => values[id] !== baseline[id]);
  const invalid = Object.keys(values).filter((id) => !isValid(values[id]!));

  const save = useSimulatedAction(() => {
    setBaseline(values);
    toast({ title: "Readiness bars saved", description: `${changed.length} bars updated. Learner estimates refresh tonight.`, variant: "success" });
  }, 1000);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company readiness bars</CardTitle>
        <CardDescription>
          The score a learner needs to show as &ldquo;ready&rdquo; for each company and level. Set by the expert panel until a company has
          enough real outcomes to calibrate from.
        </CardDescription>
        <CardAction className="flex gap-2">
          <Button variant="outline" size="sm" disabled={changed.length === 0 || save.isLoading} onClick={() => setValues(baseline)}>
            <RotateCcw /> Reset
          </Button>
          <Button size="sm" disabled={changed.length === 0 || invalid.length > 0 || save.isLoading} onClick={save.run}>
            {save.isLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
            Save{changed.length > 0 && ` (${changed.length})`}
          </Button>
        </CardAction>
      </CardHeader>
      {invalid.length > 0 && <p className="px-5 pt-3 text-[13px] text-destructive">Bars must be whole numbers between 50 and 100.</p>}
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              {LEVELS.map((level) => (
                <TableHead key={level} className="w-28">
                  {level}
                </TableHead>
              ))}
              <TableHead>Source</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => {
              const row = bars.filter((b) => b.company === company);
              const calibrated = row[0]!.setBy !== "Expert panel";
              return (
                <TableRow key={company}>
                  <TableCell className="font-medium">{company}</TableCell>
                  {LEVELS.map((level) => {
                    const bar = row.find((b) => b.level === level)!;
                    const value = values[bar.id] ?? "";
                    return (
                      <TableCell key={level}>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={50}
                          max={100}
                          value={value}
                          disabled={calibrated}
                          aria-label={`${company} ${level} bar`}
                          aria-invalid={!isValid(value) || undefined}
                          onChange={(e) => setValues((v) => ({ ...v, [bar.id]: e.target.value }))}
                          className={cn("h-8 w-20 tabular-nums", value !== baseline[bar.id] && "border-primary bg-accent/40")}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {calibrated ? <Badge variant="success">Calibrated from outcomes</Badge> : <Badge variant="secondary">Expert panel</Badge>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(row[0]!.updatedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
