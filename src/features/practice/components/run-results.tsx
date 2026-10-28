"use client";

import * as React from "react";
import { CircleCheck, CircleX, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOutput } from "@/features/submissions/components/log-output";
import { SqlComparisonView } from "@/features/practice/components/sql-comparison";
import { cn } from "@/lib/utils";
import { VERDICT_LABELS } from "@/types/practice";
import type { DemoVerdict, RunOutcome } from "@/types/submissions";

/** Results of Run: sample tests only, with an output diff for failures. */
export function RunResults({ outcome, demoVerdict, hiddenTestCount }: { outcome: RunOutcome; demoVerdict: DemoVerdict; hiddenTestCount: number }) {
  const [selected, setSelected] = React.useState(() => Math.max(0, outcome.results.findIndex((r) => r.verdict !== "accepted")));

  if (outcome.compileOutput) {
    return (
      <div className="space-y-3 p-4">
        <Headline ok={false} text="Compilation failed" />
        <LogOutput title="Compiler output" log={outcome.compileOutput} />
      </div>
    );
  }
  if (outcome.sqlError) {
    return (
      <div className="space-y-3 p-4">
        <Headline ok={false} text={VERDICT_LABELS[outcome.verdict]} />
        <LogOutput title="PostgreSQL error" log={outcome.sqlError} />
      </div>
    );
  }
  if (outcome.sql) {
    return (
      <div className="p-4">
        <SqlComparisonView comparison={outcome.sql} />
      </div>
    );
  }

  const failed = outcome.results.filter((r) => r.verdict !== "accepted").length;
  const result = outcome.results[selected];

  return (
    <div className="space-y-3 p-4">
      <Headline
        ok={failed === 0}
        text={failed === 0 ? `All ${outcome.results.length} sample tests passed` : `${failed} of ${outcome.results.length} sample tests failed`}
      />
      {failed === 0 && demoVerdict === "time_limit_exceeded" && (
        <Alert variant="warning">
          <Info />
          <AlertDescription>Samples are small. Submit also runs {hiddenTestCount} hidden tests with inputs up to 10⁵ under a 2-second limit.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-1.5">
        {outcome.results.map((r, i) => (
          <button
            key={r.testId}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
              i === selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent",
            )}
          >
            <span className={cn("size-1.5 rounded-full", r.verdict === "accepted" ? "bg-success" : "bg-destructive")} />
            {r.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="space-y-2">
          <p className={cn("text-xs font-medium", result.verdict === "accepted" ? "text-success" : "text-destructive")}>
            {VERDICT_LABELS[result.verdict]} · {result.runtimeMs} ms
          </p>
          <Output label="Input" value={result.input} />
          <div className="grid gap-2 sm:grid-cols-2">
            <Output label="Expected" value={result.expected} />
            <Output label="Your output" value={result.actual || "(no output)"} wrong={result.verdict !== "accepted"} />
          </div>
          {result.stderr && <LogOutput title="stderr" log={result.stderr} />}
        </div>
      )}

      {outcome.customInput && (
        <div className="rounded-md border p-3">
          <p className="text-xs font-medium">Custom input</p>
          <pre className="mt-1 font-mono text-[13px] whitespace-pre-wrap text-muted-foreground">{outcome.customInput}</pre>
          <p className="mt-2 text-xs text-muted-foreground">Ran without errors in 14 ms. Real output appears here once the judge is connected.</p>
        </div>
      )}
    </div>
  );
}

function Headline({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-sm font-semibold", ok ? "text-success" : "text-destructive")}>
      {ok ? <CircleCheck className="size-4" /> : <CircleX className="size-4" />}
      {text}
    </p>
  );
}

function Output({ label, value, wrong = false }: { label: string; value: string; wrong?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <pre
        className={cn(
          "overflow-x-auto rounded-md border bg-muted/40 px-3 py-2 font-mono text-[13px] whitespace-pre-wrap",
          wrong && "border-destructive/40 bg-destructive/8 text-destructive",
        )}
      >
        {value}
      </pre>
    </div>
  );
}
