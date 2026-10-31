"use client";

import * as React from "react";
import { usePrefersReducedMotion } from "@/components/ai-theme/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import styles from "./command.module.css";

// Syntax-coloured code that "writes itself". Typing is CSS (stepped width on mono text), so a
// block costs one React render, not one per character.

export type TokKind = "kw" | "str" | "num" | "fn" | "prop" | "punc" | "com" | "plain";
export type Tok = readonly [TokKind, string];
export type CodeLine = readonly Tok[];

export const TOK_CLASS: Record<TokKind, string> = {
  kw: "text-(--v2-amber)",
  str: "text-(--v2-mint)",
  num: "text-(--v2-ice)",
  fn: "text-(--v2-ice)",
  prop: "text-foreground/90",
  punc: "text-muted-foreground",
  com: "text-muted-foreground/70 italic",
  plain: "text-foreground/80",
};

const lineLength = (line: CodeLine) => line.reduce((n, [, text]) => n + text.length, 0);

/** When each line starts typing and how long it takes (ms). */
export function scheduleLines(lines: readonly CodeLine[], { start = 250, cps = 42, gap = 160 } = {}) {
  let t = start;
  const rows = lines.map((line) => {
    const dur = (Math.max(1, lineLength(line)) * 1000) / cps;
    const row = { start: t, dur };
    t += dur + gap;
    return row;
  });
  return { rows, total: t };
}

export function TypedLine({ line, start, dur, className }: { line: CodeLine; start: number; dur: number; className?: string }) {
  const chars = Math.max(1, lineLength(line));
  return (
    <span
      className={cn(styles.typed, className)}
      style={{ "--chars": chars, "--start": `${start}ms`, "--dur": `${dur}ms` } as React.CSSProperties}
    >
      {lineLength(line) === 0
        ? " "
        : line.map(([kind, text], i) => (
            <span key={i} className={TOK_CLASS[kind]}>
              {text}
            </span>
          ))}
    </span>
  );
}

/** Blinking block cursor that appears at `start` ms. */
export function TypeCursor({ start = 0, className }: { start?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(styles.cursorAt, "ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-(--v2-mint)/85", className)}
      style={{ "--start": `${start}ms` } as React.CSSProperties}
    />
  );
}

/** Types each script in turn, holds it, then moves to the next. Decorative. */
export function CodeLoop({
  scripts,
  hold = 3500,
  cps,
  numbered = false,
  className,
}: {
  scripts: readonly (readonly CodeLine[])[];
  hold?: number;
  cps?: number;
  numbered?: boolean;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);
  const lines = scripts[index]!;
  const { rows, total } = scheduleLines(lines, { cps });

  React.useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % scripts.length), total + hold);
    return () => clearTimeout(timer);
  }, [index, total, hold, scripts.length, reduceMotion]);

  return (
    <div aria-hidden className={cn("font-mono text-xs leading-6", className)}>
      {lines.map((line, i) => (
        // Keyed by script so every line re-types when the script changes.
        <div key={`${index}-${i}`} className="flex whitespace-pre">
          {numbered && <span className="w-7 shrink-0 pr-3 text-right text-muted-foreground/45 select-none">{i + 1}</span>}
          <TypedLine line={line} start={rows[i]!.start} dur={rows[i]!.dur} />
          {i === lines.length - 1 && <TypeCursor start={rows[i]!.start} />}
        </div>
      ))}
    </div>
  );
}
