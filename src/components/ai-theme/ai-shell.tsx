"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { Logo } from "@/components/shared/brand";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { NeuralBackground } from "./neural-background";
import { EASE_OUT, animatedLinkClass } from "./presets";
import styles from "./ai-theme.module.css";

/**
 * Dark AI-themed frame shared by sign-in, sign-up and onboarding: neural-network
 * background, header and footer. It stays mounted while moving between those pages,
 * so the background keeps running and only the content changes.
 */
export function AiShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(styles.root, "dark relative isolate min-h-dvh overflow-hidden text-foreground")}>
        <NeuralBackground />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="flex h-16 items-center justify-between px-4 sm:px-8"
          >
            <Logo href={routes.home} />
            <Link href={routes.home} className={cn(animatedLinkClass, "text-sm font-normal text-muted-foreground hover:text-foreground")}>
              Back to home
            </Link>
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
