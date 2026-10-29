"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const TABS = [
  { href: routes.signIn, label: "Sign in" },
  { href: routes.signUp, label: "Create account" },
];

/** Switch between sign-in and sign-up. The highlight slides to the active page. */
export function AuthTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Sign in or create an account" className="mb-7 grid grid-cols-2 rounded-lg border border-border/60 bg-background/40 p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative isolate flex h-8 items-center justify-center rounded-md text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-(--ec-cyan)/40",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="auth-tab-highlight"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-md bg-card shadow-[0_0_0_1px_color-mix(in_oklch,var(--ec-blue)_45%,transparent),0_6px_20px_-10px_var(--ec-blue)]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
