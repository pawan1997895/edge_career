"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { minimalSound } from "./sound";

function Switch({ label, checked, title, onClick }: { label: string; checked: boolean; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={title}
      onClick={onClick}
      className="inline-flex h-8 items-center gap-2 rounded-full border border-(--v3-line) bg-(--v3-surface)/70 pr-1 pl-3 text-xs text-muted-foreground outline-none transition-colors hover:border-(--v3-line-strong) hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--v3-blue)"
    >
      {label}
      <span
        aria-hidden
        className={cn("relative h-5 w-9 rounded-full transition-colors duration-300", checked ? "bg-(image:--v3-gradient)" : "bg-white/12")}
      >
        <motion.span
          initial={false}
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 34 }}
          className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm"
        />
      </span>
    </button>
  );
}

/** Sound on/off (clicks + ambient) and, while on, an Ambient on/off switch. Everything is off until clicked. */
export function SoundControls() {
  const { enabled, ambient } = React.useSyncExternalStore(minimalSound.subscribe, minimalSound.getSnapshot, minimalSound.getServerSnapshot);

  return (
    <div className="flex items-center gap-2">
      <Switch
        label="Sound"
        checked={enabled}
        title={enabled ? "Turn all sound off" : "Turn on soft interface sounds and ambience"}
        onClick={() => minimalSound.toggle()}
      />
      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            key="ambient"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <Switch
              label="Ambient"
              checked={ambient}
              title={ambient ? "Turn the background ambience off (keep clicks)" : "Turn the background ambience on"}
              onClick={() => minimalSound.toggleAmbient()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
