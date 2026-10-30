"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";
import styles from "./ai-theme.module.css";

/**
 * Types `text` out once, character by character. Give it `key={text}` so a new text
 * starts typing from the beginning. Shows the whole text at once for reduced motion.
 */
export function TypeLine({ text, speed = 22, cursor = false }: { text: string; speed?: number; cursor?: boolean }) {
  const reduceMotion = usePrefersReducedMotion();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || count >= text.length) return;
    const timer = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(timer);
  }, [count, text.length, speed, reduceMotion]);

  return (
    <>
      {reduceMotion ? text : text.slice(0, count)}
      {cursor && <Cursor />}
    </>
  );
}

export function Cursor({ className }: { className?: string }) {
  return <span aria-hidden className={cn(styles.cursor, "ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-(--ec-cyan)/80", className)} />;
}

export interface TerminalLine {
  kind: "cmd" | "ok" | "wait";
  text: string;
  value?: string;
}

const HOLD_MS = 4200; // pause on a finished script before typing the next one

/** Start time and duration (ms) of each part of each line. */
function scriptTimeline(script: TerminalLine[]) {
  let t = 250;
  const lines = script.map((line) => {
    const start = t;
    const labelMs = line.text.length * (line.kind === "cmd" ? 55 : 20);
    t += labelMs;
    const valueStart = t + 120;
    const valueMs = (line.value?.length ?? 0) * 35;
    if (line.value) t = valueStart + valueMs;
    const end = t;
    t += line.kind === "cmd" ? 450 : 280;
    return { line, start, labelMs, valueStart, valueMs, end };
  });
  return { lines, total: t };
}

const typeVars = (chars: number, start: number, ms: number) =>
  ({ "--chars": chars, "--start": `${start}ms`, "--dur": `${ms}ms` }) as React.CSSProperties;
const revealAt = (start: number) => ({ "--start": `${start}ms` }) as React.CSSProperties;

/**
 * A small decorative terminal window that types a script, holds it for a moment, then
 * types the next one. The typing itself is CSS (stepped width on mono text), so React only
 * re-renders once per script. Every row keeps its space so the panel never changes height.
 */
export function CodeTerminal({ title, scripts, className }: { title: string; scripts: TerminalLine[][]; className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);
  const { lines, total } = scriptTimeline(scripts[index]!);

  React.useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % scripts.length), total + HOLD_MS);
    return () => clearTimeout(timer);
  }, [index, total, scripts.length, reduceMotion]);

  return (
    <div
      aria-hidden
      className={cn(
        // Solid tint rather than a backdrop blur: the background animates, so a blur would be redone every frame.
        "overflow-hidden rounded-xl border border-(--ec-blue)/25 bg-(--ec-bg)/90 font-mono text-xs shadow-[0_24px_60px_-34px_var(--ec-blue)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border/50 px-3.5 py-2 text-[11px] text-muted-foreground">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-(--ec-violet)/70" />
          <span className="size-2 rounded-full bg-(--ec-blue)/70" />
          <span className="size-2 rounded-full bg-(--ec-cyan)/70" />
        </span>
        {title}
        <span className="ml-auto flex items-center gap-1.5 text-(--ec-cyan)">
          <span className={cn(styles.hudPulse, "size-1.5 rounded-full bg-(--ec-cyan)")} /> live
        </span>
      </div>
      <div className="space-y-0.5 px-3.5 py-3 leading-5">
        {lines.map(({ line, start, labelMs, valueStart, valueMs, end }, i) => {
          const last = i === lines.length - 1;
          return (
            // Keyed by script so the CSS animations restart for each new script.
            <div key={`${index}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
              <span
                className={cn(
                  styles.reveal,
                  line.kind === "cmd" ? "text-(--ec-violet)" : line.kind === "ok" ? "text-emerald-400" : "text-(--ec-cyan)",
                )}
                style={revealAt(start)}
              >
                {line.kind === "cmd" ? "$" : line.kind === "ok" ? "✓" : "›"}
              </span>
              <span
                className={cn(styles.typed, line.kind === "cmd" ? "text-foreground" : "text-muted-foreground")}
                style={typeVars(line.text.length, start, labelMs)}
              >
                {line.text}
              </span>
              {line.value !== undefined && (
                <>
                  <span className={cn(styles.reveal, "h-px min-w-6 flex-1 border-b border-dotted border-border")} style={revealAt(valueStart)} />
                  <span className={cn(styles.typed, "text-(--ec-cyan)")} style={typeVars(line.value.length, valueStart, valueMs)}>
                    {line.value}
                  </span>
                </>
              )}
              <span
                data-last={last || undefined}
                className={cn(styles.lineCursor, "-ml-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-(--ec-cyan)/80")}
                style={{ "--start": `${start}ms`, "--end": `${end}ms` } as React.CSSProperties}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
