"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Logo } from "@/components/shared/brand";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { v3Paths } from "./paths";
import { minimalSound } from "./sound";
import { SoundControls } from "./sound-controls";
import { TechBackground } from "./tech-background";
import { EASE } from "./ui";
import styles from "./minimal.module.css";

/**
 * Frame for the Design Option 3 sample (sign-up and onboarding): calm tech backdrop and a light header
 * with the sound switches. It stays mounted between the two pages, so sound carries on; leaving the
 * sample fades it out.
 */
export function MinimalShell({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    minimalSound.resumeIfWanted();
    return () => minimalSound.shutdown();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(styles.root, "dark relative isolate flex min-h-dvh flex-col overflow-hidden text-foreground")}>
        <TechBackground />

        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-3 px-5 sm:px-8"
        >
          <Logo href={routes.home} />
          <div className="flex items-center gap-2 sm:gap-4">
            <SoundControls />
            <Link
              href={v3Paths.hub}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--v3-blue)"
            >
              <LayoutGrid aria-hidden className="size-3.5" />
              <span className="sr-only sm:not-sr-only">All designs</span>
            </Link>
          </div>
        </motion.header>

        <main className="relative z-10 flex flex-1 flex-col">{children}</main>
      </div>
    </MotionConfig>
  );
}
