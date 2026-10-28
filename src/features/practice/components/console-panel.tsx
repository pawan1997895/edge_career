"use client";

import { ChevronDown, ChevronUp, Play, SquareTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerdictBadge } from "@/components/shared/status-badges";
import { JudgeProgress } from "@/features/practice/components/judge-progress";
import { RunResults } from "@/features/practice/components/run-results";
import { SubmitResults } from "@/features/practice/components/submit-results";
import { TestCasesPanel } from "@/features/practice/components/test-cases-panel";
import { cn } from "@/lib/utils";
import type { ProblemDetail } from "@/types/practice";
import type { DemoVerdict, RunOutcome, SubmitOutcome } from "@/types/submissions";

export type ConsoleTab = "tests" | "results";

export interface ConsoleState {
  tab: ConsoleTab;
  open: boolean;
  lastAction: "run" | "submit" | null;
  running: boolean;
  runOutcome?: RunOutcome;
  submitOutcome?: SubmitOutcome;
  /** Bumped on every Run so the results view resets its selected case. */
  runKey: number;
}

/** Bottom panel under the editor: sample test cases and Run/Submit results. */
export function ConsolePanel({
  problem,
  state,
  demoVerdict,
  onTabChange,
  onToggle,
  useCustom,
  onUseCustomChange,
  customInput,
  onCustomInputChange,
  fullResultHref,
}: {
  problem: ProblemDetail;
  state: ConsoleState;
  demoVerdict: DemoVerdict;
  onTabChange: (tab: ConsoleTab) => void;
  onToggle: () => void;
  useCustom: boolean;
  onUseCustomChange: (value: boolean) => void;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  fullResultHref: string;
}) {
  const verdict = state.lastAction === "submit" ? state.submitOutcome?.submission.verdict : state.runOutcome?.verdict;
  const totalTests = problem.sampleTests.length + problem.hiddenTestCount;

  return (
    <Tabs
      value={state.tab}
      onValueChange={(v) => onTabChange(v as ConsoleTab)}
      className={cn("flex shrink-0 flex-col gap-0 border-t bg-card", state.open ? "h-[45%] min-h-56" : "h-10")}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b px-3">
        <TabsList variant="line" className="h-10 w-auto gap-4 border-0">
          <TabsTrigger value="tests" onClick={() => !state.open && onToggle()}>
            Test cases
          </TabsTrigger>
          <TabsTrigger value="results" onClick={() => !state.open && onToggle()}>
            Results
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          {!state.running && verdict && <VerdictBadge verdict={verdict} />}
          <Button variant="ghost" size="icon-sm" onClick={onToggle} aria-label={state.open ? "Collapse console" : "Expand console"}>
            {state.open ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
      </div>
      {state.open && (
        <>
          <TabsContent value="tests" className="min-h-0 flex-1 overflow-y-auto">
            <TestCasesPanel
              problem={problem}
              useCustom={useCustom}
              onUseCustomChange={onUseCustomChange}
              customInput={customInput}
              onCustomInputChange={onCustomInputChange}
            />
          </TabsContent>
          <TabsContent value="results" className="min-h-0 flex-1 overflow-y-auto">
            {state.running && state.lastAction ? (
              <JudgeProgress mode={state.lastAction} testCount={state.lastAction === "run" ? problem.sampleTests.length : totalTests} />
            ) : state.lastAction === "submit" && state.submitOutcome ? (
              <SubmitResults outcome={state.submitOutcome} problem={problem} fullResultHref={fullResultHref} />
            ) : state.lastAction === "run" && state.runOutcome ? (
              <RunResults key={state.runKey} outcome={state.runOutcome} demoVerdict={demoVerdict} hiddenTestCount={problem.hiddenTestCount} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <SquareTerminal className="size-5 text-muted-foreground" />
                <p className="text-sm font-medium">No results yet</p>
                <p className="flex items-center gap-1 text-[13px] text-muted-foreground">
                  Press <Play className="size-3" /> Run to test the samples, or Submit for the full judge.
                </p>
              </div>
            )}
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
