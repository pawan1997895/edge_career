"use client";

import * as React from "react";
import { AudioLines, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { neonSound } from "./sound";

function Switch({ label, icon, checked, title, onClick }: { label: string; icon: React.ReactNode; checked: boolean; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border bg-(--v5-card) pr-1.5 pl-3 text-xs font-semibold outline-none transition-[border-color,box-shadow,color] duration-200 focus-visible:ring-4 focus-visible:ring-(--v5-emerald)/25 [&_svg]:size-3.5",
        checked ? "border-(--v5-emerald)/50 text-(--v5-emerald) shadow-[0_0_18px_-6px_var(--v5-emerald)]" : "border-(--v5-line-strong) text-white/60 hover:text-white",
      )}
    >
      <span aria-hidden>{icon}</span>
      <span className="sr-only sm:not-sr-only">{label}</span>
      <span aria-hidden className={cn("relative h-5 w-9 rounded-full transition-colors duration-300", checked ? "bg-(image:--v5-gradient)" : "bg-white/12")}>
        <motion.span
          initial={false}
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 34 }}
          className={cn("absolute top-0.5 left-0.5 size-4 rounded-full shadow", checked ? "bg-(--v5-ink)" : "bg-white")}
        />
      </span>
    </button>
  );
}

/** Sound on/off (clicks + ambient) and, while on, an Ambient on/off switch. Everything is off until clicked. */
export function SoundToggle() {
  const { enabled, ambient } = React.useSyncExternalStore(neonSound.subscribe, neonSound.getSnapshot, neonSound.getServerSnapshot);

  return (
    <div className="flex items-center gap-2">
      <Switch
        label="Sound"
        icon={enabled ? <Volume2 /> : <VolumeX />}
        checked={enabled}
        title={enabled ? "Turn all sound off" : "Turn on interface sounds and ambience"}
        onClick={() => neonSound.toggle()}
      />
      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            key="ambient"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden p-1"
          >
            <Switch
              label="Ambient"
              icon={<AudioLines />}
              checked={ambient}
              title={ambient ? "Turn the background ambience off (keep clicks)" : "Turn the background ambience on"}
              onClick={() => neonSound.toggleAmbient()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
