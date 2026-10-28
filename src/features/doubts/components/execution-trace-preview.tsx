"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TraceStep } from "@/types/doubts";

/**
 * Step-by-step execution trace. Real traces from the judge arrive in Phase 2;
 * this preview replays a recorded example.
 */
export function ExecutionTracePreview({ steps, code }: { steps: TraceStep[]; code?: string }) {
  const [index, setIndex] = React.useState(0);
  const step = steps[index]!;
  const lines = code?.split("\n") ?? [];
  const lineText = lines[step.line - 1]?.trim();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          Step {index + 1} of {steps.length} · line {step.line}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setIndex(0)} aria-label="Restart trace" disabled={index === 0}>
            <RotateCcw />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => setIndex((i) => i - 1)} aria-label="Previous step" disabled={index === 0}>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setIndex((i) => i + 1)}
            aria-label="Next step"
            disabled={index === steps.length - 1}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {lineText && (
        <pre className="overflow-x-auto rounded-md border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-xs">
          <span className="mr-3 text-muted-foreground select-none">{step.line}</span>
          {lineText}
        </pre>
      )}
      <p className="text-sm">{step.description}</p>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-xs">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-3 py-1.5 text-left font-medium">Variable</th>
              <th className="px-3 py-1.5 text-left font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono">
            {step.variables.map((v) => (
              <tr key={v.name}>
                <td className="px-3 py-1.5">{v.name}</td>
                <td className="px-3 py-1.5 break-all">{v.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">Call stack:</span>
        {step.stack.length === 0 ? (
          <span className="text-muted-foreground">empty (returned)</span>
        ) : (
          step.stack.map((frame, i) => (
            <span key={`${frame}-${i}`} className="rounded border bg-muted/50 px-1.5 py-0.5 font-mono">
              {frame}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
