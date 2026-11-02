"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AiCore } from "../ui";

export interface Feedback {
  id: number;
  text: string;
}

/** The AI's reaction to a choice: the core ripples and a short "got it" note slides in. Decorative. */
export function AiFeedback({ feedback }: { feedback: Feedback | null }) {
  return (
    <div aria-hidden className="flex min-w-0 items-center gap-3">
      <AnimatePresence initial={false}>
        {feedback && (
          <motion.span
            key={feedback.id}
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="inline-flex min-w-0 items-center gap-1.5 truncate rounded-full border border-(--v5-lime)/35 bg-(--v5-lime)/10 px-3 py-1 text-xs font-semibold text-(--v5-lime)"
          >
            <Check className="size-3.5 shrink-0" strokeWidth={3} />
            <span className="truncate">{feedback.text}</span>
          </motion.span>
        )}
      </AnimatePresence>
      <AiCore size={40} pulse={feedback?.id} />
    </div>
  );
}
