"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./presets";

/**
 * Smoothly animates its height when the content inside changes (page or step switch,
 * an error message appearing). A 4px inset keeps focus rings from being clipped.
 */
export function AnimatedHeight({ children }: { children: React.ReactNode }) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }}
      className="-m-1 overflow-hidden"
    >
      <div ref={innerRef} className="p-1">
        {children}
      </div>
    </motion.div>
  );
}
