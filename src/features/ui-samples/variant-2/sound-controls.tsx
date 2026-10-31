"use client";

import * as React from "react";
import { AudioLines, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { commandSound } from "./sound";
import styles from "./command.module.css";

const pill =
  "inline-flex h-8 items-center gap-2 border px-2.5 font-mono text-[10px] tracking-[0.16em] uppercase outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-(--v2-mint)";

/**
 * Sound ON/OFF (interface clicks + ambient) and, while on, an Ambient ON/OFF switch.
 * Everything is off until the visitor clicks Sound.
 */
export function SoundControls() {
  const { enabled, ambient } = React.useSyncExternalStore(commandSound.subscribe, commandSound.getSnapshot, commandSound.getServerSnapshot);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-pressed={enabled}
        title={enabled ? "Turn all sound off" : "Turn on interface sounds and ambient"}
        onClick={() => commandSound.toggle()}
        className={cn(
          pill,
          enabled
            ? "border-(--v2-mint)/60 bg-(--v2-mint)/12 text-(--v2-mint)"
            : "border-(--v2-line) bg-(--v2-bg)/60 text-muted-foreground hover:text-foreground",
        )}
      >
        {enabled ? (
          <span aria-hidden className="flex h-3 items-end gap-[2px]">
            {[0, 0.3, 0.12, 0.42].map((delay, i) => (
              <span key={i} className={cn(styles.eq, "h-full w-[2px] bg-current")} style={{ animationDelay: `${-delay}s` }} />
            ))}
          </span>
        ) : (
          <VolumeX aria-hidden className="size-3.5" />
        )}
        <span className="sr-only sm:not-sr-only">Sound</span>
        <span aria-hidden className="font-semibold">
          {enabled ? "ON" : "OFF"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {enabled && (
          <motion.button
            key="ambient"
            type="button"
            aria-pressed={ambient}
            title={ambient ? "Turn the background ambience off (keep clicks)" : "Turn the background ambience on"}
            onClick={() => commandSound.toggleAmbient()}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className={cn(
              pill,
              ambient
                ? "border-(--v2-amber)/55 bg-(--v2-amber)/10 text-(--v2-amber)"
                : "border-(--v2-line) bg-(--v2-bg)/60 text-muted-foreground hover:text-foreground",
            )}
          >
            <AudioLines aria-hidden className="size-3.5" />
            <span className="sr-only sm:not-sr-only">Ambient</span>
            <span aria-hidden className="font-semibold">
              {ambient ? "ON" : "OFF"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
