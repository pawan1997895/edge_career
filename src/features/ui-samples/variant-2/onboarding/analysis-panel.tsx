"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { OnboardingAnswers } from "@/features/onboarding/steps";
import { TypedLine, type CodeLine, type Tok } from "../code";
import { HudPanel } from "../ui";

export interface LogEntry {
  id: number;
  time: string;
  text: string;
}

const CPS = 55;
const durationOf = (line: CodeLine) => (Math.max(1, line.reduce((n, [, t]) => n + t.length, 0)) * 1000) / CPS;

function field(name: string, value: string | undefined): CodeLine {
  const val: Tok[] = value ? [["str", `"${value}"`], ["punc", ","]] : [["kw", "null"], ["punc", ","], ["com", " // awaiting"]];
  return [["prop", `  ${name}`], ["punc", ": "], ...val];
}

/** The answers so far as a small TypeScript object. Each line is keyed by its content, so a changed line re-types. */
function configLines(a: OnboardingAnswers): { key: string; line: CodeLine }[] {
  const targets: { key: string; line: CodeLine }[] = a.companies.length
    ? [
        { key: "targets-open", line: [["prop", "  targets"], ["punc", ": ["]] },
        ...a.companies.map((c) => ({ key: `target-${c}`, line: [["str", `    "${c}"`], ["punc", ","]] as CodeLine })),
        { key: "targets-close", line: [["punc", "  ],"]] },
      ]
    : [{ key: "targets-empty", line: [["prop", "  targets"], ["punc", ": [],"], ["com", " // awaiting"]] }];

  return [
    { key: "file", line: [["com", "// profile.config.ts"]] },
    { key: "open", line: [["kw", "export const "], ["prop", "profile"], ["punc", " = {"]] },
    { key: `persona-${a.persona}`, line: field("persona", a.persona) },
    { key: `level-${a.level}`, line: field("level", a.level) },
    ...targets,
    { key: `salary-${a.salary}`, line: field("salary", a.salary) },
    { key: `start-${a.start}`, line: field("start", a.start) },
    { key: "close", line: [["punc", "};"]] },
  ];
}

/**
 * Right-hand panel on wide screens: the profile config writing itself as answers come in, and a
 * log of each action. Decorative; the answers themselves live in the form controls.
 */
export function AnalysisPanel({ answers, log, className }: { answers: OnboardingAnswers; log: LogEntry[]; className?: string }) {
  // Lines type one after another on first load; afterwards, a changed line types straight away.
  const [settled, setSettled] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  const lines = configLines(answers);

  return (
    <HudPanel index="AI" title="analysis" status="live" className={className} bodyClassName="flex flex-col">
      <div aria-hidden className="space-y-px px-4 py-3 font-mono text-[11.5px] leading-[22px]">
        {lines.map(({ key, line }, i) => (
          <div key={key} className="flex overflow-hidden whitespace-pre">
            <span className="w-6 shrink-0 pr-2 text-right text-muted-foreground/40 select-none">{i + 1}</span>
            <TypedLine line={line} start={settled ? 0 : 300 + i * 170} dur={durationOf(line)} />
          </div>
        ))}
      </div>
      <div aria-hidden className="mt-auto border-t border-(--v2-line) px-4 py-3">
        <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-(--v2-amber) uppercase">Event log</p>
        <ol className="space-y-1 font-mono text-[10.5px] leading-5">
          {log.map((entry) => {
            const line: CodeLine = [["str", "> "], ["plain", entry.text]];
            return (
              <li key={entry.id} className={cn("flex gap-2 overflow-hidden whitespace-pre")}>
                <span className="shrink-0 text-muted-foreground/60 tabular-nums">{entry.time}</span>
                <TypedLine line={line} start={0} dur={durationOf(line)} />
              </li>
            );
          })}
        </ol>
      </div>
    </HudPanel>
  );
}
