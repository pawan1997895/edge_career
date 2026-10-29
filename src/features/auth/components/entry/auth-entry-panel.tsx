"use client";

import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "@/components/ai-theme/presets";

/**
 * Title, description, form and footer of the sign-in / sign-up card.
 * Mounts fresh on each page, so switching pages replays the staggered entrance.
 * Motion children inside `children` (the form) join the same stagger.
 */
export function AuthEntryPanel({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="text-2xl font-semibold tracking-tight">
        {title}
      </motion.h1>
      {description && (
        <motion.p variants={fadeUp} className="mt-1.5 text-sm text-muted-foreground">
          {description}
        </motion.p>
      )}
      <div className="mt-6">{children}</div>
      {footer && (
        <motion.div variants={fadeUp} className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </motion.div>
      )}
    </motion.div>
  );
}
