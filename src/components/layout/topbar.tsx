"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ClipboardCheck,
  CreditCard,
  Grid3x3,
  LogOut,
  Menu,
  Mic,
  Search,
  Settings,
  Shield,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip } from "@/components/ui/tooltip";
import { SearchDialog } from "@/components/layout/search-dialog";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { ShellVariant } from "@/components/layout/app-shell";
import { notifications } from "@/mocks/notifications";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

export function Topbar({
  variant,
  user,
  mobileOpen,
  onMobileOpenChange,
  mobileNav,
}: {
  variant: ShellVariant;
  user: User;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  mobileNav: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open navigation" onClick={() => onMobileOpenChange(true)}>
          <Menu />
        </Button>
        <SheetContent side="left" className="w-64 gap-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {mobileNav}
        </SheetContent>
      </Sheet>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex h-8 w-full max-w-xs items-center gap-2 rounded-md border bg-card px-2.5 text-[13px] text-muted-foreground shadow-xs hover:bg-accent/50"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">{variant === "admin" ? "Search admin…" : "Search lessons, problems, pages…"}</span>
        <kbd className="hidden rounded border bg-muted px-1.5 font-sans text-[10px] sm:inline">Ctrl K</kbd>
      </button>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} variant={variant} />

      <div className="ml-auto flex items-center gap-1">
        <Tooltip content="All screens (review index)">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={routes.screens} aria-label="All screens">
              <Grid3x3 />
            </Link>
          </Button>
        </Tooltip>
        <ThemeToggle />
        <NotificationsMenu />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

function NotificationsMenu() {
  const unread = notifications.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Notifications, ${unread} unread`} className="relative">
          <Bell />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button className="text-xs text-primary hover:underline">Mark all as read</button>
        </div>
        <ul className="max-h-96 divide-y overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id}>
              <Link href={n.href} className="flex gap-3 px-4 py-3 hover:bg-accent/50">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{n.title}</span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">{n.body}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{formatRelative(n.at)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t px-4 py-2.5 text-center">
          <Link href={routes.settings} className="text-xs text-muted-foreground hover:text-foreground">
            Notification settings
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-1 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40" aria-label="Account menu">
          <Avatar name={user.name} src={user.avatarUrl} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.profile}>
            <UserIcon /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.settings}>
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.billing}>
            <CreditCard /> Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.pricing}>
            <Sparkles /> Upgrade plan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.interviews}>
            <Mic /> {user.interviewMinutesLeft} interview minutes left
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.assessments}>
            <ClipboardCheck /> Appeals and reviews
          </Link>
        </DropdownMenuItem>
        {user.role !== "learner" && (
          <DropdownMenuItem asChild>
            <Link href={routes.admin.overview}>
              <Shield /> Admin console
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.signIn}>
            <LogOut /> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
