"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Logo } from "@/components/shared/brand";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ambientSound } from "./ambient-sound";
import { CodeBackground } from "./code-background";
import { NeuralBackground } from "./neural-background";
import { EASE_OUT, animatedLinkClass } from "./presets";
import { SoundToggle } from "./sound-toggle";
import styles from "./ai-theme.module.css";

/** Sign-up and onboarding get the coding layer and background sound; sign-in keeps the plain neural theme. */
function isCodingJourney(pathname: string) {
  return pathname === routes.signUp || pathname.startsWith(routes.onboarding);
}

/**
 * Dark AI-themed frame shared by sign-in, sign-up and onboarding: neural-network
 * background, header and footer. It stays mounted while moving between those pages,
 * so the background (and any sound) keeps running and only the content changes.
 */
export function AiShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const coding = isCodingJourney(pathname);

  // Sound belongs to sign-up and onboarding: bring it back if the visitor turned it on earlier,
  // and fade it out on sign-in or when they leave these pages.
  React.useEffect(() => {
    if (!coding) return;
    ambientSound.resumeIfWanted();
    return () => ambientSound.stop();
  }, [coding]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(styles.root, "dark relative isolate min-h-dvh overflow-hidden text-foreground")}>
        <NeuralBackground />
        <AnimatePresence>
          {coding && <CodeBackground key="code" contentWidth={pathname === routes.signUp ? 1152 : 1024} />}
        </AnimatePresence>

        <div className="relative z-10 flex min-h-dvh flex-col">
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="flex h-16 items-center justify-between px-4 sm:px-8"
          >
            <Logo href={routes.home} />
            <div className="flex items-center gap-4 sm:gap-6">
              <AnimatePresence>{coding && <SoundToggle key="sound" />}</AnimatePresence>
              <Link href={routes.home} className={cn(animatedLinkClass, "text-sm font-normal text-muted-foreground hover:text-foreground")}>
                Back to home
              </Link>
            </div>
          </motion.header>

          <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8">{children}</main>

          <footer className="px-4 py-6 text-center text-xs text-muted-foreground">
            Need help? Write to support@edgecareer.example
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
