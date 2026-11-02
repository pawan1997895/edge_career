"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Logo } from "@/components/shared/brand";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { v4Paths } from "./paths";
import { studioSound } from "./sound";
import { SoundToggle } from "./sound-toggle";
import { StudioBackground } from "./studio-background";
import { EASE } from "./ui";
import styles from "./studio.module.css";

/**
 * Frame for the Design Option 4 sample (sign-up and onboarding): light studio backdrop and a header
 * with the sound switches. It stays mounted between the two pages, so sound carries on; leaving the
 * sample fades it out.
 */
export function StudioShell({ fontClassName, children }: { fontClassName: string; children: React.ReactNode }) {
  React.useEffect(() => {
    studioSound.resumeIfWanted();
    return () => studioSound.shutdown();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(styles.root, fontClassName, "relative isolate flex min-h-dvh flex-col overflow-hidden")}>
        <StudioBackground />

        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-3 px-5 sm:px-8"
        >
          <Logo href={routes.home} />
          <div className="flex items-center gap-2 sm:gap-3">
            <SoundToggle />
            <Link
              href={v4Paths.hub}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-(--v4-muted) outline-none hover:text-(--v4-ink) focus-visible:ring-4 focus-visible:ring-(--v4-indigo)/20"
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
