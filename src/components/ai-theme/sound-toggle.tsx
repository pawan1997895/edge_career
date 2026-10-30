"use client";

import * as React from "react";
import { VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ambientSound } from "./ambient-sound";
import styles from "./ai-theme.module.css";

const getServerSnapshot = () => false;

/**
 * Sound on/off for the background ambience on sign-up and onboarding. Off until the
 * visitor clicks it; the click is what allows the browser to play audio.
 */
export function SoundToggle({ className }: { className?: string }) {
  const on = React.useSyncExternalStore(ambientSound.subscribe, ambientSound.isPlaying, getServerSnapshot);

  return (
    <motion.button
      type="button"
      aria-pressed={on}
      title={on ? "Turn background sound off" : "Turn on a soft background sound"}
      onClick={() => ambientSound.toggle()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs outline-none transition-[border-color,background-color,box-shadow,color] duration-300",
        "focus-visible:ring-[3px] focus-visible:ring-(--ec-cyan)/40",
        on
          ? "border-(--ec-cyan)/50 bg-(--ec-cyan)/10 text-foreground shadow-[0_0_20px_-8px_var(--ec-cyan)]"
          : "border-border/70 bg-background/40 text-muted-foreground hover:border-(--ec-blue)/50 hover:text-foreground",
        className,
      )}
    >
      {on ? (
        <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
          {[0, 0.25, 0.1, 0.35].map((delay, i) => (
            <span key={i} className={cn(styles.eqBar, "h-full w-[3px] rounded-full bg-(--ec-cyan)")} style={{ animationDelay: `${-delay}s` }} />
          ))}
        </span>
      ) : (
        <VolumeX aria-hidden className="size-3.5" />
      )}
      <span className="sr-only sm:not-sr-only">Sound</span>
      <span aria-hidden className="font-mono text-[10px] tracking-wider">{on ? "ON" : "OFF"}</span>
    </motion.button>
  );
}
