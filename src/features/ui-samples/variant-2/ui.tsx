"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform, type HTMLMotionProps } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ai-theme/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import styles from "./command.module.css";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Cut-corner HUD panel with a gradient edge and an optional `[01] TITLE ── ● STATUS` header strip. */
export function HudPanel({
  index,
  title,
  status,
  focus = false,
  className,
  bodyClassName,
  children,
}: {
  index?: string;
  title?: string;
  status?: string;
  focus?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(focus && styles.focusGlow, className)}>
      <div className={cn(styles.panel, "h-full")}>
        <div className={cn(styles.panelInner, "flex flex-col")}>
          {title && (
            <div
              aria-hidden
              className="flex items-center gap-2 border-b border-(--v2-line) px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-(--v2-mint)/85 uppercase"
            >
              {index && <span className="text-(--v2-amber)">[{index}]</span>}
              <span className="truncate">{title}</span>
              <span className="h-px min-w-4 flex-1 bg-(--v2-line)" />
              {status && (
                <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                  <span className={cn(styles.pulse, "size-1.5 bg-(--v2-mint)")} />
                  {status}
                </span>
              )}
            </div>
          )}
          <div className={cn("flex-1", bodyClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Small mono label, e.g. `> edge.career/create-account`. */
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[11px] tracking-[0.2em] text-(--v2-mint) uppercase", className)}>{children}</p>;
}

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & { children?: React.ReactNode };

/**
 * Primary action: cut-corner mint-to-ice fill, a breathing halo behind it and a recurring light
 * sweep. The wrapper carries `className` (width) and the focus ring, which the cut shape would clip.
 */
export function CommandButton({ className, children, disabled, ...props }: ButtonProps) {
  return (
    <span
      className={cn(
        "relative isolate inline-flex outline-offset-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-(--v2-mint)",
        className,
      )}
    >
      {!disabled && <span aria-hidden className={styles.ctaHalo} />}
      <motion.button
        whileHover={disabled ? undefined : { y: -1 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        disabled={disabled}
        className={cn(
          styles.cta,
          "relative flex h-12 w-full items-center justify-center overflow-hidden px-6 font-mono text-[13px] font-semibold tracking-[0.14em] uppercase outline-none",
          "disabled:cursor-not-allowed disabled:opacity-35 [&_svg]:size-4 [&_svg]:shrink-0",
        )}
        {...props}
      >
        {!disabled && <span aria-hidden className={styles.ctaSweep} />}
        <span className="relative flex items-center gap-2">{children}</span>
      </motion.button>
    </span>
  );
}

/** Secondary action: dark cut-corner button with a thin inner edge. */
export function GhostButton({ className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={props.disabled ? undefined : { scale: 0.98 }}
      className={cn(
        styles.chamfer,
        "relative inline-flex h-12 items-center justify-center gap-2 bg-(--v2-surface)/80 px-5 font-mono text-[12px] tracking-[0.14em] text-muted-foreground uppercase outline-none",
        "shadow-[inset_0_0_0_1px_var(--v2-line)] transition-colors duration-200 hover:text-foreground hover:shadow-[inset_0_0_0_1px_var(--v2-line-strong)]",
        "focus-visible:text-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--v2-mint)] disabled:cursor-not-allowed disabled:opacity-35 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * A number that counts to `value` (and re-counts when it changes). Screen readers get the
 * final value only; the moving digits are hidden from them.
 */
export function CountUp({ value, pad = 0, duration = 1.2, className }: { value: number; pad?: number; duration?: number; className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => String(Math.round(v)).padStart(pad, "0"));

  React.useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, duration, reduceMotion, count]);

  return (
    <span className={className}>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{String(value).padStart(pad, "0")}</span>
    </span>
  );
}
