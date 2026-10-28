"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { axisProps, legendStyle, tooltipContentStyle, tooltipLabelStyle } from "@/features/admin/ops/lib/chart-theme";
import { formatUSD } from "@/lib/format";
import type { InterviewCostBreakdown } from "@/types/admin-ops";

export function InterviewCostBreakdownCard({ costs }: { costs: InterviewCostBreakdown[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost per interview</CardTitle>
        <CardDescription>Average per session, split into speech-to-text, Claude and text-to-speech (USD).</CardDescription>
      </CardHeader>
      <div className="h-56 px-2 pt-4">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 224 }}>
          <BarChart data={costs} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" {...axisProps} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="type" {...axisProps} width={120} />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              formatter={(value) => formatUSD(Number(value))}
            />
            <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            <Bar dataKey="sttUsd" name="Speech-to-text" stackId="c" fill="var(--chart-2)" barSize={14} />
            <Bar dataKey="llmUsd" name="Claude" stackId="c" fill="var(--chart-1)" barSize={14} />
            <Bar dataKey="ttsUsd" name="Text-to-speech" stackId="c" fill="var(--chart-3)" barSize={14} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="pt-2 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Interview</TableHead>
              <TableHead className="text-right">Avg length</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Per minute</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costs.map((c) => {
              const total = c.sttUsd + c.llmUsd + c.ttsUsd;
              return (
                <TableRow key={c.type}>
                  <TableCell className="font-medium">{c.type}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{c.avgMinutes} min</TableCell>
                  <TableCell className="text-right tabular-nums">{formatUSD(total)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatUSD(total / c.avgMinutes, 3)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
