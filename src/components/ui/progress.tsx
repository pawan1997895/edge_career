"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const toneClass = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  muted: "bg-muted-foreground/40",
} as const;

export type ProgressTone = keyof typeof toneClass;

function Progress({
  className,
  value = 0,
  tone = "primary",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { tone?: ProgressTone }) {
  // Values above 100 (e.g. a target exceeded) render as a full bar.
  const clamped = value == null ? value : Math.min(100, Math.max(0, value));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={clamped}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full transition-all", toneClass[tone])}
        style={{ width: `${clamped ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
