"use client";

import * as React from "react";
import { Database } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ProblemDetail } from "@/types/practice";

/** Sample tests (read-only) plus an optional custom input that Run will also execute. */
export function TestCasesPanel({
  problem,
  useCustom,
  onUseCustomChange,
  customInput,
  onCustomInputChange,
}: {
  problem: ProblemDetail;
  useCustom: boolean;
  onUseCustomChange: (value: boolean) => void;
  customInput: string;
  onCustomInputChange: (value: string) => void;
}) {
  const [selected, setSelected] = React.useState(0);

  if (problem.kind === "sql") {
    return (
      <div className="flex items-start gap-3 p-4 text-[13px] text-muted-foreground">
        <Database className="mt-0.5 size-4 shrink-0" />
        <p>
          Run executes your query on the sample dataset from the Schema tab and compares the rows with the reference query. Submit also runs{" "}
          {problem.hiddenTestCount} hidden datasets with edge cases such as ties, empty departments and NULLs.
        </p>
      </div>
    );
  }

  const test = problem.sampleTests[selected];
  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {problem.sampleTests.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "h-7 rounded-md px-2.5 text-xs font-medium transition-colors",
              i === selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent",
            )}
          >
            Case {i + 1}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Switch id="custom-input" checked={useCustom} onCheckedChange={onUseCustomChange} />
          <Label htmlFor="custom-input" className="text-xs font-normal text-muted-foreground">
            Also run custom input
          </Label>
        </div>
      </div>

      {test && (
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Input" value={test.input} />
          <Field label="Expected output" value={test.expected} />
        </div>
      )}

      {useCustom && (
        <div className="grid gap-1.5">
          <Label htmlFor="custom-input-value" className="text-xs text-muted-foreground">
            Custom input (same format as the samples)
          </Label>
          <Textarea
            id="custom-input-value"
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            placeholder={problem.sampleTests[0]?.input}
            rows={3}
            className="font-mono text-[13px]"
          />
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <pre className="overflow-x-auto rounded-md border bg-muted/40 px-3 py-2 font-mono text-[13px] whitespace-pre-wrap">{value}</pre>
    </div>
  );
}
