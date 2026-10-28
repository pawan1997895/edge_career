import { Check, Minus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ComparisonRow, ComparisonValue, Plan } from "@/types/billing";

export function PlanComparisonTable({ plans, rows }: { plans: Plan[]; rows: ComparisonRow[] }) {
  const groups = [...new Set(rows.map((r) => r.group))];
  return (
    <div className="rounded-lg border bg-card">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[45%]">Feature</TableHead>
            {plans.map((plan) => (
              <TableHead key={plan.id} className="text-center">
                {plan.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <GroupRows key={group} group={group} rows={rows.filter((r) => r.group === group)} plans={plans} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function GroupRows({ group, rows, plans }: { group: string; rows: ComparisonRow[]; plans: Plan[] }) {
  return (
    <>
      <TableRow className="bg-muted/50 hover:bg-muted/50">
        <TableCell colSpan={plans.length + 1} className="py-2 text-xs font-medium text-muted-foreground">
          {group}
        </TableCell>
      </TableRow>
      {rows.map((row) => (
        <TableRow key={row.label}>
          <TableCell>{row.label}</TableCell>
          {plans.map((plan) => (
            <TableCell key={plan.id} className="text-center">
              <ComparisonCell value={row.values[plan.id]} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function ComparisonCell({ value }: { value: ComparisonValue }) {
  if (value === true) return <Check className="mx-auto size-4 text-success" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-4 text-muted-foreground" aria-label="Not included" />;
  return <span className="text-[13px]">{value}</span>;
}
