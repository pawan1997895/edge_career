import { VerdictBadge } from "@/components/shared/status-badges";
import type { TestResult, Verdict } from "@/types/practice";
import { VERDICT_LABELS } from "@/types/practice";
import { cn } from "@/lib/utils";

const CELL_TONE: Record<Verdict, string> = {
  accepted: "bg-success/70",
  wrong_answer: "bg-destructive",
  runtime_error: "bg-destructive",
  compile_error: "bg-destructive",
  time_limit_exceeded: "bg-warning",
  memory_limit_exceeded: "bg-warning",
  pending: "bg-muted",
};

/** Sample tests in full (input, expected, actual), hidden tests as a compact pass/fail grid. */
export function TestResults({ tests }: { tests: TestResult[] }) {
  const samples = tests.filter((t) => !t.hidden);
  const hidden = tests.filter((t) => t.hidden);
  const hiddenPassed = hidden.filter((t) => t.verdict === "accepted").length;

  return (
    <div className="space-y-5">
      {samples.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Sample tests</h3>
          {samples.map((t) => (
            <div key={t.id} className="rounded-md border">
              <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
                <span className="text-sm font-medium">{t.name}</span>
                <VerdictBadge verdict={t.verdict} />
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {t.runtimeMs} ms · {t.memoryMb} MB
                </span>
              </div>
              <dl className="grid gap-px bg-border text-[13px] sm:grid-cols-3">
                {[
                  ["Input", t.input],
                  ["Expected", t.expected],
                  ["Your output", t.actual],
                ].map(([label, value]) => (
                  <div key={label} className="bg-card p-3">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd
                      className={cn(
                        "mt-1 font-mono break-all whitespace-pre-wrap",
                        label === "Your output" && t.verdict !== "accepted" && "text-destructive",
                      )}
                    >
                      {value ?? "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}

      {hidden.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Hidden tests</h3>
            <span className="text-xs text-muted-foreground">
              {hiddenPassed} of {hidden.length} passed · inputs stay hidden to keep tests fair
            </span>
          </div>
          <ul className="flex flex-wrap gap-1" aria-label="Hidden test results">
            {hidden.map((t) => (
              <li
                key={t.id}
                title={`${t.name}: ${VERDICT_LABELS[t.verdict]} · ${t.runtimeMs} ms`}
                className={cn("size-4 rounded-[3px]", CELL_TONE[t.verdict])}
              >
                <span className="sr-only">
                  {t.name}: {VERDICT_LABELS[t.verdict]}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Legend tone="bg-success/70" label="Passed" />
            <Legend tone="bg-destructive" label="Wrong answer / error" />
            <Legend tone="bg-warning" label="Time or memory limit" />
          </div>
          <FailedHiddenSummary tests={hidden} />
        </div>
      )}
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-[2px]", tone)} /> {label}
    </span>
  );
}

function FailedHiddenSummary({ tests }: { tests: TestResult[] }) {
  const failed = tests.filter((t) => t.verdict !== "accepted");
  if (failed.length === 0) return null;
  const first = failed[0]!;
  return (
    <p className="mt-3 text-[13px] text-muted-foreground">
      First failure: <span className="font-medium text-foreground">{first.name}</span> ({VERDICT_LABELS[first.verdict].toLowerCase()},{" "}
      {first.runtimeMs} ms). {failed.length} hidden {failed.length === 1 ? "test" : "tests"} failed in total.
    </p>
  );
}
