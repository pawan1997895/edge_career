"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./use-reduced-motion";
import styles from "./studio.module.css";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Clean white card with a soft lavender shadow. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-3xl border border-(--v4-line) bg-white shadow-(--v4-shadow)", className)}>{children}</div>
  );
}

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & { children?: React.ReactNode };

/** Primary action: a gradient that slowly flows, lifting slightly on hover. */
export function GradientButton({ className, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled}
      className={cn(
        styles.cta,
        "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white outline-none",
        "shadow-[0_12px_28px_-12px_var(--v4-indigo)] transition-shadow duration-300 hover:shadow-[0_18px_36px_-12px_var(--v4-purple)]",
        "focus-visible:ring-4 focus-visible:ring-(--v4-indigo)/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <span aria-hidden className={styles.ctaFlow} />
      {children}
    </motion.button>
  );
}

/** Quiet secondary action on white. */
export function SoftButton({ className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={props.disabled ? undefined : { scale: 0.985 }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-(--v4-line) bg-white px-4 text-sm font-semibold text-(--v4-ink) outline-none transition-[border-color,box-shadow,background-color] duration-200",
        "hover:border-(--v4-indigo)/35 hover:bg-[oklch(0.985_0.01_290)] hover:shadow-[0_8px_20px_-14px_var(--v4-indigo)] focus-visible:ring-4 focus-visible:ring-(--v4-indigo)/20",
        "disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Labelled text field with an indigo glow on focus. */
export function Field({ id, label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  const invalid = props["aria-invalid"] === true;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-2xl border bg-[oklch(0.985_0.006_290)] px-4 text-[15px] text-(--v4-ink) outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-(--v4-muted)/70",
          invalid
            ? "border-destructive/70 shadow-[0_0_0_4px_color-mix(in_oklch,var(--destructive)_14%,transparent)]"
            : "border-(--v4-line) hover:border-(--v4-indigo)/35 focus:border-(--v4-indigo) focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--v4-indigo)_15%,transparent),0_10px_24px_-16px_var(--v4-indigo)]",
        )}
        {...props}
      />
    </div>
  );
}

const TAG_TONES = {
  indigo: "bg-[oklch(0.95_0.04_280)] text-(--v4-indigo)",
  purple: "bg-[oklch(0.95_0.04_305)] text-(--v4-purple)",
  cyan: "bg-[oklch(0.95_0.04_222)] text-[oklch(0.5_0.12_225)]",
  amber: "bg-[oklch(0.96_0.05_80)] text-[oklch(0.5_0.12_65)]",
  teal: "bg-[oklch(0.95_0.04_175)] text-[oklch(0.48_0.1_175)]",
} as const;
export type TagTone = keyof typeof TAG_TONES;

/** Small pastel tech label, e.g. `TS`, `function`, `System Design`. */
export function Tag({ tone = "indigo", mono = false, className, children }: { tone?: TagTone; mono?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        mono && styles.mono,
        TAG_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The friendly AI mentor: a glossy orb with blinking eyes and a small smile. Decorative. */
export function AiBuddy({ size = 64, className }: { size?: number; className?: string }) {
  const eye = { width: size * 0.11, height: size * 0.16 };
  return (
    <span aria-hidden className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <span className={styles.buddyRing} />
      <span className={cn(styles.buddy, "absolute inset-0 flex flex-col items-center justify-center")}>
        <span className="flex" style={{ gap: size * 0.16 }}>
          <span className={styles.eye} style={eye} />
          <span className={styles.eye} style={eye} />
        </span>
        <span
          className="rounded-b-full border-b-2 border-white/90"
          style={{ width: size * 0.2, height: size * 0.08, marginTop: size * 0.06 }}
        />
      </span>
    </span>
  );
}

/** White speech bubble with a small tail pointing left. */
export function SpeechBubble({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative rounded-2xl rounded-tl-md border border-(--v4-line) bg-white px-4 py-3 text-sm shadow-(--v4-shadow)", className)}>
      {children}
    </div>
  );
}

// ---------- Code editor (light syntax colours; typing is CSS, so a script costs one render) ----------

export type TokKind = "kw" | "fn" | "str" | "num" | "prop" | "punc" | "com";
export type Tok = readonly [TokKind, string];
export type CodeLine = readonly Tok[];

const TOK_CLASS: Record<TokKind, string> = {
  kw: "text-(--v4-purple) font-semibold",
  fn: "text-(--v4-indigo)",
  str: "text-[oklch(0.52_0.12_170)]",
  num: "text-[oklch(0.6_0.15_55)]",
  prop: "text-(--v4-ink)",
  punc: "text-(--v4-muted)",
  com: "text-(--v4-muted)/80 italic",
};

const lineLength = (line: CodeLine) => line.reduce((n, [, t]) => n + t.length, 0);

export function scheduleLines(lines: readonly CodeLine[], { start = 300, cps = 40, gap = 150 } = {}) {
  let t = start;
  const rows = lines.map((line) => {
    const dur = (Math.max(1, lineLength(line)) * 1000) / cps;
    const row = { start: t, dur };
    t += dur + gap;
    return row;
  });
  return { rows, total: t };
}

export function TypedLine({ line, start, dur }: { line: CodeLine; start: number; dur: number }) {
  return (
    <span
      className={styles.typed}
      style={{ "--chars": Math.max(1, lineLength(line)), "--start": `${start}ms`, "--dur": `${dur}ms` } as React.CSSProperties}
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

function EditorChrome({ file, className, children }: { file: string; className?: string; children: React.ReactNode }) {
  return (
    <div aria-hidden className={cn("overflow-hidden rounded-2xl border border-(--v4-line) bg-white shadow-(--v4-shadow)", className)}>
      <div className="flex items-center gap-2 border-b border-(--v4-line) bg-[oklch(0.985_0.008_290)] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[oklch(0.75_0.16_25)]" />
          <span className="size-2.5 rounded-full bg-[oklch(0.85_0.15_85)]" />
          <span className="size-2.5 rounded-full bg-[oklch(0.78_0.15_150)]" />
        </span>
        <span className={cn(styles.mono, "ml-2 rounded-md bg-white px-2 py-0.5 text-[11px] text-(--v4-muted) shadow-[0_0_0_1px_var(--v4-line)]")}>{file}</span>
      </div>
      <div className={cn(styles.mono, "px-4 py-3 text-[12.5px] leading-6")}>{children}</div>
    </div>
  );
}

/** Small editor that types each script in turn, holds it, then moves to the next. Decorative. */
export function LoopingEditor({ file, scripts, hold = 3200, className }: { file: string; scripts: readonly (readonly CodeLine[])[]; hold?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const lines = scripts[index]!;
  const { rows, total } = scheduleLines(lines);

  React.useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % scripts.length), total + hold);
    return () => clearTimeout(timer);
  }, [index, total, hold, scripts.length, reduceMotion]);

  return (
    <EditorChrome file={file} className={className}>
      {lines.map((line, i) => (
        <div key={`${index}-${i}`} className="flex whitespace-pre">
          <span className="w-6 shrink-0 pr-3 text-right text-(--v4-muted)/45 select-none">{i + 1}</span>
          <TypedLine line={line} start={rows[i]!.start} dur={rows[i]!.dur} />
          {i === lines.length - 1 && (
            <span
              className={cn(styles.cursorAt, "ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-(--v4-indigo)")}
              style={{ "--start": `${rows[i]!.start}ms` } as React.CSSProperties}
            />
          )}
        </div>
      ))}
    </EditorChrome>
  );
}

/** Editor whose lines are keyed by content: a new or changed line types itself in. Decorative. */
export function LiveEditor({ file, lines, className }: { file: string; lines: { key: string; line: CodeLine }[]; className?: string }) {
  // Lines type one after another on first load; afterwards a changed line types straight away.
  const [settled, setSettled] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <EditorChrome file={file} className={className}>
      {lines.map(({ key, line }, i) => (
        <div key={key} className="flex overflow-hidden whitespace-pre">
          <span className="w-6 shrink-0 pr-3 text-right text-(--v4-muted)/45 select-none">{i + 1}</span>
          <TypedLine line={line} start={settled ? 0 : 300 + i * 160} dur={(Math.max(1, lineLength(line)) * 1000) / 55} />
        </div>
      ))}
    </EditorChrome>
  );
}

/** A number that counts to `value`; screen readers get the final value only. */
export function CountUp({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => String(Math.round(v)));

  React.useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, duration, reduceMotion, count]);

  return (
    <>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{value}</span>
    </>
  );
}

/** Animates its height when the content inside changes size (e.g. between onboarding steps). */
export function AnimatedHeight({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const inner = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");

  React.useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div initial={false} animate={{ height }} transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }} className="-m-2 overflow-hidden">
      <div ref={inner} className="p-2">
        {children}
      </div>
    </motion.div>
  );
}
