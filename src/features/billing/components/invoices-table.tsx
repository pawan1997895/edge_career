"use client";

import { Download, Receipt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatINR } from "@/lib/format";
import type { Invoice } from "@/types/billing";

const STATUS: Record<Invoice["status"], { label: string; variant: "success" | "destructive" | "muted" }> = {
  paid: { label: "Paid", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "muted" },
};

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>Amounts include 18% GST. Add your GSTIN in settings for business invoices.</CardDescription>
      </CardHeader>
      <CardContent className={invoices.length ? "px-0 pb-2" : undefined}>
        {invoices.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices yet" description="Invoices appear here after your first payment." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(inv.date)}</TableCell>
                  <TableCell className="min-w-40">{inv.description}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{inv.method}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatINR(inv.amountInr)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS[inv.status].variant}>{STATUS[inv.status].label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Download ${inv.id}`}
                      disabled={inv.status === "failed"}
                      onClick={() => toast({ title: `${inv.id}.pdf downloaded`, variant: "success" })}
                    >
                      <Download />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
