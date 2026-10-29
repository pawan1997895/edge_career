"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { PRESS_SPRING, stepItem } from "@/components/ai-theme/presets";
import { cn } from "@/lib/utils";

/**
 * A selectable onboarding answer (a radio option). Lifts on hover, presses on click,
 * and glows with a popping check mark when selected. Keyboard and screen-reader
 * behaviour comes from the Radix radio group, as with the shared RadioCard.
 */
export function OptionCard({
  value,
  title,
  description,
  icon,
  className,
}: {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <RadioGroupPrimitive.Item value={value} asChild>
      <motion.button
        type="button"
        variants={stepItem}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={PRESS_SPRING}
        className={cn(
          "group relative flex w-full items-start gap-3 rounded-xl border border-border/70 bg-background/40 p-4 text-left outline-none",
          "transition-[border-color,background-color,box-shadow] duration-300 hover:border-(--ec-blue)/50 hover:bg-background/60",
          "focus-visible:ring-[3px] focus-visible:ring-(--ec-cyan)/40",
          "data-[state=checked]:border-(--ec-cyan)/70 data-[state=checked]:bg-(--ec-blue)/10",
          "data-[state=checked]:shadow-[0_0_0_1px_color-mix(in_oklch,var(--ec-cyan)_35%,transparent),0_12px_32px_-14px_var(--ec-blue)]",
          className,
        )}
      >
        {icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition-colors duration-300 group-data-[state=checked]:border-(--ec-cyan)/50 group-data-[state=checked]:bg-(--ec-cyan)/10 group-data-[state=checked]:text-(--ec-cyan) [&_svg]:size-4.5">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1 pt-0.5">
          <span className="block text-sm font-medium">{title}</span>
          {description && <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>}
        </span>
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-300 group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-linear-to-br group-data-[state=checked]:from-(--ec-cyan) group-data-[state=checked]:to-(--ec-blue)">
          <RadioGroupPrimitive.Indicator asChild>
            <motion.span
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 24 }}
              className="text-background"
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
          </RadioGroupPrimitive.Indicator>
        </span>
      </motion.button>
    </RadioGroupPrimitive.Item>
  );
}
