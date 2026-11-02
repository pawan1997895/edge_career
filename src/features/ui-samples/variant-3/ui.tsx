"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./use-reduced-motion";
import styles from "./minimal.module.css";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft rounded card with a faint gradient highlight along its top edge. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-(--v3-line) bg-(--v3-surface)/85 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-(--v3-blue) to-transparent opacity-70"
      />
      {children}
    </div>
  );
}

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & { children?: React.ReactNode };

/** Primary action: blue-to-violet gradient that shifts on hover, with a soft glow. */
export function PrimaryButton({ className, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      disabled={disabled}
      className={cn(
        styles.primary,
        "relative inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium text-white outline-none",
        "shadow-[0_10px_28px_-14px_var(--v3-blue)] focus-visible:ring-2 focus-visible:ring-(--v3-cyan) focus-visible:ring-offset-2 focus-visible:ring-offset-(--v3-bg)",
        "disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Quiet secondary action. */
export function SecondaryButton({ className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={props.disabled ? undefined : { scale: 0.985 }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--v3-line) bg-white/[0.03] px-4 text-sm font-medium outline-none transition-[border-color,background-color] duration-200",
        "hover:border-(--v3-line-strong) hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-(--v3-blue) disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Labelled text field with a soft glowing focus ring. */
export function TextField({ id, label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  const invalid = props["aria-invalid"] === true;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border bg-(--v3-bg)/60 px-4 text-[15px] text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/50",
          invalid
            ? "border-destructive/70 shadow-[0_0_0_4px_color-mix(in_oklch,var(--destructive)_15%,transparent)]"
            : "border-(--v3-line) hover:border-(--v3-line-strong) focus:border-(--v3-blue) focus:bg-(--v3-bg)/80 focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--v3-blue)_18%,transparent),0_0_24px_-8px_var(--v3-blue)]",
        )}
        {...props}
      />
    </div>
  );
}

const chars = (text: string) => ({ "--chars": Math.max(1, text.length) }) as React.CSSProperties;

/** Small floating code chip that types, holds, erases and repeats (ASCII text only). */
export function CodeChip({ text, dot = "--v3-cyan", delay = 0, className }: { text: string; dot?: string; delay?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        styles.float,
        "inline-flex items-center gap-2 rounded-full border border-(--v3-line) bg-(--v3-surface)/80 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-[0_10px_30px_-15px_rgb(0_0_0/0.8)]",
        className,
      )}
      style={{ "--delay": `${-delay}s` } as React.CSSProperties}
    >
      <span className="size-1.5 rounded-full" style={{ background: `var(${dot})`, boxShadow: `0 0 8px var(${dot})` }} />
      <span className={styles.typeLoop} style={{ ...chars(text), "--delay": `${delay}s` } as React.CSSProperties}>
        {text}
      </span>
    </span>
  );
}

/** Text that types out once when it mounts (key it by its text to re-type on change). ASCII only. */
export function TypeOnce({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn(styles.typeOnce, className)} style={{ ...chars(text), "--dur": `${Math.min(1.2, text.length * 0.03)}s` } as React.CSSProperties}>
      {text}
    </span>
  );
}

export function Cursor() {
  return <span aria-hidden className={cn(styles.cursor, "ml-0.5 inline-block h-[1em] w-[0.45em] translate-y-[0.15em] bg-(--v3-cyan)/80")} />;
}

const ORBIT = ["{}", "AI", "01"] as const;

/** Small glowing "AI" orb with a turning ring and three orbiting symbols. */
export function AiOrb({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn(styles.orb, className)}>
      <span className={styles.orbGlow} />
      <span className={styles.orbRing} />
      <span className={styles.orbCore} />
      <span className={styles.orbit}>
        {ORBIT.map((token, i) => {
          const angle = (i / ORBIT.length) * 360;
          return (
            <span
              key={token}
              className="absolute top-1/2 left-1/2"
              style={{ transform: `rotate(${angle}deg) translateY(-66px) rotate(${-angle}deg)` }}
            >
              <span
                className={cn(
                  styles.upright,
                  "block -translate-x-1/2 -translate-y-1/2 rounded-md border border-(--v3-line) bg-(--v3-surface)/90 px-1.5 py-0.5 font-mono text-[10px] text-(--v3-cyan)",
                )}
              >
                {token}
              </span>
            </span>
          );
        })}
      </span>
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
