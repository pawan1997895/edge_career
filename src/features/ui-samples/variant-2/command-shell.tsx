"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CommandBackground } from "./command-background";
import { v2Paths } from "./paths";
import { commandSound } from "./sound";
import { SoundControls } from "./sound-controls";
import { EASE } from "./ui";
import styles from "./command.module.css";

const TICKER = [
  'module.load("dsa")',
  "01001110",
  "judge.run(hidden_tests)",
  "ai.review(submission)",
  "0x7F3A",
  'interview.mock("system-design")',
  "path.compile()",
  "11010010",
  "hint.next()",
  "checkpoint.unlock(85)",
  "0b1011",
  "notebook.save()",
  "ai.mentor.online",
] as const;

// Live clock and a per-visit session id for the HUD. Client-only values, so the server renders placeholders.
let clockText = "";
let clockTimer = 0;
const clockListeners = new Set<() => void>();
const formatClock = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (!clockTimer) {
    clockText = formatClock();
    clockTimer = window.setInterval(() => {
      clockText = formatClock();
      clockListeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0) {
      window.clearInterval(clockTimer);
      clockTimer = 0;
    }
  };
}

let sessionId = "";
const getSessionId = () => (sessionId ||= Math.random().toString(16).slice(2, 6).toUpperCase() + "-" + Math.random().toString(16).slice(2, 6).toUpperCase());
const noopSubscribe = () => () => {};

function HudReadouts() {
  const clock = React.useSyncExternalStore(subscribeClock, () => clockText, () => "");
  const session = React.useSyncExternalStore(noopSubscribe, getSessionId, () => "");
  return (
    <div aria-hidden className="hidden items-center gap-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase lg:flex">
      <span className="flex items-center gap-1.5 text-(--v2-mint)">
        <span className={cn(styles.pulse, "size-1.5 bg-(--v2-mint)")} /> Link secure
      </span>
      <span>Session {session || "----"}</span>
      <span className="w-[8ch] text-foreground/80 tabular-nums">{clock || "--:--:--"}</span>
    </div>
  );
}

/**
 * Frame for the Design Option 2 sample (sign-up and onboarding): backdrop, HUD bar with sound
 * controls, and a code ticker. It stays mounted between the two pages, so sound carries on;
 * leaving the sample fades it out.
 */
export function CommandShell({ fontClassName, children }: { fontClassName: string; children: React.ReactNode }) {
  React.useEffect(() => {
    commandSound.resumeIfWanted();
    return () => commandSound.shutdown();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(styles.root, fontClassName, "dark relative isolate flex min-h-dvh flex-col overflow-hidden text-foreground")}>
        <CommandBackground />

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-(--v2-line) bg-(--v2-bg)/75 px-4 sm:gap-5 sm:px-6"
        >
          <Link href={v2Paths.hub} className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-(--v2-mint)">
            <span
              aria-hidden
              className={cn(styles.chamfer, "grid size-8 place-items-center bg-linear-to-br from-(--v2-mint) to-(--v2-ice) font-mono text-[11px] font-bold text-(--v2-ink) [--v2-cut:7px]")}
            >
              {"</>"}
            </span>
            <span className={cn(styles.display, "text-[15px] font-semibold tracking-[0.2em]")}>
              EDGE<span className="text-(--v2-mint)">{"//"}</span>CAREER
            </span>
          </Link>
          <span className="hidden border border-(--v2-amber)/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] text-(--v2-amber) uppercase xl:inline">
            Command center · Design option 2
          </span>

          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <HudReadouts />
            <SoundControls />
            <Link
              href={v2Paths.hub}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--v2-mint)"
            >
              <LayoutGrid aria-hidden className="size-3.5" />
              <span className="sr-only sm:not-sr-only">All designs</span>
            </Link>
          </div>
        </motion.header>

        <main className="relative z-10 flex flex-1 flex-col">{children}</main>

        <div aria-hidden className="relative z-10 hidden h-8 shrink-0 items-center overflow-hidden border-t border-(--v2-line) bg-(--v2-bg)/75 md:flex">
          <div className={cn(styles.ticker, "font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70 uppercase")}>
            {[0, 1].map((copy) => (
              <span key={copy} className="flex shrink-0">
                {TICKER.map((item) => (
                  <span key={item} className="flex items-center gap-4 pr-4">
                    <span className={item.startsWith("0") || item.startsWith("1") ? "text-(--v2-amber)/70" : undefined}>{item}</span>
                    <span className="text-(--v2-mint)/60">▸</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
