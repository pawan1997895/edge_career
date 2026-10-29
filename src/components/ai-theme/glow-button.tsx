"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./ai-theme.module.css";

/**
 * Primary call to action for sign-in / sign-up: gradient fill, a slowly rotating
 * gradient border, a light sweep on hover and a small press response.
 */
export function GlowButton({
  className,
  children,
  disabled,
  ...props
}: Omit<HTMLMotionProps<"button">, "children"> & { children?: React.ReactNode }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      disabled={disabled}
      className={cn(
        "group relative inline-flex h-11 w-full overflow-hidden rounded-lg p-px text-sm font-medium outline-none transition-shadow duration-300",
        "hover:shadow-[0_14px_40px_-14px_var(--ec-blue)] focus-visible:ring-[3px] focus-visible:ring-(--ec-cyan)/45",
        "disabled:cursor-not-allowed disabled:opacity-75",
        className,
      )}
      {...props}
    >
      <span aria-hidden className={styles.ctaBorder} />
      <span
        className={cn(
          styles.ctaFill,
          "relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[7px] px-4 text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
          "after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-foreground/15 after:opacity-0 after:transition-all after:duration-700",
          "motion-safe:group-hover:after:left-[130%] motion-safe:group-hover:after:opacity-100",
        )}
      >
        {children}
      </span>
    </motion.button>
  );
}
