"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "../ui";
import styles from "../command.module.css";

/** Child of the step container: rises in, one after another. */
export const stepChild: Variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Cut-corner card frame. Selected: mint edge, tinted fill and one scan down the card. */
export function CardFrame({
  active,
  className,
  innerClassName,
  children,
}: {
  active: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        styles.chamfer,
        "block h-full p-px transition-colors duration-300 [--v2-cut:12px]",
        active ? "bg-(--v2-mint)/75" : "bg-(--v2-line) group-hover:bg-(--v2-line-strong)",
        className,
      )}
    >
      <span
        className={cn(
          styles.chamfer,
          "relative block h-full overflow-hidden transition-colors duration-300 [--v2-cut:12px]",
          active ? "bg-[color-mix(in_oklch,var(--v2-mint)_9%,var(--v2-bg))]" : "bg-(--v2-bg)/92",
          innerClassName,
        )}
      >
        {active && <span aria-hidden className={styles.cardScan} />}
        {children}
      </span>
    </span>
  );
}

/** Target-lock brackets that snap onto a selected card. */
export function LockCorners({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          aria-hidden
          key="lock"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.3, ease: EASE }}
          className="pointer-events-none absolute -inset-1.5"
        >
          <span className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-(--v2-mint)" />
          <span className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-(--v2-amber)" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/** `[01] CODE ... STATE` row at the top of a selectable card. */
export function CardTag({ index, code, active }: { index: number; code: string; active: boolean }) {
  return (
    <span aria-hidden className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase">
      <span className="text-muted-foreground">[{String(index + 1).padStart(2, "0")}]</span>
      <span className="text-(--v2-amber)">{code}</span>
      <span className={cn("ml-auto", active ? "text-(--v2-mint)" : "text-muted-foreground/60")}>{active ? "● Locked" : "Select"}</span>
    </span>
  );
}
