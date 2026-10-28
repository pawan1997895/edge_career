"use client";

import { CircleCheck, CircleX, LoaderCircle, Play, RotateCcw } from "lucide-react";
import { CodeEditor } from "@/components/shared/code-editor";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/types/assessments";
import { LANGUAGE_LABELS, type Language } from "@/types/practice";

interface SampleRun {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

/** A plausible wrong output for the demo's failing sample. */
function wrongOutput(expected: string) {
  if (/^-?\d+$/.test(expected)) return String(Number(expected) + 1);
  const lastTrue = expected.lastIndexOf("true");
  if (lastTrue >= 0) return `${expected.slice(0, lastTrue)}false${expected.slice(lastTrue + 4)}`;
  return "(empty)";
}

/** Coding question: language picker, editor and simulated sample-test runs. */
export function CodingQuestion({
  question,
  code,
  language,
  onCodeChange,
  onLanguageChange,
}: {
  question: ExamQuestion;
  code: string;
  language: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
}) {
  const languages = Object.keys(question.starterCode ?? {}) as Language[];
  const starter = question.starterCode?.[language] ?? "";
  const tests = question.sampleTests ?? [];

  const run = useSimulatedAction<SampleRun[]>(() => {
    const untouched = code.trim() === starter.trim();
    // Demo: unchanged starter code fails everything; edited code fails the last sample.
    return tests.map((t, i) => {
      const passed = !untouched && i < tests.length - 1;
      return { ...t, actual: passed ? t.expected : untouched ? "No output" : wrongOutput(t.expected), passed };
    });
  }, 1400);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
          <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
            <SelectTrigger size="sm" aria-label="Language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {LANGUAGE_LABELS[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="hidden text-xs text-muted-foreground sm:inline">2 s · 256 MB per test</span>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => onCodeChange(starter)}>
              <RotateCcw /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={run.run} disabled={run.isLoading}>
              {run.isLoading ? <LoaderCircle className="animate-spin" /> : <Play />} Run sample tests
            </Button>
          </div>
        </div>
        <div className="h-[380px]">
          <CodeEditor value={code} onChange={onCodeChange} language={language} />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <p className="border-b px-4 py-2.5 text-sm font-medium">Sample tests</p>
        {run.status === "loading" && (
          <p className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" /> Running in the sandbox…
          </p>
        )}
        {run.status !== "loading" && (
          <ul className="divide-y">
            {tests.map((t, i) => {
              const result = run.data?.[i];
              return (
                <li key={i} className="grid gap-1 px-4 py-3 text-[13px] sm:grid-cols-[auto_1fr] sm:gap-x-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    {result ? (
                      result.passed ? (
                        <CircleCheck className="size-4 text-success" />
                      ) : (
                        <CircleX className="size-4 text-destructive" />
                      )
                    ) : (
                      <span className="size-4 rounded-full border" />
                    )}
                    Test {i + 1}
                  </span>
                  <div className="min-w-0 space-y-0.5 font-mono text-xs">
                    <p className="break-words">
                      <span className="text-muted-foreground">Input </span>
                      {t.input}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Expected </span>
                      {t.expected}
                    </p>
                    {result && (
                      <p className={cn(!result.passed && "text-destructive")}>
                        <span className="text-muted-foreground">Output </span>
                        {result.actual}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
          Sample tests only. Hidden tests and the AI rubric are scored after you submit the exam.
        </p>
      </div>
    </div>
  );
}
