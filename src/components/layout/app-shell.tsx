"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Mic, Shield } from "lucide-react";
import { Logo } from "@/components/shared/brand";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Topbar } from "@/components/layout/topbar";
import { activeNavHref, adminNav, learnerNav, type NavSection } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import { PLAN_LABELS } from "@/types/user";

export type ShellVariant = "learner" | "admin";

/** Sidebar + top bar layout shared by the learner app and the admin console. */
export function AppShell({ variant, user, children }: { variant: ShellVariant; user: User; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent variant={variant} user={user} />
      </aside>
      <div className="lg:pl-60">
        <Topbar
          variant={variant}
          user={user}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
          mobileNav={<SidebarContent variant={variant} user={user} />}
        />
        <main id="main">{children}</main>
      </div>
    </div>
  );
}

export function SidebarContent({ variant, user }: { variant: ShellVariant; user: User }) {
  const pathname = usePathname();
  const sections: NavSection[] = variant === "admin" ? adminNav : learnerNav;
  const activeHref = activeNavHref(sections, pathname);

  return (
    <div className="flex h-full flex-col text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <Logo href={variant === "admin" ? routes.admin.overview : routes.dashboard} />
        {variant === "admin" && (
          <Badge variant="secondary" className="ml-auto">
            Admin
          </Badge>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
        {sections.map((section, i) => (
          <div key={section.title ?? i} className={cn(i > 0 && "mt-5")}>
            {section.title && (
              <p className="mb-1.5 px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{section.title}</p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-8 items-center gap-2.5 rounded-md px-2 text-[13.5px] transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/60 hover:text-foreground",
                      )}
                    >
                      <item.icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <span className="rounded-full bg-primary/12 px-1.5 text-[11px] font-medium text-primary tabular-nums">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        {variant === "learner" ? (
          <div className="space-y-3">
            <Link href={routes.billing} className="block rounded-md border bg-card p-3 hover:bg-accent/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{PLAN_LABELS[user.plan]} plan</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Mic className="size-3" /> {user.interviewMinutesLeft} min left
                </span>
              </div>
              <Progress
                className="mt-2"
                value={(user.interviewMinutesLeft / user.interviewMinutesTotal) * 100}
                aria-label="Interview minutes left"
              />
            </Link>
            {user.role !== "learner" && (
              <Link
                href={routes.admin.overview}
                className="flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              >
                <Shield className="size-4" /> Admin console
              </Link>
            )}
          </div>
        ) : (
          <Link
            href={routes.dashboard}
            className="flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to learner app
          </Link>
        )}
      </div>
    </div>
  );
}
