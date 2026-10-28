"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CellOutput } from "@/types/projects";

const axisTick = { fill: "var(--muted-foreground)", fontSize: 11 };
const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

/** Renders one output of a notebook cell: text, error, table or chart. */
export function CellOutputView({ output }: { output: CellOutput }) {
  switch (output.kind) {
    case "text":
      return <pre className="overflow-x-auto font-mono text-[12.5px] leading-relaxed whitespace-pre">{output.text}</pre>;
    case "error":
      return (
        <pre className="overflow-x-auto rounded-md bg-destructive/8 p-2.5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-destructive">
          {output.text}
        </pre>
      );
    case "table":
      return (
        <div className="max-w-full rounded-md border">
          <Table className="text-[12.5px]">
            <TableHeader>
              <TableRow>
                {output.columns.map((c) => (
                  <TableHead key={c} className="font-mono">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {output.rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j} className="font-mono tabular-nums">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    case "chart":
      return (
        <figure className="max-w-xl">
          <figcaption className="mb-2 text-[13px] font-medium">{output.title}</figcaption>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              {output.chartType === "bar" ? (
                <BarChart data={output.data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="x" tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--border)" }} interval={0} />
                  <YAxis tick={axisTick} tickLine={false} axisLine={false} width={44} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => [v, output.yLabel]} />
                  <Bar dataKey="y" fill="var(--chart-1)" radius={[3, 3, 0, 0]} maxBarSize={44} />
                </BarChart>
              ) : (
                <LineChart data={output.data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke="var(--border)" />
                  <XAxis dataKey="x" type="number" domain={[0, 1]} tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                  <YAxis domain={[0, 1]} tick={axisTick} tickLine={false} axisLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, output.yLabel]} labelFormatter={(l) => `${output.xLabel}: ${l}`} />
                  <Line type="monotone" dataKey="y" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-center text-[11px] text-muted-foreground">
            {output.xLabel} vs {output.yLabel}
          </p>
        </figure>
      );
  }
}
