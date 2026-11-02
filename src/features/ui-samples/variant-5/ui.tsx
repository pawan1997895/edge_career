"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./use-reduced-motion";
import styles from "./neon.module.css";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Graphite card. `neon` adds a thin emerald→cyan→violet edge with a soft glow. */
export function Card({ neon = false, className, innerClassName, children }: { neon?: boolean; className?: string; innerClassName?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[22px] p-px",
        neon
          ? "bg-(image:--v5-neon) shadow-[0_0_50px_-18px_var(--v5-emerald),0_30px_80px_-40px_rgb(0_0_0/0.8)]"
          : "bg-(--v5-line) shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      <div className={cn("h-full rounded-[21px] bg-(--v5-card)", innerClassName)}>{children}</div>
    </div>
  );
}

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & { children?: React.ReactNode };

/** Primary action: emerald→cyan gradient with a neon glow and a light sheen on hover. */
export function NeonButton({ className, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled}
      className={cn(
        styles.cta,
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold outline-none",
        "shadow-[0_0_24px_-6px_var(--v5-emerald)] transition-shadow duration-300 hover:shadow-[0_0_36px_-4px_var(--v5-cyan)]",
        "focus-visible:ring-4 focus-visible:ring-(--v5-emerald)/30 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Quiet secondary action on graphite. */
export function GhostButton({ className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={props.disabled ? undefined : { scale: 0.985 }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--v5-line-strong) bg-(--v5-card-2) px-4 text-sm font-semibold text-white outline-none transition-[border-color,box-shadow] duration-200",
        "hover:border-(--v5-emerald)/50 hover:shadow-[0_0_20px_-10px_var(--v5-emerald)] focus-visible:ring-4 focus-visible:ring-(--v5-emerald)/25",
        "disabled:cursor-not-allowed disabled:opacity-35 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Labelled text field with an emerald neon glow on focus. */
export function Field({ id, label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  const invalid = props["aria-invalid"] === true;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-white">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border bg-(--v5-bg)/70 px-4 text-[15px] text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-white/30",
          invalid
            ? "border-destructive/70 shadow-[0_0_0_4px_color-mix(in_oklch,var(--destructive)_16%,transparent)]"
            : "border-(--v5-line-strong) hover:border-white/25 focus:border-(--v5-emerald) focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--v5-emerald)_16%,transparent),0_0_22px_-6px_var(--v5-emerald)]",
        )}
        {...props}
      />
    </div>
  );
}

const CHIP_DOT = {
  emerald: "var(--v5-emerald)",
  cyan: "var(--v5-cyan)",
  violet: "var(--v5-violet)",
  lime: "var(--v5-lime)",
} as const;
export type ChipTone = keyof typeof CHIP_DOT;

/** Graphite tech label with a glowing dot, e.g. `React`, `Python`. */
export function TechChip({ tone = "emerald", lit = true, className, children }: { tone?: ChipTone; lit?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-[border-color,color,background-color] duration-500",
        lit ? "border-(--v5-line-strong) bg-(--v5-card-2) text-white" : "border-(--v5-line) bg-transparent text-white/35",
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full transition-[background-color,box-shadow] duration-500"
        style={lit ? { background: CHIP_DOT[tone], boxShadow: `0 0 8px ${CHIP_DOT[tone]}` } : { background: "oklch(1 0 0 / 0.2)" }}
      />
      {children}
    </span>
  );
}

/** The AI core: a glowing emerald orb inside two turning neon rings. `pulse` changes → it ripples. */
export function AiCore({ size = 96, pulse, className }: { size?: number; pulse?: number; className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <span className={styles.ringB} />
      <span className={styles.ringA} />
      <span className={styles.core} />
      {pulse ? <span key={pulse} className={styles.ripple} /> : null}
    </span>
  );
}

/** A column of binary digits drifting down. Decorative. */
export function DataStream({ digits, className, dur = 9, delay = 0 }: { digits: string; className?: string; dur?: number; delay?: number }) {
  const column = digits.split("");
  return (
    <span
      aria-hidden
      className={cn(styles.mono, "block overflow-hidden text-[11px] leading-[16px] [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]", className)}
    >
      <span className={cn(styles.stream, "flex flex-col items-center")} style={{ "--dur": `${dur}s`, "--delay": `${-delay}s` } as React.CSSProperties}>
        {[...column, ...column].map((d, i) => (
          <span key={i} className={i % 7 === 0 ? "text-(--v5-lime)" : undefined}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

// ---------- Code editor (neon syntax; typing is CSS, the line highlight moves once per line) ----------

export type TokKind = "kw" | "fn" | "str" | "num" | "prop" | "punc" | "com";
export type Tok = readonly [TokKind, string];
export type CodeLine = readonly Tok[];

const TOK_CLASS: Record<TokKind, string> = {
  kw: "text-(--v5-violet)",
  fn: "text-(--v5-cyan)",
  str: "text-(--v5-lime)",
  num: "text-(--v5-emerald)",
  prop: "text-white/90",
  punc: "text-white/45",
  com: "text-white/35 italic",
};

const LINE_H = 24;
const lineLength = (line: CodeLine) => line.reduce((n, [, t]) => n + t.length, 0);

function scheduleLines(lines: readonly CodeLine[], { start = 300, cps = 38, gap = 160 } = {}) {
  let t = start;
  const rows = lines.map((line) => {
    const dur = (Math.max(1, lineLength(line)) * 1000) / cps;
    const row = { start: t, dur };
    t += dur + gap;
    return row;
  });
  return { rows, total: t };
}

function TypedLine({ line, start, dur }: { line: CodeLine; start: number; dur: number }) {
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

/**
 * Compact neon code editor: types each script in turn while a highlight bar follows the line being
 * written and a soft scan sweeps down. ASCII only (typed lines are sized in `ch`). Decorative.
 */
export function NeonEditor({ file, scripts, hold = 3000, className }: { file: string; scripts: readonly (readonly CodeLine[])[]; hold?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const lines = scripts[index]!;
  const { rows } = scheduleLines(lines);

  React.useEffect(() => {
    if (reduceMotion) return;
    const { rows: timing, total } = scheduleLines(scripts[index]!);
    const timers = timing.map((r, i) => setTimeout(() => setActive(i), r.start));
    timers.push(
      setTimeout(() => {
        setIndex((i) => (i + 1) % scripts.length);
        setActive(0);
      }, total + hold),
    );
    return () => timers.forEach(clearTimeout);
  }, [index, hold, scripts, reduceMotion]);

  return (
    <div aria-hidden className={cn("overflow-hidden rounded-2xl border border-(--v5-line-strong) bg-[oklch(0.17_0.008_165)] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.9)]", className)}>
      <div className="flex items-center gap-2 border-b border-(--v5-line) px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-(--v5-violet)/80" />
          <span className="size-2.5 rounded-full bg-(--v5-cyan)/80" />
          <span className="size-2.5 rounded-full bg-(--v5-emerald)/80" />
        </span>
        <span className={cn(styles.mono, "ml-2 text-[11px] text-white/55")}>{file}</span>
        <span className={cn(styles.mono, "ml-auto flex items-center gap-1.5 text-[10px] text-(--v5-emerald)")}>
          <span className={cn(styles.glowPulse, "size-1.5 rounded-full bg-(--v5-emerald)")} /> AI pair
        </span>
      </div>
      <div className={cn(styles.mono, "relative px-4 py-3 text-[12px] leading-6")}>
        <motion.span
          className="absolute inset-x-0 top-3 border-l-2 border-(--v5-emerald) bg-(--v5-emerald)/8"
          style={{ height: LINE_H }}
          initial={false}
          animate={{ y: (reduceMotion ? lines.length - 1 : active) * LINE_H }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {lines.map((line, i) => (
          <div key={`${index}-${i}`} className="relative flex whitespace-pre">
            <span className="w-6 shrink-0 pr-3 text-right text-white/25 select-none">{i + 1}</span>
            <TypedLine line={line} start={rows[i]!.start} dur={rows[i]!.dur} />
            {i === lines.length - 1 && (
              <span
                className={cn(styles.cursorAt, "ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-(--v5-emerald)")}
                style={{ "--start": `${rows[i]!.start}ms` } as React.CSSProperties}
              />
            )}
          </div>
        ))}
        <span className={styles.scan} />
      </div>
    </div>
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
